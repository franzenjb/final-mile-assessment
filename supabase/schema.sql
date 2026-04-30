-- Run this in the Supabase SQL editor for your new project.
-- It creates the regional_plans table, an admins table, and Row Level Security
-- so each user only sees their own plan, while admins can see everything.

create extension if not exists "pgcrypto";

create table if not exists public.regional_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  region_id text not null,
  region_name text not null,
  values jsonb not null default '{}'::jsonb,
  status text not null default 'draft', -- draft | submitted | reviewed
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, region_id)
);

create index if not exists regional_plans_region_idx on public.regional_plans (region_id);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists regional_plans_touch on public.regional_plans;
create trigger regional_plans_touch
before update on public.regional_plans
for each row execute function public.touch_updated_at();

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  added_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

alter table public.regional_plans enable row level security;
alter table public.admins enable row level security;

drop policy if exists "owner can read" on public.regional_plans;
create policy "owner can read" on public.regional_plans
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "owner can insert" on public.regional_plans;
create policy "owner can insert" on public.regional_plans
for insert with check (auth.uid() = user_id);

drop policy if exists "owner can update" on public.regional_plans;
create policy "owner can update" on public.regional_plans
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "owner can delete" on public.regional_plans;
create policy "owner can delete" on public.regional_plans
for delete using (auth.uid() = user_id);

drop policy if exists "admins read all" on public.admins;
create policy "admins read all" on public.admins
for select using (public.is_admin());

-- Bootstrap your first admin manually after sign-in:
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'jbf@jbf.com';
