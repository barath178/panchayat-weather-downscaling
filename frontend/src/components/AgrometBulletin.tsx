'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, Sprout, Droplets, Bug, Tractor, Beef, MessageSquareText, CloudSun } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { PanchayatData } from '@/data/all_india_regions';
import { PestRisk, WeatherMetrics, irrigationAdvice, pestRisk, referenceET0 } from '@/lib/microclimate';
import { DayOutlook, bestSprayDay, dateOf, dayLabel, dryRun, rainClass, shortDate, sum } from '@/lib/week';

interface Props {
  panchayat: PanchayatData;
  crop: string;
  week: DayOutlook[];
  now: Date | null;
  isLive: boolean;
  coarseElevationM: number;
  onClose: () => void;
}

const LEVEL_TONE: Record<PestRisk['level'], string> = {
  high: 'bg-red-100 text-red-700',
  moderate: 'bg-amber-100 text-amber-800',
  low: 'bg-emerald-100 text-emerald-800',
};

function cloudClass(d: WeatherMetrics) {
  if (d.rainfallMm >= 15.6) return 'Overcast';
  if (d.rainfallMm >= 2.5) return 'Cloudy';
  if (d.relativeHumidity >= 80) return 'Partly cloudy';
  return 'Mainly clear';
}

function Section({ icon: I, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h3 className="flex items-center gap-2 border-b border-slate-300 pb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
        <I className="h-4 w-4 text-emerald-700" /> {title}
      </h3>
      <div className="mt-2.5 text-[13px] leading-relaxed text-slate-800">{children}</div>
    </section>
  );
}

