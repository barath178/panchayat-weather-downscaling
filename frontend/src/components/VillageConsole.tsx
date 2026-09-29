'use client';

import React from 'react';
import { ArrowDown, SprayCan, Droplets, ShieldCheck } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { HourPoint, PestRisk, SprayWindow, WeatherMetrics } from '@/lib/microclimate';
import { describeSky } from '@/lib/sky';
import { TONE, verdicts } from './ActionPlan';
import { SOURCE_DOT, SourceKind } from './CommandBar';

export interface ConsoleData {
  panchayat: PanchayatData;
  fine: WeatherMetrics;
  coarse: WeatherMetrics;
  hourly: HourPoint[];
  sprayWindow: SprayWindow;
  irrigation: { action: string; detail: string; deficit: number };
  pest: PestRisk;
  crop: string;
  source: SourceKind;
}

const SOURCE_WORD: Record<SourceKind, string> = { live: 'Live forecast', loading: 'Updating', offline: 'Offline estimate', scenario: 'Simulated scenario' };
const HOUR_COLOR = { safe: 'bg-good', caution: 'bg-warn', danger: 'bg-bad' } as const;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** The live proof on the first screen: one village's day, the district-vs-village gap, and today's three decisions. */
export default function VillageConsole({ panchayat: p, fine, coarse, hourly, sprayWindow, irrigation, pest, crop, source }: ConsoleData) {
  const v = verdicts(sprayWindow, irrigation, pest);
  const sky = describeSky(fine);
  const SkyIcon = sky.icon;

  const rows: { k: string; unit: string; c: number; f: number; cold: string; warm: string }[] = [
    { k: 'Night low', unit: '°C', c: coarse.tempMin, f: fine.tempMin, cold: 'text-frost', warm: 'text-sun' },
    { k: 'Day high', unit: '°C', c: coarse.tempMax, f: fine.tempMax, cold: 'text-frost', warm: 'text-sun' },
    { k: 'Rain', unit: 'mm', c: coarse.rainfallMm, f: fine.rainfallMm, cold: 'text-sun', warm: 'text-sky' },
    { k: 'Wind', unit: 'km/h', c: coarse.windSpeedKmh, f: fine.windSpeedKmh, cold: 'text-sky', warm: 'text-alert' },
  ];

  const decisions = [
    { icon: SprayCan, label: 'Spray', ...v.spray, detail: sprayWindow.hours ? sprayWindow.label : 'No safe window' },
    { icon: Droplets, label: 'Water', ...v.water, detail: irrigation.deficit > 0 ? `${irrigation.deficit} mm short` : 'Rain covers it' },
    { icon: ShieldCheck, label: 'Crop', ...v.crop, detail: pest.title.replace(/\s*\(.*\)$/, '') },
  ];

  return (
    <section aria-label={`Today in ${p.name}`} aria-live="polite" className="card overflow-hidden">
      <div key={p.id} className="animate-fade-in">
        {/* Place */}
        <header className="flex items-start justify-between gap-4 border-b border-line/[0.08] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${SOURCE_DOT[source]}`} /> {SOURCE_WORD[source]} · 1.2 km cell
            </div>
            <h2 className="mt-1 truncate text-xl font-semibold tracking-tight text-ink">{p.name}</h2>
            <p className="truncate text-xs text-muted">
              {p.district}, {p.state} · {p.elevationM.toLocaleString('en-IN')} m
            </p>
          </div>
          <SkyIcon className="h-9 w-9 shrink-0 text-ink2" strokeWidth={1.4} aria-hidden />
        </header>

        {/* Temperature */}
        <div className="flex items-end justify-between gap-4 px-5 pt-5">
          <div className="flex items-end gap-3">
            <span className="text-6xl font-semibold leading-[0.85] tracking-[-0.04em] text-ink tabular">{Math.round(fine.tempMax)}°</span>
            <span className="pb-1 text-2xl font-medium tracking-tight text-muted tabular">/ {Math.round(fine.tempMin)}°</span>
          </div>
          <div className="pb-1 text-right text-xs text-muted">
            <div className="text-sm font-medium text-ink">{sky.label}</div>
            RH {fine.relativeHumidity}% · wind {r1(fine.windSpeedKmh)} km/h
          </div>
        </div>

        {/* District vs village: the whole point of downscaling, in four rows */}
        <div className="mx-5 mt-5 overflow-hidden rounded-lg border border-line/[0.08]">
          <table className="w-full text-sm tabular">
            <thead>
              <tr className="bg-surface2 text-[11px] text-muted">
                <th className="px-3 py-2 text-left font-medium">Today</th>
                <th className="px-3 py-2 text-right font-medium">District 18 km</th>
                <th className="px-3 py-2 text-right font-medium text-accent">Village 1.2 km</th>
                <th className="px-3 py-2 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12.5px]">
              {rows.map(({ k, unit, c, f, cold, warm }) => {
                const d = r1(f - c);
                return (
                  <tr key={k} className="border-t border-line/[0.06]">
                    <td className="px-3 py-2 font-sans text-[13px] text-ink2">{k}</td>
                    <td className="px-3 py-2 text-right text-muted">
                      {r1(c)} {unit}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-ink">
                      {r1(f)} {unit}
                    </td>
                    <td className={`px-3 py-2 text-right ${d === 0 ? 'text-muted' : d < 0 ? cold : warm}`}>{d === 0 ? 'same' : `${d > 0 ? '+' : '−'}${Math.abs(d)}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Today's decisions */}
        <div className="grid grid-cols-3 gap-2 px-5 pt-4">
          {decisions.map(({ icon: Icon, label, tone, verdict, detail }) => {
            const t = TONE[tone];
            const V = t.icon;
            return (
              <div key={label} className="min-w-0 rounded-lg border border-line/[0.08] bg-surface2/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <Icon className="h-3.5 w-3.5" aria-hidden /> {label === 'Crop' ? crop : label}
                </div>
                <div className={`mt-1.5 flex items-center gap-1 text-sm font-semibold ${t.text}`}>
                  <V className="h-4 w-4 shrink-0" aria-hidden /> <span className="truncate">{verdict}</span>
                </div>
                <div className="mt-0.5 truncate text-xs text-ink2">{detail}</div>
              </div>
            );
          })}
        </div>

        {/* Spray clock */}
        <div className="px-5 pb-5 pt-4">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>Spray clock, 6 am to 7 pm</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <i className="h-2 w-2 rounded-sm bg-good" /> safe
              </span>
              <span className="flex items-center gap-1">
                <i className="h-2 w-2 rounded-sm bg-warn" /> caution
              </span>
              <span className="flex items-center gap-1">
                <i className="h-2 w-2 rounded-sm bg-bad" /> stop
              </span>
            </span>
          </div>
          <div className="mt-2 flex gap-[3px]" role="img" aria-label={`Spray window: ${sprayWindow.label}`}>
            {hourly.map((h) => (
              <span key={h.time} className={`h-2.5 flex-1 rounded-sm ${HOUR_COLOR[h.status]}`} title={`${h.time} · ${h.reason}`} />
            ))}
          </div>
        </div>

        <a href="#village" className="group flex items-center justify-between border-t border-line/[0.08] px-5 py-3 text-sm font-medium text-accent hover:bg-surface2/60">
          Full forecast, 7-day outlook and bulletin
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
