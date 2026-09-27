'use client';

import React from 'react';
import { Droplets, Wind, CloudRain, Mountain, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';
import { describeSky } from '@/lib/sky';

interface Props {
  panchayat: PanchayatData;
  coarse: WeatherMetrics;
  fine: WeatherMetrics;
  coarseElevationM: number;
  source: { kind: 'live' | 'loading' | 'offline' | 'scenario'; label: string };
}

function Delta({ v, unit, invert }: { v: number; unit: string; invert?: boolean }) {
  const r = Math.round(v * 10) / 10;
  if (Math.abs(r) < 0.1) return <span className="inline-flex items-center gap-0.5 text-muted"><Minus className="h-3 w-3" />same</span>;
  const up = r > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const tone = (invert ? !up : up) ? 'text-sun' : 'text-sky';
  return (
    <span className={`inline-flex items-center gap-0.5 ${tone}`}>
      <Icon className="h-3 w-3" />
      {up ? '+' : '−'}
      {Math.abs(r)}
      {unit}
    </span>
  );
}

export default function TodayCard({ panchayat: p, coarse, fine, coarseElevationM, source }: Props) {
  const sky = describeSky(fine);
  const Icon = sky.icon;
  const dz = p.elevationM - coarseElevationM;

  const rows: { label: string; c: string; f: string; d: React.ReactNode }[] = [
    { label: 'Night low', c: `${coarse.tempMin}°`, f: `${fine.tempMin}°`, d: <Delta v={fine.tempMin - coarse.tempMin} unit="°" /> },
    { label: 'Day high', c: `${coarse.tempMax}°`, f: `${fine.tempMax}°`, d: <Delta v={fine.tempMax - coarse.tempMax} unit="°" /> },
    { label: 'Rain', c: `${coarse.rainfallMm} mm`, f: `${fine.rainfallMm} mm`, d: <Delta v={fine.rainfallMm - coarse.rainfallMm} unit=" mm" invert /> },
    { label: 'Wind', c: `${coarse.windSpeedKmh} km/h`, f: `${fine.windSpeedKmh} km/h`, d: <Delta v={fine.windSpeedKmh - coarse.windSpeedKmh} unit="" /> },
  ];

  return (
    <article className="card overflow-hidden">
      <div className="relative p-5 sm:p-6" style={{ background: `linear-gradient(160deg, ${sky.from}, ${sky.to} 85%)` }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="eyebrow">Today in</div>
            <h2 className="mt-1 font-display text-2xl leading-tight text-ink text-balance sm:text-[28px]">{p.name}</h2>
            <p className="mt-1 text-sm text-ink2">
              {p.regionalName ? `${p.regionalName} · ` : ''}
              {p.district}, {p.state}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              source.kind === 'live' ? 'bg-good/15 text-good' : source.kind === 'loading' ? 'bg-warn/15 text-warn' : 'bg-line/10 text-ink2'
            }`}
          >
            {source.kind === 'live' ? '● Live' : source.kind === 'loading' ? 'Updating…' : source.kind === 'offline' ? 'Offline model' : 'Simulated'}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-start gap-1 font-display leading-none text-ink">
              <span className="text-7xl tracking-tight">{Math.round(fine.tempMax)}°</span>
              <span className="mt-2 text-2xl text-ink2">/ {Math.round(fine.tempMin)}°</span>
            </div>
            <div className="mt-3 text-lg font-semibold text-ink">{sky.label}</div>
            <div className="text-sm text-ink2">{sky.detail}</div>
          </div>
          <Icon className="h-20 w-20 shrink-0 text-ink/80" strokeWidth={1.2} aria-hidden />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { icon: CloudRain, label: 'Rain', v: `${fine.rainfallMm} mm` },
            { icon: Wind, label: 'Wind', v: `${fine.windSpeedKmh} km/h` },
            { icon: Droplets, label: 'Humidity', v: `${fine.relativeHumidity}%` },
          ].map(({ icon: I, label, v }) => (
            <div key={label} className="rounded-2xl bg-black/20 px-3 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs text-ink2">
                <I className="h-3.5 w-3.5" /> {label}
              </div>
              <div className="mt-0.5 text-base font-semibold text-ink tabular">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Block vs village */}
      <div className="p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">District forecast vs your village</h3>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Mountain className="h-3.5 w-3.5" /> {p.elevationM} m ({dz >= 0 ? '+' : '−'}
            {Math.abs(dz)} m vs block)
          </span>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="pb-2 font-medium" />
              <th className="pb-2 text-right font-medium">18 km block</th>
              <th className="pb-2 text-right font-medium text-accent">1.2 km local</th>
              <th className="pb-2 text-right font-medium">Change</th>
            </tr>
          </thead>
          <tbody className="tabular">
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line/[0.07]">
                <td className="py-2 text-ink2">{r.label}</td>
                <td className="py-2 text-right text-muted">{r.c}</td>
                <td className="py-2 text-right font-semibold text-ink">{r.f}</td>
                <td className="py-2 text-right text-xs">{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {p.terrainType}. Terrain physics: lapse rate for the {Math.abs(dz)} m height difference, cold-air drainage in valleys,
          slope and wind exposure{p.isUrban ? ', and the urban heat island' : ''}.
        </p>
      </div>
    </article>
  );
}
