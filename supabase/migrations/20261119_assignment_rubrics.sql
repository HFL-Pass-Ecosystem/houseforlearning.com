-- Assessment-first assignment and rubric layer for HFL LMS.
-- Run after supabase/lms.sql. No direct browser grants: the server function uses the service key.
create table if not exists public.lms_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  directions text not null,
  outcomes jsonb not null default '[]'::jsonb,
  rubric jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'changes', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lms_assignments add column if not exists review_note text not null default '';
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
