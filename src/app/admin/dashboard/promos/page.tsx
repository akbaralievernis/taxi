'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Tag, X, Save, Loader2, Calendar, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import { Promo } from '@/types';
import { cn, formatDate } from '@/lib/utils';

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discount: 10,
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    maxUses: 100,
    isActive: true,
  });

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/admin/promos');
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const addPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          validUntil: new Date(form.validUntil).toISOString(),
        }),
      });
      if (res.ok) {
        toast.success('Промокод создан');
        setShowAdd(false);
        setForm({ code: '', discount: 10, validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), maxUses: 100, isActive: true });
        fetchPromos();
      }
    } catch {
      toast.error('Ошибка');
    }
  };

  const toggleActive = async (promo: Promo) => {
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      if (res.ok) {
        toast.success('Обновлено');
        fetchPromos();
      }
    } catch { toast.error('Ошибка'); }
  };

  const deletePromo = async (id: string) => {
    if (!confirm('Удалить промокод?')) return;
    try {
      const res = await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Удалено');
        fetchPromos();
      }
    } catch { toast.error('Ошибка'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Промокоды</span>
          </h1>
          <p className="text-white/60">Скидки и акции для клиентов</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary flex items-center gap-2"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? 'Отмена' : 'Создать промокод'}
        </button>
      </div>

      {showAdd && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={addPromo}
          className="glass-card p-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Код промокода</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="WELCOME10"
                className="input-field font-mono"
                required
              />
            </div>
            <div>
              <label className="label-field">Скидка (%)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: +e.target.value })}
                className="input-field"
                min="1" max="100" required
              />
            </div>
            <div>
              <label className="label-field">Действует до</label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">Макс. использований</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: +e.target.value })}
                className="input-field"
                min="1" required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-4 flex items-center gap-2">
            <Save className="w-4 h-4" /> Сохранить
          </button>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : promos.length === 0 ? (
        <div className="glass-card p-12 text-center text-white/60">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          Промокодов пока нет. Создайте первый!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => {
            const expired = new Date(promo.validUntil) < new Date();
            const used = promo.usedCount >= promo.maxUses;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'glass-card p-5',
                  (expired || used || !promo.isActive) && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold font-mono gradient-text">{promo.code}</div>
                    <div className="text-sm text-white/60 flex items-center gap-1 mt-1">
                      <Percent className="w-3.5 h-3.5" />
                      Скидка {promo.discount}%
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActive(promo)}
                    className={cn(
                      'px-2 py-1 rounded text-xs border',
                      promo.isActive
                        ? 'bg-green-500/20 border-green-500/40 text-green-300'
                        : 'bg-white/5 border-white/10 text-white/60'
                    )}
                  >
                    {promo.isActive ? 'Активен' : 'Выкл'}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-white/60 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    До {formatDate(promo.validUntil)}
                  </div>
                  <div>Использовано: {promo.usedCount} / {promo.maxUses}</div>
                  {expired && <div className="text-red-300">⚠ Истёк</div>}
                  {used && <div className="text-yellow-300">⚠ Лимит исчерпан</div>}
                </div>

                <button
                  onClick={() => deletePromo(promo.id)}
                  className="w-full px-3 py-1.5 rounded text-xs bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-300 transition flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Удалить
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="glass-card p-4 bg-blue-500/5 border-blue-500/20 text-sm text-blue-200">
        <strong>💡 Совет:</strong> Создайте промокоды типа <code className="px-1 bg-white/10 rounded">WELCOME10</code>,
        <code className="px-1 bg-white/10 rounded ml-1">SUMMER20</code> для привлечения новых клиентов.
        Клиент может ввести их при заказе и получить скидку.
      </div>
    </div>
  );
}
