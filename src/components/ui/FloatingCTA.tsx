'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

/**
 * FloatingCTA — sticky bottom bar shown only on mobile (<md).
 * Appears after the user scrolls past the hero section.
 * Provides quick access to the order form and phone call.
 */
export default function FloatingCTA() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          {/* Safe area bottom padding for iPhones */}
          <div
            className="px-4 pt-3 pb-4"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="glass-card-strong shadow-glow-sm flex items-center gap-3 p-2 rounded-2xl">
              {/* Phone quick-call */}
              <a
                href="tel:+996555000000"
                id="mobile-cta-call"
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center text-ink-muted hover:text-primary-500 hover:bg-primary-500/10 transition active:scale-95"
                aria-label="Позвонить"
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* Order CTA */}
              <a
                href="#order"
                id="mobile-cta-order"
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-base !py-3 group"
              >
                {t.hero.orderBtn}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
