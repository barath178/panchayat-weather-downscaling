'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Grid3x3, Square, Loader2, MapPinned, Mountain, Thermometer, Sparkles } from 'lucide-react';
import type { PanchayatData } from '@/data/all_india_regions';
import { BlockField, GRID_RISK, GRID_VARS, GridVar, fieldStats } from '@/lib/blockGrid';
import { NorthArrow, ScaleBar } from './Instrument';

interface Props {
  panchayat: PanchayatData;
  field: BlockField | null;
  onShowOnMap: (v: GridVar) => void;
}

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const RAMPS: Record<GridVar, RGB[]> = {
  tempMin: ['#1d4f9a', '#3a86d8', '#8fc2f0', '#e8e4cc', '#f2a766', '#e0533f'].map(hex),
  tempMax: ['#1d4f9a', '#3a86d8', '#8fc2f0', '#e8e4cc', '#f2a766', '#e0533f'].map(hex),
  rainfall: ['#16283a', '#1e4b73', '#2f78c4', '#6fb2f5', '#c6e4ff'].map(hex),
  wind: ['#2b1c10', '#6e2f10', '#c4501f', '#f2915c', '#fde0cf'].map(hex),
  elevation: ['#1f3d2b', '#43703d', '#8f8d4c', '#a7805a', '#d9d2c4', '#f4f1ea'].map(hex),
};
/** Minimum colour span so tiny differences are not painted as dramatic ones. */
const MIN_SPAN: Record<GridVar, number> = { tempMin: 4, tempMax: 4, rainfall: 2, wind: 4, elevation: 60 };
const SEA: RGB = [14, 32, 46];

