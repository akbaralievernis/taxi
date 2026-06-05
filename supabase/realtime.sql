-- ============================================================================
-- TAXI KG — Realtime addition
-- Run this AFTER schema.sql to enable live driver tracking
-- ============================================================================

-- Add a small table to track driver positions in real time.
create table if not exists public.driver_locations (
  driver_id   text primary key references public.drivers(id) on delete cascade,
  lat         double precision not null,
  lon         double precision not null,
  bearing     double precision,             -- direction (0-360, optional)
  speed_kmh   double precision,             -- current speed (optional)
  order_id    text references public.orders(id) on delete set null,
  updated_at  timestamptz not null default now()
);

create index if not exists driver_locations_order_id_idx on public.driver_locations(order_id);

-- Enable Postgres "supabase_realtime" publication for live updates.
-- Customers subscribe via supabase-js to receive driver positions instantly.
alter publication supabase_realtime add table public.driver_locations;
alter publication supabase_realtime add table public.orders;

-- RLS is disabled (server-only access via service_role), realtime
-- works through the service role anyway.
alter table public.driver_locations disable row level security;
