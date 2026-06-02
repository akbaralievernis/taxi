'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, CheckCircle2, Sparkles } from 'lucide-react';

interface ActivityItem {
  icon: React.ElementType;
  text: string;
  color: string;
}

const activities: ActivityItem[] = [
  { icon: Sparkles, text: 'Айдар заказал такси Бишкек → Ош · 2 мин назад', color: 'text-primary-500' },
  { icon: Star, text: 'Гульнара поставила 5 ⭐ водителю Эрлану', color: 'text-yellow-500' },
  { icon: MapPin, text: 'Нурбек принял заказ в Каракол', color: 'text-mint-500' },
  { icon: CheckCircle2, text: 'Заказ #4521 завершён · 8 240 сом', color: 'text-mint-500' },
  { icon: Sparkles, text: 'Эльмира оформила заказ Ош → Джалал-Абад', color: 'text-accent-500' },
  { icon: MapPin, text: 'Бакыт в пути · Бишкек → Талас · 290 км', color: 'text-purple-500' },
  { icon: Star, text: 'Айгерим поставила 5 ⭐ водителю Темиру', color: 'text-yellow-500' },
  { icon: CheckCircle2, text: 'Новый водитель Канат прошёл верификацию', color: 'text-mint-500' },
  { icon: Sparkles, text: 'Применён промокод WELCOME10 · скидка 10%', color: 'text-pink-500' },
];

/**
 * Marquee-style ticker that imitates a live activity feed.
 * Loops seamlessly via duplicate content + transform.
 */
export default function LiveActivityTicker() {
  const items = [...activities, ...activities]; // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden glass-card py-3 mask-fade-x">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-2 px-3">
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-ink-muted">{item.text}</span>
              <span className="w-1 h-1 rounded-full bg-ink-subtle/40" />
            </div>
          );
        })}
      </motion.div>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[rgb(var(--bg-from))] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[rgb(var(--bg-from))] to-transparent pointer-events-none" />
    </div>
  );
}
