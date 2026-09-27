'use client';

import React, { useState } from 'react';
import CommandBar from '@/components/CommandBar';
import PanchayatSelector from '@/components/PanchayatSelector';
import DownscalingMetricsCard from '@/components/DownscalingMetricsCard';
import dynamic from 'next/dynamic';

const GoogleMapComponent = dynamic(() => import('@/components/GoogleMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] rounded-3xl bg-[#080d1a] border border-white/10 flex items-center justify-center text-slate-300">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-emerald-400 font-semibold">Streaming High-Res Google Maps Relief Mesh...</span>
      </div>
    </div>
  ),
});
import SprayTimelineChart from '@/components/SprayTimelineChart';
import ElevationProfile from '@/components/ElevationProfile';
import AcousticSpectrogram from '@/components/AcousticSpectrogram';
import VoiceAdvisory from '@/components/VoiceAdvisory';
import WhatsAppDrawer from '@/components/WhatsAppDrawer';
import KisanMobileView from '@/components/KisanMobileView';
import PanchayatKioskView from '@/components/PanchayatKioskView';
import PMFBYInsuranceModal from '@/components/PMFBYInsuranceModal';
import IMDSatelliteViewer from '@/components/IMDSatelliteViewer';
import { Bug, Droplets, Map, Mountain, Radio, ShieldCheck, Clock, Sprout } from 'lucide-react';

import { ALL_INDIA_PANCHAYATS, PanchayatData } from '@/data/all_india_regions';

