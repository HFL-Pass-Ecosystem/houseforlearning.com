-- LMS tables (run once in Supabase SQL Editor, after schema.sql). Safe to run again.
-- All access goes through netlify/functions/lms.mjs with the service key; the browser never touches these tables.

alter table public.members add column if not exists role text not null default 'learner';  -- learner | facilitator | admin
alter table public.members add column if not exists email text;
update public.members m set email = u.email from auth.users u where u.id = m.id and m.email is null;

create or replace function public.handle_new_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.members (id, full_name, email) values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end $$;

create table if not exists public.lms_enrolments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_key text not null,                 -- the course page file name, e.g. cpd-designing-a-repeatable-test.html
  title text not null,
  total int not null default 1,             -- number of units (modules, lessons or steps)
  done jsonb not null default '[]'::jsonb,  -- unit numbers ticked done
  last_unit int,                            -- where to resume
  status text not null default 'active',    -- active | completed
  pay_method text,                          -- bank | upi
  pay_ref text,
  pay_status text not null default 'test_paid',  -- test_paid now; paid when real payments go live
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_key)
);
create table if not exists public.lms_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_key text not null,
  score int not null, max int not null, pct int not null, passed boolean not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.lms_certificates (
  code text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_key text not null,
  title text not null, holder text not null, pct int not null,
  issued_at timestamptz not null default now(),
  unique (user_id, course_key)
);
create table if not exists public.lms_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null, body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists lms_attempts_user on public.lms_attempts (user_id, course_key);
create index if not exists lms_notes_user on public.lms_notifications (user_id, read);

-- locked down: no policy means the browser (anon key) can read nothing; only the service key used by the function can.
alter table public.lms_enrolments enable row level security;
alter table public.lms_attempts enable row level security;
alter table public.lms_certificates enable row level security;
alter table public.lms_notifications enable row level security;

-- To make someone a facilitator or admin (sees the Reports page):
--   update public.members set role = 'facilitator' where email = 'name@example.com';
