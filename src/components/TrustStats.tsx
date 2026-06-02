'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Clock, TrendingUp, Star } from 'lucide-react';
import AnimatedCounter from './ui/AnimatedCounter';

const stats = [
  {
    icon: Users,
    value: 12847,
    label: 'Довольных клиентов',
    sub: 'за последний месяц',
    gradient: 'from-primary-500 to-purple-500',
  },
  {
    icon: Award,
    value: 89,
    label: 'Активных водителей',
    sub: 'все верифицированы',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    value: 5,
    suffix: ' мин',
    label: 'Среднее время подачи',
    sub: 'в Бишкеке и Оше',
    gradient: 'from-accent-500 to-primary-500',
  },
  {
    icon: TrendingUp,
    value: 47521,
    label: 'Поездок выполнено',
    sub: 'с момента запуска',
    gradient: 'from-mint-500 to-accent-500',
  },
];

const trustBadges = [
  { icon: ShieldCheck, text: 'SSL Защита' },
  { icon: Award, text: 'Лицензировано' },
  { icon: Star, text: '4.9 на отзывах' },
];

export default function TrustStats() {
  return (
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <div className="badge badge-primary mb-4">
            <TrendingUp className="w-3 h-3" />
            Цифры
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Нам доверяют тысячи</span>
          </h2>
          <p className="text-ink-muted text-lg">
            Реальные показатели работы такси-сервиса в Кыргызстане
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="glass-card p-4 md:p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition`}
              />
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 md:mb-4 shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text leading-none mb-2">
                <AnimatedCounter to={stat.value} suffix={stat.suffix ?? '+'} />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-ink">{stat.label}</div>
              <div className="text-[10px] sm:text-xs text-ink-subtle">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-4 pt-6 border-t border-border"
        >
          {trustBadges.map((b, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-ink-muted">
              <b.icon className="w-4 h-4 text-mint-500" />
              {b.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
