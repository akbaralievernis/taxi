'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

/**
 * Логотип Taxi KG — стилизованная буква T с motion-линиями.
 * Стиль: Fast Motion Futuristic.
 */
export default function Logo({ size = 40, animated = false, className }: LogoProps) {
  const id = `logoGrad-${size}`;

  if (animated) {
    return (
      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={cn('overflow-visible', className)}
        initial="hidden"
        animate="visible"
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 28 56 L 174 38 L 188 50 L 168 64 L 36 76 Z"
          fill={`url(#${id})`}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        <motion.path
          d="M 80 86 L 184 76 L 196 84 L 90 100 Z"
          fill={`url(#${id})`}
          opacity={0.75}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 0.75 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
          d="M 120 112 L 188 106 L 198 112 L 128 122 Z"
          fill={`url(#${id})`}
          opacity={0.45}
          initial={{ x: -70, opacity: 0 }}
          animate={{ x: 0, opacity: 0.45 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.path
          d="M 78 64 L 116 56 L 100 174 L 64 168 Z"
          fill={`url(#${id})`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </motion.svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M 28 56 L 174 38 L 188 50 L 168 64 L 36 76 Z" fill={`url(#${id})`} />
      <path d="M 80 86 L 184 76 L 196 84 L 90 100 Z" fill={`url(#${id})`} opacity={0.75} />
      <path d="M 120 112 L 188 106 L 198 112 L 128 122 Z" fill={`url(#${id})`} opacity={0.45} />
      <path d="M 78 64 L 116 56 L 100 174 L 64 168 Z" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Полная версия лого с текстом TAXI KG — для главных экранов
 */
export function LogoFull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 720 200" className={cn('w-auto', className)}>
      <defs>
        <linearGradient id="logoFullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="logoKgGrad" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Logo mark */}
      <path d="M 28 56 L 174 38 L 188 50 L 168 64 L 36 76 Z" fill="url(#logoFullGrad)" />
      <path d="M 80 86 L 184 76 L 196 84 L 90 100 Z" fill="url(#logoFullGrad)" opacity={0.75} />
      <path d="M 120 112 L 188 106 L 198 112 L 128 122 Z" fill="url(#logoFullGrad)" opacity={0.45} />
      <path d="M 78 64 L 116 56 L 100 174 L 64 168 Z" fill="url(#logoFullGrad)" />

      {/* Text */}
      <text
        x="240"
        y="130"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="92"
        fontWeight="900"
        fill="currentColor"
        letterSpacing="2"
      >
        TAXI
      </text>
      <text
        x="510"
        y="130"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="92"
        fontWeight="900"
        fill="url(#logoKgGrad)"
        letterSpacing="2"
      >
        KG
      </text>
    </svg>
  );
}
