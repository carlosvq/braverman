-- Profiles mirror auth.users for app queries; role is also stored in app_metadata.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'participant'
    check (role in ('coach', 'participant')),
  created_at timestamptz not null default now(),
  invited_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index profiles_email_idx on public.profiles (email);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  results jsonb not null default '{}'::jsonb,
  dominant_nature text,
  most_deficient_nature text,
  completed_at timestamptz not null default now()
);

create index assessments_user_id_idx on public.assessments (user_id);
create index assessments_completed_at_idx on public.assessments (completed_at desc);

-- Helper: coach check from JWT app_metadata (never user_metadata).
create or replace function public.is_coach()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'coach',
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, invited_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when new.raw_app_meta_data ->> 'role' = 'coach' then 'coach'
      else 'participant'
    end,
    now()
  )
  on conflict (id) do update
    set
      email = excluded.email,
      full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
      role = excluded.role;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.assessments enable row level security;

-- Profiles policies
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Coaches can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_coach());

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Assessments policies
create policy "Users can read own assessments"
  on public.assessments
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Coaches can read all assessments"
  on public.assessments
  for select
  to authenticated
  using (public.is_coach());

create policy "Users can insert own assessments"
  on public.assessments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert on public.assessments to authenticated;
