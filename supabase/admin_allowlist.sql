-- Adds an admin_emails allowlist. Anyone whose email is in this table
-- becomes an admin automatically on first sign-in.

create table if not exists public.admin_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

alter table public.admin_emails enable row level security;

-- is_admin() now checks the allowlist (case-insensitive) OR the legacy admins table.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and (
        exists (select 1 from public.admin_emails ae where lower(ae.email) = lower(u.email))
        or exists (select 1 from public.admins a where a.user_id = u.id)
      )
  );
$$;

-- Pre-authorize the Northeast Division admins:
insert into public.admin_emails (email) values
  ('jbf@jbf.com'),
  ('jim.coughlan@redcross.org'),
  ('crystal.fisher@redcross.org'),
  ('elizabeth.briand@redcross.org'),
  ('jose.garcia@redcross.org'),
  ('doug.north@redcross.org')
on conflict (email) do nothing;
