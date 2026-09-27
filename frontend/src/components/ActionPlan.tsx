'use client';

import React from 'react';
import { SprayCan, Droplets, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { HourPoint, PestRisk } from '@/lib/microclimate';

interface Props {
  crop: string;
  crops: string[];
  onCropChange: (c: string) => void;
  hourly: HourPoint[];
  sprayWindow: { label: string; hours: number };
  irrigation: { action: string; detail: string; deficit: number };
  et0: number;
  pest: PestRisk;
}

type Tone = 'good' | 'warn' | 'bad';
const TONE: Record<Tone, { text: string; bg: string; icon: React.ElementType }> = {
  good: { text: 'text-good', bg: 'bg-good/15', icon: CheckCircle2 },
  warn: { text: 'text-warn', bg: 'bg-warn/15', icon: AlertTriangle },
  bad: { text: 'text-bad', bg: 'bg-bad/15', icon: XCircle },
};
const HOUR_COLOR = { safe: 'bg-good', caution: 'bg-warn', danger: 'bg-bad' } as const;

function Tile({ icon: Icon, title, verdict, tone, children }: { icon: React.ElementType; title: string; verdict: string; tone: Tone; children: React.ReactNode }) {
  const t = TONE[tone];
  const V = t.icon;
  return (
    <div className="rounded-2xl border border-line/[0.07] bg-surface2 p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-ink2">
          <Icon className="h-4 w-4" /> {title}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${t.bg} ${t.text}`}>
          <V className="h-3.5 w-3.5" /> {verdict}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function ActionPlan({ crop, crops, onCropChange, hourly, sprayWindow, irrigation, et0, pest }: Props) {
  const sprayTone: Tone = sprayWindow.hours >= 3 ? 'good' : sprayWindow.hours > 0 ? 'warn' : 'bad';
  const waterTone: Tone = irrigation.action === 'Increase irrigation' ? 'warn' : 'good';
  const pestTone: Tone = pest.level === 'high' ? 'bad' : pest.level === 'moderate' ? 'warn' : 'good';
  const firstBad = hourly.find((h) => h.status === 'danger');

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="plan-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="plan-title" className="font-display text-xl text-ink">
          What to do today
        </h2>
        <span className="text-xs text-muted">ICAR agromet rules</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Crop">
        {crops.map((c) => (
          <button key={c} role="radio" aria-checked={crop === c} onClick={() => onCropChange(c)} className={`chip ${crop === c ? 'chip-on' : ''}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <Tile icon={SprayCan} title="Spraying" verdict={sprayTone === 'good' ? 'Go' : sprayTone === 'warn' ? 'Short window' : 'Hold off'} tone={sprayTone}>
          <p className="text-base font-semibold text-ink">{sprayWindow.hours ? `Best between ${sprayWindow.label}` : 'No safe window today'}</p>
          <div className="mt-2.5 flex gap-[3px]" aria-hidden>
            {hourly.map((h) => (
              <span key={h.time} className={`h-2 flex-1 rounded-full ${HOUR_COLOR[h.status]}`} title={`${h.time} · ${h.reason}`} />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted tabular">
            <span>6 am</span>
            <span>noon</span>
            <span>7 pm</span>
          </div>
          {firstBad && <p className="mt-2 text-xs text-muted">From {firstBad.time}: {firstBad.reason.toLowerCase()}.</p>}
        </Tile>

        <Tile icon={Droplets} title="Irrigation" verdict={irrigation.action.replace(' irrigation', '').replace(' today', '')} tone={waterTone}>
          <p className="text-sm text-ink">{irrigation.detail}</p>
          <p className="mt-1 text-xs text-muted">Crop water demand (FAO-56 ET₀): {et0} mm/day</p>
        </Tile>

        <Tile icon={ShieldCheck} title={`Crop health · ${crop}`} verdict={pest.level === 'low' ? 'Low risk' : pest.level === 'moderate' ? 'Watch' : 'High risk'} tone={pestTone}>
          <p className="text-base font-semibold text-ink">{pest.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink2">{pest.detail}</p>
        </Tile>
      </div>
    </section>
  );
}
