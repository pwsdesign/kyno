create sequence if not exists public.membership_code_seq;

alter table public.profiles
  add column if not exists membership_id text unique,
  add column if not exists wallet_pass_url text;

create or replace function public.assign_membership_id()
returns trigger
language plpgsql
as $$
begin
  if new.membership_id is null then
    new.membership_id := format(
      'KYN-%s-%s',
      to_char(coalesce(new.created_at, timezone('utc', now())), 'YYYY'),
      lpad(nextval('public.membership_code_seq')::text, 4, '0')
    );
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_assign_membership_id on public.profiles;
create trigger profiles_assign_membership_id
before insert on public.profiles
for each row
execute function public.assign_membership_id();

update public.profiles
set membership_id = format(
  'KYN-%s-%s',
  to_char(coalesce(created_at, timezone('utc', now())), 'YYYY'),
  lpad(nextval('public.membership_code_seq')::text, 4, '0')
)
where membership_id is null;
