import fs from 'fs/promises';
import path from 'path';
import { Order, Driver, Tariff, Route, Promo, Review, OrderStatus, CarClass } from '@/types';

// На Vercel/serverless — read-only ФС, используем in-memory кеш.
// Локально — JSON-файлы в src/data/.
// Для продакшена с реальной БД замените на Vercel KV / Postgres / Supabase.
const IS_SERVERLESS = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const FILES = {
  orders: path.join(DATA_DIR, 'orders.json'),
  drivers: path.join(DATA_DIR, 'drivers.json'),
  tariffs: path.join(DATA_DIR, 'tariffs.json'),
  routes: path.join(DATA_DIR, 'routes.json'),
  promos: path.join(DATA_DIR, 'promos.json'),
  reviews: path.join(DATA_DIR, 'reviews.json'),
};

// In-memory кеш для serverless (выживает в рамках одного контейнера)
const memCache = new Map<string, any>();

async function ensureDir() {
  if (IS_SERVERLESS) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  if (IS_SERVERLESS) {
    if (!memCache.has(file)) {
      memCache.set(file, fallback);
    }
    return memCache.get(file) as T;
  }

  await ensureDir();
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  if (IS_SERVERLESS) {
    memCache.set(file, data);
    return;
  }
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// === ORDERS ===

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>(FILES.orders, []);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === id) ?? null;
}

export async function createOrder(input: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> {
  const orders = await getOrders();
  const now = new Date().toISOString();
  const order: Order = {
    ...input,
    id: generateId('ord'),
    createdAt: now,
    updatedAt: now,
    status: 'pending',
  };
  orders.unshift(order);
  await writeJson(FILES.orders, orders);
  return order;
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const orders = await getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeJson(FILES.orders, orders);
  return orders[idx];
}

export async function deleteOrder(id: string): Promise<boolean> {
  const orders = await getOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) return false;
  await writeJson(FILES.orders, filtered);
  return true;
}

// === DRIVERS ===

export async function getDrivers(): Promise<Driver[]> {
  return readJson<Driver[]>(FILES.drivers, getDefaultDrivers());
}

export async function createDriver(input: Omit<Driver, 'id' | 'createdAt' | 'rating' | 'totalTrips'>): Promise<Driver> {
  const drivers = await getDrivers();
  const driver: Driver = {
    ...input,
    id: generateId('drv'),
    createdAt: new Date().toISOString(),
    rating: 5.0,
    totalTrips: 0,
  };
  drivers.push(driver);
  await writeJson(FILES.drivers, drivers);
  return driver;
}

export async function updateDriver(id: string, patch: Partial<Driver>): Promise<Driver | null> {
  const drivers = await getDrivers();
  const idx = drivers.findIndex(d => d.id === id);
  if (idx === -1) return null;
  drivers[idx] = { ...drivers[idx], ...patch };
  await writeJson(FILES.drivers, drivers);
  return drivers[idx];
}

export async function deleteDriver(id: string): Promise<boolean> {
  const drivers = await getDrivers();
  const filtered = drivers.filter(d => d.id !== id);
  if (filtered.length === drivers.length) return false;
  await writeJson(FILES.drivers, filtered);
  return true;
}

// === TARIFFS ===

export async function getTariffs(): Promise<Tariff[]> {
  return readJson<Tariff[]>(FILES.tariffs, getDefaultTariffs());
}

export async function updateTariff(id: string, patch: Partial<Tariff>): Promise<Tariff | null> {
  const tariffs = await getTariffs();
  const idx = tariffs.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tariffs[idx] = { ...tariffs[idx], ...patch };
  await writeJson(FILES.tariffs, tariffs);
  return tariffs[idx];
}

// === ROUTES ===

export async function getRoutes(): Promise<Route[]> {
  return readJson<Route[]>(FILES.routes, getDefaultRoutes());
}

export async function findRoute(fromCity: string, toCity: string): Promise<Route | null> {
  const routes = await getRoutes();
  return routes.find(r =>
    r.fromCity.toLowerCase() === fromCity.toLowerCase() &&
    r.toCity.toLowerCase() === toCity.toLowerCase()
  ) ?? null;
}

// === PROMOS ===

export async function getPromos(): Promise<Promo[]> {
  return readJson<Promo[]>(FILES.promos, []);
}

export async function findPromoByCode(code: string): Promise<Promo | null> {
  const promos = await getPromos();
  return promos.find(p =>
    p.code.toLowerCase() === code.toLowerCase() &&
    p.isActive &&
    new Date(p.validUntil) > new Date() &&
    p.usedCount < p.maxUses
  ) ?? null;
}

// === REVIEWS ===

