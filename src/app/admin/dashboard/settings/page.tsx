'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, AlertCircle, Save, Loader2, MessageSquare, Send, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [nightSurcharge, setNightSurcharge] = useState(20);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setTelegramToken(data.telegramToken || '');
        setTelegramChatId(data.telegramChatId || '');
        setSmsApiKey(data.smsApiKey || '');
        setNightSurcharge(data.nightSurcharge || 20);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Ошибка загрузки настроек');
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          email,
          address,
          telegramToken,
          telegramChatId,
          smsApiKey,
          nightSurcharge: Number(nightSurcharge),
        }),
      });

      if (res.ok) {
        toast.success('Настройки сохранены успешно');
      } else {
        toast.error('Не удалось сохранить настройки');
      }
    } catch {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2.5">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="text-xs text-slate-400 font-semibold">Загрузка настроек системы...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-display text-white">
          Настройки
        </h1>
        <p className="text-slate-400 text-sm">Параметры интеграций, тарифных сеток и контактов компании</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-2 p-5 md:p-6 rounded-2xl border border-slate-800/80 shadow-depth-sm text-left"
        >
          <h2 className="text-base font-bold mb-4.5 flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-indigo-400" />
            Контактная информация
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-field text-slate-350">
                <Phone className="w-4 h-4 inline mr-2 text-slate-455" />
                Телефон диспетчера
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field text-sm"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
            <div>
              <label className="label-field text-slate-350">
                <Mail className="w-4 h-4 inline mr-2 text-slate-455" />
                Email поддержки
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-sm"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label-field text-slate-350">
                <MapPin className="w-4 h-4 inline mr-2 text-slate-455" />
                Юридический адрес
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field text-sm"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Integration Credentials Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-2 p-5 md:p-6 rounded-2xl border border-slate-800/80 shadow-depth-sm text-left"
        >
          <h2 className="text-base font-bold mb-4.5 flex items-center gap-2 text-white">
            <Send className="w-5 h-5 text-indigo-400" />
            Интеграции и шлюзы
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-field text-slate-350">
                Telegram Bot Token
              </label>
              <input
                type="password"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="123456789:ABCDefGhIJK..."
                className="input-field text-sm font-mono"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
            <div>
              <label className="label-field text-slate-350">
                Telegram Chat ID (группа водителей)
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="-100123456789"
                className="input-field text-sm font-mono"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
            <div>
              <label className="label-field text-slate-350">
                NikitaSMS API Key (СМС-уведомления)
              </label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                placeholder="api_key_..."
                className="input-field text-sm font-mono"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
            <div>
              <label className="label-field text-slate-350">
                Ночная наценка (%)
              </label>
              <input
                type="number"
                value={nightSurcharge}
                onChange={(e) => setNightSurcharge(Number(e.target.value))}
                min="0"
                max="100"
                className="input-field text-sm"
                style={{ background: 'rgba(12, 14, 28, 0.45)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary h-12 px-8 font-semibold flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Сохранить настройки
              </>
            )}
          </button>
        </div>
      </form>

      {/* Advisory list info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="glass-2 p-5 rounded-2xl border border-amber-500/25 bg-amber-500/5 text-left flex gap-3.5"
      >
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
            Конфиденциальная информация
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Токены ботов, API-ключи СМС-шлюзов и другие конфиденциальные настройки хранятся в защищенном буфере на стороне сервера. Никогда не передавайте эти ключи посторонним лицам.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
