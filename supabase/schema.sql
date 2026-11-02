-- House for Learning database (Supabase, free plan). Paste this into Supabase > SQL Editor > Run.
-- Only the site's own server code (Netlify functions, using the service key) can read or write.
-- Row Level Security is on with no public policies, so the public key can do nothing.

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ref text not null unique,
  name text, email text, topic text,
  message text not null,
  page text, site text,
  status text not null default 'new' check (status in ('new','replied','closed'))
);

create table if not exists public.opinions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ref text not null unique,
  rating smallint check (rating between 1 and 5),
  comment text, page text, site text
);

-- members: one row per person who signs up (linked to Supabase Auth users)
create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  plan text not null default 'free',
  learning_record jsonb not null default '{}'::jsonb
);

alter table public.messages enable row level security;
alter table public.opinions enable row level security;
alter table public.members  enable row level security;

-- a member may read and update only their own row
drop policy if exists "own row read" on public.members;
create policy "own row read" on public.members for select using (auth.uid() = id);
drop policy if exists "own row update" on public.members;
create policy "own row update" on public.members for update using (auth.uid() = id);

-- give every new sign-up a members row automatically
create or replace function public.handle_new_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.members (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_member();
