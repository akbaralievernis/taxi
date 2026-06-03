import { Order, Driver, Tariff, Route, Promo, Review, CarClass } from '@/types';

/**
 * Bidirectional mappers TypeScript ↔ Postgres (snake_case).
 * Used by db.ts when the Supabase backend is active.
 */

// ============== ORDERS ==============
export function orderToDb(o: Order): Record<string, any> {
  return {
    id: o.id,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
    status: o.status,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    from_city: o.fromCity,
    from_address: o.fromAddress,
    to_city: o.toCity,
    to_address: o.toAddress,
    scheduled_at: o.scheduledAt,
    passengers: o.passengers,
    luggage: o.luggage,
    car_class: o.carClass,
    comment: o.comment ?? null,
    estimated_price: o.estimatedPrice,
    final_price: o.finalPrice ?? null,
    payment_method: o.paymentMethod,
    driver_id: o.driverId ?? null,
    driver_name: o.driverName ?? null,
    driver_phone: o.driverPhone ?? null,
    car_model: o.carModel ?? null,
    car_number: o.carNumber ?? null,
  };
}

export function orderFromDb(r: any): Order {
  return {
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    status: r.status,
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    fromCity: r.from_city,
    fromAddress: r.from_address,
    toCity: r.to_city,
    toAddress: r.to_address,
    scheduledAt: r.scheduled_at,
    passengers: r.passengers,
    luggage: r.luggage,
    carClass: r.car_class as CarClass,
    comment: r.comment ?? undefined,
    estimatedPrice: r.estimated_price,
    finalPrice: r.final_price ?? undefined,
    paymentMethod: r.payment_method,
    driverId: r.driver_id ?? undefined,
    driverName: r.driver_name ?? undefined,
    driverPhone: r.driver_phone ?? undefined,
    carModel: r.car_model ?? undefined,
    carNumber: r.car_number ?? undefined,
  };
}

// ============== DRIVERS ==============
export function driverToDb(d: Driver): Record<string, any> {
  return {
    id: d.id,
    created_at: d.createdAt,
    name: d.name,
    phone: d.phone,
    city: d.city,
    car_model: d.carModel,
    car_number: d.carNumber,
    car_class: d.carClass,
    rating: d.rating,
    total_trips: d.totalTrips,
    is_active: d.isActive,
    is_verified: d.isVerified,
  };
}

export function driverFromDb(r: any): Driver {
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    phone: r.phone,
    city: r.city,
    carModel: r.car_model,
    carNumber: r.car_number,
    carClass: r.car_class as CarClass,
    rating: Number(r.rating),
    totalTrips: r.total_trips,
    isActive: r.is_active,
    isVerified: r.is_verified,
  };
}

// ============== TARIFFS ==============
export function tariffFromDb(r: any): Tariff {
  return {
    id: r.id,
    carClass: r.car_class as CarClass,
    name: r.name,
    description: r.description,
    basePrice: r.base_price,
    pricePerKm: r.price_per_km,
    pricePerMin: r.price_per_min,
    nightSurcharge: r.night_surcharge,
    intercityPricePerKm: r.intercity_price_per_km,
  };
}

export function tariffPatchToDb(p: Partial<Tariff>): Record<string, any> {
  const out: Record<string, any> = {};
  if (p.name !== undefined) out.name = p.name;
  if (p.description !== undefined) out.description = p.description;
  if (p.basePrice !== undefined) out.base_price = p.basePrice;
  if (p.pricePerKm !== undefined) out.price_per_km = p.pricePerKm;
  if (p.pricePerMin !== undefined) out.price_per_min = p.pricePerMin;
  if (p.nightSurcharge !== undefined) out.night_surcharge = p.nightSurcharge;
  if (p.intercityPricePerKm !== undefined) out.intercity_price_per_km = p.intercityPricePerKm;
  return out;
}

// ============== ROUTES ==============
export function routeFromDb(r: any): Route {
  return {
    id: r.id,
    fromCity: r.from_city,
    toCity: r.to_city,
    distanceKm: r.distance_km,
    estimatedMinutes: r.estimated_minutes,
    fixedPrices: r.fixed_prices,
  };
}

// ============== PROMOS ==============
export function promoFromDb(r: any): Promo {
  return {
    id: r.id,
    code: r.code,
    discount: r.discount,
    validUntil: r.valid_until,
    maxUses: r.max_uses,
    usedCount: r.used_count,
    isActive: r.is_active,
  };
}

export function promoToDb(p: Promo): Record<string, any> {
  return {
    id: p.id,
    code: p.code,
    discount: p.discount,
    valid_until: p.validUntil,
    max_uses: p.maxUses,
    used_count: p.usedCount,
    is_active: p.isActive,
  };
}

// ============== REVIEWS ==============
export function reviewFromDb(r: any): Review {
  return {
    id: r.id,
    createdAt: r.created_at,
    customerName: r.customer_name,
    rating: r.rating,
    text: r.text,
    city: r.city ?? undefined,
    isPublished: r.is_published,
  };
}

export function reviewToDb(r: Review): Record<string, any> {
  return {
    id: r.id,
    created_at: r.createdAt,
    customer_name: r.customerName,
    rating: r.rating,
    text: r.text,
    city: r.city ?? null,
    is_published: r.isPublished,
  };
}

// Generic snake-to-camel patch builder (for partial updates)
export function patchToSnake(patch: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(patch)) {
    const snake = k.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
    out[snake] = v;
  }
  return out;
}
