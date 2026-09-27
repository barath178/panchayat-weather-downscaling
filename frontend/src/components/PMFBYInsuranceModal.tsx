'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, QrCode, Printer, X } from 'lucide-react';
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

export default function PMFBYInsuranceModal({
  panchayat,
  selectedCrop,
  fineMetrics,
  coarseMetrics,
}: Props) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [sha256, setSha256] = useState('');

  // WBCIS Parametric Thresholds for crop
  const excessRainThreshold = selectedCrop.includes('Paddy') ? 60.0 : selectedCrop.includes('Wheat') ? 30.0 : 35.0;
  const frostThreshold = selectedCrop.includes('Apple') ? 0.0 : 3.5;
  const windThreshold = 35.0;

  // Breach checks
  const rainBreached = fineMetrics.rainfallMm >= excessRainThreshold;
  const frostBreached = fineMetrics.tempMin <= frostThreshold;
  const windBreached = fineMetrics.windSpeedKmh >= windThreshold;

  const isEligible = rainBreached || frostBreached || windBreached;
  const payoutPct = (rainBreached && fineMetrics.rainfallMm > excessRainThreshold * 1.4) || (frostBreached && fineMetrics.tempMin < 1.0) ? 100 : 70;

  // Discrepancy between AWS (coarse) and Downscaled (fine)
  const hasDiscrepancy = (rainBreached && coarseMetrics.rainfallMm < excessRainThreshold) ||
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

  const auditRows = [
    { label: '24 h rainfall', c: `${coarseMetrics.rainfallMm} mm`, f: `${fineMetrics.rainfallMm} mm`, trig: `≥ ${excessRainThreshold} mm`, breached: rainBreached },
    { label: 'Night frost (Tmin)', c: `${coarseMetrics.tempMin}°C`, f: `${fineMetrics.tempMin}°C`, trig: `≤ ${frostThreshold}°C`, breached: frostBreached },
    { label: 'Wind (lodging)', c: `${coarseMetrics.windSpeedKmh} km/h`, f: `${fineMetrics.windSpeedKmh} km/h`, trig: `≥ ${windThreshold} km/h`, breached: windBreached },
  ];

  return (
    <div className="orchids-glass rounded-2xl p-5 shadow-orchids-card border border-white/10 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              PMFBY Parametric Crop Insurance Verifier
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                Weather-index (WBCIS)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Checks weather-index triggers at 1.2 km vs the 18 km block value, as evidence for PMFBY localized-calamity claims
            </p>
          </div>
        </div>

        {isEligible ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            PARAMETRIC TRIGGER BREACHED ({payoutPct}% PAYOUT)
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            WITHIN NORMAL WBCIS BOUNDS
          </div>
        )}
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Insured Panchayat</span>
          <strong className="text-white text-xs block truncate">{panchayat.name}</strong>
          <span className="text-[10px] text-slate-500">{panchayat.elevationM}m MSL • {panchayat.state}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Insured Crop</span>
          <strong className="text-emerald-400 text-xs block">{selectedCrop}</strong>
          <span className="text-[10px] text-slate-500">Thresholds per crop</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Claim Status</span>
          <strong className={isEligible ? 'text-rose-400' : 'text-emerald-400'}>
            {isEligible ? 'Calamity Validated' : 'No Breach Recorded'}
          </strong>
          <span className="text-[10px] text-slate-500">{isEligible ? `${payoutPct}% Indemnity` : 'Safe Bounds'}</span>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Claim Certificate
          </button>
        </div>
      </div>

      {/* Parametric Comparison Grid */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Parametric Weather Index Triggers</span>
          <span className="text-cyan-400 font-mono text-[10px]">Grid Resolution: 1.2 km² (SRTM 30m)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Rainfall Index */}
          <div className={`p-3 rounded-xl border transition-all ${rainBreached ? 'bg-rose-500/10 border-rose-500/40' : 'bg-white/5 border-white/5'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-300">🌧️ 24h Precipitation</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${rainBreached ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                Trigger &ge; {excessRainThreshold}mm
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Downscaled (1.2km)</span>
                <span className="text-base font-bold text-white">{fineMetrics.rainfallMm} mm</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">District AWS (18km)</span>
                <span className="text-xs text-slate-400">{coarseMetrics.rainfallMm} mm</span>
              </div>
            </div>
          </div>

          {/* Frost Index */}
          <div className={`p-3 rounded-xl border transition-all ${frostBreached ? 'bg-rose-500/10 border-rose-500/40' : 'bg-white/5 border-white/5'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-300">❄️ Night Frost (Tmin)</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${frostBreached ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                Trigger &le; {frostThreshold}°C
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Downscaled (1.2km)</span>
                <span className="text-base font-bold text-white">{fineMetrics.tempMin}°C</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">District AWS (18km)</span>
                <span className="text-xs text-slate-400">{coarseMetrics.tempMin}°C</span>
              </div>
            </div>
          </div>

          {/* Wind Lodging Index */}
          <div className={`p-3 rounded-xl border transition-all ${windBreached ? 'bg-rose-500/10 border-rose-500/40' : 'bg-white/5 border-white/5'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-300">💨 Peak Wind Lodging</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${windBreached ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                Trigger &ge; {windThreshold}km/h
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Downscaled (1.2km)</span>
                <span className="text-base font-bold text-white">{fineMetrics.windSpeedKmh} km/h</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">District AWS (18km)</span>
                <span className="text-xs text-slate-400">{coarseMetrics.windSpeedKmh} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy forensic alert */}
      {hasDiscrepancy && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Block vs panchayat discrepancy:</strong> the 18 km block value stays below the trigger, but terrain-downscaled weather for this 1.2 km area crosses it. This is the kind of localized event PMFBY allows farmers to report individually; attach this report as supporting evidence.
          </div>
        </div>
      )}

      {/* Modal Popup for Certificate */}
      {showCertificate && createPortal(
        <div className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowCertificate(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="PMFBY claim evidence certificate"
            onClick={(e) => e.stopPropagation()}
            className="pmfby-certificate-sheet relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 text-white shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-fade-in"
          >
            {/* Close */}
            <button
              onClick={() => setShowCertificate(false)}
              aria-label="Close certificate"
              className="pmfby-no-print absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-wide text-white">
                  Weather-Index Claim Evidence Report
                </h2>
                <h4 className="text-xs font-semibold text-emerald-400">
                  For PMFBY / WBCIS localized-calamity claims
                </h4>
                <p className="text-[10px] text-slate-400">
                  Generated by AeroAgro AI · Certificate ID {certId}
                </p>
              </div>
            </div>

            {/* Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px]">
              <div>
                <span className="text-[9px] text-slate-400 block">Certificate ID</span>
                <strong className="text-cyan-300 font-mono text-[10px]">{certId}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Insured Panchayat</span>
                <strong className="text-white">{panchayat.name}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Insured Crop</span>
                <strong className="text-emerald-400">{selectedCrop}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Elevation MSL</span>
                <strong className="text-white">{panchayat.elevationM} meters</strong>
              </div>
            </div>

            {/* Scientific Forensic Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-emerald-500/10 text-emerald-300 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-2.5">Parameter</th>
                    <th className="p-2.5">District AWS (18km)</th>
                    <th className="p-2.5">Panchayat Fine (1.2km)</th>
                    <th className="p-2.5">Trigger</th>
                    <th className="p-2.5">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {auditRows.map((r) => (
                    <tr key={r.label}>
                      <td className="p-2.5 font-medium">{r.label}</td>
                      <td className="p-2.5 text-slate-400">{r.c}</td>
                      <td className="p-2.5 text-white font-bold">{r.f}</td>
                      <td className="p-2.5">{r.trig}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.breached ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {r.breached ? 'BREACHED' : 'NORMAL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Finding */}
            <div className={`p-3 rounded-xl border text-xs text-slate-200 leading-relaxed ${isEligible ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <strong>Audit determination:</strong>{' '}
              {isEligible
                ? `Localized weather-index trigger breached at 1.2 km resolution${hasDiscrepancy ? ' that the 18 km block value did not record' : ''}. Evidence supports a localized-calamity claim.`
                : 'No weather-index trigger was breached at either block or panchayat resolution.'}
              <br />
              <strong>Indicative payout:</strong>{' '}
              <span className="font-bold text-sm">{isEligible ? `${payoutPct}% of sum insured` : '0% (no calamity)'}</span>
            </div>

            {/* Footer QR & Seal */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 min-w-0">
                <QrCode className="w-10 h-10 text-white p-1 bg-white/10 rounded-lg shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px]">SHA-256 of certificate data · {today}</span>
                  <span className="font-mono text-[9px] text-slate-500 break-all block">{sha256 || 'computing…'}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-emerald-400 text-xs">AeroAgro AI evidence report</div>
                <div className="text-[10px]">Supporting document, not an insurer decision</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pmfby-no-print flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold"
              >
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
