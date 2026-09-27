'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Mountain, Snowflake } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';

interface ElevationProfileProps {
  panchayats: PanchayatData[];
  regionMetrics: Record<string, { coarse: WeatherMetrics; fine: WeatherMetrics }>;
  selectedId: string;
  onSelect: (id: string) => void;
}

// Pan-India transect: Himalaya & Nilgiris → Deccan → Gangetic plain → delta & below-sea-level Kuttanad
const TRANSECT_IDS = [
  'himachalpradeshjkuttarakhand_shimla_260', // Kotgarh Apple Valley
  'tamilnadu_thenilgiris_7', // Ooty
  'westbengal_darjeeling_149',
  'kerala_idukki_227', // Munnar
  'himachalpradeshjkuttarakhand_kullu_262',
  'karnataka_mandya_82',
  'maharashtra_nashik_43',
  'punjabharyana_ludhiana_232',
  'uttarpradesh_varanasi_108',
  'tamilnadu_thanjavur_6', // Thiruvaiyaru
  'kerala_alappuzha_226', // Kuttanad
];

const shortName = (n: string) => n.split(' ').slice(0, 2).join(' ');

function TransectTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-[11px] shadow-xl">
      <div className="font-bold text-white">{d.full}</div>
      <div className="text-slate-400">{d.state}</div>
      <div className="mt-1 font-mono text-slate-300">Elevation {d.elev} m</div>
      <div className="font-mono text-slate-300">
        Temp {d.tMin}–{d.tMax}°C · Rain {d.rain} mm
      </div>
    </div>
  );
}

export default function ElevationProfile({ panchayats, regionMetrics, selectedId, onSelect }: ElevationProfileProps) {
  const data = useMemo(
    () =>
      TRANSECT_IDS.map((id) => panchayats.find((p) => p.id === id))
        .filter((p): p is PanchayatData => !!p)
        .map((p) => {
          const m = regionMetrics[p.id]?.fine;
          return {
            id: p.id,
            name: shortName(p.name),
            full: p.name,
            state: p.state,
            elev: p.elevationM,
            tMin: m?.tempMin ?? 0,
            tMax: m?.tempMax ?? 0,
            rain: m?.rainfallMm ?? 0,
          };
        }),
    [panchayats, regionMetrics]
  );

  const frostCount = data.filter((d) => d.tMin <= 4).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Mountain className="w-4 h-4 text-cyan-400" /> Pan-India elevation transect
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Himalaya & Nilgiris → Deccan plateau → Gangetic plain → Cauvery delta & below-sea-level Kuttanad. Temperatures are today’s downscaled values.
          </p>
        </div>
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            frostCount ? 'bg-rose-500/15 text-rose-200 border-rose-500/30' : 'bg-white/5 text-slate-300 border-white/10'
          }`}
        >
          <Snowflake className="w-3 h-3" /> {frostCount ? `${frostCount} site${frostCount > 1 ? 's' : ''} at frost risk (≤ 4°C)` : 'No frost risk on transect'}
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3987e5" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3987e5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#2c2c2a" />
            <XAxis dataKey="name" stroke="#898781" fontSize={9} tickLine={false} interval={0} angle={-20} textAnchor="end" height={40} />
            <YAxis stroke="#898781" fontSize={10} unit=" m" tickLine={false} axisLine={false} />
            <Tooltip content={<TransectTooltip />} />
            <Area type="monotone" dataKey="elev" stroke="#3987e5" strokeWidth={2} fill="url(#elevGradient)" dot={{ r: 3, fill: '#3987e5' }} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
        {data.map((item) => {
          const isSelected = item.id === selectedId;
          const frost = item.tMin <= 4;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-pressed={isSelected}
              className={`p-2 rounded-xl text-left border transition-all ${
                isSelected ? 'bg-emerald-500/15 border-emerald-500/70' : 'bg-black/30 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-[10px] font-bold text-white truncate">{item.full}</div>
              <div className="text-[9px] text-slate-400">{item.elev} m</div>
              <div className={`text-[10px] font-mono font-bold mt-0.5 flex items-center gap-1 ${frost ? 'text-rose-300' : 'text-slate-200'}`}>
                {frost && <Snowflake className="w-3 h-3" />}
                {item.tMin}° / {item.tMax}°C
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
