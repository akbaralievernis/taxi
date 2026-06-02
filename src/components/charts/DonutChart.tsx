'use client';

import { motion } from 'framer-motion';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

/**
 * Animated donut chart with center label.
 */
export default function DonutChart({
  data,
  size = 200,
  thickness = 22,
  centerLabel,
  centerValue,
  className,
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const dashArray = `${pct * circumference} ${circumference}`;
    const dashOffset = -cumulative * circumference;
    cumulative += pct;
    return { ...d, dashArray, dashOffset, pct, idx: i };
  });

  return (
    <div className={className}>
      <div className="relative inline-block">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth={thickness}
          />
          {segments.map((seg) => (
            <motion.circle
              key={seg.idx}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: seg.idx * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {centerValue && (
              <div className="text-2xl font-bold gradient-text leading-tight">{centerValue}</div>
            )}
            {centerLabel && <div className="text-xs text-ink-subtle mt-1">{centerLabel}</div>}
          </div>
        )}
      </div>
      <div className="space-y-1.5 mt-4">
        {data.map((seg, i) => {
          const pct = ((seg.value / total) * 100).toFixed(0);
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-ink-muted flex-1 truncate">{seg.label}</span>
              <span className="text-ink font-semibold">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
