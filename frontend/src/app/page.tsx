'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Bug, Clock, Droplets, Mountain, Radio, Satellite, ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import CommandBar from '@/components/CommandBar';
import PanchayatSelector from '@/components/PanchayatSelector';
import DownscalingMetricsCard from '@/components/DownscalingMetricsCard';
import SprayTimelineChart from '@/components/SprayTimelineChart';
import ElevationProfile from '@/components/ElevationProfile';
import AcousticSpectrogram from '@/components/AcousticSpectrogram';
import VoiceAdvisory from '@/components/VoiceAdvisory';
import WhatsAppDrawer from '@/components/WhatsAppDrawer';
import KisanMobileView from '@/components/KisanMobileView';
import PanchayatKioskView from '@/components/PanchayatKioskView';
import PMFBYInsuranceModal from '@/components/PMFBYInsuranceModal';
import IMDSatelliteViewer from '@/components/IMDSatelliteViewer';
import AboutModal from '@/components/AboutModal';

import { ALL_INDIA_PANCHAYATS } from '@/data/all_india_regions';
import {
  Scenario,
  WeatherMetrics,
  blockElevation,
  bestSprayWindow,
  classifyHours,
  downscale,
  downscaleHourly,
  irrigationAdvice,
  pestRisk,
  referenceET0,
  scenarioBaseline,
  synthHourly,
} from '@/lib/microclimate';
import { useLiveForecast, useLiveNational } from '@/lib/useLiveForecast';
import { Lang, buildAdvisory } from '@/lib/advisory';

const GoogleMapComponent = dynamic(() => import('@/components/GoogleMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] sm:h-[620px] rounded-3xl bg-[#080d1a] border border-white/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-emerald-400 font-semibold">Loading terrain map…</span>
      </div>
    </div>
  ),
});

export type MapVariable = 'rainfall' | 'tempMin' | 'tempMax' | 'wind';
type StudioTab = 'spray' | 'insurance' | 'imd' | 'profile' | 'acoustic';

const DEFAULT_ID = 'tamilnadu_thanjavur_6'; // Thiruvaiyaru, Cauvery delta

/** Climatological season for today, used when live data is unavailable. */
function seasonForToday(): Exclude<Scenario, 'live'> {
  const m = new Date().getMonth(); // 0 = Jan
  if (m >= 5 && m <= 9) return 'monsoon';
  if (m >= 2 && m <= 4) return 'pre_monsoon';
  return 'winter_frost';
}

const STUDIO_TABS: { id: StudioTab; label: string; icon: React.ElementType; active: string }[] = [
  { id: 'spray', label: 'Spray Window', icon: Clock, active: 'bg-emerald-500 text-slate-950' },
  { id: 'insurance', label: 'PMFBY Verifier', icon: ShieldCheck, active: 'bg-amber-500 text-slate-950' },
  { id: 'imd', label: 'IMD Satellite', icon: Satellite, active: 'bg-blue-600 text-white' },
  { id: 'profile', label: 'Elevation Transect', icon: Mountain, active: 'bg-cyan-500 text-slate-950' },
  { id: 'acoustic', label: 'Acoustic Rain AI', icon: Radio, active: 'bg-violet-500 text-white' },
];

