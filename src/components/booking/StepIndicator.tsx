'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between relative max-w-xl mx-auto px-4">
        {/* Connecting Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-surface-muted/80 -translate-y-1/2 z-0" />
        <motion.div
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary-500 to-indigo-400 -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />

        {/* Step Circles */}
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`w-9 h-9 rounded-full flex items-center justify-center border font-semibold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-primary-500 to-indigo-500 border-transparent text-white shadow-glow-sm'
                    : isActive
                    ? 'bg-surface-elevated border-primary-500 text-primary-400 shadow-neon-indigo'
                    : 'bg-surface border-border text-ink-subtle'
                }`}
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </motion.div>
              <span
                className={`absolute top-11 text-[10px] md:text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-primary-400 font-bold' : isCompleted ? 'text-ink-muted' : 'text-ink-subtle'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