export async function getReviews(publishedOnly = false): Promise<Review[]> {
  const reviews = await readJson<Review[]>(FILES.reviews, getDefaultReviews());
  return publishedOnly ? reviews.filter(r => r.isPublished) : reviews;
}

export async function createReview(input: Omit<Review, 'id' | 'createdAt' | 'isPublished'>): Promise<Review> {
  const reviews = await getReviews();
  const review: Review = {
    ...input,
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    isPublished: false, // модерация
  };
  reviews.unshift(review);
  await writeJson(FILES.reviews, reviews);
  return review;
}

export async function updateReview(id: string, patch: Partial<Review>): Promise<Review | null> {
  const reviews = await getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return null;
  reviews[idx] = { ...reviews[idx], ...patch };
  await writeJson(FILES.reviews, reviews);
  return reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  const reviews = await getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  if (filtered.length === reviews.length) return false;
  await writeJson(FILES.reviews, filtered);
  return true;
}

function getDefaultReviews(): Review[] {
  return [
    {
      id: 'rev_default_1',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      customerName: 'Айдар Калыев',
      rating: 5,
      text: 'Заказывал такси Бишкек-Ош. Приехали вовремя, водитель адекватный, машина чистая. Цена — как и обещали, никаких накруток. Рекомендую!',
      city: 'Бишкек',
      isPublished: true,
    },
    {
      id: 'rev_default_2',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      customerName: 'Нурбек Жумабаев',
      rating: 5,
      text: 'Пользуюсь регулярно для поездок по городу. Очень удобное приложение, форма понятная, цены справедливые. Спасибо за сервис!',
      city: 'Ош',
      isPublished: true,
    },
    {
      id: 'rev_default_3',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      customerName: 'Гульнара Асанова',
      rating: 4,
      text: 'Заказывала минивэн для поездки с семьёй в Каракол. Всё прошло хорошо, водитель помог с багажом, дети остались довольны.',
      city: 'Бишкек',
      isPublished: true,
    },
    {
      id: 'rev_default_4',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      customerName: 'Эрлан Бакиев',
      rating: 5,
      text: 'Лучшее такси в Кыргызстане! Быстрая подача в Бишкеке, всегда чистые машины. Промокод на скидку очень порадовал.',
      city: 'Бишкек',
      isPublished: true,
    },
  ];
}

// === STATS ===

export async function getStats() {
  const orders = await getOrders();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  const completed = orders.filter(o => o.status === 'completed');

  const ordersByStatus: Record<OrderStatus, number> = {
    pending: 0, accepted: 0, in_progress: 0, completed: 0, cancelled: 0,
  };
  orders.forEach(o => { ordersByStatus[o.status]++; });

  const routeCount = new Map<string, number>();
  orders.forEach(o => {
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
    totalRevenue: completed.reduce((sum, o) => sum + (o.finalPrice ?? o.estimatedPrice), 0),
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.finalPrice ?? o.estimatedPrice), 0),
    topRoutes,
    ordersByStatus,
  };
}

// === DEFAULTS ===

function getDefaultTariffs(): Tariff[] {
  return [
    {
      id: 'tariff_economy',
      carClass: 'economy',
      name: 'Эконом',
      description: 'Доступная цена, седан',
      basePrice: 80,
      pricePerKm: 15,
      pricePerMin: 3,
      nightSurcharge: 20,
      intercityPricePerKm: 12,
    },
    {
      id: 'tariff_comfort',
      carClass: 'comfort',
      name: 'Комфорт',
      description: 'Просторный салон, кондиционер',
      basePrice: 120,
      pricePerKm: 22,
      pricePerMin: 4,
      nightSurcharge: 20,
      intercityPricePerKm: 18,
    },
    {
      id: 'tariff_business',
      carClass: 'business',
      name: 'Бизнес',
      description: 'Премиум авто, опытный водитель',
      basePrice: 250,
      pricePerKm: 40,
      pricePerMin: 7,
      nightSurcharge: 25,
      intercityPricePerKm: 30,
    },
    {
      id: 'tariff_minivan',
      carClass: 'minivan',
      name: 'Минивэн',
      description: 'До 7 пассажиров, много багажа',
      basePrice: 180,
      pricePerKm: 30,
      pricePerMin: 5,
      nightSurcharge: 20,
      intercityPricePerKm: 22,
    },
    {
      id: 'tariff_cargo',
      carClass: 'cargo',
      name: 'Грузовое',
      description: 'Перевозка вещей и грузов',
      basePrice: 200,
      pricePerKm: 35,
      pricePerMin: 5,
      nightSurcharge: 15,
      intercityPricePerKm: 25,
    },
  ];
}

