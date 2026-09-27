'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Clock, Mountain, Radio, Satellite, ShieldCheck, Download, Github } from 'lucide-react';

import CommandBar, { Logo } from '@/components/CommandBar';
import Hero from '@/components/Hero';
import TodayCard from '@/components/TodayCard';
import ActionPlan from '@/components/ActionPlan';
import WhatsAppDrawer from '@/components/WhatsAppDrawer';
import SprayTimelineChart from '@/components/SprayTimelineChart';
import ElevationProfile from '@/components/ElevationProfile';
import AcousticSpectrogram from '@/components/AcousticSpectrogram';
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
    <div className="card grid h-[520px] place-items-center sm:h-[600px]">
      <div className="flex flex-col items-center gap-3 text-sm text-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        Loading map…
      </div>
    </div>
  ),
});

export type MapVariable = 'rainfall' | 'tempMin' | 'tempMax' | 'wind';
type StudioTab = 'spray' | 'insurance' | 'imd' | 'profile' | 'acoustic';

const DEFAULT_ID = 'tamilnadu_thanjavur_6'; // Thiruvaiyaru, Cauvery delta

/** Climatological season for today, used when live data is unavailable. */
function seasonForToday(now: Date | null): Exclude<Scenario, 'live'> {
  if (!now) return 'monsoon';
  const m = now.getMonth(); // 0 = Jan
  if (m >= 5 && m <= 9) return 'monsoon';
  if (m >= 2 && m <= 4) return 'pre_monsoon';
  return 'winter_frost';
}

