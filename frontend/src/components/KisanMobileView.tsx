'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin, 
  Sparkles
} from 'lucide-react';

interface KisanMobileViewProps {
  panchayat: {
    id: string;
    name: string;
    elevationM: number;
    terrainType: string;
  };
  scenario: string;
}

export default function KisanMobileView({ panchayat, scenario }: KisanMobileViewProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeCrop, setActiveCrop] = useState('Table Grapes');

  const isWinter = scenario === 'winter_frost';
  const isMaleValley = panchayat.id === 'panchayat_male';

  const t = {
    title: 'Kisan Agromet Mobile',
    voiceBtn: '🔊 Listen to Audio Advisory (English)',
    safeSpray: '06:00 AM - 11:00 AM: Safe to Spray',
    dangerSpray: 'After 01:00 PM: High Wind Drift & Wash-off Risk',
    frostAlert: '⚠️ FROST WARNING: 4.2°C nocturnal cold pooling in valley. Run night misting irrigation.',
    irrigationText: 'Skip irrigation today (32 mm rainfall surplus expected)',
    pestAlert: 'Downy Mildew Risk: Apply preventative copper spray within 24 hours.',
    shareBtn: 'Share to Village WhatsApp Group'
  };

  const playVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const text = `${panchayat.name}. ${isWinter && isMaleValley ? t.frostAlert : ''}. ${t.safeSpray}. ${t.dangerSpray}. ${t.irrigationText}. ${t.pestAlert}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = 'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const shareWhatsApp = () => {
    const text = `🌱 *${panchayat.name.toUpperCase()} - AGROMET ADVISORY*\n📍 Elevation: ${panchayat.elevationM}m\n\n✅ ${t.safeSpray}\n🚫 ${t.dangerSpray}\n💧 ${t.irrigationText}\n🐛 ${t.pestAlert}\n\n📲 Broadcast via AeroAgro AI Platform`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex justify-center items-center py-4">
      {/* Smartphone Device Frame Simulator */}
      <div className="w-full max-w-[390px] bg-[#0c101c] border-[6px] border-slate-800 rounded-[42px] overflow-hidden shadow-2xl relative">
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-30 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
        </div>

        {/* Mobile App Header */}
        <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 pt-8 pb-5 px-4 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="font-extrabold text-xs tracking-tight">{t.title}</span>
            </div>
            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-mono">
              1.2 km² Hyperlocal
            </span>
          </div>

          <div className="mt-2.5">
            <div className="flex items-center gap-1 text-emerald-100 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {panchayat.name}
            </div>
            <div className="text-[11px] text-emerald-200 mt-0.5">
              Elevation: {panchayat.elevationM} m • {panchayat.terrainType}
            </div>
          </div>

          {/* Quick Voice Advisory Button */}
          <button
            onClick={playVoice}
            className={`w-full mt-3 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isPlayingAudio 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-white text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            {isPlayingAudio ? 'Stop Speech' : t.voiceBtn}
          </button>
        </div>

        {/* Mobile Scrollable Body */}
        <div className="p-4 space-y-3 max-h-[580px] overflow-y-auto pb-8">
          
          {/* Critical Hazard Alert Banner (if winter frost in valley) */}
          {isWinter && isMaleValley && (
            <div className="bg-rose-500/15 border-2 border-rose-500 rounded-2xl p-3 text-rose-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                <AlertTriangle className="w-4 h-4" />
                Nocturnal Cold Pooling Hazard (4.2°C)
              </div>
              <p className="leading-snug text-[11px]">
                {t.frostAlert}
              </p>
            </div>
          )}

          {/* Traffic Light Spray Window Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Smart Spray Window Clock
            </div>

            {/* Green Safe Box */}
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-2.5 flex items-start gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  {t.safeSpray}
                </div>
                <div className="text-[10px] text-emerald-200/80">
                  Mild wind (8-11 km/h), zero wash-off risk.
                </div>
              </div>
            </div>

            {/* Red Danger Box */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-300">
                  {t.dangerSpray}
                </div>
                <div className="text-[10px] text-rose-200/80">
                  Chemical spray drift and droplet run-off risk.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2">
              <div className="flex justify-center mb-0.5"><Droplets className="w-3.5 h-3.5 text-cyan-400" /></div>
              <div className="text-[10px] text-slate-400">Rainfall</div>
              <div className="text-xs font-bold text-white">32.2 mm</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2">
              <div className="flex justify-center mb-0.5"><Thermometer className="w-3.5 h-3.5 text-amber-400" /></div>
              <div className="text-[10px] text-slate-400">Temperature</div>
              <div className="text-xs font-bold text-white">{isWinter ? '4.2° - 26°' : '21° - 27°'}C</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2">
              <div className="flex justify-center mb-0.5"><Wind className="w-3.5 h-3.5 text-emerald-400" /></div>
              <div className="text-[10px] text-slate-400">Wind</div>
              <div className="text-xs font-bold text-white">14 km/h</div>
            </div>
          </div>

          {/* Irrigation Recommendation */}
          <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-3">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> Irrigation Advisory
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              {t.irrigationText}
            </p>
          </div>

          {/* Disease Protection Card */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-3">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
              Pathogen Management ({activeCrop})
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              {t.pestAlert}
            </p>
          </div>

          {/* WhatsApp Direct Share Button */}
          <button
            onClick={shareWhatsApp}
            className="w-full py-3 px-4 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/40 transition-all"
          >
            <Share2 className="w-4 h-4" />
            {t.shareBtn}
          </button>

        </div>

      </div>
    </div>
  );
}
