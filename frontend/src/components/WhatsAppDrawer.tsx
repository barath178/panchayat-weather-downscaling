'use client';

import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send } from 'lucide-react';

interface WhatsAppDrawerProps {
  messageText: string;
  panchayatName: string;
}

export default function WhatsAppDrawer({ messageText, panchayatName }: WhatsAppDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBroadcast = () => {
    alert(`[Simulation] Automated broadcast delivered to 342 registered farmers in ${panchayatName} via WhatsApp Cloud API.`);
  };

  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          Panchayat WhatsApp Dispatcher
        </h3>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          WhatsApp Cloud API
        </span>
      </div>

      <div className="bg-[#052e16]/40 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-100 font-mono leading-relaxed whitespace-pre-line shadow-inner max-h-[190px] overflow-y-auto">
        {messageText}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Advisory'}
        </button>

        <button
          onClick={handleBroadcast}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-orchids-glow transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          Broadcast to Village
        </button>
      </div>
    </div>
  );
}
