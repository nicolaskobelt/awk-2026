import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  display_name: string;
  color: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  saveProfile: (input: { display_name: string; color: string }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadProfile = React.useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, color")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) await loadProfile(s.user.id);
      else setProfile(null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithEmail = React.useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error?.message };
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const saveProfile = React.useCallback(
    async (input: { display_name: string; color: string }) => {
      if (!session?.user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        display_name: input.display_name,
        color: input.color,
      });
      if (error) throw new Error(error.message);
      await loadProfile(session.user.id);
    },
    [session, loadProfile],
  );

  const refreshProfile = React.useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session, loadProfile]);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signInWithEmail,
    signOut,
    saveProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
