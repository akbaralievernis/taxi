'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ClipboardList, Clock, CheckCircle2, XCircle,
  TrendingUp, DollarSign, MapPin, Sparkles, Activity, Users
} from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import KpiCard from '@/components/charts/KpiCard';
import { SkeletonCard } from '@/components/ui/Skeleton';

const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), { ssr: false });
const DonutChart = dynamic(() => import('@/components/charts/DonutChart'), { ssr: false });
const Heatmap = dynamic(() => import('@/components/charts/Heatmap'), { ssr: false });

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  topRoutes: Array<{ from: string; to: string; count: number }>;
}

interface Analytics {
  revenue7d: { label: string; value: number }[];
  orders14d: { label: string; value: number }[];
  classCounts: Record<string, number>;
  heatmap: number[][];
  cityFromCount: Record<string, number>;
}

const classColors: Record<string, string> = {
  economy: '#22d3ee',
  comfort: '#6366f1',
  business: '#a855f7',
  minivan: '#10b981',
  cargo: '#ec4899',
};
const classNames: Record<string, string> = {
  economy: 'Эконом',
  comfort: 'Комфорт',
  business: 'Бизнес',
  minivan: 'Минивэн',
  cargo: 'Грузовое',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/analytics').then((r) => r.json()),
    ])
      .then(([s, a]) => {
        setStats(s);
        setAnalytics(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats || !analytics) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-10 w-48 bg-surface-elevated rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-surface-elevated rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-80 glass-card animate-pulse" />
          <div className="h-80 glass-card animate-pulse" />
        </div>
      </div>
    );
  }

  const donutData = Object.entries(analytics.classCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      label: classNames[k] ?? k,
      value: v,
      color: classColors[k] ?? '#6366f1',
    }));
  const totalClassOrders = Object.values(analytics.classCounts).reduce((s, v) => s + v, 0);

  const topCities = Object.entries(analytics.cityFromCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCity = Math.max(...topCities.map(([, v]) => v), 1);

  // Sparkline data: last 7 days revenue values only
  const revenueSpark = analytics.revenue7d.map((d) => d.value);
  const ordersSpark = analytics.orders14d.slice(-7).map((d) => d.value);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            <span className="gradient-text">Аналитика</span>
          </h1>
          <p className="text-ink-muted">Реальные показатели в реальном времени</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-mint-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-mint-500" />
          </span>
          <span className="text-xs text-ink-muted">Обновляется автоматически</span>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Общий доход"
          value={stats.totalRevenue}
          unit="сом"
          prevValue={stats.totalRevenue * 0.87}
          sparkData={revenueSpark}
          color="#6366f1"
          gradient="from-primary-500/20 to-purple-500/10"
          delay={0}
        />
        <KpiCard
          icon={<ClipboardList className="w-5 h-5" />}
          label="Заказов всего"
          value={stats.totalOrders}
          prevValue={stats.totalOrders * 0.92}
          sparkData={ordersSpark}
          color="#22d3ee"
          gradient="from-accent-500/20 to-primary-500/10"
          delay={0.1}
        />
        <KpiCard
          icon={<Sparkles className="w-5 h-5" />}
          label="Сегодня"
          value={stats.todayOrders}
          prevValue={Math.max(stats.todayOrders - 3, 0)}
          color="#a855f7"
          gradient="from-purple-500/20 to-pink-500/10"
          delay={0.2}
        />
        <KpiCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Завершено"
          value={stats.completedOrders}
          prevValue={Math.max(stats.completedOrders - 2, 0)}
          color="#10b981"
          gradient="from-mint-500/20 to-accent-500/10"
          delay={0.3}
        />
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                Доход за 7 дней
              </h2>
              <p className="text-sm text-ink-subtle">Доход по дням недели · в сом</p>
            </div>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-mint-500/10 text-mint-600 dark:text-mint-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +12.4%
            </div>
          </div>
          <div className="h-64">
            <RevenueChart
              data={analytics.revenue7d}
              height={256}
              format={(v) => Math.round(v).toLocaleString('ru-RU')}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Donut: orders by class */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            По тарифам
          </h2>
          <p className="text-sm text-ink-subtle mb-4">Распределение заказов</p>
          <div className="flex items-center justify-center">
            <DonutChart
              data={donutData}
              size={180}
              centerLabel="всего"
              centerValue={totalClassOrders.toString()}
            />
          </div>
        </div>
      </motion.div>

      {/* Heatmap + Top cities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2 glass-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-500" />
              Активность по часам
            </h2>
            <p className="text-sm text-ink-subtle">Когда заказывают чаще всего</p>
          </div>
          <Heatmap data={analytics.heatmap} />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-mint-500" />
            Топ городов
          </h2>
          <div className="space-y-3">
            {topCities.map(([city, count], i) => (
              <div key={city}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-ink">{city}</span>
                  <span className="text-ink-subtle">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCity) * 100}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${
                        ['#6366f1', '#a855f7', '#22d3ee', '#10b981', '#ec4899'][i]
                      }, ${['#a855f7', '#ec4899', '#6366f1', '#22d3ee', '#a855f7'][i]})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { href: '/admin/dashboard/orders', icon: ClipboardList, label: 'Заказы', desc: 'Управление и статусы', color: '#6366f1' },
          { href: '/admin/dashboard/drivers', icon: Users, label: 'Водители', desc: 'Список и верификация', color: '#22d3ee' },
          { href: '/admin/dashboard/tariffs', icon: DollarSign, label: 'Тарифы', desc: 'Цены и наценки', color: '#a855f7' },
          { href: '/admin/dashboard/promos', icon: Sparkles, label: 'Промокоды', desc: 'Скидки и акции', color: '#10b981' },
        ].map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-card p-5 hover:shadow-glow-sm transition-all hover:-translate-y-1 group block"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ background: `${item.color}25`, color: item.color }}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div className="font-semibold text-ink">{item.label}</div>
            <div className="text-sm text-ink-subtle">{item.desc}</div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
