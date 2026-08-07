-- Harden helper functions (security advisors).
create or replace function public.is_coach()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'coach',
    false
  );
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.is_coach() from anon, public;
grant execute on function public.is_coach() to authenticated;
