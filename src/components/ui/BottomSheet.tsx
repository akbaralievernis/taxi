'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (event: any, info: any) => {
    // If dragged down past 120px velocity or offset, close the sheet
    if (info.offset.y > 120 || info.velocity.y > 400) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center pointer-events-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Panel */}
          <motion.div
            ref={panelRef}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="relative w-full rounded-t-3xl border-t border-border bg-surface p-4.5 pb-8 shadow-depth-md flex flex-col focus:outline-none max-h-[85vh] z-10 overflow-y-auto"
            style={{
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
            }}
          >
            {/* Grab Handle */}
            <div className="bottom-sheet__handle" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 mt-1.5 text-left">
              {title ? (
                <h3 className="text-base font-bold text-white font-display">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg bg-surface-elevated border border-slate-850 text-ink-subtle hover:text-ink transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Content wrapper */}
            <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
