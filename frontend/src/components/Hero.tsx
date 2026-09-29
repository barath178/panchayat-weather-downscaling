'use client';

import React, { useState } from 'react';
import { LocateFixed, Loader2, ArrowDownRight } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import RegionSearch from './RegionSearch';
import TodayMini, { TodayMiniProps } from './TodayMini';
import ResolutionReveal from './ResolutionReveal';
import { getPosition, nearestRegion } from '@/lib/geo';

interface HeroProps {
  regions: PanchayatData[];
  onSelect: (id: string) => void;
  /** the live map, shown directly under the header */
  map?: React.ReactNode;
  /** full-width strip under the console, e.g. the hazard scan */
  below?: React.ReactNode;
  /** the selected village, answered next to the map */
  today?: TodayMiniProps;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const EXAMPLES: [string, string][] = [
  ['Ooty', 'tamilnadu_thenilgiris_7'],
  ['Munnar', 'kerala_idukki_227'],
  ['Kotgarh apples', 'himachalpradeshjkuttarakhand_shimla_260'],
  ['Jaisalmer', 'rajasthan_jaisalmer_203'],
  ['Cauvery delta', 'tamilnadu_thanjavur_6'],
];

const STATS: [string, string, string][] = [
  ['303', 'regions', 'districts, metros and hill panchayats across India'],
  ['15×', 'sharper', '18 km forecast blocks resolved into 1.2 km cells'],
  ['3', 'languages', 'English, हिन्दी and தமிழ், read aloud for every farmer'],
  ['₹0', 'running cost', 'free, keyless open data; runs in any browser'],
];

// The pipeline in numbers: what goes in, what comes out, and the physics in between.
const SPEC: [string, string][] = [
  ['Input', 'NWP forecast · 11–25 km grid'],
  ['Output', '1.2 km cells · 15 × 15 per block'],
  ['Terrain', 'Copernicus GLO-90 DEM'],
  ['Physics', 'Lapse · cold-air pool · orographic'],
  ['Blend', 'Elevation-aware OI (gridpp)'],
  ['Refresh', 'Live · cached 30 min'],
];

export default function Hero({ regions, onSelect, map, below, today }: HeroProps) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const goTo = (id: string) => {
    onSelect(id);
  };

  const locate = async () => {
    setLocating(true);
    setLocError(null);
    try {
      const pos = await getPosition();
      goTo(nearestRegion(regions, pos.coords.latitude, pos.coords.longitude).region.id);
    } catch (e: any) {
      setLocError(e?.code === 1 ? 'Location permission was denied.' : 'Could not get your location.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <>
      {/* Console: search and spec on the left, the live map on the right, both on the first screen */}
      <section className="night relative border-b border-line/[0.08]" aria-label="Live map and search">
        <div className="pointer-events-none absolute inset-0 blueprint" aria-hidden />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:py-4">
          {/* Controls */}
          <div className="flex min-w-0 flex-col gap-3 scrollbar-none lg:h-[calc(100vh-130px)] lg:min-h-[560px] lg:overflow-y-auto">
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <span>MoES · Block → Panchayat</span>
                <span className="flex items-center gap-1.5 text-good">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" /> 303 regions
                </span>
              </div>
              <h1 className="mt-2 font-display text-[26px] leading-[1.05] tracking-[-0.01em] text-ink">
                Weather for your village, <em className="text-accent">not your district.</em>
              </h1>
              <p className="mt-1.5 text-[13px] leading-snug text-ink2">
                18 km forecasts re-computed at <span className="text-ink">1.2 km</span> from terrain, as spray, irrigation and crop-risk advice.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <RegionSearch regions={regions} onSelect={goTo} placeholder="Search village, district or crop" />
                </div>
                <button onClick={locate} disabled={locating} aria-label="Use my location" title="Use my location" className="btn-primary h-10 w-10 shrink-0 px-0">
                  {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                </button>
              </div>
              {locError && <p className="text-xs text-alert">{locError}</p>}
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 scrollbar-none">
                {EXAMPLES.map(([label, id]) => (
                  <button key={id} onClick={() => goTo(id)} className="chip shrink-0 whitespace-nowrap px-2.5 py-1 text-[11.5px]">
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {today && <TodayMini {...today} />}

            {/* Pipeline spec (desktop: on phones the map comes first) */}
            <div className="hidden rounded-card border border-line/[0.1] bg-surface/80 lg:block">
              <div className="flex items-center justify-between border-b border-line/[0.08] px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                <span>Pipeline spec</span>
                <span className="text-accent">v1.0</span>
              </div>
              <dl className="divide-y divide-line/[0.06] font-mono text-[11.5px]">
                {SPEC.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[76px_1fr] gap-3 px-4 py-2">
                    <dt className="uppercase tracking-[0.1em] text-muted">{k}</dt>
                    <dd className="text-ink2">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-line/[0.08] px-4 py-2.5 font-mono text-[11.5px] text-ink2">
                T<sub>1.2</sub> = T<sub>18</sub> − Γ·Δz + ΔT<sub>pool</sub> + ΔT<sub>slope</sub>
              </div>
            </div>

            <nav aria-label="Legal" className="mt-auto flex flex-wrap gap-x-4 gap-y-1 px-1 pb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
              <a href={`${BASE}/privacy/`} className="hover:text-ink">Privacy</a>
              <a href={`${BASE}/terms/`} className="hover:text-ink">Terms</a>
              <a href="https://github.com/barath178/panchayat-weather-downscaling" target="_blank" rel="noopener noreferrer" className="hover:text-ink">Source</a>
            </nav>
          </div>

          {/* Workspace: map and tabs */}
          <div className="min-w-0">{map}</div>
        </div>
      </section>

    </>
  );
}
