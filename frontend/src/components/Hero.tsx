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

export default function Hero({ regions, onSelect }: HeroProps) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const goTo = (id: string) => {
    onSelect(id);
    requestAnimationFrame(() => document.getElementById('village')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
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
      {/* Poster */}
      <section className="grain topo-bg overflow-hidden">
        <div className="mx-auto max-w-[1320px] px-5 pb-16 pt-12 sm:px-8 lg:pb-24 lg:pt-20">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted animate-rise">
            <span>MoES · Block → Panchayat downscaling</span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-good animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-good" />
              </span>
              Live for 303 regions
            </span>
          </div>

          <h1 className="mt-10 font-display text-[clamp(52px,9vw,128px)] leading-[0.9] tracking-[-0.025em] text-ink animate-rise [animation-delay:80ms]">
            Weather for your village,<br className="hidden md:block" /> <em className="marker">not your district.</em>
          </h1>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-ink2 animate-rise [animation-delay:160ms] lg:col-span-5 sm:text-xl">
              AeroAgro takes the 18 km forecast every district receives and re-draws it at <span className="text-ink">1.2 km</span> from real terrain, then tells each
              farmer exactly when to spray, water and protect their crop.
            </p>

            <div className="animate-rise [animation-delay:240ms] lg:col-span-6 lg:col-start-7">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <RegionSearch regions={regions} onSelect={goTo} size="lg" placeholder="Find your village, district or crop" />
                </div>
                <button onClick={locate} disabled={locating} className="btn-primary h-14 px-6">
                  {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
                  Use my location
                </button>
              </div>
              {locError && <p className="mt-2 text-sm text-alert">{locError}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Try</span>
                {EXAMPLES.map(([label, id]) => (
                  <button key={id} onClick={() => goTo(id)} className="chip">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
