-- Review in the target Instituto Recicla Mais project before applying.
-- This migration changes only authorization helpers and RLS policies for the four supplied tables.

create or replace function public.is_authorized()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.authorized_users
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
    select 1
      from public.authorized_users
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
    select 1
      from public.authorized_users
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
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if auth.uid() is null or current_email = '' then
    return false;
  end if;

  update public.authorized_users
     set user_id = auth.uid(), updated_at = now()
   where lower(email) = current_email
     and is_active = true
     and role in ('admin', 'editor', 'viewer')
     and (user_id is null or user_id = auth.uid());

  return exists (
    select 1
      from public.authorized_users
     where user_id = auth.uid()
       and lower(email) = current_email
       and is_active = true
       and role in ('admin', 'editor', 'viewer')
  );
end;
$$;

revoke all on function public.is_authorized() from public;
revoke all on function public.can_edit_content() from public;
revoke all on function public.can_delete_content() from public;
revoke all on function public.claim_authorized_user() from public;
grant execute on function public.is_authorized() to authenticated;
grant execute on function public.can_edit_content() to authenticated;
grant execute on function public.can_delete_content() to authenticated;
grant execute on function public.claim_authorized_user() to authenticated;

alter table public.cities enable row level security;
alter table public.faqs enable row level security;
alter table public.transparency_documents enable row level security;
alter table public.authorized_users enable row level security;

-- These names are project-specific so the migration does not remove unknown existing policies.
-- Inspect pg_policies first and remove any pre-existing policy that grants broader writes.
drop policy if exists "site public read cities" on public.cities;
create policy "site public read cities" on public.cities
  for select to anon, authenticated using (true);
drop policy if exists "site editors insert cities" on public.cities;
create policy "site editors insert cities" on public.cities
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists "site editors update cities" on public.cities;
create policy "site editors update cities" on public.cities
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists "site admins delete cities" on public.cities;
create policy "site admins delete cities" on public.cities
  for delete to authenticated using (public.can_delete_content());

drop policy if exists "site public read faqs" on public.faqs;
create policy "site public read faqs" on public.faqs
  for select to anon, authenticated using (true);
drop policy if exists "site editors insert faqs" on public.faqs;
create policy "site editors insert faqs" on public.faqs
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists "site editors update faqs" on public.faqs;
create policy "site editors update faqs" on public.faqs
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists "site admins delete faqs" on public.faqs;
create policy "site admins delete faqs" on public.faqs
  for delete to authenticated using (public.can_delete_content());

drop policy if exists "site public read transparency documents" on public.transparency_documents;
create policy "site public read transparency documents" on public.transparency_documents
  for select to anon, authenticated using (true);
drop policy if exists "site editors insert transparency documents" on public.transparency_documents;
create policy "site editors insert transparency documents" on public.transparency_documents
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists "site editors update transparency documents" on public.transparency_documents;
create policy "site editors update transparency documents" on public.transparency_documents
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists "site admins delete transparency documents" on public.transparency_documents;
create policy "site admins delete transparency documents" on public.transparency_documents
  for delete to authenticated using (public.can_delete_content());

drop policy if exists "site authorized user reads own record" on public.authorized_users;
create policy "site authorized user reads own record" on public.authorized_users
  for select to authenticated
  using (user_id = (select auth.uid()) and is_active = true and role in ('admin', 'editor', 'viewer'));
