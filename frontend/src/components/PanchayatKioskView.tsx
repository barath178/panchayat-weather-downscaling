'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  AlertTriangle, 
  QrCode, 
  Radio, 
  Droplets, 
  Wind, 
  Thermometer, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface PanchayatKioskViewProps {
  panchayat: {
    id: string;
    name: string;
    elevationM: number;
    terrainType: string;
  };
  scenario: string;
}

export default function PanchayatKioskView({ panchayat, scenario }: PanchayatKioskViewProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const isWinter = scenario === 'winter_frost';

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const acousticSensors = [
    { location: 'Ward 1: ZP Primary School (Tin Roof)', rate: '14.2 mm/hr', status: 'ONLINE', conf: '98%' },
    { location: 'Ward 2: Gram Panchayat Bhavan (Metal Shed)', rate: '16.8 mm/hr', status: 'ONLINE', conf: '96%' },
    { location: 'Ward 3: Primary Health Sub-Center', rate: '11.5 mm/hr', status: 'ONLINE', conf: '94%' },
    { location: 'Ward 4: Drip Cooperative Depot', rate: '18.0 mm/hr', status: 'ONLINE', conf: '97%' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-2 px-2 flex flex-col gap-3 font-sans">
      
      {/* Top Kiosk Wallboard Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Tv className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white tracking-tight">
                {panchayat.name.toUpperCase()} • DIGITAL INFORMATION WALLBOARD
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                KIOSK WALLBOARD MODE
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Elevation: {panchayat.elevationM} m | Terrain: {panchayat.terrainType} | Microclimate Grid: 1.2 km²
            </div>
          </div>
        </div>

        {/* Live Digital Clock */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-extrabold text-cyan-300 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              {currentTime || '12:00:00 PM'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Indian Standard Time (IST)</div>
          </div>
        </div>
      </div>

      {/* Emergency Hazard Notice Ticker */}
      <div className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 shadow-lg ${
        isWinter 
          ? 'bg-rose-950/80 border-rose-500 text-rose-100 animate-pulse'
          : 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100'
      }`}>
        <AlertTriangle className={`w-8 h-8 shrink-0 ${isWinter ? 'text-rose-400' : 'text-emerald-400'}`} />
        <div className="flex-1">
          <div className="text-sm font-bold uppercase tracking-wide">
            {isWinter ? '⚠️ CRITICAL FROST & COLD-AIR POOLING ALERT' : '🌧️ FLASH RUNOFF & OROGRAPHIC RAINFALL ALERT'}
          </div>
          <p className="text-xs opacity-90 mt-0.5">
            {isWinter 
              ? 'Valley depression temperatures will plummet to 4.2°C between 02:00 AM – 06:00 AM. Farmers in low-elevation grape and tomato plots are advised to run night misting irrigation to prevent blossom freezing.'
              : 'Orographic lift active across Western Ghats: 68 mm precipitation expected on ridge crests, 32 mm in valley floor. Cease chemical spraying after 01:00 PM.'}
          </p>
        </div>
      </div>

      {/* 4-Quadrant Large Display Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* QUADRANT 1: Live Microclimate Weather Display */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
            <span>Local Weather Forecast</span>
            <span className="text-[10px] text-emerald-400 font-mono">1.2 km² Downscaled</span>
          </div>

          <div className="space-y-3 my-auto">
            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-amber-400" /> Temperature</div>
              <div className="text-3xl font-extrabold text-white">
                {isWinter ? '4.2° - 26.0°' : '21.8° - 27.2°'} <span className="text-sm font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[10px] text-cyan-300 font-mono">Block Coarse: 22.0°C (-17.8°C Inversion Delta)</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-400" /> 24h Precipitation</div>
              <div className="text-3xl font-extrabold text-cyan-300">
                32.2 <span className="text-sm font-normal text-slate-400">mm</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Ridge Crest Lift: 68.4 mm</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5"><Wind className="w-4 h-4 text-slate-300" /> Wind Velocity</div>
              <div className="text-2xl font-bold text-white">
                14.3 <span className="text-xs font-normal text-slate-400">km/h</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
            Source: IMD + NASA SRTM 30m DEM + XGBoost ML
          </div>
        </div>

        {/* QUADRANT 2: Village Smart Spray Window & Advisory */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
            <span>Smart Spray Schedule</span>
            <span className="text-[10px] text-amber-400 font-mono">ICAR Rules</span>
          </div>

          <div className="space-y-2.5 my-auto">
            {/* Green Safe Card */}
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                06:00 AM - 11:00 AM: Safe to Spray
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Optimal breeze (&lt;11 km/h) and moderate heat. Safe for table grapes & vegetables.
              </div>
            </div>

            {/* Red Danger Card */}
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                <XCircle className="w-4 h-4" />
                After 01:00 PM: Do Not Spray
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                High chemical drift and wash-off hazard from afternoon gusts.
              </div>
            </div>

            {/* Irrigation Card */}
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40">
              <div className="text-xs font-bold text-cyan-300">
                💧 Irrigation: Suspend drip watering today
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Ample soil moisture surplus prevents water stress. Save power and water.
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
            Krishi Vigyan Kendra (KVK) Certified Guidelines
          </div>
        </div>

        {/* QUADRANT 3: Acoustic Rain Gauge Ground-Truth Network */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Acoustic Rain Gauge Network
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">4 Nodes Online</span>
          </div>

          <div className="space-y-2 my-auto">
            {acousticSensors.map((sensor, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-2 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate max-w-[190px]">
                    {sensor.location}
                  </div>
                  <div className="text-[9px] text-slate-400">Tin-roof acoustic FFT inference</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-cyan-300">{sensor.rate}</div>
                  <div className="text-[9px] text-emerald-400 font-mono">{sensor.conf} Confidence</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Zero-Hardware Cost</span>
            <span className="text-emerald-400 font-mono">Model: YAMNet-Rain-v2</span>
          </div>
        </div>

        {/* QUADRANT 4: Scan QR Code for Village WhatsApp Advisory */}
        <div className="bg-gradient-to-b from-slate-900 to-[#052e16]/80 border border-emerald-500/40 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-between text-center">
          <div className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
            Get Free WhatsApp Advisory
          </div>

          {/* Rendered Visual QR Code */}
          <div className="my-auto bg-white p-3 rounded-2xl shadow-xl border-4 border-emerald-500/30 flex flex-col items-center">
            <QrCode className="w-28 h-28 text-slate-900" />
            <span className="text-[9px] font-bold text-slate-700 font-mono mt-1">
              SCAN QR VIA SMARTPHONE CAMERA
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-white mb-0.5">
              Join Official Village Advisory Broadcast
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">
              Scan with camera or send message <span className="text-emerald-300 font-mono">"START"</span> to:
              <br />
              <strong className="text-white font-mono text-xs">+91 94230 XXXXX</strong>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
