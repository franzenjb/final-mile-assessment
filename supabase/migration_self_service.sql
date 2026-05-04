-- Migration: self-service editing for any @redcross.org user.
-- Replaces the per-region editor allowlist (region_editors) with a JWT email-domain check.
-- Admins still have full access via is_admin().
-- Apply once in the Supabase SQL editor (idempotent).

create or replace function public.is_redcross_user()
returns boolean
language sql stable
as $$
  select coalesce(lower(auth.jwt()->>'email'), '') like '%@redcross.org'
$$;

-- regional_plans
drop policy if exists "editors can read" on public.regional_plans;
drop policy if exists "editors can insert" on public.regional_plans;
drop policy if exists "editors can update" on public.regional_plans;

create policy "redcross can read" on public.regional_plans
for select using (public.is_admin() or public.is_redcross_user());

create policy "redcross can insert" on public.regional_plans
for insert with check (public.is_admin() or public.is_redcross_user());

create policy "redcross can update" on public.regional_plans
for update using (public.is_admin() or public.is_redcross_user())
with check (public.is_admin() or public.is_redcross_user());

-- plan_history
drop policy if exists "history visible to editors and admins" on public.plan_history;

create policy "redcross can read history" on public.plan_history
for select using (public.is_admin() or public.is_redcross_user());
