'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CursorGlow - Adds an ambient radial glow following the cursor.
 * Desktop only (disabled on touch devices via media queries).
 */
export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Mouse position motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring configuration
  const springConfig = { damping: 45, stiffness: 200, mass: 0.5 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Only activate glow on desktop (devices with a real pointer cursor)
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half of glow width (150px) to center it
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted || !visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40 hidden md:block"
      style={{
        mixBlendMode: 'screen',
      }}
    >
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full opacity-0 dark:opacity-100"
        style={{
          x: glowX,
          y: glowY,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 40%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
