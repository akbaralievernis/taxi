-- ============================================================================
-- TAXI KG — Supabase schema (Postgres)
-- Copy this entire file and run in Supabase Dashboard → SQL Editor → New query
-- ============================================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. ORDERS
-- ============================================================================
create table if not exists public.orders (
  id            text primary key,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  status        text not null default 'pending'
                check (status in ('pending','accepted','in_progress','completed','cancelled')),

  customer_name  text not null,
  customer_phone text not null,

  from_city      text not null,
  from_address   text not null,
  to_city        text not null,
  to_address     text not null,

  scheduled_at   timestamptz not null,
  passengers     int  not null default 1 check (passengers between 1 and 8),
  luggage        int  not null default 0 check (luggage between 0 and 10),
  car_class      text not null check (car_class in ('economy','comfort','business','minivan','cargo')),
  comment        text,

  estimated_price int not null,
  final_price     int,
  payment_method  text not null check (payment_method in ('cash','card','mbank','odengi')),

  driver_id    text,
  driver_name  text,
  driver_phone text,
  car_model    text,
  car_number   text,
  promo_code   text
);

create index if not exists orders_status_idx        on public.orders(status);
create index if not exists orders_customer_phone_idx on public.orders(customer_phone);
create index if not exists orders_driver_id_idx      on public.orders(driver_id);
create index if not exists orders_created_at_idx     on public.orders(created_at desc);

-- ============================================================================
-- 2. DRIVERS
-- ============================================================================
create table if not exists public.drivers (
  id           text primary key,
  created_at   timestamptz not null default now(),

  name         text not null,
  phone        text not null unique,
  city         text not null,

  car_model    text not null,
  car_number   text not null,
  car_class    text not null check (car_class in ('economy','comfort','business','minivan','cargo')),

  rating       numeric(2,1) not null default 5.0 check (rating between 0 and 5),
  total_trips  int  not null default 0,

  is_active    boolean not null default true,
  is_verified  boolean not null default false,

  -- For online/offline status (driver dashboard toggle)
  is_online    boolean not null default false,
  last_seen_at timestamptz
);

create index if not exists drivers_phone_idx     on public.drivers(phone);
create index if not exists drivers_city_idx      on public.drivers(city);
create index if not exists drivers_car_class_idx on public.drivers(car_class);

-- ============================================================================
-- 3. TARIFFS (manageable from admin panel)
-- ============================================================================
create table if not exists public.tariffs (
  id                    text primary key,
  car_class             text not null unique
                          check (car_class in ('economy','comfort','business','minivan','cargo')),
  name                  text not null,
  description           text not null,
  base_price            int  not null,
  price_per_km          int  not null,
  price_per_min         int  not null,
  night_surcharge       int  not null default 0,
  intercity_price_per_km int not null
);

-- ============================================================================
-- 4. ROUTES (fixed intercity prices)
-- ============================================================================
create table if not exists public.routes (
  id                text primary key,
  from_city         text not null,
  to_city           text not null,
  distance_km       int  not null,
  estimated_minutes int  not null,
  fixed_prices      jsonb not null, -- { economy: 7500, comfort: 10000, ... }
  unique (from_city, to_city)
);

-- ============================================================================
-- 5. PROMO CODES
-- ============================================================================
create table if not exists public.promos (
  id          text primary key,
  code        text not null unique,
  discount    int  not null check (discount between 1 and 100),
  valid_until timestamptz not null,
  max_uses    int  not null default 100,
  used_count  int  not null default 0,
  is_active   boolean not null default true
);

create index if not exists promos_code_idx on public.promos(lower(code));

-- ============================================================================
-- 6. REVIEWS (with moderation)
-- ============================================================================
create table if not exists public.reviews (
  id            text primary key,
  created_at    timestamptz not null default now(),
  customer_name text not null,
  rating        int  not null check (rating between 1 and 5),
  text          text not null,
  city          text,
  is_published  boolean not null default false
);

create index if not exists reviews_published_idx on public.reviews(is_published, created_at desc);

-- ============================================================================
-- 7. AUDIT LOG (admin actions tracking)
-- ============================================================================
create table if not exists public.audit_log (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  actor       text not null,           -- 'admin', driver id, etc.
  action      text not null,           -- 'order.cancel', 'driver.create', etc.
  target_type text,                    -- 'order', 'driver', 'tariff'
  target_id   text,
  ip_address  text,
  metadata    jsonb                    -- additional context
);

create index if not exists audit_log_actor_idx      on public.audit_log(actor, created_at desc);
create index if not exists audit_log_action_idx     on public.audit_log(action);
create index if not exists audit_log_created_at_idx on public.audit_log(created_at desc);

-- ============================================================================
-- 8. ADMIN ACCOUNTS (for 2FA + future multi-admin support)
-- ============================================================================
create table if not exists public.admins (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  login        text not null unique,
  password_hash text not null,
  totp_secret  text,                   -- nullable: 2FA optional
  is_active    boolean not null default true,
  last_login_at timestamptz
);

-- ============================================================================
-- 9. RATE LIMIT (token bucket per IP+route)
-- ============================================================================
create table if not exists public.rate_limit (
  key        text primary key,         -- e.g. "ip:1.2.3.4:order"
  count      int not null default 0,
  reset_at   timestamptz not null
);

