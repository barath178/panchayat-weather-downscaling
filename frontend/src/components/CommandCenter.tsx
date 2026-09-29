'use client';

import React, { useMemo, useState } from 'react';
import { Bug, Droplets, SprayCan, Send, Copy, Check, MapPin } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { DownscaleDetail, PestRisk, SprayWindow, WeatherMetrics } from '@/lib/microclimate';
import { haversineKm } from '@/lib/geo';
import { verdicts, TONE } from './ActionPlan';

interface Props {
  regions: PanchayatData[];
  panchayat: PanchayatData;
  coarse: WeatherMetrics;
  fine: WeatherMetrics;
  detail: DownscaleDetail;
  coarseElevationM: number;
  sprayWindow: SprayWindow;
  irrigation: { action: string; detail: string; deficit: number };
  pest: PestRisk;
  et0: number;
  crop: string;
  advisoryText: string;
  onSelect: (id: string) => void;
  /** the live map, rendered in the centre column */
  map: React.ReactNode;
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const sgn = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(r1(n))}`;

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-line/[0.08] bg-surface p-4 ${className}`}>
      <h3 className="kicker mb-3">{title}</h3>
      {children}
    </section>
  );
}

/** Block value next to panchayat value, the panchayat side highlighted. */
function Pair({ label, block, village }: { label: string; block: string; village: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg border border-line/[0.08] bg-surface2/60 px-3 py-2">
        <div className="text-[10.5px] text-muted">Block {label}</div>
        <div className="mt-0.5 text-sm font-semibold text-ink2 tabular">{block}</div>
      </div>
      <div className="rounded-lg border border-accent/30 bg-accent/[0.07] px-3 py-2">
        <div className="text-[10.5px] text-accent/80">Panchayat {label}</div>
        <div className="mt-0.5 text-sm font-semibold text-accent tabular">{village}</div>
      </div>
    </div>
  );
}

/**
 * First-screen command centre: block-vs-panchayat numbers and the equation on the left,
 * the live map in the middle, risks and the WhatsApp dispatcher on the right.
 */
