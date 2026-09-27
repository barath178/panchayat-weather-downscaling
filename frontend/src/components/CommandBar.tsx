'use client';

import React from 'react';
import { Sparkles, CloudRain, Snowflake, Zap, LayoutDashboard, Smartphone, Tv } from 'lucide-react';

interface CommandBarProps {
  currentScenario: string;
  onScenarioChange: (scenario: string) => void;
  activeView: 'dashboard' | 'mobile' | 'kiosk';
  onViewChange: (view: 'dashboard' | 'mobile' | 'kiosk') => void;
}

export default function CommandBar({
  currentScenario,
  onScenarioChange,
  activeView,
  onViewChange,
}: CommandBarProps) {
  return (
    <header className="sticky top-2 z-50 px-4 sm:px-6 max-w-[1680px] mx-auto w-full">
      <div className="orchids-glass rounded-2xl px-3.5 py-2 shadow-orchids-card flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Live Pilot Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-orchids-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-white text-sm tracking-tight">
                AeroAgro <span className="text-emerald-400 font-semibold">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                🇮🇳 All-India Agromet Downscaling (1.2 km²)
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Dashboard | Kisan Mobile | Panchayat Kiosk */}
        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 gap-1 text-xs font-semibold">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'dashboard'
                ? 'bg-emerald-500 text-white shadow-orchids-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GIS</span> Dashboard
          </button>

          <button
            onClick={() => onViewChange('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'mobile'
                ? 'bg-cyan-500 text-white shadow-orchids-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Kisan Mobile
          </button>

          <button
            onClick={() => onViewChange('kiosk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'kiosk'
                ? 'bg-violet-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Panchayat Kiosk
          </button>
        </div>

        {/* Central Scenario Switcher Pills */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 gap-1">
          <button
            onClick={() => onScenarioChange('monsoon')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentScenario === 'monsoon'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3 h-3 text-cyan-400" />
            Monsoon Lift
          </button>

          <button
            onClick={() => onScenarioChange('winter_frost')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentScenario === 'winter_frost'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Snowflake className="w-3 h-3 text-cyan-400" />
            Winter Frost
          </button>

          <button
            onClick={() => onScenarioChange('pre_monsoon')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentScenario === 'pre_monsoon'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            Pre-Monsoon
          </button>
        </div>

        {/* Figma Vector Artboard Download Link for Judges & Designers */}
        <a
          href="/aeroagro_figma_artboard.svg"
          download="aeroagro_figma_artboard.svg"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all shadow-sm"
          title="Download vector Figma artboard (.SVG) to import directly into Figma"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 38 57" fill="none">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
          </svg>
          <span>Figma File (.svg)</span>
        </a>

      </div>
    </header>
  );
}
