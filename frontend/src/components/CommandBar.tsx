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
  const item = (on: boolean) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
      on ? 'bg-raised font-medium text-ink ring-1 ring-line/[0.08]' : 'text-ink2 hover:bg-surface2 hover:text-ink'
    }`;
  const dz = Math.round(status.elevationM - status.cellElevationM);

  return (
    <aside className="fixed inset-y-0 left-0 z-[1100] hidden w-64 flex-col border-r border-line/[0.08] bg-surface/60 backdrop-blur-xl lg:flex">
      <div className="px-5 pb-4 pt-5">
        <Wordmark />
      </div>

      <nav aria-label="Sections" className="flex-1 overflow-y-auto px-3">
        <div className="kicker px-3 pb-2 pt-3">Dashboard</div>

        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => go(id)} aria-current={activeView === 'dashboard' && activeSection === id ? 'location' : undefined} className={item(activeView === 'dashboard' && activeSection === id)}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
        <div className="kicker px-3 pb-2 pt-6">Delivery views</div>
        {VIEWS.slice(1).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onViewChange(id)} aria-current={activeView === id ? 'page' : undefined} className={item(activeView === id)}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </nav>

      {/* Data status: what the numbers on screen are built from */}
      <div className="m-3 rounded-xl border border-line/[0.08] bg-bg/60 p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-ink">
            <span className={`h-2 w-2 rounded-full ${SOURCE_DOT[status.kind]}`} /> {STATUS_WORD[status.kind]}
          </span>
          {status.updated && <span className="font-mono text-muted">{status.updated}</span>}
        </div>
        <p className="mt-1.5 leading-snug text-muted">{status.label}</p>
        <dl className="mt-3 space-y-1.5 font-mono text-[11px]">
          {[
            ['Place', status.place],
            ['Position', `${status.lat.toFixed(2)}°N ${status.lng.toFixed(2)}°E`],
            ['Height', `${status.elevationM.toLocaleString('en-IN')} m (${dz >= 0 ? '+' : '−'}${Math.abs(dz)} m vs cell)`],
            ['Terrain', status.dem === 'dem' ? 'Copernicus DEM' : status.dem === 'loading' ? 'loading…' : 'estimated'],
            ['Grid', '18 km → 1.2 km'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-muted">{k}</dt>
              <dd className="truncate text-right text-ink2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex items-center gap-4 border-t border-line/[0.06] px-6 py-3 text-xs text-muted">
        <a href={`${BASE}/privacy/`} className="hover:text-ink">
          Privacy
        </a>
        <a href={`${BASE}/terms/`} className="hover:text-ink">
          Terms
        </a>
        <a href={REPO} target="_blank" rel="noopener noreferrer" className="ml-auto hover:text-ink">
          Source code
        </a>
      </div>
    </aside>
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
}

export default function TopBar({ currentScenario, onScenarioChange, activeView, onViewChange, dataSource, onAbout, regions, onSelectRegion, lang, onLangChange }: TopBarProps) {
  return (
    <header className="relative z-[1050] lg:sticky lg:top-0 border-b border-line/[0.08] bg-bg/80 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Wordmark sub={false} />
        </div>

        <div className="order-last w-full sm:order-none sm:w-auto sm:max-w-md sm:flex-1">
          <RegionSearch regions={regions} onSelect={onSelectRegion} shortcut />
        </div>

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
