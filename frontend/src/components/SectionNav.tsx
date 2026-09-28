'use client';

// Section navigation shared by the desktop header and the mobile tab bar, with a scroll-spy
// so both show where the reader is. Mirrored in the Figma plugin (design/figma-plugin).

import React, { useEffect, useState } from 'react';
import { Home, Map, Cpu, Sparkles, Wrench } from 'lucide-react';

// `spy` is the element watched for the active state when the link target (`id`) is smaller than its section.
export const SECTIONS: { id: string; spy?: string; label: string; short: string; icon: React.ElementType }[] = [
  { id: 'village', label: 'Village', short: 'Today', icon: Home },
  { id: 'map', label: 'All India', short: 'Map', icon: Map },
  { id: 'engine', label: 'Engine', short: 'Engine', icon: Cpu },
  { id: 'ask', spy: 'reach', label: 'Ask', short: 'Ask', icon: Sparkles },
  { id: 'tools', label: 'Tools', short: 'Tools', icon: Wrench },
];

/** Id of the section that currently spans the upper third of the viewport, or null above the first one. */
export function useActiveSection(enabled = true) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window)) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        setActive(SECTIONS.find((s) => visible.has(s.spy ?? s.id))?.id ?? null);
      },
      // A thin band a third of the way down the screen: whichever section crosses it is "current"
      { rootMargin: '-33% 0px -66% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.spy ?? s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

/** Thumb-reach tab bar for phones and tablets; replaces the desktop header links below lg. */
export function MobileTabBar({ active }: { active: string | null }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-[1000] border-t border-line/[0.1] bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg">
        {SECTIONS.map(({ id, short, icon: Icon }) => {
          const on = active === id;
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={on ? 'location' : undefined}
                className={`flex flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-medium transition-colors ${on ? 'text-ink' : 'text-muted'}`}
              >
                <span className={`grid h-7 w-12 place-items-center rounded-md transition-colors ${on ? 'bg-btn text-btn-ink' : ''}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {short}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
