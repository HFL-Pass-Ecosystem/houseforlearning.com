-- Passkeys (Face ID, Touch ID, fingerprint, device PIN). Only the PUBLIC key is kept; the private key stays on the person's device.
-- Only the site's own server (service key) can read or write it: row security is on and there are no public policies.
create table if not exists public.passkeys (
  id text primary key,                 -- the passkey's credential id (base64url)
  user_id text not null,               -- Supabase user id
  email text not null,
  public_key text not null,            -- public key as JSON (JWK)
  counter bigint not null default 0,
  label text not null default 'My device',
  created_at timestamptz not null default now(),
  last_used timestamptz
);
alter table public.passkeys enable row level security;
create index if not exists passkeys_user on public.passkeys (user_id);
