'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '@/components/Logo';

export default function DriverLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('+996 ');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/driver/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        toast.success('Добро пожаловать!');
        router.push('/driver/dashboard');
      } else {
        const err = await res.json();
        toast.error(err.error === 'Driver not verified or inactive'
          ? 'Аккаунт не активирован. Свяжитесь с админом.'
          : 'Водитель не найден');
      }
    } catch {
      toast.error('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-mint-500/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
            >
              <Logo size={64} animated />
            </motion.div>
            <h1 className="text-2xl font-bold mb-1 gradient-text">
              Кабинет водителя
            </h1>
            <p className="text-ink-muted text-sm">Войдите по номеру телефона</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">
                <Phone className="w-4 h-4 inline mr-2" />
                Ваш телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+996 555 ..."
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <LogIn className="w-5 h-5" />
                  Войти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-accent-500/10 border border-accent-500/30 text-sm text-accent-600 dark:text-accent-300">
            <strong>Демо:</strong> используйте номер существующего водителя из админки.
            Например: <code className="px-1 rounded bg-surface-elevated">+996 555 123 456</code>
          </div>

          <a href="/" className="block text-center mt-4 text-sm text-ink-muted hover:text-primary-500">
            ← На главную
          </a>
        </div>
      </motion.div>
    </div>
  );
}
