-- REVIEW REQUIRED BEFORE APPLYING.
-- Run supabase/preflight.sql against the target project first and preserve its output.
-- This migration intentionally replaces every policy on the four application tables.

-- Fail closed if duplicate authorization identities already exist.
create unique index authorized_users_email_ci_unique
  on public.authorized_users ((lower(btrim(email))));
create unique index authorized_users_user_id_unique
  on public.authorized_users (user_id)
  where user_id is not null;

create or replace function public.is_authorized()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.authorized_users
    where user_id = (select auth.uid())
      and is_active = true
      and role in ('admin', 'editor', 'viewer')
  );
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.authorized_users
    where user_id = (select auth.uid())
      and is_active = true
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.can_delete_content()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.authorized_users
    where user_id = (select auth.uid())
      and is_active = true
      and role = 'admin'
  );
$$;

create or replace function public.claim_authorized_user()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_email text := lower(btrim(coalesce((select auth.jwt() ->> 'email'), '')));
  affected integer;
begin
  if (select auth.uid()) is null or current_email = '' then
    return false;
  end if;

  update public.authorized_users
     set user_id = (select auth.uid())
   where lower(btrim(email)) = current_email
     and is_active = true
     and (user_id is null or user_id = (select auth.uid()));

  get diagnostics affected = row_count;
  if affected <> 1 then
    return false;
  end if;

  return exists (
    select 1 from public.authorized_users
    where user_id = (select auth.uid())
      and is_active = true
      and role in ('admin', 'editor', 'viewer')
  );
end;
$$;

-- CREATE OR REPLACE preserves old direct grants, so revoke every callable role explicitly.
revoke all on function public.is_authorized() from public, anon, authenticated;
revoke all on function public.can_edit_content() from public, anon, authenticated;
revoke all on function public.can_delete_content() from public, anon, authenticated;
revoke all on function public.claim_authorized_user() from public, anon, authenticated;
grant execute on function public.is_authorized() to authenticated;
grant execute on function public.can_edit_content() to authenticated;
grant execute on function public.can_delete_content() to authenticated;
grant execute on function public.claim_authorized_user() to authenticated;

alter table public.cities enable row level security;
alter table public.faqs enable row level security;
alter table public.transparency_documents enable row level security;
alter table public.authorized_users enable row level security;

-- RLS policies are permissive and OR-combined. Replace all policies on only these app tables.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
      from pg_catalog.pg_policies
     where schemaname = 'public'
       and tablename in ('cities', 'faqs', 'transparency_documents', 'authorized_users')
  loop
    execute format(
      'drop policy %I on %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end;
$$;

-- Establish table privileges explicitly. RLS remains the row-level enforcement boundary.
revoke all on table public.cities from anon, authenticated;
revoke all on table public.faqs from anon, authenticated;
revoke all on table public.transparency_documents from anon, authenticated;
revoke all on table public.authorized_users from anon, authenticated;

grant select on table public.cities, public.faqs, public.transparency_documents to anon, authenticated;
grant insert, update, delete on table public.cities, public.faqs, public.transparency_documents to authenticated;
grant select on table public.authorized_users to authenticated;

-- Grant only sequences owned by the three editable content tables.
do $$
declare
  sequence_name text;
begin
  for sequence_name in
    select distinct pg_catalog.pg_get_serial_sequence(
      format('%I.%I', table_schema, table_name),
      column_name
    )
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('cities', 'faqs', 'transparency_documents')
      and pg_catalog.pg_get_serial_sequence(
        format('%I.%I', table_schema, table_name),
        column_name
      ) is not null
  loop
    execute format('grant usage, select on sequence %s to authenticated', sequence_name);
  end loop;
end;
$$;

create policy cities_public_read on public.cities
for select to anon, authenticated using (true);
create policy cities_authorized_insert on public.cities
for insert to authenticated with check ((select public.can_edit_content()));
create policy cities_authorized_update on public.cities
for update to authenticated using ((select public.can_edit_content()))
with check ((select public.can_edit_content()));
create policy cities_admin_delete on public.cities
for delete to authenticated using ((select public.can_delete_content()));

create policy faqs_public_read on public.faqs
for select to anon, authenticated using (true);
create policy faqs_authorized_insert on public.faqs
for insert to authenticated with check ((select public.can_edit_content()));
create policy faqs_authorized_update on public.faqs
for update to authenticated using ((select public.can_edit_content()))
with check ((select public.can_edit_content()));
create policy faqs_admin_delete on public.faqs
for delete to authenticated using ((select public.can_delete_content()));

create policy transparency_public_read on public.transparency_documents
for select to anon, authenticated using (true);
create policy transparency_authorized_insert on public.transparency_documents
for insert to authenticated with check ((select public.can_edit_content()));
create policy transparency_authorized_update on public.transparency_documents
for update to authenticated using ((select public.can_edit_content()))
with check ((select public.can_edit_content()));
create policy transparency_admin_delete on public.transparency_documents
for delete to authenticated using ((select public.can_delete_content()));

create policy authorized_users_self_read on public.authorized_users
for select to authenticated
using (user_id = (select auth.uid()) and is_active = true);
