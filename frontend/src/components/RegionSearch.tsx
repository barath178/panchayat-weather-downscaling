'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, MapPin, Building2, Sprout, CornerDownLeft } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';

interface Props {
  regions: PanchayatData[];
  onSelect: (id: string) => void;
  size?: 'lg' | 'sm';
  placeholder?: string;
  /** Register the "/" keyboard shortcut to focus this box */
  shortcut?: boolean;
}

function score(p: PanchayatData, q: string) {
  const name = p.name.toLowerCase();
  if (name.startsWith(q)) return 0;
  if (name.includes(q)) return 1;
  if (p.district.toLowerCase().includes(q)) return 2;
  if (p.regionalName?.toLowerCase().includes(q)) return 2;
  if (p.state.toLowerCase().includes(q)) return 3;
  if (p.primaryCrops.some((c) => c.toLowerCase().includes(q))) return 4;
  return -1;
}

export default function RegionSearch({ regions, onSelect, size = 'sm', placeholder = 'Search village, district or crop', shortcut }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return regions
      .map((p) => ({ p, s: score(p, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s || a.p.name.localeCompare(b.p.name))
      .slice(0, 7)
      .map((r) => r.p);
  }, [query, regions]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcut]);

  const choose = (p: PanchayatData) => {
    onSelect(p.id);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const lg = size === 'lg';

  return (
    <div ref={boxRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-surface/90 backdrop-blur transition-colors ${
          open && results.length ? 'border-accent/60' : 'border-line/10 hover:border-line/20'
        } ${lg ? 'h-14 px-5' : 'h-10 px-3.5'}`}
      >
        <Search className={`${lg ? 'h-5 w-5' : 'h-4 w-4'} shrink-0 text-muted`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
          aria-label="Search regions"
          className={`w-full bg-transparent text-ink placeholder:text-muted focus:outline-none ${lg ? 'text-base' : 'text-sm'}`}
        />
        {shortcut && !query && (
          <kbd className="hidden sm:inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line/15 px-1.5 font-mono text-[11px] text-muted">/</kbd>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-[1500] mt-2 overflow-hidden rounded-2xl border border-line/10 bg-surface shadow-pop animate-fade-in">
          {results.length ? (
            <ul id={listId} role="listbox" className="max-h-[360px] overflow-y-auto py-1.5">
              {results.map((p, i) => (
                <li
                  key={p.id}
                  id={`${listId}-${p.id}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(p);
                  }}
                  className={`mx-1.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === active ? 'bg-raised' : ''}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface2 text-ink2">
                    {p.isUrban ? <Building2 className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {p.district}, {p.state} · {p.elevationM} m
                    </span>
                  </span>
                  {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-muted" />}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted">
              <MapPin className="h-4 w-4" /> No region matches “{query}”. Try a district or state name.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
