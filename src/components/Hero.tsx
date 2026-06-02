'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Phone, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import KyrgyzstanMap from './ui/KyrgyzstanMap';
import PhoneMockup from './ui/PhoneMockup';
import AnimatedCounter from './ui/AnimatedCounter';
import LiveActivityTicker from './ui/LiveActivityTicker';

export default function Hero() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax for hero content
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const mapY = useTransform(scrollY, [0, 600], [0, -40]);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-24 md:pt-28 pb-8 md:pb-12 overflow-hidden">
      {/* Cinematic background: Kyrgyzstan map */}
      <motion.div
        style={{ y: mapY }}
        className="absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-25 pointer-events-none"
      >
        <KyrgyzstanMap className="w-[140%] max-w-none -mt-20" />
      </motion.div>

      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

      {/* Decorative orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 -left-20 w-[500px] h-[500px] orb pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 right-0 w-[600px] h-[600px] orb pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }}
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center min-h-[calc(100vh-180px)]">
          {/* Left: text content (7 cols) */}
          <div className="lg:col-span-7">
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 backdrop-blur-md"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-mint-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-mint-500" />
              </span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] mb-4 md:mb-6 text-balance tracking-tight"
            >
              <span className="block text-ink">{t.hero.title}</span>
              <span className="block gradient-text animate-gradient-bg">
                {t.hero.titleHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg lg:text-xl text-ink-muted mb-6 md:mb-8 max-w-xl leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col xs:flex-row gap-3 mb-7 md:mb-10"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#order"
                className="btn-primary flex items-center justify-center gap-2 text-base group"
              >
                <Sparkles className="w-4 h-4" />
                {t.hero.orderBtn}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="tel:+996555000000"
                className="btn-secondary flex items-center justify-center gap-2 text-base"
              >
                <Phone className="w-4 h-4" />
                {t.hero.callBtn}
              </motion.a>
            </motion.div>

            {/* Live counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl"
            >
              {[
                {
                  value: 12847,
                  label: 'Поездок выполнено',
                  icon: Zap,
                  color: 'from-primary-500 to-purple-500',
                },
                {
                  value: 89,
                  suffix: '+',
                  label: 'Водителей онлайн',
                  icon: ShieldCheck,
                  color: 'from-mint-500 to-accent-500',
                },
                {
                  value: 4.9,
                  decimals: 1,
                  suffix: '★',
                  label: 'Средний рейтинг',
                  icon: Globe,
                  color: 'from-accent-500 to-primary-500',
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-2 sm:p-3 relative overflow-hidden group"
                >
                  <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-xl group-hover:opacity-40 transition`} />
                  <s.icon className="w-4 h-4 text-primary-500 mb-1.5" />
                  <div className="text-lg sm:text-xl font-bold gradient-text leading-none">
                    <AnimatedCounter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ''} />
                  </div>
                  <div className="text-[10px] text-ink-subtle mt-1.5 leading-tight">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup (5 cols) */}
          <div className="hidden md:flex lg:col-span-5 items-center justify-center relative">
            {/* Glow behind phone */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1, 0.9] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.3) 40%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <PhoneMockup />
            </div>

            {/* Floating chips around phone */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-12 -left-4 lg:left-2 glass-card-strong p-3 px-4 shadow-glow-sm hidden md:flex items-center gap-2 z-20"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mint-500 to-accent-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-ink-subtle">Поездок сейчас</div>
                <div className="text-base font-bold gradient-text leading-tight">
                  <AnimatedCounter to={47} />
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-16 -right-4 lg:right-2 glass-card-strong p-3 px-4 shadow-glow-sm hidden md:flex items-center gap-2 z-20"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-ink-subtle">Все водители</div>
                <div className="text-sm font-bold text-ink leading-tight">Проверены</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <LiveActivityTicker />
        </motion.div>
      </motion.div>
    </section>
  );
}
