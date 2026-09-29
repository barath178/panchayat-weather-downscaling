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
    <section aria-labelledby="scan-title">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.1] bg-line/[0.1] sm:grid-cols-4 xl:grid-cols-8">
        <div className="col-span-2 flex items-center gap-3 bg-surface p-4 sm:col-span-4 xl:col-span-1 xl:flex-col xl:items-start xl:justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10">
            <Radar className="h-5 w-5 text-accent" />
          </span>
          <div>
            <h2 id="scan-title" className="text-sm font-semibold text-ink">
              Hazard scan
            </h2>
            <p className="text-xs leading-snug text-muted">
              {regions.length} regions · {flagged} flagged · {source === 'live' ? 'live' : source === 'loading' ? 'updating…' : 'model'}
            </p>
          </div>
        </div>

        {scan.out.map(({ rule, count, worst }) => {
          const I = rule.icon;
          const m = worst ? regionMetrics[worst.id].fine : null;
          const on = worst && worst.id === selectedId;
          return (
            <button
              key={rule.id}
              disabled={!worst}
              onClick={() => worst && onSelect(worst.id)}
              title={worst ? `Jump to the worst-hit village: ${worst.name}` : 'No village affected'}
              className={`group flex min-w-0 flex-col justify-between gap-3 p-4 text-left transition-colors ${on ? 'bg-accent/[0.08]' : 'bg-surface hover:bg-surface2'} disabled:cursor-default`}
            >
              <span className={`flex items-center gap-1.5 text-xs ${count ? 'text-ink2' : 'text-muted'}`}>
                <I className={`h-3.5 w-3.5 shrink-0 ${count ? rule.tone : ''}`} />
                <span className="truncate">{rule.label}</span>
              </span>
              <span className={`text-3xl font-semibold tracking-tight tabular leading-none tabular ${count ? 'text-ink' : 'text-muted/50'}`}>{count}</span>
              <span className="block min-w-0 truncate text-[11px] text-muted group-hover:text-ink2">{worst && m ? `${worst.name} · ${rule.fmt(m)}` : 'none today'}</span>
            </button>
          );
        })}

        <button
          onClick={nextMissed}
          disabled={!scan.missed}
          className="flex flex-col justify-between gap-3 bg-sun/[0.1] p-4 text-left transition-colors hover:bg-sun/[0.16] disabled:opacity-60"
          title="Cycle through villages whose alert the 18 km forecast misses"
        >
          <span className="flex items-center gap-1.5 text-xs text-sun">
            <EyeOff className="h-3.5 w-3.5" /> Missed
          </span>
          <span className="text-3xl font-semibold tracking-tight tabular leading-none text-ink tabular">{scan.missed}</span>
          <span className="text-[11px] leading-snug text-ink2">alerts the district forecast misses</span>
        </button>
      </div>
    </section>
  );
}