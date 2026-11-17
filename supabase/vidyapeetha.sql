-- HFL Vidyapeetha: credits, verified tutors (police clearance), random audits, complaints protocol, verifiable badges.
-- Run once in Supabase SQL Editor, AFTER schema.sql and lms.sql. Safe to run again.
-- All access goes through netlify/functions/vidyapeetha.mjs with the service key; the browser never touches these tables.
-- Desk staff = members.role 'moderator', 'facilitator' or 'admin'.

-- Credit value of a course (1 credit = 30 learning hours). Courses not listed here carry no credit yet.
create table if not exists public.vp_course_credits (
  course_key text primary key,              -- e.g. course-eu-01.html or author-<20 hex>.html
  title text not null default '',
  credits int not null check (credits between 1 and 30),
  offering text not null default 'B',       -- A = programme module, B = lifelong short course, C = skill credential
  programme text not null default '',       -- programme name for offering A
  set_by uuid, updated_at timestamptz not null default now()
);

-- Tutors, trainers, coaches and service providers. Nobody teaches until status = 'verified' and the police clearance is in date.
create table if not exists public.vp_tutors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null default '',
  country text not null default '',
  city text not null default '',
  area text not null default '',            -- the area of stay the police clearance must come from
  subjects text not null default '',
  languages text not null default '',
  home_visits boolean not null default false,  -- visits learners' homes: strictest rules, quarterly clearance
  id_type text not null default '',
  id_path text,                             -- private file in storage bucket vp-vault
  pcc_path text,                            -- police clearance certificate, private file
  pcc_issuer text not null default '',
  pcc_issued_on date,
  pcc_valid_until date,                     -- set by the desk; never later than issued_on + 12 months (3 months for home visits)
  ref1 text not null default '', ref2 text not null default '',
  training_pct int, training_flags int, training_at timestamptz,
  status text not null default 'applied',   -- applied | ready | verified | renewal | suspended | removed
  status_note text not null default '',
  verified_by uuid, verified_at timestamptz,
  reminded jsonb not null default '[]',     -- reminder days already sent: 60, 30, 7
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists vp_tutors_status on public.vp_tutors (status, pcc_valid_until);

-- Random and scheduled checks by our own assessors and auditors (who liaise with the police), on top of the police clearance.
create table if not exists public.vp_audits (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.vp_tutors(user_id) on delete cascade,
  kind text not null,                       -- random_home_visit | document_recheck | police_liaison | complaint_followup
  due date not null,
  result text not null default 'open',      -- open | pass | fail
  note text not null default '',
  auditor_id uuid, done_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists vp_audits_open on public.vp_audits (result, due);

-- One fixed complaints protocol: lodge, acknowledge (24 h), review (3 working days), decide, one appeal (7 days), final.
create table if not exists public.vp_cases (
  id uuid primary key default gen_random_uuid(),
  case_no text unique not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  category text not null,                   -- safety | conduct | quality | payment | other
  booking_ref text not null default '',
  tutor_id uuid,                            -- the tutor concerned, when there is one
  facts text not null,                      -- facts only, 500 characters
  evidence_path text,
  safety boolean not null default false,
  stage text not null default 'lodged',     -- lodged | review | decided | appeal | final
  decision text not null default '',        -- no_action | warning | refund | course_removed | suspended | removed
  decision_note text not null default '',
  appeal_text text not null default '',
  decided_by uuid, decided_at timestamptz, appealed_at timestamptz, closed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists vp_cases_stage on public.vp_cases (stage, created_at);
create index if not exists vp_cases_reporter on public.vp_cases (reporter_id);

-- Verifiable badges: each record carries a hash of its content and the previous record's hash, so any change breaks the chain.
create table if not exists public.vp_badges (
  code text primary key,                    -- HB-XXXX-XXXX
  seq bigserial unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,                       -- course | skill | humi | tutor
  title text not null,
  holder text not null,
  course_key text not null default '',
  credits int not null default 0,
  issued_at timestamptz not null default now(),
  prev_hash text not null,
  hash text not null unique,
  revoked boolean not null default false,
  unique (user_id, kind, course_key)
);

-- Exam integrity: every final check can carry its proctoring log.
alter table public.lms_attempts add column if not exists integrity jsonb;

alter table public.vp_course_credits enable row level security;
alter table public.vp_tutors enable row level security;
alter table public.vp_audits enable row level security;
alter table public.vp_cases enable row level security;
alter table public.vp_badges enable row level security;

-- Private file vault for ID, police clearance and complaint evidence: PDF, JPG or PNG, 5 MB at most. Not public.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vp-vault', 'vp-vault', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- To make someone a desk moderator:
--   update public.members set role = 'moderator' where email = 'name@example.com';
