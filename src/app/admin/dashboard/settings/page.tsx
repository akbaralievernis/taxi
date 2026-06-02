'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Настройки</span>
        </h1>
        <p className="text-ink-muted">Общие настройки сайта</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-500" />
          Контактная информация
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">
              <Phone className="w-4 h-4 inline mr-2" />
              Телефон
            </label>
            <input type="text" defaultValue="+996 555 000 000" className="input-field" />
          </div>
          <div>
            <label className="label-field">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input type="email" defaultValue="info@taxi.kg" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="label-field">
              <MapPin className="w-4 h-4 inline mr-2" />
              Адрес
            </label>
            <input type="text" defaultValue="г. Бишкек, ул. Чуй 100" className="input-field" />
          </div>
        </div>

        <button className="btn-primary mt-4">Сохранить</button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 bg-yellow-500/5 border-yellow-500/20"
      >
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="w-5 h-5" />
          Что добавить дальше (рекомендации)
        </h2>
        <ul className="space-y-2 text-ink-muted text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>Интеграция 2GIS</strong> — карты с автокомплитом адресов и live-трекингом водителя</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>SMS-подтверждение заказа</strong> — через NikitaSMS или SMSC.kg</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>Платежи</strong> — MBank, O!Dengi, FreedomPay для карт</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>Telegram-бот</strong> — для уведомлений водителей о новых заказах</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>База PostgreSQL</strong> — заменить JSON-файлы на полноценную БД</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>Промокоды и реферальная программа</strong> — для роста аудитории</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-1">→</span>
            <span><strong>Мобильное приложение</strong> — обернуть в Capacitor для iOS/Android</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