function ramp(stops: RGB[], t: number): RGB {
  const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x), f = x - i;
  const a = stops[i], b = stops[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

const RES = 180; // internal raster size (px); the 15 × 15 grid is bilinearly smoothed onto it

export default function BlockGridCard({ panchayat: p, field, onShowOnMap }: Props) {
  const [v, setV] = useState<GridVar>('tempMin');
  const [mode, setMode] = useState<'grid' | 'block'>('grid');
  const [hover, setHover] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mixRef = useRef(1); // 0 = block, 1 = grid
  const rafRef = useRef(0);
  const [size, setSize] = useState(420);

  const meta = GRID_VARS.find((g) => g.id === v)!;
  const stats = useMemo(() => (field ? fieldStats(field, v) : null), [field, v]);

  // colour domain shared by block and grid so the two are directly comparable
  const domain = useMemo(() => {
    if (!stats) return [0, 1] as const;
    let lo = Math.min(stats.lo, stats.coarse), hi = Math.max(stats.hi, stats.coarse);
    const span = MIN_SPAN[v];
    if (hi - lo < span) {
      const mid = (hi + lo) / 2;
      lo = mid - span / 2;
      hi = mid + span / 2;
    }
    if (v === 'rainfall' || v === 'wind') lo = Math.max(0, lo);
    return [lo, hi] as const;
  }, [stats, v]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Draw (and animate the block ↔ grid transition)
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !field) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = size * dpr;
    cv.height = size * dpr;
    const ctx = cv.getContext('2d')!;
    const off = document.createElement('canvas');
    off.width = off.height = RES;
    const octx = off.getContext('2d')!;
    const img = octx.createImageData(RES, RES);
    const n = field.grid.n;
    const vals = field.values[v];
    const stops = RAMPS[v];
    const [lo, hi] = domain;
    const norm = (x: number) => (x - lo) / (hi - lo || 1);
    const coarseCol = ramp(stops, norm(stats!.coarse));

    const bil = (arr: number[], gx: number, gy: number) => {
      const x0 = Math.floor(gx), y0 = Math.floor(gy);
      const x1 = Math.min(n - 1, x0 + 1), y1 = Math.min(n - 1, y0 + 1);
      const tx = gx - x0, ty = gy - y0;
      return (arr[y0 * n + x0] * (1 - tx) + arr[y0 * n + x1] * tx) * (1 - ty) + (arr[y1 * n + x0] * (1 - tx) + arr[y1 * n + x1] * tx) * ty;
    };
    const seaF = field.sea.map((s) => (s ? 1 : 0));

    const paint = (mix: number) => {
      for (let py = 0; py < RES; py++) {
        const gy = Math.min(n - 1, Math.max(0, ((py + 0.5) / RES) * n - 0.5));
        for (let px = 0; px < RES; px++) {
          const gx = Math.min(n - 1, Math.max(0, ((px + 0.5) / RES) * n - 0.5));
          const o = (py * RES + px) * 4;
          const sh = 0.55 + 0.6 * bil(field.shade, gx, gy);
          let col: RGB;
          if (bil(seaF, gx, gy) > 0.5 && v !== 'elevation') col = SEA;
          else {
            const g = ramp(stops, norm(bil(vals, gx, gy)));
            col = [coarseCol[0] + (g[0] - coarseCol[0]) * mix, coarseCol[1] + (g[1] - coarseCol[1]) * mix, coarseCol[2] + (g[2] - coarseCol[2]) * mix];
          }
          img.data[o] = Math.min(255, col[0] * sh);
          img.data[o + 1] = Math.min(255, col[1] * sh);
          img.data[o + 2] = Math.min(255, col[2] * sh);
          img.data[o + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(off, 0, 0, size, size);

      // 1.2 km cell lines fade in with the grid
      const cell = size / n;
      ctx.strokeStyle = `rgba(10,14,12,${0.35 * mix})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < n; i++) {
        ctx.moveTo(i * cell + 0.5, 0);
        ctx.lineTo(i * cell + 0.5, size);
        ctx.moveTo(0, i * cell + 0.5);
        ctx.lineTo(size, i * cell + 0.5);
      }
      ctx.stroke();

      // Block outline
      ctx.strokeStyle = `rgba(246,185,76,${0.9 - 0.5 * mix})`;
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, size - 2, size - 2);
      ctx.setLineDash([]);

      // Village cell
      const cr = Math.floor(n / 2);
      ctx.strokeStyle = '#C8F169';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cr * cell + 1.5, cr * cell + 1.5, cell - 3, cell - 3);
      ctx.fillStyle = '#C8F169';
      ctx.beginPath();
      ctx.arc((cr + 0.5) * cell, (cr + 0.5) * cell, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    cancelAnimationFrame(rafRef.current);
    const target = mode === 'grid' ? 1 : 0;
    const from = mixRef.current;
    if (Math.abs(target - from) < 0.001) {
      paint(target);
      return;
    }
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 650);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      mixRef.current = from + (target - from) * e;
      paint(mixRef.current);
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [field, v, mode, size, domain, stats]);

  const onMove = (e: React.MouseEvent) => {
    if (!field) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const n = field.grid.n;
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * n);
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * n);
    setHover(r >= 0 && r < n && c >= 0 && c < n ? r * n + c : null);
  };

  const fmt = (x: number) => (v === 'elevation' ? Math.round(x).toLocaleString('en-IN') : x.toFixed(1));
  const hv = hover != null && field ? field : null;
  const n = field?.grid.n ?? 15;

  return (
    <section className="card hud relative p-5 sm:p-6" aria-labelledby="grid-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="eyebrow flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Fig 2.1 · {field?.grid.source === 'synthetic' ? 'Offline terrain model' : 'Live Copernicus GLO-90 DEM'}
          </div>
          <h2 id="grid-title" className="mt-1 font-display text-2xl text-ink">
            225 village cells inside one forecast block
          </h2>
          <p className="mt-1 max-w-xl text-sm text-ink2">
            The district model gives the whole 18 × 18 km square around {p.name} a single number. AeroAgro resolves it into 1.2 km cells from real terrain.
          </p>
        </div>
        <div className="seg" role="group" aria-label="Resolution">
          <button onClick={() => setMode('block')} aria-pressed={mode === 'block'} className={`seg-btn ${mode === 'block' ? 'bg-sun text-accent-ink hover:text-accent-ink' : ''}`}>
            <Square className="h-3.5 w-3.5" /> 18 km block
          </button>
          <button onClick={() => setMode('grid')} aria-pressed={mode === 'grid'} className={`seg-btn ${mode === 'grid' ? 'bg-accent text-accent-ink hover:text-accent-ink' : ''}`}>
            <Grid3x3 className="h-3.5 w-3.5" /> 1.2 km grid
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Variable">
        {GRID_VARS.map((g) => (
          <button key={g.id} onClick={() => setV(g.id)} className={`chip ${v === g.id ? 'chip-on' : ''}`} aria-pressed={v === g.id}>
            {g.id === 'elevation' ? <Mountain className="h-3.5 w-3.5" /> : g.id.startsWith('temp') ? <Thermometer className="h-3.5 w-3.5" /> : null}
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="relative w-full max-w-[560px] self-start pl-5 pt-4">
          {/* map-style grid references: columns A–O, rows 1–15 */}
          <div className="absolute left-5 right-0 top-0 grid font-mono text-[9px] leading-4 text-muted" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-hidden>
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className={`text-center ${hover != null && hover % n === i ? 'text-accent' : ''}`}>
                {String.fromCharCode(65 + i)}
              </span>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 top-4 grid w-5 font-mono text-[9px] text-muted" style={{ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }} aria-hidden>
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className={`flex items-center ${hover != null && Math.floor(hover / n) === i ? 'text-accent' : ''}`}>
                {i + 1}
              </span>
            ))}
          </div>
        <div ref={wrapRef} className="relative aspect-square w-full">
          {!field ? (
            <div className="grid h-full w-full place-items-center rounded-lg bg-surface2">
              <div className="flex flex-col items-center gap-3 text-sm text-muted">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
                Fetching 225 terrain heights…
              </div>
            </div>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                style={{ width: size, height: size }}
                className="relative rounded-md"
                onMouseMove={onMove}
                onMouseLeave={() => setHover(null)}
                role="img"
                aria-label={`${meta.label} across the 18 km block around ${p.name}, from ${fmt(stats!.lo)} to ${fmt(stats!.hi)} ${meta.unit}`}
              />
              <NorthArrow className="absolute right-2.5 top-2" />
              <ScaleBar km={6} widthPct={100 / 3} className="absolute bottom-2.5 left-2.5" />
              <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9.5px] text-ink2 backdrop-blur">
                {n}×{n} · Δx 1.2 km
              </span>
              {mode === 'block' && (
                <div className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 text-center animate-fade-in">
                  <div className="inline-block rounded-2xl bg-black/55 px-4 py-3 backdrop-blur">
                    <div className="font-display text-4xl text-ink">
                      {fmt(stats!.coarse)}
                      <span className="text-lg text-ink2"> {meta.unit}</span>
                    </div>
                    <div className="text-xs text-ink2">one number for 324 km²</div>
                  </div>
                </div>
              )}
              {hv && hover != null && mode === 'grid' && (
                <div
                  className="pointer-events-none absolute z-10 w-44 rounded-xl border border-line/10 bg-surface/95 p-2.5 text-xs shadow-pop backdrop-blur"
                  style={{
                    left: Math.min(size - 180, ((hover % n) + 1) * (size / n)),
                    top: Math.min(size - 110, Math.floor(hover / n) * (size / n)),
                  }}
                >
                  <div className="font-semibold text-ink">{hover === hv.centre ? `${p.name} (your village)` : `Cell ${String.fromCharCode(65 + (hover % n))}${Math.floor(hover / n) + 1}`}</div>
                  <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 tabular text-ink2">
                    <span>Height</span>
                    <span className="text-right text-ink">{hv.grid.elev[hover]} m</span>
                    <span>Night low</span>
                    <span className="text-right text-ink">{hv.values.tempMin[hover]}°</span>
                    <span>Day high</span>
                    <span className="text-right text-ink">{hv.values.tempMax[hover]}°</span>
                    <span>Rain</span>
                    <span className="text-right text-ink">{hv.values.rainfall[hover]} mm</span>
                    <span>Wind</span>
                    <span className="text-right text-ink">{hv.values.wind[hover]} km/h</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          {stats && field ? (
            <>
              <div className="rounded-lg bg-surface2 p-4">
                <div className="text-xs text-muted">Hidden inside the block</div>
                <div className="mt-1 font-display text-4xl text-accent tabular">
                  {fmt(stats.hi - stats.lo)}
                  <span className="text-lg text-ink2"> {meta.unit}</span>
                </div>
                <div className="text-xs text-ink2">spread the 18 km forecast cannot see</div>
                <div className="mt-3 h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${RAMPS[v].map((c) => `rgb(${c.join(',')})`).join(',')})` }} />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
                  <span>{fmt(domain[0])}</span>
                  <span>{fmt(domain[1])}</span>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
                {[
                  { k: 'Block forecast', val: `${fmt(stats.coarse)} ${meta.unit}`, tone: 'text-sun' },
                  { k: 'Your village cell', val: `${fmt(stats.village)} ${meta.unit}`, tone: 'text-accent' },
                  { k: v === 'elevation' ? 'Lowest cell' : 'Lowest', val: `${fmt(stats.lo)} ${meta.unit} · ${field.grid.elev[stats.loI]} m`, tone: 'text-ink' },
                  { k: v === 'elevation' ? 'Highest cell' : 'Highest', val: `${fmt(stats.hi)} ${meta.unit} · ${field.grid.elev[stats.hiI]} m`, tone: 'text-ink' },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg border border-line/[0.07] px-3 py-2">
                    <dt className="text-[11px] text-muted">{s.k}</dt>
                    <dd className={`font-mono text-[13px] font-semibold tabular ${s.tone}`}>{s.val}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-lg bg-accent/10 px-3 py-2.5 text-sm text-ink2">
                <strong className="text-ink tabular">
                  {stats.risk} of {stats.land}
                </strong>{' '}
                {GRID_RISK[v].label}
              </div>
              <button onClick={() => onShowOnMap(v)} className="btn-ghost mt-auto">
                <MapPinned className="h-4 w-4" /> Show grid on the map
              </button>
            </>
          ) : (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-surface2" />
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Per cell: lapse rate from the DEM height, cold-air pooling in hollows (topographic position), warm thermal belts on slopes, orographic rain lift and ridge
        exposure for wind. The village point forecast is blended in with an elevation-aware influence function, the way station data is assimilated.
      </p>
    </section>
  );
}
