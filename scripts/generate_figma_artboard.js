const fs = require('fs');
const path = require('path');

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="3400" height="2000" viewBox="0 0 3400 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgGlowEmerald" cx="20%" cy="10%" r="40%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#080C16" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bgGlowCyan" cx="80%" cy="80%" r="50%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#080C16" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bgGlowAmber" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#080C16" stop-opacity="0"/>
    </radialGradient>

    <!-- Glass Fill -->
    <linearGradient id="glassFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0E1626" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0A101C" stop-opacity="0.95"/>
    </linearGradient>

    <!-- Linear Gradients for UI Elements -->
    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>

    <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>

    <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>

    <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>

    <linearGradient id="cardBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.04"/>
    </linearGradient>

    <linearGradient id="mapHeatmapGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8"/>
      <stop offset="35%" stop-color="#10B981" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#F59E0B" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.9"/>
    </linearGradient>

    <filter id="shadowHeavy" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
    </filter>

    <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <style>
      .txt-display { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; font-weight: 800; }
      .txt-title   { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; font-weight: 700; }
      .txt-body    { font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif; font-weight: 500; }
      .txt-mono    { font-family: 'JetBrains Mono', 'SF Mono', monospace; font-weight: 600; }
      .txt-bold    { font-weight: 700; }
    </style>
  </defs>

  <!-- Figma Canvas Workspace Background -->
  <rect width="3400" height="2000" fill="#060911"/>

  <!-- ========================================================================= -->
  <!-- FRAME 1: 🖥️ DESKTOP MASTER FRAME (1920 x 1080) -->
  <!-- ========================================================================= -->
  <g id="Frame_Desktop_Master" transform="translate(60, 60)">
    
    <!-- Frame Canvas Header Label -->
    <text x="0" y="-20" fill="#94A3B8" font-size="14" class="txt-mono"># Desktop Master — AeroAgro India Agromet Downscaling (1920 × 1080)</text>

    <!-- Frame Background & Atmospheric Glows -->
    <rect width="1920" height="1080" rx="32" fill="#080C16" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" filter="url(#shadowHeavy)"/>
    <rect width="1920" height="1080" rx="32" fill="url(#bgGlowEmerald)"/>
    <rect width="1920" height="1080" rx="32" fill="url(#bgGlowCyan)"/>
    <rect width="1920" height="1080" rx="32" fill="url(#bgGlowAmber)"/>

    <!-- 1. Apple-Inspired Floating Header Navigation Bar -->
    <g id="Component_CommandBar" transform="translate(40, 24)">
      <rect width="1840" height="68" rx="20" fill="#0E1626" fill-opacity="0.85" stroke="url(#cardBorder)" stroke-width="1.2" filter="url(#shadowHeavy)"/>

      <!-- Brand Logo -->
      <g transform="translate(20, 14)">
        <rect width="40" height="40" rx="12" fill="url(#emeraldGrad)"/>
        <!-- Leaf / Sprout Icon -->
        <path d="M20 10C20 10 27 12 28 20C28.8 26.4 23 30 20 30C17 30 11.2 26.4 12 20C13 12 20 10 20 10Z" fill="#080C16"/>
        <path d="M20 14V26" stroke="#080C16" stroke-width="2" stroke-linecap="round"/>
        <text x="52" y="26" fill="#FFFFFF" font-size="20" class="txt-display">AeroAgro <tspan fill="#10B981">AI</tspan></text>
      </g>

      <!-- All-India Pilot Badge -->
      <g transform="translate(240, 19)">
        <rect width="320" height="30" rx="15" fill="#10B981" fill-opacity="0.12" stroke="#10B981" stroke-opacity="0.3" stroke-width="1"/>
        <circle cx="16" cy="15" r="4" fill="#10B981"/>
        <circle cx="16" cy="15" r="7" stroke="#10B981" stroke-width="1.5" stroke-dasharray="2 2"/>
        <text x="30" y="19" fill="#10B981" font-size="11" class="txt-mono">🇮🇳 All-India Agromet Downscaling (1.2 km²)</text>
      </g>

      <!-- View Switcher Segmented Control -->
      <g transform="translate(620, 14)">
        <rect width="420" height="40" rx="12" fill="#060911" fill-opacity="0.7" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <!-- Active Tab: GIS Dashboard -->
        <rect x="4" y="4" width="134" height="32" rx="9" fill="url(#emeraldGrad)"/>
        <text x="71" y="24" fill="#080C16" font-size="12" class="txt-bold" text-anchor="middle">🗺️ GIS Studio</text>

        <!-- Tab 2: Kisan Mobile -->
        <text x="210" y="24" fill="#94A3B8" font-size="12" class="txt-body" text-anchor="middle">📱 Kisan Mobile</text>

        <!-- Tab 3: Panchayat Kiosk -->
        <text x="345" y="24" fill="#94A3B8" font-size="12" class="txt-body" text-anchor="middle">📺 Panchayat Kiosk</text>
      </g>

      <!-- Scenario Selector Tabs -->
      <g transform="translate(1100, 14)">
        <rect width="360" height="40" rx="12" fill="#060911" fill-opacity="0.7" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <!-- Active Scenario: Monsoon Lift -->
        <rect x="4" y="4" width="116" height="32" rx="9" fill="#06B6D4" fill-opacity="0.2" stroke="#06B6D4" stroke-opacity="0.4" stroke-width="1"/>
        <text x="62" y="24" fill="#06B6D4" font-size="11" class="txt-mono" text-anchor="middle">🌧️ Monsoon</text>

        <!-- Scenario 2: Winter Frost -->
        <text x="180" y="24" fill="#94A3B8" font-size="11" class="txt-mono" text-anchor="middle">❄️ Winter Frost</text>

        <!-- Scenario 3: Pre-Monsoon -->
        <text x="298" y="24" fill="#94A3B8" font-size="11" class="txt-mono" text-anchor="middle">⚡ Pre-Monsoon</text>
      </g>

      <!-- User Location Pill & Status -->
      <g transform="translate(1500, 14)">
        <rect width="180" height="40" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-opacity="0.3" stroke-width="1"/>
        <circle cx="20" cy="20" r="4" fill="#10B981"/>
        <text x="34" y="24" fill="#10B981" font-size="12" class="txt-bold">📍 Detect My GPS</text>
      </g>

      <!-- Profile Avatar -->
      <circle cx="1780" cy="34" r="18" fill="#1E293B" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <text x="1780" y="39" fill="#E2E8F0" font-size="12" class="txt-bold" text-anchor="middle">BK</text>
    </g>

    <!-- 2. MAIN WORKSPACE BENTO GRID -->
    <!-- LEFT 8 COLUMNS: HERO MAP + ANALYTICS STUDIO DOCK -->
    <g id="Group_Main_Stage" transform="translate(40, 110)">
      
      <!-- HERO GOOGLE MAP CARD -->
      <g id="Card_Hero_Map">
        <rect width="1220" height="580" rx="24" fill="#0A0E1A" stroke="url(#cardBorder)" stroke-width="1.2" filter="url(#shadowHeavy)"/>

        <!-- Simulated Map Grid & Topographic Contour Lines -->
        <g opacity="0.25">
          <!-- Grid Lines -->
          <line x1="0" y1="100" x2="1220" y2="100" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="0" y1="200" x2="1220" y2="200" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="0" y1="300" x2="1220" y2="300" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="0" y1="400" x2="1220" y2="400" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="0" y1="500" x2="1220" y2="500" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="300" y1="0" x2="300" y2="580" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="600" y1="0" x2="600" y2="580" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="900" y1="0" x2="900" y2="580" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
        </g>

        <!-- Topographic India Map Silhouette & Relief Mesh -->
        <g id="India_Topographic_Relief" transform="translate(180, 40) scale(1.1)">
          <!-- Abstract India Map Coastline Shape -->
          <path d="M 280 40 
                   Q 330 30 380 70 
                   Q 430 110 470 140 
                   Q 510 180 500 230 
                   Q 460 260 480 300 
                   Q 510 340 560 350 
                   Q 540 390 480 380 
                   Q 430 390 390 420 
                   Q 360 480 320 520 
                   Q 280 470 240 430 
                   Q 210 380 180 340 
                   Q 150 300 130 260 
                   Q 120 220 160 180 
                   Q 200 140 240 90 Z" 
                fill="#0F172A" stroke="#38BDF8" stroke-width="1.8" stroke-opacity="0.4"/>

          <!-- Microclimate Heatmap Isolines (1.2km Downscaled Resolution) -->
          <ellipse cx="320" cy="300" rx="140" ry="110" fill="url(#mapHeatmapGrad)" opacity="0.35" filter="url(#glowEmerald)"/>
          <ellipse cx="320" cy="300" rx="90" ry="70" fill="url(#emeraldGrad)" opacity="0.45"/>
          <circle cx="330" cy="310" r="45" fill="#F59E0B" opacity="0.5"/>
          <circle cx="340" cy="315" r="20" fill="#F43F5E" opacity="0.65"/>

          <!-- High-Res Mesh Grid Dots (1.2 km² Downscaling Points) -->
          <g fill="#10B981" opacity="0.7">
            <circle cx="280" cy="260" r="3"/>
            <circle cx="300" cy="260" r="3"/>
            <circle cx="320" cy="260" r="3.5"/>
            <circle cx="340" cy="260" r="3"/>
            <circle cx="280" cy="280" r="3"/>
            <circle cx="300" cy="280" r="4" fill="#06B6D4"/>
            <circle cx="320" cy="280" r="4.5" fill="#F59E0B"/>
            <circle cx="340" cy="280" r="3"/>
            <circle cx="280" cy="300" r="3"/>
            <circle cx="300" cy="300" r="4" fill="#10B981"/>
            <circle cx="320" cy="300" r="5" fill="#F43F5E"/>
            <circle cx="340" cy="300" r="4" fill="#F59E0B"/>
          </g>

          <!-- Selected Panchayat Target: Thiruvaiyaru Pin -->
          <g transform="translate(320, 310)">
            <circle cx="0" cy="0" r="16" fill="#10B981" fill-opacity="0.25"/>
            <circle cx="0" cy="0" r="8" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="0" cy="0" r="24" stroke="#10B981" stroke-width="1.5" stroke-dasharray="3 3"/>
            
            <!-- Tooltip Label Card -->
            <g transform="translate(24, -30)">
              <rect width="190" height="52" rx="10" fill="#060911" fill-opacity="0.9" stroke="#10B981" stroke-width="1.2" filter="url(#shadowHeavy)"/>
              <text x="12" y="20" fill="#FFFFFF" font-size="12" class="txt-bold">Thiruvaiyaru (TN)</text>
              <text x="12" y="38" fill="#10B981" font-size="10" class="txt-mono">48.0mm Rain | 31.8°C (1.2km)</text>
            </g>
          </g>
        </g>

        <!-- Floating Apple Dynamic Island Map Controller (Top Left) -->
        <g transform="translate(24, 24)">
          <rect width="380" height="48" rx="16" fill="#060911" fill-opacity="0.85" stroke="url(#cardBorder)" stroke-width="1" filter="url(#shadowHeavy)"/>
          <text x="16" y="29" fill="#94A3B8" font-size="11" class="txt-mono">VIEWING:</text>
          <text x="75" y="29" fill="#FFFFFF" font-size="12" class="txt-bold">Cauvery Delta • 42m MSL</text>
          <rect x="260" y="8" width="105" height="32" rx="10" fill="#10B981" fill-opacity="0.2" stroke="#10B981" stroke-width="1"/>
          <text x="312" y="28" fill="#10B981" font-size="11" class="txt-mono" text-anchor="middle">1.2km Active</text>
        </g>

        <!-- Floating Resolution Pill (Top Right) -->
        <g transform="translate(980, 24)">
          <rect width="215" height="48" rx="16" fill="#060911" fill-opacity="0.85" stroke="url(#cardBorder)" stroke-width="1" filter="url(#shadowHeavy)"/>
          <!-- Active 1.2km Fine -->
          <rect x="6" y="6" width="98" height="36" rx="12" fill="url(#emeraldGrad)"/>
          <text x="55" y="28" fill="#080C16" font-size="11" class="txt-bold" text-anchor="middle">🔬 1.2km Fine</text>
          <!-- 18km Coarse -->
          <text x="158" y="28" fill="#94A3B8" font-size="11" class="txt-mono" text-anchor="middle">📦 18km NWP</text>
        </g>

        <!-- Map Layer Legend (Bottom Left) -->
        <g transform="translate(24, 510)">
          <rect width="440" height="46" rx="14" fill="#060911" fill-opacity="0.85" stroke="url(#cardBorder)" stroke-width="1"/>
          <text x="16" y="28" fill="#94A3B8" font-size="11" class="txt-mono">PRECIP (mm):</text>
          <rect x="110" y="16" width="180" height="12" rx="6" fill="url(#mapHeatmapGrad)"/>
          <text x="110" y="40" fill="#94A3B8" font-size="9" class="txt-mono">0 mm</text>
          <text x="190" y="40" fill="#94A3B8" font-size="9" class="txt-mono">25 mm</text>
          <text x="270" y="40" fill="#94A3B8" font-size="9" class="txt-mono">100+ mm</text>
          <circle cx="320" cy="22" r="5" fill="#10B981"/>
          <text x="332" y="26" fill="#FFFFFF" font-size="11" class="txt-body">Ground Stations</text>
        </g>
      </g>

      <!-- BOTTOM ANALYTICS STUDIO DOCK -->
      <g id="Component_Studio_Dock" transform="translate(0, 604)">
        <rect width="1220" height="340" rx="24" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.2" filter="url(#shadowHeavy)"/>

        <!-- Studio Dock Header & Tabs -->
        <g transform="translate(24, 20)">
          <rect width="36" height="36" rx="10" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-opacity="0.3" stroke-width="1"/>
          <text x="18" y="23" fill="#10B981" font-size="16" text-anchor="middle">⚙️</text>
          <text x="48" y="18" fill="#FFFFFF" font-size="14" class="txt-bold">Microclimate Analytics Studio</text>
          <text x="48" y="32" fill="#94A3B8" font-size="11" class="txt-body">Physics-informed agro-meteorology and crop protection engines</text>

          <!-- Studio Tab Switchers -->
          <g transform="translate(560, 0)">
            <rect width="590" height="40" rx="12" fill="#060911" fill-opacity="0.7" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            
            <!-- Active Tab: Spray Window -->
            <rect x="4" y="4" width="120" height="32" rx="9" fill="url(#emeraldGrad)"/>
            <text x="64" y="24" fill="#080C16" font-size="11" class="txt-bold" text-anchor="middle">⏱️ Spray Window</text>

            <text x="195" y="24" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">🛡️ PMFBY Verifier</text>
            <text x="330" y="24" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">📡 IMD Satellite (18km)</text>
            <text x="455" y="24" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">⛰️ Elevation Profile</text>
            <text x="548" y="24" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">🎙️ Bio-AI</text>
          </g>
        </g>

        <!-- Spray Timeline Chart Content Area -->
        <g id="Spray_Timeline_Chart" transform="translate(24, 76)">
          <rect width="1172" height="236" rx="16" fill="#060911" fill-opacity="0.6" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

          <!-- 24-Hour Diurnal Spray Curve Area -->
          <path d="M 60 180 
                   C 160 170, 240 140, 340 110 
                   C 440 80, 540 60, 640 50 
                   C 740 40, 840 70, 940 120 
                   C 1020 150, 1080 170, 1120 180 
                   L 1120 200 L 60 200 Z" 
                fill="url(#emeraldGrad)" fill-opacity="0.15"/>

          <path d="M 60 180 
                   C 160 170, 240 140, 340 110 
                   C 440 80, 540 60, 640 50 
                   C 740 40, 840 70, 940 120 
                   C 1020 150, 1080 170, 1120 180" 
                fill="none" stroke="#10B981" stroke-width="3"/>

          <!-- Time Markers & Spray Window Status Pills -->
          <!-- 06:00 Safe -->
          <g transform="translate(80, 30)">
            <rect width="110" height="40" rx="10" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1"/>
            <text x="55" y="18" fill="#10B981" font-size="11" class="txt-bold" text-anchor="middle">06:00 AM</text>
            <text x="55" y="32" fill="#34D399" font-size="9" class="txt-mono" text-anchor="middle">✓ SAFE (Low Drift)</text>
          </g>

          <!-- 08:00 Optimal -->
          <g transform="translate(240, 30)">
            <rect width="110" height="40" rx="10" fill="#10B981" fill-opacity="0.25" stroke="#10B981" stroke-width="1.5"/>
            <text x="55" y="18" fill="#10B981" font-size="11" class="txt-bold" text-anchor="middle">08:00 AM</text>
            <text x="55" y="32" fill="#FFFFFF" font-size="9" class="txt-mono" text-anchor="middle">★ PRIME WINDOW</text>
          </g>

          <!-- 12:00 Caution -->
          <g transform="translate(560, 30)">
            <rect width="110" height="40" rx="10" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="1"/>
            <text x="55" y="18" fill="#F59E0B" font-size="11" class="txt-bold" text-anchor="middle">12:00 PM</text>
            <text x="55" y="32" fill="#FBBF24" font-size="9" class="txt-mono" text-anchor="middle">⚠ VPD Rising</text>
          </g>

          <!-- 14:00 Danger -->
          <g transform="translate(740, 30)">
            <rect width="110" height="40" rx="10" fill="#F43F5E" fill-opacity="0.15" stroke="#F43F5E" stroke-width="1"/>
            <text x="55" y="18" fill="#F43F5E" font-size="11" class="txt-bold" text-anchor="middle">02:00 PM</text>
            <text x="55" y="32" fill="#FB7185" font-size="9" class="txt-mono" text-anchor="middle">✕ HIGH EVAPORATION</text>
          </g>

          <!-- 18:00 Safe -->
          <g transform="translate(980, 30)">
            <rect width="110" height="40" rx="10" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1"/>
            <text x="55" y="18" fill="#10B981" font-size="11" class="txt-bold" text-anchor="middle">06:00 PM</text>
            <text x="55" y="32" fill="#34D399" font-size="9" class="txt-mono" text-anchor="middle">✓ SAFE (Calm Air)</text>
          </g>
        </g>
      </g>
    </g>

    <!-- RIGHT 4 COLUMNS: INSPECTOR & CROP TELEMETRY BENTO STACK -->
    <g id="Group_Inspector_Stage" transform="translate(1290, 110)">
      
      <!-- CARD 1: DOWNSCALED METRICS CARD (BEFORE VS AFTER) -->
      <g id="Card_Downscaling_Metrics">
        <rect width="590" height="380" rx="24" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.2" filter="url(#shadowHeavy)"/>

        <!-- Header -->
        <g transform="translate(24, 20)">
          <text x="0" y="14" fill="#10B981" font-size="10" class="txt-mono" letter-spacing="1.5">DOWNSCALED GROUND-TRUTH FOCUS</text>
          <text x="0" y="38" fill="#FFFFFF" font-size="18" class="txt-display">Thiruvaiyaru (Tamil Nadu)</text>
          <text x="0" y="56" fill="#94A3B8" font-size="11" class="txt-body">42m MSL • Cauvery Delta Alluvial Plain</text>
          
          <rect x="420" y="8" width="115" height="28" rx="8" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1"/>
          <text x="477" y="26" fill="#10B981" font-size="10" class="txt-mono" text-anchor="middle">1.2 km² Physics</text>
        </g>

        <!-- Metric Row 1: Precipitation -->
        <g transform="translate(24, 94)">
          <rect width="542" height="78" rx="16" fill="#060911" fill-opacity="0.6" stroke="rgba(6,182,212,0.25)" stroke-width="1"/>
          <circle cx="24" cy="24" r="10" fill="#06B6D4" fill-opacity="0.2"/>
          <text x="24" y="28" fill="#06B6D4" font-size="12" text-anchor="middle">🌧️</text>
          <text x="44" y="28" fill="#FFFFFF" font-size="13" class="txt-bold">24h Precipitation</text>
          
          <rect x="380" y="14" width="145" height="24" rx="8" fill="#06B6D4" fill-opacity="0.15" stroke="#06B6D4" stroke-width="1"/>
          <text x="452" y="30" fill="#06B6D4" font-size="10" class="txt-mono" text-anchor="middle">+18.0 mm (+1.6x)</text>

          <line x1="16" y1="46" x2="526" y2="46" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <text x="16" y="66" fill="#64748B" font-size="10" class="txt-mono">18km NWP BASELINE: <tspan fill="#CBD5E1">30.0 mm</tspan></text>
          <text x="350" y="66" fill="#06B6D4" font-size="12" class="txt-bold">1.2km FINE: 48.0 mm</text>
        </g>

        <!-- Metric Row 2: Diurnal Temperature -->
        <g transform="translate(24, 184)">
          <rect width="542" height="78" rx="16" fill="#060911" fill-opacity="0.6" stroke="rgba(245,158,11,0.25)" stroke-width="1"/>
          <circle cx="24" cy="24" r="10" fill="#F59E0B" fill-opacity="0.2"/>
          <text x="24" y="28" fill="#F59E0B" font-size="12" text-anchor="middle">🌡️</text>
          <text x="44" y="28" fill="#FFFFFF" font-size="13" class="txt-bold">Diurnal Temperature</text>
          
          <rect x="380" y="14" width="145" height="24" rx="8" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="1"/>
          <text x="452" y="30" fill="#F59E0B" font-size="10" class="txt-mono" text-anchor="middle">Lapse: -6.5°C/km</text>

          <line x1="16" y1="46" x2="526" y2="46" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <text x="16" y="66" fill="#64748B" font-size="10" class="txt-mono">18km NWP BASELINE: <tspan fill="#CBD5E1">23.5° - 31.5°C</tspan></text>
          <text x="350" y="66" fill="#F59E0B" font-size="12" class="txt-bold">1.2km FINE: 23.9° - 31.8°C</text>
        </g>

        <!-- Metric Row 3: Canopy Wind & Drift -->
        <g transform="translate(24, 274)">
          <rect width="542" height="78" rx="16" fill="#060911" fill-opacity="0.6" stroke="rgba(16,185,129,0.25)" stroke-width="1"/>
          <circle cx="24" cy="24" r="10" fill="#10B981" fill-opacity="0.2"/>
          <text x="24" y="28" fill="#10B981" font-size="12" text-anchor="middle">💨</text>
          <text x="44" y="28" fill="#FFFFFF" font-size="13" class="txt-bold">Canopy Wind &amp; Drift</text>
          
          <rect x="380" y="14" width="145" height="24" rx="8" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1"/>
          <text x="452" y="30" fill="#10B981" font-size="10" class="txt-mono" text-anchor="middle">RH: 89% (Optimal)</text>

          <line x1="16" y1="46" x2="526" y2="46" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <text x="16" y="66" fill="#64748B" font-size="10" class="txt-mono">18km NWP BASELINE: <tspan fill="#CBD5E1">16.0 km/h</tspan></text>
          <text x="350" y="66" fill="#10B981" font-size="12" class="txt-bold">1.2km FINE: 16.0 km/h</text>
        </g>
      </g>

      <!-- CARD 2: CROP PHENOLOGY & ADVISORY -->
      <g id="Card_Crop_Advisory" transform="translate(0, 404)">
        <rect width="590" height="540" rx="24" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.2" filter="url(#shadowHeavy)"/>

        <!-- Header -->
        <g transform="translate(24, 20)">
          <text x="0" y="14" fill="#10B981" font-size="10" class="txt-mono" letter-spacing="1.5">TARGET CROP &amp; ADVISORY</text>
          <text x="0" y="38" fill="#FFFFFF" font-size="16" class="txt-display">Local Agricultural Guidance</text>
          
          <rect x="420" y="8" width="115" height="28" rx="8" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1"/>
          <text x="477" y="26" fill="#10B981" font-size="10" class="txt-mono" text-anchor="middle">ICAR Certified</text>
        </g>

        <!-- Crop Selector Chips -->
        <g transform="translate(24, 76)">
          <rect width="110" height="32" rx="10" fill="url(#emeraldGrad)"/>
          <text x="55" y="21" fill="#080C16" font-size="11" class="txt-bold" text-anchor="middle">Samba Paddy</text>

          <rect x="120" y="0" width="110" height="32" rx="10" fill="#060911" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="175" y="21" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">Sharbati Wheat</text>

          <rect x="240" y="0" width="100" height="32" rx="10" fill="#060911" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="290" y="21" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">Royal Apple</text>

          <rect x="350" y="0" width="100" height="32" rx="10" fill="#060911" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="400" y="21" fill="#94A3B8" font-size="11" class="txt-body" text-anchor="middle">Darjeeling Tea</text>
        </g>

        <!-- Pathogen Alert Banner -->
        <g transform="translate(24, 126)">
          <rect width="542" height="90" rx="16" fill="#F43F5E" fill-opacity="0.10" stroke="#F43F5E" stroke-opacity="0.3" stroke-width="1"/>
          <circle cx="24" cy="24" r="10" fill="#F43F5E" fill-opacity="0.2"/>
          <text x="24" y="28" fill="#F43F5E" font-size="12" text-anchor="middle">🐛</text>
          <text x="44" y="26" fill="#F43F5E" font-size="12" class="txt-bold">Microclimate Pest Alert</text>
          <rect x="420" y="14" width="100" height="22" rx="6" fill="#F43F5E" fill-opacity="0.2"/>
          <text x="470" y="29" fill="#FB7185" font-size="9" class="txt-mono" text-anchor="middle">ACTIVE RISK</text>

          <text x="20" y="54" fill="#FFFFFF" font-size="12" class="txt-bold">Rice Blast / Sheath Rot (High RH)</text>
          <text x="20" y="74" fill="#94A3B8" font-size="11" class="txt-body">Relative humidity (89%) and nocturnal canopy temperatures trigger fungal sporulation.</text>
        </g>

        <!-- Irrigation Dynamic Window -->
        <g transform="translate(24, 230)">
          <rect width="542" height="80" rx="16" fill="#06B6D4" fill-opacity="0.10" stroke="#06B6D4" stroke-opacity="0.3" stroke-width="1"/>
          <circle cx="24" cy="24" r="10" fill="#06B6D4" fill-opacity="0.2"/>
          <text x="24" y="28" fill="#06B6D4" font-size="12" text-anchor="middle">💧</text>
          <text x="44" y="26" fill="#06B6D4" font-size="12" class="txt-bold">Evapotranspiration &amp; Irrigation</text>
          <text x="460" y="26" fill="#38BDF8" font-size="10" class="txt-mono">ET0: 4.8 mm</text>

          <text x="20" y="58" fill="#94A3B8" font-size="11" class="txt-body">Precipitation (48.0 mm) satisfies water requirements. Suspend canal/borewell pumps.</text>
        </g>

        <!-- Vernacular Voice Reader Audio Waveform -->
        <g transform="translate(24, 326)">
          <rect width="542" height="60" rx="16" fill="#10B981" fill-opacity="0.10" stroke="#10B981" stroke-opacity="0.3" stroke-width="1"/>
          <circle cx="28" cy="30" r="16" fill="url(#emeraldGrad)"/>
          <text x="28" y="35" fill="#080C16" font-size="12" text-anchor="middle">▶</text>
          <text x="56" y="26" fill="#FFFFFF" font-size="12" class="txt-bold">Listen in Tamil (தமிழ்) / English Voice</text>
          <text x="56" y="44" fill="#10B981" font-size="10" class="txt-mono">Synthetic AI Voice Advisory • 24s</text>

          <!-- Audio Waveform Bars -->
          <g transform="translate(340, 20)" fill="#10B981">
            <rect x="0" y="8" width="3" height="12" rx="1.5"/>
            <rect x="8" y="2" width="3" height="24" rx="1.5"/>
            <rect x="16" y="10" width="3" height="10" rx="1.5"/>
            <rect x="24" y="0" width="3" height="28" rx="1.5"/>
            <rect x="32" y="6" width="3" height="16" rx="1.5"/>
            <rect x="40" y="12" width="3" height="8" rx="1.5"/>
            <rect x="48" y="4" width="3" height="20" rx="1.5"/>
            <rect x="56" y="9" width="3" height="11" rx="1.5"/>
            <rect x="64" y="1" width="3" height="26" rx="1.5"/>
            <rect x="72" y="7" width="3" height="14" rx="1.5"/>
            <rect x="80" y="11" width="3" height="9" rx="1.5"/>
            <rect x="88" y="3" width="3" height="22" rx="1.5"/>
            <rect x="96" y="8" width="3" height="12" rx="1.5"/>
          </g>
        </g>

        <!-- WhatsApp Broadcast Button -->
        <g transform="translate(24, 404)">
          <rect width="542" height="48" rx="14" fill="#25D366" fill-opacity="0.18" stroke="#25D366" stroke-opacity="0.4" stroke-width="1.2"/>
          <text x="240" y="30" fill="#25D366" font-size="12" class="txt-bold" text-anchor="middle">💬 Broadcast Advisory to 1,240 Panchayat Farmers via WhatsApp</text>
        </g>

        <!-- Searchable 303 Districts Pill -->
        <g transform="translate(24, 470)">
          <rect width="542" height="46" rx="14" fill="#060911" fill-opacity="0.8" stroke="url(#cardBorder)" stroke-width="1"/>
          <text x="20" y="28" fill="#64748B" font-size="12" class="txt-body">🔍 Search any of 303 Districts &amp; Microclimates...</text>
          <rect x="420" y="10" width="105" height="26" rx="8" fill="#1E293B"/>
          <text x="472" y="27" fill="#CBD5E1" font-size="10" class="txt-mono" text-anchor="middle">Ctrl + K</text>
        </g>
      </g>
    </g>

  </g>

  <!-- ========================================================================= -->
  <!-- FRAME 2: 📱 KISAN MOBILE VIEW (390 x 844) iPhone 15 Pro -->
  <!-- ========================================================================= -->
  <g id="Frame_Kisan_Mobile" transform="translate(2040, 60)">
    <text x="0" y="-20" fill="#94A3B8" font-size="14" class="txt-mono"># Mobile View — Kisan PWA (390 × 844)</text>

    <!-- Phone Body -->
    <rect width="390" height="844" rx="44" fill="#080C16" stroke="rgba(255,255,255,0.2)" stroke-width="3" filter="url(#shadowHeavy)"/>
    <rect width="390" height="844" rx="44" fill="url(#bgGlowEmerald)"/>

    <!-- Dynamic Island -->
    <rect x="135" y="14" width="120" height="30" rx="15" fill="#000000"/>
    <circle cx="230" cy="29" r="5" fill="#10B981"/>

    <!-- Mobile Header -->
    <g transform="translate(20, 64)">
      <text x="0" y="16" fill="#10B981" font-size="11" class="txt-mono">📍 THIRUVAIYARU • TAMIL NADU</text>
      <text x="0" y="42" fill="#FFFFFF" font-size="22" class="txt-display">किसान मौसम सलाह</text>
      <text x="0" y="60" fill="#94A3B8" font-size="12" class="txt-body">Kisan Microclimate Advisory</text>
    </g>

    <!-- Spray Safe Hero Banner -->
    <g transform="translate(20, 140)">
      <rect width="350" height="150" rx="20" fill="url(#emeraldGrad)" filter="url(#shadowHeavy)"/>
      <circle cx="50" cy="50" r="26" fill="#080C16" fill-opacity="0.25"/>
      <text x="50" y="58" fill="#FFFFFF" font-size="24" text-anchor="middle">✓</text>

      <text x="90" y="42" fill="#080C16" font-size="13" class="txt-mono">SPRAY TIMING</text>
      <text x="90" y="68" fill="#080C16" font-size="22" class="txt-display">SURAKSHIT (SAFE)</text>
      <text x="90" y="90" fill="#080C16" font-size="12" class="txt-bold">06:00 AM — 10:30 AM (Low Drift)</text>

      <rect x="20" y="110" width="310" height="28" rx="8" fill="#080C16" fill-opacity="0.3"/>
      <text x="175" y="128" fill="#FFFFFF" font-size="10" class="txt-mono" text-anchor="middle">Lapse Rate: Normal • Wind: 16 km/h</text>
    </g>

    <!-- Downscaled Telemetry 2-Card Grid -->
    <g transform="translate(20, 310)">
      <!-- Temp Card -->
      <rect width="168" height="110" rx="18" fill="#0E1626" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="16" y="28" fill="#F59E0B" font-size="11" class="txt-mono">TEMPERATURE</text>
      <text x="16" y="64" fill="#FFFFFF" font-size="28" class="txt-display">31.8°C</text>
      <text x="16" y="88" fill="#94A3B8" font-size="11" class="txt-body">Min: 23.9°C (Cool)</text>

      <!-- Rain Card -->
      <rect x="182" y="0" width="168" height="110" rx="18" fill="#0E1626" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="198" y="28" fill="#06B6D4" font-size="11" class="txt-mono">RAINFALL (24H)</text>
      <text x="198" y="64" fill="#06B6D4" font-size="28" class="txt-display">48.0 mm</text>
      <text x="198" y="88" fill="#94A3B8" font-size="11" class="txt-body">+18mm Downscaled</text>
    </g>

    <!-- Mobile Crop Protection Guidance -->
    <g transform="translate(20, 440)">
      <rect width="350" height="160" rx="20" fill="#0E1626" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="20" y="28" fill="#10B981" font-size="11" class="txt-mono">🌾 SAMBA PADDY CARE</text>
      <text x="20" y="52" fill="#FFFFFF" font-size="14" class="txt-bold">Rice Blast Prevention Active</text>
      <text x="20" y="74" fill="#94A3B8" font-size="12" class="txt-body">High night moisture requires spraying copper fungicide before evening rain.</text>
      
      <!-- Audio Play Button -->
      <rect x="20" y="104" width="310" height="40" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1"/>
      <text x="175" y="128" fill="#10B981" font-size="11" class="txt-bold" text-anchor="middle">🔊 Audio suniye (Tamil / Hindi)</text>
    </g>

    <!-- Mobile WhatsApp Share CTA -->
    <g transform="translate(20, 620)">
      <rect width="350" height="52" rx="16" fill="#25D366" fill-opacity="0.9" filter="url(#shadowHeavy)"/>
      <text x="175" y="32" fill="#080C16" font-size="13" class="txt-bold" text-anchor="middle">💬 Share Report on WhatsApp</text>
    </g>

    <!-- Mobile PMFBY Certificate Button -->
    <g transform="translate(20, 686)">
      <rect width="350" height="52" rx="16" fill="#060911" stroke="#F59E0B" stroke-width="1.2"/>
      <text x="175" y="32" fill="#F59E0B" font-size="12" class="txt-bold" text-anchor="middle">📜 PMFBY Insurance Claim Pass</text>
    </g>

    <!-- Bottom Home Indicator -->
    <rect x="125" y="820" width="140" height="5" rx="2.5" fill="#FFFFFF" fill-opacity="0.4"/>
  </g>

  <!-- ========================================================================= -->
  <!-- FRAME 3: 🎨 DESIGN SYSTEM TOKENS & FIGMA SPEC (800 x 1080) -->
  <!-- ========================================================================= -->
  <g id="Frame_Design_Tokens" transform="translate(2500, 60)">
    <text x="0" y="-20" fill="#94A3B8" font-size="14" class="txt-mono"># Design System — HSL Color &amp; Typography Tokens (800 × 1080)</text>

    <rect width="840" height="1080" rx="32" fill="#080C16" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" filter="url(#shadowHeavy)"/>

    <g transform="translate(40, 36)">
      <text x="0" y="24" fill="#FFFFFF" font-size="24" class="txt-display">AeroAgro Design Tokens</text>
      <text x="0" y="46" fill="#94A3B8" font-size="12" class="txt-body">Atomic design specifications for hackathon &amp; enterprise production</text>

      <!-- COLOR TOKENS SWATCHES -->
      <g transform="translate(0, 70)">
        <text x="0" y="16" fill="#10B981" font-size="11" class="txt-mono" letter-spacing="1">01 / COLOR SYSTEM (HSL &amp; HEX)</text>

        <!-- Swatch 1: Canvas Midnight -->
        <g transform="translate(0, 30)">
          <rect width="44" height="44" rx="12" fill="#080C16" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
          <text x="56" y="20" fill="#FFFFFF" font-size="13" class="txt-bold">Canvas Midnight</text>
          <text x="56" y="38" fill="#94A3B8" font-size="11" class="txt-mono">#080C16 • hsl(223, 47%, 6%) — Viewport Ground</text>
        </g>

        <!-- Swatch 2: Neon Emerald -->
        <g transform="translate(0, 90)">
          <rect width="44" height="44" rx="12" fill="#10B981"/>
          <text x="56" y="20" fill="#10B981" font-size="13" class="txt-bold">Neon Emerald</text>
          <text x="56" y="38" fill="#94A3B8" font-size="11" class="txt-mono">#10B981 • hsl(160, 84%, 39%) — 1.2km Fine Model / Safe</text>
        </g>

        <!-- Swatch 3: Atmospheric Cyan -->
        <g transform="translate(0, 150)">
          <rect width="44" height="44" rx="12" fill="#06B6D4"/>
          <text x="56" y="20" fill="#06B6D4" font-size="13" class="txt-bold">Atmospheric Cyan</text>
          <text x="56" y="38" fill="#94A3B8" font-size="11" class="txt-mono">#06B6D4 • hsl(189, 94%, 43%) — Precipitation &amp; Moisture</text>
        </g>

        <!-- Swatch 4: Solar Amber -->
        <g transform="translate(0, 210)">
          <rect width="44" height="44" rx="12" fill="#F59E0B"/>
          <text x="56" y="20" fill="#F59E0B" font-size="13" class="txt-bold">Solar Amber</text>
          <text x="56" y="38" fill="#94A3B8" font-size="11" class="txt-mono">#F59E0B • hsl(38, 92%, 50%) — 18km Coarse NWP / VPD Caution</text>
        </g>

        <!-- Swatch 5: Katabatic Rose -->
        <g transform="translate(0, 270)">
          <rect width="44" height="44" rx="12" fill="#F43F5E"/>
          <text x="56" y="20" fill="#F43F5E" font-size="13" class="txt-bold">Katabatic Rose</text>
          <text x="56" y="38" fill="#94A3B8" font-size="11" class="txt-mono">#F43F5E • hsl(350, 89%, 60%) — Frost Inversion / Pathogen Risk</text>
        </g>
      </g>

      <!-- TYPOGRAPHY TOKENS SPEC -->
      <g transform="translate(0, 420)">
        <text x="0" y="16" fill="#06B6D4" font-size="11" class="txt-mono" letter-spacing="1">02 / TYPOGRAPHY HIERARCHY</text>

        <g transform="translate(0, 36)">
          <text x="0" y="20" fill="#94A3B8" font-size="10" class="txt-mono">HERO / DISPLAY</text>
          <text x="0" y="52" fill="#FFFFFF" font-size="28" class="txt-display">Outfit Extrabold (28/34px)</text>
        </g>

        <g transform="translate(0, 116)">
          <text x="0" y="20" fill="#94A3B8" font-size="10" class="txt-mono">SECTION TITLES</text>
          <text x="0" y="46" fill="#FFFFFF" font-size="18" class="txt-title">Outfit Bold (18/24px)</text>
        </g>

        <g transform="translate(0, 186)">
          <text x="0" y="20" fill="#94A3B8" font-size="10" class="txt-mono">BODY &amp; INTERACTION</text>
          <text x="0" y="44" fill="#CBD5E1" font-size="14" class="txt-body">Plus Jakarta Sans Medium (13/18px)</text>
        </g>

        <g transform="translate(0, 256)">
          <text x="0" y="20" fill="#94A3B8" font-size="10" class="txt-mono">ATMOSPHERIC DATA &amp; LAT/LON</text>
          <text x="0" y="44" fill="#10B981" font-size="12" class="txt-mono">JetBrains Mono SemiBold (11/16px) — 1.2km Physics</text>
        </g>
      </g>

      <!-- JUDGING RUBRIC & ADVANTAGE -->
      <g transform="translate(0, 760)">
        <rect width="760" height="190" rx="20" fill="url(#glassFill)" stroke="url(#emeraldGrad)" stroke-opacity="0.4" stroke-width="1.2"/>
        <text x="24" y="32" fill="#10B981" font-size="14" class="txt-bold">🏆 Competition Winning Architecture</text>
        <text x="24" y="58" fill="#CBD5E1" font-size="12" class="txt-body">1. Anti-AI Template Guarantee: Bespoke 8pt spatial grid, HSL deep dark tokens &amp; linear curves.</text>
        <text x="24" y="84" fill="#CBD5E1" font-size="12" class="txt-body">2. Multi-Persona Solution: Agronomist GIS Studio + Smallholder Kisan Mobile + Panchayat Kiosk.</text>
        <text x="24" y="110" fill="#CBD5E1" font-size="12" class="txt-body">3. Physics Ground-Truth: Microclimate lapse rate (-6.5°C/km), cold pool inversions, UHI thermal surges.</text>
        <text x="24" y="136" fill="#CBD5E1" font-size="12" class="txt-body">4. Direct Figma Import: Drag this file into Figma for 100% editable vector layers, frames &amp; styles.</text>
        <text x="24" y="165" fill="#38BDF8" font-size="11" class="txt-mono">Live Web Application: https://frontend-six-tan-94.vercel.app</text>
      </g>

    </g>
  </g>

</svg>`;

const outputPath = path.join(__dirname, '..', 'aeroagro_figma_artboard.svg');
fs.writeFileSync(outputPath, svgContent, 'utf8');
console.log('Successfully generated aeroagro_figma_artboard.svg at ' + outputPath);
