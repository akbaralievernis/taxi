'use client';

import { motion } from 'framer-motion';

// Bishkek-inspired SVG road paths
const ROADS = [
  { id: 'chuy', path: 'M 50,300 L 750,300', name: 'Chuy Ave' },
  { id: 'jibek-jolu', path: 'M 50,150 L 750,150', name: 'Jibek Jolu' },
  { id: 'bokonbaev', path: 'M 100,400 L 700,400', name: 'Bokonbaev St' },
  { id: 'akhunbaev', path: 'M 50,500 L 750,500', name: 'Akhunbaev St' },
  { id: 'manas', path: 'M 200,50 L 200,550', name: 'Manas Ave' },
  { id: 'baatyr', path: 'M 400,50 L 400,550', name: 'Baitik Baatyr St' },
  { id: 'alma-ata', path: 'M 600,50 L 600,550', name: 'Alma-Atinskaya St' },
  // Diagonal / Curved scenic roads for dynamic visuals
  { id: 'curve-1', path: 'M 100,100 Q 300,50 700,100', name: 'North Arc' },
  { id: 'curve-2', path: 'M 100,500 Q 380,450 700,520', name: 'South Arc' },
  { id: 'diag-1', path: 'M 100,80 L 700,500', name: 'Diagonal SW-NE' },
  { id: 'diag-2', path: 'M 100,520 L 700,80', name: 'Diagonal NW-SE' },
];

// Highlighted active route
const ACTIVE_ROUTE = {
  path: 'M 200,300 L 400,300 L 400,500 L 600,500',
  pickup: { x: 200, y: 300 },
  destination: { x: 600, y: 500 },
};

// 12 Taxis with custom speeds, colors, and offsets
const TAXIS = [
  { id: 1, road: 'chuy', color: '#6366f1', duration: 18, delay: 0 },
  { id: 2, road: 'jibek-jolu', color: '#06b6d4', duration: 22, delay: 2 },
  { id: 3, road: 'bokonbaev', color: '#f5aa1a', duration: 15, delay: 4 },
  { id: 4, road: 'akhunbaev', color: '#6366f1', duration: 20, delay: 1 },
  { id: 5, road: 'manas', color: '#06b6d4', duration: 16, delay: 3 },
  { id: 6, road: 'baatyr', color: '#f5aa1a', duration: 24, delay: 0 },
  { id: 7, road: 'alma-ata', color: '#6366f1', duration: 19, delay: 5 },
  { id: 8, road: 'curve-1', color: '#06b6d4', duration: 25, delay: 2 },
  { id: 9, road: 'curve-2', color: '#f5aa1a', duration: 21, delay: 6 },
  { id: 10, road: 'diag-1', color: '#6366f1', duration: 28, delay: 1 },
  { id: 11, road: 'diag-2', color: '#06b6d4', duration: 23, delay: 3 },
  { id: 12, road: 'chuy', color: '#f5aa1a', duration: 14, delay: 7, reverse: true },
];

export default function CityMapCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-30">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      {/* SVG Canvas */}
      <svg
        className="w-full h-full min-w-[1000px] min-h-[600px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Road Network (Gray/Muted) */}
        {ROADS.map((road) => (
          <path
            key={`bg-${road.id}`}
            d={road.path}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800/40"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}

        {/* Major Intersection Intersections Pulse Rings */}
        <circle cx="200" cy="300" r="4" className="fill-slate-300 dark:fill-slate-700" />
        <circle cx="400" cy="300" r="4" className="fill-slate-300 dark:fill-slate-700" />
        <circle cx="400" cy="400" r="4" className="fill-slate-300 dark:fill-slate-700" />
        <circle cx="400" cy="500" r="4" className="fill-slate-300 dark:fill-slate-700" />

        {/* Active Highlighted Ordered Route */}
        <motion.path
          d={ACTIVE_ROUTE.path}
          stroke="url(#activeRouteGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ strokeDasharray: '0, 1000' }}
          animate={{ strokeDasharray: '400, 1000' }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Glow behind the active route */}
        <path
          d={ACTIVE_ROUTE.path}
          stroke="#6366f1"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-15 blur-sm"
        />

        {/* Pickup Location Circle */}
        <g>
          <circle
            cx={ACTIVE_ROUTE.pickup.x}
            cy={ACTIVE_ROUTE.pickup.y}
            r="16"
            className="fill-indigo-500/10 stroke-indigo-500/30"
            strokeWidth="1"
          />
          <motion.circle
            cx={ACTIVE_ROUTE.pickup.x}
            cy={ACTIVE_ROUTE.pickup.y}
            r="24"
            className="fill-none stroke-indigo-500/20"
            strokeWidth="1.5"
            animate={{ scale: [0.6, 1.2], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <circle cx={ACTIVE_ROUTE.pickup.x} cy={ACTIVE_ROUTE.pickup.y} r="5" className="fill-indigo-500" />
        </g>

        {/* Destination Location Circle */}
        <g>
          <circle
            cx={ACTIVE_ROUTE.destination.x}
            cy={ACTIVE_ROUTE.destination.y}
            r="16"
            className="fill-emerald-500/10 stroke-emerald-500/30"
            strokeWidth="1"
          />
          <motion.circle
            cx={ACTIVE_ROUTE.destination.x}
            cy={ACTIVE_ROUTE.destination.y}
            r="24"
            className="fill-none stroke-emerald-500/20"
            strokeWidth="1.5"
            animate={{ scale: [0.6, 1.2], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
          />
          <circle cx={ACTIVE_ROUTE.destination.x} cy={ACTIVE_ROUTE.destination.y} r="5" className="fill-emerald-500" />
        </g>

        {/* Moving Taxis */}
        {TAXIS.map((taxi) => {
          const roadPath = ROADS.find((r) => r.id === taxi.road)?.path || '';
          if (!roadPath) return null;

          return (
            <motion.g
              key={taxi.id}
              style={{
                offsetPath: `path('${roadPath}')`,
              }}
              animate={{
                offsetDistance: taxi.reverse ? ['100%', '0%'] : ['0%', '100%'],
              }}
              transition={{
                duration: taxi.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: taxi.delay,
              }}
            >
              {/* Glow backdrop for taxi */}
              <circle r="7" fill={taxi.color} className="opacity-40 blur-[2px]" />

              {/* Taxi center dot */}
              <circle r="4.5" fill={taxi.color} stroke="#ffffff" strokeWidth="1" className="shadow-sm" />

              {/* Minor status ping around some taxis */}
              {taxi.id % 4 === 0 && (
                <motion.circle
                  r="12"
                  fill="none"
                  stroke={taxi.color}
                  strokeWidth="1"
                  className="opacity-30"
                  animate={{ scale: [0.5, 1.5], opacity: [0.4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </motion.g>
          );
        })}

        {/* Definitions / Gradients */}
        <defs>
          <linearGradient id="activeRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
