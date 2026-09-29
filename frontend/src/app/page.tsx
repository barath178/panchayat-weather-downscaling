'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Clock, Mountain, Radio, Satellite, ShieldCheck, Sparkles, CloudRain, Layers3, Cpu, FileText, ArrowRight, ArrowUpRight, Smartphone, Tv } from 'lucide-react';

import CommandBar, { Logo } from '@/components/CommandBar';
import TabBar, { Tab } from '@/components/TabBar';
import VillageSheet from '@/components/VillageSheet';
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
import AlertScan from '@/components/AlertScan';
import WeekForecast from '@/components/WeekForecast';
import BlockGridCard from '@/components/BlockGridCard';
import ExplainPanel from '@/components/ExplainPanel';
import AskAeroAgro from '@/components/AskAeroAgro';
import AgrometBulletin from '@/components/AgrometBulletin';
import { Reveal, SectionHead, Telemetry, TelemetryStrip } from '@/components/Instrument';

import { ALL_INDIA_PANCHAYATS } from '@/data/all_india_regions';
import {
  Scenario,
  WeatherMetrics,
  blockElevation,
  bestSprayWindow,
  classifyHours,
  downscale,
  downscaleDetailed,
  downscaleHourly,
  irrigationAdvice,
  pestRisk,
  referenceET0,
  scenarioBaseline,
  scenarioWeek,
  synthHourly,
} from '@/lib/microclimate';
import { useLiveForecast, useLiveNational } from '@/lib/useLiveForecast';
import { Lang, buildAdvisory } from '@/lib/advisory';
import { buildWeek, weekDates } from '@/lib/week';
import { GridVar, computeField, useBlockGrid } from '@/lib/blockGrid';
import type { AssistantAction, AssistantContext } from '@/lib/assistant';

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
  const [tab, setTab] = useState<Tab>('map');
  const [showBulletin, setShowBulletin] = useState(false);
  const [focusBlock, setFocusBlock] = useState(0);
  // Wall-clock time is only read after mount so the static HTML and first client render match.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  // Shareable links: ?v=<region id> opens that village
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('v');
    if (v && ALL_INDIA_PANCHAYATS.some((p) => p.id === v)) setSelectedId(v);
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId === DEFAULT_ID) url.searchParams.delete('v');
    else url.searchParams.set('v', selectedId);
    window.history.replaceState(null, '', url);
  }, [selectedId]);

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
  const liveData = liveOk ? live.data! : null;
  const coarse: WeatherMetrics = useMemo(
    () => (liveData ? liveData.daily : scenarioBaseline(activePanchayat, fallbackScenario)),
    [liveData, activePanchayat, fallbackScenario]
  );
  const coarseElev = liveData ? liveData.gridElevationM : blockElevation(activePanchayat);
  const detail = useMemo(() => downscaleDetailed(activePanchayat, coarse, coarseElev), [activePanchayat, coarse, coarseElev]);
  const fine = detail.metrics;

  const hourlyData = useMemo(
    () => classifyHours(liveData ? downscaleHourly(liveData.hourly, coarse, fine) : synthHourly(fine)),
    [liveData, coarse, fine]
  );
  const sprayWindow = useMemo(() => bestSprayWindow(hourlyData), [hourlyData]);
  const et0 = referenceET0(activePanchayat.lat, fine, now);
  const irrigation = irrigationAdvice(et0, fine);
  const pest = pestRisk(activePanchayat, selectedCrop, fine);

  // ---- 7-day village outlook ----
  const coarseDays = useMemo(
    () => (liveData?.days?.length ? liveData.days : scenarioWeek(activePanchayat, fallbackScenario)),
    [liveData, activePanchayat, fallbackScenario]
  );
  const dates = useMemo(() => (liveData?.dates?.length ? liveData.dates : weekDates(now, coarseDays.length)), [liveData, now, coarseDays.length]);
  const week = useMemo(
    () => buildWeek(activePanchayat, coarseDays, coarseElev, dates, { hourly: hourlyData, spray: sprayWindow }),
    [activePanchayat, coarseDays, coarseElev, dates, hourlyData, sprayWindow]
  );

  // ---- 1.2 km grid inside the 18 km block (live DEM) ----
  const dem = useBlockGrid(activePanchayat);
  const blockField = useMemo(
    () => (dem.grid ? computeField(dem.grid, activePanchayat, coarse, coarseElev, fine) : null),
    [dem.grid, activePanchayat, coarse, coarseElev, fine]
  );

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

  const assistantCtx: AssistantContext = {
    p: activePanchayat,
    crop: selectedCrop,
    week,
    coarse,
    fine,
    irrigation,
    et0,
    pest,
    detail,
    coarseElevationM: coarseElev,
    isLive: liveOk,
  };

  const telemetry: Telemetry = {
    status: dataSource.kind,
    source: liveOk ? 'Open-Meteo best match' : isLive ? 'climatology fallback' : 'simulated scenario',
    updated: liveData ? `${new Date(liveData.fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} IST` : null,
    lat: activePanchayat.lat,
    lng: activePanchayat.lng,
    elevationM: activePanchayat.elevationM,
    cellElevationM: coarseElev,
    dem: dem.grid ? dem.grid.source : 'loading',
    regions: ALL_INDIA_PANCHAYATS.length,
  };

  const scrollTo = (id: string) => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

  const selectRegion = (id: string) => {
    setSelectedId(id);
    setActiveView('dashboard');
    setTab('map');
  };

  const onAssistantAction = (a: AssistantAction) => {
    if (a === 'bulletin') setShowBulletin(true);
    else if (a === 'spray' || a === 'insurance') {
      setActiveStudioTab(a);
      setTab('tools');
    } else setTab('engine');
  };

  const showGridOnMap = (v: GridVar) => {
    setActiveVar(v === 'elevation' ? 'tempMin' : v);
    setViewMode('fine');
    setFocusBlock((n) => n + 1);
    setTab('map');
  };

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <TelemetryStrip t={telemetry} />
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

      {activeView === 'dashboard' && <TabBar tab={tab} onChange={setTab} />}

      {activeView === 'mobile' && (
        <div className="night topo-bg flex-1">
          <main className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-8">
            <KisanMobileView {...shared} />
          </main>
        </div>
      )}

      {activeView === 'kiosk' && (
        <div className="night flex-1">
          <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
            <PanchayatKioskView {...shared} />
          </main>
        </div>
      )}

      {activeView === 'dashboard' && (
        <main id="dashboard" className="flex-1">
          {tab === 'village' && (<>
          <section id="village" className="mx-auto max-w-[1320px] scroll-mt-16 px-5 py-6 sm:px-8 lg:py-8">
            <Reveal>
              <SectionHead
                index="01"
                kicker="Your village, today"
                title={
                  <>
                    One village. <em className="text-accent">Its own forecast.</em>
                  </>
                }
                meta="Pick any of 303 regions. Everything here is re-computed for that exact place: temperature, rain and wind, and what to do about them."
              />
            </Reveal>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="card p-7 sm:p-10 lg:col-span-7">
                <VillageSheet panchayat={activePanchayat} coarse={coarse} fine={fine} coarseElevationM={Math.round(coarseElev)} source={dataSource} now={now} />
              </div>
              <div className="lg:col-span-5">
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
              </div>
            </div>
            <div className="mt-6">
              <WeekForecast panchayat={activePanchayat} week={week} isLive={liveOk} onOpenBulletin={() => setShowBulletin(true)} />
            </div>
          </section>

          </>)}
          {tab === 'map' && (<>
          <section id="map" className="night scroll-mt-16">
            <div className="mx-auto max-w-[1320px] px-5 py-6 sm:px-8 lg:py-8">
              
              
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
                blockField={blockField}
                focusBlock={focusBlock}
                heightClass="h-[calc(100vh-190px)] min-h-[480px]"
              />
              <div className="mt-6"><AlertScan regions={ALL_INDIA_PANCHAYATS} regionMetrics={regionMetrics} selectedId={selectedId} onSelect={setSelectedId} source={dataSource.kind} /></div>
            </div>
          </section>

          </>)}
          {tab === 'engine' && (<>
          <section id="engine" className="night scroll-mt-16 border-t border-line/[0.08]" aria-labelledby="engine-title">
            <div className="mx-auto max-w-[1320px] px-5 py-6 sm:px-8 lg:py-8">
              <Reveal>
                <SectionHead
                  index="03"
                  kicker="The downscaling engine"
                  id="engine-title"
                  title={
                    <>
                      From block to panchayat, <em className="text-accent">shown working.</em>
                    </>
                  }
                  meta="Real terrain heights, transparent physics and an equation behind every number. Nothing here is a black box."
                />
              </Reveal>
              <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] lg:grid-cols-4" aria-label="Pipeline">
                {[
                  { icon: CloudRain, k: 'In', t: 'NWP block forecast', d: `Open-Meteo · cell ${Math.round(coarseElev)} m` },
                  { icon: Layers3, k: 'Terrain', t: 'DEM + covariates', d: `GLO-90 · slope ${activePanchayat.slopeDeg}° · D ${activePanchayat.drainageAccumulation}` },
                  { icon: Cpu, k: 'Model', t: 'Physics inference', d: 'Γ lapse · pooling · orographic · OI blend' },
                  { icon: FileText, k: 'Out', t: 'Village advisory', d: `${activePanchayat.elevationM} m · Δx 1.2 km · 7 days` },
                ].map(({ icon: I, k, t, d }, i) => (
                  <li key={k} className="relative flex items-start gap-3 bg-surface px-5 py-4">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${i === 3 ? 'bg-accent text-accent-ink' : 'bg-surface2 text-ink2'}`}>
                      <I className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="mono-label block">
                        {String(i + 1).padStart(2, '0')} · {k}
                      </span>
                      <span className="block text-sm font-semibold text-ink">{t}</span>
                      <span className="block truncate font-mono text-[10.5px] text-muted">{d}</span>
                    </span>
                    {i < 3 && <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rounded-full bg-bg text-accent lg:block" />}
                  </li>
                ))}
              </ol>
              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                <BlockGridCard panchayat={activePanchayat} field={blockField} onShowOnMap={showGridOnMap} />
                <div id="explain" className="min-w-0 scroll-mt-24">
                  <ExplainPanel panchayat={activePanchayat} coarse={coarse} detail={detail} coarseElevationM={coarseElev} isLive={liveOk} />
                </div>
              </div>
            </div>
          </section>

          </>)}
          {tab === 'ask' && (<>
          <section className="mx-auto max-w-[1320px] px-5 py-6 sm:px-8 lg:py-8">
            <Reveal>
              <SectionHead
                index="04"
                kicker="Ask & reach every farmer"
                title={
                  <>
                    Ask it like you&rsquo;d <em className="text-accent">ask a neighbour.</em>
                  </>
                }
                meta="Type or speak in English, हिन्दी or தமிழ். Answers come from this village's forecast and are computed on the device."
              />
            </Reveal>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <AskAeroAgro ctx={assistantCtx} lang={lang} onLangChange={setLang} onAction={onAssistantAction} />
              </div>
              <div className="flex flex-col gap-4 lg:col-span-5">
                {[
                  { k: 'Print', t: 'Agromet bulletin', d: 'Five-day GKMS-format advisory with SMS text and QR, ready for the panchayat notice board.', icon: FileText, act: () => setShowBulletin(true) },
                  { k: 'Phone', t: 'Farmer app view', d: 'The same advice on a simple phone screen, with voice in three languages.', icon: Smartphone, act: () => setActiveView('mobile') },
                  { k: 'Wall', t: 'Village kiosk', d: 'A large-type wallboard with a WhatsApp QR code for the panchayat office.', icon: Tv, act: () => setActiveView('kiosk') },
                ].map(({ k, t, d, icon: I, act }) => (
                  <button key={t} onClick={act} className="card group flex flex-1 items-start gap-5 p-6 text-left transition-transform hover:-translate-y-0.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-btn text-btn-ink">
                      <I className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{k}</span>
                      <span className="mt-1 block font-display text-3xl leading-none text-ink">{t}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-ink2">{d}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <WhatsAppDrawer messageText={advisoryText} lang={lang} onLangChange={setLang} placeName={activePanchayat.name} />
            </div>
          </section>

          </>)}
          {tab === 'tools' && (<>
          <section id="tools" className="night scroll-mt-16" aria-labelledby="tools-title">
            <div className="mx-auto max-w-[1320px] px-5 py-6 sm:px-8 lg:py-8">
              <Reveal>
                <SectionHead
                  index="05"
                  kicker="Field tools"
                  id="tools-title"
                  title={
                    <>
                      Verify, <em className="text-accent">then act.</em>
                    </>
                  }
                  meta="Hour-by-hour spray safety, crop-insurance evidence, live satellite, the Himalaya-to-delta transect and a tin-roof rain gauge."
                />
              </Reveal>
              <div className="card overflow-hidden">
                <div className="border-b border-line/[0.07] px-5 pt-5 sm:px-6">
                  <p className="text-sm text-muted">
                    {STUDIO_TABS.find((t) => t.id === activeStudioTab)!.blurb} for {activePanchayat.name}
                  </p>
                  <div role="tablist" className="-mb-px mt-3 flex gap-1 overflow-x-auto scrollbar-none">
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
              </div>
            </div>
          </section>

          </>)}
          
        </main>
      )}

      {showBulletin && (
        <AgrometBulletin
          panchayat={activePanchayat}
          crop={selectedCrop}
          week={week}
          now={now}
          isLive={liveOk}
          coarseElevationM={coarseElev}
          onClose={() => setShowBulletin(false)}
        />
      )}

      <footer className="night overflow-hidden border-t border-line/[0.1]">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 pt-20 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-10 w-10" />
            <p className="mt-6 font-display text-4xl leading-[1.05] text-ink">
              Weather for your village, <em className="text-accent">not your district.</em>
            </p>
            <p className="mt-5 max-w-md text-xs leading-relaxed text-muted">
              Data: Open-Meteo NWP · Copernicus GLO-90 DEM · IMD INSAT-3DR · ICAR agromet guidance. Downscaled values are decision-support estimates, not an official IMD
              forecast.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:col-span-6 lg:col-start-7" aria-label="Footer">
            {[
              ['Product', [['Your village', '#village'], ['All India', '#map'], ['Engine', '#engine'], ['Ask AeroAgro', '#ask'], ['Field tools', '#tools']]],
              [
                'Build',
                [
                  ['Source code', 'https://github.com/barath178/panchayat-weather-downscaling'],
                  ['Figma plugin', 'https://github.com/barath178/panchayat-weather-downscaling/tree/main/design/figma-plugin'],
                ],
              ],
              ['Data', [['Open-Meteo', 'https://open-meteo.com'], ['Copernicus DEM', 'https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model'], ['IMD satellite', 'https://mausam.imd.gov.in']]],
            ].map(([h, links]) => (
              <div key={h as string}>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{h as string}</div>
                <ul className="mt-4 space-y-2.5">
                  {(links as string[][]).map(([l, href]) => (
                    <li key={l}>
                      <a
                        href={href}
                        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-ink2 transition-colors hover:text-accent"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                  {h === 'Build' && (
                    <li>
                      <button onClick={() => setShowAbout(true)} className="text-ink2 transition-colors hover:text-accent">
                        About the project
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mx-auto mt-16 max-w-[1320px] px-5 sm:px-8">
          <div className="select-none whitespace-nowrap font-display text-[21vw] leading-[0.78] tracking-[-0.045em] text-ink lg:text-[270px]" aria-hidden>
            AeroAgro<em className="text-accent">.</em>
          </div>
        </div>
      </footer>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}