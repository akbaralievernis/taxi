'use client';

import { Phone, Mail, MapPin, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border pt-20 pb-8 relative mt-12">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">Taxi KG</div>
                <div className="text-xs text-ink-subtle">Бишкек • Ош • 24/7</div>
              </div>
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed">{t.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-ink">{t.footer.services}</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><a href="#tariffs" className="hover:text-primary-600 dark:hover:text-primary-300 transition">{t.footer.cityTaxi}</a></li>
              <li><a href="#routes" className="hover:text-primary-600 dark:hover:text-primary-300 transition">{t.footer.intercity}</a></li>
              <li><a href="#tariffs" className="hover:text-primary-600 dark:hover:text-primary-300 transition">{t.footer.cargo}</a></li>
              <li><a href="#order" className="hover:text-primary-600 dark:hover:text-primary-300 transition">{t.footer.airport}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-ink">{t.footer.contacts}</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-primary-500" />
                </div>
                <a href="tel:+996555000000" className="hover:text-primary-600 dark:hover:text-primary-300 transition">
                  +996 555 000 000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-accent-500" />
                </div>
                <a href="mailto:info@taxi.kg" className="hover:text-primary-600 dark:hover:text-primary-300 transition">
                  info@taxi.kg
                </a>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-mint-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-mint-500" />
                </div>
                <span className="pt-1">г. Бишкек, ул. Чуй 100</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-ink">Мессенджеры</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://wa.me/996555000000"
                target="_blank"
                rel="noopener"
                className="glass-card px-4 py-2.5 flex items-center gap-2.5 hover:border-mint-500/50 hover:shadow-glow-accent transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-mint-500/20 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-mint-500" />
                </div>
                <span className="font-medium">WhatsApp</span>
              </a>
              <a
                href="https://t.me/taxikg"
                target="_blank"
                rel="noopener"
                className="glass-card px-4 py-2.5 flex items-center gap-2.5 hover:border-accent-500/50 hover:shadow-glow-accent transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-accent-500" />
                </div>
                <span className="font-medium">Telegram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-subtle">
          <div>© {new Date().getFullYear()} Taxi KG. {t.footer.rights}</div>
          <div className="flex gap-6">
            <Link href="/cabinet" className="hover:text-primary-500 transition">Кабинет</Link>
            <Link href="/track" className="hover:text-primary-500 transition">Трекинг</Link>
            <Link href="/driver" className="hover:text-primary-500 transition">Водителю</Link>
            <Link href="/admin" className="hover:text-primary-500 transition">Админ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
