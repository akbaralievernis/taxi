/**
 * Unified data layer.
 *
 * Behavior:
 *   • If Supabase env vars are set (NEXT_PUBLIC_SUPABASE_URL +
 *     SUPABASE_SERVICE_ROLE_KEY) → all reads/writes go to Postgres.
 *   • Otherwise → fallback to JSON files (local dev) or in-memory
 *     cache (serverless without Supabase).
 *
 * All TypeScript objects use camelCase; Postgres uses snake_case.
 * Conversion happens automatically via `lib/db-mappers.ts`.
 */
import fs from 'fs/promises';
import path from 'path';
import { Order, Driver, Tariff, Route, Promo, Review, OrderStatus, CarClass } from '@/types';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase-admin';
import {
  orderFromDb, orderToDb,
  driverFromDb, driverToDb,
  tariffFromDb, tariffPatchToDb,
  routeFromDb,
  promoFromDb, promoToDb,
  reviewFromDb, reviewToDb,
} from './db-mappers';

const IS_SERVERLESS = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const FILES = {
  orders: path.join(DATA_DIR, 'orders.json'),
  drivers: path.join(DATA_DIR, 'drivers.json'),
  tariffs: path.join(DATA_DIR, 'tariffs.json'),
  routes: path.join(DATA_DIR, 'routes.json'),
  promos: path.join(DATA_DIR, 'promos.json'),
  reviews: path.join(DATA_DIR, 'reviews.json'),
};

const memCache = new Map<string, any>();

async function ensureDir() {
  if (IS_SERVERLESS) return;
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  if (IS_SERVERLESS) {
    if (!memCache.has(file)) memCache.set(file, fallback);
    return memCache.get(file) as T;
  }
  await ensureDir();
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8')) as T;
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  if (IS_SERVERLESS) { memCache.set(file, data); return; }
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ════════════════════════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════════════════════════

export async function getOrders(): Promise<Order[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(orderFromDb);
  }
  return readJson<Order[]>(FILES.orders, []);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('orders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? orderFromDb(data) : null;
  }
  return (await getOrders()).find((o) => o.id === id) ?? null;
}

export async function createOrder(input: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = { ...input, id: generateId('ord'), createdAt: now, updatedAt: now, status: 'pending' };

  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('orders').insert(orderToDb(order));
    if (error) throw error;
    return order;
  }
  const orders = await getOrders();
  orders.unshift(order);
  await writeJson(FILES.orders, orders);
  return order;
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const full = { ...(await getOrderById(id)), ...patch } as Order;
    if (!full?.id) return null;
    const { data, error } = await sb.from('orders').update(orderToDb(full)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data ? orderFromDb(data) : null;
  }
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeJson(FILES.orders, orders);
  return orders[idx];
}

export async function deleteOrder(id: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('orders').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const orders = await getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  await writeJson(FILES.orders, filtered);
  return true;
}

// ════════════════════════════════════════════════════════════════════════════
// DRIVERS
// ════════════════════════════════════════════════════════════════════════════

export async function getDrivers(): Promise<Driver[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('drivers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(driverFromDb);
  }
  return readJson<Driver[]>(FILES.drivers, getDefaultDrivers());
}

export async function createDriver(input: Omit<Driver, 'id' | 'createdAt' | 'rating' | 'totalTrips'>): Promise<Driver> {
  const driver: Driver = {
    ...input,
    id: generateId('drv'),
    createdAt: new Date().toISOString(),
    rating: 5.0,
    totalTrips: 0,
  };
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('drivers').insert(driverToDb(driver));
    if (error) throw error;
    return driver;
  }
  const drivers = await getDrivers();
  drivers.push(driver);
  await writeJson(FILES.drivers, drivers);
  return driver;
}

export async function updateDriver(id: string, patch: Partial<Driver>): Promise<Driver | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const drivers = await getDrivers();
    const cur = drivers.find((d) => d.id === id);
    if (!cur) return null;
    const merged: Driver = { ...cur, ...patch };
    const { data, error } = await sb.from('drivers').update(driverToDb(merged)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data ? driverFromDb(data) : null;
  }
  const drivers = await getDrivers();
  const idx = drivers.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  drivers[idx] = { ...drivers[idx], ...patch };
  await writeJson(FILES.drivers, drivers);
  return drivers[idx];
}

export async function deleteDriver(id: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('drivers').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const drivers = await getDrivers();
  const filtered = drivers.filter((d) => d.id !== id);
  if (filtered.length === drivers.length) return false;
  await writeJson(FILES.drivers, filtered);
  return true;
}

// ════════════════════════════════════════════════════════════════════════════
// TARIFFS
// ════════════════════════════════════════════════════════════════════════════

