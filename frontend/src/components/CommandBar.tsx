'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, Smartphone, Tv, Info, ChevronDown, Check, Radio, CloudRain, Snowflake, Sun } from 'lucide-react';
import type { Scenario } from '@/lib/microclimate';
import type { PanchayatData } from '@/data/all_india_regions';
import type { Lang } from '@/lib/advisory';
import RegionSearch from './RegionSearch';
import { SECTIONS } from './SectionNav';

export type View = 'dashboard' | 'mobile' | 'kiosk';
export type SourceKind = 'live' | 'loading' | 'offline' | 'scenario';

const REPO = 'https://github.com/barath178/panchayat-weather-downscaling';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const VIEWS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mobile', label: 'Farmer app', icon: Smartphone },
  { id: 'kiosk', label: 'Village kiosk', icon: Tv },
];

const SCENARIOS: { id: Scenario; label: string; hint: string; icon: React.ElementType }[] = [
  { id: 'live', label: 'Live today', hint: 'Real forecast from Open-Meteo', icon: Radio },
  { id: 'monsoon', label: 'Monsoon', hint: 'Simulated SW-monsoon day', icon: CloudRain },
  { id: 'winter_frost', label: 'Winter frost', hint: 'Simulated clear, cold night', icon: Snowflake },
  { id: 'pre_monsoon', label: 'Pre-monsoon heat', hint: 'Simulated hot, dry day', icon: Sun },
];

const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'hi', label: 'हिं', name: 'हिन्दी' },
  { id: 'ta', label: 'த', name: 'தமிழ்' },
];

export const SOURCE_DOT: Record<SourceKind, string> = {
  live: 'bg-good',
  loading: 'bg-warn animate-pulse',
  offline: 'bg-alert',
  scenario: 'bg-sky',
};

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="rgb(var(--accent))" />
      <path d="M8 21c3-1 5-3.5 8-3.5s5 2.5 8 3.5" stroke="rgb(var(--accent-ink))" strokeOpacity=".35" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M16 24V13.5M16 13.5c0-3.6 2.6-6 6.5-6 0 3.6-2.6 6-6.5 6zM16 16.5c0-2.8-2-4.6-5-4.6 0 2.8 2 4.6 5 4.6z" stroke="rgb(var(--accent-ink))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wordmark({ sub = true }: { sub?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="AeroAgro home">
      <Logo className="h-8 w-8 shrink-0" />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-ink">AeroAgro</span>
        {sub && <span className="block text-[11px] text-muted">Panchayat weather advisories</span>}
      </span>
    </a>
  );
}

function ScenarioMenu({ value, onChange, dataSource }: { value: Scenario; onChange: (s: Scenario) => void; dataSource: { kind: SourceKind; label: string } }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SCENARIOS.find((s) => s.id === value)!;

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={dataSource.label}
        className="flex h-9 items-center gap-2 rounded-lg border border-line/[0.12] bg-surface px-3 text-sm font-medium text-ink hover:border-line/25"
      >
        <span className={`h-2 w-2 rounded-full ${SOURCE_DOT[dataSource.kind]}`} />
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-[1600] mt-2 w-72 rounded-xl border border-line/10 bg-surface p-1.5 shadow-pop animate-fade-in">
          <div className="px-3 pb-1.5 pt-2 text-[11px] text-muted">{dataSource.label}</div>
          {SCENARIOS.map(({ id, label, hint, icon: Icon }) => (
            <button
              key={id}
              role="menuitemradio"
              aria-checked={value === id}
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-raised"
            >
              <span className={`grid h-8 w-8 place-items-center rounded-md ${value === id ? 'bg-accent/15 text-accent' : 'bg-surface2 text-ink2'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-ink">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
              {value === id && <Check className="h-4 w-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- sidebar (lg and up)

export interface DataStatus {
  kind: SourceKind;
  label: string;
  updated: string | null;
  place: string;
  lat: number;
  lng: number;
  elevationM: number;
  cellElevationM: number;
  dem: 'dem' | 'synthetic' | 'loading';
}

const STATUS_WORD: Record<SourceKind, string> = { live: 'Live', loading: 'Updating', offline: 'Offline', scenario: 'Simulated' };

export function Sidebar({
  activeView,
  onViewChange,
  activeSection,
  status,
}: {
  activeView: View;
  onViewChange: (v: View) => void;
  activeSection: string | null;
  status: DataStatus;
}) {
  const go = (id: string) => {
    if (activeView !== 'dashboard') onViewChange('dashboard');
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  // Icon rail: labels live in tooltips and for screen readers, so the map gets the width
  const item = (on: boolean) =>
    `group relative grid h-10 w-10 place-items-center rounded-lg transition-colors ${on ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface2 hover:text-ink'}`;
  const tip = (label: string) => (
    <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-line/10 bg-surface px-2 py-1 text-xs text-ink opacity-0 shadow-pop transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      {label}
    </span>
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-[1100] hidden w-16 flex-col items-center border-r border-line/[0.08] bg-surface/70 py-4 backdrop-blur-xl lg:flex">
      <a href="#top" aria-label="AeroAgro home">
        <Logo className="h-9 w-9" />
      </a>
      <nav aria-label="Sections" className="mt-6 flex flex-1 flex-col items-center gap-1.5">
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const on = activeView === 'dashboard' && activeSection === id;
          return (
            <button key={id} onClick={() => go(id)} aria-label={label} aria-current={on ? 'location' : undefined} className={item(on)}>
              <Icon className="h-[18px] w-[18px]" />
              {tip(label)}
            </button>
          );
        })}
        <span className="my-2 h-px w-6 bg-line/10" aria-hidden />
        {VIEWS.slice(1).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onViewChange(id)} aria-label={label} aria-current={activeView === id ? 'page' : undefined} className={item(activeView === id)}>
            <Icon className="h-[18px] w-[18px]" />
            {tip(label)}
          </button>
        ))}
      </nav>
      <span className={`h-2.5 w-2.5 rounded-full ${SOURCE_DOT[status.kind]}`} title={`${STATUS_WORD[status.kind]} · ${status.label}`} />
    </aside>
  );
}

