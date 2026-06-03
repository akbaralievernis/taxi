'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Filter, Loader2, RefreshCcw, User, Globe, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  created_at: string;
  actor: string;
  action: string;
  target_type?: string;
  target_id?: string;
  ip_address?: string;
  metadata?: any;
}

const actionColors: Record<string, string> = {
  login: 'text-mint-500',
  failed: 'text-pink-500',
  rate_limited: 'text-yellow-500',
  bot_blocked: 'text-pink-500',
  created: 'text-primary-500',
  updated: 'text-accent-500',
  deleted: 'text-pink-500',
  cancelled: 'text-pink-500',
};

function colorFor(action: string): string {
  for (const [key, color] of Object.entries(actionColors)) {
    if (action.includes(key)) return color;
  }
  return 'text-ink-muted';
}

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set('action', actionFilter);
      params.set('limit', '200');
      const res = await fetch(`/api/admin/audit?${params}`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-500" />
            <span className="gradient-text">Журнал событий</span>
          </h1>
          <p className="text-ink-muted">Все важные действия в системе</p>
        </div>
        <button
          onClick={fetchEntries}
          className="px-3 py-2 rounded-lg glass-card hover:bg-surface-elevated transition text-sm flex items-center gap-2"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Обновить
        </button>
      </div>

      {/* Filter chips */}
      <div className="glass-card p-3 flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-ink-subtle ml-1" />
        {[
          { val: '', label: 'Все' },
          { val: 'admin.login', label: 'Вход админа' },
          { val: 'order.created', label: 'Новые заказы' },
          { val: 'order.bot_blocked', label: 'Заблок. боты' },
          { val: 'order.rate_limited', label: 'Rate-limit' },
          { val: 'driver.login.success', label: 'Вход водителей' },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setActionFilter(f.val)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition border',
              actionFilter === f.val
                ? 'bg-primary-500 border-primary-400 text-white'
                : 'bg-surface-elevated border-border text-ink-muted hover:text-ink'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-12 text-center text-ink-muted">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <div>Событий пока нет.</div>
          <div className="text-xs mt-2">Подключите Supabase, чтобы события сохранялись постоянно.</div>
        </div>
      ) : (
        <div className="glass-card divide-y divide-border overflow-hidden">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
              className="p-4 hover:bg-surface-elevated/40 transition flex items-start gap-3"
            >
              <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0', colorFor(entry.action).replace('text-', 'bg-'))} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className={cn('text-sm font-mono font-semibold', colorFor(entry.action))}>
                    {entry.action}
                  </code>
                  {entry.target_id && (
                    <span className="text-xs text-ink-subtle font-mono">→ {entry.target_id}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-subtle">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {entry.actor}
                  </span>
                  {entry.ip_address && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {entry.ip_address}
                    </span>
                  )}
                  <span>{new Date(entry.created_at).toLocaleString('ru-RU')}</span>
                </div>
                {entry.metadata && (
                  <div className="mt-2 text-xs text-ink-subtle font-mono bg-surface-elevated/60 p-2 rounded overflow-x-auto">
                    {JSON.stringify(entry.metadata, null, 0).slice(0, 200)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
