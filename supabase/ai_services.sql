-- AI service picker (staff toolbox). Run once in the Supabase SQL editor.
-- Keys are stored ENCRYPTED (AES-256-GCM, secret AI_KEYS_SECRET kept in Netlify settings).
-- Row level security is ON with no policies, so only the server (service key) can read or write.
create table if not exists public.ai_services_saved (
  name text primary key,
  website text not null default '',
  provider text not null default 'none',   -- openai | gemini | anthropic | none
  env text not null default '',            -- token/key name
  base_url text not null default '',
  model text not null default '',
  coupon text not null default '',
  key_enc text not null default '',        -- iv.tag.cipher, base64url; empty = no key yet
  updated_by text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.ai_services_saved enable row level security;
