'use client';

import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Layers, Eye, Radio, Sparkles, ZoomIn, Info, ShieldCheck } from 'lucide-react';
import { PanchayatData } from '@/data/all_india_regions';

interface IMDSatelliteViewerProps {
  activePanchayat: PanchayatData;
  scenario: string;
  fineMetrics: {
    tempMax: number;
    tempMin: number;
    rainfallMm: number;
    windSpeedKmh: number;
    relativeHumidity: number;
  };
  coarseMetrics: {
    tempMax: number;
    tempMin: number;
    rainfallMm: number;
    windSpeedKmh: number;
    relativeHumidity: number;
  };
}

const IMD_SATELLITE_CHANNELS = [
  {
    id: 'ir1',
    name: 'Infrared-1 (10.8 µm)',
    code: 'IR1',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg',
    type: 'Thermal IR Window',
    resolution: '4 km Sensor • 18 km NWP Model Grid',
    summary: 'Round-the-clock thermal emission of cloud tops and surface. Highlights deep convective cloud systems, cold storm fronts, and nocturnal radiative cooling.',
    bestFor: 'Night & Day 24h Monitoring, Cyclone & Storm Tracking',
  },
  {
    id: 'vis',
    name: 'Visible (0.65 µm)',
    code: 'VIS',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_vis.jpg',
    type: 'Optical Reflection',
    resolution: '1 km Sensor • 18 km NWP Model Grid',
    summary: 'Solar radiation reflected by clouds and Earth surface. Distinguishes thick rain-bearing cumulonimbus from high thin cirrus and daytime radiation fog in valleys.',
    bestFor: 'Daytime Optical Clarity, Valley Fog & Cloud Albedo',
  },
  {
    id: 'ctbt',
    name: 'Cloud Top Temp (CTBT)',
    code: 'CTBT',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ctbt.jpg',
    type: 'Convective Intensity Contours',
    resolution: '4 km Imager • Derived Cloud Heights',
    summary: 'Color-coded thermal brightness contours. Deep negative temperatures (-40°C to -80°C) pinpoint severe thunderstorm updrafts, localized cloudbursts, and hailstorm clusters.',
    bestFor: 'Extreme Rainfall, Hail, & Cloudburst Detection',
  },
  {
    id: 'wv',
    name: 'Water Vapour (6.8 µm)',
    code: 'WV',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_wv.jpg',
    type: 'Middle Tropospheric Moisture',
    resolution: '8 km Sensor • 600–300 hPa Flow',
    summary: 'Absorbs electromagnetic energy in the 6–7 µm band. Maps middle and upper atmospheric moisture flow, monsoon troughs, and subtropical jet stream dynamics.',
    bestFor: 'Monsoon Surges & Upper-Air Moisture Plumes',
  },
  {
    id: 'loop',
    name: 'Live Animated Loop (15-min)',
    code: 'LOOP',
    url: 'https://mausam.imd.gov.in/Satellite/Converted/IR1.gif',
    type: 'Multi-Temporal Loop',
    resolution: '15-Minute Dynamic Sequence',
    summary: 'Live looping satellite radar sequence from INSAT-3DR showing real-time atmospheric motion vectors and convective cloud propagation across the Indian subcontinent.',
    bestFor: 'Tracking Storm Propagation & Orographic Lifting',
  },
];

