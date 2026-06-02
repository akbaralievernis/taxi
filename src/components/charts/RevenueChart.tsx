'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  height?: number;
  className?: string;
  format?: (v: number) => string;
}

/**
 * Premium area chart with grid, axes, hover tooltip.
 * Pure SVG, animated path draw.
 */
export default function RevenueChart({ data, height = 240, className, format = (v) => v.toLocaleString('ru-RU') }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  if (data.length < 2) return null;

  const width = 800;
  const padding = { top: 24, right: 24, bottom: 32, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  const yTicks = 4;

  const stepX = innerW / (data.length - 1);
  const points = data.map((d, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + (1 - d.value / max) * innerH,
    raw: d,
  }));

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="revGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="revLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = padding.top + (i / yTicks) * innerH;
        const value = max - (i / yTicks) * max;
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.08"
              strokeDasharray="2 3"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              fontSize="11"
              fill="currentColor"
              opacity="0.5"
              textAnchor="end"
            >
              {format(value)}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => {
        // show every 2nd label on small screens
        if (data.length > 10 && i % 2 !== 0) return null;
        return (
          <text
            key={i}
            x={padding.left + i * stepX}
            y={height - padding.bottom + 16}
            fontSize="11"
            fill="currentColor"
            opacity="0.5"
            textAnchor="middle"
          >
            {d.label}
          </text>
        );
      })}

      {/* Area */}
      <motion.path
        d={areaPath}
        fill="url(#revGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Line */}
      <motion.path
        d={linePath}
        stroke="url(#revLine)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Hover interactions */}
      {points.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x - stepX / 2}
            y={padding.top}
            width={stepX}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
          {hover === i && (
            <>
              <line
                x1={p.x}
                y1={padding.top}
                x2={p.x}
                y2={padding.top + innerH}
                stroke="#a855f7"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.6"
              />
              <circle cx={p.x} cy={p.y} r="6" fill="#fff" />
              <circle cx={p.x} cy={p.y} r="4" fill="#a855f7" />
              {/* Tooltip */}
              <g transform={`translate(${Math.min(Math.max(p.x - 60, padding.left), width - padding.right - 120)}, ${Math.max(p.y - 50, padding.top)})`}>
                <rect width="120" height="40" rx="8" fill="rgba(15,23,42,0.95)" stroke="#6366f1" strokeOpacity="0.4" />
                <text x="10" y="16" fontSize="10" fill="#94a3b8">{p.raw.label}</text>
                <text x="10" y="32" fontSize="13" fontWeight="700" fill="#fff">{format(p.raw.value)}</text>
              </g>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
