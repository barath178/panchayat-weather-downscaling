'use client';

// The 18 km forecast block around a panchayat, resolved into a 15 × 15 grid of 1.2 km cells.
// Terrain heights come from the Copernicus GLO-90 DEM (via Open-Meteo's keyless elevation API);
// each cell is then downscaled with the same physics as the point engine.

import { useEffect, useState } from 'react';
import type { PanchayatData } from '@/data/all_india_regions';
import {
  LAPSE_RATE_C_PER_KM,
  TMAX_LAPSE_C_PER_KM,
  WINTER_NIGHT_LAPSE_C_PER_KM,
  DRIFT_LIMIT_KMH,
  WeatherMetrics,
  terrainClass,
} from './microclimate';

export const GRID_N = 15;
export const CELL_KM = 1.2;
const KM_PER_DEG = 111.32;
const ELEV_API = 'https://api.open-meteo.com/v1/elevation';

export interface BlockGrid {
  n: number;
  /** cell size in degrees */
  dLat: number;
  dLng: number;
  /** [[south, west], [north, east]] */
  bounds: [[number, number], [number, number]];
  /** row-major, row 0 = north */
  elev: number[];
  lat: number[];
  lng: number[];
  source: 'dem' | 'synthetic';
}

export type GridVar = 'tempMin' | 'tempMax' | 'rainfall' | 'wind' | 'elevation';

export interface BlockField {
  grid: BlockGrid;
  values: Record<GridVar, number[]>;
  /** true where the DEM is at or below sea level */
  sea: boolean[];
  /** hillshade 0..1 per cell */
  shade: number[];
  centre: number;
  coarse: WeatherMetrics;
  coarseElevationM: number;
}

// ---------- geometry ----------

function layout(p: PanchayatData) {
  const dLat = CELL_KM / KM_PER_DEG;
  const dLng = CELL_KM / (KM_PER_DEG * Math.cos((p.lat * Math.PI) / 180));
  const h = (GRID_N - 1) / 2;
  const lat: number[] = [];
  const lng: number[] = [];
  for (let r = 0; r < GRID_N; r++)
    for (let c = 0; c < GRID_N; c++) {
      lat.push(+(p.lat + (h - r) * dLat).toFixed(5));
      lng.push(+(p.lng + (c - h) * dLng).toFixed(5));
    }
  const half = GRID_N / 2;
  const bounds: [[number, number], [number, number]] = [
    [p.lat - half * dLat, p.lng - half * dLng],
    [p.lat + half * dLat, p.lng + half * dLng],
  ];
  return { dLat, dLng, lat, lng, bounds };
}

// ---------- offline fallback terrain ----------

function seeded(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** Plausible terrain when the DEM service is unreachable: smooth noise scaled by the region's relief. */
function syntheticElevation(p: PanchayatData): number[] {
  const rnd = seeded(p.id);
  const lattice = (s: number) => Array.from({ length: (s + 2) * (s + 2) }, () => rnd());
  const octaves = [
    { s: 3, a: 1 },
    { s: 6, a: 0.5 },
    { s: 12, a: 0.25 },
  ].map((o) => ({ ...o, v: lattice(o.s) }));
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const sample = (o: (typeof octaves)[number], x: number, y: number) => {
    const fx = x * o.s, fy = y * o.s;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = smooth(fx - x0), ty = smooth(fy - y0);
    const w = o.s + 2;
    const v = (i: number, j: number) => o.v[j * w + i];
    return (v(x0, y0) * (1 - tx) + v(x0 + 1, y0) * tx) * (1 - ty) + (v(x0, y0 + 1) * (1 - tx) + v(x0 + 1, y0 + 1) * tx) * ty;
  };
  const relief = Math.min(900, 12 + p.slopeDeg * 28 + (p.elevationM > 1500 ? 500 : p.elevationM > 600 ? 180 : 0));
  const raw: number[] = [];
  for (let r = 0; r < GRID_N; r++)
    for (let c = 0; c < GRID_N; c++) {
      const x = c / (GRID_N - 1), y = r / (GRID_N - 1);
      raw.push(octaves.reduce((s, o) => s + o.a * sample(o, x, y), 0) / 1.75);
    }
  const centre = raw[(GRID_N * GRID_N - 1) / 2];
  // Valleys sit low in their block: bias the centre below its surroundings
  const bias = terrainClass(p).valley ? 0.12 : 0;
  return raw.map((v) => Math.max(0, Math.round(p.elevationM + (v - centre + bias) * relief)));
}

// ---------- DEM fetch hook ----------

async function fetchDem(lat: number[], lng: number[], signal: AbortSignal) {
  const out: number[] = [];
  for (let i = 0; i < lat.length; i += 100) {
    const q = new URLSearchParams({ latitude: lat.slice(i, i + 100).join(','), longitude: lng.slice(i, i + 100).join(',') });
    const r = await fetch(`${ELEV_API}?${q}`, { signal });
    if (!r.ok) throw new Error(`DEM HTTP ${r.status}`);
    const j = await r.json();
    out.push(...(j.elevation as number[]).map((z) => Math.round(Number.isFinite(z) ? z : 0)));
  }
  if (out.length !== lat.length) throw new Error('DEM size mismatch');
  return out;
}

export function useBlockGrid(p: PanchayatData) {
  const [state, setState] = useState<{ status: 'loading' | 'ready'; grid: BlockGrid | null }>({ status: 'loading', grid: null });

  useEffect(() => {
    const geo = layout(p);
    const make = (elev: number[], source: BlockGrid['source']): BlockGrid => ({ n: GRID_N, ...geo, elev, source });
    const key = `aeroagro:dem:${p.id}`;
    try {
      const hit = localStorage.getItem(key);
      if (hit) {
        setState({ status: 'ready', grid: make(JSON.parse(hit), 'dem') });
        return;
      }
    } catch {
      /* storage blocked: fetch instead */
    }
    const ctrl = new AbortController();
    setState({ status: 'loading', grid: null });
    fetchDem(geo.lat, geo.lng, ctrl.signal)
      .then((elev) => {
        try {
          localStorage.setItem(key, JSON.stringify(elev));
        } catch {
          /* best-effort cache */
        }
        setState({ status: 'ready', grid: make(elev, 'dem') });
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: 'ready', grid: make(syntheticElevation(p), 'synthetic') });
      });
    return () => ctrl.abort();
  }, [p]);

  return state;
}

