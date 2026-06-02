'use client';

import { motion } from 'framer-motion';
import { Clock, Shield, Users, CreditCard, Calendar, MapPin } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

const icons = [Clock, Shield, Users, CreditCard, Calendar, MapPin];

export default function Features() {
  const { t } = useLocale();

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.features.title}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.features.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card p-6 group hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
