'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Car, Star, MapPin, Calendar, Phone, Users,
  CheckCircle2, XCircle, RefreshCcw, Loader2, DollarSign, Sparkles, Shield, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, Driver } from '@/types';
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils';
import { SPRING } from '@/lib/design-tokens';

export default function DriverDashboard() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [available, setAvailable] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'available' | 'my'>('available');
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/driver/orders');
      if (res.status === 401) {
        router.push('/driver');
        return;
      }
      const data = await res.json();
      setDriver(data.driver);
      setAvailable(data.available ?? []);
      setMyOrders(data.myOrders ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/driver/orders/${id}/accept`, { method: 'POST' });
      if (res.ok) {
        toast.success('Заказ успешно принят! Перезвоните клиенту для согласования.');
        fetchData();
        setTab('my');
      } else {
        const err = await res.json();
        toast.error(err.error === 'Order already taken' ? 'Заказ уже взял другой водитель' : 'Не удалось принять заказ');
      }
    } catch {
      toast.error('Ошибка сети');
    }
  };

  const changeStatus = async (id: string, status: 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/driver/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Статус поездки успешно обновлен');
        fetchData();
      }
    } catch {
      toast.error('Не удалось обновить статус');
    }
  };

  const logout = async () => {
    await fetch('/api/driver/logout', { method: 'POST' });
    router.push('/driver');
  };

  if (loading || !driver) {
    return (
      <div className="min-h-screen bg-graphite-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Загрузка данных водителя...</p>
        </div>
      </div>
    );
  }

  const completedToday = myOrders.filter(o => {
    if (o.status !== 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(o.updatedAt) >= today;
  });
  const todayEarnings = completedToday.reduce((s, o) => s + (o.finalPrice ?? o.estimatedPrice), 0);
  const totalEarnings = myOrders
    .filter(o => o.status === 'completed')
    .reduce((s, o) => s + (o.finalPrice ?? o.estimatedPrice), 0);

  return (
    <div className="min-h-screen bg-graphite-950 text-white p-4 md:p-8 relative overflow-x-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 noise pointer-events-none z-0" />

      {/* Header Profile Panel */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between flex-wrap gap-4 relative z-10">
        <div className="flex items-center gap-4 text-left">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-glow-sm">
            {driver.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white font-display">{driver.name}</span>
              {/* Online/Offline status pills */}
              <button
                onClick={() => {
                  setIsOnline(!isOnline);
                  toast.success(isOnline ? 'Вы вышли из сети' : 'Вы вошли в сеть');
                }}
                className={cn(
                  'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-all duration-300',
                  isOnline
                    ? 'bg-mint-500/10 border-mint-500/30 text-mint-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', isOnline ? 'bg-mint-400 animate-pulse' : 'bg-slate-500')} />
                {isOnline ? 'В сети' : 'Вне сети'}
              </button>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-semibold text-white">{driver.rating.toFixed(1)}</span>
              <span>·</span>
              <span>{driver.totalTrips} поездок</span>
            </div>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={fetchData}
            className="p-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1.5 text-slate-200"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Обновить
          </button>
          <button
            onClick={logout}
            className="p-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-pink-500/10 hover:border-pink-500/20 hover:text-pink-400 transition text-xs font-semibold flex items-center gap-1.5 text-slate-300"
          >
            <LogOut className="w-3.5 h-3.5" /> Выйти
          </button>
        </div>
      </div>

      {/* Driver stats blocks */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-2 p-5 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:opacity-20 transition" />
          <Sparkles className="w-7 h-7 text-indigo-400 mb-3" />
          <span className="text-xs text-slate-400 font-medium">Доход сегодня</span>
          <span className="text-2xl font-bold font-display text-white mt-1.5 block">{formatPrice(todayEarnings)}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1.5 uppercase tracking-wider">{completedToday.length} поездок сегодня</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-2 p-5 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:opacity-20 transition" />
          <Trophy className="w-7 h-7 text-emerald-400 mb-3" />
          <span className="text-xs text-slate-400 font-medium">Общий доход</span>
          <span className="text-2xl font-bold font-display text-white mt-1.5 block">{formatPrice(totalEarnings)}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1.5 uppercase tracking-wider">Зарегистрировано</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="glass-2 p-5 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:opacity-20 transition" />
          <Car className="w-7 h-7 text-amber-400 mb-3" />
          <span className="text-xs text-slate-400 font-medium">Ваш автомобиль</span>
          <span className="text-base font-bold text-white mt-1.5 block truncate">{driver.carModel}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1.5 uppercase tracking-wider">{driver.carNumber} · {driver.carClass}</span>
        </motion.div>
      </div>

      {/* Tabs segment */}
      <div className="max-w-6xl mx-auto mb-6 relative z-10 flex">
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-1 inline-flex">
          <button
            onClick={() => setTab('available')}
            className={cn(
              'px-5 py-2 rounded-lg text-xs font-semibold transition-all relative flex items-center gap-1.5',
              tab === 'available'
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Доступные заказы
            {available.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-white">
                {available.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('my')}
            className={cn(
              'px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
              tab === 'my'
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Мои поездки
            {myOrders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-white">
                {myOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Request order lists */}
      <div className="max-w-6xl mx-auto space-y-4 relative z-10">
        {(tab === 'available' ? available : myOrders).length === 0 ? (
          <div
            className="glass-card-strong p-16 text-center border-slate-900 shadow-depth-sm text-slate-500"
            style={{ background: 'rgba(12, 14, 28, 0.45)' }}
          >
            {tab === 'available' ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-400">Нет доступных заказов</p>
                <p className="text-xs text-slate-500">Система опрашивает новые заявки. Ожидайте.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-400">У вас пока нет поездок</p>
                <p className="text-xs text-slate-500">Выберите подходящую заявку во вкладке доступных.</p>
              </div>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {(tab === 'available' ? available : myOrders).map((order, idx) => {
              const status = statusLabel(order.status);
              const isMy = tab === 'my';
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ ...SPRING.stiff, delay: idx * 0.05 }}
                  className="glass-2 p-5 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                    {isMy ? (
                      <div className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', status.color)}>
                        {status.text}
                      </div>
                    ) : (
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        Новый заказ
                      </span>
                    )}
                    <div className="text-xl font-bold font-display text-white">
                      {formatPrice(order.estimatedPrice)}
                    </div>
                  </div>

                  {/* Route & customer specs grid */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-xs">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Откуда</span>
                          <span className="text-sm font-semibold text-white mt-0.5 block">{order.fromCity}, {order.fromAddress}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Куда</span>
                          <span className="text-sm font-semibold text-white mt-0.5 block">{order.toCity}, {order.toAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 self-center">
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Время отправления</span>
                        <span className="text-xs text-slate-300 font-medium block mt-0.5">{formatDate(order.scheduledAt)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Пассажиры</span>
                        <span className="text-xs text-slate-300 font-medium block mt-0.5">{order.passengers} чел / {order.luggage} багаж</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Пассажир</span>
                        <a href={`tel:${order.customerPhone}`} className="text-xs text-primary-400 font-semibold block mt-0.5 hover:underline">
                          {order.customerName} · {order.customerPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {order.comment && (
                    <div className="text-xs text-slate-300 bg-slate-900 border border-slate-800 p-2.5 rounded-xl mb-4 italic">
                      💬 {order.comment}
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900">
                    {!isMy && order.status === 'pending' && (
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Принять заказ
                      </button>
                    )}
                    {isMy && order.status === 'accepted' && (
                      <button
                        onClick={() => changeStatus(order.id, 'in_progress')}
                        className="h-10 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Car className="w-4 h-4 text-indigo-400" /> Начать поездку
                      </button>
                    )}
                    {isMy && order.status === 'in_progress' && (
                      <button
                        onClick={() => changeStatus(order.id, 'completed')}
                        className="h-10 px-4 rounded-xl bg-mint-500/10 border border-mint-500/20 text-mint-300 hover:bg-mint-500/20 transition-all text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-mint-400" /> Завершить поездку
                      </button>
                    )}
                    {isMy && ['accepted'].includes(order.status) && (
                      <button
                        onClick={() => changeStatus(order.id, 'cancelled')}
                        className="h-10 px-4 rounded-xl bg-pink-500/5 border border-pink-500/20 text-pink-400 hover:bg-pink-500/10 transition-all text-xs font-semibold flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-pink-500" /> Отменить
                      </button>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-3 text-left">Заявка ID: {order.id}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
