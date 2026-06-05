'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Briefcase } from 'lucide-react';
import { CarClass } from '@/types';

interface VehicleCardProps {
  cls: CarClass;
  selected: boolean;
  name: string;
  desc: string;
  onClick: () => void;
  price?: number;
}

// Custom SVG Car Illustrations per class (Sleek minimalist side/front-quarter profiles)
const CAR_SVGS: Record<CarClass, React.ReactNode> = {
  economy: (
    <svg className="w-full h-16 text-current" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 32 L35 32 Q45 32 50 24 L58 14 Q62 10 70 10 L85 10 Q92 10 98 16 L108 26 Q112 30 112 34 L110 38 Q108 40 102 40 L98 40 M15 32 Q10 32 8 36 L6 40 L28 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="28" cy="40" r="7" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <circle cx="88" cy="40" r="7" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <path d="M35 32 L81 32" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M50 24 L96 24" stroke="currentColor" strokeWidth="1"/>
      <path d="M58 14 L58 32 M80 10 L80 32" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  comfort: (
    <svg className="w-full h-16 text-current" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 30 L32 30 Q42 30 48 22 L55 12 Q60 8 68 8 L90 8 Q97 8 102 14 L112 25 Q115 28 115 32 L113 36 Q110 38 104 38 L96 38 M12 30 Q6 30 4 34 L3 38 L25 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="25" cy="38" r="8" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <circle cx="88" cy="38" r="8" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <path d="M32 30 L80 30" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M48 22 L98 22" stroke="currentColor" strokeWidth="1"/>
      <path d="M55 12 L55 30 M78 8 L78 30" stroke="currentColor" strokeWidth="1.5"/>
      {/* Spoiler/extra detail */}
      <path d="M110 25 L113 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  business: (
    <svg className="w-full h-16 text-current" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 28 L30 28 Q40 28 46 20 L54 10 Q58 6 66 6 L92 6 Q99 6 104 12 L114 24 Q117 27 117 30 L115 35 Q112 37 106 37 L98 37 M10 28 Q4 28 2 32 L1 36 L22 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="22" cy="36" r="9" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <circle cx="88" cy="36" r="9" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <path d="M30 28 L78 28" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M46 20 L100 20" stroke="currentColor" strokeWidth="1"/>
      <path d="M54 10 L54 28 M76 6 L76 28" stroke="currentColor" strokeWidth="1.5"/>
      {/* Chrome accent lines */}
      <path d="M30 32 L78 32" stroke="#f5aa1a" strokeWidth="1" strokeLinecap="round" className="opacity-85"/>
      <path d="M10 22 H18" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  minivan: (
    <svg className="w-full h-16 text-current" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 32 L22 32 H42 L48 20 L58 12 Q62 8 70 8 L95 8 Q102 8 107 14 L114 24 Q116 27 116 32 L114 36 Q110 38 104 38 H96" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="38" r="8" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <circle cx="86" cy="38" r="8" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <path d="M10 32 Q5 32 4 35 L3 38 H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M42 32 L78 32" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M48 20 H106" stroke="currentColor" strokeWidth="1"/>
      <path d="M58 12 V32 M80 8 V32 M98 12 V32" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  cargo: (
    <svg className="w-full h-16 text-current" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Truck Cab */}
      <path d="M10 34 H24 V20 H18 L10 28 Z M24 34 H84 V12 H24 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="38" r="8" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      <circle cx="76" cy="38" r="8" stroke="currentColor" strokeWidth="2.5" fill="#0c0d15"/>
      {/* Windshield */}
      <path d="M12 28 H18 V22 H14 Z" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
};

const STATS: Record<CarClass, { passengers: number; luggage: number }> = {
  economy: { passengers: 4, luggage: 2 },
  comfort: { passengers: 4, luggage: 3 },
  business: { passengers: 3, luggage: 2 },
  minivan: { passengers: 7, luggage: 6 },
  cargo: { passengers: 2, luggage: 15 },
};

export default function VehicleCard({
  cls,
  selected,
  name,
  desc,
  onClick,
  price,
}: VehicleCardProps) {
  const stats = STATS[cls];
  
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[230px] overflow-hidden ${
        selected
          ? cls === 'business'
            ? 'bg-gold-500/10 border-gold-500/80 shadow-glow-gold'
            : 'bg-primary-500/10 border-primary-500/80 shadow-glow-sm'
          : 'bg-surface/40 border-border/80 hover:border-border/60 hover:bg-surface-elevated/20'
      }`}
    >
      {/* Ribbon tags for special classes */}
      {cls === 'business' && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-500/15 text-gold-400 border border-gold-500/30 text-[9px] font-bold uppercase tracking-wider">
          <Sparkles className="w-2.5 h-2.5" />
          Premium
        </span>
      )}

      {/* SVG Illustration Container */}
      <div className={`mt-2 flex items-center justify-center transition-colors duration-300 ${
        selected
          ? cls === 'business'
            ? 'text-gold-400'
            : 'text-primary-400'
          : 'text-ink-subtle'
      }`}>
        {CAR_SVGS[cls]}
      </div>

      {/* Name and description details */}
      <div className="flex flex-col mt-4">
        <span className="text-base font-bold text-white tracking-tight">{name}</span>
        <span className="text-xs text-ink-subtle mt-1 line-clamp-2 leading-relaxed">{desc}</span>
      </div>

      {/* Capacity Statistics & Price */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2.5 text-ink-subtle text-[10px] font-semibold">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {stats.passengers}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            {stats.luggage}
          </span>
        </div>
        
        {/* Cost Display */}
        {price !== undefined && price > 0 ? (
          <span className={`text-base font-bold font-display ${
            selected
              ? cls === 'business'
                ? 'text-gold-400'
                : 'text-primary-400'
              : 'text-ink-muted'
          }`}>
            {price} сом
          </span>
        ) : (
          <span className="text-xs text-ink-subtle">Выбор</span>
        )}
      </div>
    </motion.button>
  );
}
