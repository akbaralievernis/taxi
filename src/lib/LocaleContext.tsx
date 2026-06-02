'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale } from '@/types';
import { defaultLocale, getTranslations, Translations, locales } from './i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('locale') : null;
    if (stored && locales.includes(stored as Locale)) {
      setLocaleState(stored as Locale);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', l);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: getTranslations(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
