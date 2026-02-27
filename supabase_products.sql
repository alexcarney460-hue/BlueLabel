-- BlueLabel products table for admin-controlled catalog

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(10,2) not null default 0,
  image_url text,
  summary text,
  description text,
  active boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists products_active_sort_idx on public.products (active desc, sort asc);

alter table public.products enable row level security;

-- No policies by default. Reads will go through server routes using service role.
