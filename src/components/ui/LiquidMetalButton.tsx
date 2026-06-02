'use client';

import { LiquidMetal } from '@paper-design/shaders-react';
import { ReactNode } from 'react';

interface LiquidMetalButtonProps {
  /** Icon shown on the left of the pill bar */
  leadingIcon?: ReactNode;
  /** Icon shown on the right of the pill bar (before the orb) */
  trailingIcon?: ReactNode;
  /** Click handler for the button */
  onClick?: () => void;
  /** Optional href — renders as <a> tag */
  href?: string;
  /** Extra class names for the outer wrapper */
  className?: string;
}

/**
 * LiquidMetalButton
 *
 * Pill-shaped bar with two decorative icons and a large liquid-metal
 * WebGL orb at the right end. The conic-gradient ring transitions to
 * full colour on hover.
 *
 * Matches the original vanilla JS / CSS design snippet with:
 *   u_repetition: 1.5, u_softness: 0.5, u_shiftRed/Blue: 0.3,
 *   u_distortion: 0, u_contour: 0, u_angle: 100, u_scale: 1.5
 */
export default function LiquidMetalButton({
  leadingIcon,
  trailingIcon,
  onClick,
  href,
  className = '',
}: LiquidMetalButtonProps) {
  const Tag = href ? 'a' : 'button';
  const extraProps = href ? { href } : {};

  /* ---- default icons matching the original design ---- */
  const defaultLeading = (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.0678 2.16105C7.46414 1.61127 9.04215 2.29797 9.59221 3.69425L12.7983 11.8339C13.1238 12.6606 12.7177 13.5952 11.891 13.9208L11.8149 13.9511C10.9883 14.2765 10.0535 13.8695 9.72795 13.0429L8.02678 8.7255C7.92565 8.46868 8.05228 8.17836 8.30901 8.07706C8.56594 7.97586 8.85624 8.10236 8.95744 8.35929L10.6586 12.6767C10.7819 12.9894 11.1359 13.1436 11.4487 13.0204L11.5248 12.9901C11.8377 12.8669 11.9908 12.5129 11.8676 12.2001L8.66155 4.06046C8.31383 3.17839 7.31727 2.74467 6.43498 3.09171L6.28069 3.15226C5.39843 3.49996 4.96466 4.4974 5.31194 5.3798L9.18108 15.2011C9.75314 16.6533 11.3938 17.3667 12.8461 16.7948L13.0766 16.705C14.5288 16.1329 15.2432 14.4913 14.6713 13.039L12.308 7.03898C12.2069 6.78212 12.3325 6.49177 12.5893 6.39054C12.8461 6.28961 13.1365 6.41605 13.2377 6.67277L15.601 12.6728C16.3753 14.6389 15.4089 16.8601 13.4428 17.6347L13.2133 17.7255C11.2472 18.4998 9.025 17.5342 8.25041 15.5683L4.38225 5.74698C3.83217 4.35052 4.51801 2.77168 5.91448 2.22159L6.0678 2.16105Z" />
    </svg>
  );

  const defaultTrailing = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      aria-hidden="true"
    >
      <path d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547c-0.99-2.267-2.771-4.071-4.993-5.057L1.73,13.292c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359C16.988,15.637,15.206,17.441,14.217,19.707z" />
      <path d="M24.481,27.796l-0.339,0.777c-0.248,0.569-1.036,0.569-1.284,0l-0.339-0.777c-0.604-1.385-1.693-2.488-3.051-3.092l-1.044-0.464c-0.565-0.251-0.565-1.072,0-1.323l0.986-0.438c1.393-0.619,2.501-1.763,3.095-3.195l0.348-0.84c0.243-0.585,1.052-0.585,1.294,0l0.348,0.84c0.594,1.432,1.702,2.576,3.095,3.195l0.986,0.438c0.565,0.251,0.565,1.072,0,1.323l-1.044,0.464C26.174,25.308,25.085,26.411,24.481,27.796z" />
    </svg>
  );

  return (
    <div className={`liquid-metal-bar ${className}`}>
      {/* Leading icon */}
      <span className="liquid-metal-bar__icon liquid-metal-bar__icon--lead">
        {leadingIcon ?? defaultLeading}
      </span>

      {/* Trailing icon */}
      <span className="liquid-metal-bar__icon liquid-metal-bar__icon--trail">
        {trailingIcon ?? defaultTrailing}
      </span>

      {/* The interactive liquid-metal orb */}
      <Tag
        {...(extraProps as any)}
        onClick={onClick}
        className="liquid-metal-orb"
        aria-label="Liquid metal button"
      >
        {/* Conic-gradient outline ring – greyscale until hover */}
        <span className="liquid-metal-orb__ring" aria-hidden="true" />

        {/* Inner WebGL metal sphere */}
        <span className="liquid-metal-orb__sphere" aria-hidden="true">
          <LiquidMetal
            style={{ width: '100%', height: '100%' }}
            shape="circle"
            colorBack="#3a3a3a"
            colorTint="#ffffff"
            repetition={1.5}
            softness={0.5}
            shiftRed={0.3}
            shiftBlue={0.3}
            distortion={0}
            contour={0}
            angle={100}
            scale={1.5}
            offsetX={0.1}
            offsetY={-0.1}
            speed={0.6}
          />
        </span>

        {/* Arrow icon centred on the orb */}
        <svg
          className="liquid-metal-orb__arrow"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M843.968 896a51.072 51.072 0 0 1-51.968-52.032V232H180.032A51.072 51.072 0 0 1 128 180.032c0-29.44 22.528-52.032 52.032-52.032h663.936c29.44 0 52.032 22.528 52.032 52.032v663.936c0 29.44-22.528 52.032-52.032 52.032z" />
          <path d="M180.032 896a49.92 49.92 0 0 1-36.48-15.616c-20.736-20.8-20.736-53.76 0-72.832L807.616 143.616c20.864-20.8 53.76-20.8 72.832 0 20.8 20.8 20.8 53.76 0 72.768L216.384 880.384a47.232 47.232 0 0 1-36.352 15.616z" />
        </svg>
      </Tag>
    </div>
  );
}
