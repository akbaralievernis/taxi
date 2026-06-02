'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquarePlus, Send, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Review } from '@/types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [idx, setIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', text: '', rating: 5, city: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.text.trim()) {
      toast.error('Заполните все поля');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Спасибо! Отзыв опубликуют после модерации');
        setForm({ customerName: '', text: '', rating: 5, city: '' });
        setShowForm(false);
      } else {
        toast.error('Ошибка отправки');
      }
    } finally {
      setSending(false);
    }
  };

  if (reviews.length === 0) return null;

  const review = reviews[idx];

  return (
    <section id="reviews" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <div className="badge badge-accent mb-4">
            <Star className="w-3 h-3" />
            Отзывы
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Отзывы клиентов</span>
          </h2>
          <p className="text-ink-muted text-lg">Что говорят те, кто уже ездил с нами</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/10 blur-3xl" />
              <Quote className="w-20 h-20 text-primary-500/15 absolute top-6 left-6" />

              <div className="relative">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-ink-subtle/30'}`}
                    />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-ink leading-relaxed mb-8 italic font-medium">
                  «{review.text}»
                </p>

                <div className="flex items-center gap-4 pt-5 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 flex items-center justify-center font-bold text-lg text-white shadow-glow-sm">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-ink">{review.customerName}</div>
                    {review.city && <div className="text-sm text-ink-subtle">{review.city}</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setIdx((i) => (i - 1 + reviews.length) % reviews.length)}
                className="w-11 h-11 rounded-full glass-card hover:shadow-glow-sm transition flex items-center justify-center text-ink-muted hover:text-primary-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === idx
                        ? 'w-8 bg-gradient-to-r from-primary-500 to-purple-500'
                        : 'w-2 bg-ink-subtle/30 hover:bg-ink-subtle/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIdx((i) => (i + 1) % reviews.length)}
                className="w-11 h-11 rounded-full glass-card hover:shadow-glow-sm transition flex items-center justify-center text-ink-muted hover:text-primary-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              {showForm ? <X className="w-4 h-4" /> : <MessageSquarePlus className="w-4 h-4" />}
              {showForm ? 'Отмена' : 'Оставить отзыв'}
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={submitReview}
                className="glass-card p-6 mt-6"
              >
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">Ваше имя</label>
                      <input
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-field">Город (необязательно)</label>
                      <input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="input-field"
                        placeholder="Бишкек"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Оценка</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setForm({ ...form, rating: r })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={`w-8 h-8 ${r <= form.rating ? 'text-yellow-400 fill-current' : 'text-ink-subtle/30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Ваш отзыв</label>
                    <textarea
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      rows={4}
                      maxLength={500}
                      className="input-field resize-none"
                      placeholder="Поделитесь впечатлениями..."
                      required
                    />
                    <div className="text-xs text-ink-subtle mt-1 text-right">
                      {form.text.length}/500
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Отправить
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
