'use client';

import React from 'react';
import { CloudRain, Snowflake, Zap, LayoutDashboard, Smartphone, Tv, Radio, Info, Sprout } from 'lucide-react';
import type { Scenario } from '@/lib/microclimate';

type View = 'dashboard' | 'mobile' | 'kiosk';

interface CommandBarProps {
  currentScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  activeView: View;
  onViewChange: (view: View) => void;
  dataSource: { kind: 'live' | 'loading' | 'offline' | 'scenario'; label: string };
  onAbout: () => void;
}

const VIEWS: { id: View; label: string; short: string; icon: React.ElementType; active: string }[] = [
  { id: 'dashboard', label: 'GIS Dashboard', short: 'Dashboard', icon: LayoutDashboard, active: 'bg-emerald-500 text-slate-950' },
  { id: 'mobile', label: 'Kisan Mobile', short: 'Kisan', icon: Smartphone, active: 'bg-cyan-500 text-slate-950' },
  { id: 'kiosk', label: 'Panchayat Kiosk', short: 'Kiosk', icon: Tv, active: 'bg-violet-500 text-white' },
];

const SCENARIOS: { id: Scenario; label: string; icon: React.ElementType; active: string }[] = [
  { id: 'live', label: 'Live Today', icon: Radio, active: 'bg-rose-500/20 text-rose-200 border-rose-500/40' },
  { id: 'monsoon', label: 'Monsoon', icon: CloudRain, active: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' },
  { id: 'winter_frost', label: 'Winter Frost', icon: Snowflake, active: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30' },
  { id: 'pre_monsoon', label: 'Pre-Monsoon', icon: Zap, active: 'bg-amber-500/20 text-amber-200 border-amber-500/30' },
];

const SOURCE_DOT: Record<CommandBarProps['dataSource']['kind'], string> = {
  live: 'bg-emerald-400 animate-pulse',
  loading: 'bg-amber-400 animate-pulse',
  offline: 'bg-rose-400',
  scenario: 'bg-slate-400',
};

export default function CommandBar({ currentScenario, onScenarioChange, activeView, onViewChange, dataSource, onAbout }: CommandBarProps) {
  return (
    <header className="sticky top-2 z-[1100] px-3 sm:px-6 max-w-[1680px] mx-auto w-full">
      <div className="orchids-glass rounded-2xl px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-orchids-glow shrink-0">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-extrabold text-white text-sm tracking-tight leading-tight">
              AeroAgro <span className="text-emerald-400">AI</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate" aria-live="polite">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${SOURCE_DOT[dataSource.kind]}`} />
              <span className="truncate capitalize">{dataSource.label}</span>
            </div>
          </div>
        </div>

        {/* Views */}
        <nav aria-label="View" className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 gap-1 text-xs font-semibold order-3 w-full sm:w-auto sm:order-none justify-between sm:justify-center overflow-x-auto scrollbar-none">
          {VIEWS.map(({ id, label, short, icon: Icon, active }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              aria-current={activeView === id ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeView === id ? `${active} font-bold` : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Scenario */}
        <div role="radiogroup" aria-label="Weather scenario" className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 gap-1 overflow-x-auto scrollbar-none order-4 w-full lg:w-auto lg:order-none">
          {SCENARIOS.map(({ id, label, icon: Icon, active }) => (
            <button
              key={id}
              role="radio"
              aria-checked={currentScenario === id}
              onClick={() => onScenarioChange(id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                currentScenario === id ? active : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/aeroagro_figma_artboard.svg`}
            download
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all"
            title="Download the vector design artboard (.svg) – drag into Figma to edit"
          >
            Figma artboard
          </a>
          <button
            onClick={onAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold"
          >
            <Info className="w-3.5 h-3.5" /> About
          </button>
        </div>
      </div>
    </header>
  );
}
