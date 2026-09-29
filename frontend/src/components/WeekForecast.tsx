'use client';

import React from 'react';
import { CalendarDays, Droplets, Wind, FileText, Snowflake, Flame, CloudRain, Wheat, SprayCan, Ban } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import { describeSky } from '@/lib/sky';
import { DayOutlook, bestSprayDay, dayAlerts, dayLabel, dryRun, rainClass, shortDate, sum } from '@/lib/week';

interface Props {
  panchayat: PanchayatData;
  week: DayOutlook[];
  isLive: boolean;
  onOpenBulletin: () => void;
}

const BLOCKER: Record<string, string> = { rain: 'Rain', wind: 'Wind', heat: 'Heat', other: 'Poor' };

export default function WeekForecast({ panchayat: p, week, isLive, onOpenBulletin }: Props) {
  const best = bestSprayDay(week);
  const dry = dryRun(week);
  const fineRain = sum(week.map((d) => d.fine.rainfallMm));
  const blockRain = sum(week.map((d) => d.coarse.rainfallMm));
  const rainyDays = week.filter((d) => d.fine.rainfallMm >= 2.5).length;
  const maxRain = Math.max(5, ...week.map((d) => Math.max(d.fine.rainfallMm, d.coarse.rainfallMm)));

  const lo = Math.min(...week.flatMap((d) => [d.fine.tempMin, d.coarse.tempMin]));
  const hi = Math.max(...week.flatMap((d) => [d.fine.tempMax, d.coarse.tempMax]));
  const y = (t: number) => ((hi - t) / (hi - lo || 1)) * 100;

  const stats = [
    { icon: CloudRain, label: 'Week rain', value: `${fineRain} mm`, sub: `block ${blockRain} mm` },
    { icon: Droplets, label: 'Rainy days', value: `${rainyDays} of 7`, sub: '≥ 2.5 mm (IMD)' },
    { icon: SprayCan, label: 'Best spray day', value: best >= 0 ? dayLabel(week[best], best, 'en', 'short') : 'None', sub: best >= 0 ? week[best].spray.label : 'no safe window' },
    { icon: Wheat, label: 'Dry spell', value: dry ? `${dry[1] - dry[0] + 1} days` : 'None', sub: dry ? `${dayLabel(week[dry[0]], dry[0], 'en', 'short')} → ${dayLabel(week[dry[1]], dry[1], 'en', 'short')}` : 'harvest under cover' },
  ];

  return (
    <section className="card hud overflow-hidden" aria-labelledby="week-title">
      <div className="flex flex-wrap items-end justify-between gap-3 p-5 pb-0 sm:p-6 sm:pb-0">
        <div>
          <div className="eyebrow flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-accent" /> Fig 1.2 · 7-day village outlook {isLive ? '· live' : '· simulated'}
          </div>
          <h2 id="week-title" className="mt-1 font-display text-2xl text-ink">
            The week ahead in {p.name}
          </h2>
        </div>
        <button onClick={onOpenBulletin} className="btn-primary">
          <FileText className="h-4 w-4" /> Agromet bulletin
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pt-4 sm:grid-cols-4 sm:px-6">
        {stats.map(({ icon: I, label, value, sub }) => (
          <div key={label} className="rounded-2xl bg-surface2 px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
              <I className="h-3.5 w-3.5" /> {label}
            </div>
            <div className="mt-0.5 truncate text-base font-semibold text-ink tabular">{value}</div>
            <div className="truncate text-[11px] text-muted">{sub}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto px-5 pb-5 pt-4 scrollbar-none sm:px-6 sm:pb-6">
        <ol className="grid min-w-[720px] grid-cols-7 gap-2">
          {week.map((d, i) => {
            const sky = describeSky(d.fine);
            const Icon = sky.icon;
            const alerts = dayAlerts(d.fine);
            const isBest = i === best;
            const rc = rainClass(d.fine.rainfallMm);
            return (
              <li
                key={i}
                className={`relative flex flex-col items-center rounded-2xl border px-2 pb-3 pt-4 text-center transition-colors ${
                  isBest ? 'border-accent/70 bg-accent/[0.06] shadow-glow' : 'border-line/[0.07] bg-surface2/60 hover:border-line/15'
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {isBest && (
                  <span className="absolute -top-2.5 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-ink">Best to spray</span>
                )}
                <div className={`text-sm font-semibold ${i === 0 ? 'text-accent' : 'text-ink'}`}>{dayLabel(d, i, 'en', 'short')}</div>
                <div className="h-4 text-[11px] text-muted">{shortDate(d)}</div>
                <Icon className="mt-2 h-7 w-7 text-ink/85" strokeWidth={1.5} aria-label={sky.label} />

                {/* temperature range: village bar, block ghost */}
                <div className="mt-2 text-sm font-semibold text-ink tabular">{Math.round(d.fine.tempMax)}°</div>
                <div className="relative my-1 h-20 w-full" aria-hidden>
                  <span
                    className="absolute left-1/2 w-1.5 -translate-x-[9px] rounded-full border border-dashed border-sun/60"
                    style={{ top: `${y(d.coarse.tempMax)}%`, bottom: `${100 - y(d.coarse.tempMin)}%` }}
                    title="Block range"
                  />
                  <span
                    className="absolute left-1/2 w-2 translate-x-[1px] rounded-full"
                    style={{ top: `${y(d.fine.tempMax)}%`, bottom: `${100 - y(d.fine.tempMin)}%`, background: 'linear-gradient(#F6B94C, #7DC4FF)' }}
                  />
                </div>
                <div className="text-sm text-ink2 tabular">{Math.round(d.fine.tempMin)}°</div>

                {/* rain */}
                <div className="mt-3 flex h-10 w-full items-end justify-center gap-1" aria-hidden>
                  <span className="w-2.5 rounded-t-sm border border-b-0 border-dashed border-sun/50" style={{ height: `${Math.max(2, (d.coarse.rainfallMm / maxRain) * 100)}%` }} />
                  <span className="w-2.5 rounded-t-sm bg-sky" style={{ height: `${Math.max(2, (d.fine.rainfallMm / maxRain) * 100)}%` }} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-sky tabular" title={rc.en}>
                  <Droplets className="h-3 w-3" /> {d.fine.rainfallMm} mm
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted tabular">
                  <Wind className="h-3 w-3" /> {Math.round(d.fine.windSpeedKmh)} km/h
                </div>

                {/* spray verdict */}
                <div
                  className={`mt-2.5 w-full rounded-lg px-1 py-1 text-[10.5px] font-semibold ${
                    d.spray.hours >= 3 ? 'bg-good/15 text-good' : d.spray.hours > 0 ? 'bg-warn/15 text-warn' : 'bg-bad/15 text-bad'
                  }`}
                >
                  {d.spray.hours > 0 ? (
                    <span className="tabular">
                      {d.spray.start?.slice(0, 2)}–{d.spray.end?.slice(0, 2)} h
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Ban className="h-3 w-3" /> {BLOCKER[d.blocker] ?? 'No'}
                    </span>
                  )}
                </div>

                {alerts.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {alerts.includes('frost') && <Snowflake className="h-3.5 w-3.5 text-frost" aria-label="Frost" />}
                    {alerts.includes('heat') && <Flame className="h-3.5 w-3.5 text-sun" aria-label="Heat" />}
                    {alerts.includes('heavy') && <CloudRain className="h-3.5 w-3.5 text-sky" aria-label="Heavy rain" />}
                    {alerts.includes('wind') && <Wind className="h-3.5 w-3.5 text-alert" aria-label="Strong wind" />}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'linear-gradient(#F6B94C, #7DC4FF)' }} /> Village 1.2 km
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-sun/70" /> District block 18 km
          </span>
          <span>Spray chip: longest safe window (wind ≤ 15 km/h, no rain within 2 h)</span>
        </div>
      </div>
    </section>
  );
}
