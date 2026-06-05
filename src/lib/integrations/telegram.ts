import { Order } from '@/types';

/**
 * Telegram-бот для уведомлений водителей о новых заказах.
 *
 * Каждое сообщение содержит inline-кнопки, ведущие водителя
 * прямо в его кабинет на сайте — сайт остаётся центром данных,
 * Telegram = быстрый канал уведомлений.
 *
 * Настройка:
 *   1. Создайте бота у @BotFather → получите TOKEN
 *   2. Для личного чата: напишите боту /start, потом запросите
 *      https://api.telegram.org/bot<TOKEN>/getUpdates → chat.id
 *      Для группы: добавьте бота, напишите в группе /start, тем же
 *      запросом получите id (отрицательное число, начинается с -100…).
 *   3. В Vercel env:
 *        TELEGRAM_BOT_TOKEN=...
 *        TELEGRAM_CHAT_ID=...
 *        SITE_URL=https://taxi-puce.vercel.app   (опционально, дефолт ниже)
 */

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;
const SITE_URL = process.env.SITE_URL ?? 'https://taxi-puce.vercel.app';

const carClassNames: Record<string, string> = {
  economy: '🚗 Эконом',
  comfort: '🚙 Комфорт',
  business: '🏎 Бизнес',
  minivan: '🚐 Минивэн',
  cargo: '🚚 Грузовое',
};

export function isTelegramConfigured(): boolean {
  return Boolean(TG_TOKEN && TG_CHAT);
}

export async function notifyNewOrder(order: Order): Promise<void> {
  if (!isTelegramConfigured()) return;

  const carClass = carClassNames[order.carClass] ?? order.carClass;
  const when = new Date(order.scheduledAt).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  const text = [
    '🚖 *НОВЫЙ ЗАКАЗ*',
    '━━━━━━━━━━━━━━━',
    '',
    `📍 *Откуда:* ${order.fromCity}, ${order.fromAddress}`,
    `🎯 *Куда:* ${order.toCity}, ${order.toAddress}`,
    '',
    `🕐 *Когда:* ${when}`,
    `👥 *Пассажиров:* ${order.passengers}  ·  🎒 *Багажа:* ${order.luggage}`,
    `${carClass}  ·  💳 ${order.paymentMethod === 'cash' ? 'Наличные' : 'Карта'}`,
    '',
    `💵 *Цена:* \`${order.estimatedPrice.toLocaleString('ru-RU')} сом\``,
    '',
    `👤 *Клиент:* ${order.customerName}`,
    `📞 [${order.customerPhone}](tel:${order.customerPhone.replace(/\s/g, '')})`,
    order.comment ? '' : null,
    order.comment ? `💬 _${order.comment}_` : null,
    '',
    `🆔 \`${order.id}\``,
  ].filter((s) => s !== null).join('\n');

  // Inline-кнопки: водитель идёт в свой кабинет/трекинг на сайте
  const reply_markup = {
    inline_keyboard: [
      [
        {
          text: '🟢 Принять заказ',
          url: `${SITE_URL}/driver/dashboard?accept=${order.id}`,
        },
      ],
      [
        {
          text: `📞 Позвонить клиенту`,
          url: `tel:${order.customerPhone.replace(/\s/g, '')}`,
        },
        {
          text: '🗺 Маршрут',
          url: `https://2gis.kg/${encodeURIComponent(order.fromCity)}/search/${encodeURIComponent(order.fromAddress + ' до ' + order.toAddress)}`,
        },
      ],
      [
        {
          text: '⚙️ Админка',
          url: `${SITE_URL}/admin/dashboard/orders`,
        },
      ],
    ],
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('[telegram] notifyNewOrder failed:', res.status, body);
    }
  } catch (e) {
    console.error('[telegram] notifyNewOrder error:', e);
  }
}

/**
 * Уведомление об изменении статуса (опционально, для будущей реализации).
 */
export async function notifyOrderStatus(order: Order): Promise<void> {
  if (!isTelegramConfigured()) return;

  const statusLabels: Record<string, string> = {
    accepted:    '✅ ПРИНЯТ',
    in_progress: '🚖 В ПУТИ',
    completed:   '🏁 ЗАВЕРШЁН',
    cancelled:   '❌ ОТМЕНЁН',
  };
  const label = statusLabels[order.status];
  if (!label) return;

  const text = [
    `${label}`,
    `🆔 \`${order.id}\``,
    `${order.fromCity} → ${order.toCity}`,
    order.driverName ? `🚗 ${order.driverName}` : null,
  ].filter(Boolean).join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (e) {
    console.error('[telegram] notifyOrderStatus error:', e);
  }
}
