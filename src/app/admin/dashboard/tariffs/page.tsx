'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, DollarSign, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tariff } from '@/types';

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchTariffs = async () => {
    try {
      const res = await fetch('/api/admin/tariffs');
      const data = await res.json();
      setTariffs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTariffs(); }, []);

  const updateField = (id: string, field: keyof Tariff, value: number) => {
    setTariffs(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const saveTariff = async (tariff: Tariff) => {
    setSaving(tariff.id);
    try {
      const res = await fetch(`/api/admin/tariffs/${tariff.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basePrice: tariff.basePrice,
          pricePerKm: tariff.pricePerKm,
          pricePerMin: tariff.pricePerMin,
          nightSurcharge: tariff.nightSurcharge,
          intercityPricePerKm: tariff.intercityPricePerKm,
        }),
      });
      if (res.ok) {
        toast.success(`Тариф "${tariff.name}" сохранён`);
      }
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Тарифы</span>
        </h1>
        <p className="text-white/60">Управление ценами на услуги</p>
      </div>

      <div className="space-y-4">
        {tariffs.map((tariff, i) => (
          <motion.div
            key={tariff.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{tariff.name}</h2>
                <p className="text-sm text-white/60">{tariff.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="label-field text-xs">Минимальная (сом)</label>
                <input
                  type="number"
                  value={tariff.basePrice}
                  onChange={(e) => updateField(tariff.id, 'basePrice', +e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="label-field text-xs">За км в городе (сом)</label>
                <input
                  type="number"
                  value={tariff.pricePerKm}
                  onChange={(e) => updateField(tariff.id, 'pricePerKm', +e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="label-field text-xs">За км межгород (сом)</label>
                <input
                  type="number"
                  value={tariff.intercityPricePerKm}
                  onChange={(e) => updateField(tariff.id, 'intercityPricePerKm', +e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="label-field text-xs">За мин ожидания (сом)</label>
                <input
                  type="number"
                  value={tariff.pricePerMin}
                  onChange={(e) => updateField(tariff.id, 'pricePerMin', +e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="label-field text-xs">
                  <Moon className="w-3 h-3 inline" /> Ночная (%)
                </label>
                <input
                  type="number"
                  value={tariff.nightSurcharge}
                  onChange={(e) => updateField(tariff.id, 'nightSurcharge', +e.target.value)}
                  className="input-field"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <button
              onClick={() => saveTariff(tariff)}
              disabled={saving === tariff.id}
              className="btn-primary mt-4 flex items-center gap-2 disabled:opacity-50"
            >
              {saving === tariff.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Сохранить
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-5 bg-blue-500/5 border-blue-500/20 text-sm text-blue-200">
        <strong>💡 Подсказка:</strong> Цены обновляются мгновенно. Ночная наценка применяется
        автоматически с 22:00 до 06:00. Изменения сразу видны клиентам.
      </div>
    </div>
  );
}
