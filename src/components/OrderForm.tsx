'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Briefcase, Car, MessageSquare,
  Phone, User, CreditCard, CheckCircle2, Loader2, ArrowRight,
  Wallet, Clock, Sparkles, Tag, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale } from '@/lib/LocaleContext';
import { CarClass, PaymentMethod } from '@/types';
import { cn, formatPrice } from '@/lib/utils';

const cities = ['Бишкек', 'Ош', 'Каракол', 'Джалал-Абад', 'Нарын', 'Талас', 'Баткен', 'Чолпон-Ата'];

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  fromCity: string;
  fromAddress: string;
  toCity: string;
  toAddress: string;
  whenType: 'now' | 'later';
  scheduledAt: string;
  passengers: number;
  luggage: number;
  carClass: CarClass;
  paymentMethod: PaymentMethod;
  comment: string;
}

const initialData: OrderFormData = {
  customerName: '',
  customerPhone: '+996 ',
  fromCity: 'Бишкек',
  fromAddress: '',
  toCity: 'Бишкек',
  toAddress: '',
  whenType: 'now',
  scheduledAt: '',
  passengers: 1,
  luggage: 0,
  carClass: 'economy',
  paymentMethod: 'cash',
  comment: '',
};

export default function OrderForm() {
  const { t } = useLocale();
  const [data, setData] = useState<OrderFormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; price: number } | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);

  const finalPrice = promoApplied
    ? Math.round(estimatedPrice * (1 - promoApplied.discount / 100))
    : estimatedPrice;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoChecking(true);
    try {
      const res = await fetch('/api/promo/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });
      const json = await res.json();
      if (res.ok && json.valid) {
        setPromoApplied({ code: json.code, discount: json.discount });
        toast.success(`Промокод применён! Скидка ${json.discount}%`);
      } else {
        toast.error(json.error ?? 'Промокод недействителен');
      }
    } catch {
      toast.error('Ошибка проверки');
    } finally {
      setPromoChecking(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
  };

  // Расчёт цены в реальном времени
  useEffect(() => {
    const calc = async () => {
      if (!data.fromCity || !data.toCity) return;
      try {
        const res = await fetch('/api/price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromCity: data.fromCity,
            toCity: data.toCity,
            carClass: data.carClass,
            scheduledAt: data.whenType === 'later' ? data.scheduledAt : new Date().toISOString(),
          }),
        });
        if (res.ok) {
          const json = await res.json();
          setEstimatedPrice(json.price);
        }
      } catch {}
    };
    calc();
  }, [data.fromCity, data.toCity, data.carClass, data.whenType, data.scheduledAt]);

  const update = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.customerName.trim() || data.customerPhone.length < 10) {
      toast.error('Заполните имя и телефон');
      return;
    }
    if (!data.fromAddress.trim() || !data.toAddress.trim()) {
      toast.error('Укажите адреса');
      return;
    }
    if (data.whenType === 'later' && !data.scheduledAt) {
      toast.error('Укажите время поездки');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          fromCity: data.fromCity,
          fromAddress: data.fromAddress,
          toCity: data.toCity,
          toAddress: data.toAddress,
          scheduledAt: data.whenType === 'now' ? new Date().toISOString() : data.scheduledAt,
          passengers: data.passengers,
          luggage: data.luggage,
          carClass: data.carClass,
          paymentMethod: data.paymentMethod,
          comment: data.comment,
          estimatedPrice: finalPrice,
          promoCode: promoApplied?.code,
        }),
      });

      if (!res.ok) throw new Error('Failed');
      const order = await res.json();
      setSuccess({ id: order.id, price: order.estimatedPrice });
      toast.success(t.order.success);
    } catch {
      toast.error(t.order.error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setData(initialData);
    setSuccess(null);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <h3 className="text-3xl font-bold mb-2 gradient-text">{t.order.success}</h3>
        <p className="text-white/70 mb-6">{t.order.successText}</p>

        <div className="glass-card p-4 mb-6 inline-block">
          <div className="text-xs text-white/40 mb-1">{t.order.orderNumber}</div>
          <div className="text-xl font-mono font-bold text-primary-400">{success.id}</div>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="text-sm text-white/60">{t.order.estimatedPrice}</div>
          <div className="text-3xl font-bold gradient-text">{formatPrice(success.price)}</div>
        </div>

        <button onClick={resetForm} className="btn-primary inline-flex items-center gap-2">
          {t.order.newOrder}
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-5">
        {/* Имя */}
        <div>
          <label className="label-field">
            <User className="w-4 h-4 inline mr-2" />
            {t.order.name}
          </label>
          <input
            type="text"
            value={data.customerName}
            onChange={(e) => update('customerName', e.target.value)}
            placeholder={t.order.namePlaceholder}
            className="input-field"
            required
          />
        </div>

        {/* Телефон */}
        <div>
          <label className="label-field">
            <Phone className="w-4 h-4 inline mr-2" />
            {t.order.phone}
          </label>
          <input
            type="tel"
            value={data.customerPhone}
            onChange={(e) => update('customerPhone', e.target.value)}
            placeholder={t.order.phonePlaceholder}
            className="input-field"
            required
          />
        </div>

        {/* Город ОТКУДА */}
        <div>
          <label className="label-field">
            <MapPin className="w-4 h-4 inline mr-2 text-green-400" />
            {t.order.fromCity}
          </label>
          <select
            value={data.fromCity}
            onChange={(e) => update('fromCity', e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            {cities.map(c => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
          </select>
        </div>

        {/* Город КУДА */}
        <div>
          <label className="label-field">
            <MapPin className="w-4 h-4 inline mr-2 text-red-400" />
            {t.order.toCity}
          </label>
          <select
            value={data.toCity}
            onChange={(e) => update('toCity', e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            {cities.map(c => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
          </select>
        </div>

        {/* Адрес ОТКУДА */}
        <div>
          <label className="label-field">{t.order.fromAddress}</label>
          <input
            type="text"
            value={data.fromAddress}
            onChange={(e) => update('fromAddress', e.target.value)}
            placeholder={t.order.fromAddressPlaceholder}
            className="input-field"
            required
          />
        </div>

        {/* Адрес КУДА */}
        <div>
          <label className="label-field">{t.order.toAddress}</label>
          <input
            type="text"
            value={data.toAddress}
            onChange={(e) => update('toAddress', e.target.value)}
            placeholder={t.order.toAddressPlaceholder}
            className="input-field"
            required
          />
        </div>

        {/* Когда */}
        <div className="md:col-span-2">
          <label className="label-field">
            <Calendar className="w-4 h-4 inline mr-2" />
            {t.order.when}
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              type="button"
              onClick={() => update('whenType', 'now')}
              className={cn(
                'py-3 rounded-xl border transition-all flex items-center justify-center gap-2',
                data.whenType === 'now'
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              )}
            >
              <Clock className="w-4 h-4" />
              {t.order.whenNow}
            </button>
            <button
              type="button"
              onClick={() => update('whenType', 'later')}
              className={cn(
                'py-3 rounded-xl border transition-all flex items-center justify-center gap-2',
                data.whenType === 'later'
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              )}
            >
              <Calendar className="w-4 h-4" />
              {t.order.whenLater}
            </button>
          </div>

          <AnimatePresence>
            {data.whenType === 'later' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="datetime-local"
                  value={data.scheduledAt}
                  onChange={(e) => update('scheduledAt', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="input-field"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Пассажиры */}
        <div>
          <label className="label-field">
            <Users className="w-4 h-4 inline mr-2" />
            {t.order.passengers}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update('passengers', Math.max(1, data.passengers - 1))}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              −
            </button>
            <div className="flex-1 text-center text-xl font-bold">{data.passengers}</div>
            <button
              type="button"
              onClick={() => update('passengers', Math.min(8, data.passengers + 1))}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              +
            </button>
          </div>
        </div>

        {/* Багаж */}
        <div>
          <label className="label-field">
            <Briefcase className="w-4 h-4 inline mr-2" />
            {t.order.luggage}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update('luggage', Math.max(0, data.luggage - 1))}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              −
            </button>
            <div className="flex-1 text-center text-xl font-bold">{data.luggage}</div>
            <button
              type="button"
              onClick={() => update('luggage', Math.min(10, data.luggage + 1))}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              +
            </button>
          </div>
        </div>

        {/* Класс авто */}
        <div className="md:col-span-2">
          <label className="label-field">
            <Car className="w-4 h-4 inline mr-2" />
            {t.order.carClass}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['economy', 'comfort', 'business', 'minivan', 'cargo'] as CarClass[]).map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => update('carClass', cls)}
                className={cn(
                  'py-3 px-2 rounded-xl border transition-all text-sm font-medium',
                  data.carClass === cls
                    ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                )}
              >
                {t.tariffs.classes[cls].name}
              </button>
            ))}
          </div>
        </div>

        {/* Оплата */}
        <div className="md:col-span-2">
          <label className="label-field">
            <CreditCard className="w-4 h-4 inline mr-2" />
            {t.order.payment}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update('paymentMethod', 'cash')}
              className={cn(
                'py-3 rounded-xl border transition-all flex items-center justify-center gap-2',
                data.paymentMethod === 'cash'
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              )}
            >
              <Wallet className="w-4 h-4" />
              {t.order.cash}
            </button>
            <button
              type="button"
              onClick={() => update('paymentMethod', 'card')}
              className={cn(
                'py-3 rounded-xl border transition-all flex items-center justify-center gap-2',
                data.paymentMethod === 'card'
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              )}
            >
              <CreditCard className="w-4 h-4" />
              {t.order.card}
            </button>
          </div>
        </div>

        {/* Комментарий */}
        <div className="md:col-span-2">
          <label className="label-field">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {t.order.comment}
          </label>
          <textarea
            value={data.comment}
            onChange={(e) => update('comment', e.target.value)}
            placeholder={t.order.commentPlaceholder}
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </div>

      {/* Промокод */}
      <div className="mt-5">
        <label className="label-field">
          <Tag className="w-4 h-4 inline mr-2" />
          Промокод (если есть)
        </label>
        {promoApplied ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="flex-1 font-mono font-semibold text-green-300">{promoApplied.code}</span>
            <span className="text-green-300 text-sm">−{promoApplied.discount}%</span>
            <button type="button" onClick={removePromo} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              className="input-field font-mono flex-1"
            />
            <button
              type="button"
              onClick={applyPromo}
              disabled={promoChecking}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition disabled:opacity-50"
            >
              {promoChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Применить'}
            </button>
          </div>
        )}
      </div>

      {/* Цена и кнопка */}
      <motion.div
        layout
        className="mt-6 p-5 rounded-xl bg-gradient-to-r from-primary-500/20 to-primary-600/10 border border-primary-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <Sparkles className="w-4 h-4 text-primary-400" />
              {t.order.estimatedPrice}
            </div>
            {promoApplied && estimatedPrice > 0 && (
              <div className="text-lg text-white/40 line-through">{formatPrice(estimatedPrice)}</div>
            )}
            <div className="text-3xl md:text-4xl font-bold gradient-text">
              {formatPrice(finalPrice)}
            </div>
            {promoApplied && (
              <div className="text-sm text-green-300 mt-1">
                Скидка по промокоду {promoApplied.code}: −{formatPrice(estimatedPrice - finalPrice)}
              </div>
            )}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="btn-primary w-full text-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.order.submitting}
            </>
          ) : (
            <>
              {t.order.submit}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
