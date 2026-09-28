'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Printer, X, CloudRain, Snowflake, Wind } from 'lucide-react';
import { PanchayatData } from '@/data/all_india_regions';

interface Props {
  panchayat: PanchayatData;
  selectedCrop: string;
  fineMetrics: {
    rainfallMm: number;
    tempMin: number;
    tempMax: number;
    windSpeedKmh: number;
    relativeHumidity: number;
  };
  coarseMetrics: {
    rainfallMm: number;
    tempMin: number;
    tempMax: number;
    windSpeedKmh: number;
  };
}

/** Bar showing how close a value is to its insurance trigger. */
function Gauge({ value, trigger, inverse }: { value: number; trigger: number; inverse?: boolean }) {
  // For frost the danger direction is downward: map 20°C → 0 %, trigger → 100 %.
  const pct = inverse ? ((20 - value) / (20 - trigger)) * 100 : (value / trigger) * 100;
  const clamped = Math.max(2, Math.min(100, pct));
  const tone = pct >= 100 ? 'bg-bad' : pct >= 70 ? 'bg-warn' : 'bg-good';
  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-raised">
        <div className={`h-full rounded-full ${tone} transition-all`} style={{ width: `${clamped}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-muted">{Math.round(Math.max(0, pct))}% of the way to the trigger</div>
    </div>
  );
}

export default function PMFBYInsuranceModal({ panchayat, selectedCrop, fineMetrics, coarseMetrics }: Props) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [sha256, setSha256] = useState('');

  // Weather-index thresholds per crop
  const excessRainThreshold = selectedCrop.includes('Paddy') ? 60.0 : selectedCrop.includes('Wheat') ? 30.0 : 35.0;
  const frostThreshold = selectedCrop.includes('Apple') ? 0.0 : 3.5;
  const windThreshold = 35.0;

  const rainBreached = fineMetrics.rainfallMm >= excessRainThreshold;
  const frostBreached = fineMetrics.tempMin <= frostThreshold;
  const windBreached = fineMetrics.windSpeedKmh >= windThreshold;

  const isEligible = rainBreached || frostBreached || windBreached;
  const payoutPct = (rainBreached && fineMetrics.rainfallMm > excessRainThreshold * 1.4) || (frostBreached && fineMetrics.tempMin < 1.0) ? 100 : 70;

  // Breach visible at 1.2 km but missed by the 18 km block value
  const hasDiscrepancy =
    (rainBreached && coarseMetrics.rainfallMm < excessRainThreshold) ||
    (frostBreached && coarseMetrics.tempMin > frostThreshold) ||
    (windBreached && coarseMetrics.windSpeedKmh < windThreshold);

  const today = new Date().toISOString().slice(0, 10);
  const certId = `AA-${today.replace(/-/g, '')}-${panchayat.district.slice(0, 3).toUpperCase()}-${panchayat.id.split('_').pop()}`;

  // Real SHA-256 over the certificate payload so any edit to the values changes the checksum.
  useEffect(() => {
    if (!showCertificate || !globalThis.crypto?.subtle) return;
    const payload = JSON.stringify({ certId, panchayat: panchayat.id, crop: selectedCrop, fineMetrics, coarseMetrics, date: today });
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload)).then((buf) => {
      setSha256(Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });
  }, [showCertificate, certId, panchayat.id, selectedCrop, fineMetrics, coarseMetrics, today]);

  useEffect(() => {
    if (!showCertificate) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowCertificate(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showCertificate]);

  const triggers = [
    { icon: CloudRain, label: 'Excess rain', unit: 'mm', fine: fineMetrics.rainfallMm, coarse: coarseMetrics.rainfallMm, trigger: excessRainThreshold, sign: '≥', breached: rainBreached, inverse: false },
    { icon: Snowflake, label: 'Frost', unit: '°C', fine: fineMetrics.tempMin, coarse: coarseMetrics.tempMin, trigger: frostThreshold, sign: '≤', breached: frostBreached, inverse: true },
    { icon: Wind, label: 'Wind lodging', unit: 'km/h', fine: fineMetrics.windSpeedKmh, coarse: coarseMetrics.windSpeedKmh, trigger: windThreshold, sign: '≥', breached: windBreached, inverse: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Verdict */}
      <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 ${isEligible ? 'bg-bad/10' : 'bg-good/10'}`}>
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl ${isEligible ? 'bg-bad/20 text-bad' : 'bg-good/20 text-good'}`}>
            {isEligible ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </span>
          <div>
            <div className="text-base font-semibold text-ink">
              {isEligible ? `Weather trigger breached · ${payoutPct}% indicative payout` : 'No insurance trigger breached today'}
            </div>
            <div className="text-sm text-ink2">
              {selectedCrop} in {panchayat.name} · PMFBY weather-index (WBCIS) check
            </div>
          </div>
        </div>
        <button onClick={() => setShowCertificate(true)} className="btn-primary">
          <FileText className="h-4 w-4" /> Evidence report
        </button>
      </div>

      {/* Trigger gauges */}
      <div className="grid gap-3 md:grid-cols-3">
        {triggers.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="rounded-2xl bg-surface2 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-ink2">
                  <Icon className="h-4 w-4" /> {t.label}
                </span>
                <span className="text-xs text-muted">
                  trigger {t.sign} {t.trigger} {t.unit}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl text-ink tabular">{t.fine}</span>
                <span className="text-sm text-muted">{t.unit} at 1.2 km</span>
              </div>
              <div className="text-xs text-muted">
                Block forecast: {t.coarse} {t.unit}
              </div>
              <Gauge value={t.fine} trigger={t.trigger} inverse={t.inverse} />
            </div>
          );
        })}
      </div>

      {hasDiscrepancy && (
        <div className="flex items-start gap-3 rounded-2xl bg-warn/10 p-4 text-sm text-ink2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <p>
            <strong className="text-ink">The district forecast missed this.</strong> The 18 km block value stays below the trigger, but terrain-downscaled weather for this
            village crosses it. PMFBY lets farmers report localized calamities individually; this report is supporting evidence.
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted">
        Why it matters: crop-insurance claims are judged against the nearest weather station, often 20–30 km away. A frost hollow or a cloudburst on one hillside can
        wipe out a crop without the station ever recording it.
      </p>

      {showCertificate &&
        createPortal(
          <div className="fixed inset-0 z-[2000] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowCertificate(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Weather-index claim evidence report"
              onClick={(e) => e.stopPropagation()}
              className="pmfby-certificate-sheet relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#FBFAF6] p-8 text-slate-900 shadow-pop animate-fade-in"
            >
              <button onClick={() => setShowCertificate(false)} aria-label="Close report" className="pmfby-no-print absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-5 pr-10">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Weather-index claim evidence</div>
                  <h2 className="mt-1 font-display text-3xl text-slate-900">{panchayat.name}</h2>
                  <p className="text-sm text-slate-600">
                    {panchayat.district}, {panchayat.state} · {panchayat.elevationM} m · {selectedCrop}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>Report ID</div>
                  <div className="font-mono text-slate-800">{certId}</div>
                  <div className="mt-1">{today}</div>
                </div>
              </div>

              <table className="mt-6 w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
                    <th className="pb-2 font-medium">Index</th>
                    <th className="pb-2 text-right font-medium">Block 18 km</th>
                    <th className="pb-2 text-right font-medium">Village 1.2 km</th>
                    <th className="pb-2 text-right font-medium">Trigger</th>
                    <th className="pb-2 text-right font-medium">Result</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {triggers.map((t) => (
                    <tr key={t.label} className="border-b border-slate-200">
                      <td className="py-3">{t.label}</td>
                      <td className="py-3 text-right text-slate-500">
                        {t.coarse} {t.unit}
                      </td>
                      <td className="py-3 text-right font-semibold">
                        {t.fine} {t.unit}
                      </td>
                      <td className="py-3 text-right text-slate-500">
                        {t.sign} {t.trigger} {t.unit}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${t.breached ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                          {t.breached ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {t.breached ? 'Breached' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 rounded-xl bg-slate-100 p-4 text-sm leading-relaxed text-slate-700">
                <strong className="text-slate-900">Determination: </strong>
                {isEligible
                  ? `A weather-index trigger was breached at 1.2 km resolution${hasDiscrepancy ? ', which the 18 km block value did not record' : ''}. Indicative payout ${payoutPct}% of sum insured.`
                  : 'No weather-index trigger was breached at either block or village resolution. Indicative payout 0%.'}
              </div>

              <div className="mt-6 flex items-end justify-between gap-6 border-t border-slate-300 pt-4 text-xs text-slate-500">
                <div className="min-w-0 flex-1">
                  <div>SHA-256 of report data</div>
                  <div className="break-all font-mono text-[10px] text-slate-700">{sha256 || 'computing…'}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-display text-base text-slate-900">AeroAgro AI</div>
                  <div>Supporting evidence, not an insurer’s decision</div>
                </div>
              </div>

              <div className="pmfby-no-print mt-6 flex justify-end gap-2">
                <button onClick={() => window.print()} className="btn border border-slate-300 bg-white text-slate-800 hover:bg-slate-100">
                  <Printer className="h-4 w-4" /> Print / save PDF
                </button>
                <button onClick={() => setShowCertificate(false)} className="btn bg-slate-900 text-white hover:bg-slate-800">
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
