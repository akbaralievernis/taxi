'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Search, MapPin, Calendar, Car, RefreshCcw, X,
  CheckCircle2, Clock, Sparkles, Repeat, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Order } from '@/types';
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils';
import Header from '@/components/Header';

export default function CustomerCabinet() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('customer_phone');
    if (saved) {
      setPhone(saved);
      fetchOrders(saved);
    }
  }, []);

  const fetchOrders = async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/orders?phone=${encodeURIComponent(p)}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setSearched(true);
      localStorage.setItem('customer_phone', p);
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error('Введите корректный номер');
      return;
    }
    fetchOrders(phone);
  };

  const cancelOrder = async (order: Order) => {
    if (!confirm('Отменить заказ?')) return;
    try {
      const res = await fetch(`/api/customer/order/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        toast.success('Заказ отменён');
        fetchOrders(phone);
      } else {
        toast.error('Не удалось отменить');
      }
    } catch {
      toast.error('Ошибка');
    }
  };

  const logout = () => {
    localStorage.removeItem('customer_phone');
    setPhone('');
    setOrders([]);
    setSearched(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary-400 mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> На главную
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">Личный кабинет</span>
            </h1>
            <p className="text-white/60 mb-8">Просмотр истории и статуса ваших заказов</p>
          </motion.div>

          {!searched || orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 md:p-8 max-w-xl mx-auto"
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="label-field">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Ваш номер телефона
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+996 555 123 456"
                    className="input-field"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  {loading ? 'Поиск...' : 'Найти мои заказы'}
                </button>
              </form>

              {searched && orders.length === 0 && (
                <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm text-center">
                  Заказов по этому номеру не найдено.{' '}
                  <Link href="/#order" className="underline">Сделать первый заказ</Link>
                </div>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="text-sm text-white/60">
                  Найдено заказов: <strong className="text-white">{orders.length}</strong>
                  {' · '}{phone}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchOrders(phone)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm flex items-center gap-1"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Обновить
                  </button>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-300 transition text-sm"
                  >
                    Выйти
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {orders.map((order) => {
                    const status = statusLabel(order.status);
                    return (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="glass-card p-5"
                      >
                        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                          <div className={cn('px-3 py-1 rounded-full text-xs border', status.color)}>
                            {status.text}
                          </div>
                          <div className="text-sm text-white/40">{formatDate(order.createdAt)}</div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                            <div>
                              <div className="text-white/40 text-xs">Откуда</div>
                              <div>{order.fromCity}, {order.fromAddress}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-400 mt-0.5" />
                            <div>
                              <div className="text-white/40 text-xs">Куда</div>
                              <div>{order.toCity}, {order.toAddress}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-primary-400 mt-0.5" />
                            <div>
                              <div className="text-white/40 text-xs">Время</div>
                              <div>{formatDate(order.scheduledAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Car className="w-4 h-4 text-primary-400 mt-0.5" />
                            <div>
                              <div className="text-white/40 text-xs">Класс</div>
                              <div className="capitalize">{order.carClass}</div>
                            </div>
                          </div>
                        </div>

                        {order.driverName && (
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-3 text-sm">
                            <div className="font-semibold text-blue-300 mb-1">Ваш водитель</div>
                            <div>{order.driverName} · {order.driverPhone}</div>
                            {order.carModel && (
                              <div className="text-white/60 text-xs mt-1">
                                {order.carModel} · {order.carNumber}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-wrap gap-3">
                          <div>
                            <div className="text-xs text-white/40">Стоимость</div>
                            <div className="text-2xl font-bold gradient-text">
                              {formatPrice(order.finalPrice ?? order.estimatedPrice)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {['pending', 'accepted'].includes(order.status) && (
                              <button
                                onClick={() => cancelOrder(order)}
                                className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition text-sm flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" /> Отменить
                              </button>
                            )}
                            <Link
                              href={`/#order`}
                              className="px-3 py-2 rounded-lg bg-primary-500/20 border border-primary-500/40 text-primary-300 hover:bg-primary-500/30 transition text-sm flex items-center gap-1"
                            >
                              <Repeat className="w-3.5 h-3.5" /> Повторить
                            </Link>
                          </div>
                        </div>

                        <div className="text-xs text-white/40 mt-3 font-mono">ID: {order.id}</div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
