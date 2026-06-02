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
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ background: color }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${color}25`, color }}
          >
            {icon}
          </div>
          {trend !== null && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold',
                trendUp
                  ? 'bg-mint-500/10 text-mint-600 dark:text-mint-400'
                  : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
              )}
            >
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="text-sm text-ink-muted mb-1">{label}</div>
        <div className="text-3xl font-bold text-ink">
          <AnimatedCounter to={value} decimals={decimals} />
          {unit && <span className="text-base font-semibold text-ink-muted ml-1">{unit}</span>}
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