export default function CommandCenter(props: Props) {
  const { regions, panchayat: p, coarse, fine, detail, coarseElevationM, sprayWindow, irrigation, pest, et0, crop, advisoryText, onSelect, map } = props;
  const [copied, setCopied] = useState(false);
  const v = verdicts(sprayWindow, irrigation, pest);

  // Nearby panchayats in the same state, nearest first
  const nearby = useMemo(
    () =>
      regions
        .filter((r) => r.state === p.state)
        .map((r) => ({ r, km: haversineKm(p.lat, p.lng, r.lat, r.lng) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, 8),
    [regions, p]
  );

  const tSum = detail.tmin.reduce((s, x) => s + x.value, 0);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(advisoryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  const risks = [
    { icon: Bug, title: pest.title.replace(/\s*\(.*\)$/, ''), tag: v.crop.verdict, tone: v.crop.tone, body: pest.detail },
    { icon: Droplets, title: 'Irrigation', tag: v.water.verdict, tone: v.water.tone, body: `${irrigation.detail} Crop water demand (ET₀): ${et0} mm/day.` },
    {
      icon: SprayCan,
      title: 'Spray window',
      tag: v.spray.verdict,
      tone: v.spray.tone,
      body: sprayWindow.hours ? `Safe to spray ${sprayWindow.label} (${sprayWindow.hours} h): wind below 15 km/h and no rain within 2 h.` : 'No safe hour today. Hold all sprays.',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 xl:h-[calc(100vh-7rem)] xl:min-h-[640px] xl:grid-cols-[300px_minmax(0,1fr)_320px]">
      {/* Left: the numbers */}
      <div className="flex min-h-0 flex-col gap-4 xl:overflow-y-auto xl:pr-1">
        <Panel title="Block 18 km vs panchayat 1.2 km">
          <div className="space-y-2">
            <Pair label="rain" block={`${r1(coarse.rainfallMm)} mm`} village={`${r1(fine.rainfallMm)} mm`} />
            <Pair label="temp" block={`${r1(coarse.tempMin)}–${r1(coarse.tempMax)} °C`} village={`${r1(fine.tempMin)}–${r1(fine.tempMax)} °C`} />
            <Pair label="wind / RH" block={`${r1(coarse.windSpeedKmh)} km/h · ${coarse.relativeHumidity}%`} village={`${r1(fine.windSpeedKmh)} km/h · ${fine.relativeHumidity}%`} />
          </div>
        </Panel>

        <Panel title="Downscaling equation · night low">
          <div className="rounded-lg border border-line/[0.08] bg-bg/60 p-3 font-mono text-[11.5px] leading-relaxed text-ink2">
            <div>
              T<sub>1.2</sub> = T<sub>18</sub> + Σ ΔT<sub>i</sub>
            </div>
            <div>
              = {r1(coarse.tempMin)} {detail.tmin.map((s) => sgn(s.value)).join(' ')}
            </div>
            <div className="font-semibold text-accent">
              = {r1(coarse.tempMin + tSum)} °C
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {detail.tmin.map((s) => (
              <li key={s.label} className="flex justify-between gap-3">
                <span className="text-ink2">{s.label}</span>
                <span className={`font-mono ${s.value < 0 ? 'text-frost' : s.value > 0 ? 'text-sun' : 'text-muted'}`}>{sgn(s.value)} °C</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[10.5px]">
            <span className="rounded-md bg-surface2 px-2 py-1 text-ink2">Δz {sgn(p.elevationM - coarseElevationM)} m</span>
            <span className="rounded-md bg-surface2 px-2 py-1 text-ink2">Slope {p.slopeDeg}°</span>
            <span className="rounded-md bg-surface2 px-2 py-1 text-ink2">DEM Copernicus GLO-90</span>
          </div>
        </Panel>

        <Panel title={`Panchayats near ${p.district} (${nearby.length})`} className="xl:flex-1">
          <ul className="space-y-1.5">
            {nearby.map(({ r, km }) => {
              const on = r.id === p.id;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => onSelect(r.id)}
                    aria-pressed={on}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                      on ? 'border-accent/40 bg-accent/[0.08]' : 'border-line/[0.08] hover:bg-surface2'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className={`block truncate text-[13px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{r.name}</span>
                      <span className="block truncate text-[11px] text-muted">
                        {r.elevationM.toLocaleString('en-IN')} m · {r.terrainType}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10.5px] text-muted">{on ? <MapPin className="h-3.5 w-3.5 text-accent" /> : `${Math.round(km)} km`}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Centre: the map */}
      <div className="min-h-0">{map}</div>

      {/* Right: decisions and delivery */}
      <div className="flex min-h-0 flex-col gap-4 xl:overflow-y-auto xl:pl-1">
        {risks.map(({ icon: I, title, tag, tone, body }) => {
          const t = TONE[tone];
          return (
            <section key={title} className="rounded-xl border border-line/[0.08] bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <I className="h-4 w-4 text-muted" /> {title}
                </h3>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${t.bg} ${t.text}`}>{tag}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink2">{body}</p>
            </section>
          );
        })}

        <section className="flex flex-col rounded-xl border border-good/25 bg-good/[0.05] p-4 xl:flex-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Send className="h-4 w-4 text-good" /> Village WhatsApp dispatcher
          </h3>
          <p className="mt-1 text-[11px] text-muted">
            {crop} · {p.name}
          </p>
          <pre className="mt-3 max-h-64 flex-1 overflow-y-auto whitespace-pre-wrap rounded-lg border border-line/[0.08] bg-bg/70 p-3 font-sans text-[11.5px] leading-relaxed text-ink2">
            {advisoryText}
          </pre>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={copy} className="btn-ghost h-9 px-3 text-xs">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(advisoryText)}`} target="_blank" rel="noopener noreferrer" className="btn-primary h-9 px-3 text-xs">
              <Send className="h-4 w-4" /> Send to village
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
