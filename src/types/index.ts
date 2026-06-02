export type OrderStatus =
  | 'pending'      // ожидает водителя
  | 'accepted'     // водитель назначен
  | 'in_progress'  // в пути
  | 'completed'    // завершён
  | 'cancelled';   // отменён

export type CarClass = 'economy' | 'comfort' | 'business' | 'minivan' | 'cargo';

export type PaymentMethod = 'cash' | 'card' | 'mbank' | 'odengi';

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;

  // Клиент
  customerName: string;
  customerPhone: string;

  // Маршрут
  fromCity: string;
  fromAddress: string;
  toCity: string;
  toAddress: string;

  // Детали поездки
  scheduledAt: string;    // ISO date или "now"
  passengers: number;
  luggage: number;
  carClass: CarClass;
  comment?: string;

  // Цена и оплата
  estimatedPrice: number;
  finalPrice?: number;
  paymentMethod: PaymentMethod;

  // Водитель (опционально)
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  carModel?: string;
  carNumber?: string;
}

export interface Driver {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  carModel: string;
  carNumber: string;
  carClass: CarClass;
  rating: number;
  totalTrips: number;
  isActive: boolean;
  isVerified: boolean;
}

export interface Tariff {
  id: string;
  carClass: CarClass;
  name: string;
  description: string;
  basePrice: number;       // минимальная цена
  pricePerKm: number;      // цена за км
  pricePerMin: number;     // цена за минуту ожидания
  nightSurcharge: number;  // наценка ночью (%)
  intercityPricePerKm: number; // межгород за км
}

export interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  distanceKm: number;
  estimatedMinutes: number;
  fixedPrices: Record<CarClass, number>;
}

export interface Promo {
  id: string;
  code: string;
  discount: number;      // %
  validUntil: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  createdAt: string;
  customerName: string;
  rating: number;        // 1-5
  text: string;
  city?: string;
  isPublished: boolean;
}

export interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  topRoutes: Array<{ from: string; to: string; count: number }>;
  ordersByStatus: Record<OrderStatus, number>;
}

export type Locale = 'ru' | 'ky' | 'en';