function getDefaultRoutes(): Route[] {
  return [
    {
      id: 'route_bishkek_osh',
      fromCity: 'Бишкек',
      toCity: 'Ош',
      distanceKm: 670,
      estimatedMinutes: 600,
      fixedPrices: {
        economy: 7500,
        comfort: 10000,
        business: 18000,
        minivan: 13000,
        cargo: 15000,
      },
    },
    {
      id: 'route_osh_bishkek',
      fromCity: 'Ош',
      toCity: 'Бишкек',
      distanceKm: 670,
      estimatedMinutes: 600,
      fixedPrices: {
        economy: 7500,
        comfort: 10000,
        business: 18000,
        minivan: 13000,
        cargo: 15000,
      },
    },
    {
      id: 'route_bishkek_karakol',
      fromCity: 'Бишкек',
      toCity: 'Каракол',
      distanceKm: 400,
      estimatedMinutes: 360,
      fixedPrices: {
        economy: 5000,
        comfort: 7000,
        business: 12000,
        minivan: 9000,
        cargo: 10000,
      },
    },
    {
      id: 'route_bishkek_jalalabad',
      fromCity: 'Бишкек',
      toCity: 'Джалал-Абад',
      distanceKm: 600,
      estimatedMinutes: 540,
      fixedPrices: {
        economy: 7000,
        comfort: 9500,
        business: 17000,
        minivan: 12500,
        cargo: 14000,
      },
    },
    {
      id: 'route_bishkek_naryn',
      fromCity: 'Бишкек',
      toCity: 'Нарын',
      distanceKm: 320,
      estimatedMinutes: 300,
      fixedPrices: {
        economy: 4500,
        comfort: 6000,
        business: 10000,
        minivan: 8000,
        cargo: 9000,
      },
    },
    {
      id: 'route_bishkek_talas',
      fromCity: 'Бишкек',
      toCity: 'Талас',
      distanceKm: 290,
      estimatedMinutes: 270,
      fixedPrices: {
        economy: 4000,
        comfort: 5500,
        business: 9500,
        minivan: 7500,
        cargo: 8500,
      },
    },
  ];
}

function getDefaultDrivers(): Driver[] {
  return [
    {
      id: 'drv_demo_1',
      createdAt: new Date().toISOString(),
      name: 'Айбек Усенов',
      phone: '+996 555 123 456',
      city: 'Бишкек',
      carModel: 'Toyota Camry',
      carNumber: '01KG 123 ABC',
      carClass: 'comfort',
      rating: 4.9,
      totalTrips: 342,
      isActive: true,
      isVerified: true,
    },
    {
      id: 'drv_demo_2',
      createdAt: new Date().toISOString(),
      name: 'Эрлан Бакиров',
      phone: '+996 700 987 654',
      city: 'Ош',
      carModel: 'Hyundai Sonata',
      carNumber: '02KG 456 DEF',
      carClass: 'economy',
      rating: 4.7,
      totalTrips: 215,
      isActive: true,
      isVerified: true,
    },
  ];
}

// === PRICE CALCULATION ===

export async function calculatePrice(params: {
  fromCity: string;
  toCity: string;
  carClass: CarClass;
  distanceKm?: number;
  scheduledAt?: string;
}): Promise<{ price: number; isIntercity: boolean; distanceKm: number }> {
  const tariffs = await getTariffs();
  const tariff = tariffs.find(t => t.carClass === params.carClass);
  if (!tariff) return { price: 0, isIntercity: false, distanceKm: 0 };

  const isIntercity = params.fromCity.toLowerCase() !== params.toCity.toLowerCase();

  if (isIntercity) {
    const route = await findRoute(params.fromCity, params.toCity);
    if (route) {
      let price = route.fixedPrices[params.carClass];
      if (params.scheduledAt && isNightTime(params.scheduledAt)) {
        price = Math.round(price * (1 + tariff.nightSurcharge / 100));
      }
      return { price, isIntercity: true, distanceKm: route.distanceKm };
    }
    // если маршрут не найден — считаем по расстоянию
    const distance = params.distanceKm ?? 100;
    let price = tariff.basePrice + distance * tariff.intercityPricePerKm;
    if (params.scheduledAt && isNightTime(params.scheduledAt)) {
      price = Math.round(price * (1 + tariff.nightSurcharge / 100));
    }
    return { price: Math.round(price), isIntercity: true, distanceKm: distance };
  }

  // внутри города
  const distance = params.distanceKm ?? 8;
  let price = tariff.basePrice + distance * tariff.pricePerKm;
  if (params.scheduledAt && isNightTime(params.scheduledAt)) {
    price = Math.round(price * (1 + tariff.nightSurcharge / 100));
  }
  return { price: Math.max(tariff.basePrice, Math.round(price)), isIntercity: false, distanceKm: distance };
}

function isNightTime(iso: string): boolean {
  const date = new Date(iso);
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}
