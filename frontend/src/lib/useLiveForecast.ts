'use client';

import { useEffect, useState } from 'react';
import type { PanchayatData } from '@/data/all_india_regions';
import type { HourlyInput, LiveForecast, WeatherMetrics } from './microclimate';

// Open-Meteo: free, keyless, CORS-enabled. `elevation=nan` disables Open-Meteo's own
// DEM correction, so values are the raw grid-cell mean – the true "coarse" baseline.
const API = 'https://api.open-meteo.com/v1/forecast';
const TTL_MS = 30 * 60 * 1000;

export type LiveStatus = 'idle' | 'loading' | 'ready' | 'error';

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const r1 = (n: number) => Math.round(n * 10) / 10;

function cacheGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return Date.now() - at < TTL_MS ? (data as T) : null;
  } catch {
    return null;
  }
}

function cacheSet(key: string, data: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage full or blocked – caching is best-effort */
  }
}

/** Today's coarse forecast + hourly series for the selected region. */
export function useLiveForecast(p: PanchayatData, enabled: boolean) {
  const [state, setState] = useState<{ status: LiveStatus; data: LiveForecast | null; error?: string }>({
    status: 'idle',
    data: null,
  });

  useEffect(() => {
    if (!enabled) return;
    const key = `aeroagro:live:${p.id}`;
    const cached = cacheGet<LiveForecast>(key);
    if (cached) {
      setState({ status: 'ready', data: cached });
      return;
    }

    const ctrl = new AbortController();
    setState((s) => ({ status: 'loading', data: s.data }));

    const params = new URLSearchParams({
      latitude: String(p.lat),
      longitude: String(p.lng),
      elevation: 'nan',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
      timezone: 'Asia/Kolkata',
      forecast_days: '1',
    });

    fetch(`${API}?${params}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Open-Meteo HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => {
        const h = j.hourly;
        const hourly: HourlyInput[] = [];
        for (let i = 0; i < h.time.length; i++) {
          const hour = parseInt(h.time[i].slice(11, 13), 10);
          if (hour < 6 || hour > 19) continue;
          hourly.push({
            time: `${String(hour).padStart(2, '0')}:00`,
            tempC: r1(h.temperature_2m[i]),
            windKmh: r1(h.wind_speed_10m[i]),
            rh: Math.round(h.relative_humidity_2m[i]),
            rainMm: r1(h.precipitation[i] ?? 0),
          });
        }
        const daily: WeatherMetrics = {
          tempMax: r1(j.daily.temperature_2m_max[0]),
          tempMin: r1(j.daily.temperature_2m_min[0]),
          rainfallMm: r1(j.daily.precipitation_sum[0] ?? 0),
          windSpeedKmh: r1(mean(h.wind_speed_10m.slice(6, 20))),
          relativeHumidity: Math.round(mean(h.relative_humidity_2m)),
        };
        const data: LiveForecast = {
          daily,
          hourly,
          gridElevationM: Math.round(j.elevation ?? 0),
          fetchedAt: Date.now(),
        };
        cacheSet(key, data);
        setState({ status: 'ready', data });
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        setState({ status: 'error', data: null, error: String(e?.message || e) });
      });

    return () => ctrl.abort();
  }, [p.id, p.lat, p.lng, enabled]);

  return state;
}

/** Daily coarse values for every region in one batched request (drives the live map colouring). */
export function useLiveNational(regions: PanchayatData[], enabled: boolean) {
  const [map, setMap] = useState<Record<string, { daily: WeatherMetrics; gridElevationM: number }> | null>(null);
  const [status, setStatus] = useState<LiveStatus>('idle');

  useEffect(() => {
    if (!enabled) return;
    const key = 'aeroagro:live:national';
    const cached = cacheGet<typeof map>(key);
    if (cached) {
      setMap(cached);
      setStatus('ready');
      return;
    }
    const ctrl = new AbortController();
    setStatus('loading');

    const params = new URLSearchParams({
      latitude: regions.map((r) => r.lat).join(','),
      longitude: regions.map((r) => r.lng).join(','),
      elevation: regions.map(() => 'nan').join(','),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean',
      timezone: 'Asia/Kolkata',
      forecast_days: '1',
    });

    fetch(`${API}?${params}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Open-Meteo HTTP ${r.status}`);
        return r.json();
      })
      .then((arr) => {
        const list = Array.isArray(arr) ? arr : [arr];
        const out: Record<string, { daily: WeatherMetrics; gridElevationM: number }> = {};
        list.forEach((j: any, i: number) => {
          const d = j.daily;
          out[regions[i].id] = {
            gridElevationM: Math.round(j.elevation ?? 0),
            daily: {
              tempMax: r1(d.temperature_2m_max[0]),
              tempMin: r1(d.temperature_2m_min[0]),
              rainfallMm: r1(d.precipitation_sum[0] ?? 0),
              // daily max wind overstates the spray-hours mean; scale to a daytime average
              windSpeedKmh: r1((d.wind_speed_10m_max[0] ?? 0) * 0.7),
              relativeHumidity: Math.round(d.relative_humidity_2m_mean?.[0] ?? 70),
            },
          };
        });
        cacheSet(key, out);
        setMap(out);
        setStatus('ready');
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setStatus('error');
      });

    return () => ctrl.abort();
  }, [regions, enabled]);

  return { national: map, nationalStatus: status };
}
