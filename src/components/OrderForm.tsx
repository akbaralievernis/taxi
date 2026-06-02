'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Briefcase, MessageSquare,
  Phone, User, CreditCard, CheckCircle2, Loader2, ArrowRight, ArrowLeft,
  Wallet, Clock, Sparkles, Tag, X, Hash, MapPin, BadgeCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale } from '@/lib/LocaleContext';
import { CarClass, PaymentMethod } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import StepIndicator from './booking/StepIndicator';
import VehicleCard from './booking/VehicleCard';
import FindingDriver from './booking/FindingDriver';
import AddressInput from './booking/AddressInput';

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
const CLASS_MULTIPLIERS: Record<CarClass, number> = {
  economy: 1.0,
  comfort: 1.25,
  business: 1.9,
  minivan: 1.7,
  cargo: 1.5,
};

const selectedBtn = 'bg-gradient-to-r from-primary-500 to-purple-500 border-transparent text-white shadow-glow-sm';
const idleBtn = 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:border-slate-700 hover:text-white';

const initialData = {
  customerName: '',
  customerPhone: '+996 ',
  fromAddress: '',
  toAddress: '',
  whenType: 'now' as const,
  scheduledAt: '',
  passengers: 1,
  luggage: 0,
  carClass: 'economy' as CarClass,
  paymentMethod: 'cash' as PaymentMethod,
  comment: '',
};

interface OrderFormProps {
  defaultFromCity?: string;
  defaultToCity?: string;
}

