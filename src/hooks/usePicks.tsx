import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useAuth, type Profile } from "@/hooks/useAuth";

export interface Pick {
  user_id: string;
  set_id: string;
}

interface PicksContextValue {
  picks: Pick[];
  profilesById: Record<string, Profile>;
  picksBySet: Record<string, string[]>; // set_id -> user_ids
  myPickIds: Set<string>;
  loading: boolean;
  togglePick: (set_id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const PicksContext = React.createContext<PicksContextValue | null>(null);

export function PicksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [picks, setPicks] = React.useState<Pick[]>([]);
  const [profilesById, setProfilesById] = React.useState<Record<string, Profile>>({});
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    if (!user) {
      setPicks([]);
      setProfilesById({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const [picksRes, profilesRes] = await Promise.all([
      supabase.from("picks").select("user_id, set_id"),
      supabase.from("profiles").select("id, display_name, color"),
    ]);
    if (picksRes.data) setPicks(picksRes.data);
    if (profilesRes.data) {
      setProfilesById(
        Object.fromEntries(profilesRes.data.map((p) => [p.id, p])),
      );
    }
    setLoading(false);
  }, [user]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const picksBySet = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const p of picks) {
      (map[p.set_id] ??= []).push(p.user_id);
    }
    return map;
  }, [picks]);

  const myPickIds = React.useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(picks.filter((p) => p.user_id === user.id).map((p) => p.set_id));
  }, [picks, user]);

  const togglePick = React.useCallback(
    async (set_id: string) => {
      if (!user) return;
      const has = myPickIds.has(set_id);
      if (has) {
        setPicks((prev) =>
          prev.filter((p) => !(p.user_id === user.id && p.set_id === set_id)),
        );
        const { error } = await supabase
          .from("picks")
          .delete()
          .eq("user_id", user.id)
          .eq("set_id", set_id);
        if (error) await refresh();
      } else {
        setPicks((prev) => [...prev, { user_id: user.id, set_id }]);
        const { error } = await supabase.from("picks").insert({
          user_id: user.id,
          set_id,
        });
        if (error) await refresh();
      }
    },
    [user, myPickIds, refresh],
  );

  const value: PicksContextValue = {
    picks,
    profilesById,
    picksBySet,
    myPickIds,
    loading,
    togglePick,
    refresh,
  };

  return <PicksContext.Provider value={value}>{children}</PicksContext.Provider>;
}

export function usePicks() {
  const ctx = React.useContext(PicksContext);
  if (!ctx) throw new Error("usePicks must be used inside PicksProvider");
  return ctx;
}
