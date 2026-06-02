import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' сом';
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('996')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function statusLabel(status: string): { text: string; color: string } {
  const map: Record<string, { text: string; color: string }> = {
    pending: { text: 'Ожидает', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    accepted: { text: 'Принят', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    in_progress: { text: 'В пути', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    completed: { text: 'Завершён', color: 'bg-green-500/20 text-green-300 border-green-500/40' },
    cancelled: { text: 'Отменён', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
  };
  return map[status] ?? { text: status, color: 'bg-gray-500/20 text-gray-300' };
}