export default function OrderForm({ defaultFromCity = 'Бишкек', defaultToCity = 'Бишкек' }: OrderFormProps) {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OrderFormData>({
    ...initialData,
    fromCity: defaultFromCity,
    toCity: defaultToCity,
  });
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

  function update<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  const getPriceForClass = (cls: CarClass) => {
    if (!estimatedPrice) return 0;
    const currentMultiplier = CLASS_MULTIPLIERS[data.carClass];
    const base = estimatedPrice / currentMultiplier;
    return Math.round(base * CLASS_MULTIPLIERS[cls]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          estimatedPrice: finalPrice,
          promoCode: promoApplied?.code,
          scheduledAt: data.whenType === 'now' ? new Date().toISOString() : data.scheduledAt,
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
    setData({
      ...initialData,
      fromCity: defaultFromCity,
      toCity: defaultToCity,
    });
    setSuccess(null);
    setPromoApplied(null);
    setPromoCode('');
    setStep(1);
  };

  const isStep1Valid = data.fromAddress.trim().length > 2 && data.toAddress.trim().length > 2;
  const isStep3Valid =
    data.customerName.trim().length > 1 &&
    data.customerPhone.trim().replace(/\D/g, '').length >= 9 &&
    (data.whenType === 'now' || !!data.scheduledAt);

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) {
      toast.error('Заполните адреса отправления и назначения');
      return;
    }
    if (step === 3 && !isStep3Valid) {
      toast.error('Заполните имя, телефон и время поездки');
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  if (submitting) {
    return (
      <div className="glass-card-strong p-8 md:p-12 max-w-xl mx-auto shadow-depth-md">
        <FindingDriver />
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto relative overflow-hidden shadow-depth-md border-primary-500/10"
        style={{ background: 'rgba(12, 14, 28, 0.75)' }}
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-mint-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-mint-400 via-mint-500 to-accent-500 flex items-center justify-center shadow-glow"
          >
            <CheckCircle2 className="w-14 h-14 text-white" />
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white font-display">{t.order.success}</h3>
          <p className="text-slate-400 mb-8 text-base max-w-md mx-auto">{t.order.successText}</p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="glass-2 p-4 rounded-xl border border-slate-800 text-left">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">{t.order.orderNumber}</div>
              <div className="text-base font-mono font-bold text-white flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-primary-400" />
                {success.id}
              </div>
            </div>

            <div className="glass-2 p-4 rounded-xl border border-slate-800 text-left">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">{t.order.estimatedPrice}</div>
              <div className="text-lg font-bold text-primary-400 font-display">
                {formatPrice(success.price)}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a
              href={`/track`}
              className="btn-ghost flex items-center gap-2 justify-center h-12 px-6 text-white border-slate-800 hover:bg-slate-900/60"
            >
              Отследить заказ
            </a>
            <button onClick={resetForm} className="btn-primary flex items-center gap-2 justify-center h-12 px-6">
              {t.order.newOrder}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const stepsLabels = ['Маршрут', 'Автомобиль', 'Детали', 'Подтверждение'];

  return (
    <div
      className="glass-card-strong p-5 md:p-8 max-w-4xl mx-auto shadow-depth-md relative overflow-hidden"
      style={{ background: 'rgba(12, 14, 28, 0.65)' }}
    >
      <StepIndicator currentStep={step} steps={stepsLabels} />

      <div className="min-h-[300px] mt-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">
                    <MapPin className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.fromCity}
                  </label>
                  <select
                    value={data.fromCity}
                    onChange={(e) => update('fromCity', e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                    style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                  >
                    {cities.map(c => <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label-field">
                    <MapPin className="w-4 h-4 inline mr-2 text-pink-500" />
                    {t.order.toCity}
                  </label>
                  <select
                    value={data.toCity}
                    onChange={(e) => update('toCity', e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                    style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                  >
                    {cities.map(c => <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <AddressInput
                  label={t.order.fromAddress}
                  value={data.fromAddress}
                  city={data.fromCity}
                  onChange={(val) => update('fromAddress', val)}
                  placeholder={t.order.fromAddressPlaceholder}
                  iconColor="text-primary-500"
                />
                <AddressInput
                  label={t.order.toAddress}
                  value={data.toAddress}
                  city={data.toCity}
                  onChange={(val) => update('toAddress', val)}
                  placeholder={t.order.toAddressPlaceholder}
                  iconColor="text-pink-500"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-300">Выберите класс поездки:</h4>
                <span className="text-xs text-slate-500">Цены ориентировочные</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {([
                  { key: 'economy', name: t.tariffs.classes.economy.name, desc: t.tariffs.classes.economy.desc },
                  { key: 'comfort', name: t.tariffs.classes.comfort.name, desc: t.tariffs.classes.comfort.desc },
                  { key: 'business', name: t.tariffs.classes.business.name, desc: t.tariffs.classes.business.desc },
                  { key: 'minivan', name: t.tariffs.classes.minivan.name, desc: t.tariffs.classes.minivan.desc },
                  { key: 'cargo', name: t.tariffs.classes.cargo.name, desc: t.tariffs.classes.cargo.desc },
                ] as { key: CarClass; name: string; desc: string }[]).map((v) => (
                  <VehicleCard
                    key={v.key}
                    cls={v.key}
                    selected={data.carClass === v.key}
                    name={v.name}
                    desc={v.desc}
                    onClick={() => update('carClass', v.key)}
                    price={getPriceForClass(v.key)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">
                    <User className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.name}
                  </label>
                  <input
                    type="text"
                    value={data.customerName}
                    onChange={(e) => update('customerName', e.target.value)}
                    placeholder={t.order.namePlaceholder}
                    className="input-field"
                    style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                    required
                  />
                </div>

                <div>
                  <label className="label-field">
                    <Phone className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.phone}
                  </label>
                  <input
                    type="tel"
                    value={data.customerPhone}
                    onChange={(e) => update('customerPhone', e.target.value)}
                    placeholder={t.order.phonePlaceholder}
                    className="input-field"
                    style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                    required
                  />
                </div>

                <div>
                  <label className="label-field">
                    <Users className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.passengers}
                  </label>
                  <div className="flex items-center gap-3 glass-2 p-1.5 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => update('passengers', Math.max(1, data.passengers - 1))}
                      className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 hover:bg-primary-500/10 hover:text-primary-500 transition font-bold text-lg text-white"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center text-lg font-bold text-white">{data.passengers}</div>
                    <button
                      type="button"
                      onClick={() => update('passengers', Math.min(8, data.passengers + 1))}
                      className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 hover:bg-primary-500/10 hover:text-primary-500 transition font-bold text-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label-field">
                    <Briefcase className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.luggage}
                  </label>
                  <div className="flex items-center gap-3 glass-2 p-1.5 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => update('luggage', Math.max(0, data.luggage - 1))}
                      className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 hover:bg-primary-500/10 hover:text-primary-500 transition font-bold text-lg text-white"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center text-lg font-bold text-white">{data.luggage}</div>
                    <button
                      type="button"
                      onClick={() => update('luggage', Math.min(10, data.luggage + 1))}
                      className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 hover:bg-primary-500/10 hover:text-primary-500 transition font-bold text-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label-field">
                    <CreditCard className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.payment}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => update('paymentMethod', 'cash')}
                      className={cn(
                        'py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium',
                        data.paymentMethod === 'cash' ? selectedBtn : idleBtn
                      )}
                    >
                      <Wallet className="w-4 h-4" />
                      {t.order.cash}
                    </button>
                    <button
                      type="button"
                      onClick={() => update('paymentMethod', 'card')}
                      className={cn(
                        'py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium',
                        data.paymentMethod === 'card' ? selectedBtn : idleBtn
                      )}
                    >
                      <CreditCard className="w-4 h-4" />
                      {t.order.card}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label-field">
                    <Calendar className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.when}
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3.5">
                    <button
                      type="button"
                      onClick={() => update('whenType', 'now')}
                      className={cn(
                        'py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium',
                        data.whenType === 'now' ? selectedBtn : idleBtn
                      )}
                    >
                      <Clock className="w-4.5 h-4.5" />
                      {t.order.whenNow}
                    </button>
                    <button
                      type="button"
                      onClick={() => update('whenType', 'later')}
                      className={cn(
                        'py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium',
                        data.whenType === 'later' ? selectedBtn : idleBtn
                      )}
                    >
                      <Calendar className="w-4.5 h-4.5" />
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
                          style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="md:col-span-2">
                  <label className="label-field">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-primary-500" />
                    {t.order.comment}
                  </label>
                  <textarea
                    value={data.comment}
                    onChange={(e) => update('comment', e.target.value)}
                    placeholder={t.order.commentPlaceholder}
                    rows={2}
                    className="input-field resize-none"
                    style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-2 p-4 rounded-2xl border border-slate-800 text-left">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2.5 block">Маршрут поездки</span>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400">Откуда ({data.fromCity})</div>
                        <div className="text-sm font-semibold text-white">{data.fromAddress}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400">Куда ({data.toCity})</div>
                        <div className="text-sm font-semibold text-white">{data.toAddress}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-2 p-4 rounded-2xl border border-slate-800 text-left space-y-3.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Детали заказа</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Пассажир</span>
                      <span className="text-white font-semibold">{data.customerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Класс</span>
                      <span className="text-white font-semibold uppercase">{t.tariffs.classes[data.carClass].name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Оплата</span>
                      <span className="text-white font-semibold">
                        {data.paymentMethod === 'cash' ? 'Наличные' : 'Карта водителю'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Время подачи</span>
                      <span className="text-white font-semibold">
                        {data.whenType === 'now' ? 'Сейчас' : 'Запланировано'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-2 p-4.5 rounded-2xl border border-slate-800 text-left">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-mint-500" />
                  Промокод (если есть)
                </label>
                {promoApplied ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-mint-500/10 border border-mint-500/40">
                    <BadgeCheck className="w-5 h-5 text-mint-400 shrink-0" />
                    <span className="flex-1 font-mono font-semibold text-mint-400">{promoApplied.code}</span>
                    <span className="text-mint-400 text-xs font-semibold">−{promoApplied.discount}%</span>
                    <button type="button" onClick={removePromo} className="p-1 hover:bg-slate-900 rounded transition">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="WELCOME10"
                      className="input-field font-mono flex-1 h-11 text-sm"
                      style={{ background: 'rgba(12, 14, 28, 0.45)' }}
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoChecking || !promoCode.trim()}
                      className="px-5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold hover:bg-primary-500 hover:text-white transition disabled:opacity-50"
                    >
                      {promoChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Применить'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="btn-ghost flex items-center gap-2 h-11 px-5 text-sm font-semibold border-slate-800 hover:bg-slate-900/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-4">
          {estimatedPrice > 0 && (
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Итого:</span>
              <span className="text-base font-bold text-primary-400 font-display">
                {formatPrice(finalPrice)}
              </span>
            </div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary flex items-center gap-2 h-11 px-6 text-sm font-semibold"
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 border-transparent shadow-glow flex items-center gap-2 h-11 px-8 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  Подтвердить и заказать
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
