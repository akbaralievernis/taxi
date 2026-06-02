'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { cn } from '@/lib/utils';

export default function FAQ() {
  const { t } = useLocale();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.faq.title}</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {t.faq.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'glass-card overflow-hidden transition-all duration-300',
                openIdx === i && 'border-primary-500/50'
              )}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left group"
              >
                <span className="font-semibold pr-4 group-hover:text-primary-400 transition-colors">
                  {item.q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                >
                  <ChevronDown className="w-4 h-4 text-primary-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-white/70 leading-relaxed border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
