'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import LiquidMetal from './LiquidMetal';

interface Props {
  size?: number;
  className?: string;
  children?: React.ReactNode;
  /** Show conic grayscale-to-color outline ring (hover lights up) */
  outline?: boolean;
}

/**
 * Decorative round liquid-metal sphere.
 * Wraps the shader in a circular mask with a conic gradient outline
 * and an animated float — premium hero accent.
 */
export default function LiquidMetalOrb({
  size = 380,
  className,
  children,
  outline = true,
}: Props) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative group', className)}
      style={{ width: size, height: size }}
    >
      {/* Conic outline ring — grayscale by default, colored on hover */}
      {outline && (
        <div className="liquid-metal-outline absolute inset-0 rounded-full pointer-events-none" />
      )}

      {/* Floating orb */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-2 rounded-full overflow-hidden shadow-2xl shadow-primary-500/40"
        style={{
          boxShadow:
            '0 30px 80px -20px rgba(99, 102, 241, 0.5), inset 0 2px 8px rgba(255,255,255,0.15)',
        }}
      >
        <LiquidMetal
          className="absolute inset-0 w-full h-full"
          style={{ width: '100%', height: '100%' }}
          colorBack="#0a0e1a"
          colorTint="#8b5cf6"
          speed={0.55}
          scale={1.7}
          repetition={1.4}
          softness={0.55}
          shiftRed={0.32}
          shiftBlue={0.34}
          angle={120}
          shape={1}
          offsetX={0.05}
          offsetY={-0.05}
        />

        {/* Top highlight gloss */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 15%, rgba(255,255,255,0.25) 0%, transparent 40%)',
          }}
        />
      </motion.div>

      {/* Children layered above (e.g. logo or counter) */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {children}
        </div>
      )}
    </motion.div>
  );
}
