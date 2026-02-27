-- Migrate existing public.products to expected schema (non-destructive)
-- Apply in Supabase SQL editor.

-- Add columns if they don't exist
alter table public.products add column if not exists name text;
alter table public.products add column if not exists price numeric(10,2) not null default 0;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists summary text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists active boolean not null default true;
alter table public.products add column if not exists sort int not null default 0;
alter table public.products add column if not exists updated_at timestamptz not null default now();
alter table public.products add column if not exists created_at timestamptz not null default now();

-- Backfill name from id if name is null
update public.products set name = id where name is null;

-- Ensure RLS enabled
alter table public.products enable row level security;

-- Indexes
create index if not exists products_active_sort_idx on public.products (active desc, sort asc);
