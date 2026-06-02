import { Order } from '@/types';

/**
 * Заготовка для платёжных систем Кыргызстана.
 *
 * Поддерживаемые системы:
 *  - MBank (https://mbank.kg)
 *  - O!Dengi (https://odengi.kg)
 *  - FreedomPay (для Visa/MC)
 *
 * Каждая требует договора с банком и API-ключей.
 * После получения ключей добавьте в .env.local и реализуйте логику.
 */

const MBANK_KEY = process.env.MBANK_API_KEY;
const ODENGI_KEY = process.env.ODENGI_API_KEY;
const FREEDOM_KEY = process.env.FREEDOMPAY_API_KEY;

export function isPaymentsConfigured(method: 'mbank' | 'odengi' | 'card'): boolean {
  if (method === 'mbank') return Boolean(MBANK_KEY);
  if (method === 'odengi') return Boolean(ODENGI_KEY);
  if (method === 'card') return Boolean(FREEDOM_KEY);
  return false;
}

export interface PaymentLink {
  url: string;
  qrCode?: string;
  expiresAt: string;
}

/**
 * Создание ссылки на оплату для конкретного заказа.
 * Возвращает URL, на который нужно отправить клиента.
 */
export async function createPaymentLink(
  order: Order,
  method: 'mbank' | 'odengi' | 'card'
): Promise<PaymentLink | null> {
  if (!isPaymentsConfigured(method)) {
    // Заглушка для разработки: возвращаем фейковую ссылку
    return {
      url: `/payment/mock?orderId=${order.id}&method=${method}&amount=${order.estimatedPrice}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  // TODO: реализовать вызов API соответствующего платёжного шлюза
  // Пример для MBank:
  // const res = await fetch('https://api.mbank.kg/v1/payments/create', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${MBANK_KEY}` },
  //   body: JSON.stringify({
  //     amount: order.estimatedPrice,
  //     currency: 'KGS',
  //     orderId: order.id,
  //     description: `Оплата заказа такси`,
  //   }),
  // });

  return null;
}
