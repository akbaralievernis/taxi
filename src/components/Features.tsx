'use client';

import { motion } from 'framer-motion';
import { Clock, Shield, Users, CreditCard, Calendar, MapPin } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

const featureConfig = [
  { icon: Clock, gradient: 'from-primary-500 to-purple-500' },
  { icon: Shield, gradient: 'from-purple-500 to-pink-500' },
  { icon: Users, gradient: 'from-accent-500 to-primary-500' },
  { icon: CreditCard, gradient: 'from-mint-500 to-accent-500' },
  { icon: Calendar, gradient: 'from-pink-500 to-primary-500' },
  { icon: MapPin, gradient: 'from-accent-500 to-mint-500' },
];

export default function Features() {
  const { t } = useLocale();

  return (
    <section id="features" className="py-12 md:py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="badge badge-primary mb-4">
            <Shield className="w-3 h-3" />
            Преимущества
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-ink tracking-tight">
            <span className="gradient-text">{t.features.title}</span>
          </h2>
          <p className="text-ink-muted text-lg">{t.features.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {t.features.items.map((feature, i) => {
            const cfg = featureConfig[i % featureConfig.length];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 group hover:shadow-glow-sm transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${cfg.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`} />

                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-ink group-hover:gradient-text transition">
                    {feature.title}
                  </h3>
                  <p className="text-ink-muted leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
