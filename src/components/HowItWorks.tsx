'use client';

import { motion } from 'framer-motion';
import { FileText, Calculator, Car } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

const icons = [FileText, Calculator, Car];

export default function HowItWorks() {
  const { t } = useLocale();

  return (
    <section id="how" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.howItWorks.title}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0" />

          {t.howItWorks.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl rotate-6 opacity-50 blur-xl" />
                  <div className="relative w-full h-full glass-card flex items-center justify-center bg-gradient-to-br from-primary-500/30 to-primary-600/20">
                    <Icon className="w-10 h-10 text-primary-300" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-dark-900 shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/60">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
