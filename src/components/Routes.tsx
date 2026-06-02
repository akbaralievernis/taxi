'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

const routes = [
  { from: 'Бишкек', to: 'Ош', distance: 670, hours: 10, price: 7500 },
  { from: 'Бишкек', to: 'Каракол', distance: 400, hours: 6, price: 5000 },
  { from: 'Бишкек', to: 'Джалал-Абад', distance: 600, hours: 9, price: 7000 },
  { from: 'Бишкек', to: 'Нарын', distance: 320, hours: 5, price: 4500 },
  { from: 'Бишкек', to: 'Талас', distance: 290, hours: 4.5, price: 4000 },
  { from: 'Ош', to: 'Бишкек', distance: 670, hours: 10, price: 7500 },
];

export default function Routes() {
  const { t } = useLocale();

  return (
    <section id="routes" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.routes.title}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.routes.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route, i) => (
            <motion.a
              key={i}
              href="#order"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card p-6 cursor-pointer group hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span className="font-semibold">{route.from}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-primary-400 transition-colors" />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span className="font-semibold">{route.to}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <div className="flex items-center gap-1">
                  <span className="font-mono">{route.distance}</span>
                  <span>{t.routes.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>≈ {route.hours} {t.routes.time}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40">{t.routes.from}</span>
                <span className="text-xl font-bold gradient-text">
                  {route.price.toLocaleString('ru-RU')} {t.common.currency}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
