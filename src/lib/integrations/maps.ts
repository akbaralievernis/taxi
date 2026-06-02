/**
 * Заготовка для интеграции с 2GIS / Яндекс.Картами.
 *
 * Для полной интеграции:
 * 1. Зарегистрируйтесь на https://dev.2gis.com (бесплатно для старта)
 * 2. Получите API ключ для геокодинга и поиска адресов
 * 3. Добавьте в .env.local:
 *    NEXT_PUBLIC_2GIS_API_KEY=...
 *
 * Альтернатива — OpenStreetMap (Nominatim) бесплатно без ключа.
 */

const TWO_GIS_KEY = process.env.NEXT_PUBLIC_2GIS_API_KEY;

export function isMapsConfigured(): boolean {
  return Boolean(TWO_GIS_KEY);
}

export interface AddressSuggestion {
  name: string;
  fullName: string;
  city: string;
  lat?: number;
  lon?: number;
}

/**
 * Поиск адресов через 2GIS Catalog API.
 * Если ключа нет — возвращает заглушки (популярные адреса города).
 */
export async function searchAddresses(query: string, city: string): Promise<AddressSuggestion[]> {
  if (!query || query.length < 2) return [];

  if (!isMapsConfigured()) {
    // Fallback на популярные адреса для каждого города
    return getPopularAddresses(city)
      .filter(a => a.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }

  try {
    const url = `https://catalog.api.2gis.com/3.0/items?q=${encodeURIComponent(query)}` +
                `&fields=items.point,items.address_name&key=${TWO_GIS_KEY}` +
                `&region_id=${city2gisId(city)}&page_size=6`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.result?.items ?? []).map((item: any) => ({
      name: item.name,
      fullName: item.address_name ?? item.full_name ?? item.name,
      city,
      lat: item.point?.lat,
      lon: item.point?.lon,
    }));
  } catch {
    return [];
  }
}

function city2gisId(city: string): string {
  const map: Record<string, string> = {
    'Бишкек': '38',
    'Ош': '125',
  };
  return map[city] ?? '38';
}

function getPopularAddresses(city: string): AddressSuggestion[] {
  const popular: Record<string, AddressSuggestion[]> = {
    'Бишкек': [
      { name: 'Аэропорт Манас', fullName: 'Аэропорт Манас, Бишкек', city: 'Бишкек' },
      { name: 'Ж/д вокзал', fullName: 'Железнодорожный вокзал, Бишкек', city: 'Бишкек' },
      { name: 'ЦУМ Айчурек', fullName: 'ЦУМ Айчурек, пр. Чуй 155, Бишкек', city: 'Бишкек' },
      { name: 'Дордой', fullName: 'Рынок Дордой, Бишкек', city: 'Бишкек' },
      { name: 'Ошский рынок', fullName: 'Ошский рынок, Бишкек', city: 'Бишкек' },
      { name: 'Площадь Ала-Тоо', fullName: 'Площадь Ала-Тоо, Бишкек', city: 'Бишкек' },
      { name: 'АУЦА', fullName: 'Американский университет, Бишкек', city: 'Бишкек' },
      { name: 'Asia Mall', fullName: 'Asia Mall, ул. Иса Ахунбаева, Бишкек', city: 'Бишкек' },
    ],
    'Ош': [
      { name: 'Аэропорт Ош', fullName: 'Международный аэропорт Ош', city: 'Ош' },
      { name: 'Центральный рынок', fullName: 'Центральный рынок, Ош', city: 'Ош' },
      { name: 'Сулайман-Тоо', fullName: 'Гора Сулайман-Тоо, Ош', city: 'Ош' },
      { name: 'Ж/д вокзал', fullName: 'Железнодорожный вокзал, Ош', city: 'Ош' },
    ],
  };
  return popular[city] ?? [];
}
