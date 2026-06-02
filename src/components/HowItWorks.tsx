'use client';

import { motion } from 'framer-motion';
import { FileText, Calculator, Car, Zap } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

const stepData = [
  { icon: FileText, gradient: 'from-primary-500 to-purple-500' },
  { icon: Calculator, gradient: 'from-purple-500 to-accent-500' },
  { icon: Car, gradient: 'from-accent-500 to-mint-500' },
];

export default function HowItWorks() {
  const { t } = useLocale();

  return (
    <section id="how" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="badge badge-accent mb-4">
            <Zap className="w-3 h-3" />
            Как заказать
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">{t.howItWorks.title}</span>
          </h2>
          <p className="text-ink-muted text-lg">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-40" />

          {t.howItWorks.steps.map((step, i) => {
            const cfg = stepData[i];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-28 h-28 mx-auto mb-6"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} rounded-3xl rotate-6 opacity-60 blur-xl`} />
                  <div className={`relative w-full h-full rounded-3xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-glow-sm`}>
                    <Icon className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-surface-elevated border-2 border-primary-500 flex items-center justify-center font-bold text-primary-600 dark:text-primary-300 shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold mb-2 text-ink">{step.title}</h3>
                <p className="text-ink-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