export async function getTariffs(): Promise<Tariff[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('tariffs').select('*').order('base_price');
    if (error) throw error;
    return (data ?? []).map(tariffFromDb);
  }
  return readJson<Tariff[]>(FILES.tariffs, getDefaultTariffs());
}

export async function updateTariff(id: string, patch: Partial<Tariff>): Promise<Tariff | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('tariffs').update(tariffPatchToDb(patch)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data ? tariffFromDb(data) : null;
  }
  const tariffs = await getTariffs();
  const idx = tariffs.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tariffs[idx] = { ...tariffs[idx], ...patch };
  await writeJson(FILES.tariffs, tariffs);
  return tariffs[idx];
}

// ════════════════════════════════════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════════════════════════════════════

export async function getRoutes(): Promise<Route[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('routes').select('*');
    if (error) throw error;
    return (data ?? []).map(routeFromDb);
  }
  return readJson<Route[]>(FILES.routes, getDefaultRoutes());
}

export async function findRoute(fromCity: string, toCity: string): Promise<Route | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from('routes')
      .select('*')
      .ilike('from_city', fromCity)
      .ilike('to_city', toCity)
      .maybeSingle();
    if (error) throw error;
    return data ? routeFromDb(data) : null;
  }
  const routes = await getRoutes();
  return (
    routes.find(
      (r) =>
        r.fromCity.toLowerCase() === fromCity.toLowerCase() &&
        r.toCity.toLowerCase() === toCity.toLowerCase()
    ) ?? null
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PROMOS
// ════════════════════════════════════════════════════════════════════════════

export async function getPromos(): Promise<Promo[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('promos').select('*');
    if (error) throw error;
    return (data ?? []).map(promoFromDb);
  }
  return readJson<Promo[]>(FILES.promos, []);
}

export async function findPromoByCode(code: string): Promise<Promo | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const now = new Date().toISOString();
    const { data, error } = await sb
      .from('promos')
      .select('*')
      .ilike('code', code)
      .eq('is_active', true)
      .gt('valid_until', now)
      .maybeSingle();
    if (error) throw error;
    if (data && data.used_count < data.max_uses) return promoFromDb(data);
    return null;
  }
  const promos = await getPromos();
  return (
    promos.find(
      (p) =>
        p.code.toLowerCase() === code.toLowerCase() &&
        p.isActive &&
        new Date(p.validUntil) > new Date() &&
        p.usedCount < p.maxUses
    ) ?? null
  );
}

export async function savePromo(p: Promo): Promise<Promo> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('promos').upsert(promoToDb(p));
    if (error) throw error;
    return p;
  }
  const promos = await getPromos();
  const idx = promos.findIndex((x) => x.id === p.id);
  if (idx === -1) promos.push(p);
  else promos[idx] = p;
  await writeJson(FILES.promos, promos);
  return p;
}

export async function updatePromo(id: string, patch: Partial<Promo>): Promise<Promo | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const promos = await getPromos();
    const cur = promos.find((p) => p.id === id);
    if (!cur) return null;
    const merged: Promo = { ...cur, ...patch };
    const { error } = await sb.from('promos').update(promoToDb(merged)).eq('id', id);
    if (error) throw error;
    return merged;
  }
  const promos = await getPromos();
  const idx = promos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  promos[idx] = { ...promos[idx], ...patch };
  await writeJson(FILES.promos, promos);
  return promos[idx];
}

export async function deletePromo(id: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('promos').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const promos = await getPromos();
  const filtered = promos.filter((p) => p.id !== id);
  if (filtered.length === promos.length) return false;
  await writeJson(FILES.promos, filtered);
  return true;
}

// ════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ════════════════════════════════════════════════════════════════════════════

export async function getReviews(publishedOnly = false): Promise<Review[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    let q = sb.from('reviews').select('*').order('created_at', { ascending: false });
    if (publishedOnly) q = q.eq('is_published', true);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(reviewFromDb);
  }
  const reviews = await readJson<Review[]>(FILES.reviews, getDefaultReviews());
  return publishedOnly ? reviews.filter((r) => r.isPublished) : reviews;
}

export async function createReview(input: Omit<Review, 'id' | 'createdAt' | 'isPublished'>): Promise<Review> {
  const review: Review = {
    ...input,
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    isPublished: false,
  };
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('reviews').insert(reviewToDb(review));
    if (error) throw error;
    return review;
  }
  const reviews = await getReviews();
  reviews.unshift(review);
  await writeJson(FILES.reviews, reviews);
  return review;
}

