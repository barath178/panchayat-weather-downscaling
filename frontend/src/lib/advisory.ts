import type { PanchayatData } from '@/data/all_india_regions';
import type { PestRisk, WeatherMetrics } from './microclimate';

export type Lang = 'en' | 'hi' | 'ta';

export const LANGS: { id: Lang; label: string; speech: string }[] = [
  { id: 'en', label: 'English', speech: 'en-IN' },
  { id: 'hi', label: 'हिन्दी', speech: 'hi-IN' },
  { id: 'ta', label: 'தமிழ்', speech: 'ta-IN' },
];

const T = {
  en: {
    header: 'AGROMET ADVISORY',
    crop: 'Crop',
    forecast: 'Downscaled forecast (1.2 km)',
    temp: 'Temperature',
    rain: 'Rain',
    wind: 'Wind',
    rh: 'Humidity',
    spray: 'Safe spray window',
    noSpray: 'Do not spray today',
    irrigation: 'Irrigation',
    pest: 'Pest / disease risk',
    frost: 'FROST ALERT: night minimum {t}°C. Irrigate in the evening and smoke orchards before dawn.',
    heat: 'HEAT ALERT: {t}°C. Irrigate crops and avoid field work 12:00–15:00.',
    footer: 'AeroAgro AI • Gram Panchayat weather service',
    to: 'to',
  },
  hi: {
    header: 'कृषि मौसम सलाह',
    crop: 'फसल',
    forecast: 'स्थानीय पूर्वानुमान (1.2 किमी)',
    temp: 'तापमान',
    rain: 'वर्षा',
    wind: 'हवा',
    rh: 'नमी',
    spray: 'छिड़काव का सुरक्षित समय',
    noSpray: 'आज छिड़काव न करें',
    irrigation: 'सिंचाई',
    pest: 'कीट / रोग जोखिम',
    frost: 'पाला चेतावनी: रात का न्यूनतम तापमान {t}°C। शाम को सिंचाई करें और भोर से पहले धुआँ करें।',
    heat: 'लू चेतावनी: {t}°C। फसलों की सिंचाई करें, 12 से 3 बजे तक खेत में काम न करें।',
    footer: 'AeroAgro AI • ग्राम पंचायत मौसम सेवा',
    to: 'से',
  },
  ta: {
    header: 'வேளாண் வானிலை ஆலோசனை',
    crop: 'பயிர்',
    forecast: 'உள்ளூர் முன்னறிவிப்பு (1.2 கி.மீ)',
    temp: 'வெப்பநிலை',
    rain: 'மழை',
    wind: 'காற்று',
    rh: 'ஈரப்பதம்',
    spray: 'பாதுகாப்பான தெளிப்பு நேரம்',
    noSpray: 'இன்று தெளிக்க வேண்டாம்',
    irrigation: 'நீர்ப்பாசனம்',
    pest: 'பூச்சி / நோய் அபாயம்',
    frost: 'பனி எச்சரிக்கை: இரவு குறைந்தபட்சம் {t}°C. மாலையில் நீர் பாய்ச்சவும்.',
    heat: 'வெப்ப எச்சரிக்கை: {t}°C. பயிர்களுக்கு நீர் பாய்ச்சவும்; மதியம் 12–3 வயல் வேலை தவிர்க்கவும்.',
    footer: 'AeroAgro AI • கிராம ஊராட்சி வானிலை சேவை',
    to: 'முதல்',
  },
} as const;

const IRRIGATION: Record<string, Record<Lang, string>> = {
  'Suspend irrigation': { en: 'Suspend irrigation', hi: 'सिंचाई रोकें', ta: 'நீர்ப்பாசனத்தை நிறுத்தவும்' },
  'Skip irrigation today': { en: 'Skip irrigation today', hi: 'आज सिंचाई न करें', ta: 'இன்று நீர் பாய்ச்ச வேண்டாம்' },
  'Increase irrigation': { en: 'Increase irrigation (evening drip)', hi: 'सिंचाई बढ़ाएँ (शाम को ड्रिप)', ta: 'நீர்ப்பாசனத்தை அதிகரிக்கவும் (மாலை சொட்டு நீர்)' },
  'Normal irrigation': { en: 'Normal irrigation schedule', hi: 'सामान्य सिंचाई', ta: 'வழக்கமான நீர்ப்பாசனம்' },
};

export interface AdvisoryInput {
  panchayat: PanchayatData;
  crop: string;
  fine: WeatherMetrics;
  sprayWindow: { label: string; start?: string; end?: string; hours: number };
  irrigationAction: string;
  pest: PestRisk;
}

export function buildAdvisory(a: AdvisoryInput, lang: Lang) {
  const t = T[lang];
  const { fine: f, panchayat: p } = a;
  const place = lang === 'en' ? p.name.toUpperCase() : p.regionalName || p.name;
  const spray = a.sprayWindow.hours > 0 ? `${a.sprayWindow.start} ${t.to} ${a.sprayWindow.end}` : t.noSpray;
  const alerts: string[] = [];
  if (f.tempMin <= 4) alerts.push(`⚠️ ${t.frost.replace('{t}', String(f.tempMin))}`);
  if (f.tempMax >= 40) alerts.push(`🔥 ${t.heat.replace('{t}', String(f.tempMax))}`);

  const lines = [
    `🌾 *${t.header}: ${place}*`,
    `📍 ${p.district}, ${p.state} • ${p.elevationM} m`,
    `🌱 ${t.crop}: ${a.crop}`,
    '',
    `📊 *${t.forecast}*`,
    `• ${t.temp}: ${f.tempMin}–${f.tempMax}°C`,
    `• ${t.rain}: ${f.rainfallMm} mm  • ${t.rh}: ${f.relativeHumidity}%`,
    `• ${t.wind}: ${f.windSpeedKmh} km/h`,
    '',
    `🚜 ${t.spray}: ${spray}`,
    `💧 ${t.irrigation}: ${IRRIGATION[a.irrigationAction]?.[lang] ?? a.irrigationAction}`,
    `🐛 ${t.pest}: ${a.pest.title}`,
    ...(alerts.length ? ['', ...alerts] : []),
    '',
    `_${t.footer}_`,
  ];
  return lines.join('\n');
}

/** Strip emoji / markdown so speech engines read cleanly. */
export function toSpeech(text: string) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[*_•]/g, '')
    .replace(/–/g, ' to ')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}
