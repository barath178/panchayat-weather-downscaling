'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { DRIFT_LIMIT_KMH, CAUTION_WIND_KMH, type HourPoint, type SprayStatus } from '@/lib/microclimate';

interface Props {
  hourlyData: HourPoint[];
  sprayWindow: { label: string; hours: number };
  isLive: boolean;
}

// Status palette – always paired with an icon and a label.
const STATUS: Record<SprayStatus, { color: string; label: string; icon: React.ElementType; text: string }> = {
  safe: { color: '#0ca30c', label: 'Safe', icon: CheckCircle2, text: 'text-emerald-300' },
  caution: { color: '#fab219', label: 'Caution', icon: AlertTriangle, text: 'text-amber-300' },
  danger: { color: '#d03b3b', label: 'Do not spray', icon: XCircle, text: 'text-rose-300' },
};

const AXIS = '#898781';
const GRID = '#2c2c2a';

function HourTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const h: HourPoint = payload[0].payload;
  const s = STATUS[h.status];
  const Icon = s.icon;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-[11px] shadow-xl">
      <div className="font-bold text-white mb-0.5">{h.time}</div>
      <div className={`flex items-center gap-1 font-semibold ${s.text}`}>
        <Icon className="w-3 h-3" /> {s.label}
      </div>
      <div className="text-slate-300 mt-0.5">{h.reason}</div>
      <div className="grid grid-cols-2 gap-x-3 mt-1 text-slate-400 font-mono">
        <span>Wind {h.windKmh} km/h</span>
        <span>Temp {h.tempC}°C</span>
        <span>RH {h.rh}%</span>
        <span>Rain {h.rainMm} mm</span>
      </div>
    </div>
  );
}

export default function SprayTimelineChart({ hourlyData, sprayWindow, isLive }: Props) {
  const maxWind = Math.max(DRIFT_LIMIT_KMH + 5, ...hourlyData.map((h) => h.windKmh));
  const temps = hourlyData.map((h) => h.tempC);
  const tMin = Math.floor(Math.min(...temps) - 2);
  const tMax = Math.ceil(Math.max(...temps) + 2);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-white">Hourly spray feasibility · 06:00–19:00</h3>
          <p className="text-[11px] text-slate-400">
            {isLive ? 'Live hourly forecast, downscaled to 1.2 km' : 'Modelled diurnal cycle from the downscaled daily forecast'} · drift limit {DRIFT_LIMIT_KMH} km/h
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            sprayWindow.hours ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
          }`}
        >
          {sprayWindow.hours ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {sprayWindow.hours ? `Best window ${sprayWindow.label}` : 'No safe window'}
        </div>
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-7 sm:grid-cols-14 gap-1" role="list" aria-label="Hourly spray status">
        {hourlyData.map((h) => {
          const s = STATUS[h.status];
          const Icon = s.icon;
          return (
            <div
              key={h.time}
              role="listitem"
              title={`${h.time} · ${s.label} · ${h.reason}`}
              className="rounded-lg border border-white/5 bg-black/30 py-1.5 flex flex-col items-center gap-0.5"
              style={{ boxShadow: `inset 0 -3px 0 ${s.color}` }}
            >
              <span className="text-[10px] font-mono text-slate-300">{h.time.slice(0, 2)}</span>
              <Icon className="w-3.5 h-3.5" style={{ color: s.color }} aria-label={s.label} />
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {/* Wind (bars coloured by status) */}
        <div className="md:col-span-3">
          <div className="text-[11px] font-semibold text-slate-300 mb-1">Wind speed (km/h)</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barCategoryGap={2}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="time" tickFormatter={(t) => t.slice(0, 2)} stroke={AXIS} fontSize={10} tickLine={false} />
                <YAxis stroke={AXIS} fontSize={10} domain={[0, Math.ceil(maxWind / 5) * 5]} tickLine={false} axisLine={false} />
                <Tooltip content={<HourTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <ReferenceLine y={DRIFT_LIMIT_KMH} stroke="#d03b3b" strokeDasharray="4 4" label={{ value: 'Drift limit', fill: '#fca5a5', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine y={CAUTION_WIND_KMH} stroke="#fab219" strokeDasharray="2 4" strokeOpacity={0.6} />
                <Bar dataKey="windKmh" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {hourlyData.map((h) => (
                    <Cell key={h.time} fill={STATUS[h.status].color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature */}
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-slate-300 mb-1">Air temperature (°C)</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="time" tickFormatter={(t) => t.slice(0, 2)} stroke={AXIS} fontSize={10} tickLine={false} />
                <YAxis stroke={AXIS} fontSize={10} domain={[tMin, tMax]} tickLine={false} axisLine={false} />
                <Tooltip content={<HourTooltip />} />
                <Line type="monotone" dataKey="tempC" stroke="#3987e5" strokeWidth={2} dot={{ r: 3, fill: '#3987e5', strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
        {(Object.keys(STATUS) as SprayStatus[]).map((k) => {
          const s = STATUS[k];
          const Icon = s.icon;
          return (
            <span key={k} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" style={{ color: s.color }} /> {s.label}
            </span>
          );
        })}
        <span className="ml-auto text-slate-500">Rules: wind &gt; {DRIFT_LIMIT_KMH} km/h, rain within 2 h → stop · &gt; {CAUTION_WIND_KMH} km/h or ≥ 33°C → caution</span>
      </div>
    </div>
  );
}
