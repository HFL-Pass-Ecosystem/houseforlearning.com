-- Assessment-first assignment and rubric layer for HFL LMS.
-- Run after the core supabase/lms.sql schema. No direct browser grants: the server function uses the service key.
alter table public.lms_certificates add column if not exists issuer_key text not null default 'house-for-learning';
alter table public.lms_certificates add column if not exists issuer_name text not null default 'House for Learning';
alter table public.lms_certificates add column if not exists issuer_domain text not null default 'houseforlearning.com';
create table if not exists public.lms_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  directions text not null,
  outcomes jsonb not null default '[]'::jsonb,
  rubric jsonb not null default '[]'::jsonb,
  certificate_required boolean not null default false,
  pass_percent integer not null default 70 check (pass_percent between 1 and 100),
  status text not null default 'draft' check (status in ('draft', 'review', 'changes', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lms_assignments add column if not exists review_note text not null default '';
alter table public.lms_assignments add column if not exists certificate_required boolean not null default false;
alter table public.lms_assignments add column if not exists pass_percent integer not null default 70 check (pass_percent between 1 and 100);
create index if not exists lms_assignments_course on public.lms_assignments (course_id, status, created_at);

create table if not exists public.lms_assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.lms_assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  attempt int not null check (attempt > 0),
  response text not null,
  evidence_url text not null default '',
  rubric_scores jsonb not null default '[]'::jsonb,
  feedback text not null default '',
  score numeric,
  max_points numeric,
  status text not null default 'submitted' check (status in ('submitted', 'graded')),
  grader_id uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  unique (assignment_id, user_id, attempt)
);
create index if not exists lms_assignment_submissions_latest on public.lms_assignment_submissions (assignment_id, user_id, attempt desc);
create index if not exists lms_assignment_submissions_queue on public.lms_assignment_submissions (assignment_id, status, submitted_at);

alter table public.lms_assignments enable row level security;
alter table public.lms_assignment_submissions enable row level security;
-- Deliberately no anon/authenticated policies. Read and write stay inside netlify/functions/assignments.mjs.
