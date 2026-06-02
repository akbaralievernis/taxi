'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck, Car } from 'lucide-react';

interface LiveEtaCardProps {
  driverName?: string;
  carInfo?: string;
  rating?: number;
  etaMinutes?: number;
}

export default function LiveEtaCard({
  driverName = 'Азамат Б.',
  carInfo = 'Toyota Camry, белый • 01KG 777 AAA',
  rating = 4.96,
  etaMinutes = 3,
}: LiveEtaCardProps) {
  const [progress, setProgress] = useState(100);
  const [eta, setEta] = useState(etaMinutes);

  useEffect(() => {
    // Simulate real-time ETA countdown and progress reduction
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 10) {
          setEta((e) => Math.max(1, e - 1));
          return 100; // Reset progress bar loop
        }
        return prev - 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="glass-card-strong max-w-[340px] p-4 flex flex-col gap-3.5 relative overflow-hidden backdrop-blur-3xl shadow-depth-md border-primary-500/20"
      style={{
        background: 'rgba(12, 14, 28, 0.75)',
      }}
    >
      {/* Decorative pulse glow in the corner */}
      <span className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          <span className="status-online !w-2 !h-2" />
          <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
            Поиск водителя завершен
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
          <Star className="w-3.5 h-3.5 fill-current" />
          {rating}
        </div>
      </div>

      {/* Driver & Car info */}
      <div className="flex gap-3 items-center z-10">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-sm">
            АБ
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-2 h-2 text-white" />
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-white truncate">{driverName}</span>
          </div>
          <span className="text-[11px] text-slate-400 truncate flex items-center gap-1">
            <Car className="w-3 h-3 text-slate-400 shrink-0" />
            {carInfo}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-slate-800/60 w-full" />

      {/* Progress & Countdown */}
      <div className="flex flex-col gap-2 z-10">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-slate-400 font-medium">Водитель будет у вас через</span>
          <span className="text-base font-bold text-white tabular-nums">
            ~ {eta} {eta === 1 ? 'минуту' : eta < 5 ? 'минуты' : 'минут'}
          </span>
        </div>
        {/* Dynamic progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Footer Trip Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 z-10">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-indigo-400" />
          Бишкек Парк
        </span>
        <span className="font-semibold text-indigo-300">Поездка застрахована</span>
      </div>
    </motion.div>
  );
}
