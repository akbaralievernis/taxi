'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, Clock, CheckCircle2, XCircle,
  TrendingUp, DollarSign, MapPin, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  topRoutes: Array<{ from: string; to: string; count: number }>;
  ordersByStatus: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: 'Всего заказов',
      value: stats.totalOrders,
      icon: ClipboardList,
      color: 'from-blue-500/20 to-cyan-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Ожидают',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-yellow-500/20 to-orange-500/10',
      iconColor: 'text-yellow-400',
    },
    {
      label: 'Завершено',
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: 'from-green-500/20 to-emerald-500/10',
      iconColor: 'text-green-400',
    },
    {
      label: 'Отменено',
      value: stats.cancelledOrders,
      icon: XCircle,
      color: 'from-red-500/20 to-pink-500/10',
      iconColor: 'text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Дашборд</span>
        </h1>
        <p className="text-white/60">Обзор работы такси-сервиса</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`glass-card p-5 bg-gradient-to-br ${card.color}`}
          >
            <card.icon className={`w-8 h-8 ${card.iconColor} mb-3`} />
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm text-white/60 mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-primary-500/30"
        >
          <div className="flex items-start justify-between mb-3">
            <DollarSign className="w-10 h-10 text-primary-400" />
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              Доход
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Общий доход</div>
          <div className="text-3xl md:text-4xl font-bold gradient-text">
            {formatPrice(stats.totalRevenue)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <Sparkles className="w-10 h-10 text-primary-400" />
            <div className="text-sm text-white/60">Сегодня</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-white/60 mb-1">Заказов</div>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-1">Доход</div>
              <div className="text-2xl font-bold gradient-text">
                {formatPrice(stats.todayRevenue)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top routes */}
      {stats.topRoutes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-400" />
            Топ маршрутов
          </h2>
          <div className="space-y-3">
            {stats.topRoutes.map((route, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span>{route.from}</span>
                  <span className="text-white/40">→</span>
                  <span>{route.to}</span>
                </div>
                <div className="text-primary-400 font-semibold">{route.count} поездок</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Link href="/admin/dashboard/orders" className="glass-card p-5 hover:border-primary-500/50 transition-all hover:-translate-y-1 group">
          <ClipboardList className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition" />
          <div className="font-semibold">Управление заказами</div>
          <div className="text-sm text-white/60">Просмотр и обработка</div>
        </Link>
        <Link href="/admin/dashboard/drivers" className="glass-card p-5 hover:border-primary-500/50 transition-all hover:-translate-y-1 group">
          <Sparkles className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition" />
          <div className="font-semibold">Водители</div>
          <div className="text-sm text-white/60">Добавление и контроль</div>
        </Link>
        <Link href="/admin/dashboard/tariffs" className="glass-card p-5 hover:border-primary-500/50 transition-all hover:-translate-y-1 group">
          <DollarSign className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition" />
          <div className="font-semibold">Тарифы</div>
          <div className="text-sm text-white/60">Управление ценами</div>
        </Link>
      </motion.div>
    </div>
  );
}
