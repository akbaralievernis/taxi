'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone, Clock, Shield, MapPin, Sparkles, Star } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Animated mesh background — Stripe-style */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Decorative orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 -left-20 w-[500px] h-[500px] orb"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 right-0 w-[600px] h-[600px] orb"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] orb"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
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

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance tracking-tight">
              <span className="block text-ink">{t.hero.title}</span>
              <span className="block gradient-text animate-gradient-bg">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-ink-muted mb-8 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
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
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Clock, text: t.hero.feature1, color: 'from-primary-500 to-purple-500' },
                { icon: Shield, text: t.hero.feature2, color: 'from-accent-500 to-primary-500' },
                { icon: MapPin, text: t.hero.feature3, color: 'from-mint-500 to-accent-500' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-3 text-center group cursor-default"
                >
                  <div className={`w-9 h-9 mx-auto mb-2 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-sm`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium text-ink-muted">{feature.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: 3D-style car card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Main card */}
              <div className="relative glass-card-strong p-8 shadow-glow rounded-3xl">
                {/* Inner highlight gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 pointer-events-none" />

                <svg viewBox="0 0 400 320" className="w-full h-auto relative">
                  <defs>
                    <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="carBodyLight" x1="0%" y1="0%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                    <linearGradient id="window" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                    <filter id="shadow">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                    </filter>
                  </defs>

                  {/* Animated road */}
                  <motion.line
                    x1="0" y1="270" x2="400" y2="270"
                    stroke="rgba(99, 102, 241, 0.2)"
                    strokeWidth="2"
                    strokeDasharray="20 12"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -32 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Shadow */}
                  <ellipse cx="200" cy="278" rx="140" ry="6" fill="rgba(99,102,241,0.3)" filter="url(#shadow)" />

                  {/* Body */}
                  <rect x="60" y="200" width="280" height="55" rx="14" fill="url(#carBody)" />

                  {/* Top */}
                  <path
                    d="M 110 200 L 140 150 Q 145 145 152 145 L 248 145 Q 255 145 260 150 L 290 200 Z"
                    fill="url(#carBodyLight)"
                  />

                  {/* Front window */}
                  <path
                    d="M 145 155 Q 150 152 154 152 L 196 152 L 196 195 L 130 195 Z"
                    fill="url(#window)"
                  />
                  {/* Back window */}
                  <path
                    d="M 204 152 L 246 152 Q 250 152 255 155 L 270 195 L 204 195 Z"
                    fill="url(#window)"
                  />

                  {/* Door line */}
                  <line x1="200" y1="150" x2="200" y2="200" stroke="#4338ca" strokeWidth="1" opacity="0.5" />

                  {/* Headlight */}
                  <ellipse cx="330" cy="218" rx="8" ry="5" fill="#fef3c7" />
                  <ellipse cx="330" cy="218" rx="4" ry="3" fill="#fff" />

                  {/* Wheels */}
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ originX: '110px', originY: '258px' }}
                  >
                    <circle cx="110" cy="258" r="22" fill="#1e1b4b" stroke="#4338ca" strokeWidth="3" />
                    <circle cx="110" cy="258" r="12" fill="#312e81" />
                    <line x1="100" y1="258" x2="120" y2="258" stroke="#a5b4fc" strokeWidth="2" />
                    <line x1="110" y1="248" x2="110" y2="268" stroke="#a5b4fc" strokeWidth="2" />
                  </motion.g>
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ originX: '290px', originY: '258px' }}
                  >
                    <circle cx="290" cy="258" r="22" fill="#1e1b4b" stroke="#4338ca" strokeWidth="3" />
                    <circle cx="290" cy="258" r="12" fill="#312e81" />
                    <line x1="280" y1="258" x2="300" y2="258" stroke="#a5b4fc" strokeWidth="2" />
                    <line x1="290" y1="248" x2="290" y2="268" stroke="#a5b4fc" strokeWidth="2" />
                  </motion.g>

                  {/* TAXI sign */}
                  <rect x="172" y="118" width="56" height="22" rx="3" fill="#fff" />
                  <text
                    x="200"
                    y="134"
                    textAnchor="middle"
                    fill="#6366f1"
                    fontSize="14"
                    fontWeight="900"
                    fontFamily="Inter"
                  >
                    TAXI
                  </text>
                </svg>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">4.9</div>
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">247</div>
                    <div className="text-[10px] text-ink-subtle">поездок</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">24/7</div>
                    <div className="text-[10px] text-ink-subtle">онлайн</div>
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -left-6 glass-card-strong p-3 px-4 flex items-center gap-2 shadow-glow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
                <span className="text-sm font-medium">12 водителей рядом</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -right-4 glass-card-strong p-3 px-4 shadow-glow-sm"
              >
                <div className="text-xs text-ink-subtle">Бишкек → Ош</div>
                <div className="text-lg font-bold gradient-text">от 7 500 сом</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                className="absolute top-1/3 -right-8 glass-card-strong p-2 px-3 shadow-glow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-mint-500" />
                  <span className="text-xs font-medium">5 мин</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