// ---------- physics on the grid ----------

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Downscale the coarse block forecast onto every 1.2 km cell, then blend in the village
 * point forecast with a Gaussian influence radius (optimal-interpolation style) so the
 * centre cell agrees exactly with the rest of the dashboard.
 */
export function computeField(grid: BlockGrid, p: PanchayatData, coarse: WeatherMetrics, coarseElevationM: number, village: WeatherMetrics): BlockField {
  const n = grid.n;
  const N = n * n;
  const z = grid.elev;
  const sea = z.map((v) => v <= 0);
  const t = terrainClass(p);
  const clearNight = coarse.rainfallMm < 5;
  const coldSeason = coarse.tempMin < 16;
  const nightLapse = coldSeason ? WINTER_NIGHT_LAPSE_C_PER_KM : LAPSE_RATE_C_PER_KM;
  const cellM = CELL_KM * 1000;
  const at = (r: number, c: number) => z[clamp(r, 0, n - 1) * n + clamp(c, 0, n - 1)];

  const raw = { tempMin: [] as number[], tempMax: [] as number[], rainfall: [] as number[], wind: [] as number[] };
  const shade: number[] = [];
  const centre = (N - 1) / 2;
  const cr = Math.floor(n / 2);

  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const zi = z[i];
      // Topographic position index: height relative to the 5 × 5 neighbourhood mean
      let s = 0, k = 0;
      for (let dr = -2; dr <= 2; dr++)
        for (let dc = -2; dc <= 2; dc++) {
          if (!dr && !dc) continue;
          s += at(r + dr, c + dc);
          k++;
        }
      const tpi = zi - s / k;
      const gx = (at(r, c + 1) - at(r, c - 1)) / (2 * cellM);
      const gy = (at(r - 1, c) - at(r + 1, c)) / (2 * cellM);
      const slope = Math.atan(Math.hypot(gx, gy));
      const aspect = Math.atan2(gy, -gx);
      // Hillshade, sun from the north-west at 45°
      const zen = Math.PI / 4, az = (315 * Math.PI) / 180;
      shade.push(clamp(Math.cos(zen) * Math.cos(slope * 6) + Math.sin(zen) * Math.sin(slope * 6) * Math.cos(az - aspect), 0, 1));

      const dz = zi - coarseElevationM;
      const hollow = clamp(-tpi / 120, 0, 1);
      const crest = clamp(tpi / 150, 0, 1);
      const pooling = clearNight ? hollow * (coldSeason ? 3.5 : 1.3) : 0;
      const thermalBelt = clearNight ? crest * (coldSeason ? 1.0 : 0.4) : 0;
      const dist = Math.hypot(r - cr, c - cr) * CELL_KM;
      const uhi = t.urban ? Math.exp(-((dist / 3) ** 2)) : 0;

      raw.tempMin.push(coarse.tempMin - (nightLapse * dz) / 1000 - pooling + thermalBelt + uhi * 2.2 + (t.arid ? -1 : 0));
      raw.tempMax.push(coarse.tempMax - (TMAX_LAPSE_C_PER_KM * dz) / 1000 - ((slope * 180) / Math.PI) * 0.015 + uhi * 1.2 + (t.arid ? 1.5 : 0));
      const lift = 1 + clamp(dz / 1000, -0.5, 2) * 0.5 + Math.sin(slope) * 0.6;
      raw.rainfall.push(coarse.rainfallMm * clamp(lift, 0.3, 2));
      raw.wind.push(coarse.windSpeedKmh * clamp(1 + tpi / 300 + (t.windGap ? 0.4 * Math.exp(-((dist / 4) ** 2)) : 0), 0.45, 2));
    }

  // Nudge toward the village point forecast with an elevation-aware structure function
  // (horizontal × vertical decorrelation, as in MET Norway's gridpp optimal interpolation).
  // Flat plains: the village is representative of the whole block, so the correction spreads wide.
  // Rugged terrain: it stays within nearby cells at a similar height.
  const land = z.filter((_, i) => !sea[i]);
  const zMean = land.reduce((a, b) => a + b, 0) / Math.max(1, land.length);
  const zStd = Math.sqrt(land.reduce((a, b) => a + (b - zMean) ** 2, 0) / Math.max(1, land.length));
  const Lh = clamp(250 / Math.max(zStd, 1), 3, 25); // km
  const Lz = 150; // m
  const zc = z[centre];
  const values: BlockField['values'] = { tempMin: [], tempMax: [], rainfall: [], wind: [], elevation: z.slice() };
  const inc = {
    tempMin: village.tempMin - raw.tempMin[centre],
    tempMax: village.tempMax - raw.tempMax[centre],
    rainfall: raw.rainfall[centre] > 0 ? village.rainfallMm / raw.rainfall[centre] : 1,
    wind: raw.wind[centre] > 0 ? village.windSpeedKmh / raw.wind[centre] : 1,
  };
  for (let i = 0; i < N; i++) {
    const r = Math.floor(i / n), c = i % n;
    const w = Math.exp(-(((Math.hypot(r - cr, c - cr) * CELL_KM) / Lh) ** 2)) * Math.exp(-(((z[i] - zc) / Lz) ** 2));
    values.tempMin.push(round1(raw.tempMin[i] + inc.tempMin * w));
    values.tempMax.push(round1(Math.max(raw.tempMax[i] + inc.tempMax * w, raw.tempMin[i] + inc.tempMin * w + 2)));
    values.rainfall.push(round1(Math.max(0, raw.rainfall[i] * (1 + (inc.rainfall - 1) * w))));
    values.wind.push(round1(Math.max(1, raw.wind[i] * (1 + (inc.wind - 1) * w))));
  }

  return { grid, values, sea, shade, centre, coarse, coarseElevationM };
}

