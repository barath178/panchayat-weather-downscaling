'use client';

import React from 'react';
import { Map, TriangleAlert, Sun, Cpu, Sparkles, Wrench } from 'lucide-react';

export type Tab = 'map' | 'hazards' | 'village' | 'engine' | 'ask' | 'tools';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'map', label: 'Map', icon: Map },
  { id: 'hazards', label: 'Hazards', icon: TriangleAlert },
  { id: 'village', label: 'Village forecast', icon: Sun },
  { id: 'engine', label: 'Engine', icon: Cpu },
  { id: 'ask', label: 'Ask & share', icon: Sparkles },
  { id: 'tools', label: 'Field tools', icon: Wrench },
];

/**
 * The right-hand side of the console: one screen, tabs on top, content swapped in place.
 * The map fills the space; other tabs scroll inside the panel so the page itself never does.
 */
export default function Workspace({ tab, onTab, map, children }: { tab: Tab; onTab: (t: Tab) => void; map: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col lg:h-[calc(100vh-130px)] lg:min-h-[560px]">
      <div role="tablist" aria-label="Dashboard" className="mb-3 flex shrink-0 gap-1 overflow-x-auto rounded-card border border-line/[0.1] bg-surface/80 p-1 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTab(id)}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[14px] px-3.5 py-2 text-[13px] font-medium transition-colors ${
              tab === id ? 'bg-btn text-btn-ink' : 'text-muted hover:bg-raised hover:text-ink'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>
      {tab === 'map' ? (
        <div className="min-h-0 flex-1">{map}</div>
      ) : (
        <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto rounded-card border border-line/[0.08] bg-bg/40 p-1 scrollbar-none">
          {children}
        </div>
      )}
    </div>
  );
}
