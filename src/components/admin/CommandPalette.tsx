'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, ClipboardList, Users, DollarSign,
  Tag, Star, Settings, LogOut, CornerDownLeft
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Дашборд',
      desc: 'Просмотр графиков и аналитики показателей',
      icon: LayoutDashboard,
      action: () => router.push('/admin/dashboard'),
    },
    {
      id: 'orders',
      label: 'Управление заказами',
      desc: 'Редактировать статусы и параметры поездок',
      icon: ClipboardList,
      action: () => router.push('/admin/dashboard/orders'),
    },
    {
      id: 'drivers',
      label: 'База водителей',
      desc: 'Просмотр отзывов, рейтинга и статусов верификации',
      icon: Users,
      action: () => router.push('/admin/dashboard/drivers'),
    },
    {
      id: 'tariffs',
      label: 'Настройки тарифов',
      desc: 'Изменение цен посадки и стоимости километров',
      icon: DollarSign,
      action: () => router.push('/admin/dashboard/tariffs'),
    },
    {
      id: 'promos',
      label: 'Промокоды и акции',
      desc: 'Создать новые купоны или удалить существующие',
      icon: Tag,
      action: () => router.push('/admin/dashboard/promos'),
    },
    {
      id: 'reviews',
      label: 'Отзывы клиентов',
      desc: 'Просмотр оценок и жалоб на качество сервиса',
      icon: Star,
      action: () => router.push('/admin/dashboard/reviews'),
    },
    {
      id: 'settings',
      label: 'Общие настройки системы',
      desc: 'Конфигурация Telegram-ботов, SMS и лимитов',
      icon: Settings,
      action: () => router.push('/admin/dashboard/settings'),
    },
    {
      id: 'logout',
      label: 'Выйти из панели',
      desc: 'Завершить текущую сессию администратора',
      icon: LogOut,
      action: async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin');
      },
    },
  ];

  // Open/close palette on Ctrl+K / Cmd+K keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter commands
  const filtered = commandItems.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating shortcut badge helper in UI */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-30 pointer-events-none">
        <div className="glass-3 px-3 py-1.5 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <span>Нажмите</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 font-mono text-[9px]">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 font-mono text-[9px]">K</kbd>
          <span>для поиска</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-auto">
            {/* Modal Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Main spotlight body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-depth-md overflow-hidden z-10"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4.5 py-3.5 border-b border-slate-900">
                <Search className="w-5 h-5 text-slate-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Что вы хотите сделать? Начните вводить..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-400 font-mono"
                >
                  ESC
                </button>
              </div>

              {/* Commands List Options */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 font-medium">
                    Команда не найдена
                  </div>
                ) : (
                  <ul className="space-y-0.5">
                    {filtered.map((item, idx) => {
                      const active = idx === selectedIndex;
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              item.action();
                              setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              'w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between transition-all group duration-150',
                              active
                                ? 'bg-indigo-500/10 text-white'
                                : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                                active
                                  ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              )}>
                                <Icon className="w-4 h-4" />
                              </span>
                              <div className="text-left min-w-0">
                                <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                                  {item.label}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {item.desc}
                                </div>
                              </div>
                            </div>
                            
                            {active && (
                              <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 font-mono border border-indigo-500/20 bg-indigo-500/5 px-1.5 py-0.5 rounded">
                                <CornerDownLeft className="w-2.5 h-2.5" />
                                ENTER
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