/** "Live · Munnar · 18 km → 1.2 km" chip; full provenance in the tooltip. */
export function StatusChip({ status }: { status: DataStatus }) {
  const dz = Math.round(status.elevationM - status.cellElevationM);
  const detail = [
    status.label,
    `${status.lat.toFixed(2)}°N ${status.lng.toFixed(2)}°E · ${status.elevationM} m (${dz >= 0 ? '+' : '−'}${Math.abs(dz)} m vs forecast cell)`,
    `Terrain: ${status.dem === 'dem' ? 'Copernicus GLO-90 DEM' : status.dem === 'loading' ? 'loading' : 'estimated'}`,
    status.updated ? `Updated ${status.updated}` : '',
  ].filter(Boolean).join('\n');
  return (
    <div title={detail} className="hidden min-w-0 items-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.07] px-3 py-1.5 text-xs xl:flex">
      <span className={`h-2 w-2 shrink-0 rounded-full ${SOURCE_DOT[status.kind]}`} />
      <span className="font-semibold text-ink">{STATUS_WORD[status.kind]}</span>
      <span className="truncate text-ink2">{status.place}</span>
      <span className="shrink-0 font-mono text-accent">18 km → 1.2 km</span>
    </div>
  );
}
// ---------------------------------------------------------------- top bar

interface TopBarProps {
  currentScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  activeView: View;
  onViewChange: (view: View) => void;
  dataSource: { kind: SourceKind; label: string };
  onAbout: () => void;
  regions: PanchayatData[];
  onSelectRegion: (id: string) => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  status: DataStatus;
}

export default function TopBar({ currentScenario, onScenarioChange, activeView, onViewChange, dataSource, onAbout, regions, onSelectRegion, lang, onLangChange, status }: TopBarProps) {
  return (
    <header className="relative z-[1050] lg:sticky lg:top-0 border-b border-line/[0.08] bg-bg/80 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Wordmark sub={false} />
        </div>

        <div className="order-last w-full sm:order-none sm:w-auto sm:max-w-md sm:flex-1">
          <RegionSearch regions={regions} onSelect={onSelectRegion} shortcut />
        </div>

        <StatusChip status={status} />
        <div className="ml-auto flex items-center gap-2">
          <div className="seg hidden md:inline-flex" role="radiogroup" aria-label="Advisory language">
            {LANGS.map(({ id, label, name }) => (
              <button key={id} role="radio" aria-checked={lang === id} title={`Advisories in ${name}`} onClick={() => onLangChange(id)} className={`seg-btn min-w-9 justify-center ${lang === id ? 'seg-on' : ''}`}>
                {label}
              </button>
            ))}
          </div>
          <ScenarioMenu value={currentScenario} onChange={onScenarioChange} dataSource={dataSource} />
          <button onClick={onAbout} aria-label="About AeroAgro" className="grid h-9 w-9 place-items-center rounded-lg border border-line/[0.12] bg-surface text-ink2 hover:text-ink">
            <Info className="h-4 w-4" />
          </button>
        </div>

        {/* Views, below lg where the sidebar is hidden */}
        <nav aria-label="View" className="seg order-last flex w-full lg:hidden">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onViewChange(id)} aria-current={activeView === id ? 'page' : undefined} className={`seg-btn flex-1 justify-center ${activeView === id ? 'seg-on' : ''}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export { SECTIONS };
