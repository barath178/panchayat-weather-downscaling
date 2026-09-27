// AeroAgro physics-informed downscaling engine (client side).
// Converts a coarse ~18 km NWP block forecast into a 1.2 km panchayat microclimate
// using terrain covariates (elevation, slope, D8 drainage, terrain class, urban fabric).

import type { PanchayatData } from '@/data/all_india_regions';

export type Scenario = 'live' | 'monsoon' | 'winter_frost' | 'pre_monsoon';
export type SprayStatus = 'safe' | 'caution' | 'danger';

export interface WeatherMetrics {
  tempMax: number;
  tempMin: number;
  rainfallMm: number;
  windSpeedKmh: number;
  relativeHumidity: number;
}

export interface HourlyInput {
  time: string; // "HH:00"
  tempC: number;
  windKmh: number;
  rh: number;
  rainMm: number;
}

export interface HourPoint extends HourlyInput {
  status: SprayStatus;
  reason: string;
}

/** Live coarse forecast for one location (Open-Meteo, grid-cell mean, no DEM correction). */
export interface LiveForecast {
  daily: WeatherMetrics;
  /** 7 days of coarse daily values; days[0] === daily */
  days: WeatherMetrics[];
  /** ISO dates (Asia/Kolkata) matching `days` */
  dates: string[];
  hourly: HourlyInput[];
  gridElevationM: number;
  fetchedAt: number;
}

export const LAPSE_RATE_C_PER_KM = 6.5;
// Daytime maxima cool more slowly with height (sunlit slopes); winter nights are
// damped by valley inversions. Both are standard observations in Indian hill stations.
export const TMAX_LAPSE_C_PER_KM = 5.0;
export const WINTER_NIGHT_LAPSE_C_PER_KM = 4.5;
export const DRIFT_LIMIT_KMH = 15;
export const CAUTION_WIND_KMH = 10;

// ---------- terrain classification ----------

const has = (p: PanchayatData, re: RegExp) => re.test(`${p.terrainType} ${p.name}`);

export function terrainClass(p: PanchayatData) {
  return {
    urban: p.isUrban,
    himalayan: p.elevationM > 1500,
    arid: has(p, /desert|thar|marwar|dune|arid|sand|rann|shekhawati/i) && !has(p, /semi-dry tank/i),
    rainShadow: has(p, /rain-?shadow|drought/i),
    coastal: p.elevationM < 80 || has(p, /coast|delta|estuar|sea|port|mangrove|shore/i),
    windGap: /wind gap|wind funnel|\bgap\b/i.test(p.terrainType) || /\bgap\b/i.test(p.name),
    ridge: has(p, /ridge|crest|escarpment|peak|cliff|spur/i),
    valley: has(p, /valley|basin|hollow|depression|syncline/i),
    windward: has(p, /western ghats|malnad|high range|cloud|rainforest|misty|baba budan|konkan/i) || p.state.startsWith('Assam'),
  };
}

