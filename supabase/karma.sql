-- Karma points (in the spirit of Karma Yoga: points honour right action and effort, not results alone).
-- One row per point award. Each member earns each (action, ref) once. Only the server (service key) writes here.
-- member_id holds the shared member ID across the six sites once it is issued; until then email links the rows.
create table if not exists public.karma_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  member_id text,
  site text not null default 'houseforlearning.com',
  action text not null,
  ref text not null,
  points integer not null check (points > 0 and points <= 100),
  label text,
  unique (email, action, ref)
);
create index if not exists karma_events_email_time on public.karma_events (email, created_at desc);

alter table public.karma_events enable row level security;
-- a member may read only their own points; nobody writes from the browser
drop policy if exists "own karma read" on public.karma_events;
create policy "own karma read" on public.karma_events for select using (auth.uid() = user_id);
