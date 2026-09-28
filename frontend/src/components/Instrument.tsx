'use client';

// "Field instrument" primitives: numbered section heads, scale bars, north arrows and the
// telemetry strip. Shared by the dashboard and mirrored 1:1 in the Figma plugin (design/figma-plugin).

import React from 'react';

/** 01 ── LIVE DASHBOARD ─────────────── meta */
export function SectionHead({
  index,
  kicker,
  title,
  meta,
  id,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em]">
        <span className="rounded bg-accent px-1.5 py-0.5 font-semibold text-accent-ink">{index}</span>
        <span className="text-ink2">{kicker}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-line/20 to-line/[0.03]" aria-hidden />
        {meta && <span className="hidden text-muted md:inline">{meta}</span>}
      </div>
      <h2 id={id} className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/** Alternating black/white scale bar, e.g. 0 ── 6 km */
export function ScaleBar({ km, widthPct, className = '' }: { km: number; widthPct: number; className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: `${widthPct}%` }}>
      <div className="flex h-1.5 overflow-hidden rounded-[1px] border border-white/70">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`flex-1 ${i % 2 ? 'bg-white/85' : 'bg-black/60'}`} />
        ))}
      </div>
      <div className="mt-0.5 flex justify-between font-mono text-[9px] leading-none text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        <span>0</span>
        <span>{km} km</span>
      </div>
    </div>
  );
}

export function NorthArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 28" className={`pointer-events-none h-7 w-5 drop-shadow ${className}`} aria-label="North">
      <path d="M10 2 L16 18 L10 14.5 L4 18 Z" fill="rgba(255,255,255,0.9)" />
      <path d="M10 2 L10 14.5 L4 18 Z" fill="rgba(0,0,0,0.35)" />
      <text x="10" y="27" textAnchor="middle" fontSize="7.5" fontFamily="ui-monospace, monospace" fill="rgba(255,255,255,0.9)">
        N
      </text>
    </svg>
  );
}

export interface Telemetry {
  status: 'live' | 'loading' | 'offline' | 'scenario';
  source: string;
  updated: string | null;
  lat: number;
  lng: number;
  elevationM: number;
  cellElevationM: number;
  dem: 'dem' | 'synthetic' | 'loading';
  regions: number;
}

const STATUS: Record<Telemetry['status'], [string, string]> = {
  live: ['LIVE', 'bg-good'],
  loading: ['SYNC', 'bg-warn animate-pulse'],
  offline: ['OFFLINE', 'bg-alert'],
  scenario: ['SIM', 'bg-sky'],
};

/** One-line system readout under the header: data source, run time, grid, DEM and position. */
export function TelemetryStrip({ t }: { t: Telemetry }) {
  const [label, dot] = STATUS[t.status];
  const dz = t.elevationM - t.cellElevationM;
  const items: [string, string][] = [
    ['NWP', t.source],
    ['UPDATED', t.updated ?? '—'],
    ['POS', `${t.lat.toFixed(3)}°N ${t.lng.toFixed(3)}°E`],
    ['ELEV', `${t.elevationM.toLocaleString('en-IN')} m a.s.l.`],
    ['NWP CELL', `${Math.round(t.cellElevationM).toLocaleString('en-IN')} m`],
    ['Δz', `${dz >= 0 ? '+' : '−'}${Math.abs(Math.round(dz))} m`],
    ['DEM', t.dem === 'dem' ? 'GLO-90 · 225 × 1.2 km' : t.dem === 'loading' ? 'loading…' : 'offline model'],
    ['GRID', '18 km → 1.2 km'],
    ['REGIONS', String(t.regions)],
  ];
  return (
    <div className="border-b border-line/[0.07] bg-surface/60">
      <div className="mx-auto flex max-w-[1400px] items-center gap-5 overflow-x-auto whitespace-nowrap px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] scrollbar-none sm:px-8">
        <span className="flex items-center gap-1.5 font-semibold text-ink">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
        </span>
        {items.map(([k, v]) => (
          <span key={k} className="text-muted">
            {k} <span className="text-ink2">{v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
