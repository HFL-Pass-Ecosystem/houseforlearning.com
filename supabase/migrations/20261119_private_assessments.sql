-- Built-in answer keys are private database records, not public static assets.
-- Do not seed this table with the legacy values formerly committed in quizkeys.json;
-- those values must be replaced by newly authored and reviewed assessment versions.
begin;

create table if not exists public.lms_quiz_bank (
  course_key text primary key,
  assessment jsonb not null default '{"questions":[]}'::jsonb,
  answer_key text not null check (answer_key ~ '^[0-5]{1,60}
  version text not null default 'v1' check (length(version) between 1 and 80),
  active boolean not null default true,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lms_quiz_bank add column if not exists assessment jsonb not null default '{"questions":[]}'::jsonb;
alter table public.lms_quiz_bank enable row level security;

alter table public.lms_attempts
  add column if not exists assessment_version text not null default 'legacy';

commit;
),
  version text not null default 'v1' check (length(version) between 1 and 80),
  active boolean not null default true,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lms_quiz_bank enable row level security;

alter table public.lms_attempts
  add column if not exists assessment_version text not null default 'legacy';

commit;
