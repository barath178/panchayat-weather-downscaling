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
    <header className="sticky top-2 z-50 px-2 max-w-7xl mx-auto w-full">
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
                Western Ghats Pilot (1.2 km²)
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

      </div>
    </header>
  );
}
