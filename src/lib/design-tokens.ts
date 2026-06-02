/**
 * Centalized design tokens for Framer Motion animations
 * and other styling configurations.
 */

export const SPRING = {
  stiff: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 15,
    mass: 0.8,
  },
  slow: {
    type: 'spring',
    stiffness: 80,
    damping: 20,
  },
};

export const TRANSITIONS = {
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  smooth: {
    type: 'tween',
    ease: [0.16, 1, 0.3, 1],
    duration: 0.6,
  },
};

export const VARIANCE = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export const STAGGER = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      },
    },
  },
};

export const GLOW_COLORS = {
  indigo: 'rgba(99, 102, 241, 0.15)',
  purple: 'rgba(168, 85, 247, 0.15)',
  cyan: 'rgba(6, 182, 212, 0.15)',
  gold: 'rgba(245, 170, 26, 0.15)',
};
