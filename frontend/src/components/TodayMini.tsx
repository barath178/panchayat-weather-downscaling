'use client';

import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { PestRisk, SprayWindow, WeatherMetrics } from '@/lib/microclimate';
import { describeSky } from '@/lib/sky';

export interface TodayMiniProps {
  panchayat: PanchayatData;
  fine: WeatherMetrics;
  coarse: WeatherMetrics;
  sprayWindow: SprayWindow;
  pest: PestRisk;
  crop: string;
  source: 'live' | 'loading' | 'offline' | 'scenario';
}

const SOURCE: Record<TodayMiniProps['source'], [string, string]> = {
  live: ['Live', 'bg-good'],
  loading: ['Updating', 'bg-warn animate-pulse'],
  offline: ['Offline model', 'bg-alert'],
  scenario: ['Simulated', 'bg-sky'],
};
const r1 = (n: number) => Math.round(n * 10) / 10;

/** The answer for the selected village, on the first screen next to the map. */
export default function TodayMini({ panchayat: p, fine, coarse, sprayWindow, pest, crop, source }: TodayMiniProps) {
  const sky = describeSky(fine);
  const Icon = sky.icon;
  const [label, dot] = SOURCE[source];
  const dT = r1(fine.tempMin - coarse.tempMin);
  const spray = sprayWindow.hours >= 3 ? 'text-good' : sprayWindow.hours > 0 ? 'text-warn' : 'text-bad';
  const risk = pest.level === 'high' ? 'text-bad' : pest.level === 'moderate' ? 'text-warn' : 'text-good';

  return (
    <section aria-live="polite" aria-label={`Today in ${p.name}`} className="rounded-card border border-line/[0.1] bg-surface/80">
      <div key={p.id} className="animate-fade-in">
        <div className="flex items-center justify-between border-b border-line/[0.08] px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
          <span>Today · 1.2 km cell</span>
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3 px-4 pt-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-ink">{p.name}</div>
            <div className="truncate text-xs text-muted">
              {p.district}, {p.state} · {p.elevationM.toLocaleString('en-IN')} m
            </div>
          </div>
          <Icon className="h-7 w-7 shrink-0 text-ink2" strokeWidth={1.4} aria-hidden />
        </div>
        <div className="flex items-end gap-3 px-4 pt-2">
          <span className="font-display text-5xl leading-none text-ink">{Math.round(fine.tempMax)}°</span>
          <span className="pb-1 text-sm text-muted">
            night {Math.round(fine.tempMin)}° · {sky.label.toLowerCase()}
          </span>
        </div>
        <p className="px-4 pt-2 font-mono text-[11px] text-muted">
          District said {r1(coarse.tempMin)}° at night, village {r1(fine.tempMin)}°{' '}
          <span className={dT < 0 ? 'text-frost' : dT > 0 ? 'text-sun' : ''}>({dT > 0 ? '+' : ''}{dT}°)</span>
        </p>
        <dl className="mt-3 grid grid-cols-3 divide-x divide-line/[0.08] border-t border-line/[0.08] text-xs">
          <div className="px-3 py-2.5">
            <dt className="text-muted">Rain</dt>
            <dd className="mt-0.5 font-semibold text-ink">{r1(fine.rainfallMm)} mm</dd>
          </div>
          <div className="px-3 py-2.5">
            <dt className="text-muted">Spray</dt>
            <dd className={`mt-0.5 truncate font-semibold ${spray}`}>{sprayWindow.hours ? `${sprayWindow.start}–${sprayWindow.end}` : 'Hold off'}</dd>
          </div>
          <div className="px-3 py-2.5">
            <dt className="truncate text-muted">{crop}</dt>
            <dd className={`mt-0.5 font-semibold capitalize ${risk}`}>{pest.level} risk</dd>
          </div>
        </dl>
        <a href="#village" className="group flex items-center justify-between border-t border-line/[0.08] px-4 py-2.5 text-xs font-semibold text-accent">
          Full forecast, 7 days and bulletin <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
