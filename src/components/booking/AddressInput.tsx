'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Check, Loader2 } from 'lucide-react';
import { searchAddresses, AddressSuggestion as LocalSuggestion } from '@/lib/integrations/maps';

interface AddressInputProps {
  label: string;
  value: string;
  city: string;
  onChange: (val: string) => void;
  placeholder?: string;
  iconColor?: string;
  /** Optional callback receiving full geocoded data (with lat/lon) */
  onSelect?: (data: { fullAddress: string; lat?: number; lon?: number; city?: string }) => void;
}

interface RemoteSuggestion {
  name: string;
  fullAddress: string;
  city?: string;
  lat: number;
  lon: number;
  type?: string;
}

type Suggestion = RemoteSuggestion | (LocalSuggestion & { lat?: number; lon?: number; fullAddress?: string });

function normalizeSuggestion(s: Suggestion): { name: string; fullAddress: string; city?: string; lat?: number; lon?: number } {
  if ('fullAddress' in s && s.fullAddress) {
    return { name: s.name, fullAddress: s.fullAddress, city: s.city, lat: s.lat, lon: s.lon };
  }
  // Local fallback shape
  const local = s as LocalSuggestion;
  return { name: local.name, fullAddress: local.fullName, city: local.city, lat: undefined, lon: undefined };
}

export default function AddressInput({
  label,
  value,
  city,
  onChange,
  placeholder = 'Укажите адрес...',
  iconColor = 'text-indigo-400',
  onSelect,
}: AddressInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync internal query state with external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!open || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const debounce = setTimeout(async () => {
      // Cancel previous in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Bias query toward the selected city — adds "city" to the search string
        const biased = city && !query.toLowerCase().includes(city.toLowerCase())
          ? `${query}, ${city}`
          : query;
        const url = `/api/geocode?q=${encodeURIComponent(biased)}`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        const remote: RemoteSuggestion[] = json.suggestions ?? [];

        // If remote returned nothing, fall back to local popular addresses
        if (remote.length === 0) {
          const local = await searchAddresses(query, city);
          setSuggestions(local);
        } else {
          // Prefer addresses in the selected city
          const sorted = remote.sort((a, b) => {
            const aMatch = (a.city ?? '').toLowerCase() === city.toLowerCase() ? -1 : 0;
            const bMatch = (b.city ?? '').toLowerCase() === city.toLowerCase() ? -1 : 0;
            return aMatch - bMatch;
          });
          setSuggestions(sorted);
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          // Last-resort fallback
          const local = await searchAddresses(query, city);
          setSuggestions(local);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, city, open]);

  // Close suggestions popover when clicking outside the input container
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectSuggestion = (raw: Suggestion) => {
    const s = normalizeSuggestion(raw);
    onChange(s.fullAddress);
    setQuery(s.fullAddress);
    setSuggestions([]);
    setOpen(false);
    onSelect?.(s);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
    setSuggestions([]);
  };

  const isValid = value.trim().length > 3;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className={`w-4 h-4 ${iconColor}`} />
          {label}
        </label>
        {isValid && (
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            Адрес найден
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`input-field pr-10 border transition-all ${
            isValid ? 'border-emerald-500/20 focus:border-emerald-500/40' : 'border-slate-800 focus:border-primary-500'
          }`}
          style={{ background: 'rgba(12, 14, 28, 0.45)' }}
        />

        {/* Action icons right-aligned */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {loading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete suggestions dropdown */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950 p-2 shadow-depth-md backdrop-blur-3xl"
          >
            {suggestions.map((raw, idx) => {
              const s = normalizeSuggestion(raw);
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => selectSuggestion(raw)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-900/60 transition flex items-start gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors truncate">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{s.fullAddress}</div>
                    </div>
                    {s.city && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-300 shrink-0">
                        {s.city}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            <li className="mt-1 px-3 py-1 text-[10px] text-slate-500 text-center border-t border-slate-800/50 pt-2">
              Данные: OpenStreetMap · Photon
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