export default function AeroAgroDashboard() {
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);
  const [scenario, setScenario] = useState<Scenario>('live');
  const [lang, setLang] = useState<Lang>('en');
  const [selectedCrop, setSelectedCrop] = useState('Samba Paddy');
  const [activeVar, setActiveVar] = useState<MapVariable>('rainfall');
  const [viewMode, setViewMode] = useState<'fine' | 'coarse'>('fine');
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('spray');
  const [activeView, setActiveView] = useState<'dashboard' | 'mobile' | 'kiosk'>('dashboard');
  const [showAbout, setShowAbout] = useState(false);

  const activePanchayat = ALL_INDIA_PANCHAYATS.find((p) => p.id === selectedId) || ALL_INDIA_PANCHAYATS[0];

  // Reset the crop to the region's own primary crop when the region changes.
  useEffect(() => {
    if (activePanchayat.primaryCrops.length) setSelectedCrop(activePanchayat.primaryCrops[0]);
  }, [activePanchayat]);

  const isLive = scenario === 'live';
  const live = useLiveForecast(activePanchayat, isLive);
  const { national, nationalStatus } = useLiveNational(ALL_INDIA_PANCHAYATS, isLive);
  const liveOk = isLive && live.status === 'ready' && !!live.data;
  const fallbackScenario = isLive ? seasonForToday() : scenario;

  // ---- Coarse → fine for the selected region ----
  const coarse: WeatherMetrics = liveOk ? live.data!.daily : scenarioBaseline(activePanchayat, fallbackScenario);
  const coarseElev = liveOk ? live.data!.gridElevationM : blockElevation(activePanchayat);
  const fine = downscale(activePanchayat, coarse, coarseElev);

  const hourlyData = classifyHours(
    liveOk ? downscaleHourly(live.data!.hourly, coarse, fine) : synthHourly(fine)
  );
  const sprayWindow = bestSprayWindow(hourlyData);
  const et0 = referenceET0(activePanchayat.lat, fine);
  const irrigation = irrigationAdvice(et0, fine);
  const pest = pestRisk(activePanchayat, selectedCrop, fine);

  // ---- Map colouring: every region, coarse or fine ----
  const regionMetrics = useMemo(() => {
    const out: Record<string, { coarse: WeatherMetrics; fine: WeatherMetrics }> = {};
    for (const p of ALL_INDIA_PANCHAYATS) {
      const n = isLive ? national?.[p.id] : undefined;
      const c = n ? n.daily : scenarioBaseline(p, fallbackScenario);
      out[p.id] = { coarse: c, fine: downscale(p, c, n ? n.gridElevationM : blockElevation(p)) };
    }
    return out;
  }, [isLive, national, fallbackScenario]);

  const advisoryText = buildAdvisory(
    { panchayat: activePanchayat, crop: selectedCrop, fine, sprayWindow, irrigationAction: irrigation.action, pest },
    lang
  );

  const dataSource = liveOk
    ? { kind: 'live' as const, label: `Live · Open-Meteo · ${new Date(live.data!.fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` }
    : isLive && live.status === 'loading'
    ? { kind: 'loading' as const, label: 'Fetching live forecast…' }
    : isLive
    ? { kind: 'offline' as const, label: `Offline · ${fallbackScenario.replace('_', ' ')} climatology` }
    : { kind: 'scenario' as const, label: 'Scenario simulation' };

  const cropChoices = [...activePanchayat.primaryCrops, 'Samba Paddy', 'Sharbati Wheat', 'Royal Apple', 'Darjeeling Tea', 'Table Grapes', 'Cotton']
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 7);

  const shared = { panchayat: activePanchayat, fine, coarse, hourly: hourlyData, sprayWindow, irrigation, pest, et0, lang, onLangChange: setLang, advisoryText, crop: selectedCrop };

  return (
    <div className="min-h-screen bg-orchids-bg text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <CommandBar
        currentScenario={scenario}
        onScenarioChange={setScenario}
        activeView={activeView}
        onViewChange={setActiveView}
        dataSource={dataSource}
        onAbout={() => setShowAbout(true)}
      />

      {activeView === 'mobile' && (
        <main className="max-w-5xl mx-auto w-full px-4 mt-3 flex-1">
          <KisanMobileView {...shared} />
        </main>
      )}

      {activeView === 'kiosk' && (
        <main className="w-full px-4 mt-3 flex-1">
          <PanchayatKioskView {...shared} />
        </main>
      )}

      {activeView === 'dashboard' && (
        <main className="max-w-[1680px] mx-auto w-full px-3 sm:px-6 mt-3 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          <section className="lg:col-span-8 flex flex-col gap-4 min-w-0">
            <GoogleMapComponent
              panchayats={ALL_INDIA_PANCHAYATS}
              selectedId={selectedId}
              onSelectPanchayat={setSelectedId}
              activeVariable={activeVar}
              onVariableChange={setActiveVar}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              regionMetrics={regionMetrics}
              liveLoading={isLive && nationalStatus === 'loading'}
            />

            {/* Studio */}
            <div className="orchids-glass rounded-3xl p-3 sm:p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Microclimate Analytics Studio</h3>
                  <p className="text-[11px] text-slate-400">Physics-informed agromet and crop-protection tools for {activePanchayat.name}</p>
                </div>
                <div role="tablist" className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/5 gap-1 text-xs overflow-x-auto max-w-full scrollbar-none">
                  {STUDIO_TABS.map(({ id, label, icon: Icon, active }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activeStudioTab === id}
                      onClick={() => setActiveStudioTab(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                        activeStudioTab === id ? `${active} font-bold shadow-md` : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div key={activeStudioTab} className="animate-fade-in">
                {activeStudioTab === 'spray' && <SprayTimelineChart hourlyData={hourlyData} sprayWindow={sprayWindow} isLive={liveOk} />}
                {activeStudioTab === 'insurance' && (
                  <PMFBYInsuranceModal panchayat={activePanchayat} selectedCrop={selectedCrop} fineMetrics={fine} coarseMetrics={coarse} />
                )}
                {activeStudioTab === 'imd' && (
                  <IMDSatelliteViewer activePanchayat={activePanchayat} fineMetrics={fine} coarseMetrics={coarse} />
                )}
                {activeStudioTab === 'profile' && (
                  <ElevationProfile
                    panchayats={ALL_INDIA_PANCHAYATS}
                    regionMetrics={regionMetrics}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                )}
                {activeStudioTab === 'acoustic' && <AcousticSpectrogram />}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 flex flex-col gap-4 min-w-0">
            <DownscalingMetricsCard
              panchayatName={`${activePanchayat.name}`}
              subtitle={`${activePanchayat.district}, ${activePanchayat.state}`}
              elevationM={activePanchayat.elevationM}
              coarseElevationM={Math.round(coarseElev)}
              terrainType={activePanchayat.terrainType}
              coarse={coarse}
              fine={fine}
              isLive={liveOk}
            />

            <div className="orchids-glass rounded-3xl p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Crop advisory</span>
                  <h4 className="text-sm font-bold text-white">Local agricultural guidance</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ICAR rules
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select crop">
                {cropChoices.map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    aria-pressed={selectedCrop === crop}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                      selectedCrop === crop
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>

              {/* Spray window summary */}
              <div className={`rounded-2xl p-3.5 border ${sprayWindow.hours ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${sprayWindow.hours ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {sprayWindow.hours ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {sprayWindow.hours ? `Best spray window: ${sprayWindow.label}` : 'No safe spray window today'}
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {sprayWindow.hours
                    ? `${sprayWindow.hours} consecutive hours with wind under 10 km/h and no rain expected.`
                    : 'Rain or wind above the 15 km/h drift limit through the day. Postpone chemical application.'}
                </p>
              </div>

              {/* Pest risk */}
              <div
                className={`rounded-2xl p-3.5 border ${
                  pest.level === 'high' ? 'bg-rose-500/10 border-rose-500/30' : pest.level === 'moderate' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={`flex items-center gap-1.5 ${pest.level === 'high' ? 'text-rose-300' : pest.level === 'moderate' ? 'text-amber-300' : 'text-slate-300'}`}>
                    <Bug className="w-4 h-4" /> Pest & disease risk
                  </span>
                  <span className="bg-black/30 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase text-slate-200">{pest.level}</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">{pest.title}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">{pest.detail}</p>
              </div>

              {/* Irrigation */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" /> {irrigation.action}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-200" title="FAO-56 Hargreaves reference evapotranspiration">
                    ET₀ {et0} mm
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{irrigation.detail}</p>
              </div>

              <VoiceAdvisory textToSpeak={advisoryText} lang={lang} onLangChange={setLang} />
              <WhatsAppDrawer messageText={advisoryText} panchayatName={activePanchayat.name} />
            </div>

            <PanchayatSelector panchayats={ALL_INDIA_PANCHAYATS} selectedId={selectedId} onSelect={setSelectedId} />
          </aside>
        </main>
      )}

      <footer className="max-w-[1680px] mx-auto w-full px-4 sm:px-6 py-6 mt-6 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
        <span>
          <strong className="text-slate-300">AeroAgro AI</strong> · Block-to-Panchayat weather downscaling for precision agromet advisories
        </span>
        <button onClick={() => setShowAbout(true)} className="flex items-center gap-1 hover:text-slate-300">
          <Info className="w-3.5 h-3.5" /> Data sources: Open-Meteo NWP · NASA SRTM 30 m · IMD INSAT-3DR · ICAR agromet guidance
        </button>
      </footer>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
