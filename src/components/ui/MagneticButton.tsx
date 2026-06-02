'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  range?: number; // Distance threshold to trigger magnetic pull
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function MagneticButton({
  children,
  className = '',
  range = 45,
  onClick,
  disabled,
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  // Position motion values for translation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics mapping
  const springX = useSpring(x, { stiffness: 120, damping: 15, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 15, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Center of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Distance between mouse and button center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Check if mouse is within range
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      setHovered(true);
      // Move button 35% of the distance to the mouse
      x.set(distanceX * 0.35);
      y.set(distanceY * 0.35);
    } else {
      handleMouseLeave();
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {/* Visual content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Ripple background effect on hover */}
      {hovered && (
        <motion.span
          className="absolute inset-0 bg-white/5 rounded-xl z-0"
          layoutId="magnetic-hover"
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}
    </motion.button>
  );
}
