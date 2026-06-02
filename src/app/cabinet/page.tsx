'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Search, MapPin, Calendar, Car, RefreshCcw, X,
  CheckCircle2, Clock, Sparkles, Repeat, ArrowLeft, LogOut, Info, ShieldCheck, Compass
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Order } from '@/types';
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils';
import Header from '@/components/Header';
import { SPRING } from '@/lib/design-tokens';

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
    if (phone.replace(/\D/g, '').length < 9) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    fetchOrders(phone);
  };

  const cancelOrder = async (order: Order) => {
    if (!confirm('Вы действительно хотите отменить заказ?')) return;
    try {
      const res = await fetch(`/api/customer/order/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        toast.success('Заказ успешно отменён');
        fetchOrders(phone);
      } else {
        toast.error('Не удалось отменить заказ');
      }
    } catch {
      toast.error('Произошла ошибка при отмене');
    }
  };

  const logout = () => {
    localStorage.removeItem('customer_phone');
    setPhone('');
    setOrders([]);
    setSearched(false);
  };

  // Stats calculation
  const activeOrders = orders.filter(o => ['pending', 'accepted', 'driver_assigned', 'arrived', 'picked_up'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <main className="min-h-screen bg-graphite-950 text-white overflow-x-hidden">
      <Header />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 noise pointer-events-none z-0" />

      <section className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> На главную
          </Link>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white mb-2">
              Личный кабинет
            </h1>
            <p className="text-slate-400 text-sm md:text-base">Отслеживайте текущие поездки и просматривайте историю заказов</p>
          </motion.div>

          {!searched && !loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-strong p-6 md:p-8 max-w-lg mx-auto border-slate-800/80 shadow-depth-md"
              style={{ background: 'rgba(12, 14, 28, 0.75)' }}
            >
              <form onSubmit={handleSearch} className="space-y-5">
                <div>
                  <label className="label-field text-slate-300">
                    <Phone className="w-4 h-4 inline mr-2 text-indigo-400" />
                    Ваш номер телефона
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+996 555 123 456"
                    className="input-field"
                    style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary w-full h-12 flex items-center justify-center gap-2 font-semibold">
                  <Search className="w-4.5 h-4.5" />
                  Найти мои заказы
                </button>
              </form>
            </motion.div>
          ) : loading ? (
            /* Skeleton Loading State */
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="skeleton h-24 w-full" />
              <div className="skeleton h-44 w-full" />
              <div className="skeleton h-44 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-strong p-8 text-center max-w-xl mx-auto border-slate-800/80 shadow-depth-md space-y-5"
              style={{ background: 'rgba(12, 14, 28, 0.65)' }}
            >
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">Заказов не найдено</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  По номеру {phone} ещё не было оформлено ни одного заказа в нашей системе.
                </p>
              </div>
              <div className="flex gap-3.5 justify-center pt-2">
                <button onClick={logout} className="btn-ghost h-10 px-5 text-xs text-white border-slate-800">
                  Сменить номер
                </button>
                <Link href="/#order" className="btn-primary h-10 px-5 text-xs flex items-center justify-center font-semibold">
                  Сделать первый заказ
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Premium Dashboard Summary Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING.stiff, delay: 0.1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/10 to-purple-500/5 border border-slate-800/80 shadow-depth-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3.5 relative z-10 text-left">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 text-lg">
                    {phone.slice(-2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-none">Личный кабинет клиента</h3>
                    <span className="text-xs text-slate-400 block mt-1">{phone}</span>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="flex gap-5 relative z-10 shrink-0">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Активных</span>
                    <span className="text-lg font-bold font-display text-primary-400 mt-0.5 block">{activeOrders.length}</span>
                  </div>
                  <div className="w-[1px] bg-slate-800 self-stretch" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Всего поездок</span>
                    <span className="text-lg font-bold font-display text-white mt-0.5 block">{orders.length}</span>
                  </div>
                  <div className="w-[1px] bg-slate-800 self-stretch" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchOrders(phone)}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900 transition-colors text-slate-300 hover:text-white"
                      title="Обновить"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={logout}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-pink-500/10 hover:border-pink-500/20 hover:text-pink-400 transition-colors text-slate-300"
                      title="Выйти"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Order Timeline List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {orders.map((order, idx) => {
                    const status = statusLabel(order.status);
                    const isActive = ['pending', 'accepted', 'driver_assigned', 'arrived', 'picked_up'].includes(order.status);
                    return (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ ...SPRING.stiff, delay: idx * 0.05 }}
                        className={`glass-2 p-5 rounded-2xl border text-left relative overflow-hidden transition-all duration-300 ${
                          isActive ? 'border-primary-500/30' : 'border-slate-800/80 hover:border-slate-700/60'
                        }`}
                      >
                        {/* Status label header */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                          <div className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', status.color)}>
                            {status.text}
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        {/* Order timeline details */}
                        <div className="grid sm:grid-cols-2 gap-4.5 mb-5">
                          <div className="flex gap-2.5 items-start">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Откуда ({order.fromCity})</span>
                              <span className="text-sm font-semibold text-white mt-0.5 block">{order.fromAddress}</span>
                            </div>
                          </div>

                          <div className="flex gap-2.5 items-start">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 mt-1 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Куда ({order.toCity})</span>
                              <span className="text-sm font-semibold text-white mt-0.5 block">{order.toAddress}</span>
                            </div>
                          </div>

                          <div className="flex gap-2.5 items-start">
                            <Calendar className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Время подачи</span>
                              <span className="text-xs text-slate-300 mt-0.5 block">{formatDate(order.scheduledAt)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2.5 items-start">
                            <Car className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Класс поездки</span>
                              <span className="text-xs text-slate-300 mt-0.5 block uppercase font-bold">{order.carClass}</span>
                            </div>
                          </div>
                        </div>

                        {/* Driver allocation status info */}
                        {order.driverName && (
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs shrink-0">
                                {order.driverName.slice(0, 2)}
                              </div>
                              <div className="text-left">
                                <span className="text-xs font-semibold text-white block">{order.driverName}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{order.carModel} · {order.carNumber}</span>
                              </div>
                            </div>
                            <a
                              href={`tel:${order.driverPhone}`}
                              className="btn-ghost py-1.5 px-3.5 h-8 text-[11px] font-semibold border-slate-800 text-white flex items-center gap-1 hover:bg-slate-950"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              Позвонить
                            </a>
                          </div>
                        )}

                        {/* Footer details pricing & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-900 flex-wrap gap-4">
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Стоимость поездки</span>
                            <span className="text-xl font-bold font-display text-white mt-0.5 block">
                              {formatPrice(order.finalPrice ?? order.estimatedPrice)}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {['pending', 'accepted'].includes(order.status) && (
                              <button
                                onClick={() => cancelOrder(order)}
                                className="h-10 px-4 rounded-xl border border-pink-500/20 hover:border-pink-500/40 text-pink-400 bg-pink-500/5 hover:bg-pink-500/10 transition text-xs font-semibold flex items-center gap-1.5"
                              >
                                <X className="w-3.5 h-3.5" /> Отменить заказ
                              </button>
                            )}
                            <Link
                              href={`/#order`}
                              className="h-10 px-4 rounded-xl border border-primary-500/20 hover:border-primary-500/40 text-primary-300 bg-primary-500/5 hover:bg-primary-500/10 transition text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Repeat className="w-3.5 h-3.5 text-primary-400" /> Повторить
                            </Link>
                          </div>
                        </div>

                        {/* Tiny order footer metadata */}
                        <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                          <span>ID: {order.id}</span>
                          {order.comment && (
                            <span className="flex items-center gap-1 max-w-[200px] truncate" title={order.comment}>
                              <Info className="w-3 h-3 text-slate-500 shrink-0" />
                              Комментарий: {order.comment}
                            </span>
                          )}
                        </div>
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
