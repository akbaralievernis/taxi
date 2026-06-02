'use client';

import { motion } from 'framer-motion';
import { Car, Briefcase, Crown, Truck, Package } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { CarClass } from '@/types';

const tariffIcons: Record<CarClass, any> = {
  economy: Car,
  comfort: Briefcase,
  business: Crown,
  minivan: Truck,
  cargo: Package,
};

const tariffPrices: Record<CarClass, { base: number; perKm: number }> = {
  economy: { base: 80, perKm: 15 },
  comfort: { base: 120, perKm: 22 },
  business: { base: 250, perKm: 40 },
  minivan: { base: 180, perKm: 30 },
  cargo: { base: 200, perKm: 35 },
};

const tariffColors: Record<CarClass, string> = {
  economy: 'from-blue-500/20 to-cyan-500/10',
  comfort: 'from-primary-500/20 to-orange-500/10',
  business: 'from-purple-500/20 to-pink-500/10',
  minivan: 'from-green-500/20 to-emerald-500/10',
  cargo: 'from-red-500/20 to-orange-500/10',
};

export default function Tariffs() {
  const { t } = useLocale();
  const classes: CarClass[] = ['economy', 'comfort', 'business', 'minivan', 'cargo'];

  return (
    <section id="tariffs" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.tariffs.title}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.tariffs.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {classes.map((cls, i) => {
            const Icon = tariffIcons[cls];
            const price = tariffPrices[cls];
            const tariff = t.tariffs.classes[cls];

            return (
              <motion.div
                key={cls}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`glass-card p-6 bg-gradient-to-br ${tariffColors[cls]} relative overflow-hidden group cursor-pointer`}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-500/10 blur-2xl group-hover:bg-primary-500/30 transition-all" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-400" />
                  </div>

                  <h3 className="text-xl font-bold mb-1">{tariff.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{tariff.desc}</p>

                  <div className="space-y-2 mb-6">
                    <div>
                      <div className="text-xs text-white/40">{t.tariffs.basePrice}</div>
                      <div className="text-2xl font-bold gradient-text">
                        {price.base} {t.common.currency}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">{t.tariffs.perKm}</div>
                      <div className="text-lg font-semibold text-white/90">
                        +{price.perKm} {t.common.currency}
                      </div>
                    </div>
                  </div>

                  <a
                    href="#order"
                    className="block text-center w-full py-2 rounded-lg bg-white/10 hover:bg-primary-500 transition-all text-sm font-semibold"
                  >
                    {t.tariffs.orderBtn}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