export async function updateReview(id: string, patch: Partial<Review>): Promise<Review | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const reviews = await getReviews();
    const cur = reviews.find((r) => r.id === id);
    if (!cur) return null;
    const merged: Review = { ...cur, ...patch };
    const { error } = await sb.from('reviews').update(reviewToDb(merged)).eq('id', id);
    if (error) throw error;
    return merged;
  }
  const reviews = await getReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reviews[idx] = { ...reviews[idx], ...patch };
  await writeJson(FILES.reviews, reviews);
  return reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from('reviews').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const reviews = await getReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  if (filtered.length === reviews.length) return false;
  await writeJson(FILES.reviews, filtered);
  return true;
}

// ════════════════════════════════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════════════════════════════════

export async function getStats() {
  const orders = await getOrders();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
  const completed = orders.filter((o) => o.status === 'completed');

  const ordersByStatus: Record<OrderStatus, number> = {
    pending: 0, accepted: 0, in_progress: 0, completed: 0, cancelled: 0,
  };
  orders.forEach((o) => { ordersByStatus[o.status]++; });

  const routeCount = new Map<string, number>();
  orders.forEach((o) => {
    const key = `${o.fromCity} → ${o.toCity}`;
    routeCount.set(key, (routeCount.get(key) ?? 0) + 1);
  });

  const topRoutes = Array.from(routeCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [from, to] = key.split(' → ');
      return { from, to, count };
    });

  return {
    totalOrders: orders.length,
    pendingOrders: ordersByStatus.pending,
    completedOrders: ordersByStatus.completed,
    cancelledOrders: ordersByStatus.cancelled,
    totalRevenue: completed.reduce((s, o) => s + (o.finalPrice ?? o.estimatedPrice), 0),
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders.filter((o) => o.status === 'completed').reduce((s, o) => s + (o.finalPrice ?? o.estimatedPrice), 0),
    topRoutes,
    ordersByStatus,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// PRICE CALCULATION
// ════════════════════════════════════════════════════════════════════════════

export async function calculatePrice(params: {
  fromCity: string;
  toCity: string;
  carClass: CarClass;
  distanceKm?: number;
  scheduledAt?: string;
}): Promise<{ price: number; isIntercity: boolean; distanceKm: number }> {
  const tariffs = await getTariffs();
  const tariff = tariffs.find((t) => t.carClass === params.carClass);
  if (!tariff) return { price: 0, isIntercity: false, distanceKm: 0 };

  const isIntercity = params.fromCity.toLowerCase() !== params.toCity.toLowerCase();
  const nightMul = (p: number) =>
    params.scheduledAt && isNightTime(params.scheduledAt)
      ? Math.round(p * (1 + tariff.nightSurcharge / 100))
      : p;

  if (isIntercity) {
    const route = await findRoute(params.fromCity, params.toCity);
    if (route) {
      return { price: nightMul(route.fixedPrices[params.carClass]), isIntercity: true, distanceKm: route.distanceKm };
    }
    const distance = params.distanceKm ?? 100;
    const base = tariff.basePrice + distance * tariff.intercityPricePerKm;
    return { price: nightMul(Math.round(base)), isIntercity: true, distanceKm: distance };
  }

  const distance = params.distanceKm ?? 8;
  const base = tariff.basePrice + distance * tariff.pricePerKm;
  return { price: Math.max(tariff.basePrice, nightMul(Math.round(base))), isIntercity: false, distanceKm: distance };
}

function isNightTime(iso: string): boolean {
  const h = new Date(iso).getHours();
  return h >= 22 || h < 6;
}

// ════════════════════════════════════════════════════════════════════════════
// HEALTH
// ════════════════════════════════════════════════════════════════════════════

export async function checkDbHealth(): Promise<{ ok: boolean; backend: string; error?: string }> {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      const { error } = await sb.from('tariffs').select('id').limit(1);
      if (error) return { ok: false, backend: 'supabase', error: error.message };
      return { ok: true, backend: 'supabase' };
    } catch (e: any) {
      return { ok: false, backend: 'supabase', error: e?.message ?? 'unknown' };
    }
  }
  return { ok: true, backend: IS_SERVERLESS ? 'memory' : 'json-fs' };
}

export { isSupabaseConfigured };

// ════════════════════════════════════════════════════════════════════════════
// DEFAULTS (fallback when no DB)
// ════════════════════════════════════════════════════════════════════════════

