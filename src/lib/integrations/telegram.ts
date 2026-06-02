import { Order } from '@/types';

/**
 * Telegram-бот для уведомлений водителей о новых заказах.
 *
 * Настройка:
 * 1. Создайте бота у @BotFather и получите токен
 * 2. Создайте канал/чат и пригласите бота как админа
 * 3. Узнайте chat_id канала
 * 4. Добавьте в .env.local:
 *    TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
 *    TELEGRAM_CHAT_ID=-1001234567890
 */

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

export function isTelegramConfigured(): boolean {
  return Boolean(TG_TOKEN && TG_CHAT);
}

export async function notifyNewOrder(order: Order): Promise<void> {
  if (!isTelegramConfigured()) return;

  const carClass = {
    economy: 'Эконом',
    comfort: 'Комфорт',
    business: 'Бизнес',
    minivan: 'Минивэн',
    cargo: 'Грузовое',
  }[order.carClass] ?? order.carClass;

  const when = new Date(order.scheduledAt).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });

  const text = [
    '🚖 *Новый заказ*',
    '',
    `📍 *Откуда:* ${order.fromCity}, ${order.fromAddress}`,
    `🎯 *Куда:* ${order.toCity}, ${order.toAddress}`,
    `🕐 *Когда:* ${when}`,
    `👥 *Пассажиров:* ${order.passengers} · 🎒 Багажа: ${order.luggage}`,
    `🚗 *Класс:* ${carClass}`,
    `💵 *Цена:* ${order.estimatedPrice.toLocaleString('ru-RU')} сом`,
    '',
    `📞 *Контакт:* ${order.customerName}, ${order.customerPhone}`,
    order.comment ? `💬 _${order.comment}_` : '',
    '',
    `ID: \`${order.id}\``,
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
    console.error('Telegram notification failed:', e);
  }
}
