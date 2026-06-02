'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, ArrowLeft, MapPin, Calendar, Car, Hash } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Order } from '@/types';
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils';
import Header from '@/components/Header';

export default function TrackPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/order/${orderId.trim()}?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) {
        toast.error('Заказ не найден или номер не совпадает');
        setOrder(null);
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch {
      toast.error('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const status = order ? statusLabel(order.status) : null;

  const steps: Array<{ label: string; key: Order['status'] }> = [
    { label: 'Ожидает водителя', key: 'pending' },
    { label: 'Водитель принял', key: 'accepted' },
    { label: 'В пути', key: 'in_progress' },
    { label: 'Завершён', key: 'completed' },
  ];

  const currentStepIdx = order ? steps.findIndex(s => s.key === order.status) : -1;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/" className="inline-flex items-center gap-2 text-ink-muted hover:text-primary-500 mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> На главную
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">Отслеживание заказа</span>
            </h1>
            <p className="text-ink-muted mb-8">Проверьте статус вашей поездки</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 md:p-8 mb-6"
          >
            <div className="space-y-4">
              <div>
                <label className="label-field">
                  <Hash className="w-4 h-4 inline mr-2" />
                  ID заказа
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="ord_..."
                  className="input-field font-mono"
                  required
                />
              </div>
              <div>
                <label className="label-field">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Телефон, указанный в заказе
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+996 555 123 456"
                  className="input-field"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                {loading ? 'Ищем...' : 'Отследить'}
              </button>
            </div>
          </motion.form>

          {order && status && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8"
            >
              <div className={cn(
                'inline-flex px-3 py-1 rounded-full text-sm border mb-6',
                status.color
              )}>
                {status.text}
              </div>

              {/* Прогресс */}
              {order.status !== 'cancelled' && (
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-elevated" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700"
                      style={{
                        width: `calc(${(currentStepIdx / (steps.length - 1)) * 100}% - 16px)`,
                      }}
                    />
                    <div className="grid grid-cols-4 gap-2 relative">
                      {steps.map((step, i) => (
                        <div key={step.key} className="text-center">
                          <div className={cn(
                            'w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all',
                            i <= currentStepIdx
                              ? 'bg-gradient-to-br from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/40'
                              : 'bg-surface-elevated text-ink-subtle'
                          )}>
                            {i + 1}
                          </div>
                          <div className={cn(
                            'text-xs',
                            i <= currentStepIdx ? 'text-ink' : 'text-ink-subtle'
                          )}>
                            {step.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-mint-500 mt-0.5" />
                  <div>
                    <div className="text-ink-subtle text-xs">Откуда</div>
                    <div>{order.fromCity}, {order.fromAddress}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-pink-500 mt-0.5" />
                  <div>
                    <div className="text-ink-subtle text-xs">Куда</div>
                    <div>{order.toCity}, {order.toAddress}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-ink-subtle text-xs">Время</div>
                    <div>{formatDate(order.scheduledAt)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Car className="w-4 h-4 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-ink-subtle text-xs">Класс / Пассажиров</div>
                    <div className="capitalize">{order.carClass} · {order.passengers} чел.</div>
                  </div>
                </div>
              </div>

              {order.driverName && (
                <div className="mt-6 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30">
                  <div className="font-semibold text-accent-600 dark:text-accent-300 mb-2">Ваш водитель</div>
                  <div className="space-y-1 text-sm">
                    <div>{order.driverName}</div>
                    <a href={`tel:${order.driverPhone}`} className="text-accent-600 dark:text-accent-300 hover:underline flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {order.driverPhone}
                    </a>
                    {order.carModel && (
                      <div className="text-ink-muted">{order.carModel} · {order.carNumber}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-xs text-ink-subtle">Стоимость</div>
                  <div className="text-3xl font-bold gradient-text">
                    {formatPrice(order.finalPrice ?? order.estimatedPrice)}
                  </div>
                </div>
                <Link href="/cabinet" className="text-sm text-primary-500 hover:underline">
                  Все мои заказы →
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
