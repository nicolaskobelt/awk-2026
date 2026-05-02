# Awakenings 2026 — Friends Schedule

A small private React + Supabase app for friends to plan which DJs to see at Awakenings 2026, and to see each other's picks.

- Day tabs (Fri / Sat / Sun) with a colored grid (time × stage)
- Magic-link sign-in (email)
- Each friend picks a display name + color
- Click any DJ block to add it to your schedule
- Each block shows colored chips for the friends going; click to see the full list
- Filter the grid by **My picks** or by a specific friend

Tech: Vite, React 19, TypeScript, Tailwind, shadcn/ui (Radix), Supabase (Postgres + Auth + RLS).

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Supabase setup

1. Create a project at <https://supabase.com>.
2. In **Authentication → Providers**, enable **Email** and turn on magic-link.
   In **Authentication → URL Configuration**, add your local URL (`http://localhost:5173`) and your production URL (e.g. the Vercel preview / prod domain) to the allowed redirect URLs.
3. Run the SQL migration in `supabase/migrations/0001_init.sql` against your project (SQL editor or `supabase db push`). It creates the `profiles` and `picks` tables and the RLS policies (any authenticated user can read; users can only modify their own rows).
4. Copy your project URL and the **anon** public key into `.env.local`.

## Data model

Sets are static (defined in `src/data/schedule.ts`). Each set gets a stable string ID like `friday-area-v-1500-saidah`.

```
profiles(id uuid PK, display_name text, color text, created_at)
picks(user_id uuid, set_id text, created_at, primary key (user_id, set_id))
```

Both tables have RLS:

- `select`: any authenticated user
- `insert`/`update`/`delete`: only the owning user

## Deploying

Currently set up to deploy to Vercel:

```bash
# pre-flight: ensure these env vars are set in the Vercel project
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_ANON_KEY
npm run build
```

Set the deployed URL as an additional **Site URL / Redirect URL** in Supabase
auth so magic links land on the right place.

## Scripts

| Script        | What it does                            |
|---------------|-----------------------------------------|
| `npm run dev` | Vite dev server                         |
| `npm run build` | Type-check + production build         |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | TypeScript no-emit check            |
