'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';
import { describeSky } from '@/lib/sky';

interface Props {
  panchayat: PanchayatData;
  coarse: WeatherMetrics;
  fine: WeatherMetrics;
  coarseElevationM: number;
  source: { kind: 'live' | 'loading' | 'offline' | 'scenario'; label: string };
  now: Date | null;
}

const SOURCE: Record<Props['source']['kind'], [string, string]> = {
  live: ['Live', 'bg-good'],
  loading: ['Updating', 'bg-warn animate-pulse'],
  offline: ['Offline model', 'bg-alert'],
  scenario: ['Simulated', 'bg-sky'],
};

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Editorial "today" sheet: giant temperatures, conditions, and the district-vs-village comparison. */
export default function VillageSheet({ panchayat: p, coarse, fine, coarseElevationM, source, now }: Props) {
  const sky = describeSky(fine);
  const Icon = sky.icon;
  const dz = Math.round(p.elevationM - coarseElevationM);
  const [srcLabel, srcDot] = SOURCE[source.kind];

  const rows: { k: string; unit: string; c: number; f: number; up: string; down: string }[] = [
    { k: 'Night low', unit: '°C', c: coarse.tempMin, f: fine.tempMin, up: 'text-sun', down: 'text-frost' },
    { k: 'Day high', unit: '°C', c: coarse.tempMax, f: fine.tempMax, up: 'text-sun', down: 'text-frost' },
    { k: 'Rain', unit: 'mm', c: coarse.rainfallMm, f: fine.rainfallMm, up: 'text-sky', down: 'text-sun' },
    { k: 'Wind', unit: 'km/h', c: coarse.windSpeedKmh, f: fine.windSpeedKmh, up: 'text-alert', down: 'text-sky' },
  ];

  return (
    <article className="flex h-full flex-col" aria-labelledby="village-name">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span>{now ? now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Today'}</span>
        <span className="inline-flex items-center gap-2 rounded-md border border-line/[0.14] px-3 py-1 text-ink2">
          <span className={`h-1.5 w-1.5 rounded-full ${srcDot}`} /> {srcLabel}
        </span>
      </div>

      <h3 id="village-name" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-4xl">
        {p.name}
      </h3>
      <p className="mt-3 text-[15px] text-ink2">
        {p.regionalName ? `${p.regionalName} · ` : ''}
        {p.district}, {p.state}
      </p>
      <p className="mt-1 font-mono text-[11.5px] text-muted">
        {p.lat.toFixed(3)}°N {p.lng.toFixed(3)}°E · {p.elevationM.toLocaleString('en-IN')} m a.s.l. · {p.terrainType}
      </p>

      {/* the numbers */}
      <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="text-[clamp(72px,8vw,112px)] font-semibold leading-[0.85] tracking-[-0.05em] tabular text-ink">{Math.round(fine.tempMax)}°</div>
        <div className="pb-2">
          <div className="text-4xl font-medium leading-none tracking-tight text-muted tabular">{Math.round(fine.tempMin)}°</div>
          <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">night low</div>
        </div>
        <div className="ml-auto max-w-[16rem] pb-2 text-right">
          <Icon className="ml-auto h-12 w-12 text-ink" strokeWidth={1.25} aria-hidden />
          <div className="mt-2 text-lg font-semibold text-ink">{sky.label}</div>
          <div className="text-sm leading-snug text-ink2">{sky.detail}</div>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-3 border-y border-line/[0.14]">
        {[
          ['Rain', `${fine.rainfallMm}`, 'mm'],
          ['Wind', `${fine.windSpeedKmh}`, 'km/h'],
          ['Humidity', `${fine.relativeHumidity}`, '%'],
        ].map(([k, v, u], i) => (
          <div key={k} className={`py-4 ${i ? 'border-l border-line/[0.14] pl-4' : ''}`}>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{k}</dt>
            <dd className="mt-1 font-display text-3xl text-ink">
              {v}
              <span className="ml-1 font-sans text-sm text-muted">{u}</span>
            </dd>
          </div>
        ))}
      </dl>

      {/* district vs village */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-sm font-semibold text-ink">
            District forecast <span className="font-normal text-muted">18 km</span> <ArrowRight className="mx-1 inline h-3.5 w-3.5 text-muted" /> your village{' '}
            <span className="font-normal text-muted">1.2 km</span>
          </h4>
          <span className="font-mono text-[11px] text-muted">
            Δz {dz >= 0 ? '+' : '−'}
            {Math.abs(dz)} m
          </span>
        </div>
        <ul className="mt-3 divide-y divide-line/[0.1]">
          {rows.map((r) => {
            const d = r1(r.f - r.c);
            const tone = Math.abs(d) < 0.1 ? 'text-muted' : d > 0 ? r.up : r.down;
            return (
              <li key={r.k} className="grid grid-cols-[1fr_auto_auto_4.5rem] items-baseline gap-4 py-2.5">
                <span className="text-sm text-ink2">{r.k}</span>
                <span className="font-mono text-sm text-muted line-through decoration-line/30">
                  {r.c} {r.unit}
                </span>
                <span className="font-mono text-sm font-semibold text-ink">
                  {r.f} {r.unit}
                </span>
                <span className={`text-right font-mono text-xs font-semibold ${tone}`}>{Math.abs(d) < 0.1 ? 'same' : `${d > 0 ? '+' : '−'}${Math.abs(d)}`}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
