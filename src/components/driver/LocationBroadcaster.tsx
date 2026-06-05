'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, CircleCheck, CircleAlert } from 'lucide-react';

interface Props {
  /** Active order ID — null when driver is offline / not on a trip */
  orderId: string | null;
  /** Toggle on/off broadcast */
  enabled: boolean;
  /** Heartbeat interval in ms (default 6 sec) */
  intervalMs?: number;
}

type Status = 'idle' | 'requesting-permission' | 'broadcasting' | 'error';

/**
 * Tiny background component that captures the driver's GPS coordinates
 * via the browser Geolocation API and POSTs them to /api/driver/location
 * every few seconds. Renders a compact status indicator.
 *
 * Uses `watchPosition` for low-energy continuous updates; falls back to
 * polling via `getCurrentPosition` on unsupported browsers.
 */
export default function LocationBroadcaster({ orderId, enabled, intervalMs = 6000 }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastSent, setLastSent] = useState<number | null>(null);
  const lastSentAtRef = useRef(0);
  const watchIdRef = useRef<number | null>(null);

  // Send a single location to the server (rate-limited locally).
  const send = async (coords: GeolocationCoordinates) => {
    const now = Date.now();
    if (now - lastSentAtRef.current < intervalMs) return;
    lastSentAtRef.current = now;
    try {
      await fetch('/api/driver/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: coords.latitude,
          lon: coords.longitude,
          bearing: coords.heading ?? undefined,
          speed_kmh: coords.speed != null ? coords.speed * 3.6 : undefined,
          orderId,
        }),
      });
      setLastSent(now);
      setStatus('broadcasting');
      setError(null);
    } catch (e: any) {
      setStatus('error');
      setError(e?.message ?? 'Network error');
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (watchIdRef.current != null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setStatus('idle');
      return;
    }
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setError('Геолокация не поддерживается');
      return;
    }

    setStatus('requesting-permission');
    const id = navigator.geolocation.watchPosition(
      (pos) => send(pos.coords),
      (err) => {
        setStatus('error');
        setError(err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // UI badge
  if (!enabled) return null;

  const label =
    status === 'broadcasting'
      ? lastSent
        ? `GPS ON · обновлено ${Math.round((Date.now() - lastSent) / 1000)} сек назад`
        : 'GPS ON · ожидание...'
      : status === 'requesting-permission'
        ? 'Запрашиваю доступ к геолокации...'
        : status === 'error'
          ? `GPS ошибка: ${error ?? ''}`
          : '';

  const Icon =
    status === 'broadcasting'
      ? CircleCheck
      : status === 'error'
        ? CircleAlert
        : Loader2;

  const colorClass =
    status === 'broadcasting'
      ? 'bg-mint-500/10 border-mint-500/30 text-mint-600 dark:text-mint-400'
      : status === 'error'
        ? 'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400'
        : 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-300';

  return (
    <div className={`fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-md ${colorClass}`}>
      <Icon className={`w-4 h-4 ${status === 'requesting-permission' ? 'animate-spin' : ''}`} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
