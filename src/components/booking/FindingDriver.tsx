'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, MapPin, Compass } from 'lucide-react';

export default function FindingDriver() {
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    'Определяем координаты...',
    'Ищем свободные автомобили рядом...',
    'Отправляем запрос ближайшим водителям...',
    'Анализируем загруженность дорог...',
    'Водитель подтверждает заказ...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, [statuses.length]);

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-md mx-auto">
      {/* Cinematic Pulse Radar */}
      <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
        {/* Ring waves */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary-500/30"
            style={{ width: '100%', height: '100%' }}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Center glowing radar core */}
        <div className="w-18 h-18 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow relative z-10">
          <Compass className="w-8 h-8 text-white animate-spin-slow" />
        </div>

        {/* Tiny pulsing satellite points on radar grid */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-mint-400"
          style={{ top: '25%', left: '30%' }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-accent-400"
          style={{ bottom: '20%', right: '25%' }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-gold-400"
          style={{ top: '60%', right: '15%' }}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Narrative status texts */}
      <h3 className="text-xl font-bold text-white mb-2 font-display flex items-center gap-1.5">
        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        Ищем автомобиль
      </h3>

      <div className="h-6 overflow-hidden relative w-full mb-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-slate-300 font-medium"
          >
            {statuses[statusIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Interactive reassurance indicators */}
      <div className="flex gap-4.5 bg-slate-950/60 border border-slate-900 px-5 py-3 rounded-2xl w-full text-left">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Безопасность</div>
            <div className="text-xs text-white font-medium">Поездка застрахована</div>
          </div>
        </div>
        <div className="w-[1px] bg-slate-800" />
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Геолокация</div>
            <div className="text-xs text-white font-medium">Маршрут построен</div>
          </div>
        </div>
      </div>
    </div>
  );
}
