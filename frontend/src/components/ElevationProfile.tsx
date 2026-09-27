'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Snowflake } from 'lucide-react';
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
    <div className="rounded-xl border border-line/10 bg-surface px-3 py-2 text-xs shadow-pop">
      <div className="font-semibold text-ink">{d.full}</div>
      <div className="text-muted">{d.state}</div>
      <div className="mt-1 text-ink2 tabular">
        {d.elev} m · {d.tMin}–{d.tMax}°C · {d.rain} mm
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-lg text-sm text-ink2">
          From 2,000 m Himalayan orchards to Kuttanad’s fields below sea level. Height alone swings the night temperature by more than 10 °C — one district forecast
          cannot capture that.
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${frostCount ? 'bg-frost/15 text-frost' : 'bg-line/10 text-ink2'}`}>
          <Snowflake className="h-3.5 w-3.5" />
          {frostCount ? `${frostCount} site${frostCount > 1 ? 's' : ''} at frost risk` : 'No frost risk today'}
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -6, bottom: 0 }}>
            <defs>
              <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8F169" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#C8F169" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(226,240,231,0.07)" />
            <XAxis dataKey="name" stroke="#808E86" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={44} />
            <YAxis stroke="#808E86" fontSize={10} unit=" m" tickLine={false} axisLine={false} />
            <Tooltip content={<TransectTooltip />} />
            <Area type="monotone" dataKey="elev" stroke="#C8F169" strokeWidth={2} fill="url(#elevGradient)" dot={{ r: 3, fill: '#C8F169', strokeWidth: 0 }} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((item) => {
          const isSelected = item.id === selectedId;
          const frost = item.tMin <= 4;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-pressed={isSelected}
              className={`rounded-xl border p-3 text-left transition-colors ${isSelected ? 'border-accent bg-accent/10' : 'border-transparent bg-surface2 hover:border-line/15'}`}
            >
              <div className="truncate text-sm font-medium text-ink">{item.full}</div>
              <div className="mt-0.5 flex items-center justify-between text-xs">
                <span className="text-muted">{item.elev} m</span>
                <span className={`flex items-center gap-1 tabular ${frost ? 'text-frost' : 'text-ink2'}`}>
                  {frost && <Snowflake className="h-3 w-3" />}
                  {item.tMin}° / {item.tMax}°
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
