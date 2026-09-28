'use client';

import React from 'react';
import { ArrowDown, CloudRain, SprayCan, Droplets, ShieldCheck } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { PestRisk, SprayWindow, WeatherMetrics } from '@/lib/microclimate';
import { describeSky } from '@/lib/sky';
import { TONE, Tone, verdicts } from './ActionPlan';

export interface GlanceData {
  panchayat: PanchayatData;
  fine: WeatherMetrics;
  sprayWindow: SprayWindow;
  irrigation: { action: string; detail: string; deficit: number };
  pest: PestRisk;
  crop: string;
  source: 'live' | 'loading' | 'offline' | 'scenario';
}

const SOURCE: Record<GlanceData['source'], [string, string]> = {
  live: ['Live today', 'bg-good'],
  loading: ['Updating', 'bg-warn animate-pulse'],
  offline: ['Offline model', 'bg-alert'],
  scenario: ['Simulated', 'bg-sky'],
};

function Cell({ icon: Icon, label, tone, verdict, children }: { icon: React.ElementType; label: string; tone?: Tone; verdict?: string; children: React.ReactNode }) {
  const t = tone && TONE[tone];
  const V = t?.icon;
  return (
    <div className="min-w-0 bg-surface px-5 py-4 lg:px-6 lg:py-5">
      <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
      </div>
      {t && V && (
        <div className={`mt-2 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${t.bg} ${t.text}`}>
          <V className="h-3.5 w-3.5" aria-hidden /> {verdict}
        </div>
      )}
      <div className="mt-1.5 truncate text-sm text-ink2">{children}</div>
    </div>
  );
}

/** First-screen answer: today's weather and the three farm decisions for the chosen village. */
export default function TodayGlance({ panchayat: p, fine, sprayWindow, irrigation, pest, crop, source }: GlanceData) {
  const v = verdicts(sprayWindow, irrigation, pest);
  const sky = describeSky(fine);
  const SkyIcon = sky.icon;
  const [srcLabel, srcDot] = SOURCE[source];

  return (
    <section aria-label={`Today in ${p.name}`} aria-live="polite" className="card overflow-hidden">
      {/* 1px gaps over a hairline background draw the dividers in both the 2-column and 6-column layouts */}
      <div key={p.id} className="grid animate-fade-in grid-cols-2 gap-px bg-line/[0.08] lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_auto]">
        {/* Place + temperature */}
        <div className="col-span-2 flex items-center gap-5 bg-surface px-5 py-4 lg:col-span-1 lg:px-6 lg:py-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${srcDot}`} /> {srcLabel}
            </div>
            <div className="mt-1.5 line-clamp-2 font-display text-[26px] leading-[0.95] text-ink">{p.name}</div>
            <div className="mt-1 truncate text-xs text-muted">
              {p.district}, {p.state}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <SkyIcon className="h-8 w-8 text-ink2" strokeWidth={1.4} aria-hidden />
            <div className="text-right">
              <div className="font-display text-[44px] leading-[0.85] tracking-[-0.03em] text-ink">{Math.round(fine.tempMax)}°</div>
              <div className="mt-1 text-xs text-muted">
                night <span className="text-ink2">{Math.round(fine.tempMin)}°</span>
              </div>
            </div>
          </div>
        </div>

        <Cell icon={CloudRain} label="Rain">
          <span className="font-display text-[28px] leading-none text-ink">{fine.rainfallMm}</span> <span className="text-xs text-muted">mm</span>
          <span className="block truncate text-xs text-muted">{sky.label}</span>
        </Cell>
        <Cell icon={SprayCan} label="Spray" tone={v.spray.tone} verdict={v.spray.verdict}>
          {sprayWindow.hours ? sprayWindow.label : 'No safe window'}
        </Cell>
        <Cell icon={Droplets} label="Water" tone={v.water.tone} verdict={v.water.verdict}>
          {irrigation.deficit > 0 ? `${irrigation.deficit} mm deficit` : 'Rain covers demand'}
        </Cell>
        <Cell icon={ShieldCheck} label={crop} tone={v.crop.tone} verdict={v.crop.verdict}>
          {pest.title.replace(/\s*\(.*\)$/, '') /* common name only; the Latin lives in the full plan */}
        </Cell>

        <a
          href="#village"
          className="group col-span-2 flex items-center justify-center gap-2 bg-btn px-6 py-4 text-sm font-semibold text-btn-ink transition-colors lg:col-span-1 lg:flex-col lg:py-0"
        >
          <span className="lg:max-w-[6rem] lg:text-center lg:leading-tight">Full forecast</span>
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
