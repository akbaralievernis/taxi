/**
 * SMS-уведомления для подтверждения заказа.
 *
 * Заготовка под популярные сервисы Кыргызстана:
 *  - NikitaSMS (https://nikita.kg)
 *  - SMSC.kg (https://smsc.kg)
 *
 * Настройка в .env.local:
 *   SMS_PROVIDER=nikita | smsc
 *   SMS_LOGIN=...
 *   SMS_PASSWORD=...
 *   SMS_SENDER=TaxiKG
 */

const PROVIDER = process.env.SMS_PROVIDER as 'nikita' | 'smsc' | undefined;
const LOGIN = process.env.SMS_LOGIN;
const PASSWORD = process.env.SMS_PASSWORD;
const SENDER = process.env.SMS_SENDER ?? 'TaxiKG';

export function isSmsConfigured(): boolean {
  return Boolean(PROVIDER && LOGIN && PASSWORD);
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('996')) return digits;
  if (digits.startsWith('0')) return '996' + digits.slice(1);
  return digits;
}

export async function sendSms(phone: string, message: string): Promise<{ success: boolean }> {
  if (!isSmsConfigured()) return { success: false };

  const to = normalizePhone(phone);
  if (to.length < 12) return { success: false };

  try {
    if (PROVIDER === 'nikita') {
      const params = new URLSearchParams({
        login: LOGIN!,
        pwd: PASSWORD!,
        id: String(Date.now()),
        sender: SENDER,
        text: message,
        phones: to,
      });
      await fetch(`https://smspro.nikita.kg/api/message?${params}`);
      return { success: true };
    }
    if (PROVIDER === 'smsc') {
      const params = new URLSearchParams({
        login: LOGIN!,
        psw: PASSWORD!,
        phones: to,
        mes: message,
        sender: SENDER,
        charset: 'utf-8',
      });
      await fetch(`https://smsc.kg/sys/send.php?${params}`);
      return { success: true };
    }
  } catch (e) {
    console.error('SMS failed:', e);
  }
  return { success: false };
}

export async function sendOrderConfirmation(phone: string, orderId: string, price: number): Promise<void> {
  if (!isSmsConfigured()) return;
  const text = `Taxi KG: ваш заказ ${orderId} принят. Стоимость ${price} сом. Скоро вам позвонит водитель.`;
  await sendSms(phone, text);
}
