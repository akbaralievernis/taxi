'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  variant?: 'primary' | 'success';
  className?: string;
}

/**
 * Premium animated toggle with glow when active.
 */
export default function Toggle({
  checked,
  onChange,
  size = 'md',
  label,
  description,
  variant = 'success',
  className,
}: Props) {
  const sizes = {
    sm: { track: 'w-9 h-5', knob: 'w-3.5 h-3.5', translate: 16 },
    md: { track: 'w-12 h-7', knob: 'w-5 h-5', translate: 20 },
    lg: { track: 'w-16 h-9', knob: 'w-7 h-7', translate: 28 },
  };
  const s = sizes[size];
  const activeBg =
    variant === 'success'
      ? 'bg-gradient-to-r from-mint-500 to-accent-500 shadow-glow-accent'
      : 'bg-gradient-to-r from-primary-500 to-purple-500 shadow-glow-sm';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex items-center rounded-full transition-all duration-300 cursor-pointer p-0.5',
          s.track,
          checked ? activeBg : 'bg-surface-muted border border-border'
        )}
        aria-checked={checked}
        role="switch"
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className={cn(
            'block rounded-full bg-white shadow-md',
            s.knob,
            checked && 'shadow-white/40'
          )}
          style={{ x: checked ? s.translate : 0 }}
        />
        {checked && variant === 'success' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-mint-500/30 -z-10 blur-md"
          />
        )}
      </button>
      {(label || description) && (
        <div>
          {label && <div className="font-semibold text-ink">{label}</div>}
          {description && <div className="text-xs text-ink-subtle">{description}</div>}
        </div>
      )}
    </div>
  );
}
