'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  to: number;
  duration?: number; // ms
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
  startOnView?: boolean;
}

/**
 * Count-up animation triggered on viewport enter.
 * Uses requestAnimationFrame for smooth 60fps, easeOutExpo curve.
 */
export default function AnimatedCounter({
  to,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ' ',
  className,
  startOnView = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (startOnView && !inView) return;
    let raf = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(eased * to);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, startOnView]);

  const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
