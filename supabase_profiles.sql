-- BlueLabel profiles table to store account type (retail/shop/distributor)
-- Apply in Supabase SQL editor.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  account_type text not null default 'retail' check (account_type in ('retail','shop','distributor')),
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles_read_own" on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
