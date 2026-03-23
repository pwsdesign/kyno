alter table public.profiles
  add column if not exists membership_plan text not null default 'free' check (membership_plan in ('free', 'kyno_plus')),
  add column if not exists membership_plan_activated_at timestamptz;

create or replace function public.sync_membership_plan_activation()
returns trigger
language plpgsql
as $$
begin
  if new.membership_plan = 'kyno_plus' then
    new.membership_plan_activated_at := coalesce(new.membership_plan_activated_at, timezone('utc', now()));
  else
    new.membership_plan_activated_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_sync_membership_plan_activation on public.profiles;
create trigger profiles_sync_membership_plan_activation
before insert or update of membership_plan, membership_plan_activated_at on public.profiles
for each row
execute function public.sync_membership_plan_activation();

update public.profiles
set membership_plan = coalesce(membership_plan, 'free');

create table if not exists public.membership_upgrade_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  requested_plan text not null default 'kyno_plus' check (requested_plan in ('kyno_plus')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint membership_upgrade_requests_note_length_check
    check (note is null or char_length(trim(note)) <= 500)
);

create index if not exists membership_upgrade_requests_user_id_idx
  on public.membership_upgrade_requests (user_id, created_at desc);

create unique index if not exists membership_upgrade_requests_one_pending_idx
  on public.membership_upgrade_requests (user_id)
  where status = 'pending';

drop trigger if exists membership_upgrade_requests_set_updated_at on public.membership_upgrade_requests;
create trigger membership_upgrade_requests_set_updated_at
before update on public.membership_upgrade_requests
for each row
execute function public.set_updated_at();

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_label text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint community_messages_body_length_check
    check (char_length(trim(body)) between 1 and 280)
);

create index if not exists community_messages_created_at_idx
  on public.community_messages (created_at desc);

create or replace function public.assign_community_author_label()
returns trigger
language plpgsql
as $$
declare
  profile_first_name text;
  profile_last_name text;
  safe_first_name text;
  safe_last_initial text;
begin
  select first_name, last_name
  into profile_first_name, profile_last_name
  from public.profiles
  where id = new.user_id;

  safe_first_name := coalesce(nullif(trim(profile_first_name), ''), 'Kyno');
  safe_last_initial := case
    when nullif(trim(profile_last_name), '') is null then ''
    else left(trim(profile_last_name), 1) || '.'
  end;

  new.author_label := trim(concat_ws(' ', safe_first_name, safe_last_initial));

  return new;
end;
$$;

drop trigger if exists community_messages_assign_author_label on public.community_messages;
create trigger community_messages_assign_author_label
before insert on public.community_messages
for each row
execute function public.assign_community_author_label();

alter table public.membership_upgrade_requests enable row level security;
alter table public.community_messages enable row level security;

drop policy if exists "membership_upgrade_requests_select_own" on public.membership_upgrade_requests;
create policy "membership_upgrade_requests_select_own"
on public.membership_upgrade_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "membership_upgrade_requests_insert_own" on public.membership_upgrade_requests;
create policy "membership_upgrade_requests_insert_own"
on public.membership_upgrade_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
  and requested_plan = 'kyno_plus'
  and status = 'pending'
);

drop policy if exists "community_messages_select_kyno_plus" on public.community_messages;
create policy "community_messages_select_kyno_plus"
on public.community_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and membership_plan = 'kyno_plus'
  )
);

drop policy if exists "community_messages_insert_kyno_plus" on public.community_messages;
create policy "community_messages_insert_kyno_plus"
on public.community_messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and membership_plan = 'kyno_plus'
  )
);

do $$
begin
  alter publication supabase_realtime add table public.community_messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;
