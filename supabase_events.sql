-- BlueLabel analytics/events table
-- Apply in Supabase SQL editor.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  event_type text not null,
  path text,
  referrer text,
  user_agent text,
  product_id text,
  user_email text,
  visitor_id uuid,
  session_id uuid,

  utm jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb
);

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_event_type_idx on public.events (event_type);
create index if not exists events_path_idx on public.events (path);
create index if not exists events_product_id_idx on public.events (product_id);
create index if not exists events_visitor_id_idx on public.events (visitor_id);

-- Lock down: only server (service role) inserts; clients can read only via RLS policies you add.
alter table public.events enable row level security;

-- Optional: allow authenticated admin reads (tighten to your auth scheme)
-- create policy "events_read_authed" on public.events for select to authenticated using (true);

-- No insert policy on purpose (service role bypasses RLS).
