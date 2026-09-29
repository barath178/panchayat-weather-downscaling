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

export type Tone = 'good' | 'warn' | 'bad';
export const TONE: Record<Tone, { text: string; bg: string; icon: React.ElementType }> = {
  good: { text: 'text-good', bg: 'bg-good/15', icon: CheckCircle2 },
  warn: { text: 'text-warn', bg: 'bg-warn/15', icon: AlertTriangle },
  bad: { text: 'text-bad', bg: 'bg-bad/15', icon: XCircle },
};
const HOUR_COLOR = { safe: 'bg-good', caution: 'bg-warn', danger: 'bg-bad' } as const;

function Tile({ icon: Icon, title, verdict, tone, children }: { icon: React.ElementType; title: string; verdict: string; tone: Tone; children: React.ReactNode }) {
  const t = TONE[tone];
  const V = t.icon;
  return (
    <div className="rounded-2xl border border-line/[0.1] bg-bg/50 p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-ink2">
          <Icon className="h-4 w-4" /> {title}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${t.bg} ${t.text}`}>
          <V className="h-3.5 w-3.5" /> {verdict}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** Today's three farm decisions as tone + short verdict. Shared by the plan card and the hero glance. */
export function verdicts(sprayWindow: Props['sprayWindow'], irrigation: Props['irrigation'], pest: PestRisk) {
  const spray: Tone = sprayWindow.hours >= 3 ? 'good' : sprayWindow.hours > 0 ? 'warn' : 'bad';
  const water: Tone = irrigation.action === 'Increase irrigation' ? 'warn' : 'good';
  const crop: Tone = pest.level === 'high' ? 'bad' : pest.level === 'moderate' ? 'warn' : 'good';
  return {
    spray: { tone: spray, verdict: spray === 'good' ? 'Go' : spray === 'warn' ? 'Short window' : 'Hold off' },
    water: { tone: water, verdict: irrigation.action.replace(' irrigation', '').replace(' today', '') },
    crop: { tone: crop, verdict: pest.level === 'low' ? 'Low risk' : pest.level === 'moderate' ? 'Watch' : 'High risk' },
  };
}

export default function ActionPlan({ crop, crops, onCropChange, hourly, sprayWindow, irrigation, et0, pest }: Props) {
  const v = verdicts(sprayWindow, irrigation, pest);
  const firstBad = hourly.find((h) => h.status === 'danger');

  return (
    <section className="card h-full p-6 sm:p-7" aria-labelledby="plan-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="plan-title" className="text-xl font-semibold tracking-tight text-ink">
          What to do today
        </h2>
        <span className="text-xs font-medium text-muted">ICAR agromet rules</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Crop">
        {crops.map((c) => (
          <button key={c} role="radio" aria-checked={crop === c} onClick={() => onCropChange(c)} className={`chip ${crop === c ? 'chip-on' : ''}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <Tile icon={SprayCan} title="Spraying" verdict={v.spray.verdict} tone={v.spray.tone}>
          <p className="text-2xl font-semibold tracking-tight text-ink tabular">{sprayWindow.hours ? sprayWindow.label : 'No safe window'}</p>
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

        <Tile icon={Droplets} title="Irrigation" verdict={v.water.verdict} tone={v.water.tone}>
          <p className="text-sm text-ink">{irrigation.detail}</p>
          <p className="mt-1 text-xs text-muted">Crop water demand (FAO-56 ET₀): {et0} mm/day</p>
        </Tile>

        <Tile icon={ShieldCheck} title={`Crop health · ${crop}`} verdict={v.crop.verdict} tone={v.crop.tone}>
          <p className="text-base font-semibold text-ink">{pest.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink2">{pest.detail}</p>
        </Tile>
      </div>
    </section>
  );
}
