'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Phone, MapPin, Calendar, Users, Trash2,
  CheckCircle2, XCircle, Car, MessageSquare, ChevronDown,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, OrderStatus } from '@/types';
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils';

const statusFilters: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: 'Ожидают' },
  { value: 'accepted', label: 'Приняты' },
  { value: 'in_progress', label: 'В пути' },
  { value: 'completed', label: 'Завершены' },
  { value: 'cancelled', label: 'Отменены' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10_000); // обновляем каждые 10 секунд
    return () => clearInterval(interval);
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.fromAddress.toLowerCase().includes(q) ||
      o.toAddress.toLowerCase().includes(q) ||
      o.id.includes(q);
    return matchStatus && matchSearch;
  });

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Статус обновлён');
        fetchOrders();
      }
    } catch {
      toast.error('Ошибка обновления');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Удалить заказ?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Заказ удалён');
        fetchOrders();
      }
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Заказы</span>
        </h1>
        <p className="text-white/60">Управление заказами клиентов · Обновляется автоматически</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, телефону, адресу или ID"
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-all border',
                statusFilter === f.value
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-white/60">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <div className="text-lg">Заказов не найдено</div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((order) => {
              const status = statusLabel(order.status);
              const isOpen = expanded === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn(
                        'px-3 py-1 rounded-full text-xs border whitespace-nowrap',
                        status.color
                      )}>
                        {status.text}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{order.customerName}</div>
                        <div className="text-sm text-white/60 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 inline" />
                          {order.fromCity} → {order.toCity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold gradient-text">{formatPrice(order.estimatedPrice)}</div>
                        <div className="text-xs text-white/40">{formatDate(order.createdAt)}</div>
                      </div>
                      <ChevronDown className={cn('w-5 h-5 transition', isOpen && 'rotate-180')} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 md:p-5 grid md:grid-cols-2 gap-4">
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <Phone className="w-4 h-4 text-primary-400 mt-0.5" />
                              <div>
                                <div className="text-white/40">Телефон</div>
                                <a href={`tel:${order.customerPhone}`} className="text-primary-400 hover:underline">
                                  {order.customerPhone}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                              <div>
                                <div className="text-white/40">Откуда</div>
                                <div>{order.fromCity}, {order.fromAddress}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-red-400 mt-0.5" />
                              <div>
                                <div className="text-white/40">Куда</div>
                                <div>{order.toCity}, {order.toAddress}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-primary-400 mt-0.5" />
                              <div>
                                <div className="text-white/40">Когда</div>
                                <div>{formatDate(order.scheduledAt)}</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-primary-400 mt-0.5" />
                              <div>
                                <div className="text-white/40">Пассажиров / Багажа</div>
                                <div>{order.passengers} чел / {order.luggage} мест</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Car className="w-4 h-4 text-primary-400 mt-0.5" />
                              <div>
                                <div className="text-white/40">Класс / Оплата</div>
                                <div className="capitalize">{order.carClass} / {order.paymentMethod}</div>
                              </div>
                            </div>
                            {order.comment && (
                              <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-primary-400 mt-0.5" />
                                <div>
                                  <div className="text-white/40">Комментарий</div>
                                  <div className="italic">{order.comment}</div>
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-white/40 font-mono">ID: {order.id}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 md:p-5 border-t border-white/10 flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(order.id, 'accepted')}
                              className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 transition text-sm flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Принять
                            </button>
                          )}
                          {order.status === 'accepted' && (
                            <button
                              onClick={() => updateStatus(order.id, 'in_progress')}
                              className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition text-sm flex items-center gap-2"
                            >
                              <Car className="w-4 h-4" /> Начать поездку
                            </button>
                          )}
                          {order.status === 'in_progress' && (
                            <button
                              onClick={() => updateStatus(order.id, 'completed')}
                              className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 transition text-sm flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Завершить
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'accepted') && (
                            <button
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition text-sm flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" /> Отменить
                            </button>
                          )}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-red-500/10 hover:text-red-300 transition text-sm flex items-center gap-2 ml-auto"
                          >
                            <Trash2 className="w-4 h-4" /> Удалить
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
