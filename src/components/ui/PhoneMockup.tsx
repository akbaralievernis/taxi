'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Car } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface Props {
  className?: string;
}

/**
 * Phone mockup showing a "live" taxi order being processed.
 * Cycles through states: searching → found → arriving.
 */
export default function PhoneMockup({ className }: Props) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0, rotate: 6 }}
      animate={{ y: 0, opacity: 1, rotate: 4 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, y: -10, scale: 1.03 }}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative w-[280px] h-[560px] rounded-[44px] bg-gradient-to-b from-dark-800 to-dark-900 shadow-2xl shadow-primary-500/20 border-[3px] border-dark-700 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />

        {/* Status bar */}
        <div className="absolute top-2 left-0 right-0 z-10 flex justify-between px-7 text-[10px] text-white font-medium">
          <span>9:41</span>
          <span className="flex gap-1">
            <span>•••</span>
            <span>📶</span>
            <span>100%</span>
          </span>
        </div>

        {/* Map placeholder background */}
        <div className="absolute inset-0 pt-10">
          <svg viewBox="0 0 280 520" className="w-full h-full">
            <defs>
              <radialGradient id="phoneMapBg" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>
            <rect width="280" height="520" fill="url(#phoneMapBg)" />
            {/* Faux streets */}
            <g stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" fill="none">
              <path d="M 0 100 Q 70 120 140 110 T 280 130" />
              <path d="M 0 180 Q 80 170 160 195 T 280 200" />
              <path d="M 0 260 Q 90 250 180 270 T 280 265" />
              <path d="M 80 0 Q 95 100 110 200 T 130 520" />
              <path d="M 180 0 Q 195 130 210 260 T 230 520" />
            </g>

            {/* Animated route */}
            <motion.path
              d="M 60 380 Q 100 320 160 280 Q 200 240 220 180"
              stroke="#6366f1"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />

            {/* Pickup point */}
            <g>
              <circle cx="60" cy="380" r="10" fill="#10b981" />
              <circle cx="60" cy="380" r="5" fill="#fff" />
              <motion.circle
                cx="60" cy="380" r="10"
                fill="none" stroke="#10b981" strokeWidth="2"
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: '60px 380px' }}
              />
            </g>

            {/* Dropoff */}
            <g>
              <circle cx="220" cy="180" r="10" fill="#ec4899" />
              <circle cx="220" cy="180" r="5" fill="#fff" />
            </g>

            {/* Moving taxi marker */}
            <motion.g
              animate={{
                offsetDistance: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                offsetPath: 'path("M 60 380 Q 100 320 160 280 Q 200 240 220 180")',
              }}
            >
              <circle r="8" fill="#fff" />
              <circle r="6" fill="#6366f1" />
              <text textAnchor="middle" y="2" fontSize="6" fontWeight="bold" fill="white">T</text>
            </motion.g>
          </svg>
        </div>

        {/* Bottom card (booking info) */}
        <div className="absolute bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-xl rounded-t-3xl p-4 border-t border-primary-500/20">
          {/* Driver info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 flex items-center justify-center text-white font-bold">
              А
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">Айбек У.</div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>4.9</span>
                <span className="text-slate-600">·</span>
                <span>Toyota Camry · 01KG 123 ABC</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 rounded-full bg-mint-500"
            />
          </div>

          {/* ETA */}
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Прибудет через</span>
              <Clock className="w-3 h-3 text-primary-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter to={3} duration={1500} suffix=" мин" />
            </div>
          </div>

          {/* Route */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3 h-3 text-mint-500" />
              <span className="text-slate-300 truncate">ул. Чуй 100</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3 h-3 text-pink-500" />
              <span className="text-slate-300 truncate">Аэропорт Манас</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-primary-400" />
              <span className="text-xs text-slate-400">Комфорт</span>
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-accent-400 bg-clip-text text-transparent">
              <AnimatedCounter to={420} suffix=" сом" />
            </div>
          </div>
        </div>
      </div>

      {/* Phone shadow/reflection on the ground */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-56 h-12 rounded-full blur-2xl opacity-50"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.6) 0%, transparent 70%)' }}
      />
    </motion.div>
  );
}