function getDefaultTariffs(): Tariff[] {
  return [
    { id: 'tariff_economy',  carClass: 'economy',  name: 'Эконом',   description: 'Доступная цена, седан',           basePrice: 80,  pricePerKm: 15, pricePerMin: 3, nightSurcharge: 20, intercityPricePerKm: 12 },
    { id: 'tariff_comfort',  carClass: 'comfort',  name: 'Комфорт',  description: 'Просторный салон, кондиционер',  basePrice: 120, pricePerKm: 22, pricePerMin: 4, nightSurcharge: 20, intercityPricePerKm: 18 },
    { id: 'tariff_business', carClass: 'business', name: 'Бизнес',   description: 'Премиум авто, опытный водитель', basePrice: 250, pricePerKm: 40, pricePerMin: 7, nightSurcharge: 25, intercityPricePerKm: 30 },
    { id: 'tariff_minivan',  carClass: 'minivan',  name: 'Минивэн',  description: 'До 7 пассажиров, много багажа',  basePrice: 180, pricePerKm: 30, pricePerMin: 5, nightSurcharge: 20, intercityPricePerKm: 22 },
    { id: 'tariff_cargo',    carClass: 'cargo',    name: 'Грузовое', description: 'Перевозка вещей и грузов',       basePrice: 200, pricePerKm: 35, pricePerMin: 5, nightSurcharge: 15, intercityPricePerKm: 25 },
  ];
}

function getDefaultRoutes(): Route[] {
  const p = (e: number, c: number, b: number, m: number, cg: number) => ({ economy: e, comfort: c, business: b, minivan: m, cargo: cg });
  return [
    { id: 'route_bishkek_osh',       fromCity: 'Бишкек', toCity: 'Ош',          distanceKm: 670, estimatedMinutes: 600, fixedPrices: p(7500, 10000, 18000, 13000, 15000) },
    { id: 'route_osh_bishkek',       fromCity: 'Ош',     toCity: 'Бишкек',      distanceKm: 670, estimatedMinutes: 600, fixedPrices: p(7500, 10000, 18000, 13000, 15000) },
    { id: 'route_bishkek_karakol',   fromCity: 'Бишкек', toCity: 'Каракол',     distanceKm: 400, estimatedMinutes: 360, fixedPrices: p(5000, 7000, 12000, 9000, 10000) },
    { id: 'route_bishkek_jalalabad', fromCity: 'Бишкек', toCity: 'Джалал-Абад', distanceKm: 600, estimatedMinutes: 540, fixedPrices: p(7000, 9500, 17000, 12500, 14000) },
    { id: 'route_bishkek_naryn',     fromCity: 'Бишкек', toCity: 'Нарын',       distanceKm: 320, estimatedMinutes: 300, fixedPrices: p(4500, 6000, 10000, 8000, 9000) },
    { id: 'route_bishkek_talas',     fromCity: 'Бишкек', toCity: 'Талас',       distanceKm: 290, estimatedMinutes: 270, fixedPrices: p(4000, 5500, 9500, 7500, 8500) },
  ];
}

function getDefaultDrivers(): Driver[] {
  const now = new Date().toISOString();
  return [
    { id: 'drv_demo_1', createdAt: now, name: 'Айбек Усенов',  phone: '+996 555 123 456', city: 'Бишкек', carModel: 'Toyota Camry',   carNumber: '01KG 123 ABC', carClass: 'comfort', rating: 4.9, totalTrips: 342, isActive: true, isVerified: true },
    { id: 'drv_demo_2', createdAt: now, name: 'Эрлан Бакиров', phone: '+996 700 987 654', city: 'Ош',     carModel: 'Hyundai Sonata', carNumber: '02KG 456 DEF', carClass: 'economy', rating: 4.7, totalTrips: 215, isActive: true, isVerified: true },
  ];
}

function getDefaultReviews(): Review[] {
  const d = (n: number) => new Date(Date.now() - 86400000 * n).toISOString();
  return [
    { id: 'rev_default_1', createdAt: d(3),  customerName: 'Айдар Калыев',     rating: 5, text: 'Заказывал такси Бишкек-Ош. Приехали вовремя, водитель адекватный, машина чистая. Цена — как и обещали, никаких накруток. Рекомендую!', city: 'Бишкек', isPublished: true },
    { id: 'rev_default_2', createdAt: d(7),  customerName: 'Нурбек Жумабаев',  rating: 5, text: 'Пользуюсь регулярно для поездок по городу. Очень удобное приложение, форма понятная, цены справедливые. Спасибо за сервис!',         city: 'Ош',     isPublished: true },
    { id: 'rev_default_3', createdAt: d(14), customerName: 'Гульнара Асанова', rating: 4, text: 'Заказывала минивэн для поездки с семьёй в Каракол. Всё прошло хорошо, водитель помог с багажом, дети остались довольны.',            city: 'Бишкек', isPublished: true },
    { id: 'rev_default_4', createdAt: d(20), customerName: 'Эрлан Бакиев',     rating: 5, text: 'Лучшее такси в Кыргызстане! Быстрая подача в Бишкеке, всегда чистые машины. Промокод на скидку очень порадовал.',                   city: 'Бишкек', isPublished: true },
  ];
}
