-- Voice feedback notes (Yoga page). Run once in the Supabase SQL editor.
-- Nobody can read or write this table from the browser: only the Netlify function (service key) can.
create table if not exists public.voice_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ref text not null unique,
  item text, kind text, page text, site text,
  mime text, seconds smallint,
  audio_b64 text not null,
  status text not null default 'new' check (status in ('new','reviewed','approved','declined')),
  decision_note text,
  reviewed_at timestamptz
);
alter table public.voice_feedback enable row level security;   -- no policies = no browser access
create index if not exists voice_feedback_status_idx on public.voice_feedback (status, created_at desc);
