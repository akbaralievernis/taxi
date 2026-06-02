'use client';

import { motion } from 'framer-motion';

interface Props {
  className?: string;
}

/**
 * Stylized SVG map of Kyrgyzstan with animated routes between major cities.
 * Routes pulse along their paths to simulate active taxi traffic.
 */
export default function KyrgyzstanMap({ className }: Props) {
  const cities = [
    { name: 'Бишкек', x: 240, y: 105, size: 6 },
    { name: 'Каракол', x: 470, y: 130, size: 5 },
    { name: 'Талас', x: 130, y: 130, size: 4 },
    { name: 'Нарын', x: 320, y: 200, size: 4 },
    { name: 'Ош', x: 200, y: 280, size: 6 },
    { name: 'Джалал-Абад', x: 230, y: 240, size: 4 },
    { name: 'Баткен', x: 100, y: 310, size: 3 },
  ];

  const routes = [
    { from: cities[0], to: cities[4], delay: 0 },     // Бишкек-Ош
    { from: cities[0], to: cities[1], delay: 1.5 },   // Бишкек-Каракол
    { from: cities[0], to: cities[2], delay: 3 },     // Бишкек-Талас
    { from: cities[0], to: cities[5], delay: 0.7 },   // Бишкек-Джалал-Абад
    { from: cities[4], to: cities[6], delay: 2.2 },   // Ош-Баткен
    { from: cities[0], to: cities[3], delay: 4 },     // Бишкек-Нарын
  ];

  return (
    <svg
      viewBox="0 0 600 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="kgMapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="kgRoute" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="kgCity" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
        <filter id="kgGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Approximate Kyrgyzstan outline */}
      <path
        d="M 70 130 Q 90 90 150 100 Q 200 90 260 95 Q 320 90 380 100 Q 440 95 490 110 Q 540 120 555 145 Q 565 175 540 195 Q 510 210 475 220 Q 440 230 405 240 Q 380 250 340 265 Q 305 280 270 295 Q 230 310 195 320 Q 150 325 110 315 Q 80 305 65 280 Q 50 250 55 220 Q 60 180 70 130 Z"
        fill="url(#kgMapBg)"
        stroke="rgba(99, 102, 241, 0.3)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />

      {/* Mountain ranges (decorative) */}
      <g opacity="0.3" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" fill="none">
        <path d="M 120 180 Q 150 165 180 175 Q 210 160 240 175" />
        <path d="M 280 220 Q 310 205 340 215 Q 370 200 400 215" />
        <path d="M 130 250 Q 160 235 190 245" />
      </g>

      {/* Routes */}
      {routes.map((route, i) => {
        const midX = (route.from.x + route.to.x) / 2;
        const midY = (route.from.y + route.to.y) / 2 - 25; // curve upward
        const d = `M ${route.from.x} ${route.from.y} Q ${midX} ${midY} ${route.to.x} ${route.to.y}`;

        return (
          <g key={i}>
            {/* Base path */}
            <path d={d} stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1.5" fill="none" />

            {/* Animated pulse */}
            <motion.path
              d={d}
              stroke="url(#kgRoute)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="80 400"
              animate={{ strokeDashoffset: [0, -480] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: route.delay,
              }}
            />

            {/* Moving taxi dot */}
            <motion.circle
              r="3"
              fill="#22d3ee"
              filter="url(#kgGlow)"
              animate={{
                offsetDistance: ['0%', '100%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: route.delay,
              }}
              style={{
                offsetPath: `path("${d}")`,
              }}
            />
          </g>
        );
      })}

      {/* City dots */}
      {cities.map((city) => (
        <g key={city.name}>
          {/* Pulse ring */}
          <motion.circle
            cx={city.x}
            cy={city.y}
            r={city.size}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            style={{ transformOrigin: `${city.x}px ${city.y}px` }}
          />
          {/* Solid dot */}
          <circle
            cx={city.x}
            cy={city.y}
            r={city.size}
            fill="url(#kgCity)"
            filter="url(#kgGlow)"
          />
          {/* Label */}
          <text
            x={city.x}
            y={city.y - city.size - 6}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
            opacity="0.85"
            className="text-ink"
          >
            {city.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
