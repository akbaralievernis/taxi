'use client';

import { motion } from 'framer-motion';
import { useLocale } from '@/lib/LocaleContext';
import OrderForm from './OrderForm';

export default function OrderSection() {
  const { t } = useLocale();

  return (
    <section id="order" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.order.title}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.order.subtitle}</p>
        </motion.div>

        <OrderForm />
      </div>
    </section>
  );
}
