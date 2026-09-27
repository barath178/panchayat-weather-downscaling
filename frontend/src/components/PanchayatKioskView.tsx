'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertTriangle, CheckCircle2, XCircle, Droplets, Wind, CloudRain, Bug, Maximize2 } from 'lucide-react';
import type { AdvisoryViewProps } from '@/lib/viewProps';
import { describeSky } from '@/lib/sky';

const STATUS = {
  safe: { color: '#2FB344', icon: CheckCircle2, label: 'Safe' },
  caution: { color: '#F2B01E', icon: AlertTriangle, label: 'Caution' },
  danger: { color: '#E5484D', icon: XCircle, label: 'No spray' },
} as const;

export default function PanchayatKioskView({ panchayat, fine, coarse, hourly, sprayWindow, irrigation, pest, et0, advisoryText }: AdvisoryViewProps) {
  const [now, setNow] = useState<Date | null>(null);
  const sky = describeSky(fine);
  const SkyIcon = sky.icon;

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const frost = fine.tempMin <= 4;
  const heavyRain = fine.rainfallMm >= 40;
  const alert = frost
    ? { danger: true, title: `Frost warning: ${fine.tempMin}°C tonight`, text: 'Cold air will pool in low fields before dawn. Irrigate in the evening and protect nurseries.' }
    : heavyRain
    ? { danger: true, title: `Heavy rain: ${fine.rainfallMm} mm expected`, text: 'Clear field drains, postpone fertiliser and spraying, keep livestock on high ground.' }
    : fine.tempMax >= 40
    ? { danger: true, title: `Heatwave: ${fine.tempMax}°C`, text: 'Irrigate crops, give water and shade to livestock, avoid field work 12:00–15:00.' }
    : { danger: false, title: 'No severe weather expected today', text: `Best spray window ${sprayWindow.label}. ${irrigation.action}.` };

  const goFullscreen = () => document.documentElement.requestFullscreen?.().catch(() => {});

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="card flex flex-wrap items-center justify-between gap-6 p-6" style={{ background: `linear-gradient(120deg, ${sky.from}, rgb(var(--surface)) 70%)` }}>
        <div className="flex items-center gap-5">
          <SkyIcon className="h-16 w-16 shrink-0 text-ink/80" strokeWidth={1.2} />
          <div>
            <div className="eyebrow">Gram Panchayat weather board</div>
            <div className="mt-1 font-display text-3xl leading-tight text-ink sm:text-4xl">{panchayat.name}</div>
            <div className="text-ink2">
              {panchayat.regionalName ? `${panchayat.regionalName} · ` : ''}
              {panchayat.district}, {panchayat.state}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-display text-4xl text-ink tabular">
              {now ? now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '--:--'}
            </div>
            <div className="text-sm text-muted">{now ? now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }) : ''}</div>
          </div>
          <button onClick={goFullscreen} title="Full screen for wall display" aria-label="Full screen" className="btn-ghost h-11 w-11 p-0">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Alert */}
      <div role="alert" className={`flex items-center gap-4 rounded-card p-5 ${alert.danger ? 'bg-bad/15' : 'bg-good/10'}`}>
        {alert.danger ? <AlertTriangle className="h-9 w-9 shrink-0 text-bad" /> : <CheckCircle2 className="h-9 w-9 shrink-0 text-good" />}
        <div>
          <div className="text-xl font-semibold text-ink">{alert.title}</div>
          <p className="mt-0.5 text-ink2">{alert.text}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Weather */}
        <div className="card p-6">
          <div className="eyebrow">Today · 1.2 km</div>
          <div className="mt-4 font-display text-6xl leading-none text-ink">
            {Math.round(fine.tempMax)}°<span className="text-3xl text-ink2"> / {Math.round(fine.tempMin)}°</span>
          </div>
          <div className="mt-2 text-lg text-ink">{sky.label}</div>
          <div className="mt-6 space-y-3 text-lg">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink2">
                <CloudRain className="h-5 w-5" /> Rain
              </span>
              <span className="font-semibold text-ink tabular">{fine.rainfallMm} mm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink2">
                <Wind className="h-5 w-5" /> Wind
              </span>
              <span className="font-semibold text-ink tabular">{fine.windSpeedKmh} km/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink2">
                <Droplets className="h-5 w-5" /> Humidity
              </span>
              <span className="font-semibold text-ink tabular">{fine.relativeHumidity}%</span>
            </div>
          </div>
          <div className="mt-5 text-xs text-muted">
            District forecast: {coarse.tempMin}–{coarse.tempMax}°C, {coarse.rainfallMm} mm
          </div>
        </div>

        {/* Spray */}
        <div className="card p-6">
          <div className="eyebrow">Spray schedule</div>
          <div className="mt-4 grid grid-cols-2 gap-1.5">
            {hourly.map((h) => {
              const s = STATUS[h.status];
              const Icon = s.icon;
              return (
                <div key={h.time} className="flex items-center justify-between rounded-lg bg-surface2 px-2.5 py-1.5 text-sm">
                  <span className="text-ink2 tabular">{h.time}</span>
                  <span className="flex items-center gap-1 font-medium" style={{ color: s.color }}>
                    <Icon className="h-3.5 w-3.5" /> {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="card flex flex-col gap-3 p-6">
          <div className="eyebrow">Farm actions</div>
          <div className="rounded-2xl bg-sky/10 p-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-ink">
              <Droplets className="h-5 w-5 text-sky" /> {irrigation.action}
            </div>
            <p className="mt-1 text-ink2">{irrigation.detail}</p>
            <p className="mt-2 text-xs text-muted">Crop water need today: {et0} mm</p>
          </div>
          <div className={`rounded-2xl p-4 ${pest.level === 'high' ? 'bg-bad/10' : pest.level === 'moderate' ? 'bg-warn/10' : 'bg-surface2'}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-ink">
              <Bug className="h-5 w-5 text-sun" /> {pest.title}
            </div>
            <p className="mt-1 text-ink2">{pest.detail}</p>
          </div>
        </div>

        {/* QR */}
        <div className="card flex flex-col items-center justify-between gap-4 p-6 text-center">
          <div className="eyebrow">Take this advice home</div>
          <div className="rounded-2xl bg-white p-4">
            <QRCodeSVG value={`https://wa.me/?text=${encodeURIComponent(Array.from(advisoryText).slice(0, 600).join(''))}`} size={164} level="M" />
          </div>
          <p className="text-ink2">Scan with your phone camera to open today’s advice in WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}
