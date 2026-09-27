'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Tv, AlertTriangle, CheckCircle2, XCircle, Droplets, Wind, Thermometer, Clock, MapPin, Bug, Maximize2 } from 'lucide-react';
import type { AdvisoryViewProps } from '@/lib/viewProps';

const STATUS = {
  safe: { color: '#0ca30c', icon: CheckCircle2, label: 'Safe' },
  caution: { color: '#fab219', icon: AlertTriangle, label: 'Caution' },
  danger: { color: '#d03b3b', icon: XCircle, label: 'No spray' },
} as const;

export default function PanchayatKioskView({ panchayat, fine, coarse, hourly, sprayWindow, irrigation, pest, et0, advisoryText }: AdvisoryViewProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const frost = fine.tempMin <= 4;
  const heavyRain = fine.rainfallMm >= 40;
  const alert = frost
    ? { tone: 'danger', title: `Frost warning: ${fine.tempMin}°C tonight`, text: 'Cold air will pool in low fields before dawn. Run evening irrigation and protect nurseries.' }
    : heavyRain
    ? { tone: 'danger', title: `Heavy rain: ${fine.rainfallMm} mm expected`, text: 'Clear field drains, postpone fertilizer and spraying, keep livestock on high ground.' }
    : fine.tempMax >= 40
    ? { tone: 'danger', title: `Heatwave: ${fine.tempMax}°C`, text: 'Irrigate crops, give water and shade to livestock, avoid field work 12:00–15:00.' }
    : { tone: 'ok', title: 'No severe weather expected today', text: `Best spray window ${sprayWindow.label}. ${irrigation.action}.` };

  const goFullscreen = () => document.documentElement.requestFullscreen?.().catch(() => {});

  return (
    <div className="w-full max-w-7xl mx-auto py-2 flex flex-col gap-3">
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
            <Tv className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">{panchayat.name}</div>
            {panchayat.regionalName && <div className="text-sm text-emerald-300">{panchayat.regionalName}</div>}
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {panchayat.district}, {panchayat.state} · {panchayat.elevationM} m
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-200 flex items-center gap-2 tabular-nums">
              <Clock className="w-5 h-5 text-cyan-400" />
              {now ? now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' }) : '--:--:--'}
            </div>
            <div className="text-[11px] text-slate-400">
              {now ? now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }) : ''} · IST
            </div>
          </div>
          <button onClick={goFullscreen} title="Full screen for wall display" aria-label="Full screen" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        role="alert"
        className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
          alert.tone === 'danger' ? 'bg-rose-950/80 border-rose-500 text-rose-50' : 'bg-emerald-950/60 border-emerald-500/80 text-emerald-50'
        }`}
      >
        {alert.tone === 'danger' ? <AlertTriangle className="w-8 h-8 shrink-0 text-rose-300" /> : <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-300" />}
        <div>
          <div className="text-base font-bold">{alert.title}</div>
          <p className="text-sm opacity-90 mt-0.5">{alert.text}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Weather */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Today’s weather · 1.2 km</div>
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-amber-400" /> Temperature</div>
            <div className="text-3xl font-extrabold text-white">{fine.tempMin}° – {fine.tempMax}°C</div>
            <div className="text-[11px] text-slate-500 font-mono">Block forecast {coarse.tempMin}° – {coarse.tempMax}°C</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-400" /> Rain</div>
            <div className="text-3xl font-extrabold text-white">{fine.rainfallMm} <span className="text-base font-normal text-slate-400">mm</span></div>
            <div className="text-[11px] text-slate-500 font-mono">Block forecast {coarse.rainfallMm} mm</div>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5"><Wind className="w-4 h-4" /> Wind</div>
              <div className="text-xl font-bold text-white">{fine.windSpeedKmh} km/h</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Humidity</div>
              <div className="text-xl font-bold text-white">{fine.relativeHumidity}%</div>
            </div>
          </div>
        </div>

        {/* Spray schedule */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Spray schedule</div>
          <div className="grid grid-cols-2 gap-1">
            {hourly.map((h) => {
              const s = STATUS[h.status];
              const Icon = s.icon;
              return (
                <div key={h.time} className="flex items-center justify-between rounded-lg bg-black/30 px-2 py-1 text-xs" style={{ boxShadow: `inset 3px 0 0 ${s.color}` }}>
                  <span className="font-mono text-slate-300">{h.time}</span>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: s.color }}>
                    <Icon className="w-3 h-3" /> {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Farm actions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Farm actions</div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-sm font-bold text-cyan-200 flex items-center gap-1.5"><Droplets className="w-4 h-4" /> {irrigation.action}</div>
            <div className="text-xs text-slate-300 mt-0.5">{irrigation.detail}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Crop water demand (ET₀) {et0} mm/day</div>
          </div>
          <div className={`p-3 rounded-xl border ${pest.level === 'high' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <div className="text-sm font-bold text-white flex items-center gap-1.5"><Bug className="w-4 h-4 text-amber-300" /> {pest.title}</div>
            <div className="text-xs text-slate-300 mt-0.5">{pest.detail}</div>
          </div>
        </div>

        {/* QR */}
        <div className="bg-gradient-to-b from-slate-900 to-[#052e16]/80 border border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center justify-between text-center gap-3">
          <div className="text-xs font-bold uppercase text-emerald-300 tracking-wider">Take this advisory home</div>
          <div className="bg-white p-3 rounded-2xl">
            <QRCodeSVG value={`https://wa.me/?text=${encodeURIComponent(Array.from(advisoryText).slice(0, 600).join(''))}`} size={148} level="M" />
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Scan with your phone camera to open today’s advisory in WhatsApp and forward it to your family.
          </p>
        </div>
      </div>
    </div>
  );
}
