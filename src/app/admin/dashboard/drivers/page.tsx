'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Trash2, Edit2, Star, Phone, Car, CheckCircle2,
  XCircle, Loader2, Save, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Driver, CarClass } from '@/types';
import { cn } from '@/lib/utils';

const initialNewDriver = {
  name: '',
  phone: '+996 ',
  city: 'Бишкек',
  carModel: '',
  carNumber: '',
  carClass: 'economy' as CarClass,
  isActive: true,
  isVerified: false,
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newDriver, setNewDriver] = useState(initialNewDriver);

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/admin/drivers');
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const addDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });
      if (res.ok) {
        toast.success('Водитель добавлен');
        setShowAdd(false);
        setNewDriver(initialNewDriver);
        fetchDrivers();
      }
    } catch {
      toast.error('Ошибка добавления');
    }
  };

  const toggleStatus = async (driver: Driver, field: 'isActive' | 'isVerified') => {
    try {
      const res = await fetch(`/api/admin/drivers/${driver.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !driver[field] }),
      });
      if (res.ok) {
        toast.success('Обновлено');
        fetchDrivers();
      }
    } catch {
      toast.error('Ошибка');
    }
  };

  const deleteDriver = async (id: string) => {
    if (!confirm('Удалить водителя?')) return;
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Удалено');
        fetchDrivers();
      }
    } catch {
      toast.error('Ошибка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Водители</span>
          </h1>
          <p className="text-white/60">Управление водительским составом</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary flex items-center gap-2"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? 'Отмена' : 'Добавить'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={addDriver}
          className="glass-card p-6"
        >
          <h2 className="font-semibold mb-4">Новый водитель</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">ФИО</label>
              <input
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="input-field" required
              />
            </div>
            <div>
              <label className="label-field">Телефон</label>
              <input
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                className="input-field" required
              />
            </div>
            <div>
              <label className="label-field">Город</label>
              <select
                value={newDriver.city}
                onChange={(e) => setNewDriver({ ...newDriver, city: e.target.value })}
                className="input-field appearance-none cursor-pointer"
              >
                {['Бишкек', 'Ош', 'Каракол', 'Джалал-Абад', 'Нарын', 'Талас'].map(c =>
                  <option key={c} value={c} className="bg-dark-800">{c}</option>
                )}
              </select>
            </div>
            <div>
              <label className="label-field">Класс авто</label>
              <select
                value={newDriver.carClass}
                onChange={(e) => setNewDriver({ ...newDriver, carClass: e.target.value as CarClass })}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="economy" className="bg-dark-800">Эконом</option>
                <option value="comfort" className="bg-dark-800">Комфорт</option>
                <option value="business" className="bg-dark-800">Бизнес</option>
                <option value="minivan" className="bg-dark-800">Минивэн</option>
                <option value="cargo" className="bg-dark-800">Грузовое</option>
              </select>
            </div>
            <div>
              <label className="label-field">Модель авто</label>
              <input
                value={newDriver.carModel}
                onChange={(e) => setNewDriver({ ...newDriver, carModel: e.target.value })}
                placeholder="Toyota Camry"
                className="input-field" required
              />
            </div>
            <div>
              <label className="label-field">Номер авто</label>
              <input
                value={newDriver.carNumber}
                onChange={(e) => setNewDriver({ ...newDriver, carNumber: e.target.value })}
                placeholder="01KG 123 ABC"
                className="input-field" required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-4 flex items-center gap-2">
            <Save className="w-4 h-4" /> Сохранить
          </button>
        </motion.form>
      )}

      {/* Drivers list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : drivers.length === 0 ? (
        <div className="glass-card p-12 text-center text-white/60">
          Водителей пока нет. Добавьте первого!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{driver.name}</div>
                    <div className="flex items-center gap-1 text-sm text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {driver.rating.toFixed(1)}
                      <span className="text-white/40 ml-1">· {driver.totalTrips} поездок</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <Phone className="w-4 h-4 text-primary-400" />
                  <a href={`tel:${driver.phone}`} className="hover:text-primary-400">{driver.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Car className="w-4 h-4 text-primary-400" />
                  {driver.carModel} · {driver.carNumber}
                </div>
                <div className="text-xs text-white/40 capitalize">
                  {driver.city} · {driver.carClass}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => toggleStatus(driver, 'isActive')}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs transition border flex items-center justify-center gap-1',
                    driver.isActive
                      ? 'bg-green-500/20 border-green-500/40 text-green-300'
                      : 'bg-white/5 border-white/10 text-white/60'
                  )}
                >
                  {driver.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {driver.isActive ? 'Активен' : 'Неактивен'}
                </button>
                <button
                  onClick={() => toggleStatus(driver, 'isVerified')}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs transition border flex items-center justify-center gap-1',
                    driver.isVerified
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white/60'
                  )}
                >
                  {driver.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {driver.isVerified ? 'Проверен' : 'Не проверен'}
                </button>
              </div>

              <button
                onClick={() => deleteDriver(driver.id)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-red-500/10 hover:text-red-300 transition text-xs flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Удалить
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
