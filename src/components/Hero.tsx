'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone, Clock, Shield, MapPin, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {t.hero.badge}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              {t.hero.title}{' '}
              <span className="gradient-text animate-gradient-bg bg-gradient-to-r from-primary-400 via-primary-500 to-primary-300">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#order"
                className="btn-primary flex items-center justify-center gap-2 text-lg"
              >
                {t.hero.orderBtn}
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+996555000000"
                className="btn-secondary flex items-center justify-center gap-2 text-lg"
              >
                <Phone className="w-5 h-5" />
                {t.hero.callBtn}
              </motion.a>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock, text: t.hero.feature1 },
                { icon: Shield, text: t.hero.feature2 },
                { icon: MapPin, text: t.hero.feature3 },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass-card p-3 text-center"
                >
                  <feature.icon className="w-6 h-6 text-primary-400 mx-auto mb-1" />
                  <div className="text-xs md:text-sm text-white/80">{feature.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animated Car Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="glass-card p-8 glow">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Road */}
                  <motion.path
                    d="M 0 250 L 400 250"
                    stroke="rgba(245, 158, 11, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="20 10"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -30 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Car body */}
                  <motion.g
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <rect x="80" y="180" width="240" height="60" rx="15" fill="url(#carGrad)" />
                    <rect x="120" y="140" width="160" height="50" rx="15" fill="url(#carGrad)" />
                    <rect x="130" y="150" width="60" height="35" rx="5" fill="rgba(255,255,255,0.2)" />
                    <rect x="210" y="150" width="60" height="35" rx="5" fill="rgba(255,255,255,0.2)" />

                    {/* Wheels */}
                    <motion.circle
                      cx="130"
                      cy="245"
                      r="20"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="270"
                      cy="245"
                      r="20"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="3"
                    />

                    {/* TAXI sign */}
                    <rect x="170" y="100" width="60" height="25" rx="3" fill="#fbbf24" />
                    <text
                      x="200"
                      y="118"
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      TAXI
                    </text>
                  </motion.g>

                  <defs>
                    <linearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -left-4 glass-card p-3 px-4 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm">Онлайн</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-4 glass-card p-3 px-4"
              >
                <div className="text-xs text-white/60">Поездок сегодня</div>
                <div className="text-xl font-bold gradient-text">247</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
