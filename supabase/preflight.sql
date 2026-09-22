-- Read-only preflight. Run against the target project before applying migrations.

select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('cities', 'faqs', 'transparency_documents', 'authorized_users')
order by table_name, ordinal_position;

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_catalog.pg_policies
where schemaname = 'public'
  and tablename in ('cities', 'faqs', 'transparency_documents', 'authorized_users')
order by tablename, policyname;

select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('cities', 'faqs', 'transparency_documents', 'authorized_users')
  and grantee in ('anon', 'authenticated', 'PUBLIC')
order by table_name, grantee, privilege_type;

select routine_name, grantee, privilege_type
from information_schema.role_routine_grants
where routine_schema = 'public'
  and routine_name in ('claim_authorized_user', 'is_authorized', 'can_edit_content', 'can_delete_content')
order by routine_name, grantee;

select lower(btrim(email)) as normalized_email, count(*)
from public.authorized_users
group by lower(btrim(email))
having count(*) > 1;

select user_id, count(*)
from public.authorized_users
where user_id is not null
group by user_id
having count(*) > 1;
