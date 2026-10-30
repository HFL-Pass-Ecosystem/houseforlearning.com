-- Sign in on one device, finish on the other. Holds a pending sign-in for a few minutes, then it is removed.
-- Only the site's own server (service key) can read or write it: row security is on and there are no public policies.
create table if not exists public.signin_handoff (
  wait_id text primary key check (wait_id ~ '^[a-f0-9]{32}$'),
  access_token text not null,
  refresh_token text not null default '',
  created_at timestamptz not null default now()
);
alter table public.signin_handoff enable row level security;
create index if not exists signin_handoff_created on public.signin_handoff (created_at);
