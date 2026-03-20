alter table public.dogs
  add column if not exists dob text,
  add column if not exists breed text,
  add column if not exists weight text,
  add column if not exists personality text,
  add column if not exists sex text,
  add column if not exists altered_status text,
  add column if not exists care_notes text,
  add column if not exists vaccine_history_name text,
  add column if not exists vaccine_history_note text,
  add column if not exists profile_photo_name text,
  add column if not exists profile_photo_data text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    phone = coalesce(excluded.phone, public.profiles.phone);

  return new;
end;
$$;
