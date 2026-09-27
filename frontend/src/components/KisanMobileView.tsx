'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Droplets, Wind, Thermometer, MapPin, Sprout, Bug, Share2 } from 'lucide-react';
import VoiceAdvisory from './VoiceAdvisory';
import type { AdvisoryViewProps } from '@/lib/viewProps';

const STATUS_COLOR = { safe: '#0ca30c', caution: '#fab219', danger: '#d03b3b' } as const;

export default function KisanMobileView({ panchayat, fine, hourly, sprayWindow, irrigation, pest, crop, lang, onLangChange, advisoryText }: AdvisoryViewProps) {
  const frost = fine.tempMin <= 4;
  const heat = fine.tempMax >= 40;
  const worst = hourly.find((h) => h.status === 'danger');

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 py-4">
      {/* Phone frame */}
      <div className="w-full max-w-[390px] bg-[#0c101c] border-[6px] border-slate-800 rounded-[42px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-30" aria-hidden />

        <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 pt-8 pb-5 px-4 text-white">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-extrabold text-xs">
              <Sprout className="w-4 h-4 text-emerald-200" /> Kisan Agromet
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">1.2 km forecast</span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-center gap-1 text-sm font-bold">
              <MapPin className="w-3.5 h-3.5" /> {panchayat.name}
            </div>
            {panchayat.regionalName && <div className="text-[11px] text-emerald-100">{panchayat.regionalName}</div>}
            <div className="text-[11px] text-emerald-200 mt-0.5">
              {panchayat.district} · {panchayat.elevationM} m · {crop}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            {[
              { icon: Thermometer, label: 'Temp', v: `${Math.round(fine.tempMin)}–${Math.round(fine.tempMax)}°` },
              { icon: Droplets, label: 'Rain', v: `${fine.rainfallMm} mm` },
              { icon: Wind, label: 'Wind', v: `${fine.windSpeedKmh} km/h` },
            ].map(({ icon: Icon, label, v }) => (
              <div key={label} className="bg-white/15 rounded-xl py-2">
                <Icon className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-100" />
                <div className="text-[10px] text-emerald-100">{label}</div>
                <div className="text-sm font-extrabold">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-[560px] overflow-y-auto">
          {(frost || heat) && (
            <div role="alert" className="bg-rose-500/15 border-2 border-rose-500 rounded-2xl p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-200 mb-1">
                <AlertTriangle className="w-4 h-4" /> {frost ? `Frost tonight (${fine.tempMin}°C)` : `Heatwave (${fine.tempMax}°C)`}
              </div>
              <p className="text-[11px] text-rose-100 leading-snug">
                {frost ? 'Irrigate in the evening; smoke or cover nursery beds before dawn.' : 'Irrigate crops; avoid field work between 12:00 and 15:00.'}
              </p>
            </div>
          )}

          {/* Spray clock */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Spray clock</div>
            <div className="flex gap-0.5 mb-2" aria-hidden>
              {hourly.map((h) => (
                <div key={h.time} className="flex-1 h-2 rounded-sm" style={{ background: STATUS_COLOR[h.status] }} />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-2">
              <span>06</span>
              <span>12</span>
              <span>19</span>
            </div>
            {sprayWindow.hours ? (
              <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-200">Safe to spray {sprayWindow.label}</div>
                  <div className="text-[10px] text-emerald-100/80">Low wind, no rain expected.</div>
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs font-bold text-rose-200">Do not spray today</div>
              </div>
            )}
            {worst && (
              <div className="mt-2 text-[10px] text-rose-200/90 flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-400" /> {worst.time}: {worst.reason}
              </div>
            )}
          </div>

          <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-3">
            <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> {irrigation.action}
            </div>
            <p className="text-xs text-slate-200 leading-snug">{irrigation.detail}</p>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-3">
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Bug className="w-3.5 h-3.5" /> {pest.title}
            </div>
            <p className="text-xs text-slate-200 leading-snug">{pest.detail}</p>
          </div>

          <VoiceAdvisory textToSpeak={advisoryText} lang={lang} onLangChange={onLangChange} />

          <a
            href={`https://wa.me/?text=${encodeURIComponent(advisoryText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1fb857] text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share to village WhatsApp group
          </a>
        </div>
      </div>

      <div className="max-w-sm text-sm text-slate-300 space-y-3 lg:pt-16">
        <h2 className="font-display text-xl font-extrabold text-white">Built for the farmer’s phone</h2>
        <p>One screen answers the three questions a farmer asks every morning: can I spray, do I irrigate, is my crop at risk?</p>
        <ul className="space-y-1.5 text-xs text-slate-400">
          <li>• Advisory in English, हिन्दी and தமிழ், with voice read-out for low-literacy users</li>
          <li>• One-tap WhatsApp share to the village group</li>
          <li>• High-contrast spray clock with a written verdict, readable in bright sunlight</li>
        </ul>
      </div>
    </div>
  );
}
