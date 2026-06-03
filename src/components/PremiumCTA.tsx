'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const LiquidMetalButton = dynamic(() => import('./ui/LiquidMetalButton'), { ssr: false });

/**
 * Premium showcase section featuring the liquid-metal pill bar.
 * Used as a high-end visual break between content blocks.
 */
export default function PremiumCTA() {
  const handleClick = () => {
    const el = document.getElementById('order');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(168,85,247,0.25) 0%, rgba(99,102,241,0.15) 40%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 noise opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Премиум-сервис
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-ink">Один тап — </span>
            <span className="gradient-text">и в путь</span>
          </h2>
          <p className="text-ink-muted text-base md:text-lg">
            Премиум-водители, мгновенный отклик, фиксированная цена. Закажите такси прямо сейчас.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          <LiquidMetalButton onClick={handleClick} />
        </motion.div>

        {/* Trust strip below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-12 text-xs text-ink-subtle"
        >
          {[
            '⚡ Подача за 5 минут',
            '🛡️ Все водители верифицированы',
            '💳 Любой способ оплаты',
            '🌍 24/7 поддержка',
          ].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span>{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
