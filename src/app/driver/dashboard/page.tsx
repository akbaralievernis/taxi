'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Car, Star, MapPin, Calendar, Phone, Users,
  CheckCircle2, XCircle, RefreshCcw, Loader2, DollarSign, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, Driver } from '@/types';
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils';

export default function DriverDashboard() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [available, setAvailable] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'available' | 'my'>('available');
  const [loading, setLoading] = useState(true);

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
        toast.success('Заказ принят!');
        fetchData();
        setTab('my');
      } else {
        const err = await res.json();
        toast.error(err.error === 'Order already taken' ? 'Заказ уже взял другой водитель' : 'Ошибка');
      }
    } catch {
      toast.error('Ошибка');
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
        toast.success('Статус обновлён');
        fetchData();
      }
    } catch {
      toast.error('Ошибка');
    }
  };

  const logout = async () => {
    await fetch('/api/driver/logout', { method: 'POST' });
    router.push('/driver');
  };

  if (loading || !driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-400" />
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
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            {driver.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-lg">{driver.name}</div>
            <div className="text-sm text-white/60 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              {driver.rating.toFixed(1)} · {driver.totalTrips} поездок
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm flex items-center gap-1"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Обновить
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition text-sm flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Выйти
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <Sparkles className="w-8 h-8 text-primary-400 mb-2" />
          <div className="text-sm text-white/60">Доход сегодня</div>
          <div className="text-2xl font-bold gradient-text">{formatPrice(todayEarnings)}</div>
          <div className="text-xs text-white/40 mt-1">{completedToday.length} поездок</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <DollarSign className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-sm text-white/60">Общий доход</div>
          <div className="text-2xl font-bold">{formatPrice(totalEarnings)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <Car className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-sm text-white/60">Ваше авто</div>
          <div className="font-semibold">{driver.carModel}</div>
          <div className="text-xs text-white/60">{driver.carNumber} · {driver.carClass}</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="glass-card p-1 inline-flex">
          <button
            onClick={() => setTab('available')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm transition relative',
              tab === 'available'
                ? 'bg-primary-500 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            Доступные заказы
            {available.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">{available.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab('my')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm transition',
              tab === 'my'
                ? 'bg-primary-500 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            Мои поездки ({myOrders.length})
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="max-w-6xl mx-auto space-y-3">
        {(tab === 'available' ? available : myOrders).length === 0 ? (
          <div className="glass-card p-12 text-center text-white/60">
            {tab === 'available' ? 'Нет доступных заказов. Ожидайте.' : 'У вас пока нет поездок.'}
          </div>
        ) : (
          <AnimatePresence>
            {(tab === 'available' ? available : myOrders).map((order) => {
              const status = statusLabel(order.status);
              const isMy = tab === 'my';
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-card p-4 md:p-5"
                >
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    {isMy && (
                      <div className={cn('px-3 py-1 rounded-full text-xs border', status.color)}>
                        {status.text}
                      </div>
                    )}
                    <div className="text-2xl font-bold gradient-text ml-auto">
                      {formatPrice(order.estimatedPrice)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                        <div>{order.fromCity}, {order.fromAddress}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-400 mt-0.5" />
                        <div>{order.toCity}, {order.toAddress}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-primary-400 mt-0.5" />
                        <div>{formatDate(order.scheduledAt)}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-primary-400 mt-0.5" />
                        <div>{order.passengers} чел / {order.luggage} багажа</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-primary-400 mt-0.5" />
                        <a href={`tel:${order.customerPhone}`} className="text-primary-400 hover:underline">
                          {order.customerName} · {order.customerPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {order.comment && (
                    <div className="text-sm text-white/70 italic mb-3 p-2 rounded bg-white/5">
                      💬 {order.comment}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                    {!isMy && order.status === 'pending' && (
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="btn-primary text-sm flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Принять заказ
                      </button>
                    )}
                    {isMy && order.status === 'accepted' && (
                      <button
                        onClick={() => changeStatus(order.id, 'in_progress')}
                        className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition text-sm flex items-center gap-2"
                      >
                        <Car className="w-4 h-4" /> Начать поездку
                      </button>
                    )}
                    {isMy && order.status === 'in_progress' && (
                      <button
                        onClick={() => changeStatus(order.id, 'completed')}
                        className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 transition text-sm flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Завершить
                      </button>
                    )}
                    {isMy && ['accepted'].includes(order.status) && (
                      <button
                        onClick={() => changeStatus(order.id, 'cancelled')}
                        className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition text-sm flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Отменить
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
