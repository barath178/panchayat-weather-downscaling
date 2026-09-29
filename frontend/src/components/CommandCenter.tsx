'use client';

import React, { useMemo, useState } from 'react';
import { Bug, Droplets, SprayCan, Send, Copy, Check, ArrowRight } from 'lucide-react';
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

/** One quiet surface. Structure comes from spacing and type, not from nested borders. */
function Card({ title, aside, children, className = '' }: { title: string; aside?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-5 ${className}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {aside && <span className="text-xs text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

/**
 * First-screen command centre: what changed and why on the left, the map in the middle,
 * what to do and how to tell the village on the right.
 */
export default function CommandCenter(props: Props) {
  const { regions, panchayat: p, coarse, fine, detail, coarseElevationM, sprayWindow, irrigation, pest, et0, crop, advisoryText, onSelect, map } = props;
  const [copied, setCopied] = useState(false);
  const v = verdicts(sprayWindow, irrigation, pest);

  const nearby = useMemo(
    () =>
      regions
        .filter((r) => r.state === p.state && r.id !== p.id)
        .map((r) => ({ r, km: haversineKm(p.lat, p.lng, r.lat, r.lng) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, 6),
    [regions, p]
  );

  const rows = [
    { k: 'Night low', c: coarse.tempMin, f: fine.tempMin, u: '°C' },
    { k: 'Day high', c: coarse.tempMax, f: fine.tempMax, u: '°C' },
    { k: 'Rain', c: coarse.rainfallMm, f: fine.rainfallMm, u: 'mm' },
    { k: 'Wind', c: coarse.windSpeedKmh, f: fine.windSpeedKmh, u: 'km/h' },
  ];

  const actions = [
    { icon: SprayCan, title: 'Spray', ...v.spray, body: sprayWindow.hours ? `${sprayWindow.label}, wind under 15 km/h` : 'No safe hour today' },
    { icon: Droplets, title: 'Irrigation', ...v.water, body: `${irrigation.deficit > 0 ? `${irrigation.deficit} mm short` : 'Rain covers demand'} · ET₀ ${et0} mm` },
    { icon: Bug, title: crop, ...v.crop, body: pest.title.replace(/\s*\(.*\)$/, '') },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(advisoryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:h-[calc(100vh-7.5rem)] xl:min-h-[660px] xl:grid-cols-[300px_minmax(0,1fr)_320px]">
      {/* Left: what the 1.2 km grid changed, and why */}
      <div className="flex min-h-0 flex-col gap-5 xl:overflow-y-auto scrollbar-none">
        <Card title="District vs village" aside="18 km → 1.2 km">
          <ul className="space-y-3.5">
            {rows.map(({ k, c, f, u }) => {
              const d = r1(f - c);
              return (
                <li key={k} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink2">{k}</span>
                  <span className="flex items-baseline gap-2 tabular">
                    <span className="text-xs text-muted line-through decoration-muted/40">{r1(c)}</span>
                    <span className="text-base font-semibold text-ink">
                      {r1(f)}
                      <span className="ml-0.5 text-xs font-normal text-muted">{u}</span>
                    </span>
                    <span className={`w-10 text-right text-xs font-medium ${d === 0 ? 'text-muted' : 'text-accent'}`}>{d === 0 ? '0' : sgn(d)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title={fine.tempMin <= coarse.tempMin ? 'Why the night is colder here' : 'Why the night is warmer here'}>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">District forecast</span>
              <span className="font-medium text-ink2 tabular">{r1(coarse.tempMin)} °C</span>
            </li>
            {detail.tmin.map((s) => (
              <li key={s.label} className="flex justify-between">
                <span className="text-muted">{s.label}</span>
                <span className="font-medium text-ink2 tabular">{sgn(s.value)} °C</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-line/[0.06] pt-2">
              <span className="font-medium text-ink">Village</span>
              <span className="font-semibold text-accent tabular">{r1(fine.tempMin)} °C</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted">
            {sgn(p.elevationM - coarseElevationM)} m above the forecast cell · slope {p.slopeDeg}°
          </p>
        </Card>

        <Card title="Nearby" aside={p.district} className="xl:flex-1">
          <ul className="-mx-2">
            {nearby.map(({ r, km }) => (
              <li key={r.id}>
                <button onClick={() => onSelect(r.id)} className="group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ink">{r.name}</span>
                    <span className="block text-xs text-muted">{r.elevationM.toLocaleString('en-IN')} m</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                    {Math.round(km)} km <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Centre */}
      <div className="min-h-0">{map}</div>

      {/* Right: what to do, and telling the village */}
      <div className="flex min-h-0 flex-col gap-5 xl:overflow-y-auto scrollbar-none">
        <Card title="Today's actions" aside={p.name}>
          <ul className="space-y-4">
            {actions.map(({ icon: I, title, tone, verdict, body }) => (
              <li key={title} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface2 text-ink2">
                  <I className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-ink">{title}</span>
                    <span className={`shrink-0 text-xs font-semibold ${TONE[tone].text}`}>{verdict}</span>
                  </span>
                  <span className="block truncate text-xs text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Send to the village" aside="WhatsApp" className="flex flex-col xl:flex-1">
          <div className="relative flex-1 overflow-hidden rounded-xl bg-bg/70 p-4">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink2">{advisoryText.replace(/[*_]/g, '')}</pre>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg/90 to-transparent" aria-hidden />
          </div>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
            <button onClick={copy} aria-label="Copy advisory" className="btn-ghost h-10 w-10 px-0">
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(advisoryText)}`} target="_blank" rel="noopener noreferrer" className="btn-primary h-10">
              <Send className="h-4 w-4" /> Send advisory
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
