'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// SSR off — WebGL shader runs on client only.
const ShaderInner = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.LiquidMetal as any),
  { ssr: false }
) as ComponentType<any>;

export interface LiquidMetalProps {
  className?: string;
  style?: React.CSSProperties;
  colorBack?: string;
  colorTint?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  repetition?: number;
  softness?: number;
  shiftRed?: number;
  shiftBlue?: number;
  contour?: number;
  distortion?: number;
  angle?: number;
  shape?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Paper Design liquid-metal WebGL shader.
 * Use as decorative orb / surface — full pointer-events-none by default
 * to avoid interfering with overlay content.
 *
 * Defaults match the chrome look from CodePen reference (blue→purple→red conic).
 */
export default function LiquidMetal({
  className,
  style,
  colorBack = '#0a0e1a',
  colorTint = '#6366f1',
  speed = 0.6,
  scale = 1.5,
  rotation = 0,
  repetition = 1.5,
  softness = 0.5,
  shiftRed = 0.3,
  shiftBlue = 0.3,
  contour = 0,
  distortion = 0,
  angle = 100,
  shape = 1,
  offsetX = 0.1,
  offsetY = -0.1,
}: LiquidMetalProps) {
  return (
    <ShaderInner
      className={className}
      style={style}
      colorBack={colorBack}
      colorTint={colorTint}
      speed={speed}
      scale={scale}
      rotation={rotation}
      repetition={repetition}
      softness={softness}
      shiftRed={shiftRed}
      shiftBlue={shiftBlue}
      contour={contour}
      distortion={distortion}
      angle={angle}
      shape={shape}
      offsetX={offsetX}
      offsetY={offsetY}
    />
  );
}
