'use client';

import React, { useState } from 'react';
import { Copy, Check, Send, ChevronDown, CheckCheck, Users, Languages, Volume2 } from 'lucide-react';
import VoiceAdvisory from './VoiceAdvisory';
import type { Lang } from '@/lib/advisory';

interface Props {
  messageText: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  placeName: string;
}

/** WhatsApp-style formatting: *bold* and _italic_ */
function formatLine(line: string, i: number) {
  const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
  return (
    <span key={i} className="block min-h-[0.75em]">
      {parts.map((part, k) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <strong key={k} className="font-semibold">
            {part.slice(1, -1)}
          </strong>
        ) : part.startsWith('_') && part.endsWith('_') ? (
          <em key={k} className="text-[#8696a0]">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function WhatsAppDrawer({ messageText, lang, onLangChange, placeName }: Props) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [expanded, setExpanded] = useState(false);
  const lines = messageText.split('\n');
  const visible = expanded ? lines : lines.slice(0, 9);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied('ok');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = messageText;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      setCopied(ok ? 'ok' : 'fail');
    }
    setTimeout(() => setCopied('idle'), 2000);
  };

  const time = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

  return (
    <section className="card grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" aria-labelledby="share-title">
      <div className="flex flex-col">
        <div className="eyebrow">Farmer delivery</div>
        <h2 id="share-title" className="mt-1 font-display text-2xl text-ink">
          Send today’s advice to {placeName}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink2">
          The advisory is written for WhatsApp, where village farmer groups already live. Switch language, listen to it read aloud, or forward it in one tap.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-ink2">
          <li className="flex items-center gap-2.5">
            <Languages className="h-4 w-4 text-accent" /> English, हिन्दी and தமிழ்
          </li>
          <li className="flex items-center gap-2.5">
            <Volume2 className="h-4 w-4 text-accent" /> Voice read-out for low-literacy users
          </li>
          <li className="flex items-center gap-2.5">
            <Users className="h-4 w-4 text-accent" /> Ready for village group broadcast
          </li>
        </ul>

        <div className="mt-5">
          <VoiceAdvisory textToSpeak={messageText} lang={lang} onLangChange={onLangChange} />
        </div>

        <div className="mt-3 grid grid-cols-[auto_1fr] gap-2 md:mt-auto md:pt-4">
          <button onClick={handleCopy} className="btn-ghost">
            {copied === 'ok' ? <Check className="h-4 w-4 text-good" /> : <Copy className="h-4 w-4" />}
            {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Failed' : 'Copy'}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(messageText)}`} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-[#07130b] hover:brightness-110">
            <Send className="h-4 w-4" /> Share on WhatsApp
          </a>
        </div>
      </div>

      {/* Chat preview */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-line/[0.06] bg-[#0b141a]">
        <div className="flex items-center gap-3 bg-[#202c33] px-4 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366]/20 text-[#25D366]">
            <Users className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[#e9edef]">{placeName} farmers</div>
            <div className="text-[11px] text-[#8696a0]">Message preview</div>
          </div>
        </div>
        <div className="flex-1 p-3" style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
          <div className="ml-auto max-w-[94%] rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-[13px] leading-relaxed text-[#e9edef] shadow">
            {visible.map(formatLine)}
            <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#8fcfc0]">
              {time} <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
            </span>
          </div>
          {lines.length > 9 && (
            <button onClick={() => setExpanded((e) => !e)} className="mx-auto mt-2 flex items-center gap-1 text-xs text-[#8696a0] hover:text-[#e9edef]">
              {expanded ? 'Show less' : 'Show full message'} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
