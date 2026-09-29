'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, Smartphone, Tv, Info, ChevronDown, Check, Radio, CloudRain, Snowflake, Sun } from 'lucide-react';
import type { Scenario } from '@/lib/microclimate';
import type { PanchayatData } from '@/data/all_india_regions';
import RegionSearch from './RegionSearch';

type View = 'dashboard' | 'mobile' | 'kiosk';

interface CommandBarProps {
  currentScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  activeView: View;
  onViewChange: (view: View) => void;
  dataSource: { kind: 'live' | 'loading' | 'offline' | 'scenario'; label: string };
  onAbout: () => void;
  regions: PanchayatData[];
  onSelectRegion: (id: string) => void;
}

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

const DOT: Record<CommandBarProps['dataSource']['kind'], string> = {
  live: 'bg-good',
  loading: 'bg-warn animate-pulse',
  offline: 'bg-alert',
  scenario: 'bg-sky',
};

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="rgb(var(--accent))" />
      <path d="M8 21c3-1 5-3.5 8-3.5s5 2.5 8 3.5" stroke="rgb(var(--accent-ink))" strokeOpacity=".35" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M16 24V13.5M16 13.5c0-3.6 2.6-6 6.5-6 0 3.6-2.6 6-6.5 6zM16 16.5c0-2.8-2-4.6-5-4.6 0 2.8 2 4.6 5 4.6z" stroke="rgb(var(--accent-ink))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScenarioMenu({ value, onChange, dataSource }: { value: Scenario; onChange: (s: Scenario) => void; dataSource: CommandBarProps['dataSource'] }) {
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
        className="flex h-10 items-center gap-2 rounded-full border border-line/[0.14] bg-surface px-4 text-sm font-medium text-ink hover:border-line/30"
      >
        <span className={`h-2 w-2 rounded-full ${DOT[dataSource.kind]}`} />
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-[1600] mt-2 w-72 rounded-2xl border border-line/10 bg-surface p-1.5 shadow-pop animate-fade-in">
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
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-raised"
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${value === id ? 'bg-accent text-accent-ink' : 'bg-surface2 text-ink2'}`}>
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

export default function CommandBar({ currentScenario, onScenarioChange, activeView, onViewChange, dataSource, onAbout, regions, onSelectRegion }: CommandBarProps) {
  return (
    <header className="z-[1100] border-b border-line/[0.1] bg-bg/85 backdrop-blur-xl md:sticky md:top-0">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="AeroAgro AI home">
          <Logo className="h-8 w-8" />
          <span className="font-display text-2xl leading-none text-ink">
            AeroAgro<span className="italic text-accent"> AI</span>
          </span>
        </a>

        <div className={`order-last w-full md:order-none md:ml-6 md:w-auto md:flex-1 md:max-w-md md:block`}>
          <RegionSearch regions={regions} onSelect={onSelectRegion} shortcut />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <nav aria-label="View" className="seg hidden sm:inline-flex">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                aria-current={activeView === id ? 'page' : undefined}
                className={`seg-btn ${activeView === id ? 'seg-on' : ''}`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </nav>
          <ScenarioMenu value={currentScenario} onChange={onScenarioChange} dataSource={dataSource} />
          <button onClick={onAbout} aria-label="About AeroAgro" className="grid h-10 w-10 place-items-center rounded-full border border-line/[0.14] bg-surface text-ink2 hover:text-ink">
            <Info className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile view switcher */}
        <nav aria-label="View" className="seg order-last flex w-full sm:hidden">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              aria-current={activeView === id ? 'page' : undefined}
              className={`seg-btn flex-1 justify-center ${activeView === id ? 'seg-on' : ''}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
