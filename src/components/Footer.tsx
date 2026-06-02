'use client';

import { Car, Phone, Mail, MapPin, Send } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/10 pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">Taxi KG</div>
                <div className="text-xs text-white/50">Бишкек • Ош • 24/7</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{t.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary-400">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#tariffs" className="hover:text-primary-400 transition">{t.footer.cityTaxi}</a></li>
              <li><a href="#routes" className="hover:text-primary-400 transition">{t.footer.intercity}</a></li>
              <li><a href="#tariffs" className="hover:text-primary-400 transition">{t.footer.cargo}</a></li>
              <li><a href="#order" className="hover:text-primary-400 transition">{t.footer.airport}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary-400">{t.footer.contacts}</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+996555000000" className="hover:text-primary-400 transition">
                  +996 555 000 000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@taxi.kg" className="hover:text-primary-400 transition">
                  info@taxi.kg
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>г. Бишкек, ул. Чуй 100</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary-400">Мессенджеры</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://wa.me/996555000000"
                target="_blank"
                rel="noopener"
                className="glass-card px-4 py-2 flex items-center gap-2 hover:border-green-500/50 transition"
              >
                <Send className="w-4 h-4 text-green-400" />
                WhatsApp
              </a>
              <a
                href="https://t.me/taxikg"
                target="_blank"
                rel="noopener"
                className="glass-card px-4 py-2 flex items-center gap-2 hover:border-blue-500/50 transition"
              >
                <Send className="w-4 h-4 text-blue-400" />
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div>© {new Date().getFullYear()} Taxi KG. {t.footer.rights}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-400 transition">Политика</a>
            <a href="#" className="hover:text-primary-400 transition">Оферта</a>
            <a href="/admin" className="hover:text-primary-400 transition">Админ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
