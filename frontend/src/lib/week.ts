// 7-day panchayat outlook: every coarse day is downscaled with the same terrain physics,
// then turned into farm decisions (spray window, rain class, alerts).

import type { PanchayatData } from '@/data/all_india_regions';
import type { Lang } from './advisory';
import {
  HourPoint,
  SprayWindow,
  WeatherMetrics,
  bestSprayWindow,
  classifyHours,
  downscale,
  synthHourly,
} from './microclimate';

export type SprayBlocker = 'ok' | 'rain' | 'wind' | 'heat' | 'other';

export interface DayOutlook {
  /** ISO date (yyyy-mm-dd) in IST, null before the client clock is known */
  date: string | null;
  coarse: WeatherMetrics;
  fine: WeatherMetrics;
  spray: SprayWindow;
  blocker: SprayBlocker;
}

const pad = (n: number) => String(n).padStart(2, '0');
const isoLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Dates for a simulated week, starting today. */
export function weekDates(now: Date | null, n = 7): (string | null)[] {
  if (!now) return Array(n).fill(null);
  return Array.from({ length: n }, (_, i) => isoLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)));
}

function blockerOf(hours: HourPoint[], w: SprayWindow): SprayBlocker {
  if (w.hours >= 2) return 'ok';
  if (hours.some((h) => h.reason.startsWith('Rain'))) return 'rain';
  if (hours.some((h) => h.reason.startsWith('Wind') || h.reason.startsWith('Moderate wind'))) return 'wind';
  if (hours.some((h) => h.reason.startsWith('High heat'))) return 'heat';
  return 'other';
}

export function buildWeek(
  p: PanchayatData,
  coarseDays: WeatherMetrics[],
  coarseElevationM: number,
  dates: (string | null)[],
  today?: { hourly: HourPoint[]; spray: SprayWindow }
): DayOutlook[] {
  return coarseDays.map((coarse, i) => {
    const fine = downscale(p, coarse, coarseElevationM);
    const hours = i === 0 && today ? today.hourly : classifyHours(synthHourly(fine));
    const spray = i === 0 && today ? today.spray : bestSprayWindow(hours);
    return { date: dates[i] ?? null, coarse, fine, spray, blocker: blockerOf(hours, spray) };
  });
}

// ---------- labels ----------

const LOCALE: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };
const TODAY: Record<Lang, string> = { en: 'Today', hi: 'आज', ta: 'இன்று' };
const TOMORROW: Record<Lang, string> = { en: 'Tomorrow', hi: 'कल', ta: 'நாளை' };
const DAY_N: Record<Lang, string> = { en: 'Day', hi: 'दिन', ta: 'நாள்' };

export function dateOf(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

/** "Today", "Tomorrow", then weekday names. */
export function dayLabel(d: DayOutlook, i: number, lang: Lang = 'en', style: 'short' | 'long' = 'long') {
  if (i === 0) return TODAY[lang];
  if (i === 1) return TOMORROW[lang];
  if (!d.date) return `${DAY_N[lang]} ${i + 1}`;
  return dateOf(d.date).toLocaleDateString(LOCALE[lang], { weekday: style });
}

export function shortDate(d: DayOutlook) {
  return d.date ? dateOf(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';
}

// ---------- IMD classes & alerts ----------

/** IMD 24-hour rainfall categories. */
export function rainClass(mm: number): { id: number; en: string; hi: string; ta: string } {
  if (mm < 0.1) return { id: 0, en: 'no rain', hi: 'बारिश नहीं', ta: 'மழை இல்லை' };
  if (mm < 2.5) return { id: 1, en: 'very light rain', hi: 'बहुत हल्की बारिश', ta: 'மிக லேசான மழை' };
  if (mm < 15.6) return { id: 2, en: 'light rain', hi: 'हल्की बारिश', ta: 'லேசான மழை' };
  if (mm < 64.5) return { id: 3, en: 'moderate rain', hi: 'मध्यम बारिश', ta: 'மிதமான மழை' };
  if (mm < 115.6) return { id: 4, en: 'heavy rain', hi: 'भारी बारिश', ta: 'கனமழை' };
  return { id: 5, en: 'very heavy rain', hi: 'बहुत भारी बारिश', ta: 'மிகக் கனமழை' };
}

export type AlertKind = 'heavy' | 'frost' | 'heat' | 'wind';

export function dayAlerts(m: WeatherMetrics): AlertKind[] {
  const out: AlertKind[] = [];
  if (m.rainfallMm >= 64.5) out.push('heavy');
  if (m.tempMin <= 4) out.push('frost');
  if (m.tempMax >= 40) out.push('heat');
  if (m.windSpeedKmh >= 30) out.push('wind');
  return out;
}

/** Day with the longest safe spray window (earliest wins ties). */
export function bestSprayDay(week: DayOutlook[]) {
  let best = -1;
  week.forEach((d, i) => {
    if (d.spray.hours > 0 && (best < 0 || d.spray.hours > week[best].spray.hours)) best = i;
  });
  return best;
}

/** First run of at least `min` consecutive dry days (< 2.5 mm): harvest / drying window. */
export function dryRun(week: DayOutlook[], min = 2): [number, number] | null {
  let start = -1;
  for (let i = 0; i < week.length; i++) {
    if (week[i].fine.rainfallMm < 2.5) {
      if (start < 0) start = i;
      if (i - start + 1 >= min) {
        let end = i;
        while (end + 1 < week.length && week[end + 1].fine.rainfallMm < 2.5) end++;
        return [start, end];
      }
    } else start = -1;
  }
  return null;
}

export const sum = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) * 10) / 10;
