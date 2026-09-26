'use client';

import React, { useState } from 'react';
import CommandBar from '@/components/CommandBar';
import PanchayatSelector from '@/components/PanchayatSelector';
import DownscalingMetricsCard from '@/components/DownscalingMetricsCard';
import GoogleMapComponent from '@/components/GoogleMapComponent';
import SprayTimelineChart from '@/components/SprayTimelineChart';
import ElevationProfile from '@/components/ElevationProfile';
import AcousticSpectrogram from '@/components/AcousticSpectrogram';
import VoiceAdvisory from '@/components/VoiceAdvisory';
import WhatsAppDrawer from '@/components/WhatsAppDrawer';
import KisanMobileView from '@/components/KisanMobileView';
import PanchayatKioskView from '@/components/PanchayatKioskView';
import { Bug, Droplets, Map, Mountain, Radio } from 'lucide-react';

const PANCHAYATS = [
  {
    id: "panchayat_male",
    name: "Male Valley Basin",
    elevationM: 558,
    terrainType: "Enclosed Deep Depression",
    drainageAccumulation: 0.95,
    polygonCoords: [
      [18.480, 73.540], [18.485, 73.570], [18.455, 73.572], [18.450, 73.542]
    ]
  },
  {
    id: "panchayat_paud",
    name: "Paud Gram Panchayat",
    elevationM: 595,
    terrainType: "River Valley (Mula Basin)",
    drainageAccumulation: 0.88,
    polygonCoords: [
      [18.545, 73.595], [18.550, 73.625], [18.520, 73.630], [18.515, 73.600]
    ]
  },
  {
    id: "panchayat_dasve",
    name: "Dasve Ridge Panchayat",
    elevationM: 1045,
    terrainType: "High Escarpment Crest",
    drainageAccumulation: 0.08,
    polygonCoords: [
      [18.425, 73.490], [18.428, 73.520], [18.398, 73.518], [18.395, 73.488]
    ]
  },
  {
    id: "panchayat_sinhagad",
    name: "Sinhagad Ridge Peak",
    elevationM: 1315,
    terrainType: "Basalt Cliff Peak",
    drainageAccumulation: 0.02,
    polygonCoords: [
      [18.378, 73.740], [18.380, 73.772], [18.352, 73.770], [18.350, 73.738]
    ]
  }
];

