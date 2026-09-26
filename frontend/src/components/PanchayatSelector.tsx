'use client';

import React from 'react';
import { Mountain, MapPin, AlertCircle } from 'lucide-react';

interface Panchayat {
  id: string;
  name: string;
  elevationM: number;
  terrainType: string;
  drainageAccumulation: number;
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
  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Gram Panchayats (8 in Pilot)
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">1.2 km² Polygons</span>
      </div>

      <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
        {panchayats.map((p) => {
          const isSelected = p.id === selectedId;
          const isFrostBasin = p.drainageAccumulation > 0.7;
          const isHighPeak = p.elevationM > 1000;

          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/60 shadow-orchids-glow'
                  : 'bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white tracking-tight">{p.name}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Mountain className="w-3 h-3 text-slate-500" />
                  {p.elevationM} m • {p.terrainType.split('(')[0]}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isFrostBasin && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> Frost Basin
                  </span>
                )}
                {isHighPeak && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Ridge Crest
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
