'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Compass, MapPin, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on admin / driver pages — they have their own UI shells & don't need a public nav
  if (pathname.startsWith('/admin') || pathname.startsWith('/driver')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/#order', label: 'Заказать', icon: Sparkles, highlight: true },
    { href: '/track', label: 'Статус', icon: MapPin },
    { href: '/cabinet', label: 'Кабинет', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-t border-border shadow-depth-md">
      {/* Safe bottom area padding */}
      <nav
        className="flex items-center justify-around h-16 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href) || (item.href.startsWith('/#') && pathname === '/');

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-colors py-1',
                isActive ? 'text-primary-400' : 'text-ink-subtle'
              )}
            >
              {/* Icon with scaling active states */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'p-1 rounded-xl',
                  item.highlight && 'bg-primary-500/10 border border-primary-500/20 text-primary-400 -mt-5 shadow-glow-sm w-10 h-10 flex items-center justify-center'
                )}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              
              <span className="text-[9px] font-bold tracking-wide mt-1 uppercase">
                {item.label}
              </span>

              {/* Active Indicator bubble line */}
              {isActive && !item.highlight && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute bottom-0 w-8 h-[2px] bg-gradient-to-r from-primary-500 to-indigo-400 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
