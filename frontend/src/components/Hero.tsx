'use client';

import React, { useState } from 'react';
import { LocateFixed, Loader2, ArrowDownRight } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import RegionSearch from './RegionSearch';
import ResolutionReveal from './ResolutionReveal';
import { getPosition, nearestRegion } from '@/lib/geo';

interface HeroProps {
  regions: PanchayatData[];
  onSelect: (id: string) => void;
  /** the live map, shown directly under the header */
  map?: React.ReactNode;
  /** full-width strip under the console, e.g. the hazard scan */
  below?: React.ReactNode;
}

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

export default function Hero({ regions, onSelect, map, below }: HeroProps) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const goTo = (id: string) => {
    onSelect(id);
    requestAnimationFrame(() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
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
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:py-6">
          {/* Controls */}
          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                <span>MoES · Block → Panchayat</span>
                <span className="flex items-center gap-1.5 text-good">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" /> 303 regions
                </span>
              </div>
              <h1 className="mt-3 font-display text-[40px] leading-[0.95] tracking-[-0.02em] text-ink">
                Weather for your village, <em className="text-accent">not your district.</em>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink2">
                18 km forecasts re-computed on a <span className="text-ink">1.2 km</span> terrain grid, turned into spray, irrigation and crop-risk advice for each village.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <RegionSearch regions={regions} onSelect={goTo} size="lg" placeholder="Find your village, district or crop" />
              <button onClick={locate} disabled={locating} className="btn-primary h-12">
                {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
                Use my location
              </button>
              {locError && <p className="text-sm text-alert">{locError}</p>}
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map(([label, id]) => (
                  <button key={id} onClick={() => goTo(id)} className="chip">
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline spec */}
            <div className="rounded-card border border-line/[0.1] bg-surface/80">
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
          </div>

          {/* Live map */}
          <div className="min-w-0">{map}</div>
        </div>
      </section>

      {below}

      {/* Figure band */}
      <section className="night relative overflow-hidden" aria-label="Resolution comparison">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_0%,rgb(212_242_90/0.08),transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
          <ResolutionReveal />
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-line/[0.14]">
        <dl className="mx-auto grid max-w-[1320px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {STATS.map(([v, k, d], i) => (
            <div key={k} className={`py-10 pr-6 ${i ? 'lg:border-l lg:border-line/[0.14] lg:pl-8' : ''} ${i % 2 ? 'border-l border-line/[0.14] pl-6 lg:pl-8' : ''}`}>
              <dt className="sr-only">{k}</dt>
              <dd className="font-display text-6xl leading-none text-ink sm:text-7xl">{v}</dd>
              <dd className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">{k}</dd>
              <dd className="mt-1 max-w-[26ch] text-sm leading-relaxed text-muted">{d}</dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-center pb-8">
          <a href="#village" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink">
            Open your village <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>
    </>
  );
}
