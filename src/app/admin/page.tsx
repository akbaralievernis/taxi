'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, Loader2, Car } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      if (res.ok) {
        toast.success('Добро пожаловать!');
        router.push('/admin/dashboard');
      } else {
        toast.error('Неверный логин или пароль');
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
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 flex items-center justify-center glow"
            >
              <Car className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text mb-1">Админ-панель</h1>
            <p className="text-ink-muted text-sm">Войдите для управления сайтом</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">
                <User className="w-4 h-4 inline mr-2" />
                Логин
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="input-field"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="label-field">
                <Lock className="w-4 h-4 inline mr-2" />
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Войти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-accent-500/10 border border-accent-500/30 text-sm text-accent-600 dark:text-accent-300">
            <strong>Демо-доступ:</strong><br />
            Логин: <code className="px-1 rounded bg-surface-elevated">admin</code><br />
            Пароль: <code className="px-1 rounded bg-surface-elevated">admin123</code>
          </div>

          <a href="/" className="block text-center mt-4 text-sm text-ink-muted hover:text-primary-500 transition">
            ← На главную
          </a>
        </div>
      </motion.div>
    </div>
  );
}
