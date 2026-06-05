'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AnimatedCounter from '../ui/AnimatedCounter';
import Sparkline from './Sparkline';

interface Props {
  icon: ReactNode;
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  prevValue?: number;
  sparkData?: number[];
  color?: string;
  gradient?: string;
  delay?: number;
  className?: string;
}

/**
 * Enterprise KPI card with animated counter + sparkline + trend.
 */
export default function KpiCard({
  icon,
  label,
  value,
  unit = '',
  decimals = 0,
  prevValue,
  sparkData,
  color = '#6366f1',
  gradient = 'from-primary-500/20 to-purple-500/10',
  delay = 0,
  className,
}: Props) {
  const trend = prevValue !== undefined && prevValue !== 0
    ? ((value - prevValue) / prevValue) * 100
    : null;
  const trendUp = trend !== null && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        'glass-card p-5 relative overflow-hidden group',
        `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      {/* Decorative orb sits BEHIND content (z:-1) so text stays sharp */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-25 group-hover:opacity-45 transition-opacity z-0"
        style={{ background: color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Bigger icon tile with solid colored backdrop for max visibility */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `${color}40`, color: color, boxShadow: `0 4px 12px ${color}33` }}
          >
            {icon}
          </div>
          {trend !== null && (
            <div
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold',
                trendUp
                  ? 'bg-mint-500/20 text-mint-700 dark:text-mint-300 border border-mint-500/40'
                  : 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-500/40'
              )}
            >
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="text-sm font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">{label}</div>
        <div className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
          <AnimatedCounter to={value} decimals={decimals} />
          {unit && <span className="text-base font-bold text-ink-subtle ml-1.5">{unit}</span>}
        </div>

        {sparkData && sparkData.length > 1 && (
          <div className="mt-3">
            <Sparkline data={sparkData} color={color} width={200} height={32} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
