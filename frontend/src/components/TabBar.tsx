'use client';

import React from 'react';
import { Map, Sun, Cpu, Sparkles, Wrench } from 'lucide-react';

export type Tab = 'map' | 'village' | 'engine' | 'ask' | 'tools';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'map', label: 'All India map', icon: Map },
  { id: 'village', label: 'Village forecast', icon: Sun },
  { id: 'engine', label: 'Downscaling engine', icon: Cpu },
  { id: 'ask', label: 'Ask & share', icon: Sparkles },
  { id: 'tools', label: 'Field tools', icon: Wrench },
];

/** Every section one click away from the top: the dashboard is tabs, not a long scroll. */
export default function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav aria-label="Dashboard sections" className="sticky top-0 z-[1050] border-b border-line/[0.1] bg-bg/90 backdrop-blur-xl md:top-[65px]">
      <div role="tablist" className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-5 scrollbar-none sm:px-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              onChange(id);
              window.scrollTo({ top: 0 });
            }}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
              tab === id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
