'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Droplets, Wind, CloudRain, MapPin, Bug, Send, SprayCan, Signal, Wifi, BatteryFull } from 'lucide-react';
import VoiceAdvisory from './VoiceAdvisory';
import type { AdvisoryViewProps } from '@/lib/viewProps';
import { describeSky } from '@/lib/sky';

const HOUR = { safe: 'bg-good', caution: 'bg-warn', danger: 'bg-bad' } as const;

export default function KisanMobileView({ panchayat, fine, hourly, sprayWindow, irrigation, pest, crop, lang, onLangChange, advisoryText }: AdvisoryViewProps) {
  const sky = describeSky(fine);
  const SkyIcon = sky.icon;
  const frost = fine.tempMin <= 4;
  const heat = fine.tempMax >= 40;

  const verdicts = [
    {
      icon: SprayCan,
      title: 'Spray',
      tone: sprayWindow.hours >= 3 ? 'good' : sprayWindow.hours ? 'warn' : 'bad',
      text: sprayWindow.hours ? sprayWindow.label : 'Not today',
    },
    { icon: Droplets, title: 'Water', tone: irrigation.action === 'Increase irrigation' ? 'warn' : 'good', text: irrigation.action.replace(' irrigation', '') },
    { icon: Bug, title: 'Pests', tone: pest.level === 'high' ? 'bad' : pest.level === 'moderate' ? 'warn' : 'good', text: pest.level === 'low' ? 'Low risk' : pest.level === 'moderate' ? 'Watch' : 'High risk' },
  ] as const;
  const toneCls = { good: 'text-good', warn: 'text-warn', bad: 'text-bad' };
  const toneIcon = { good: CheckCircle2, warn: AlertTriangle, bad: XCircle };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
      <div className="order-2 max-w-sm lg:order-1 lg:justify-self-end">
        <div className="eyebrow">Farmer app</div>
        <h2 className="mt-2 font-display text-4xl leading-tight text-ink">Three answers, every morning.</h2>
        <p className="mt-4 text-ink2">Can I spray? Should I water? Is my crop at risk? One glance, in the farmer’s own language, with a voice read-out.</p>
      </div>

      {/* Phone */}
      <div className="order-1 mx-auto w-full max-w-[360px] lg:order-2">
        <div className="rounded-[46px] border border-line/15 bg-[#050706] p-2.5 shadow-pop">
          <div className="relative overflow-hidden rounded-[38px] bg-bg">
            {/* Status bar */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-7 pt-3 text-[11px] font-semibold text-ink">
              <span>9:41</span>
              <span className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <BatteryFull className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Sky header */}
            <div className="px-5 pb-6 pt-12" style={{ background: `linear-gradient(170deg, ${sky.from}, ${sky.to})` }}>
              <div className="flex items-center gap-1.5 text-xs text-ink2">
                <MapPin className="h-3.5 w-3.5" /> {panchayat.district}
              </div>
              <div className="mt-1 font-display text-2xl leading-tight text-ink">{panchayat.name}</div>
              {panchayat.regionalName && <div className="text-sm text-ink2">{panchayat.regionalName}</div>}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="font-display text-6xl leading-none text-ink">{Math.round(fine.tempMax)}°</div>
                  <div className="mt-2 text-sm font-medium text-ink">{sky.label}</div>
                  <div className="text-xs text-ink2">Low {Math.round(fine.tempMin)}° · {crop}</div>
                </div>
                <SkyIcon className="h-16 w-16 text-ink/80" strokeWidth={1.2} />
              </div>
              <div className="mt-4 flex gap-4 text-xs text-ink2">
                <span className="flex items-center gap-1">
                  <CloudRain className="h-3.5 w-3.5" /> {fine.rainfallMm} mm
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3.5 w-3.5" /> {fine.windSpeedKmh} km/h
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5" /> {fine.relativeHumidity}%
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4">
              {(frost || heat) && (
                <div role="alert" className="flex items-start gap-2.5 rounded-2xl bg-bad/15 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-bad" />
                  <span className="text-ink">
                    {frost ? `Frost tonight (${fine.tempMin}°C). Water in the evening and cover nurseries.` : `Heatwave (${fine.tempMax}°C). Irrigate and avoid field work 12–3 pm.`}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {verdicts.map(({ icon: Icon, title, tone, text }) => {
                  const T = toneIcon[tone];
                  return (
                    <div key={title} className="rounded-2xl bg-surface p-3">
                      <Icon className="h-4 w-4 text-ink2" />
                      <div className="mt-2 text-xs text-muted">{title}</div>
                      <div className={`mt-0.5 flex items-center gap-1 text-[13px] font-semibold leading-tight ${toneCls[tone]}`}>
                        <T className="h-3.5 w-3.5 shrink-0" /> {text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-surface p-3">
                <div className="text-xs text-muted">Spray clock</div>
                <div className="mt-2 flex gap-[3px]">
                  {hourly.map((h) => (
                    <span key={h.time} className={`h-2.5 flex-1 rounded-full ${HOUR[h.status]}`} />
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted">
                  <span>6 am</span>
                  <span>noon</span>
                  <span>7 pm</span>
                </div>
              </div>

              <div className="rounded-2xl bg-surface p-3 text-sm text-ink2">
                <span className="font-semibold text-ink">{pest.title}. </span>
                {pest.detail}
              </div>

              <VoiceAdvisory textToSpeak={advisoryText} lang={lang} onLangChange={onLangChange} />

              <a
                href={`https://wa.me/?text=${encodeURIComponent(advisoryText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full rounded-2xl bg-[#25D366] py-3 text-[#07130b] hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Share to village group
              </a>
            </div>
          </div>
        </div>
      </div>

      <ul className="order-3 max-w-sm space-y-4 text-sm text-ink2">
        {[
          ['Built for sunlight', 'High-contrast colours and large type that stay readable outdoors.'],
          ['Speaks the farmer’s language', 'English, हिन्दी and தமிழ், read aloud with the phone’s own voice.'],
          ['Works over WhatsApp', 'No new app to install — advisories travel through village groups.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span>
              <span className="block font-semibold text-ink">{t}</span>
              {d}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
