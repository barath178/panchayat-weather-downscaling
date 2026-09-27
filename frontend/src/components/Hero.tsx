'use client';

import React, { useState } from 'react';
import { LocateFixed, Loader2, ArrowDown } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import RegionSearch from './RegionSearch';
import ResolutionReveal from './ResolutionReveal';
import { getPosition, nearestRegion } from '@/lib/geo';

interface HeroProps {
  regions: PanchayatData[];
  onSelect: (id: string) => void;
}

const EXAMPLES: [string, string][] = [
  ['Ooty', 'tamilnadu_thenilgiris_7'],
  ['Munnar', 'kerala_idukki_227'],
  ['Kotgarh apples', 'himachalpradeshjkuttarakhand_shimla_260'],
  ['Jaisalmer', 'rajasthan_jaisalmer_203'],
  ['Cauvery delta', 'tamilnadu_thanjavur_6'],
];

const STATS: [string, string][] = [
  ['303', 'districts & metros'],
  ['225×', 'finer than an 18 km grid'],
  ['3', 'languages, with voice'],
  ['₹0', 'data cost · open APIs'],
];

export default function Hero({ regions, onSelect }: HeroProps) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const goTo = (id: string) => {
    onSelect(id);
    requestAnimationFrame(() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
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
    <section className="topo-bg">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pb-14 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live microclimate forecasts for Indian farms
          </span>

          <h1 className="mt-5 font-display text-[40px] font-medium leading-[1.05] tracking-tight text-ink text-balance sm:text-6xl lg:text-[68px]">
            Weather for your village, <em className="font-normal italic text-accent">not your district.</em>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink2 sm:text-lg">
            AeroAgro sharpens 18 km forecasts into 1.2 km microclimates using terrain physics, then tells each farmer exactly
            when to spray, water and protect their crop.
          </p>

          <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <RegionSearch regions={regions} onSelect={goTo} size="lg" placeholder="Find your village, district or crop" />
            </div>
            <button onClick={locate} disabled={locating} className="btn-ghost h-14 rounded-2xl px-5">
              {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
              Use my location
            </button>
          </div>
          {locError && <p className="mt-2 text-sm text-alert">{locError}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Try</span>
            {EXAMPLES.map(([label, id]) => (
              <button key={id} onClick={() => goTo(id)} className="chip">
                {label}
              </button>
            ))}
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line/10 pt-6 sm:grid-cols-4">
            {STATS.map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl text-ink">{v}</dd>
                <dd className="mt-0.5 text-xs leading-snug text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <ResolutionReveal />
        </div>
      </div>

      <div className="flex justify-center pb-6">
        <a href="#dashboard" className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          Open the live dashboard <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
