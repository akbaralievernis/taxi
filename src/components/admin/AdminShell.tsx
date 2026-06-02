'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, Users, DollarSign,
  Settings, LogOut, Menu, X, Car, ChevronRight, Tag, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/dashboard/orders', label: 'Заказы', icon: ClipboardList },
  { href: '/admin/dashboard/drivers', label: 'Водители', icon: Users },
  { href: '/admin/dashboard/tariffs', label: 'Тарифы', icon: DollarSign },
  { href: '/admin/dashboard/promos', label: 'Промокоды', icon: Tag },
  { href: '/admin/dashboard/reviews', label: 'Отзывы', icon: Star },
  { href: '/admin/dashboard/settings', label: 'Настройки', icon: Settings },
];

export default function AdminShell({ children, username }: { children: React.ReactNode; username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    toast.success('Вы вышли из системы');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-dark-900/60 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center glow">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold gradient-text">Taxi KG</div>
              <div className="text-xs text-white/40">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group',
                  active
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute right-3"
                  >
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-3 mb-3">
            <div className="text-xs text-white/40">Вы вошли как</div>
            <div className="font-semibold">{username}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-dark-900 border-r border-white/10 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold gradient-text">Taxi KG</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition',
                        active
                          ? 'bg-primary-500/20 text-primary-300'
                          : 'text-white/70 hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-dark-900/60 backdrop-blur-xl sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold gradient-text">Taxi KG Admin</div>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
