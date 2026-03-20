alter table public.profiles
  add column if not exists city text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text;
