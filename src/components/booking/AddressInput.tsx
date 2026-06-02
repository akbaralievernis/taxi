'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Check, Loader2 } from 'lucide-react';
import { searchAddresses, AddressSuggestion } from '@/lib/integrations/maps';

interface AddressInputProps {
  label: string;
  value: string;
  city: string;
  onChange: (val: string) => void;
  placeholder?: string;
  iconColor?: string;
}

export default function AddressInput({
  label,
  value,
  city,
  onChange,
  placeholder = 'Укажите адрес...',
  iconColor = 'text-indigo-400',
}: AddressInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query state with external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch suggestions with a small debounce
  useEffect(() => {
    if (!open || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchAddresses(query, city);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
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

  const selectSuggestion = (s: AddressSuggestion) => {
    onChange(s.fullName);
    setQuery(s.fullName);
    setSuggestions([]);
    setOpen(false);
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
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete suggestions dropdown popover */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950 p-2 shadow-depth-md backdrop-blur-3xl"
          >
            {suggestions.map((s, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-900/60 transition flex flex-col gap-0.5 group"
                >
                  <span className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                    {s.name}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {s.fullName}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
