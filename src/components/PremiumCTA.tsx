'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Premium showcase section between Tariffs and Routes.
 * Replaces the previous WebGL "liquid-metal pill bar" with a single,
 * large CTA that matches the rest of the site (.btn-primary metallic style).
 */
export default function PremiumCTA() {
  const handleClick = () => {
    const el = document.getElementById('order');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Ambient mood lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(168,85,247,0.22) 0%, rgba(99,102,241,0.14) 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-md mb-5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300">
              Премиум-сервис
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-ink">Один тап — </span>
            <span className="gradient-text">и в путь</span>
          </h2>

          <p className="text-ink-muted text-base md:text-lg mb-10 max-w-xl mx-auto">
            Премиум-водители, мгновенный отклик, фиксированная цена. Закажите такси прямо сейчас.
          </p>

          {/* Large metallic CTA — same .btn-primary style as the rest of the site */}
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="btn-primary !h-16 !px-10 !text-lg !gap-3 group mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Заказать такси</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Micro-trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-10 text-xs sm:text-sm text-ink-subtle"
          >
            {[
              '⚡ Подача за 5 минут',
              '🛡️ Все водители верифицированы',
              '💳 Любой способ оплаты',
              '🌍 24/7 поддержка',
            ].map((t) => (
              <span key={t} className="whitespace-nowrap">
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