create index if not exists rate_limit_reset_at_idx on public.rate_limit(reset_at);

-- ============================================================================
-- 10. UPDATE TRIGGER for orders.updated_at
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 11. ROW LEVEL SECURITY
--     All tables are accessed via service_role key on the server side.
--     We disable RLS for simplicity (server-only access).
--     If you ever expose anon key for direct table access — enable RLS.
-- ============================================================================
alter table public.orders     disable row level security;
alter table public.drivers    disable row level security;
alter table public.tariffs    disable row level security;
alter table public.routes     disable row level security;
alter table public.promos     disable row level security;
alter table public.reviews    disable row level security;
alter table public.audit_log  disable row level security;
alter table public.admins     disable row level security;
alter table public.rate_limit disable row level security;

-- ============================================================================
-- 12. SEED DEFAULT TARIFFS
-- ============================================================================
insert into public.tariffs (id, car_class, name, description, base_price, price_per_km, price_per_min, night_surcharge, intercity_price_per_km) values
  ('tariff_economy',  'economy',  'Эконом',   'Доступная цена, седан',           80,  15,  3, 20, 12),
  ('tariff_comfort',  'comfort',  'Комфорт',  'Просторный салон, кондиционер',  120,  22,  4, 20, 18),
  ('tariff_business', 'business', 'Бизнес',   'Премиум авто, опытный водитель', 250,  40,  7, 25, 30),
  ('tariff_minivan',  'minivan',  'Минивэн',  'До 7 пассажиров, много багажа',  180,  30,  5, 20, 22),
  ('tariff_cargo',    'cargo',    'Грузовое', 'Перевозка вещей и грузов',       200,  35,  5, 15, 25)
on conflict (id) do nothing;

-- ============================================================================
-- 13. SEED DEFAULT ROUTES
-- ============================================================================
insert into public.routes (id, from_city, to_city, distance_km, estimated_minutes, fixed_prices) values
  ('route_bishkek_osh',       'Бишкек', 'Ош',          670, 600,
    '{"economy":7500,"comfort":10000,"business":18000,"minivan":13000,"cargo":15000}'::jsonb),
  ('route_osh_bishkek',       'Ош',     'Бишкек',      670, 600,
    '{"economy":7500,"comfort":10000,"business":18000,"minivan":13000,"cargo":15000}'::jsonb),
  ('route_bishkek_karakol',   'Бишкек', 'Каракол',     400, 360,
    '{"economy":5000,"comfort":7000,"business":12000,"minivan":9000,"cargo":10000}'::jsonb),
  ('route_bishkek_jalalabad', 'Бишкек', 'Джалал-Абад', 600, 540,
    '{"economy":7000,"comfort":9500,"business":17000,"minivan":12500,"cargo":14000}'::jsonb),
  ('route_bishkek_naryn',     'Бишкек', 'Нарын',       320, 300,
    '{"economy":4500,"comfort":6000,"business":10000,"minivan":8000,"cargo":9000}'::jsonb),
  ('route_bishkek_talas',     'Бишкек', 'Талас',       290, 270,
    '{"economy":4000,"comfort":5500,"business":9500,"minivan":7500,"cargo":8500}'::jsonb)
on conflict (id) do nothing;

-- ============================================================================
-- 14. SEED DEMO DRIVERS (for testing the driver dashboard)
-- ============================================================================
insert into public.drivers (id, name, phone, city, car_model, car_number, car_class, rating, total_trips, is_active, is_verified) values
  ('drv_demo_1', 'Айбек Усенов',   '+996 555 123 456', 'Бишкек', 'Toyota Camry',   '01KG 123 ABC', 'comfort', 4.9, 342, true, true),
  ('drv_demo_2', 'Эрлан Бакиров',  '+996 700 987 654', 'Ош',     'Hyundai Sonata', '02KG 456 DEF', 'economy', 4.7, 215, true, true)
on conflict (id) do nothing;

-- ============================================================================
-- 15. SEED DEFAULT REVIEWS
-- ============================================================================
insert into public.reviews (id, customer_name, rating, text, city, is_published) values
  ('rev_default_1', 'Айдар Калыев',     5, 'Заказывал такси Бишкек-Ош. Приехали вовремя, водитель адекватный, машина чистая. Цена — как и обещали, никаких накруток. Рекомендую!', 'Бишкек', true),
  ('rev_default_2', 'Нурбек Жумабаев',  5, 'Пользуюсь регулярно для поездок по городу. Очень удобное приложение, форма понятная, цены справедливые. Спасибо за сервис!',         'Ош',     true),
  ('rev_default_3', 'Гульнара Асанова', 4, 'Заказывала минивэн для поездки с семьёй в Каракол. Всё прошло хорошо, водитель помог с багажом, дети остались довольны.',            'Бишкек', true),
  ('rev_default_4', 'Эрлан Бакиев',     5, 'Лучшее такси в Кыргызстане! Быстрая подача в Бишкеке, всегда чистые машины. Промокод на скидку очень порадовал.',                   'Бишкек', true)
on conflict (id) do nothing;

-- ============================================================================
-- DONE! You can now configure env vars in Vercel:
--   NEXT_PUBLIC_SUPABASE_URL       = https://YOUR_PROJECT.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY  = (anon public key)
--   SUPABASE_SERVICE_ROLE_KEY      = (service role key — server only!)
-- ============================================================================