// Deterministic per-region jitter (±1) so adjacent districts don't render identical values.
function hashUnit(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 5000 - 1;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** An 18 km NWP cell averages ridge and valley together, so its terrain height is smoothed. */
export function blockElevation(p: PanchayatData) {
  return p.elevationM * 0.55 + 180 * 0.45;
}

// ---------- coarse baseline (scenario climatology) ----------

export function scenarioBaseline(p: PanchayatData, scenario: Exclude<Scenario, 'live'>): WeatherMetrics {
  const t = terrainClass(p);
  const lat = p.lat;
  const zBlock = blockElevation(p);
  const maxLapse = (TMAX_LAPSE_C_PER_KM * zBlock) / 1000;
  const minLapse = ((scenario === 'winter_frost' ? WINTER_NIGHT_LAPSE_C_PER_KM : LAPSE_RATE_C_PER_KM) * zBlock) / 1000;
  const j = hashUnit(p.id);

  let tMax: number, tMin: number, rain: number, wind: number, rh: number;

  if (scenario === 'monsoon') {
    tMax = 32 + (lat - 20) * 0.12;
    tMin = 25 - Math.abs(lat - 20) * 0.08;
    rain = 28;
    if (t.arid) rain = 6;
    else if (t.rainShadow) rain = 12;
    else if (t.windward) rain = 48;
    // Tamil Nadu coast receives little SW-monsoon rain
    if (p.state === 'Tamil Nadu' && p.lng > 78) rain *= 0.45;
    wind = 18;
    rh = t.arid ? 58 : 84;
  } else if (scenario === 'winter_frost') {
    tMax = 30.5 - (lat - 8) * 0.5;
    tMin = 22 - (lat - 8) * 0.55;
    // NE monsoon over the Tamil Nadu / south AP coast
    rain = p.state === 'Tamil Nadu' || (lat < 15 && p.lng > 79) ? 9 : 0.4;
    wind = 9;
    rh = t.arid ? 38 : 64;
  } else {
    tMax = 36.5 + (lat - 12) * 0.12;
    tMin = 25 + (lat - 12) * 0.02;
    rain = t.windward || p.state.startsWith('Assam') || p.state === 'West Bengal' ? 14 : 6;
    if (t.arid) rain = 0.5;
    wind = 20;
    rh = t.arid ? 24 : t.coastal ? 72 : 48;
  }

  return {
    tempMax: round1(tMax - maxLapse + j * 0.6),
    tempMin: round1(tMin - minLapse + j * 0.5),
    rainfallMm: round1(Math.max(0, rain * (1 + j * 0.12))),
    windSpeedKmh: round1(wind * (1 + j * 0.08)),
    relativeHumidity: Math.round(clamp(rh + j * 3, 10, 99)),
  };
}

// ---------- downscaling ----------

const satVapourPressure = (tC: number) => 6.1078 * Math.exp((17.27 * tC) / (tC + 237.3));

/** One physical step in the downscaling, for the explainability view. */
export interface Step {
  label: string;
  why: string;
  /** additive change (°C) for temperature, multiplicative factor for rain & wind */
  value: number;
}

export interface DownscaleDetail {
  metrics: WeatherMetrics;
  tmin: Step[];
  tmax: Step[];
  rain: Step[];
  wind: Step[];
  dz: number;
}

/**
 * Apply terrain physics to a coarse block forecast, recording every step.
 * `coarseElevationM` is the terrain height the coarse value refers to.
 */
export function downscaleDetailed(p: PanchayatData, coarse: WeatherMetrics, coarseElevationM = blockElevation(p)): DownscaleDetail {
  const t = terrainClass(p);
  const dz = p.elevationM - coarseElevationM;
  const slopeRad = (p.slopeDeg * Math.PI) / 180;
  const clearNight = coarse.rainfallMm < 5;
  const coldSeason = coarse.tempMin < 16;
  const nightLapse = coldSeason ? WINTER_NIGHT_LAPSE_C_PER_KM : LAPSE_RATE_C_PER_KM;
  const tminSteps: Step[] = [];
  const tmaxSteps: Step[] = [];
  const rainSteps: Step[] = [];
  const windSteps: Step[] = [];
  const hgt = `${Math.abs(Math.round(dz))} m ${dz >= 0 ? 'higher' : 'lower'} than the block average`;

  // Temperature: lapse rate + urban heat island + katabatic cold-air pooling on clear nights.
  tmaxSteps.push({ label: 'Height (lapse rate)', why: `${hgt}; air cools ${TMAX_LAPSE_C_PER_KM} °C per km by day`, value: -(TMAX_LAPSE_C_PER_KM * dz) / 1000 });
  if (p.slopeDeg > 2) tmaxSteps.push({ label: 'Slope exposure', why: `${p.slopeDeg}° slope mixes air and trims the afternoon peak`, value: -p.slopeDeg * 0.015 });
  tminSteps.push({ label: 'Height (lapse rate)', why: `${hgt}; nights cool ${nightLapse} °C per km`, value: -(nightLapse * dz) / 1000 });
  if (t.urban) {
    tmaxSteps.push({ label: 'Urban heat island', why: 'Concrete and asphalt store heat', value: 1.2 });
    tminSteps.push({ label: 'Urban heat island', why: 'Buildings release stored heat all night', value: 2.2 });
  }
  if (clearNight && !t.urban && (t.valley || t.himalayan)) {
    const pooling = p.drainageAccumulation * (coldSeason ? 4.0 : 1.5) * (1 - p.slopeDeg / 40);
    tminSteps.push({ label: 'Cold-air pooling', why: `Clear night: cold air drains downhill and settles here (drainage index ${p.drainageAccumulation})`, value: -pooling });
  }
  if (t.arid) {
    tmaxSteps.push({ label: 'Dry sand heating', why: 'Bare desert soil heats fast by day', value: 1.5 });
    tminSteps.push({ label: 'Desert radiative cooling', why: 'Dry air lets heat escape at night', value: -1.0 });
  }
  const tMax = coarse.tempMax + tmaxSteps.reduce((s, x) => s + x.value, 0);
  let tMin = coarse.tempMin + tminSteps.reduce((s, x) => s + x.value, 0);
  if (tMin > tMax - 2) {
    tminSteps.push({ label: 'Physical consistency', why: 'Night low kept at least 2 °C below the day high', value: tMax - 2 - tMin });
    tMin = tMax - 2;
  }

  // Rainfall: orographic amplification, rain-shadow damping, coastal convergence (multiplicative).
  const lift = 1 + (Math.max(0, dz) / 1000) * 0.6 + Math.sin(slopeRad) * 0.6;
  if (Math.abs(lift - 1) > 0.005) rainSteps.push({ label: 'Orographic lift', why: 'Air forced up hills condenses into extra rain', value: lift });
  if (t.windward) rainSteps.push({ label: 'Windward slope', why: 'Faces the moist monsoon flow', value: 1.1 });
  if (t.ridge) rainSteps.push({ label: 'Ridge crest', why: 'Crests catch the most cloud water', value: 1.1 });
  if (t.rainShadow) rainSteps.push({ label: 'Rain shadow', why: 'Hills upwind have already squeezed the rain out', value: 0.6 });
  if (t.arid) rainSteps.push({ label: 'Arid evaporation', why: 'Dry air evaporates light rain before it lands', value: 0.55 });
  if (t.coastal) rainSteps.push({ label: 'Coastal convergence', why: 'Sea breeze meets land air and lifts it', value: 1.08 });
  if (t.urban) rainSteps.push({ label: 'Urban convection', why: 'City heat triggers extra showers', value: 1.06 });
  const rainMult = clamp(rainSteps.reduce((m, x) => m * x.value, 1), 0.3, 2.0);
  const rain = coarse.rainfallMm * rainMult;

  // Wind: gap funnelling, ridge acceleration, valley sheltering, urban canopy friction.
  if (t.windGap) windSteps.push({ label: 'Wind gap funnelling', why: 'A gap in the hills squeezes and speeds up the wind', value: 1.9 });
  if (t.ridge || t.himalayan) windSteps.push({ label: 'Height exposure', why: 'Hilltops sit in faster air', value: 1.25 });
  if (t.valley) windSteps.push({ label: 'Valley shelter', why: 'Surrounding slopes block the wind', value: 1 - p.drainageAccumulation * 0.35 });
  if (t.urban) windSteps.push({ label: 'Building friction', why: 'Buildings slow the wind near the ground', value: 0.75 });
  if (t.arid) windSteps.push({ label: 'Open desert', why: 'Nothing to slow the wind', value: 1.3 });
  if (t.coastal) windSteps.push({ label: 'Sea breeze', why: 'Daily land–sea breeze adds wind', value: 1.12 });
  const wind = coarse.windSpeedKmh * windSteps.reduce((m, x) => m * x.value, 1);

  // Humidity: conserve vapour pressure, re-evaluate saturation at the local mean temperature.
  const coarseMean = (coarse.tempMax + coarse.tempMin) / 2;
  const fineMean = (tMax + tMin) / 2;
  let rh = (coarse.relativeHumidity * satVapourPressure(coarseMean)) / satVapourPressure(fineMean);
  if (t.coastal) rh += 4;
  if (t.urban) rh -= 5;

  return {
    metrics: {
      tempMax: round1(tMax),
      tempMin: round1(tMin),
      rainfallMm: round1(Math.max(0, rain)),
      windSpeedKmh: round1(Math.max(1, wind)),
      relativeHumidity: Math.round(clamp(rh, 10, 97)),
    },
    tmin: tminSteps,
    tmax: tmaxSteps,
    rain: rainSteps,
    wind: windSteps,
    dz,
  };
}

export function downscale(p: PanchayatData, coarse: WeatherMetrics, coarseElevationM = blockElevation(p)): WeatherMetrics {
  return downscaleDetailed(p, coarse, coarseElevationM).metrics;
}

// ---------- multi-day scenario (when no live forecast) ----------

const RAIN_PATTERN = [1, 0.55, 1.35, 0.2, 0, 0.7, 1.15];
const TEMP_PATTERN = [0, 0.6, -0.5, 1.1, 1.6, 0.4, -0.3];

/** A plausible 7-day sequence for a simulated scenario, deterministic per region. */
export function scenarioWeek(p: PanchayatData, scenario: Exclude<Scenario, 'live'>): WeatherMetrics[] {
  const base = scenarioBaseline(p, scenario);
  const j = hashUnit(p.id + 'wk');
  return RAIN_PATTERN.map((_, d) => {
    if (d === 0) return base; // today must match the single-day baseline
    const k = (d + Math.round(Math.abs(j) * 3)) % 7;
    const dt = TEMP_PATTERN[k];
    return {
      tempMax: round1(base.tempMax + dt),
      tempMin: round1(base.tempMin + dt * 0.6),
      rainfallMm: round1(base.rainfallMm * RAIN_PATTERN[k]),
      windSpeedKmh: round1(base.windSpeedKmh * (0.85 + ((k * 37) % 7) / 20)),
      relativeHumidity: Math.round(clamp(base.relativeHumidity + (RAIN_PATTERN[k] - 0.7) * 8, 10, 99)),
    };
  });
}

// ---------- hourly spray window ----------

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 06:00 – 19:00
const WIND_PROFILE = [0.45, 0.5, 0.6, 0.72, 0.85, 0.95, 1.05, 1.12, 1.18, 1.2, 1.12, 0.98, 0.8, 0.65];
const RAIN_PROFILE = [0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.13, 0.15, 0.13, 0.09, 0.05, 0.05];

/** Synthesize a diurnal cycle when no hourly forecast is available. */
export function synthHourly(d: WeatherMetrics): HourlyInput[] {
  return HOURS.map((h, i) => {
    // Temperature: minimum near 06:00, maximum near 14:30
    const phase = Math.cos(((h - 14.5) / 24) * 2 * Math.PI);
    const tempC = d.tempMin + ((phase + 0.87) / 1.87) * (d.tempMax - d.tempMin);
    const rh = clamp(d.relativeHumidity + (1 - (phase + 0.87) / 1.87) * 18 - 9, 10, 100);
    return {
      time: `${String(h).padStart(2, '0')}:00`,
      tempC: round1(tempC),
      windKmh: round1(d.windSpeedKmh * WIND_PROFILE[i]),
      rh: Math.round(rh),
      rainMm: round1(d.rainfallMm * RAIN_PROFILE[i]),
    };
  });
}

/** Re-project a live coarse hourly series onto the fine grid using the daily deltas. */
export function downscaleHourly(coarseHours: HourlyInput[], coarse: WeatherMetrics, fine: WeatherMetrics): HourlyInput[] {
  const windRatio = coarse.windSpeedKmh > 0 ? fine.windSpeedKmh / coarse.windSpeedKmh : 1;
  const rainRatio = coarse.rainfallMm > 0 ? fine.rainfallMm / coarse.rainfallMm : 1;
  const cRange = Math.max(0.5, coarse.tempMax - coarse.tempMin);
  return coarseHours.map((h) => {
    const frac = clamp((h.tempC - coarse.tempMin) / cRange, 0, 1);
    return {
      time: h.time,
      tempC: round1(fine.tempMin + frac * (fine.tempMax - fine.tempMin)),
      windKmh: round1(h.windKmh * windRatio),
      rh: Math.round(clamp(h.rh + (fine.relativeHumidity - coarse.relativeHumidity), 5, 100)),
      rainMm: round1(h.rainMm * rainRatio),
    };
  });
}

/** ICAR / label guidance: no spraying above 15 km/h, in rain, or under strong evaporation. */
export function classifyHours(hours: HourlyInput[]): HourPoint[] {
  return hours.map((h, i) => {
    const nextRain = hours.slice(i, i + 3).reduce((s, x) => s + x.rainMm, 0);
    let status: SprayStatus = 'safe';
    let reason = 'Calm, stable air: good droplet deposition';
    if (h.rainMm >= 0.5 || nextRain >= 2) {
      status = 'danger';
      reason = 'Rain within 2 h: chemical wash-off';
    } else if (h.windKmh > DRIFT_LIMIT_KMH) {
      status = 'danger';
      reason = `Wind ${h.windKmh} km/h: spray drift`;
    } else if (h.tempC >= 33) {
      status = 'caution';
      reason = 'High heat: droplet evaporation';
    } else if (h.windKmh > CAUTION_WIND_KMH) {
      status = 'caution';
      reason = 'Moderate wind: use coarse nozzles';
    } else if (h.windKmh < 2) {
      status = 'caution';
      reason = 'Dead calm: inversion drift risk';
    } else if (h.rh > 95) {
      status = 'caution';
      reason = 'Leaf wetness: dilution risk';
    }
    return { ...h, status, reason };
  });
}

export interface SprayWindow {
  label: string;
  start?: string;
  end?: string;
  hours: number;
}

/** Longest contiguous safe run, e.g. "06:00–10:00". */
export function bestSprayWindow(hours: HourPoint[]): SprayWindow {
  let best: [number, number] | null = null;
  let start = -1;
  hours.forEach((h, i) => {
    if (h.status === 'safe') {
      if (start < 0) start = i;
      if (!best || i - start > best[1] - best[0]) best = [start, i];
    } else start = -1;
  });
  if (!best) return { label: 'No safe window today', hours: 0 };
  const [a, b] = best as [number, number];
  const endHour = parseInt(hours[b].time, 10) + 1;
  const end = `${String(endHour).padStart(2, '0')}:00`;
  return { label: `${hours[a].time}–${end}`, start: hours[a].time, end, hours: b - a + 1 };
}

// ---------- agronomy ----------

/** FAO-56 Hargreaves reference evapotranspiration (mm/day). */
/** `date` is null during the static first render (keeps SSR and hydration identical); mid-year is used then. */
export function referenceET0(latDeg: number, d: WeatherMetrics, date: Date | null) {
  const doy = date ? Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000) : 172;
  const phi = (latDeg * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * doy) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * doy) / 365 - 1.39);
  const ws = Math.acos(clamp(-Math.tan(phi) * Math.tan(delta), -1, 1));
  const ra =
    ((24 * 60) / Math.PI) * 0.082 * dr *
    (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws));
  const raMm = ra * 0.408;
  const tMean = (d.tempMax + d.tempMin) / 2;
  const et0 = 0.0023 * raMm * (tMean + 17.8) * Math.sqrt(Math.max(0, d.tempMax - d.tempMin));
  return round1(Math.max(0, et0));
}

