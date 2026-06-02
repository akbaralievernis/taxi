'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Car, Moon, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/LocaleContext';
import { useTheme } from '@/lib/ThemeContext';
import { Locale } from '@/types';
import { localeFlags, localeNames, locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function Header() {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.tariffs, href: '#tariffs' },
    { label: t.nav.routes, href: '#routes' },
    { label: t.nav.howItWorks, href: '#how' },
    { label: t.nav.faq, href: '#faq' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center glow"
          >
            <Car className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <div className="text-xl font-bold gradient-text">Taxi KG</div>
            <div className="text-[10px] text-white/50 -mt-1">Бишкек • Ош • 24/7</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
            aria-label="Сменить тему"
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/cabinet"
            className="hidden md:flex p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
            title="Личный кабинет"
          >
            <User className="w-4 h-4" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setLocaleOpen(!localeOpen)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm font-semibold hover:bg-white/10 transition"
            >
              {localeFlags[locale]}
            </button>
            <AnimatePresence>
              {localeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 glass-card overflow-hidden"
                >
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocale(l as Locale);
                        setLocaleOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm transition hover:bg-white/10',
                        locale === l ? 'text-primary-400' : 'text-white/80'
                      )}
                    >
                      <span className="font-semibold mr-2">{localeFlags[l as Locale]}</span>
                      {localeNames[l as Locale]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="tel:+996555000000"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">+996 555 000 000</span>
          </a>

          <a href="#order" className="btn-primary text-sm hidden sm:inline-block">
            {t.nav.order}
          </a>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-900/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-white/80 hover:text-primary-400 transition"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#order"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center mt-2"
              >
                {t.nav.order}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
