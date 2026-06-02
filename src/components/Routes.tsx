'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Route as RouteIcon } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

const routes = [
  { from: 'Бишкек', to: 'Ош', distance: 670, hours: 10, price: 7500, highlight: true },
  { from: 'Бишкек', to: 'Каракол', distance: 400, hours: 6, price: 5000 },
  { from: 'Бишкек', to: 'Джалал-Абад', distance: 600, hours: 9, price: 7000 },
  { from: 'Бишкек', to: 'Нарын', distance: 320, hours: 5, price: 4500 },
  { from: 'Бишкек', to: 'Талас', distance: 290, hours: 4.5, price: 4000 },
  { from: 'Ош', to: 'Бишкек', distance: 670, hours: 10, price: 7500 },
];

export default function Routes() {
  const { t } = useLocale();

  return (
    <section id="routes" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="badge badge-primary mb-4">
            <RouteIcon className="w-3 h-3" />
            Маршруты
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">{t.routes.title}</span>
          </h2>
          <p className="text-ink-muted text-lg">{t.routes.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route, i) => (
            <motion.a
              key={i}
              href="#order"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card p-6 cursor-pointer group hover:shadow-glow-sm transition-all relative overflow-hidden"
            >
              {route.highlight && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-mint-500 to-accent-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Хит
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-mint-500 shadow-glow-sm shadow-mint-500/50" />
                    <div className="w-0.5 h-8 bg-gradient-to-b from-mint-500 to-pink-500" />
                    <div className="w-3 h-3 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-ink font-semibold truncate">{route.from}</div>
                    <div className="text-xs text-ink-subtle h-4" />
                    <div className="text-ink font-semibold truncate">{route.to}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-ink-muted mb-5 pb-5 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <RouteIcon className="w-4 h-4 text-primary-500" />
                  <span className="font-mono font-semibold">{route.distance}</span>
                  <span className="text-ink-subtle">{t.routes.distance}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent-500" />
                  <span>≈ {route.hours} {t.routes.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-subtle">{t.routes.from}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold gradient-text">
                    {route.price.toLocaleString('ru-RU')}
                  </span>
                  <span className="text-sm text-ink-muted">{t.common.currency}</span>
                  <ArrowRight className="w-4 h-4 text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
