-- Migration: switch to region-scoped plans with multiple editors and version history.
-- Run this once in the Supabase SQL editor. Idempotent where possible.

-- 1. region_editors: maps editor emails to regions. Anyone whose email is in this
--    table for a given region_id can read/write that region's plan.
create table if not exists public.region_editors (
  email text not null,
  region_id text not null,
  added_at timestamptz not null default now(),
  primary key (email, region_id)
);

alter table public.region_editors enable row level security;

drop policy if exists "admins manage editors" on public.region_editors;
create policy "admins manage editors" on public.region_editors
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users see their own editor rows" on public.region_editors;
create policy "users see their own editor rows" on public.region_editors
for select using (
  exists (select 1 from auth.users u where u.id = auth.uid() and lower(u.email) = lower(region_editors.email))
);

-- 2. Update regional_plans: one row per region (drop the per-user uniqueness).
--    Add tracking for who last edited.
alter table public.regional_plans drop constraint if exists regional_plans_user_id_region_id_key;
alter table public.regional_plans add column if not exists last_edited_by_email text;
alter table public.regional_plans add column if not exists last_edited_by_name text;

-- Make region_id unique on its own.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'regional_plans_region_id_key'
  ) then
    -- if multiple rows exist for a region, keep the most recently updated and delete the rest
    delete from public.regional_plans rp
    using public.regional_plans rp2
    where rp.region_id = rp2.region_id
      and rp.updated_at < rp2.updated_at;
    alter table public.regional_plans add constraint regional_plans_region_id_key unique (region_id);
  end if;
end $$;

-- 3. plan_history: append-only snapshots before every change.
create table if not exists public.plan_history (
  id uuid primary key default gen_random_uuid(),
  region_id text not null,
  region_name text not null,
  values jsonb not null,
  status text not null default 'draft',
  edited_by_email text,
  edited_by_name text,
  snapshotted_at timestamptz not null default now()
);

create index if not exists plan_history_region_idx on public.plan_history (region_id, snapshotted_at desc);

alter table public.plan_history enable row level security;

drop policy if exists "history visible to editors and admins" on public.plan_history;
create policy "history visible to editors and admins" on public.plan_history
for select using (
  public.is_admin()
  or exists (
    select 1
    from public.region_editors re, auth.users u
    where u.id = auth.uid()
      and lower(re.email) = lower(u.email)
      and re.region_id = plan_history.region_id
  )
);

-- 4. Trigger: snapshot the OLD row to plan_history before every UPDATE.
create or replace function public.snapshot_regional_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.plan_history (region_id, region_name, values, status, edited_by_email, edited_by_name, snapshotted_at)
  values (old.region_id, old.region_name, old.values, old.status, old.last_edited_by_email, old.last_edited_by_name, old.updated_at);
  return new;
end;
$$;

drop trigger if exists regional_plans_history on public.regional_plans;
create trigger regional_plans_history
before update on public.regional_plans
for each row execute function public.snapshot_regional_plan();

-- 5. Replace RLS on regional_plans with editor-based policies.
drop policy if exists "owner can read" on public.regional_plans;
drop policy if exists "owner can insert" on public.regional_plans;
drop policy if exists "owner can update" on public.regional_plans;
drop policy if exists "owner can delete" on public.regional_plans;

create policy "editors can read" on public.regional_plans
for select using (
  public.is_admin()
  or exists (
    select 1 from public.region_editors re, auth.users u
    where u.id = auth.uid()
      and lower(re.email) = lower(u.email)
      and re.region_id = regional_plans.region_id
  )
);

create policy "editors can insert" on public.regional_plans
for insert with check (
  public.is_admin()
  or exists (
    select 1 from public.region_editors re, auth.users u
    where u.id = auth.uid()
      and lower(re.email) = lower(u.email)
      and re.region_id = regional_plans.region_id
  )
);

create policy "editors can update" on public.regional_plans
for update using (
  public.is_admin()
  or exists (
    select 1 from public.region_editors re, auth.users u
    where u.id = auth.uid()
      and lower(re.email) = lower(u.email)
      and re.region_id = regional_plans.region_id
  )
) with check (
  public.is_admin()
  or exists (
    select 1 from public.region_editors re, auth.users u
    where u.id = auth.uid()
      and lower(re.email) = lower(u.email)
      and re.region_id = regional_plans.region_id
  )
);

create policy "admins delete" on public.regional_plans
for delete using (public.is_admin());

-- 6. Add admins as editors for every region (so admins can drive any region from the main form).
insert into public.region_editors (email, region_id)
select ae.email, r.region_id
from public.admin_emails ae
cross join (
  values
    ('ct-ri'),
    ('eastern-ny'),
    ('greater-ny'),
    ('greater-pa'),
    ('massachusetts'),
    ('new-jersey'),
    ('northern-new-england'),
    ('south-eastern-pa'),
    ('western-ny')
) as r(region_id)
on conflict (email, region_id) do nothing;

-- 7. Add jeff.franzen2 to admins.
insert into public.admin_emails (email) values ('jeff.franzen2@redcross.org')
on conflict (email) do nothing;
insert into public.region_editors (email, region_id)
select 'jeff.franzen2@redcross.org', r.region_id
from (values ('ct-ri'),('eastern-ny'),('greater-ny'),('greater-pa'),('massachusetts'),('new-jersey'),('northern-new-england'),('south-eastern-pa'),('western-ny')) as r(region_id)
on conflict (email, region_id) do nothing;
