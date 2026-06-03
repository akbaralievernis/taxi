'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Copy, Check, AlertCircle, KeyRound, Smartphone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface HealthData {
  status: string;
  database: { ok: boolean; backend: string; error?: string };
  integrations: {
    supabase: boolean;
    email: boolean;
    telegram: boolean;
    sms: boolean;
    maps: boolean;
    twofa: boolean;
  };
}

export default function SecurityPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [twoFa, setTwoFa] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(setHealth);
  }, []);

  const generate = async () => {
    const res = await fetch('/api/admin/2fa/setup');
    const data = await res.json();
    setTwoFa(data);
    setVerified(null);
    setCode('');
  };

  const verify = async () => {
    if (!twoFa) return;
    setVerifying(true);
    try {
      const res = await fetch('/api/admin/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: twoFa.secret, code }),
      });
      const data = await res.json();
      setVerified(data.valid);
      if (data.valid) toast.success('Код верен! Сохраните секрет в Vercel env.');
      else toast.error('Код неверный — попробуйте ещё раз');
    } finally {
      setVerifying(false);
    }
  };

  const copySecret = () => {
    if (!twoFa) return;
    navigator.clipboard.writeText(twoFa.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Скопировано');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-500" />
          <span className="gradient-text">Безопасность</span>
        </h1>
        <p className="text-ink-muted">Состояние интеграций и настройка 2FA</p>
      </div>

      {/* Integration status */}
      {health && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold mb-4">Статус интеграций</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'supabase', label: 'Postgres БД (Supabase)' },
              { key: 'email',    label: 'Email (Resend)' },
              { key: 'telegram', label: 'Telegram-бот' },
              { key: 'sms',      label: 'SMS-провайдер' },
              { key: 'maps',     label: 'Карты 2GIS' },
              { key: 'twofa',    label: '2FA для админа' },
            ].map(({ key, label }) => {
              const ok = health.integrations[key as keyof typeof health.integrations];
              return (
                <div
                  key={key}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    ok
                      ? 'bg-mint-500/10 border-mint-500/30'
                      : 'bg-surface-elevated border-border'
                  }`}
                >
                  <span className="text-sm text-ink-muted">{label}</span>
                  <span className={`text-xs font-semibold ${ok ? 'text-mint-600 dark:text-mint-400' : 'text-ink-subtle'}`}>
                    {ok ? '● ON' : '○ off'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 p-3 rounded-xl border ${health.database.ok ? 'bg-mint-500/5 border-mint-500/20' : 'bg-pink-500/5 border-pink-500/20'}`}>
            <div className="text-sm">
              БД: <strong>{health.database.backend}</strong> — {health.database.ok ? '✓ работает' : '✗ ошибка'}
              {health.database.error && <span className="text-pink-500 ml-2">({health.database.error})</span>}
            </div>
          </div>
        </motion.div>
      )}

      {/* 2FA setup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary-500" />
          Двухфакторная аутентификация
        </h2>
        <p className="text-sm text-ink-muted mb-4">
          Защитите вход в админку второй кодом из мобильного приложения (Google Authenticator, Authy, 1Password)
        </p>

        {health?.integrations.twofa && (
          <div className="p-3 rounded-xl bg-mint-500/10 border border-mint-500/30 text-mint-600 dark:text-mint-400 text-sm mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            2FA уже включена — каждый вход требует код.
          </div>
        )}

        {!twoFa ? (
          <button onClick={generate} className="btn-primary inline-flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Сгенерировать секрет
          </button>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-ink-subtle uppercase tracking-wider mb-2">QR-код</div>
                <img
                  src={twoFa.qrCodeUrl}
                  alt="QR for 2FA"
                  className="w-60 h-60 rounded-xl bg-white p-2"
                />
                <p className="text-xs text-ink-subtle mt-2">
                  Отсканируйте приложением Google Authenticator
                </p>
              </div>

              <div>
                <div className="text-xs text-ink-subtle uppercase tracking-wider mb-2">Секрет (для ручного ввода)</div>
                <div className="glass-card p-3 flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono break-all text-primary-500">{twoFa.secret}</code>
                  <button
                    onClick={copySecret}
                    className="shrink-0 w-8 h-8 rounded-lg bg-surface-elevated hover:bg-primary-500/20 flex items-center justify-center"
                  >
                    {copied ? <Check className="w-4 h-4 text-mint-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-5">
                  <label className="label-field">Проверочный код</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="input-field font-mono text-center text-xl tracking-widest"
                    />
                    <button
                      onClick={verify}
                      disabled={verifying || code.length !== 6}
                      className="btn-primary px-5 disabled:opacity-50"
                    >
                      {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Проверить'}
                    </button>
                  </div>
                </div>

                {verified === true && (
                  <div className="mt-4 p-4 rounded-xl bg-mint-500/10 border border-mint-500/30 text-sm">
                    <div className="text-mint-600 dark:text-mint-400 font-semibold mb-2">✓ Код верный!</div>
                    <div className="text-ink-muted">
                      Теперь сохраните секрет в Vercel env:<br />
                      <code className="block mt-2 p-2 bg-surface text-primary-500 rounded text-xs break-all">
                        ADMIN_TOTP_SECRET={twoFa.secret}
                      </code>
                      После Redeploy 2FA будет обязательной для входа в админку.
                    </div>
                  </div>
                )}
                {verified === false && (
                  <div className="mt-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-pink-500 mt-0.5" />
                    <span>Код не подходит. Проверьте, что время на телефоне синхронизировано.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Production checklist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 bg-gradient-to-br from-primary-500/5 to-purple-500/5"
      >
        <h2 className="text-lg font-bold mb-4">Чек-лист продакшена</h2>
        <ul className="space-y-3 text-sm">
          {[
            { ok: !!health?.integrations.supabase, label: 'Подключить Supabase (БД)', env: 'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY' },
            { ok: !!process.env.NEXT_PUBLIC_JWT_STRONG, label: 'Сильный JWT_SECRET (32+ символов)', env: 'JWT_SECRET' },
            { ok: !!health?.integrations.twofa, label: '2FA для админа', env: 'ADMIN_TOTP_SECRET' },
            { ok: !!health?.integrations.email, label: 'Email (Resend)', env: 'RESEND_API_KEY, ADMIN_EMAIL' },
            { ok: !!health?.integrations.telegram, label: 'Telegram-бот водителей', env: 'TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID' },
            { ok: !!health?.integrations.sms, label: 'SMS (NikitaSMS/SMSC.kg)', env: 'SMS_PROVIDER, SMS_LOGIN, SMS_PASSWORD' },
            { ok: !!health?.integrations.maps, label: '2GIS карты + автокомплит', env: 'NEXT_PUBLIC_2GIS_API_KEY' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  item.ok ? 'bg-mint-500 text-white' : 'border-2 border-border'
                }`}
              >
                {item.ok && <Check className="w-3 h-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={item.ok ? 'text-ink' : 'text-ink-muted'}>{item.label}</div>
                <code className="text-xs text-ink-subtle font-mono">{item.env}</code>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
