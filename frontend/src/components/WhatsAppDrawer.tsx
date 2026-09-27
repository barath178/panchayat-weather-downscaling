'use client';

import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send } from 'lucide-react';

interface WhatsAppDrawerProps {
  messageText: string;
  panchayatName: string;
}

export default function WhatsAppDrawer({ messageText, panchayatName }: WhatsAppDrawerProps) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied('ok');
    } catch {
      // Fallback for browsers that block the async clipboard API (e.g. non-HTTPS)
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

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[#052e16]/30 p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          WhatsApp advisory
        </h3>
        <span className="text-[10px] text-slate-400">for {panchayatName}</span>
      </div>

      <div className="bg-[#0b141a] border border-white/5 rounded-xl p-3 text-[11px] text-emerald-50 leading-relaxed whitespace-pre-line max-h-[210px] overflow-y-auto">
        {messageText}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
        >
          {copied === 'ok' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy failed' : 'Copy'}
        </button>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#1fb857] text-slate-950 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          Share on WhatsApp
        </a>
      </div>
    </div>
  );
}
