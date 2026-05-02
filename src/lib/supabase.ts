import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string; color: string; created_at: string };
        Insert: { id: string; display_name: string; color?: string };
        Update: Partial<{ display_name: string; color: string }>;
        Relationships: [];
      };
      picks: {
        Row: { user_id: string; set_id: string; created_at: string };
        Insert: { user_id: string; set_id: string };
        Update: Partial<{ user_id: string; set_id: string }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in.",
  );
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  url ?? "",
  key ?? "",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
