'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Mountain } from 'lucide-react';

interface ElevationProfileProps {
  scenario: string;
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ElevationProfile({
  scenario,
  selectedId,
  onSelect,
}: ElevationProfileProps) {
  const isWinter = scenario === 'winter_frost';

  // Pan-India Topographical Cross-Section Transect
  const profileData = [
    { name: 'Ooty (Nilgiris)', id: 'tn_ooty', state: 'Tamil Nadu', elev: 2240, temp: isWinter ? 2.8 : 17.5, rain: 92, type: 'Frost Hollow' },
    { name: 'Kotgarh (Shimla)', id: 'hp_shimla_kotgarh', state: 'Himachal', elev: 2050, temp: isWinter ? -1.5 : 19.0, rain: 85, type: 'Himalayan Basin' },
    { name: 'Darjeeling', id: 'wb_darjeeling_kurseong', state: 'West Bengal', elev: 2045, temp: isWinter ? 3.0 : 16.8, rain: 110, type: 'Cloud Crest' },
    { name: 'Munnar', id: 'kl_munnar_highrange', state: 'Kerala', elev: 1600, temp: isWinter ? 8.5 : 21.0, rain: 98, type: 'High Range' },
    { name: 'Chikmagalur', id: 'ka_chikmagalur', state: 'Karnataka', elev: 1090, temp: isWinter ? 13.5 : 24.2, rain: 72, type: 'Malnad Slope' },
    { name: 'Mandya Basin', id: 'ka_mandya_srirangapatna', state: 'Karnataka', elev: 678, temp: isWinter ? 16.2 : 28.5, rain: 30, type: 'Deccan Basin' },
    { name: 'Nashik Plateau', id: 'mh_nashik_dindori', state: 'Maharashtra', elev: 615, temp: isWinter ? 11.2 : 29.8, rain: 38, type: 'Basalt Plateau' },
    { name: 'Ludhiana Plains', id: 'pb_ludhiana_jagraon', state: 'Punjab', elev: 238, temp: isWinter ? 6.5 : 33.0, rain: 25, type: 'Alluvial Plain' },
    { name: 'Varanasi Gangetic', id: 'up_varanasi_gangetic', state: 'Uttar Pradesh', elev: 81, temp: isWinter ? 9.8 : 34.2, rain: 36, type: 'River Floodplain' },
    { name: 'Cauvery Delta', id: 'tn_thiruvaiyaru', state: 'Tamil Nadu', elev: 38, temp: isWinter ? 23.5 : 33.8, rain: 65, type: 'Alluvial Delta' },
    { name: 'Kuttanad Sea Level', id: 'kl_kuttanad', state: 'Kerala', elev: 2, temp: isWinter ? 24.5 : 32.5, rain: 90, type: 'Below Sea Basin' },
  ];

  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Pan-India Orographic & Thermal Transect (Himalayas & Nilgiris &rarr; Plains & Delta)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isWinter
              ? 'Sub-zero Himalayan/Nilgiri katabatic cold pooling (<3°C) vs warm coastal Gangetic & Delta plains'
              : 'Orographic monsoonal cloud burst on Western Ghats/Himalayas vs semi-arid rain-shadows'}
          </p>
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            isWinter
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {isWinter ? '❄️ Himalayan / Nilgiri Frost Alert' : '🌧️ Monsoon Orographic Active'}
        </span>
      </div>

      <div className="h-48 w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={profileData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} domain={[0, 2400]} unit="m" />

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '11px',
              }}
              formatter={(val: any, name: string) => [
                `${val} ${name === 'Elevation (m)' ? 'm' : name === 'Temperature' ? '°C' : 'mm'}`,
                name,
              ]}
            />

            {isWinter && (
              <ReferenceLine
                y={1800}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{
                  value: 'Severe Sub-Zero Frost Line (>1800m)',
                  fill: '#fda4af',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="elev"
              name="Elevation (m)"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#elevGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cross section badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 pt-1">
        {profileData.slice(0, 6).map((item) => {
          const isSelected = item.id === selectedId;
          const isAtRisk = isWinter && item.temp < 5.0;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`p-2 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/70 shadow-orchids-glow'
                  : 'bg-black/30 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
              <div className="text-[9px] text-slate-400">{item.elev}m • {item.state}</div>
              <div className={`text-[10px] font-mono font-bold mt-0.5 ${isAtRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                {item.temp}°C {isAtRisk ? '❄️' : ''}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