export default function AeroAgroDashboard() {
  const [selectedId, setSelectedId] = useState('panchayat_male');
  const [scenario, setScenario] = useState('monsoon');
  const [selectedCrop, setSelectedCrop] = useState('Table Grapes');
  const [activeVar, setActiveVar] = useState<'rainfall' | 'temp' | 'frost' | 'spray'>('rainfall');
  const [viewMode, setViewMode] = useState<'fine' | 'coarse'>('fine');
  const [activeCenterTab, setActiveCenterTab] = useState<'map' | 'profile' | 'acoustic'>('map');
  const [activeView, setActiveView] = useState<'dashboard' | 'mobile' | 'kiosk'>('dashboard');

  const activePanchayat = PANCHAYATS.find((p) => p.id === selectedId) || PANCHAYATS[0];

  // Coarse baseline
  const coarse = {
    tempMax: 26.5,
    tempMin: 22.0,
    rainfallMm: 28.0,
    windSpeedKmh: 22.0,
    relativeHumidity: 82,
  };

  // Fine downscaled calculation approximation
  const fine = {
    tempMax: 27.2,
    tempMin: scenario === 'winter_frost' ? 4.2 : 21.8,
    rainfallMm: activePanchayat.elevationM > 1000 ? 68.4 : 32.2,
    windSpeedKmh: activePanchayat.elevationM > 1000 ? 34.0 : 14.3,
    relativeHumidity: 89,
  };

  // Diurnal curve for Recharts
  const hourlyData = [
    { time: '06:00', tempC: 22.1, windKmh: 8.5, status: 'safe', reason: 'Optimal' },
    { time: '08:00', tempC: 24.3, windKmh: 10.2, status: 'safe', reason: 'Optimal' },
    { time: '10:00', tempC: 26.8, windKmh: 12.0, status: 'safe', reason: 'Optimal' },
    { time: '12:00', tempC: 28.4, windKmh: 15.6, status: 'caution', reason: 'Breezy' },
    { time: '14:00', tempC: 29.1, windKmh: 18.2, status: 'danger', reason: 'High drift' },
    { time: '16:00', tempC: 27.5, windKmh: 19.5, status: 'danger', reason: 'Localized shower' },
    { time: '18:00', tempC: 25.0, windKmh: 12.8, status: 'caution', reason: 'Light breeze' },
  ];

  const waMessageEn = `🌱 *AGROMET ADVISORY: ${activePanchayat.name.toUpperCase()}*\n📍 Elevation: ${activePanchayat.elevationM}m | Terrain: ${activePanchayat.terrainType}\n🌾 Focus Crop: ${selectedCrop}\n\n📊 *Downscaled 24h Microclimate:*\n• Temperature: ${fine.tempMin}°C to ${fine.tempMax}°C\n• Precipitation: ${fine.rainfallMm} mm\n• Wind Speed: ${fine.windSpeedKmh} km/h | RH: ${fine.relativeHumidity}%\n\n🚜 *FARM ACTIONS:*\n• Spray Window: 06:00 AM - 10:30 AM (Optimal)\n• Irrigation: Suspend scheduled drip (Ample soil moisture)\n• Pathogen Threat: Downy Mildew / Blight Risk (HIGH)\n${scenario === 'winter_frost' && fine.tempMin < 6 ? `⚠️ *FROST ALERT:* Cold air pooling at ${fine.tempMin}°C. Run night misting to prevent blossom freezing.` : ''}`;

  return (
    <div className="min-h-screen bg-orchids-bg text-slate-100 flex flex-col pb-10">
      
      {/* Orchids Signature Floating Command Bar with 3-Way View Switcher */}
      <CommandBar
        currentScenario={scenario}
        onScenarioChange={setScenario}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* VIEW 1: KISAN MOBILE VIEW (Simulated Smartphone) */}
      {activeView === 'mobile' && (
        <main className="max-w-7xl mx-auto w-full px-4 mt-2 flex-1">
          <KisanMobileView
            panchayat={activePanchayat}
            scenario={scenario}
          />
        </main>
      )}

      {/* VIEW 2: PANCHAYAT KIOSK VIEW (Full-Screen Wallboard) */}
      {activeView === 'kiosk' && (
        <main className="w-full px-4 mt-2 flex-1">
          <PanchayatKioskView
            panchayat={activePanchayat}
            scenario={scenario}
          />
        </main>
      )}

      {/* VIEW 3: FULL WEB GIS DASHBOARD (Default 3-Column Studio) */}
      {activeView === 'dashboard' && (
        <main className="max-w-7xl mx-auto w-full px-4 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          
          {/* Left Column (Panchayat Focus & Downscaling Metrics) - 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <DownscalingMetricsCard
              panchayatName={activePanchayat.name}
              elevationM={activePanchayat.elevationM}
              terrainType={activePanchayat.terrainType}
              coarse={coarse}
              fine={fine}
              scenario={scenario}
            />

            <PanchayatSelector
              panchayats={PANCHAYATS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Center Column (Google Maps / Cross-Section / Acoustic Spectrogram + Spray Timeline) - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Center Navigation Tabs */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveCenterTab('map')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  activeCenterTab === 'map' ? 'bg-emerald-500 text-white shadow-orchids-glow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map className="w-3.5 h-3.5" /> Google Maps
              </button>
              <button
                onClick={() => setActiveCenterTab('profile')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  activeCenterTab === 'profile' ? 'bg-cyan-500 text-white shadow-orchids-cyan-glow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" /> Inversion Profile
              </button>
              <button
                onClick={() => setActiveCenterTab('acoustic')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  activeCenterTab === 'acoustic' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" /> Acoustic AI
              </button>
            </div>

            {/* Conditional Center Content */}
            {activeCenterTab === 'map' && (
              <div className="relative">
                <GoogleMapComponent
                  panchayats={PANCHAYATS}
                  selectedId={selectedId}
                  onSelectPanchayat={setSelectedId}
                  activeVariable={activeVar}
                  viewMode={viewMode}
                />

                {/* Floating Map Controls */}
                <div className="absolute top-3 right-3 z-10 flex items-center bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10 gap-1 text-[11px] shadow-lg">
                  <button
                    onClick={() => setViewMode('fine')}
                    className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'fine' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔬 Downscaled
                  </button>
                  <button
                    onClick={() => setViewMode('coarse')}
                    className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'coarse' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📦 Coarse 18km
                  </button>
                </div>
              </div>
            )}

            {activeCenterTab === 'profile' && (
              <ElevationProfile
                scenario={scenario}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}

            {activeCenterTab === 'acoustic' && (
              <AcousticSpectrogram />
            )}

            {/* Recharts Hourly Diurnal Chart */}
            <SprayTimelineChart hourlyData={hourlyData as any} />
          </div>

          {/* Right Column (Crop Focus, Pest Alerts, Voice Advisory & WhatsApp Dispatcher) - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* Target Crop Selector */}
            <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Target Crop Focus</div>
              <div className="flex flex-wrap gap-1.5">
                {['Table Grapes', 'Paddy', 'Tomato', 'Sugarcane'].map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                      selectedCrop === crop
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            {/* Vernacular Speech Audio Reader (English) */}
            <VoiceAdvisory
              textToSpeak={waMessageEn}
            />

            {/* Disease Risk Alert */}
            <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card border-rose-500/20">
              <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-2">
                <span className="flex items-center gap-1.5"><Bug className="w-3.5 h-3.5" /> Pathogen Threat</span>
                <span className="bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 font-mono text-[10px]">
                  HIGH RISK
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Downy Mildew (Plasmopara viticola)</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Relative humidity ({fine.relativeHumidity}%) and nocturnal canopy temperatures promote rapid sporulation. Apply preventative copper fungicide within 24 hours.
              </p>
            </div>

            {/* Irrigation Advisor */}
            <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card border-cyan-500/20">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
                <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" /> Irrigation Schedule</span>
                <span className="text-[10px] font-mono text-cyan-300">ET0: 4.8 mm</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                Downscaled precipitation ({fine.rainfallMm} mm) exceeds daily crop water requirement. Suspend drip irrigation.
              </p>
            </div>

            {/* WhatsApp Dispatcher */}
            <WhatsAppDrawer
              messageText={waMessageEn}
              panchayatName={activePanchayat.name}
            />

          </div>

        </main>
      )}

    </div>
  );
}
