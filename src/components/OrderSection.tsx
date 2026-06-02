'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import OrderForm from './OrderForm';

export default function OrderSection() {
  const { t } = useLocale();

  return (
    <section id="order" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <div className="badge badge-primary mb-4">
            <Sparkles className="w-3 h-3" />
            Закажите за минуту
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">{t.order.title}</span>
          </h2>
          <p className="text-ink-muted text-lg">{t.order.subtitle}</p>
        </motion.div>

        <OrderForm />
      </div>
    </section>
  );
}
