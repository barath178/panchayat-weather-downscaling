'use client';

import React, { useMemo } from 'react';
import { CloudRain, CloudDrizzle, Snowflake, Flame, Wind, Bug, Radar, EyeOff } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';

interface Props {
  regions: PanchayatData[];
  regionMetrics: Record<string, { coarse: WeatherMetrics; fine: WeatherMetrics }>;
  selectedId: string;
  onSelect: (id: string) => void;
  source: 'live' | 'loading' | 'offline' | 'scenario';
}

interface Rule {
  id: string;
  label: string;
  icon: React.ElementType;
  tone: string;
  test: (m: WeatherMetrics) => boolean;
  /** severity used to pick the worst region */
  score: (m: WeatherMetrics) => number;
  fmt: (m: WeatherMetrics) => string;
  /** counted in "missed by the district forecast" */
  critical: boolean;
}

const RULES: Rule[] = [
  { id: 'heavy', label: 'Heavy rain', icon: CloudRain, tone: 'text-sky', test: (m) => m.rainfallMm >= 64.5, score: (m) => m.rainfallMm, fmt: (m) => `${m.rainfallMm} mm`, critical: true },
  { id: 'wet', label: 'Moderate rain', icon: CloudDrizzle, tone: 'text-sky', test: (m) => m.rainfallMm >= 15.6 && m.rainfallMm < 64.5, score: (m) => m.rainfallMm, fmt: (m) => `${m.rainfallMm} mm`, critical: false },
  { id: 'frost', label: 'Frost', icon: Snowflake, tone: 'text-frost', test: (m) => m.tempMin <= 4, score: (m) => -m.tempMin, fmt: (m) => `${m.tempMin}°C`, critical: true },
  { id: 'heat', label: 'Heat stress', icon: Flame, tone: 'text-sun', test: (m) => m.tempMax >= 38, score: (m) => m.tempMax, fmt: (m) => `${m.tempMax}°C`, critical: true },
  { id: 'wind', label: 'Spray drift', icon: Wind, tone: 'text-alert', test: (m) => m.windSpeedKmh > 15, score: (m) => m.windSpeedKmh, fmt: (m) => `${m.windSpeedKmh} km/h`, critical: true },
  {
    id: 'fungal',
    label: 'Fungal weather',
    icon: Bug,
    tone: 'text-warn',
    test: (m) => m.relativeHumidity >= 88 && (m.tempMax + m.tempMin) / 2 >= 18 && (m.tempMax + m.tempMin) / 2 <= 30,
    score: (m) => m.relativeHumidity,
    fmt: (m) => `RH ${m.relativeHumidity}%`,
    critical: false,
  },
];

export default function AlertScan({ regions, regionMetrics, selectedId, onSelect, source }: Props) {
  const scan = useMemo(() => {
    const out = RULES.map((r) => ({ rule: r, count: 0, worst: null as PanchayatData | null, worstScore: -Infinity }));
    let missed = 0;
    const missedIds: string[] = [];
    for (const p of regions) {
      const m = regionMetrics[p.id];
      if (!m) continue;
      let miss = false;
      out.forEach((o) => {
        if (!o.rule.test(m.fine)) return;
        o.count++;
        const s = o.rule.score(m.fine);
        if (s > o.worstScore) (o.worstScore = s), (o.worst = p);
        if (o.rule.critical && !o.rule.test(m.coarse)) miss = true;
      });
      if (miss) missed++, missedIds.push(p.id);
    }
    return { out, missed, missedIds };
  }, [regions, regionMetrics]);

  const flagged = regions.filter((p) => {
    const m = regionMetrics[p.id];
    return m && RULES.some((r) => r.test(m.fine));
  }).length;

  const nextMissed = () => {
    if (!scan.missedIds.length) return;
    const i = scan.missedIds.indexOf(selectedId);
    onSelect(scan.missedIds[(i + 1) % scan.missedIds.length]);
  };

  return (
    <section className="card mb-6 overflow-hidden" aria-labelledby="scan-title">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center gap-3 lg:w-[250px]">
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-accent/10">
            <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-accent/25" />
            <Radar className="relative h-5 w-5 text-accent" />
          </span>
          <div>
            <h2 id="scan-title" className="text-sm font-semibold text-ink">
              AI scan · {regions.length} villages
            </h2>
            <p className="text-xs text-muted">
              {flagged} flagged today · {source === 'live' ? 'live data' : source === 'loading' ? 'updating…' : 'model data'}
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {scan.out.map(({ rule, count, worst }) => {
            const I = rule.icon;
            const m = worst ? regionMetrics[worst.id].fine : null;
            return (
              <button
                key={rule.id}
                disabled={!worst}
                onClick={() => worst && onSelect(worst.id)}
                title={worst ? `Jump to the worst-hit village: ${worst.name}` : 'No village affected'}
                className={`group min-w-0 rounded-xl border px-3 py-2 text-left transition-colors ${
                  worst && worst.id === selectedId ? 'border-accent/60 bg-accent/[0.06]' : 'border-line/[0.07] bg-surface2/60 hover:border-line/20'
                } disabled:cursor-default disabled:opacity-45`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <I className={`h-3.5 w-3.5 shrink-0 ${count ? rule.tone : ''}`} />
                  <span className="truncate">{rule.label}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`font-display text-xl leading-none tabular ${count ? 'text-ink' : 'text-muted'}`}>{count}</span>
                  <span className="min-w-0 truncate text-[11px] text-ink2 group-hover:text-ink">{worst && m ? `${worst.name} · ${rule.fmt(m)}` : 'none today'}</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={nextMissed}
          disabled={!scan.missed}
          className="flex shrink-0 items-center gap-3 rounded-2xl border border-sun/30 bg-sun/[0.07] px-4 py-3 text-left transition-colors hover:bg-sun/[0.12] disabled:opacity-50 lg:w-[210px]"
          title="Cycle through villages whose alert the 18 km forecast misses"
        >
          <EyeOff className="h-5 w-5 shrink-0 text-sun" />
          <span>
            <span className="block font-display text-2xl leading-none text-ink tabular">{scan.missed}</span>
            <span className="block text-[11px] leading-snug text-ink2">alerts the district forecast misses</span>
          </span>
        </button>
      </div>
    </section>
  );
}
