'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';

interface DriverLocation {
  lat: number;
  lon: number;
  bearing?: number | null;
  speed_kmh?: number | null;
  updated_at: string;
}

interface Props {
  orderId: string;
  /** Poll interval ms — default 5 sec. Replace with Supabase Realtime later. */
  intervalMs?: number;
}

/**
 * Customer-facing live map of the driver's current position.
 *
 * Uses a simple SVG mini-map (no external map provider needed) showing:
 *   • A pulsing marker for the driver
 *   • Speed and "last updated N sec ago"
 *
 * Polls /api/driver/location every 5 sec. For instant updates the
 * customer page can additionally subscribe via supabase-js Realtime.
 */
export default function LiveDriverMap({ orderId, intervalMs = 5000 }: Props) {
  const [loc, setLoc] = useState<DriverLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchLoc = async () => {
      try {
        const r = await fetch(`/api/driver/location?orderId=${encodeURIComponent(orderId)}`);
        const j = await r.json();
        if (alive) setLoc(j.location ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchLoc();
    const id = setInterval(fetchLoc, intervalMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [orderId, intervalMs]);

  if (loading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center gap-2 text-ink-muted">
        <Loader2 className="w-4 h-4 animate-spin" />
        Получаю местоположение водителя...
      </div>
    );
  }

  if (!loc) {
    return (
      <div className="glass-card p-6 text-center text-ink-muted">
        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
        Водитель пока не передаёт координаты
      </div>
    );
  }

  const secondsAgo = Math.round((Date.now() - new Date(loc.updated_at).getTime()) / 1000);
  const fresh = secondsAgo < 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${fresh ? 'bg-mint-500' : 'bg-yellow-500'}`} />
            <span className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${fresh ? 'bg-mint-400' : 'bg-yellow-400'}`} />
          </div>
          <span className="text-sm font-semibold">Водитель в пути</span>
        </div>
        <div className="text-xs text-ink-subtle">
          обновлено {secondsAgo} сек назад
        </div>
      </div>

      {/* Mini-map placeholder: replace with 2GIS map widget once API key is set */}
      <div className="relative rounded-xl overflow-hidden bg-surface-elevated aspect-video">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary-500/30 blur-md"
            />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
          <div className="bg-surface/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-mono text-ink-muted">
            {loc.lat.toFixed(4)}, {loc.lon.toFixed(4)}
          </div>
          {loc.speed_kmh != null && (
            <div className="bg-primary-500/20 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-primary-600 dark:text-primary-300 font-semibold">
              {Math.round(loc.speed_kmh)} км/ч
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