export default function AgrometBulletin({ panchayat: p, crop, week, now, isLive, coarseElevationM, onClose }: Props) {
  const days = useMemo(() => week.slice(0, 5), [week]);
  const [sha, setSha] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const issued = now ?? new Date();
  const stamp = `${issued.getFullYear()}${String(issued.getMonth() + 1).padStart(2, '0')}${String(issued.getDate()).padStart(2, '0')}`;
  const bulletinNo = `AA/${p.state.slice(0, 2).toUpperCase()}/${p.district.slice(0, 3).toUpperCase()}/${stamp}`;

  const plan = useMemo(() => {
    const total = sum(days.map((d) => d.fine.rainfallMm));
    const blockTotal = sum(days.map((d) => d.coarse.rainfallMm));
    const rainy = days.filter((d) => d.fine.rainfallMm >= 2.5);
    const heavy = days.findIndex((d) => d.fine.rainfallMm >= 64.5);
    const tmax = Math.max(...days.map((d) => d.fine.tempMax));
    const tmin = Math.min(...days.map((d) => d.fine.tempMin));
    const best = bestSprayDay(days);
    const dry = dryRun(days);
    const label = (i: number) => `${dayLabel(days[i], i, 'en', 'long')}${days[i].date ? ` (${shortDate(days[i])})` : ''}`;

    // Water balance over the 5 days (FAO-56 Hargreaves, 80 % effective rain)
    const et0 = days.map((d, i) => referenceET0(p.lat, d.fine, d.date ? dateOf(d.date) : now ? new Date(now.getTime() + i * 86400000) : null));
    const et0Total = sum(et0);
    const balance = Math.round((total * 0.8 - et0Total) * 10) / 10;
    const today = irrigationAdvice(et0[0], days[0].fine);

    const summary = [
      total < 1 ? 'Dry weather is likely over the next five days.' : `${total} mm of rain is expected over ${rainy.length} of the next five days (district block forecast: ${blockTotal} mm).`,
      heavy >= 0 ? `Heavy rain (${days[heavy].fine.rainfallMm} mm) is likely on ${label(heavy)}.` : '',
      `Day temperatures up to ${tmax}°C, night lows down to ${tmin}°C at ${p.elevationM} m.`,
      tmin <= 4 ? 'Frost is possible in low-lying fields on clear nights.' : '',
      tmax >= 40 ? 'Heat-wave conditions are possible in the afternoons.' : '',
    ].filter(Boolean);

    const field: string[] = [];
    if (best >= 0) field.push(`Spray pesticides on ${label(best)} between ${days[best].spray.label}, when wind stays below 15 km/h and no rain is due.`);
    else field.push('No safe spraying window in the next five days; postpone chemical applications or use rain-fast formulations.');
    if (dry) field.push(`Harvest mature crops and dry the produce during the dry spell from ${label(dry[0])} to ${label(dry[1])}.`);
    else field.push('Keep harvested produce under cover; no two consecutive dry days are expected.');
    const wet = days.slice(0, 3).findIndex((d) => d.fine.rainfallMm >= 20);
    field.push(wet >= 0 ? `Postpone urea and fertilizer until after ${label(wet)} to avoid nitrogen loss.` : 'Top-dress nitrogen in the evening, followed by light irrigation.');
    if (heavy >= 0) field.push('Open field drains and bunds before the heavy rain to prevent waterlogging.');

    const irrigation = [
      `Crop water demand (ET₀) is about ${et0Total} mm over five days against ${Math.round(total * 0.8 * 10) / 10} mm of effective rain: ${balance >= 0 ? `a surplus of ${balance} mm` : `a deficit of ${Math.abs(balance)} mm`}.`,
      `Today: ${today.action.toLowerCase()}. ${today.detail}`,
    ];

    const crops = Array.from(new Set([crop, ...p.primaryCrops])).slice(0, 3);
    const cropAdvice = crops.map((c) => {
      // Worst risk across the first three days
      const risks = days.slice(0, 3).map((d) => pestRisk(p, c, d.fine));
      const order = { high: 0, moderate: 1, low: 2 } as const;
      return { crop: c, risk: risks.sort((a, b) => order[a.level] - order[b.level])[0] };
    });

    const livestock: string[] = [];
    if (tmax >= 35) livestock.push('Keep animals in shade between 11:00 and 16:00; give cool drinking water three to four times a day.');
    if (tmin <= 8) livestock.push('Cover sheds on the windward side at night and use dry bedding.');
    if (total >= 20) livestock.push('Keep sheds dry and drained; deworm animals after the rain spell and watch for foot rot.');
    if (!livestock.length) livestock.push('Provide clean drinking water and green fodder; keep up the routine vaccination schedule.');

    const sms = `${p.name.toUpperCase()} 5-day: rain ${total}mm, ${tmin}-${tmax}C. ${best >= 0 ? `Spray ${dayLabel(days[best], best, 'en', 'short')} ${days[best].spray.label}` : 'No spraying'}. ${
      heavy >= 0 ? 'Heavy rain: drain fields.' : dry ? 'Harvest in dry spell.' : 'Cover produce.'
    } -AeroAgro`;

    return { summary, field, irrigation, cropAdvice, livestock, sms, et0 };
  }, [days, p, crop, now]);

  useEffect(() => {
    if (!globalThis.crypto?.subtle) return;
    const payload = JSON.stringify({ bulletinNo, p: p.id, crop, days: days.map((d) => [d.date, d.fine, d.coarse]) });
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload)).then((b) =>
      setSha(Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join(''))
    );
  }, [bulletinNo, p.id, crop, days]);

  const rows: { label: string; unit: string; get: (d: DayOutlook) => React.ReactNode; block?: (d: DayOutlook) => React.ReactNode }[] = [
    { label: 'Rainfall', unit: 'mm', get: (d) => d.fine.rainfallMm, block: (d) => d.coarse.rainfallMm },
    { label: 'Max temperature', unit: '°C', get: (d) => d.fine.tempMax, block: (d) => d.coarse.tempMax },
    { label: 'Min temperature', unit: '°C', get: (d) => d.fine.tempMin, block: (d) => d.coarse.tempMin },
    { label: 'Relative humidity', unit: '%', get: (d) => d.fine.relativeHumidity },
    { label: 'Wind speed', unit: 'km/h', get: (d) => d.fine.windSpeedKmh, block: (d) => d.coarse.windSpeedKmh },
    {
      label: 'Cloud / rain class',
      unit: '',
      get: (d) => {
        const s = d.fine.rainfallMm >= 0.1 ? rainClass(d.fine.rainfallMm).en : cloudClass(d.fine);
        return s[0].toUpperCase() + s.slice(1);
      },
    },
    { label: 'Spray window', unit: '', get: (d) => (d.spray.hours > 0 ? d.spray.label : 'Not advised') },
  ];

  return createPortal(
    <div className="print-root fixed inset-0 z-[2000] flex justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <article
        role="dialog"
        aria-modal="true"
        aria-label="Agromet advisory bulletin"
        onClick={(e) => e.stopPropagation()}
        className="pmfby-certificate-sheet relative h-fit w-full max-w-3xl rounded-2xl bg-[#FBFAF6] p-6 text-slate-900 shadow-pop animate-fade-in sm:p-9"
      >
        <div className="pmfby-no-print absolute right-4 top-4 flex gap-2">
          <button onClick={() => window.print()} className="btn h-9 border border-slate-300 bg-white px-3 text-slate-800 hover:bg-slate-100">
            <Printer className="h-4 w-4" /> Print / PDF
          </button>
          <button onClick={onClose} aria-label="Close bulletin" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Masthead */}
        <header className="border-b-2 border-slate-900 pb-4 pr-0 sm:pr-44">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">Gram Panchayat Agromet Advisory · GKMS format</div>
          <h2 className="mt-1 font-display text-3xl leading-tight text-slate-900">{p.name}</h2>
          <p className="text-sm text-slate-600">
            {p.regionalName ? `${p.regionalName} · ` : ''}
            {p.district}, {p.state}
          </p>
        </header>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-4">
          {[
            ['Bulletin no.', bulletinNo],
            ['Issued', issued.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
            ['Valid for', '5 days'],
            ['Resolution', '1.2 km (block 18 km)'],
            ['Location', `${p.lat.toFixed(3)}°N, ${p.lng.toFixed(3)}°E`],
            ['Elevation', `${p.elevationM} m (block ${Math.round(coarseElevationM)} m)`],
            ['Crops', Array.from(new Set([crop, ...p.primaryCrops])).slice(0, 3).join(', ')],
            ['Source', isLive ? 'Open-Meteo NWP, live' : 'Simulated scenario'],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-slate-500">{k}</dt>
              <dd className="truncate font-medium text-slate-900" title={v}>
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <Section icon={CloudSun} title="Weather summary">
          <p>{plan.summary.join(' ')}</p>
        </Section>

        {/* Forecast table */}
        <section className="mt-6 break-inside-avoid">
          <h3 className="border-b border-slate-300 pb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">Five-day panchayat forecast</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[560px] text-[12.5px] tabular">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-2 font-medium">Parameter</th>
                  {days.map((d, i) => (
                    <th key={i} className="py-2 text-center font-medium">
                      <div className="text-slate-900">{dayLabel(d, i, 'en', 'short')}</div>
                      <div className="text-[10.5px]">{shortDate(d)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-slate-200 align-top">
                    <td className="py-2 pr-2 text-slate-600">
                      {r.label}
                      {r.unit && <span className="text-slate-400"> ({r.unit})</span>}
                    </td>
                    {days.map((d, i) => (
                      <td key={i} className="py-2 text-center">
                        <div className="font-semibold text-slate-900">{r.get(d)}</div>
                        {r.block && <div className="text-[10.5px] text-slate-400">block {r.block(d)}</div>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Section icon={Tractor} title="Field operations">
          <ul className="list-disc space-y-1 pl-5">
            {plan.field.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section icon={Droplets} title="Irrigation">
          <ul className="list-disc space-y-1 pl-5">
            {plan.irrigation.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section icon={Bug} title="Crop-specific plant protection">
          <div className="grid gap-2 sm:grid-cols-3">
            {plan.cropAdvice.map(({ crop: c, risk }) => (
              <div key={c} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Sprout className="h-3.5 w-3.5 text-emerald-700" /> {c}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${LEVEL_TONE[risk.level]}`}>{risk.level}</span>
                </div>
                <div className="mt-1.5 text-[12px] font-medium text-slate-800">{risk.title}</div>
                <div className="mt-0.5 text-[11.5px] leading-snug text-slate-600">{risk.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Beef} title="Livestock">
          <ul className="list-disc space-y-1 pl-5">
            {plan.livestock.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section icon={MessageSquareText} title="SMS advisory">
          <div className="flex flex-wrap items-center gap-4">
            <p className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2 font-mono text-[12px] text-slate-800">{plan.sms}</p>
            <span className="text-[11px] text-slate-500 tabular">{plan.sms.length} / 160 chars</span>
          </div>
        </Section>

        <footer className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-slate-300 pt-4">
          <div className="min-w-0 flex-1 text-[11px] text-slate-500">
            <div className="font-display text-base text-slate-900">AeroAgro AI</div>
            <p className="mt-0.5 max-w-md">
              Block-to-panchayat downscaled advisory for decision support. Not an official IMD / GKMS bulletin; follow your KVK and district agromet unit for
              official advisories.
            </p>
            <div className="mt-2">SHA-256</div>
            <div className="break-all font-mono text-[9.5px] text-slate-700">{sha || 'computing…'}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-[11px] text-slate-500">
              Scan to share
              <br />
              on WhatsApp
            </div>
            <QRCodeSVG value={`https://wa.me/?text=${encodeURIComponent(plan.sms)}`} size={84} bgColor="#FBFAF6" fgColor="#0f172a" level="M" />
          </div>
        </footer>
      </article>
    </div>,
    document.body
  );
}
