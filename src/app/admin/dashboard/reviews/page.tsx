'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, XCircle, Trash2, Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { Review } from '@/types';
import { formatDate, cn } from '@/lib/utils';

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const togglePublished = async (review: Review) => {
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !review.isPublished }),
      });
      if (res.ok) {
        toast.success(review.isPublished ? 'Снято с публикации' : 'Опубликовано');
        fetchReviews();
      }
    } catch { toast.error('Ошибка'); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Удалено');
        fetchReviews();
      }
    } catch { toast.error('Ошибка'); }
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.isPublished;
    if (filter === 'published') return r.isPublished;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Отзывы</span>
        </h1>
        <p className="text-white/60">Модерация отзывов клиентов</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'published'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm border transition',
              filter === f
                ? 'bg-primary-500 border-primary-400 text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            )}
          >
            {f === 'all' ? 'Все' : f === 'pending' ? 'Ожидают модерации' : 'Опубликованные'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-white/60">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          Отзывов нет
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <div className="font-semibold">{review.customerName}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-white/20'}`}
                      />
                    ))}
                    {review.city && <span className="text-xs text-white/40 ml-2">{review.city}</span>}
                  </div>
                </div>
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs border',
                  review.isPublished
                    ? 'bg-green-500/20 border-green-500/40 text-green-300'
                    : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                )}>
                  {review.isPublished ? 'Опубликован' : 'Модерация'}
                </div>
              </div>

              <p className="text-white/80 mb-3 italic">«{review.text}»</p>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs text-white/40">{formatDate(review.createdAt)}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublished(review)}
                    className={cn(
                      'px-3 py-1.5 rounded text-xs border flex items-center gap-1 transition',
                      review.isPublished
                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30'
                    )}
                  >
                    {review.isPublished ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {review.isPublished ? 'Снять с публикации' : 'Опубликовать'}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="px-3 py-1.5 rounded text-xs bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-300 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Удалить
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
