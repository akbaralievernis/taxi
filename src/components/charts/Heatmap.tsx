'use client';

import { motion } from 'framer-motion';

interface Props {
  data: number[][]; // [day][hour] = value
  className?: string;
}

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/**
 * Orders-by-hour-and-day heatmap. Values normalized 0-1.
 */
export default function Heatmap({ data, className }: Props) {
  if (data.length === 0) return null;

  const flat = data.flat();
  const max = Math.max(...flat, 1);

  const colorFor = (v: number): string => {
    const intensity = v / max;
    if (intensity === 0) return 'rgba(99, 102, 241, 0.05)';
    if (intensity < 0.25) return `rgba(99, 102, 241, ${0.15 + intensity * 0.3})`;
    if (intensity < 0.5) return `rgba(139, 92, 246, ${0.3 + intensity * 0.3})`;
    if (intensity < 0.75) return `rgba(168, 85, 247, ${0.4 + intensity * 0.3})`;
    return `rgba(34, 211, 238, ${0.5 + intensity * 0.4})`;
  };

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-full">
          {/* Hour labels */}
          <div className="flex gap-1 pl-7">
            {Array.from({ length: 24 }).map((_, h) => (
              <div
                key={h}
                className="w-5 text-[9px] text-ink-subtle text-center"
              >
                {h % 4 === 0 ? h : ''}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {data.map((row, di) => (
            <div key={di} className="flex gap-1 items-center">
              <div className="w-6 text-[10px] text-ink-subtle text-right pr-1">{DAYS[di]}</div>
              {row.map((v, hi) => (
                <motion.div
                  key={hi}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (di * 24 + hi) * 0.003 }}
                  whileHover={{ scale: 1.4, zIndex: 10 }}
                  className="w-5 h-5 rounded relative group cursor-pointer"
                  style={{ background: colorFor(v) }}
                  title={`${DAYS[di]} ${hi}:00 — ${v}`}
                >
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-surface-elevated/95 backdrop-blur-md border border-border text-ink rounded-lg px-2 py-1 text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                    {DAYS[di]} {hi}:00 · <strong>{v}</strong>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-ink-subtle">
        <span>Меньше</span>
        <div className="flex gap-0.5">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
            <div
              key={v}
              className="w-3 h-3 rounded"
              style={{ background: colorFor(v * max) }}
            />
          ))}
        </div>
        <span>Больше</span>
      </div>
    </div>
  );
}