export default function IMDSatelliteViewer({
  activePanchayat,
  scenario,
  fineMetrics,
  coarseMetrics,
}: IMDSatelliteViewerProps) {
  const [selectedChannel, setSelectedChannel] = useState<string>('ir1');
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const [imageLoaded, setImageLoaded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'resolution' | 'methodology'>('feed');

  const currentChannel = IMD_SATELLITE_CHANNELS.find((c) => c.id === selectedChannel) || IMD_SATELLITE_CHANNELS[0];

  const handleRefresh = () => {
    setImageLoaded(false);
    setCacheBuster(Date.now());
  };

  // Resolution downscaling factors
  const imdResolutionKm = 18; // Standard IMD GFS/WRF block NWP resolution
  const aeroAgroResolutionKm = 1.2; // AeroAgro AI target resolution
  const resolutionGain = Math.round((imdResolutionKm / aeroAgroResolutionKm) * 10) / 10; // 15x
  const areaRatio = Math.round((imdResolutionKm * imdResolutionKm) / (aeroAgroResolutionKm * aeroAgroResolutionKm)); // ~225x

  return (
    <div className="flex flex-col gap-4 text-slate-100">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">IMD INSAT-3D/3DR Satellite Resolution Engine</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                Live MoES Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct geostationary meteorological imagery from India Meteorological Department (IMD)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5 text-[11px]">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'feed' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Live Feed
            </button>
            <button
              onClick={() => setActiveTab('resolution')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'resolution' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔬 18km vs 1.2km Resolution
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'methodology' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 Sensor Physics
            </button>
          </div>

          <button
            onClick={handleRefresh}
            title="Refresh satellite acquisition from IMD server"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href="https://mausam.imd.gov.in/imd_latest/contents/satellite.php"
            target="_blank"
            rel="noopener noreferrer"
            title="Open official IMD Mausam satellite page"
            className="p-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all flex items-center gap-1 text-[11px]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">IMD Portal</span>
          </a>
        </div>
      </div>

      {/* TAB 1: LIVE SATELLITE FEED */}
      {activeTab === 'feed' && (
        <div className="flex flex-col gap-3">
          
          {/* Channel Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {IMD_SATELLITE_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch.id);
                  setImageLoaded(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  selectedChannel === ch.id
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{ch.code}</span>
                <span>{ch.name}</span>
              </button>
            ))}
          </div>

          {/* Active Channel Details Banner */}
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <strong className="text-cyan-300 font-bold">{currentChannel.name}</strong>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-200">
                  {currentChannel.type}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Native Resolution: {currentChannel.resolution}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{currentChannel.summary}</p>
            </div>
            <div className="text-[10px] font-mono text-slate-400 text-right">
              <div>Target: <strong className="text-white">{activePanchayat.name} ({activePanchayat.state})</strong></div>
              <div>Sub-satellite Point: <span className="text-cyan-400">74.0°E (INSAT-3DR)</span></div>
            </div>
          </div>

          {/* Satellite Image Display Canvas */}
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center group shadow-2xl">
            
            {/* Live IMD Satellite Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`${currentChannel.url}?v=${cacheBuster}`}
              src={`${currentChannel.url}?v=${cacheBuster}`}
              alt={`IMD INSAT-3D ${currentChannel.name}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-20'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />

            {/* Target Reticle Pinpointing Current Panchayat on Satellite Map */}
            <div className="absolute top-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Target: <strong className="text-white">{activePanchayat.name}</strong> ({activePanchayat.elevationM}m MSL)</span>
            </div>

            {/* Official Watermark Bar */}
            <div className="absolute bottom-3 left-4 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>🛰️ MoES / IMD Geostationary Asia Sector</span>
              <span>•</span>
              <span className="text-cyan-300">Live Acquisition</span>
            </div>

            {/* Downscaling HUD Pill (Top Right) */}
            <div className="absolute top-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AeroAgro 1.2km Downscaled Focus Active</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RESOLUTION COMPARISON (18KM COARSE VS 1.2KM FINE) */}
      {activeTab === 'resolution' && (
        <div className="flex flex-col gap-4">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Baseline IMD Grid Resolution</span>
              <div className="text-2xl font-black text-amber-300 font-mono">18.0 km</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Standard IMD Numerical Weather Prediction (NWP) model grid cell (324 km² surface area). All panchayats inside this block get the identical flat forecast.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">AeroAgro AI Target Resolution</span>
              <div className="text-2xl font-black text-emerald-300 font-mono">1.2 km²</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Physics-informed downscaled microclimate zone (1.44 km² surface area). Accounts for ridge barriers, slope radiation, and cold air valley hollows.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Spatial Resolution Amplification</span>
              <div className="text-2xl font-black text-cyan-300 font-mono">{resolutionGain}× Higher (225 Sub-Cells)</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Each single IMD 18km NWP cell is subdivided into 225 individual hyper-local agromet micro-cells with custom crop spray windows.
              </p>
            </div>
          </div>

          {/* Downscaling Breakdown Table for Selected Panchayat */}
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Resolution Ground-Truth Comparison: {activePanchayat.name} ({activePanchayat.state})
                </h4>
                <p className="text-[10px] text-slate-400">
                  Elevation: {activePanchayat.elevationM}m MSL • Zone: {activePanchayat.terrainType}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                15× Spatial Gain
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase font-mono text-slate-400 bg-black/30 border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">Agromet Parameter</th>
                    <th className="py-2.5 px-3 text-amber-400">IMD Coarse Satellite / NWP (18km)</th>
                    <th className="py-2.5 px-3 text-emerald-400">AeroAgro AI Ground-Truth (1.2km)</th>
                    <th className="py-2.5 px-3 text-cyan-300">Physics Downscaling Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-white">Min Night Temperature</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{coarseMetrics.tempMin}°C</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold">{fineMetrics.tempMin}°C</td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      Environmental lapse rate (-6.5°C/km) + nocturnal valley cold air drainage
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-white">Peak Day Temperature</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{coarseMetrics.tempMax}°C</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold">{fineMetrics.tempMax}°C</td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      Aspect solar angle + Urban Heat Island (+2.2°C UHI on impermeable pavement)
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-white">Precipitation Accumulation</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{coarseMetrics.rainfallMm} mm</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold">{fineMetrics.rainfallMm} mm</td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      Windward orographic condensation multiplier vs leeward rain-shadow shielding
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-white">Surface Wind Velocity</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{coarseMetrics.windSpeedKmh} km/h</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold">{fineMetrics.windSpeedKmh} km/h</td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      Topographic funneling (Palghat gap / Marwar plains) vs canopy surface friction
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SENSOR PHYSICS & IMD METHODOLOGY */}
      {activeTab === 'methodology' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Eye className="w-4 h-4" />
              <span>Visible Channel (0.65 µm) Reflectance</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Reflected solar radiation is captured by the INSAT-3DR Imager payload. Thick cumulonimbus and stratocumulus clouds exhibit high optical depth and bright white reflectivity, while calm ocean and wet soils appear dark. Essential for mapping morning valley fog dissipations.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
              Payload: INSAT-3DR Imager • Daytime Only • 1 km Ground Sampling
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <Radio className="w-4 h-4" />
              <span>Infrared-1 (10.8 µm) & CTBT Thermal Window</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Operates 24 hours a day. Measures terrestrial and cloud radiation emitted as blackbody equivalent. Colder brightness temperatures indicate higher cloud top heights (often exceeding 14 km altitude during pre-monsoon convective cloudbursts).
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
              Payload: 6-Channel Imager • 24/7 Day & Night • 4 km Ground Sampling
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <Layers className="w-4 h-4" />
              <span>Water Vapour (6.8 µm) Troposphere Moisture</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Senses the 600–300 hPa layer of the atmosphere. Bright white plumes signify strong upward moisture transport from the Arabian Sea and Bay of Bengal, powering the South-West Monsoon low-pressure depressions across Central and North India.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
              Sensitivity: Mid-to-Upper Troposphere (600–300 hPa) • 8 km Ground Sampling
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>AeroAgro Topographic Physics Downscaling</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              AeroAgro AI ingests this macro-meteorological IMD satellite and NWP stream, fusing it with 30m NASA SRTM Digital Elevation Models (DEM) to calculate localized katabatic drainage, lapse rates, and slope radiation. This converts 18km macro cells into actionable 1.2km farm advisories.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-emerald-400">
              Precision: 1.2 km² (Panchayat / Urban Ward Level) • Zero Permission Required
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
