'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Phone, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import CityMapCanvas from './ui/CityMapCanvas';
import PhoneMockup from './ui/PhoneMockup';
import AnimatedCounter from './ui/AnimatedCounter';
import LiveActivityTicker from './ui/LiveActivityTicker';
import MagneticButton from './ui/MagneticButton';
import LiveEtaCard from './ui/LiveEtaCard';
import { SPRING } from '@/lib/design-tokens';

export default function Hero() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);
  const mapY = useTransform(scrollY, [0, 800], [0, -60]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-24 md:pt-32 pb-12 overflow-hidden bg-surface"
    >
      {/* City Map Canvas Background */}
      <motion.div
        style={{ y: mapY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <CityMapCanvas />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none z-0" />
      <div className="absolute inset-0 noise pointer-events-none z-0" />

      {/* Ambient gradient lights (Orbs) */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 -left-20 w-[500px] h-[500px] orb pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 right-0 w-[600px] h-[600px] orb pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(245,170,26,0.12) 0%, transparent 70%)' }}
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-160px)]">
          
          {/* Left Block: Narrative text & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Online badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...SPRING.stiff, delay: 0.15 }}
              className="self-start inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-md"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-mint-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-mint-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                {t.hero.badge}
              </span>
            </motion.div>

            {/* Display Headings */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5 text-balance tracking-tight font-display text-ink"
            >
              <span className="block">{t.hero.title}</span>
              <span className="block text-gradient-animated bg-size-200">
                {t.hero.titleHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-ink-muted mb-8 max-w-xl leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Interactive Magnetic CTA block */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12"
            >
              <MagneticButton
                range={60}
                onClick={() => {
                  const el = document.getElementById('order');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary flex items-center justify-center gap-2.5 text-base font-semibold group h-14 px-8"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                {t.hero.orderBtn}
                <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>

              <MagneticButton
                range={45}
                onClick={() => {
                  window.location.href = 'tel:+996555000000';
                }}
                className="btn-ghost flex items-center justify-center gap-2 text-base font-semibold h-14 px-8 text-ink hover:border-border"
              >
                <Phone className="w-4 h-4 text-ink-subtle" />
                {t.hero.callBtn}
              </MagneticButton>
            </motion.div>

            {/* Counter Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-3 max-w-xl"
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
                  whileHover={{ y: -4, borderColor: 'rgba(99, 102, 241, 0.3)' }}
                  className="glass-2 p-3 sm:p-4 rounded-2xl relative overflow-hidden group border border-border/80 transition-all duration-300"
                >
                  <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-xl group-hover:opacity-25 transition-opacity duration-300`} />
                  <s.icon className="w-4 h-4 text-indigo-400 mb-2" />
                  <div className="text-xl sm:text-2xl font-bold leading-none tracking-tight text-ink font-display">
                    <AnimatedCounter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ''} />
                  </div>
                  <div className="text-[10px] sm:text-xs text-ink-subtle mt-2 leading-snug">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Block: 3D-feeling layout of phone + LiveEtaCard overlay */}
          <div className="hidden md:flex lg:col-span-5 items-center justify-center relative min-h-[500px]">
            {/* Vibrant backdrop aura */}
            <motion.div
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 45%, transparent 70%)',
              }}
            />

            {/* PhoneMockup centered */}
            <div className="relative z-10 scale-[0.95] lg:scale-100 transition-transform">
              <PhoneMockup />
            </div>

            {/* Floating Live Tracking Card (replaces generic chips) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-40px] top-[15%] z-20 shadow-depth-md"
            >
              <LiveEtaCard />
            </motion.div>

            {/* Floating stats card on the right */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute right-[-20px] bottom-[15%] glass-3 p-3.5 px-4.5 rounded-2xl shadow-depth-md flex items-center gap-3 border border-border/80 z-20"
              style={{ background: 'rgba(12, 14, 28, 0.85)' }}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] text-ink-subtle font-medium">Активных заказов</div>
                <div className="text-base font-bold text-ink leading-none mt-0.5">
                  <AnimatedCounter to={142} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Activity Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <LiveActivityTicker />
        </motion.div>
      </motion.div>

      {/* Down Chevron scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 z-10 opacity-70">
        <span className="text-[10px] tracking-widest text-ink-subtle font-semibold uppercase">Листайте вниз</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-3 bg-ink-subtle rounded-full"
        />
      </div>
    </section>
  );
}