export default function AeroAgroDashboard() {
  const [selectedId, setSelectedId] = useState('tn_thiruvaiyaru');
  const [scenario, setScenario] = useState('monsoon');
  const [selectedCrop, setSelectedCrop] = useState('Samba Paddy');
  const [activeVar, setActiveVar] = useState<'rainfall' | 'temp' | 'frost' | 'spray'>('rainfall');
  const [viewMode, setViewMode] = useState<'fine' | 'coarse'>('fine');
  const [activeStudioTab, setActiveStudioTab] = useState<'spray' | 'insurance' | 'imd' | 'profile' | 'acoustic'>('spray');
  const [activeView, setActiveView] = useState<'dashboard' | 'mobile' | 'kiosk'>('dashboard');

  const activePanchayat =
    ALL_INDIA_PANCHAYATS.find((p) => p.id === selectedId) || ALL_INDIA_PANCHAYATS[0];

  // Coarse baseline (Simulating IMD Coarse 18km NWP forecast)
  const coarse = {
    tempMax: 31.5,
    tempMin: 23.5,
    rainfallMm: scenario === 'monsoon' ? 30.0 : scenario === 'winter_frost' ? 1.0 : 8.0,
    windSpeedKmh: 16.0,
    relativeHumidity: scenario === 'monsoon' ? 82 : scenario === 'winter_frost' ? 58 : 50,
  };

  // High-Resolution Downscaled calculation tailored for Indian Microclimates
  const isUrban = activePanchayat.isUrban;
  const isHimalayan = activePanchayat.elevationM > 1500;
  const isPlateau = activePanchayat.elevationM > 500 && activePanchayat.elevationM <= 1500;
  const isCoastDelta = activePanchayat.elevationM < 80;
  const isAridMarwar = activePanchayat.id.includes('marwar') || activePanchayat.id.includes('jodhpur');
  const isPalghat = activePanchayat.id.includes('pollachi');
  const isBrahmaputraOrAssam = activePanchayat.state === 'Assam' || activePanchayat.state === 'West Bengal';

  // Lapse rate calculation (-6.5°C per 1000m)
  let calcMinTemp = coarse.tempMin - ((activePanchayat.elevationM - 100) / 1000) * 6.5;
  let calcMaxTemp = coarse.tempMax - ((activePanchayat.elevationM - 100) / 1000) * 5.8;

  // Urban Heat Island (UHI) Thermal Effect
  if (isUrban) {
    calcMinTemp += 2.2;
    calcMaxTemp += 1.4;
  }

  if (scenario === 'winter_frost') {
    if (isHimalayan && activePanchayat.drainageAccumulation > 0.8) {
      calcMinTemp = -1.5;
    } else if (activePanchayat.id.includes('ooty')) {
      calcMinTemp = 2.8;
    } else if (isAridMarwar) {
      calcMinTemp = 5.5;
    }
  }

  // Orographic / coastal rainfall downscaling
  let calcRain = coarse.rainfallMm;
  if (isHimalayan || isBrahmaputraOrAssam || activePanchayat.id.includes('munnar')) {
    calcRain = scenario === 'monsoon' ? 95.0 : 6.5;
  } else if (isAridMarwar) {
    calcRain = scenario === 'monsoon' ? 4.2 : 0.0;
  } else if (isCoastDelta && scenario === 'monsoon') {
    calcRain = 48.0;
  }

  // Wind speed calculations
  let calcWind = coarse.windSpeedKmh;
  if (isPalghat) {
    calcWind = 38.5;
  } else if (isAridMarwar) {
    calcWind = 26.0;
  } else if (isHimalayan && activePanchayat.drainageAccumulation > 0.8) {
    calcWind = 5.2;
  } else if (isUrban) {
    calcWind = Math.min(calcWind * 0.75, 14.0);
  }

  const fine = {
    tempMax: parseFloat(calcMaxTemp.toFixed(1)),
    tempMin: parseFloat(calcMinTemp.toFixed(1)),
    rainfallMm: parseFloat(calcRain.toFixed(1)),
    windSpeedKmh: parseFloat(calcWind.toFixed(1)),
    relativeHumidity: isCoastDelta ? 89 : isAridMarwar ? 38 : isHimalayan ? 88 : (isUrban ? 68 : 72),
  };

  // Diurnal Spray Timeline for Recharts
  const hourlyData = [
    { time: '06:00', tempC: fine.tempMin, windKmh: Math.max(3, fine.windSpeedKmh * 0.4), status: 'safe', reason: isUrban ? 'Cool Urban Morning' : 'Prime Morning Window' },
    { time: '08:00', tempC: fine.tempMin + 3, windKmh: fine.windSpeedKmh * 0.6, status: 'safe', reason: 'Optimal Spray Window' },
    { time: '10:00', tempC: fine.tempMin + 6, windKmh: fine.windSpeedKmh * 0.85, status: 'safe', reason: 'Safe (Low Drift)' },
    { time: '12:00', tempC: fine.tempMax - 1, windKmh: fine.windSpeedKmh * 1.1, status: isPalghat ? 'danger' : 'caution', reason: isPalghat ? 'Palghat Wind Drift Alert' : 'VPD Rising' },
    { time: '14:00', tempC: fine.tempMax, windKmh: fine.windSpeedKmh * 1.25, status: 'danger', reason: isUrban ? 'Peak Urban Heat Island' : 'High Chemical Evaporation / Drift' },
    { time: '16:00', tempC: fine.tempMax - 2, windKmh: fine.windSpeedKmh * 1.15, status: 'danger', reason: 'Convective Wind Gusts' },
    { time: '18:00', tempC: fine.tempMin + 4, windKmh: fine.windSpeedKmh * 0.65, status: 'safe', reason: 'Evening Window' },
  ];

  const waMessage = isUrban
    ? `🏙️ *ALL-INDIA URBAN MICROCLIMATE: ${activePanchayat.name.toUpperCase()}*\n📍 State: ${activePanchayat.state} | District: ${activePanchayat.district}\n🏢 Zone: ${activePanchayat.terrainType} | Elev: ${activePanchayat.elevationM}m\n🌿 Urban Focus: ${selectedCrop}\n\n📊 *Downscaled 24h Microclimate (1.2 km²):*\n• Temperature: ${fine.tempMin}°C to ${fine.tempMax}°C (UHI +2.2°C active)\n• Precipitation: ${fine.rainfallMm} mm | RH: ${fine.relativeHumidity}%\n• Wind Speed: ${fine.windSpeedKmh} km/h (Canopy Friction)\n\n🏙️ *MUNICIPAL & URBAN AGRO ADVICE:*\n• Urban Heat Island Mitigation: Mist rooftop gardens and shade nurseries\n• Stormwater Drainage: Impermeable surface runoff risk high during heavy rainfall\n• Air Quality Bio-Shield: Maintain vertical green buffers`
    : `🇮🇳 *ALL-INDIA AGROMET ADVISORY: ${activePanchayat.name.toUpperCase()}*\n📍 State: ${activePanchayat.state} | District: ${activePanchayat.district}\n⛰️ Elevation: ${activePanchayat.elevationM}m | Terrain: ${activePanchayat.terrainType}\n🌾 Primary Crop: ${selectedCrop}\n\n📊 *Downscaled 24h Microclimate (1.2 km²):*\n• Temperature: ${fine.tempMin}°C to ${fine.tempMax}°C\n• Precipitation: ${fine.rainfallMm} mm\n• Wind Speed: ${fine.windSpeedKmh} km/h | RH: ${fine.relativeHumidity}%\n\n🚜 *ICAR / STATE AGRO ADVICE:*\n• Spray Window: 06:00 AM - 10:30 AM (Safe)\n• Irrigation: ${fine.rainfallMm > 25 ? 'Suspend irrigation pumps (Surplus soil moisture)' : 'Normal scheduled irrigation'}\n${fine.tempMin < 4 ? `⚠️ *FROST ALERT:* Katabatic cold air pool at ${fine.tempMin}°C. Initiate orchard smoke/misting.` : ''}`;

  return (
    <div className="min-h-screen bg-orchids-bg text-slate-100 flex flex-col pb-12 selection:bg-emerald-500 selection:text-slate-950">
      {/* Signature Floating Command Bar */}
      <CommandBar
        currentScenario={scenario}
        onScenarioChange={setScenario}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* VIEW 1: KISAN MOBILE VIEW */}
      {activeView === 'mobile' && (
        <main className="max-w-5xl mx-auto w-full px-4 mt-3 flex-1">
          <KisanMobileView panchayat={activePanchayat} scenario={scenario} />
        </main>
      )}

      {/* VIEW 2: PANCHAYAT KIOSK VIEW */}
      {activeView === 'kiosk' && (
        <main className="w-full px-4 mt-3 flex-1">
          <PanchayatKioskView panchayat={activePanchayat} scenario={scenario} />
        </main>
      )}

      {/* VIEW 3: WIDESCREEN GEOSPATIAL STUDIO (Default Award-Grade Layout) */}
      {activeView === 'dashboard' && (
        <main className="max-w-[1680px] mx-auto w-full px-4 sm:px-6 mt-3 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          
          {/* MAIN STAGE (8 Columns / 66% width): Expansive Google Map + Studio Action Drawer */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            
            {/* The Hero Google Map with Unified Apple Dynamic Island on top */}
            <div className="relative">
              <GoogleMapComponent
                panchayats={ALL_INDIA_PANCHAYATS}
                selectedId={selectedId}
                onSelectPanchayat={setSelectedId}
                activeVariable={activeVar}
                viewMode={viewMode}
              />

              {/* Floating Resolution Pill (Top Right on Map) */}
              <div className="absolute top-4 right-4 z-[1000] flex items-center bg-slate-900/90 backdrop-blur-2xl p-1 rounded-2xl border border-white/15 gap-1 text-[11px] shadow-[0_16px_36px_rgba(0,0,0,0.8)]">
                <button
                  onClick={() => setViewMode('fine')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    viewMode === 'fine' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔬 1.2km Fine
                </button>
                <button
                  onClick={() => setViewMode('coarse')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    viewMode === 'coarse' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📦 18km Coarse
                </button>
              </div>
            </div>

            {/* Studio Tools Dock: Unified Bottom Navigation Bar */}
            <div className="orchids-glass rounded-3xl p-4 shadow-2xl flex flex-col gap-4 border border-white/10">
              
              {/* Studio Tab Switcher Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Microclimate Analytics Studio</h3>
                    <p className="text-[11px] text-slate-400">Physics-informed agro-meteorology and crop protection engines</p>
                  </div>
                </div>

                <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/5 gap-1 text-xs">
                  <button
                    onClick={() => setActiveStudioTab('spray')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      activeStudioTab === 'spray'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Spray Window
                  </button>

                  <button
                    onClick={() => setActiveStudioTab('insurance')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      activeStudioTab === 'insurance'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> PMFBY Verifier
                  </button>

                  <button
                    onClick={() => setActiveStudioTab('imd')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      activeStudioTab === 'imd'
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" /> IMD Satellite (18km vs 1.2km)
                  </button>

                  <button
                    onClick={() => setActiveStudioTab('profile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      activeStudioTab === 'profile'
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mountain className="w-3.5 h-3.5" /> Elevation Profile
                  </button>

                  <button
                    onClick={() => setActiveStudioTab('acoustic')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      activeStudioTab === 'acoustic'
                        ? 'bg-violet-500 text-white font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" /> Acoustic AI
                  </button>
                </div>
              </div>

              {/* Active Studio Content Area */}
              <div>
                {activeStudioTab === 'spray' && (
                  <SprayTimelineChart hourlyData={hourlyData as any} />
                )}

                {activeStudioTab === 'insurance' && (
                  <PMFBYInsuranceModal
                    panchayat={activePanchayat}
                    scenario={scenario}
                    selectedCrop={selectedCrop}
                    fineMetrics={fine}
                    coarseMetrics={coarse}
                  />
                )}

                {activeStudioTab === 'imd' && (
                  <IMDSatelliteViewer
                    activePanchayat={activePanchayat}
                    scenario={scenario}
                    fineMetrics={fine}
                    coarseMetrics={coarse}
                  />
                )}

                {activeStudioTab === 'profile' && (
                  <ElevationProfile scenario={scenario} selectedId={selectedId} onSelect={setSelectedId} />
                )}

                {activeStudioTab === 'acoustic' && (
                  <AcousticSpectrogram />
                )}
              </div>
            </div>

          </section>

          {/* INSPECTOR STAGE (4 Columns / 34% width): Ground-Truth Metrics, Advisory Hub & Directory */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            
            {/* 1. Downscaling Metrics Card: High-Contrast Before vs After */}
            <DownscalingMetricsCard
              panchayatName={`${activePanchayat.name} (${activePanchayat.state})`}
              elevationM={activePanchayat.elevationM}
              terrainType={activePanchayat.terrainType}
              coarse={coarse}
              fine={fine}
              scenario={scenario}
            />

            {/* 2. Crop Phenology & Live Advisory Card */}
            <div className="orchids-glass rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Target Crop & Advisory</span>
                  <h4 className="text-sm font-bold text-white">Local Agricultural Guidance</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ICAR Certified
                </span>
              </div>

              {/* Crop Selector Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  ...activePanchayat.primaryCrops,
                  'Samba Paddy',
                  'Sharbati Wheat',
                  'Royal Apple',
                  'Darjeeling Tea',
                  'Cumbum Grapes',
                  'Nagpur Orange',
                ]
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .slice(0, 6)
                  .map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                        selectedCrop === crop
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
              </div>

              {/* Voice Reader */}
              <VoiceAdvisory textToSpeak={waMessage} />

              {/* Pest & Pathogen Alert */}
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Bug className="w-4 h-4" /> Microclimate Pest Alert
                  </span>
                  <span className="bg-rose-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono">ACTIVE RISK</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">
                  {isHimalayan
                    ? 'Apple Scab & Canker Risk'
                    : isCoastDelta
                    ? 'Rice Blast / Sheath Rot (High RH)'
                    : isAridMarwar
                    ? 'Locust & Whitefly Evapotranspiration Surge'
                    : 'Downy Mildew & Leaf Spot'}
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Relative humidity ({fine.relativeHumidity}%) and nocturnal canopy temperatures trigger fungal sporulation. Apply systemic protection before rain onset.
                </p>
              </div>

              {/* Irrigation Dynamic Window */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" /> Evapotranspiration & Irrigation
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">ET0: 4.8 mm</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {fine.rainfallMm > 20
                    ? `Precipitation (${fine.rainfallMm} mm) satisfies water requirements. Suspend canal/borewell irrigation.`
                    : `Schedule low-evaporation drip irrigation between 6:00 PM - 9:00 PM.`}
                </p>
              </div>

              {/* WhatsApp Broadcast Dispatcher */}
              <WhatsAppDrawer
                messageText={waMessage}
                panchayatName={`${activePanchayat.name} (${activePanchayat.state})`}
              />
            </div>

            {/* 3. Searchable 303-District Directory */}
            <PanchayatSelector
              panchayats={ALL_INDIA_PANCHAYATS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

          </aside>

        </main>
      )}
    </div>
  );
}
