'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Moon, Sun, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/LocaleContext';
import { useTheme } from '@/lib/ThemeContext';
import Logo from './Logo';
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
    window.addEventListener('scroll', onScroll, { passive: true });
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'py-2'
          : 'py-4'
      )}
    >
      <div className={cn(
        'container mx-auto px-4',
        scrolled && 'max-w-5xl'
      )}>
        <div className={cn(
          'flex items-center justify-between rounded-2xl transition-all duration-500 px-4 py-2',
          scrolled
            ? 'glass-card-strong shadow-glow-sm'
            : 'glass-card border-transparent'
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="relative shrink-0"
            >
              <Logo size={40} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity -z-10" />
            </motion.div>
            <div>
              <div className="text-lg font-bold leading-none">
                <span className="text-ink">TAXI </span>
                <span className="gradient-text">KG</span>
              </div>
              <div className="text-[10px] text-ink-subtle -mt-0.5">Бишкек • Ош • 24/7</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-surface-elevated transition-all relative group"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-elevated transition-all"
              aria-label="Сменить тему"
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLocaleOpen(!localeOpen)}
                className="h-9 px-3 rounded-lg flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink hover:bg-surface-elevated transition-all"
              >
                {localeFlags[locale]}
                <ChevronDown className={cn('w-3.5 h-3.5 transition', localeOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {localeOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLocaleOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 glass-card-strong p-1 overflow-hidden z-50"
                    >
                      {locales.map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            setLocale(l as Locale);
                            setLocaleOpen(false);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2 text-sm rounded-lg transition flex items-center gap-2',
                            locale === l
                              ? 'bg-primary-500/10 text-primary-600 dark:text-primary-300'
                              : 'text-ink-muted hover:bg-surface-elevated hover:text-ink'
                          )}
                        >
                          <span className="font-bold text-xs w-6">{localeFlags[l as Locale]}</span>
                          {localeNames[l as Locale]}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Cabinet */}
            <Link
              href="/cabinet"
              className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-elevated transition-all"
              title="Личный кабинет"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Phone */}
            <a
              href="tel:+996555000000"
              className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-elevated transition-all text-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">+996 555 000 000</span>
            </a>

            {/* CTA */}
            <a href="#order" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm">
              {t.nav.order}
            </a>

            {/* Mobile menu button */}
            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink hover:bg-surface-elevated"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden container mx-auto px-4 mt-2"
          >
            <div className="glass-card-strong p-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-ink-muted hover:text-ink hover:bg-surface-elevated rounded-lg transition"
                >
                  {link.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cabinet"
                  className="btn-secondary !py-2 text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Кабинет
                </Link>
                <a
                  href="#order"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary !py-2 text-sm text-center"
                >
                  {t.nav.order}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
