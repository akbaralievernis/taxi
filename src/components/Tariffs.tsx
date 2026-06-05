'use client';

import { motion } from 'framer-motion';
import { Car, Briefcase, Crown, Truck, Package, ArrowRight, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { CarClass } from '@/types';

const tariffData: Record<CarClass, {
  icon: any;
  basePrice: number;
  perKm: number;
  gradient: string;
  iconBg: string;
  popular?: boolean;
}> = {
  economy: {
    icon: Car,
    basePrice: 80,
    perKm: 15,
    gradient: 'from-accent-500/20 via-primary-500/10 to-transparent',
    iconBg: 'from-accent-500 to-primary-500',
  },
  comfort: {
    icon: Briefcase,
    basePrice: 120,
    perKm: 22,
    gradient: 'from-primary-500/30 via-purple-500/20 to-transparent',
    iconBg: 'from-primary-500 to-purple-500',
    popular: true,
  },
  business: {
    icon: Crown,
    basePrice: 250,
    perKm: 40,
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    iconBg: 'from-purple-500 to-pink-500',
  },
  minivan: {
    icon: Truck,
    basePrice: 180,
    perKm: 30,
    gradient: 'from-mint-500/20 via-accent-500/10 to-transparent',
    iconBg: 'from-mint-500 to-accent-500',
  },
  cargo: {
    icon: Package,
    basePrice: 200,
    perKm: 35,
    gradient: 'from-pink-500/20 via-primary-500/10 to-transparent',
    iconBg: 'from-pink-500 to-primary-500',
  },
};

export default function Tariffs() {
  const { t } = useLocale();
  const classes: CarClass[] = ['economy', 'comfort', 'business', 'minivan', 'cargo'];

  return (
    <section id="tariffs" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="badge badge-accent mb-4">
            <Sparkles className="w-3 h-3" />
            Тарифы
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">{t.tariffs.title}</span>
          </h2>
          <p className="text-ink-muted text-lg">{t.tariffs.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {classes.map((cls, i) => {
            const data = tariffData[cls];
            const Icon = data.icon;
            const tariff = t.tariffs.classes[cls];

            return (
              <motion.div
                key={cls}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative glass-card p-6 bg-gradient-to-br ${data.gradient} overflow-hidden group cursor-pointer transition-all`}
              >
                {data.popular && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 rounded-b-lg bg-gradient-to-r from-primary-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-glow-sm">
                    Популярный
                  </div>
                )}

                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-500/20 blur-3xl group-hover:bg-primary-500/40 transition-all" />

                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-1 text-ink">{tariff.name}</h3>
                  <p className="text-ink-subtle text-sm mb-3 sm:mb-5 min-h-[2.5rem]">{tariff.desc}</p>

                  <div className="space-y-3 mb-5 pb-5 border-b border-border">
                    <div>
                      <div className="text-xs text-ink-subtle uppercase tracking-wider mb-0.5">{t.tariffs.basePrice}</div>
                      <div className="text-2xl font-bold gradient-text">
                        {data.basePrice} <span className="text-sm font-normal text-ink-muted">{t.common.currency}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-subtle uppercase tracking-wider mb-0.5">{t.tariffs.perKm}</div>
                      <div className="text-lg font-semibold text-ink-muted">
                        +{data.perKm} <span className="text-sm font-normal">{t.common.currency}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#order"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-gradient-to-r hover:from-primary-500 hover:to-purple-500 hover:text-ink text-ink-muted transition-all text-sm font-semibold group/btn"
                  >
                    {t.tariffs.orderBtn}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
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