const round1 = (v: number) => Math.round(v * 10) / 10;

// ---------- summaries ----------

export const GRID_VARS: { id: GridVar; label: string; unit: string; coarse: (m: WeatherMetrics, z: number) => number }[] = [
  { id: 'tempMin', label: 'Night low', unit: '°C', coarse: (m) => m.tempMin },
  { id: 'tempMax', label: 'Day high', unit: '°C', coarse: (m) => m.tempMax },
  { id: 'rainfall', label: 'Rain', unit: 'mm', coarse: (m) => m.rainfallMm },
  { id: 'wind', label: 'Wind', unit: 'km/h', coarse: (m) => m.windSpeedKmh },
  { id: 'elevation', label: 'Terrain', unit: 'm', coarse: (_m, z) => Math.round(z) },
];

/** A decision threshold per variable, used to count cells at risk. */
export const GRID_RISK: Record<GridVar, { test: (v: number, coarse: number) => boolean; label: string }> = {
  tempMin: { test: (v) => v <= 4, label: 'cells at frost risk (≤ 4 °C)' },
  tempMax: { test: (v) => v >= 38, label: 'cells under heat stress (≥ 38 °C)' },
  rainfall: { test: (v, c) => c > 0.5 && v >= c * 1.25, label: 'cells 25 %+ wetter than the block' },
  wind: { test: (v) => v > DRIFT_LIMIT_KMH, label: `cells above the ${DRIFT_LIMIT_KMH} km/h spray limit` },
  elevation: { test: (v, c) => v - c >= 150, label: 'cells 150 m+ above the height the block model assumes' },
};

export function fieldStats(f: BlockField, v: GridVar) {
  const vals = f.values[v];
  let lo = Infinity, hi = -Infinity, loI = 0, hiI = 0, s = 0, k = 0, risk = 0;
  const coarseV = GRID_VARS.find((g) => g.id === v)!.coarse(f.coarse, f.coarseElevationM);
  vals.forEach((x, i) => {
    if (f.sea[i] && v !== 'elevation') return;
    if (x < lo) (lo = x), (loI = i);
    if (x > hi) (hi = x), (hiI = i);
    s += x;
    k++;
    if (GRID_RISK[v].test(x, coarseV)) risk++;
  });
  return { lo, hi, loI, hiI, mean: k ? s / k : 0, land: k, risk, coarse: coarseV, village: vals[f.centre] };
}
