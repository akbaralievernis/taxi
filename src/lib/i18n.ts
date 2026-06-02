import { Locale } from '@/types';
import { ru } from './translations/ru';
import { ky } from './translations/ky';
import { en } from './translations/en';

export const locales: Locale[] = ['ru', 'ky', 'en'];
export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  ky: 'Кыргызча',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ru: 'RU',
  ky: 'KG',
  en: 'EN',
};

export type Translations = typeof ru;

export const translations: Record<Locale, Translations> = { ru, ky, en };

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[defaultLocale];
}
