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
import { Mountain, AlertTriangle, CloudSun } from 'lucide-react';

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

  // Topographical cross-section profile from West escarpment to East plains
  const profileData = [
    { name: 'Dasve Ridge', id: 'panchayat_dasve', elev: 1045, temp: isWinter ? 13.8 : 22.4, rain: 68, type: 'Crest' },
    { name: 'Male Valley', id: 'panchayat_male', elev: 558, temp: isWinter ? 4.2 : 27.2, rain: 32, type: 'Basin' },
    { name: 'Paud Basin', id: 'panchayat_paud', elev: 595, temp: isWinter ? 5.1 : 26.8, rain: 35, type: 'Valley' },
    { name: 'Pirangut', id: 'panchayat_pirangut', elev: 645, temp: isWinter ? 8.4 : 28.5, rain: 26, type: 'Plateau' },
    { name: 'Sinhagad Peak', id: 'panchayat_sinhagad', elev: 1315, temp: isWinter ? 14.5 : 20.8, rain: 82, type: 'Peak' },
    { name: 'Khed Shivapur', id: 'panchayat_khed_shivapur', elev: 635, temp: isWinter ? 9.2 : 29.5, rain: 12, type: 'Leeward' },
  ];

  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Topographic Microclimate Cross-Section (West to East)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isWinter
              ? 'Visualizing nocturnal katabatic cold-air pooling & thermal inversion in valley floors'
              : 'Visualizing orographic cloud lifting on windward ridges vs leeward rainshadow'}
          </p>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
          isWinter
            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        }`}>
          {isWinter ? '⚠️ Thermal Inversion Active' : '🌧️ Orographic Lift Active'}
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
              <linearGradient id="coldAirPool" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} domain={[400, 1400]} unit="m" />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '11px',
              }}
              formatter={(val: any, name: string) => [
                `${val} ${name === 'Elevation (m)' ? 'm' : (name === 'Temperature' ? '°C' : 'mm')}`,
                name,
              ]}
            />

            {/* Inversion boundary line at ~620m in winter */}
            {isWinter && (
              <ReferenceLine
                y={620}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: 'Inversion Frost Boundary (<5°C Pool)', fill: '#fda4af', fontSize: 10, position: 'insideTopLeft' }}
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
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
        {profileData.map((item) => {
          const isSelected = item.id === selectedId;
          const isAtRisk = isWinter && item.temp < 6.0;

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
              <div className="text-[9px] text-slate-400">{item.elev}m</div>
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
