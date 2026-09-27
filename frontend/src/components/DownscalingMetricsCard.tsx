'use client';

import React from 'react';
import { CloudRain, Thermometer, Wind, Droplets, Sparkles } from 'lucide-react';
import type { WeatherMetrics } from '@/lib/microclimate';

interface MetricsCardProps {
  panchayatName: string;
  subtitle: string;
  elevationM: number;
  coarseElevationM: number;
  terrainType: string;
  coarse: WeatherMetrics;
  fine: WeatherMetrics;
  isLive: boolean;
}

const fmtDelta = (d: number, unit: string) => `${d > 0 ? '+' : d < 0 ? '−' : '±'}${Math.abs(d).toFixed(1)}${unit}`;

export default function DownscalingMetricsCard({ panchayatName, subtitle, elevationM, coarseElevationM, terrainType, coarse, fine, isLive }: MetricsCardProps) {
  const dz = elevationM - coarseElevationM;
  const rows = [
    { icon: CloudRain, color: 'text-cyan-300', label: '24 h rainfall', c: `${coarse.rainfallMm} mm`, f: `${fine.rainfallMm} mm`, delta: fmtDelta(fine.rainfallMm - coarse.rainfallMm, ' mm') },
    { icon: Thermometer, color: 'text-amber-300', label: 'Temperature', c: `${coarse.tempMin}–${coarse.tempMax}°C`, f: `${fine.tempMin}–${fine.tempMax}°C`, delta: `Tmin ${fmtDelta(fine.tempMin - coarse.tempMin, '°')}` },
    { icon: Wind, color: 'text-slate-200', label: 'Wind', c: `${coarse.windSpeedKmh} km/h`, f: `${fine.windSpeedKmh} km/h`, delta: fmtDelta(fine.windSpeedKmh - coarse.windSpeedKmh, '') },
    { icon: Droplets, color: 'text-emerald-300', label: 'Humidity', c: `${coarse.relativeHumidity}%`, f: `${fine.relativeHumidity}%`, delta: fmtDelta(fine.relativeHumidity - coarse.relativeHumidity, '%') },
  ];

  return (
    <div className="orchids-glass rounded-3xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="w-3 h-3" /> Downscaled microclimate
          </div>
          <h2 className="text-base font-extrabold text-white leading-tight">{panchayatName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {elevationM} m · {terrainType}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono shrink-0 border ${
            isLive ? 'bg-rose-500/15 border-rose-500/30 text-rose-200' : 'bg-white/5 border-white/10 text-slate-300'
          }`}
        >
          {isLive ? '● LIVE' : 'MODEL'}
        </span>
      </div>

      <div className="rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] text-[10px] uppercase tracking-wider bg-black/30 px-3 py-1.5">
          <span className="text-slate-500">Variable</span>
          <span className="text-amber-300/90 text-right">Block 18 km</span>
          <span className="text-emerald-300 text-right">Panchayat 1.2 km</span>
        </div>
        {rows.map(({ icon: Icon, color, label, c, f, delta }) => (
          <div key={label} className="grid grid-cols-[1.2fr_1fr_1fr] items-center px-3 py-2 border-t border-white/5 text-xs">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Icon className={`w-3.5 h-3.5 ${color}`} /> {label}
            </span>
            <span className="text-right text-slate-400 font-mono">{c}</span>
            <span className="text-right">
              <span className="block font-mono font-bold text-white">{f}</span>
              <span className="block text-[9px] font-mono text-slate-500">{delta}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3 font-mono text-[10px] text-slate-300 leading-relaxed">
        <div className="text-slate-500 mb-1">// terrain correction applied</div>
        <div>
          Δz = {elevationM} − {coarseElevationM} = <span className="text-white font-semibold">{dz} m</span>
        </div>
        <div>
          T<sub>max</sub>: −5.0 °C/km × Δz = <span className="text-white font-semibold">{fmtDelta((-5.0 * dz) / 1000, ' °C')}</span>
        </div>
        <div>T<sub>min</sub>: −6.5 °C/km × Δz − cold-air pooling (D8 drainage) + UHI</div>
        <div>P<sub>local</sub> = P<sub>block</sub> × [1 + 0.6·max(0,Δz)/km + 0.6·sin θ] × terrain</div>
      </div>
    </div>
  );
}
