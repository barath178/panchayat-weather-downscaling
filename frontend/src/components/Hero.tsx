'use client';

import React, { useState } from 'react';
import { LocateFixed, Loader2, Mountain, Grid3x3, CalendarDays, Languages } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import RegionSearch from './RegionSearch';
import ResolutionReveal from './ResolutionReveal';
import VillageConsole, { ConsoleData } from './VillageConsole';
import { getPosition, nearestRegion } from '@/lib/geo';

interface HeroProps {
  regions: PanchayatData[];
  onSelect: (id: string) => void;
  console: ConsoleData;
}

const EXAMPLES: [string, string][] = [
  ['Munnar tea', 'kerala_idukki_227'],
  ['Ooty', 'tamilnadu_thenilgiris_7'],
  ['Kotgarh apples', 'himachalpradeshjkuttarakhand_shimla_260'],
  ['Jaisalmer', 'rajasthan_jaisalmer_203'],
  ['Cauvery delta', 'tamilnadu_thanjavur_6'],
];

// Every figure is a property of the software you can count in the code, not a usage claim.
const FACTS: [React.ElementType, string, string][] = [
  [Mountain, '303', 'regions across India'],
  [Grid3x3, '225', '1.2 km cells per 18 km block'],
  [CalendarDays, '7-day', 'village outlook'],
  [Languages, '3', 'languages, read aloud'],
];

/** Overview: the pitch and the live product side by side, then the worked example. */
export default function Hero({ regions, onSelect, console: data }: HeroProps) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const locate = async () => {
    setLocating(true);
    setLocError(null);
    try {
      const pos = await getPosition();
      onSelect(nearestRegion(regions, pos.coords.latitude, pos.coords.longitude).region.id);
    } catch (e: any) {
      setLocError(e?.code === 1 ? 'Location permission was denied.' : 'Could not get your location.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <section id="overview" aria-labelledby="overview-title" className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 border-t border-line/[0.06]">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Pitch */}
        <div className="topo-bg card relative flex flex-col overflow-hidden p-6 sm:p-8 xl:col-span-7 xl:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 font-medium text-accent">MoES problem statement</span>
            <span className="rounded-md border border-line/[0.12] px-2.5 py-1 text-ink2">Block → Gram Panchayat downscaling</span>
          </div>

          <h1 id="overview-title" className="mt-6 max-w-[22ch] text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl">
            Weather advice for every Gram Panchayat, <span className="text-accent">at 1.2&nbsp;km.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink2">
            District forecasts give one number for an 18&nbsp;km square. AeroAgro recalculates it for 1.2&nbsp;km cells from elevation data, then tells each village when to
            spray, whether to irrigate and which crop disease to watch.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <RegionSearch regions={regions} onSelect={onSelect} size="lg" placeholder="Search a village, district or crop" />
            </div>
            <button onClick={locate} disabled={locating} className="btn-primary h-14 px-6">
              {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
              Use my location
            </button>
          </div>
          {locError && <p className="mt-2 text-sm text-alert">{locError}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-muted">Try</span>
            {EXAMPLES.map(([label, id]) => (
              <button key={id} onClick={() => onSelect(id)} aria-pressed={data.panchayat.id === id} className={`chip ${data.panchayat.id === id ? 'chip-on' : ''}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-10 flex-1" aria-hidden />
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-4" aria-label="Key facts">
            {FACTS.map(([Icon, v, k]) => (
              <li key={k} className="bg-surface/90 p-4">
                <Icon className="h-4 w-4 text-accent" aria-hidden />
                <div className="mt-3 text-2xl font-semibold tracking-tight text-ink tabular">{v}</div>
                <div className="mt-0.5 text-xs leading-snug text-muted">{k}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Live product */}
        <div className="xl:col-span-5">
          <VillageConsole {...data} />
        </div>
      </div>

      {/* Worked example */}
      <div className="card mt-5 p-5 sm:p-8">
        <ResolutionReveal />
      </div>
    </section>
  );
}
