alter table public.profiles
  add column if not exists wallet_pass_token text unique;