const STUDIO_TABS: { id: StudioTab; label: string; icon: React.ElementType; blurb: string }[] = [
  { id: 'spray', label: 'Hourly spray', icon: Clock, blurb: 'Wind, rain and heat hour by hour' },
  { id: 'insurance', label: 'Crop insurance', icon: ShieldCheck, blurb: 'PMFBY weather-index evidence' },
  { id: 'imd', label: 'Satellite', icon: Satellite, blurb: 'Live IMD INSAT-3DR imagery' },
  { id: 'profile', label: 'Terrain transect', icon: Mountain, blurb: 'Himalaya to the delta' },
  { id: 'acoustic', label: 'Rain by sound', icon: Radio, blurb: 'Tin-roof acoustic gauge' },
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
  // Wall-clock time is only read after mount so the static HTML and first client render match.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const activePanchayat = ALL_INDIA_PANCHAYATS.find((p) => p.id === selectedId) || ALL_INDIA_PANCHAYATS[0];

  // Reset the crop to the region's own primary crop when the region changes.
  useEffect(() => {
    if (activePanchayat.primaryCrops.length) setSelectedCrop(activePanchayat.primaryCrops[0]);
  }, [activePanchayat]);

  const isLive = scenario === 'live';
  const live = useLiveForecast(activePanchayat, isLive);
  const { national, nationalStatus } = useLiveNational(ALL_INDIA_PANCHAYATS, isLive);
  const liveOk = isLive && live.status === 'ready' && !!live.data;
  const fallbackScenario = isLive ? seasonForToday(now) : scenario;

  // ---- Coarse → fine for the selected region ----
  const coarse: WeatherMetrics = liveOk ? live.data!.daily : scenarioBaseline(activePanchayat, fallbackScenario);
  const coarseElev = liveOk ? live.data!.gridElevationM : blockElevation(activePanchayat);
  const fine = downscale(activePanchayat, coarse, coarseElev);

  const hourlyData = classifyHours(liveOk ? downscaleHourly(live.data!.hourly, coarse, fine) : synthHourly(fine));
  const sprayWindow = bestSprayWindow(hourlyData);
  const et0 = referenceET0(activePanchayat.lat, fine, now);
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
    ? { kind: 'live' as const, label: `Live forecast · Open-Meteo · updated ${new Date(live.data!.fetchedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` }
    : isLive && live.status === 'loading'
    ? { kind: 'loading' as const, label: 'Fetching live forecast…' }
    : isLive
    ? { kind: 'offline' as const, label: `Offline · using ${fallbackScenario.replace('_', ' ')} climatology` }
    : { kind: 'scenario' as const, label: 'Simulated scenario for demonstration' };

  const cropChoices = [...activePanchayat.primaryCrops, 'Samba Paddy', 'Table Grapes', 'Sharbati Wheat', 'Cotton', 'Royal Apple', 'Darjeeling Tea']
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 7);

  const shared = { panchayat: activePanchayat, fine, coarse, hourly: hourlyData, sprayWindow, irrigation, pest, et0, lang, onLangChange: setLang, advisoryText, crop: selectedCrop };

  const selectRegion = (id: string) => {
    setSelectedId(id);
    if (activeView !== 'dashboard') return;
    requestAnimationFrame(() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <CommandBar
        currentScenario={scenario}
        onScenarioChange={setScenario}
        activeView={activeView}
        onViewChange={setActiveView}
        dataSource={dataSource}
        onAbout={() => setShowAbout(true)}
        regions={ALL_INDIA_PANCHAYATS}
        onSelectRegion={selectRegion}
      />

      {activeView === 'dashboard' && <Hero regions={ALL_INDIA_PANCHAYATS} onSelect={setSelectedId} />}

      {activeView === 'mobile' && (
        <div className="topo-bg flex-1">
          <main className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-8">
            <KisanMobileView {...shared} />
          </main>
        </div>
      )}

      {activeView === 'kiosk' && (
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
          <PanchayatKioskView {...shared} />
        </main>
      )}

      {activeView === 'dashboard' && (
        <main id="dashboard" className="mx-auto w-full max-w-[1400px] flex-1 scroll-mt-20 px-4 pb-16 sm:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-t border-line/[0.07] pt-10">
            <div>
              <div className="eyebrow">Live dashboard</div>
              <h2 className="mt-1 font-display text-3xl text-ink sm:text-4xl">India, one village at a time</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Click any dot on the map or search above. Colours show today’s {viewMode === 'fine' ? 'downscaled 1.2 km' : 'coarse 18 km'} forecast.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex min-w-0 flex-col gap-6">
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

              <section className="card overflow-hidden" aria-labelledby="tools-title">
                <div className="border-b border-line/[0.07] px-5 pt-5 sm:px-6">
                  <h2 id="tools-title" className="font-display text-xl text-ink">
                    Deep-dive tools
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">{STUDIO_TABS.find((t) => t.id === activeStudioTab)!.blurb} for {activePanchayat.name}</p>
                  <div role="tablist" className="-mb-px mt-4 flex gap-1 overflow-x-auto scrollbar-none">
                    {STUDIO_TABS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        role="tab"
                        aria-selected={activeStudioTab === id}
                        onClick={() => setActiveStudioTab(id)}
                        className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 pt-1 text-sm font-medium transition-colors ${
                          activeStudioTab === id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink2'
                        }`}
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div key={activeStudioTab} role="tabpanel" className="animate-fade-in p-5 sm:p-6">
                  {activeStudioTab === 'spray' && <SprayTimelineChart hourlyData={hourlyData} sprayWindow={sprayWindow} isLive={liveOk} />}
                  {activeStudioTab === 'insurance' && <PMFBYInsuranceModal panchayat={activePanchayat} selectedCrop={selectedCrop} fineMetrics={fine} coarseMetrics={coarse} />}
                  {activeStudioTab === 'imd' && <IMDSatelliteViewer activePanchayat={activePanchayat} fineMetrics={fine} coarseMetrics={coarse} />}
                  {activeStudioTab === 'profile' && (
                    <ElevationProfile panchayats={ALL_INDIA_PANCHAYATS} regionMetrics={regionMetrics} selectedId={selectedId} onSelect={setSelectedId} />
                  )}
                  {activeStudioTab === 'acoustic' && <AcousticSpectrogram />}
                </div>
              </section>

              <WhatsAppDrawer messageText={advisoryText} lang={lang} onLangChange={setLang} placeName={activePanchayat.name} />
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <TodayCard panchayat={activePanchayat} coarse={coarse} fine={fine} coarseElevationM={Math.round(coarseElev)} source={dataSource} />
              <ActionPlan
                crop={selectedCrop}
                crops={cropChoices}
                onCropChange={setSelectedCrop}
                hourly={hourlyData}
                sprayWindow={sprayWindow}
                irrigation={irrigation}
                et0={et0}
                pest={pest}
              />
            </aside>
          </div>
        </main>
      )}

      <footer className="border-t border-line/[0.07]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <div>
              <div className="font-display text-lg text-ink">AeroAgro AI</div>
              <div className="text-xs text-muted">Weather for your village, not your district.</div>
            </div>
          </div>
          <p className="max-w-lg text-xs leading-relaxed text-muted">
            Data: Open-Meteo NWP · NASA SRTM 30 m · IMD INSAT-3DR · ICAR agromet guidance. Downscaled values are decision-support estimates, not an
            official IMD forecast.
          </p>
          <div className="flex gap-2">
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH}/aeroagro_figma_artboard.svg`} download className="btn-ghost h-9 px-3 text-xs">
              <Download className="h-3.5 w-3.5" /> Figma file
            </a>
            <a href="https://github.com/barath178/panchayat-weather-downscaling" target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-xs">
              <Github className="h-3.5 w-3.5" /> Source
            </a>
            <button onClick={() => setShowAbout(true)} className="btn-ghost h-9 px-3 text-xs">
              About
            </button>
          </div>
        </div>
      </footer>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
