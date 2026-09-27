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

// Status colours match the verdict tiles; always paired with an icon + label.
const STATUS: Record<SprayStatus, { color: string; label: string; icon: React.ElementType }> = {
  safe: { color: '#2FB344', label: 'Safe', icon: CheckCircle2 },
  caution: { color: '#F2B01E', label: 'Caution', icon: AlertTriangle },
  danger: { color: '#E5484D', label: 'Do not spray', icon: XCircle },
};

const AXIS = '#808E86';
const GRID = 'rgba(226,240,231,0.07)';
const LINE = '#7DC4FF';

function HourTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const h: HourPoint = payload[0].payload;
  const s = STATUS[h.status];
  const Icon = s.icon;
  return (
    <div className="rounded-xl border border-line/10 bg-surface px-3 py-2 text-xs shadow-pop">
      <div className="font-semibold text-ink">{h.time}</div>
      <div className="mt-0.5 flex items-center gap-1 font-medium" style={{ color: s.color }}>
        <Icon className="h-3.5 w-3.5" /> {s.label}
      </div>
      <div className="mt-0.5 text-ink2">{h.reason}</div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted tabular">
        <span>Wind {h.windKmh} km/h</span>
        <span>Temp {h.tempC}°C</span>
        <span>Humidity {h.rh}%</span>
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-lg text-sm text-ink2">
          {isLive ? 'Live hourly forecast, downscaled to 1.2 km.' : 'Diurnal cycle modelled from the downscaled daily forecast.'} Spraying stops above{' '}
          {DRIFT_LIMIT_KMH} km/h wind or when rain is due within two hours.
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${sprayWindow.hours ? 'bg-good/15 text-good' : 'bg-bad/15 text-bad'}`}>
          {sprayWindow.hours ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          {sprayWindow.hours ? `Best window ${sprayWindow.label}` : 'No safe window'}
        </span>
      </div>

      {/* Hour strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-14" role="list" aria-label="Hourly spray status">
        {hourlyData.map((h) => {
          const s = STATUS[h.status];
          const Icon = s.icon;
          return (
            <div key={h.time} role="listitem" title={`${h.time} · ${s.label} · ${h.reason}`} className="flex flex-col items-center gap-1 rounded-xl bg-surface2 py-2">
              <span className="text-[11px] text-muted tabular">{h.time.slice(0, 2)}</span>
              <Icon className="h-4 w-4" style={{ color: s.color }} aria-label={s.label} />
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="text-xs font-medium text-ink2">Wind speed · km/h</div>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barCategoryGap={3}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="time" tickFormatter={(t) => t.slice(0, 2)} stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={AXIS} fontSize={10} domain={[0, Math.ceil(maxWind / 5) * 5]} tickLine={false} axisLine={false} />
                <Tooltip content={<HourTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <ReferenceLine y={DRIFT_LIMIT_KMH} stroke="#E5484D" strokeDasharray="4 4" label={{ value: 'Drift limit', fill: '#E5484D', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine y={CAUTION_WIND_KMH} stroke="#F2B01E" strokeDasharray="2 4" strokeOpacity={0.5} />
                <Bar dataKey="windKmh" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {hourlyData.map((h) => (
                    <Cell key={h.time} fill={STATUS[h.status].color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs font-medium text-ink2">Air temperature · °C</div>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="time" tickFormatter={(t) => t.slice(0, 2)} stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={AXIS} fontSize={10} domain={[tMin, tMax]} tickLine={false} axisLine={false} />
                <Tooltip content={<HourTooltip />} />
                <Line type="monotone" dataKey="tempC" stroke={LINE} strokeWidth={2} dot={{ r: 3, fill: LINE, strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line/[0.07] pt-4 text-xs text-muted">
        {(Object.keys(STATUS) as SprayStatus[]).map((k) => {
          const s = STATUS[k];
          const Icon = s.icon;
          return (
            <span key={k} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" style={{ color: s.color }} /> {s.label}
            </span>
          );
        })}
        <span className="ml-auto">Hover a bar for the reason</span>
      </div>
    </div>
  );
}
