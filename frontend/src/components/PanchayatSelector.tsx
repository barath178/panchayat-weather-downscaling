'use client';

import React, { useState } from 'react';
import { Mountain, MapPin, AlertCircle, Wind, Droplets, Sun, Search, Compass, Building2, Trees } from 'lucide-react';

interface Panchayat {
  id: string;
  name: string;
  state?: string;
  district?: string;
  isUrban?: boolean;
  regionalName?: string;
  elevationM: number;
  terrainType: string;
  drainageAccumulation: number;
  primaryCrops?: string[];
}

interface PanchayatSelectorProps {
  panchayats: Panchayat[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PanchayatSelector({
  panchayats,
  selectedId,
  onSelect,
}: PanchayatSelectorProps) {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'urban' | 'rural'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique states across India
  const states = ['all', ...Array.from(new Set(panchayats.map((p) => p.state || 'India')))];

  const filteredPanchayats = panchayats.filter((p) => {
    const matchesState = selectedState === 'all' || p.state === selectedState;
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'urban' && p.isUrban) ||
      (typeFilter === 'rural' && !p.isUrban);

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.state && p.state.toLowerCase().includes(query)) ||
      (p.district && p.district.toLowerCase().includes(query)) ||
      (p.regionalName && p.regionalName.toLowerCase().includes(query)) ||
      (p.primaryCrops && p.primaryCrops.some((c) => c.toLowerCase().includes(query)));

    return matchesState && matchesType && matchesSearch;
  });

  const urbanCount = panchayats.filter((p) => p.isUrban).length;
  const ruralCount = panchayats.length - urbanCount;

  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          All-India Coverage ({filteredPanchayats.length} of {panchayats.length})
        </h3>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          🇮🇳 300+ Districts & Metros
        </span>
      </div>

      {/* Urban vs Rural Filter Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[11px] font-semibold">
        <button
          onClick={() => setTypeFilter('all')}
          className={`py-1 rounded-lg transition-all ${
            typeFilter === 'all' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({panchayats.length})
        </button>
        <button
          onClick={() => setTypeFilter('urban')}
          className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
            typeFilter === 'urban' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3 h-3" /> Urban ({urbanCount})
        </button>
        <button
          onClick={() => setTypeFilter('rural')}
          className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
            typeFilter === 'rural' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trees className="w-3 h-3" /> Rural ({ruralCount})
        </button>
      </div>

      {/* Search Input across India */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search City, Metro, District, or Crop (e.g. Mumbai, Chennai, Delhi, Tea)..."
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
        />
      </div>

      {/* State Filter Chips */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
        {states.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedState === st
                ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {st === 'all' ? '🇮🇳 All States' : st}
          </button>
        ))}
      </div>

      {/* Panchayat / District / City List */}
      <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
        {filteredPanchayats.map((p) => {
          const isSelected = p.id === selectedId;
          const isFrostBasin = p.drainageAccumulation > 0.8 && p.elevationM > 1500;
          const isHighPeak = p.elevationM > 1500;
          const isLowland = p.elevationM < 80;
          const isWindy = p.terrainType.includes('Wind') || p.terrainType.includes('Marwar');

          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/70 shadow-orchids-glow'
                  : 'bg-black/25 border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span className="truncate">{p.name}</span>
                  {p.isUrban ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 flex items-center gap-0.5">
                      <Building2 className="w-2.5 h-2.5" /> Urban
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                      Rural
                    </span>
                  )}
                  {p.state && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {p.state}
                    </span>
                  )}
                </div>

                {p.regionalName && (
                  <div className="text-[10px] text-emerald-400/80 font-medium truncate mt-0.5">
                    {p.regionalName}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <Mountain className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{p.elevationM} m</span>
                  <span>•</span>
                  <span className="truncate">{p.terrainType}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                {isFrostBasin && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-0.5">
                    <AlertCircle className="w-2.5 h-2.5" /> Frost Pocket
                  </span>
                )}
                {isHighPeak && !isFrostBasin && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Highland
                  </span>
                )}
                {isWindy && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                    <Wind className="w-2.5 h-2.5" /> High Wind
                  </span>
                )}
                {isLowland && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5" /> Delta/Coast
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
