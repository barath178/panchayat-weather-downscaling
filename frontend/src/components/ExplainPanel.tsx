'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import { DownscaleDetail, Step, WeatherMetrics, terrainClass } from '@/lib/microclimate';

interface Props {
  panchayat: PanchayatData;
  coarse: WeatherMetrics;
  detail: DownscaleDetail;
  coarseElevationM: number;
  isLive: boolean;
}

type Var = 'tmin' | 'tmax' | 'rain' | 'wind';

const VARS: { id: Var; label: string; unit: string; key: keyof WeatherMetrics; additive: boolean; up: string; down: string }[] = [
  { id: 'tmin', label: 'Night low', unit: '°C', key: 'tempMin', additive: true, up: '#F6B94C', down: '#7DC4FF' },
  { id: 'tmax', label: 'Day high', unit: '°C', key: 'tempMax', additive: true, up: '#F6B94C', down: '#7DC4FF' },
  { id: 'rain', label: 'Rain', unit: 'mm', key: 'rainfallMm', additive: false, up: '#7DC4FF', down: '#F6B94C' },
  { id: 'wind', label: 'Wind', unit: 'km/h', key: 'windSpeedKmh', additive: false, up: '#FF7A66', down: '#7DC4FF' },
];

interface Row {
  label: string;
  why: string;
  eq?: string;
  from: number;
  to: number;
  kind: 'start' | 'step' | 'end';
}

/** Turn the engine's recorded steps into waterfall rows (multiplicative steps become running deltas). */
function buildRows(steps: Step[], start: number, end: number, additive: boolean): Row[] {
  const rows: Row[] = [{ label: 'Block forecast · 18 km', why: 'What the district model says for the whole block', eq: 'NWP grid-cell mean (elevation = nan)', from: start, to: start, kind: 'start' }];
  let v = start;
  for (const s of steps) {
    const next = additive ? v + s.value : v * s.value;
    rows.push({ label: s.label, why: s.why, eq: s.eq, from: v, to: next, kind: 'step' });
    v = next;
  }
  if (Math.abs(end - v) > 0.15) {
    rows.push({ label: 'Physical limit', why: 'Kept inside realistic bounds', eq: 'clamp(f, 0.3, 2.0)', from: v, to: end, kind: 'step' });
  }
  rows.push({ label: 'Your village · 1.2 km', why: 'Terrain-aware forecast', eq: additive ? 'T = T₀ + ΣΔT' : 'X = X₀ · Πf', from: end, to: end, kind: 'end' });
  return rows;
}

const FLAG_LABEL: Record<string, string> = {
  urban: 'Urban fabric',
  himalayan: 'High altitude',
  arid: 'Arid',
  rainShadow: 'Rain shadow',
  coastal: 'Coastal',
  windGap: 'Wind gap',
  ridge: 'Ridge',
  valley: 'Valley',
  windward: 'Windward slope',
};

const f1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
const signed = (n: number) => `${n >= 0 ? '+' : '−'}${f1(Math.abs(n))}`;