export interface PestRisk {
  level: 'high' | 'moderate' | 'low';
  title: string;
  detail: string;
}

export function pestRisk(p: PanchayatData, crop: string, d: WeatherMetrics): PestRisk {
  const c = crop.toLowerCase();
  const tMean = (d.tempMax + d.tempMin) / 2;
  const wet = d.relativeHumidity >= 85 || d.rainfallMm >= 10;

  if (/paddy|rice/.test(c)) {
    if (d.relativeHumidity >= 90 && d.tempMin >= 20 && d.tempMin <= 26)
      return { level: 'high', title: 'Rice blast (Magnaporthe oryzae)', detail: `RH ${d.relativeHumidity}% with night temperature ${d.tempMin}°C favours blast sporulation. Apply tricyclazole 0.6 g/L; hold back nitrogen top-dressing.` };
    if (wet) return { level: 'moderate', title: 'Sheath blight / BPH build-up', detail: 'Humid canopy. Drain fields for 2–3 days and scout the base of tillers for brown planthopper.' };
  }
  if (/grape|vine/.test(c) && wet && d.tempMin >= 12 && d.tempMin <= 26)
    return { level: 'high', title: 'Downy mildew (Plasmopara viticola)', detail: 'Leaf wetness with mild nights. Spray copper oxychloride or metalaxyl + mancozeb within 24 h.' };
  if (/apple/.test(c) && wet && tMean >= 8 && tMean <= 24)
    return { level: 'high', title: 'Apple scab (Venturia inaequalis)', detail: 'Wet foliage at orchard temperatures. Protectant captan/mancozeb before the next rain.' };
  if (/tea/.test(c) && d.relativeHumidity >= 85)
    return { level: 'high', title: 'Blister blight (Exobasidium vexans)', detail: 'Persistent mist on the bushes. Copper fungicide at 7-day intervals on young flush.' };
  if (/wheat/.test(c) && d.tempMax <= 25 && d.relativeHumidity >= 70)
    return { level: 'moderate', title: 'Yellow rust (Puccinia striiformis)', detail: 'Cool humid days. Scout for yellow stripes; propiconazole 0.1% if seen.' };
  if (/cotton/.test(c) && d.relativeHumidity < 60 && d.tempMax > 32)
    return { level: 'moderate', title: 'Whitefly & pink bollworm', detail: 'Hot and dry. Yellow sticky traps, pheromone traps at 5/acre.' };

  if (d.tempMin <= 4)
    return { level: 'high', title: 'Frost injury', detail: `Night minimum ${d.tempMin}°C. Irrigate in the evening and smoke orchards before dawn.` };
  if (wet && tMean >= 18)
    return { level: 'moderate', title: 'Fungal leaf spot & mildew', detail: `RH ${d.relativeHumidity}% favours fungal spread. Protectant spray in the next dry window.` };
  if (d.relativeHumidity < 40 && d.tempMax >= 35)
    return { level: 'moderate', title: 'Sucking pests (thrips, mites)', detail: 'Hot, dry air favours mites and thrips. Check leaf undersides.' };
  return { level: 'low', title: 'Low pest pressure', detail: 'Weather is unfavourable for major outbreaks. Keep weekly field scouting.' };
}

export function irrigationAdvice(et0: number, d: WeatherMetrics) {
  const deficit = round1(et0 - d.rainfallMm * 0.8); // 80% effective rainfall
  if (d.rainfallMm >= 20) return { action: 'Suspend irrigation', detail: `${d.rainfallMm} mm rain exceeds crop demand (ET₀ ${et0} mm). Clear field drains.`, deficit };
  if (deficit <= 0) return { action: 'Skip irrigation today', detail: `Effective rain (${round1(d.rainfallMm * 0.8)} mm) covers ET₀ ${et0} mm.`, deficit };
  if (deficit > 5) return { action: 'Increase irrigation', detail: `High demand: ${deficit} mm deficit. Drip irrigate after 17:00 to cut evaporation.`, deficit };
  return { action: 'Normal irrigation', detail: `${deficit} mm deficit. Irrigate early morning or evening.`, deficit };
}
