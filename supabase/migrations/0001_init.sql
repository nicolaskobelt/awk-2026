-- Awakenings 2026 friend schedule schema

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  color text not null default '#ff2d75',
  created_at timestamptz not null default now()
);

create table if not exists public.picks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  set_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, set_id)
);

create index if not exists picks_set_id_idx on public.picks (set_id);

alter table public.profiles enable row level security;
alter table public.picks enable row level security;

-- Profiles: any authenticated user can read; user can insert/update only own row.
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Picks: any authenticated user can read; user can insert/delete only their own.
drop policy if exists "picks read" on public.picks;
create policy "picks read"
  on public.picks for select
  to authenticated
  using (true);

drop policy if exists "picks insert self" on public.picks;
create policy "picks insert self"
  on public.picks for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "picks delete self" on public.picks;
create policy "picks delete self"
  on public.picks for delete
  to authenticated
  using (auth.uid() = user_id);