export default function ExplainPanel({ panchayat: p, coarse, detail, coarseElevationM, isLive }: Props) {
  const [v, setV] = useState<Var>('tmin');
  const [shown, setShown] = useState(false);
  const meta = VARS.find((x) => x.id === v)!;

  useEffect(() => {
    setShown(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, [v, p.id]);

  const start = coarse[meta.key];
  const end = detail.metrics[meta.key];
  const rows = useMemo(() => buildRows(detail[v], start, end, meta.additive), [detail, v, start, end, meta.additive]);

  // x-domain over every running value
  const all = rows.flatMap((r) => [r.from, r.to]);
  let lo = Math.min(...all), hi = Math.max(...all);
  if (meta.additive) {
    const pad = Math.max(0.6, (hi - lo) * 0.25);
    lo -= pad;
    hi += pad;
  } else {
    lo = 0;
    hi = Math.max(hi * 1.1, 1);
  }
  const x = (n: number) => ((n - lo) / (hi - lo || 1)) * 100;

  // Plain-language reasoning
  const deltas = rows.filter((r) => r.kind === 'step').map((r) => ({ ...r, d: r.to - r.from }));
  const ranked = [...deltas].sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  const total = end - start;
  const word = meta.additive ? (total < 0 ? 'cooler' : 'warmer') : total < 0 ? 'less' : 'more';
  const lead = ranked[0];
  const counter = ranked.find((r) => lead && Math.sign(r.d) !== Math.sign(lead.d) && Math.abs(r.d) >= 0.1);

  const t = terrainClass(p);
  const flags = Object.entries(t).filter(([, on]) => on).map(([k]) => FLAG_LABEL[k] ?? k);
  const magnitude = Math.abs(detail.tmin.reduce((s, x) => s + x.value, 0)) + Math.abs(detail.tmax.reduce((s, x) => s + x.value, 0));
  const confidence = !isLive ? 'Medium' : magnitude > 6 ? 'Medium' : 'High';

  return (
    <section className="card hud flex h-full flex-col p-5 sm:p-6" aria-labelledby="explain-title">
      <div className="eyebrow flex items-center gap-1.5">
        <BrainCircuit className="h-3.5 w-3.5 text-accent" /> Fig 2.2 · Explainable AI
      </div>
      <h2 id="explain-title" className="mt-1 font-display text-2xl text-ink">
        Why your village differs
      </h2>

      <div className="seg mt-4 self-start" role="tablist" aria-label="Variable">
        {VARS.map((o) => (
          <button key={o.id} role="tab" aria-selected={v === o.id} onClick={() => setV(o.id)} className={`seg-btn ${v === o.id ? 'seg-on' : ''}`}>
            {o.label}
          </button>
        ))}
      </div>

      {/* Reasoning */}
      <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/[0.06] p-4 text-sm leading-relaxed text-ink2">
        {Math.abs(total) < 0.05 || !lead ? (
          <>
            <strong className="text-ink">No correction needed.</strong>{' '}
            {!meta.additive && start < 0.05 ? `The block forecast has no ${meta.label.toLowerCase()} to redistribute today.` : `Terrain here matches the block average for ${meta.label.toLowerCase()}.`}
          </>
        ) : (
          <>
            <strong className="text-ink">
              {p.name}: {f1(Math.abs(total))} {meta.unit} {word}
            </strong>{' '}
            than the district forecast. The biggest factor is <span className="text-ink">{lead.label.toLowerCase()}</span> ({signed(lead.d)} {meta.unit})
            {counter ? (
              <>
                , partly offset by <span className="text-ink">{counter.label.toLowerCase()}</span> ({signed(counter.d)} {meta.unit})
              </>
            ) : null}
            .
          </>
        )}
      </div>

      {/* Waterfall */}
      <ol className="mt-5 flex flex-col gap-2.5" aria-label={`${meta.label} adjustment steps`}>
        {rows.map((r, i) => {
          const isStep = r.kind === 'step';
          const d = r.to - r.from;
          const a = x(Math.min(r.from, r.to));
          const b = x(Math.max(r.from, r.to));
          const barLeft = isStep ? a : meta.additive ? 0 : 0;
          const barWidth = isStep ? Math.max(0.8, b - a) : x(r.to);
          const color = r.kind === 'start' ? '#F6B94C' : r.kind === 'end' ? '#C8F169' : d >= 0 ? meta.up : meta.down;
          return (
            <li key={`${v}-${i}`} className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)_64px] items-center gap-3 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)_72px]">
              <div className="min-w-0">
                <div className={`truncate text-sm ${isStep ? 'text-ink2' : 'font-semibold text-ink'}`} title={r.why}>
                  {r.label}
                </div>
                <div className="truncate font-mono text-[10px] text-muted" title={r.eq ?? r.why}>
                  {r.eq ?? r.why}
                </div>
              </div>
              <div className="relative h-7 rounded-md bg-surface2">
                {isStep && <span className="absolute inset-y-0 w-px border-l border-dashed border-line/25" style={{ left: `${x(r.from)}%` }} />}
                <span
                  className="absolute inset-y-1 rounded-[5px] transition-all duration-700 ease-out"
                  style={{
                    left: `${barLeft}%`,
                    width: shown ? `${barWidth}%` : '0%',
                    background: isStep ? color : `linear-gradient(90deg, ${color}33, ${color})`,
                    transitionDelay: `${i * 70}ms`,
                    boxShadow: r.kind === 'end' ? '0 0 18px -2px rgb(200 241 105 / 0.55)' : undefined,
                  }}
                />
              </div>
              <div className={`text-right font-mono text-sm tabular ${r.kind === 'end' ? 'text-accent' : r.kind === 'start' ? 'text-sun' : 'text-ink2'}`}>
                {isStep ? `${signed(d)}` : f1(r.to)}
              </div>
            </li>
          );
        })}
      </ol>

      {/* All four variables at a glance */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VARS.map((o) => {
          const c = coarse[o.key];
          const f = detail.metrics[o.key];
          const d = f - c;
          const flat = Math.abs(d) < 0.05;
          return (
            <button
              key={o.id}
              onClick={() => setV(o.id)}
              aria-pressed={v === o.id}
              className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${v === o.id ? 'border-accent/50 bg-accent/[0.06]' : 'border-line/[0.07] hover:border-line/20'}`}
            >
              <div className="text-[11px] text-muted">{o.label}</div>
              <div className="mt-0.5 font-mono text-xs text-ink2 tabular">
                {f1(c)} → <span className="font-semibold text-ink">{f1(f)}</span>
              </div>
              <div className="text-[11px] font-semibold tabular" style={{ color: flat ? undefined : d > 0 ? o.up : o.down }}>
                {flat ? 'no change' : `${signed(d)} ${o.unit}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      {/* The whole model for this variable, numbers substituted */}
      <div className="mt-4 rounded-lg border border-line/[0.08] bg-bg/50 p-4 font-mono text-[12px] leading-6 text-ink2">
        <div className="mono-label mb-1.5 flex items-center justify-between">
          <span>Model · {meta.label}</span>
          <span className="text-accent">Δx 18 → 1.2 km</span>
        </div>
        {meta.additive ? (
          <>
            <div>
              T<sub>1.2</sub> = T<sub>18</sub> + Σ ΔT<sub>i</sub>
            </div>
            <div className="pl-6">
              = {f1(start)} {deltas.length ? deltas.map((r) => ` ${r.d < 0 ? '−' : '+'} ${f1(Math.abs(r.d))}`).join('') : '+ 0.0'}
            </div>
          </>
        ) : (
          <>
            <div>
              X<sub>1.2</sub> = X<sub>18</sub> · Π f<sub>i</sub>
            </div>
            <div className="pl-6">
              = {f1(start)} × {(start > 0.05 ? end / start : detail[v].reduce((m, s) => m * s.value, 1)).toFixed(3)}
            </div>
          </>
        )}
        <div className="pl-6 text-ink">
          = <strong className="text-accent">{f1(end)}</strong> {meta.unit}
        </div>
        <div className="mt-2 border-t border-line/[0.08] pt-2 text-[10.5px] text-muted">
          Γd 5.0 K/km (day) · Γn 6.5 / 4.5 K/km (night, warm / cold season) · Δz {detail.dz >= 0 ? '+' : '−'}
          {Math.abs(Math.round(detail.dz))} m
        </div>
      </div>

      <div className="min-h-5 flex-1" aria-hidden />
      <div className="border-t border-line/[0.07] pt-4">
        <div className="text-xs text-muted">Terrain inputs the model used</div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-surface2 px-2.5 py-1 text-ink2">
            Height {p.elevationM} m <ArrowRight className="inline h-3 w-3" /> block {Math.round(coarseElevationM)} m
          </span>
          <span className="rounded-full bg-surface2 px-2.5 py-1 text-ink2">Slope {p.slopeDeg}°</span>
          <span className="rounded-full bg-surface2 px-2.5 py-1 text-ink2">Drainage index {p.drainageAccumulation}</span>
          {flags.map((f) => (
            <span key={f} className="rounded-full bg-surface2 px-2.5 py-1 capitalize text-ink2">
              {f}
            </span>
          ))}
          <span className={`rounded-full px-2.5 py-1 font-semibold ${confidence === 'High' ? 'bg-good/15 text-good' : 'bg-warn/15 text-warn'}`}>{confidence} confidence</span>
        </div>
      </div>
    </section>
  );
}
