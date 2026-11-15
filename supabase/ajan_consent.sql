-- Ajan SNS welcome page: one row per person who ticks and continues. Run once in the Supabase SQL editor.
-- Only the site's own server (service key) can read or write it: row security is on and there are no public policies.
create table if not exists public.ajan_consent (
  id bigint generated always as identity primary key,
  client_id text not null check (client_id ~ '^[a-f0-9]{32}$'),
  email text,
  terms_version text not null,
  adult_professional boolean not null,
  marketing_opt_in boolean not null default false,
  interests text[] not null default '{}',
  skipped_interests boolean not null default false,
  accepted_at timestamptz not null default now(),
  user_agent text
);
alter table public.ajan_consent enable row level security;
create index if not exists ajan_consent_client on public.ajan_consent (client_id, accepted_at desc);
