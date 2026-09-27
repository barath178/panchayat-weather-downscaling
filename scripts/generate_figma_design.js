// Generates a Figma-ready vector file for AeroAgro AI (frontend UI + backend architecture).
//
//   node scripts/generate_figma_design.js
//
// Output: design/aeroagro_figma_design.svg (also copied to frontend/public/aeroagro_figma_artboard.svg)
// Import: in Figma, File → Import (or drag the .svg onto the canvas). Every <g id="…"> becomes a
// named layer group and every <text> stays editable. Reference screenshots in design/screens/ are
// embedded in the last frame.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'design', 'aeroagro_figma_design.svg');
const PUBLIC_COPY = path.join(ROOT, 'frontend', 'public', 'aeroagro_figma_artboard.svg');

// ---------- design tokens (mirrors frontend/tailwind.config.js + globals.css) ----------
// "emerald" is the brand accent slot (new-leaf lime); cyan = water/sky; amber = heat/coarse grid.
const C = {
  canvas: '#060907',
  bg: '#0A0E0C',
  surface: '#111714',
  surface2: '#18201C',
  inset: '#0D1210',
  border: '#E2F0E714',
  borderStrong: '#E2F0E726',
  text: '#ECF2EE',
  text2: '#B8C4BD',
  muted: '#808E86',
  faint: '#5E6B64',
  emerald: '#C8F169',
  emeraldSoft: '#C8F16926',
  cyan: '#7DC4FF',
  amber: '#F6B94C',
  rose: '#FF7A66',
  violet: '#A99BFF',
  blue: '#7DC4FF',
  good: '#2FB344',
  warning: '#F2B01E',
  critical: '#E5484D',
  whatsapp: '#25D366',
};
const BLUE_RAMP = ['#CDE2FB', '#9EC5F4', '#6DA7EC', '#3987E5', '#256ABF', '#184F95', '#0D366B'];
const DIVERGING = ['#104281', '#2A78D6', '#86B6EF', '#9A9993', '#F0A3A3', '#E34948', '#A52626'];

const FONT = "'Plus Jakarta Sans', Inter, sans-serif";
const DISPLAY = "Fraunces, Georgia, serif";
const MONO = "'JetBrains Mono', 'SF Mono', monospace";

// ---------- primitives ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const id = (s) => s.replace(/[^A-Za-z0-9_-]+/g, '_');

const rect = (x, y, w, h, { r = 0, fill = 'none', stroke, sw = 1, opacity } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${opacity != null ? ` opacity="${opacity}"` : ''}/>`;

const text = (x, y, s, { size = 14, fill = C.text, weight = 500, font = FONT, anchor = 'start', ls } = {}) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="${font}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ''}>${esc(s)}</text>`;

const group = (name, x, y, children) => `<g id="${id(name)}" transform="translate(${x} ${y})">${children.join('')}</g>`;

const circle = (cx, cy, r, fill, stroke, sw = 1) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}/>`;

const line = (x1, y1, x2, y2, stroke, sw = 1, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

const card = (name, x, y, w, h, children, { fill = C.surface, r = 24 } = {}) =>
  group(name, x, y, [rect(0, 0, w, h, { r, fill, stroke: C.border }), ...children]);

// A pill / chip / segmented button
const pill = (name, x, y, label, { w, h = 32, fill = C.surface2, color = C.text2, stroke, size = 13, weight = 600, r = 10 } = {}) => {
  const width = w || Math.round(label.length * size * 0.58 + 28);
  return group(name, x, y, [rect(0, 0, width, h, { r, fill, stroke }), text(width / 2, h / 2 + size * 0.36, label, { size, fill: color, weight, anchor: 'middle' })]);
};

// Segmented control; returns [svg, width]
const segmented = (name, x, y, items, activeIdx, activeFill = C.emerald, activeText = C.bg) => {
  let cx = 4;
  const kids = [];
  items.forEach((label, i) => {
    const w = Math.round(label.length * 7.4 + 24);
    const on = i === activeIdx;
    kids.push(pill(`${name}/${label}`, cx, 4, label, { w, h: 28, fill: on ? activeFill : 'none', color: on ? activeText : C.muted, size: 12, weight: on ? 700 : 600, r: 8 }));
    cx += w + 2;
  });
  const total = cx + 2;
  return group(name, x, y, [rect(0, 0, total, 36, { r: 12, fill: '#00000066', stroke: C.border }), ...kids]);
};

const frameLabel = (s) => text(0, -18, s, { size: 16, fill: C.muted, font: MONO, weight: 600 });

const frame = (name, x, y, w, h, children, { fill = C.bg, label } = {}) =>
  group(name, x, y, [frameLabel(label || name), rect(0, 0, w, h, { r: 28, fill, stroke: C.borderStrong, sw: 1.5 }), ...children]);

// ---------- 01 · design system ----------
function designSystem() {
  const swatches = [
    ['Background', C.bg], ['Surface', C.surface], ['Surface 2', C.surface2], ['Text', C.text], ['Muted', C.muted],
    ['Emerald / primary', C.emerald], ['Cyan / water', C.cyan], ['Amber / coarse 18 km', C.amber], ['Rose / alert', C.rose], ['Violet / kiosk', C.violet],
  ];
  const status = [['Safe', C.good], ['Caution', C.warning], ['Do not spray', C.critical]];

  const kids = [
    text(48, 72, 'AeroAgro AI · Design system', { size: 34, weight: 800, font: DISPLAY }),
    text(48, 104, 'Field-at-night greens, one new-leaf lime accent, topographic contours. Tokens mirror tailwind.config.js.', { size: 15, fill: C.muted }),

    text(48, 160, 'COLOUR TOKENS', { size: 12, fill: C.emerald, weight: 700, ls: 1.5 }),
    ...swatches.map(([n, hex], i) =>
      group(`Swatch/${n}`, 48 + (i % 5) * 224, 180 + Math.floor(i / 5) * 112, [
        rect(0, 0, 208, 56, { r: 14, fill: hex, stroke: C.borderStrong }),
        text(0, 78, n, { size: 13, weight: 700 }),
        text(0, 96, hex, { size: 12, fill: C.muted, font: MONO }),
      ])
    ),

    text(48, 430, 'STATUS (always with icon + label)', { size: 12, fill: C.emerald, weight: 700, ls: 1.5 }),
    ...status.map(([n, hex], i) =>
      group(`Status/${n}`, 48 + i * 200, 450, [
        rect(0, 0, 184, 40, { r: 20, fill: hex + '26', stroke: hex }),
        circle(22, 20, 7, 'none', hex, 2),
        text(40, 25, n, { size: 14, fill: hex, weight: 700 }),
      ])
    ),

    text(700, 430, 'DATA RAMPS', { size: 12, fill: C.emerald, weight: 700, ls: 1.5 }),
    text(700, 456, 'Rain / sequential', { size: 12, fill: C.muted }),
    ...BLUE_RAMP.map((c, i) => rect(700 + i * 58, 464, 56, 20, { fill: c })),
    text(700, 508, 'Temperature / diverging (grey = neutral)', { size: 12, fill: C.muted }),
    ...DIVERGING.map((c, i) => rect(700 + i * 58, 516, 56, 20, { fill: c })),

    text(48, 580, 'TYPE SCALE', { size: 12, fill: C.emerald, weight: 700, ls: 1.5 }),
    text(48, 628, 'Display 32 · Fraunces', { size: 32, weight: 500, font: DISPLAY }),
    text(48, 664, 'Title 18 · Plus Jakarta Sans Bold', { size: 18, weight: 700 }),
    text(48, 692, 'Body 14 · Plus Jakarta Sans Medium — readable advice for farmers', { size: 14, fill: C.text2 }),
    text(48, 716, 'Label 11 · UPPERCASE TRACKED', { size: 11, weight: 700, fill: C.muted, ls: 1.5 }),
    text(48, 742, 'Data 13 · JetBrains Mono · 25.7–35.7 °C', { size: 13, font: MONO, fill: C.text2 }),

    text(48, 800, 'COMPONENTS', { size: 12, fill: C.emerald, weight: 700, ls: 1.5 }),
    pill('Button/Primary', 48, 820, 'Share on WhatsApp', { fill: C.whatsapp, color: C.bg, w: 190, h: 40, r: 12 }),
    pill('Button/Secondary', 252, 820, 'Copy', { fill: C.surface2, color: C.text, stroke: C.borderStrong, w: 90, h: 40, r: 12 }),
    pill('Button/Accent', 356, 820, 'Claim certificate', { fill: C.emerald, color: C.bg, w: 170, h: 40, r: 12 }),
    segmented('Segmented/Scenario', 540, 822, ['Live Today', 'Monsoon', 'Winter Frost', 'Pre-Monsoon'], 0, '#F43F5E33', '#FFD2CA'),
    ...['Samba Paddy', 'Table Grapes', 'Royal Apple'].map((c, i) => pill(`Chip/Crop/${c}`, 48 + i * 140, 884, c, { w: 128, fill: i === 0 ? C.emerald : C.surface2, color: i === 0 ? C.bg : C.text2, r: 10 })),
    card('Card/Advisory', 500, 880, 560, 150, [
      rect(20, 20, 520, 110, { r: 16, fill: C.emerald + '1A', stroke: C.emerald + '55' }),
      circle(44, 48, 8, 'none', C.good, 2),
      text(62, 53, 'Best spray window: 06:00–10:00', { size: 15, weight: 700, fill: '#DDF7A6' }),
      text(36, 84, '4 consecutive hours with wind under 10 km/h and no rain.', { size: 13, fill: C.text2 }),
      text(36, 110, 'Glass card · r24 · surface + 1px white/9% border', { size: 11, fill: C.faint, font: MONO }),
    ]),
  ];
  return frame('01 Design System', 80, 80, 1200, 1080, kids, { label: '01 · Design System (1200 × 1080)' });
}

// ---------- 02 · desktop dashboard ----------
function desktop() {
  const W = 1920;
  const header = card('Header/CommandBar', 32, 20, W - 64, 64, [
    rect(16, 12, 40, 40, { r: 12, fill: C.emerald }),
    text(68, 32, 'AeroAgro AI', { size: 17, weight: 800, font: DISPLAY }),
    circle(72, 46, 3, C.emerald),
    text(80, 50, 'Live · Open-Meteo · 17:12', { size: 11, fill: C.muted }),
    segmented('Nav/Views', 520, 14, ['Dashboard', 'Farmer app', 'Village kiosk'], 0),
    segmented('Nav/Scenario', 1010, 14, ['Live Today', 'Monsoon', 'Winter Frost', 'Pre-Monsoon'], 0, '#F43F5E33', '#FFD2CA'),
    pill('Button/Figma', W - 64 - 250, 16, 'Figma artboard', { w: 136, fill: C.violet + '26', color: '#DDD6FE', stroke: C.violet + '55' }),
    pill('Button/About', W - 64 - 104, 16, 'About', { w: 88, fill: C.surface2, stroke: C.borderStrong }),
  ]);

  // map with markers
  const markers = [];
  const pts = [[180, 180], [260, 240], [330, 170], [420, 300], [520, 210], [610, 330], [720, 260], [800, 380], [300, 420], [460, 460], [640, 470], [900, 300], [980, 420], [240, 330], [560, 380], [860, 190], [1040, 260], [380, 540]];
  pts.forEach(([x, y], i) => markers.push(circle(x, y, 7, BLUE_RAMP[(i * 3) % 7], '#E2E8F08C', 1.5)));
  const map = card('Map/Leaflet', 32, 104, 1180, 620, [
    rect(0, 0, 1180, 620, { r: 24, fill: '#1A1D1B' }),
    `<path d="M120 80 C 300 40, 500 120, 640 90 S 980 60, 1100 140 L 1120 560 C 900 600, 600 540, 380 590 S 120 560, 90 500 Z" fill="#23272F" stroke="#2E333D"/>`,
    line(200, 150, 700, 480, '#2C312D', 2), line(400, 100, 900, 520, '#2C312D', 2),
    ...markers,
    circle(620, 300, 12, BLUE_RAMP[1], C.emerald, 4),
    rect(590, 270, 60, 60, { stroke: C.amber, sw: 2, fill: C.amber + '14' }),
    group('Map/Toolbar', 24, 20, [
      rect(0, 0, 1132, 48, { r: 16, fill: '#111714E6', stroke: C.borderStrong }),
      text(20, 30, 'All India (303)  ▾', { size: 13, weight: 700 }),
      segmented('Map/Variable', 170, 6, ['Rain', 'Min °C', 'Max °C', 'Wind'], 0),
      segmented('Map/Resolution', 450, 6, ['1.2 km', '18 km'], 0),
      segmented('Map/Type', 600, 6, ['All', 'Metro', 'Agro'], 0, '#FFFFFF26', C.text),
      segmented('Map/Base', 790, 6, ['Dark', 'Relief', 'Satellite', 'Roads'], 0, '#FFFFFF26', C.text),
    ]),
    group('Map/Legend', 920, 500, [
      rect(0, 0, 236, 96, { r: 16, fill: '#0A0E0CE6', stroke: C.border }),
      text(14, 24, 'Rainfall (mm/day)', { size: 12, weight: 700 }),
      text(222, 24, '1.2 km', { size: 11, fill: '#C8F169', anchor: 'end' }),
      ...BLUE_RAMP.slice().reverse().map((c, i) => rect(14 + i * 30, 34, 30, 10, { fill: c })),
      text(14, 62, '1     5    10    20    40    70', { size: 10, fill: C.muted, font: MONO }),
      text(14, 84, 'Thiruvaiyaru Cauvery Delta', { size: 11, fill: C.text2 }),
      text(222, 84, '0.7', { size: 11, weight: 700, anchor: 'end', font: MONO }),
    ]),
  ]);

  // studio
  const bars = [9, 8, 7, 6, 5.5, 5.8, 5, 3, 2, 1, 2.4, 3.4, 5.3, 8.3];
  const barStatus = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0].map((s) => (s ? C.warning : C.good));
  const studio = card('Studio/SprayWindow', 32, 744, 1180, 316, [
    text(24, 36, 'Microclimate Analytics Studio', { size: 16, weight: 800 }),
    segmented('Studio/Tabs', 24, 52, ['Spray Window', 'PMFBY Verifier', 'IMD Satellite', 'Elevation Transect', 'Acoustic Rain AI'], 0),
    pill('Badge/BestWindow', 950, 54, 'Best window 06:00–10:00', { w: 206, fill: C.emerald + '26', color: '#DDF7A6', stroke: C.emerald + '66', r: 16 }),
    ...bars.map((_, i) => group(`Strip/${i + 6}h`, 24 + i * 80, 104, [rect(0, 0, 74, 40, { r: 8, fill: C.inset, stroke: C.border }), rect(0, 36, 74, 4, { fill: barStatus[i] }), text(37, 24, String(i + 6).padStart(2, '0'), { size: 12, font: MONO, fill: C.text2, anchor: 'middle' })])),
    text(24, 176, 'Wind speed (km/h)', { size: 12, weight: 700, fill: C.text2 }),
    line(24, 212, 660, 212, C.critical, 1.5, '5 5'),
    text(660, 206, 'Drift limit 15', { size: 10, fill: '#FCA5A5', anchor: 'end' }),
    ...bars.map((v, i) => rect(30 + i * 45, 296 - v * 8, 38, v * 8, { r: 4, fill: barStatus[i] })),
    text(720, 176, 'Air temperature (°C)', { size: 12, weight: 700, fill: C.text2 }),
    `<path d="M720 290 C 780 280, 820 220, 880 200 S 1000 190, 1060 210 S 1130 250, 1150 262" stroke="${C.blue}" stroke-width="2.5" fill="none"/>`,
  ]);

  // right column
  const rows = [['24 h rainfall', '0.6 mm', '0.7 mm'], ['Temperature', '26.9–35.7 °C', '25.7–35.7 °C'], ['Wind', '6.5 km/h', '5.1 km/h'], ['Humidity', '58 %', '64 %']];
  const metrics = card('Card/DownscaledMetrics', 1236, 104, 652, 380, [
    text(24, 36, 'DOWNSCALED MICROCLIMATE', { size: 11, weight: 700, fill: C.emerald, ls: 1.5 }),
    text(24, 64, 'Thiruvaiyaru Cauvery Delta', { size: 20, weight: 800 }),
    text(24, 86, 'Thanjavur, Tamil Nadu · 38 m · Alluvial River Delta Basin', { size: 12, fill: C.muted }),
    pill('Badge/Live', 560, 22, '● LIVE', { w: 70, h: 26, fill: C.rose + '26', color: '#FFD2CA', size: 11, r: 13 }),
    rect(24, 108, 604, 36, { r: 10, fill: '#00000055' }),
    text(40, 131, 'VARIABLE', { size: 10, fill: C.faint, ls: 1 }),
    text(440, 131, 'BLOCK 18 KM', { size: 10, fill: C.amber, anchor: 'end', ls: 1 }),
    text(612, 131, 'PANCHAYAT 1.2 KM', { size: 10, fill: '#C8F169', anchor: 'end', ls: 1 }),
    ...rows.map(([l, c, f], i) =>
      group(`Row/${l}`, 24, 150 + i * 48, [line(0, 0, 604, 0, C.border), text(16, 30, l, { size: 13, weight: 700 }), text(416, 30, c, { size: 13, fill: C.muted, font: MONO, anchor: 'end' }), text(588, 30, f, { size: 13, weight: 700, font: MONO, anchor: 'end' })])
    ),
    rect(24, 348 - 10, 604, 1, { fill: C.border }),
    text(24, 366, 'Δz = 38 − 42 = −4 m   ·   Tmax −5.0 °C/km   ·   Tmin −6.5 °C/km − cold-air pooling', { size: 11, fill: C.muted, font: MONO }),
  ]);

  const advisory = card('Card/CropAdvisory', 1236, 504, 652, 556, [
    text(24, 36, 'CROP ADVISORY', { size: 11, weight: 700, fill: C.emerald, ls: 1.5 }),
    text(24, 62, 'Local agricultural guidance', { size: 17, weight: 800 }),
    ...['Samba Paddy', 'Poovan Banana', 'Blackgram', 'Sharbati Wheat'].map((c, i) => pill(`Chip/${c}`, 24 + i * 148, 80, c, { w: 138, fill: i === 0 ? C.emerald : C.surface2, color: i === 0 ? C.bg : C.text2 })),
    group('Card/SprayWindow', 24, 128, [rect(0, 0, 604, 70, { r: 16, fill: C.emerald + '1A', stroke: C.emerald + '55' }), text(20, 30, '✓  Best spray window: 06:00–10:00', { size: 14, weight: 700, fill: '#DDF7A6' }), text(20, 52, '4 consecutive hours with wind under 10 km/h and no rain expected.', { size: 12, fill: C.text2 })]),
    group('Card/Pest', 24, 212, [rect(0, 0, 604, 78, { r: 16, fill: C.surface2, stroke: C.border }), text(20, 28, 'Pest & disease risk', { size: 13, weight: 700, fill: C.text2 }), text(584, 28, 'LOW', { size: 10, font: MONO, anchor: 'end', fill: C.text2 }), text(20, 52, 'Low pest pressure — keep weekly field scouting.', { size: 12, fill: C.text2 })]),
    group('Card/Irrigation', 24, 304, [rect(0, 0, 604, 64, { r: 16, fill: C.cyan + '1A', stroke: C.cyan + '55' }), text(20, 28, 'Normal irrigation', { size: 13, weight: 700, fill: '#B9DEFF' }), text(584, 28, 'ET₀ 5.2 mm', { size: 11, font: MONO, anchor: 'end', fill: '#B9DEFF' }), text(20, 50, '4.6 mm deficit. Irrigate early morning or evening.', { size: 12, fill: C.text2 })]),
    group('Card/Language', 24, 382, [rect(0, 0, 604, 48, { r: 14, fill: C.surface2, stroke: C.border }), segmented('Lang', 12, 6, ['English', 'हिन्दी', 'தமிழ்'], 0), pill('Button/Listen', 500, 8, 'Listen', { w: 92, h: 32, fill: C.emerald, color: C.bg })]),
    group('Card/WhatsApp', 24, 444, [rect(0, 0, 604, 92, { r: 16, fill: '#1F292455', stroke: C.emerald + '33' }), text(20, 30, 'WhatsApp advisory', { size: 13, weight: 700 }), text(20, 56, '*AGROMET ADVISORY: THIRUVAIYARU CAUVERY DELTA* …', { size: 11, fill: '#E6EDE8', font: MONO }), pill('Button/WhatsApp', 420, 50, 'Share on WhatsApp', { w: 168, h: 32, fill: C.whatsapp, color: C.bg })]),
  ]);

  return frame('02 Desktop Dashboard', 1360, 80, W, 1080, [header, map, studio, metrics, advisory], { label: '02 · Desktop — GIS Dashboard (1920 × 1080)' });
}

// ---------- 03 · Kisan mobile ----------
function mobile() {
  const hours = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];
  const kids = [
    rect(0, 0, 390, 844, { r: 44, fill: '#0C101C', stroke: '#1F2924', sw: 6 }),
    rect(129, 0, 132, 22, { r: 10, fill: '#1F2924' }),
    `<path d="M3 44 Q3 3 44 3 L346 3 Q387 3 387 44 L387 300 L3 300 Z" fill="#3A3420"/>`,
    text(24, 60, 'Kisan Agromet', { size: 14, weight: 800 }),
    pill('Badge/Forecast', 262, 44, '1.2 km forecast', { w: 110, h: 24, fill: '#FFFFFF33', color: C.text, size: 10, r: 12 }),
    text(24, 100, 'Thiruvaiyaru Cauvery Delta', { size: 18, weight: 800 }),
    text(24, 122, 'திருவையாறு காவிரி டெல்டா', { size: 13, fill: '#E6EDE8' }),
    text(24, 142, 'Thanjavur · 38 m · Samba Paddy', { size: 12, fill: '#DDF7A6' }),
    ...[['Temp', '26–36°'], ['Rain', '0.7 mm'], ['Wind', '5.1 km/h']].map(([l, v], i) =>
      group(`Stat/${l}`, 24 + i * 116, 164, [rect(0, 0, 106, 82, { r: 14, fill: '#FFFFFF26' }), text(53, 34, l, { size: 11, fill: '#E6EDE8', anchor: 'middle' }), text(53, 62, v, { size: 16, weight: 800, anchor: 'middle' })])
    ),
    group('Card/SprayClock', 20, 320, [
      rect(0, 0, 350, 150, { r: 18, fill: '#111714', stroke: '#1F2924' }),
      text(18, 30, 'SPRAY CLOCK', { size: 10, weight: 700, fill: C.muted, ls: 1.5 }),
      ...hours.map((h, i) => rect(18 + i * 22.5, 44, 20, 10, { r: 3, fill: h ? C.warning : C.good })),
      rect(18, 76, 314, 56, { r: 12, fill: C.emerald + '26', stroke: C.emerald + '66' }),
      text(36, 102, '✓  Safe to spray 06:00–10:00', { size: 14, weight: 700, fill: '#DDF7A6' }),
      text(36, 120, 'Low wind, no rain expected.', { size: 11, fill: '#E6EDE8' }),
    ]),
    group('Card/Irrigation', 20, 484, [rect(0, 0, 350, 70, { r: 18, fill: '#111714', stroke: C.cyan + '44' }), text(18, 28, 'NORMAL IRRIGATION', { size: 10, weight: 700, fill: '#7DC4FF', ls: 1.2 }), text(18, 50, '4.6 mm deficit. Irrigate morning or evening.', { size: 12, fill: C.text2 })]),
    group('Card/Pest', 20, 566, [rect(0, 0, 350, 70, { r: 18, fill: '#111714', stroke: C.amber + '44' }), text(18, 28, 'LOW PEST PRESSURE', { size: 10, weight: 700, fill: '#F6B94C', ls: 1.2 }), text(18, 50, 'Keep weekly field scouting.', { size: 12, fill: C.text2 })]),
    group('Card/Language', 20, 648, [rect(0, 0, 350, 48, { r: 14, fill: '#FFFFFF0D', stroke: C.border }), segmented('Lang', 10, 6, ['English', 'हिन्दी', 'தமிழ்'], 0), pill('Listen', 262, 8, 'Listen', { w: 76, h: 32, fill: C.emerald, color: C.bg })]),
    pill('Button/ShareWhatsApp', 20, 712, 'Share to village WhatsApp group', { w: 350, h: 50, fill: C.whatsapp, color: C.bg, size: 14, r: 18 }),
  ];
  return frame('03 Kisan Mobile', 80, 1320, 390, 844, kids, { fill: 'none', label: '03 · Kisan Mobile (390 × 844)' });
}

// ---------- 04 · panchayat kiosk ----------
function kiosk() {
  const sched = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
  const st = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];
  const kids = [
    card('Kiosk/Header', 32, 28, 1376, 110, [
      rect(24, 24, 60, 60, { r: 16, fill: C.cyan }),
      text(104, 56, 'Thiruvaiyaru Cauvery Delta', { size: 28, weight: 800 }),
      text(104, 82, 'திருவையாறு காவிரி டெல்டா  ·  Thanjavur, Tamil Nadu · 38 m', { size: 14, fill: '#C8F169' }),
      text(1340, 62, '05:18:39 PM', { size: 34, weight: 800, font: MONO, fill: '#B9DEFF', anchor: 'end' }),
      text(1340, 86, 'Sunday, 27 September · IST', { size: 12, fill: C.muted, anchor: 'end' }),
    ]),
    group('Kiosk/Alert', 32, 158, [rect(0, 0, 1376, 76, { r: 18, fill: '#18301CAA', stroke: C.emerald, sw: 2 }), circle(40, 38, 14, 'none', '#C8F169', 2.5), text(72, 34, 'No severe weather expected today', { size: 18, weight: 700 }), text(72, 58, 'Best spray window 06:00–10:00. Normal irrigation.', { size: 14, fill: C.text2 })]),
    card('Kiosk/Weather', 32, 254, 330, 500, [
      text(20, 34, 'TODAY’S WEATHER · 1.2 KM', { size: 11, weight: 700, fill: C.muted, ls: 1.2 }),
      text(20, 74, 'Temperature', { size: 13, fill: C.muted }), text(20, 116, '25.7° – 35.7°C', { size: 36, weight: 800 }),
      text(20, 164, 'Rain', { size: 13, fill: C.muted }), text(20, 204, '0.7 mm', { size: 36, weight: 800 }),
      text(20, 252, 'Wind', { size: 13, fill: C.muted }), text(20, 284, '5.1 km/h', { size: 22, weight: 700 }),
      text(170, 252, 'Humidity', { size: 13, fill: C.muted }), text(170, 284, '64 %', { size: 22, weight: 700 }),
    ]),
    card('Kiosk/SpraySchedule', 380, 254, 330, 500, [
      text(20, 34, 'SPRAY SCHEDULE', { size: 11, weight: 700, fill: C.muted, ls: 1.2 }),
      ...sched.map((h, i) => {
        const x = 20 + (i % 2) * 148;
        const y = 52 + Math.floor(i / 2) * 44;
        const c = st[i] ? C.warning : C.good;
        return group(`Hour/${h}`, x, y, [rect(0, 0, 140, 36, { r: 8, fill: C.inset }), rect(0, 0, 4, 36, { fill: c }), text(14, 23, `${h}:00`, { size: 13, font: MONO, fill: C.text2 }), text(128, 23, st[i] ? 'Caution' : 'Safe', { size: 12, weight: 700, fill: c, anchor: 'end' })]);
      }),
    ]),
    card('Kiosk/FarmActions', 728, 254, 330, 500, [
      text(20, 34, 'FARM ACTIONS', { size: 11, weight: 700, fill: C.muted, ls: 1.2 }),
      rect(20, 52, 290, 110, { r: 14, fill: C.cyan + '1A', stroke: C.cyan + '55' }), text(36, 84, 'Normal irrigation', { size: 16, weight: 700, fill: '#B9DEFF' }), text(36, 110, '4.6 mm deficit. Irrigate early', { size: 13, fill: C.text2 }), text(36, 130, 'morning or evening.', { size: 13, fill: C.text2 }),
      rect(20, 178, 290, 100, { r: 14, fill: C.amber + '1A', stroke: C.amber + '55' }), text(36, 210, 'Low pest pressure', { size: 16, weight: 700 }), text(36, 236, 'Keep weekly field scouting.', { size: 13, fill: C.text2 }),
    ]),
    card('Kiosk/QR', 1076, 254, 332, 500, [
      text(166, 36, 'TAKE THIS ADVISORY HOME', { size: 12, weight: 700, fill: '#C8F169', anchor: 'middle', ls: 1.2 }),
      rect(76, 64, 180, 180, { r: 18, fill: '#FFFFFF' }),
      ...Array.from({ length: 64 }, (_, k) => ((k * 37) % 5 < 2 ? rect(96 + (k % 8) * 18, 84 + Math.floor(k / 8) * 18, 16, 16, { fill: '#111714' }) : '')),
      text(166, 280, 'Scan to open today’s advisory', { size: 13, fill: C.text2, anchor: 'middle' }),
      text(166, 300, 'in WhatsApp', { size: 13, fill: C.text2, anchor: 'middle' }),
    ], { fill: '#18201C' }),
  ];
  return frame('04 Panchayat Kiosk', 560, 1320, 1440, 780, kids, { label: '04 · Panchayat Kiosk wallboard (1440 × 780)' });
}

// ---------- 05 · backend architecture ----------
function backend() {
  const box = (name, x, y, w, h, title, lines, color) =>
    group(name, x, y, [
      rect(0, 0, w, h, { r: 18, fill: C.surface, stroke: color, sw: 1.5 }),
      rect(0, 0, w, 6, { r: 3, fill: color }),
      text(20, 38, title, { size: 16, weight: 800 }),
      ...lines.map((l, i) => text(20, 64 + i * 22, l, { size: 12.5, fill: C.text2 })),
    ]);
  const arrow = (x1, y1, x2, y2, label, color = C.muted) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return [
      `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="2" marker-end="url(#arrow)"/>`,
      label ? rect(mx - label.length * 3.3 - 8, my - 13, label.length * 6.6 + 16, 22, { r: 11, fill: C.bg, stroke: C.border }) : '',
      label ? text(mx, my + 3, label, { size: 11, fill: C.muted, anchor: 'middle', font: MONO }) : '',
    ].join('');
  };

  // Right-angle connector through the gutters between columns
  const elbow = (pts, label, lx, ly, color = C.muted) =>
    [
      `<path d="M${pts.map((p) => p.join(' ')).join(' L')}" stroke="${color}" stroke-width="2" fill="none" marker-end="url(#arrow)"/>`,
      label ? rect(lx - label.length * 3.3 - 8, ly - 13, label.length * 6.6 + 16, 22, { r: 11, fill: C.bg, stroke: C.border }) : '',
      label ? text(lx, ly + 3, label, { size: 11, fill: C.muted, anchor: 'middle', font: MONO }) : '',
    ].join('');

  const kids = [
    text(48, 64, 'Backend & data architecture', { size: 30, weight: 800, font: DISPLAY }),
    text(48, 94, 'From an 18 km numerical forecast to a WhatsApp message a farmer can act on.', { size: 15, fill: C.muted }),

    // column 1 · data sources
    text(48, 150, 'DATA SOURCES', { size: 12, weight: 700, fill: C.amber, ls: 1.5 }),
    box('Src/OpenMeteo', 48, 166, 340, 110, 'Open-Meteo NWP', ['Hourly + daily forecast, ~11–25 km grid', 'Free, keyless · elevation=nan → grid mean'], C.amber),
    box('Src/SRTM', 48, 296, 340, 110, 'NASA SRTM 30 m DEM', ['Elevation, slope, aspect', 'D8 flow accumulation (cold-air drainage)'], C.amber),
    box('Src/Sentinel', 48, 426, 340, 110, 'Sentinel-2 NDVI · ERA5-Land', ['Canopy moisture covariate', 'Historical training targets'], C.amber),
    box('Src/IMD', 48, 556, 340, 110, 'IMD INSAT-3DR imagery', ['IR-1, visible, water-vapour, CTBT', 'Overlaid directly on the dashboard map'], C.amber),

    // column 2 · FastAPI
    text(500, 150, 'FASTAPI BACKEND  (backend/app)', { size: 12, weight: 700, fill: C.emerald, ls: 1.5 }),
    box('API/OpenMeteoService', 500, 166, 400, 110, 'services/open_meteo.py', ['OpenMeteoService.fetch_coarse_forecast()', '3-day forecast · offline fallback'], C.emerald),
    box('API/Downscaler', 500, 296, 400, 150, 'ml/downscaler.py', ['TabularDownscalerML (XGBoost + RF weights)', 'Lapse rate · katabatic inversion', 'Orographic lift · rain-shadow · ridge wind', 'Magnus RH · frost hazard index'], C.emerald),
    box('API/Advisory', 500, 466, 400, 130, 'services/advisory.py', ['Hourly spray window (wind, rain, heat)', 'Disease triggers · irrigation action', 'English / Marathi WhatsApp text'], C.emerald),
    box('API/Main', 500, 616, 400, 110, 'main.py · REST endpoints', ['GET /api/v1/panchayats · GET /api/v1/downscale', 'POST /api/v1/advisory · GET /health'], C.emerald),

    // column 3 · storage + training
    text(1012, 150, 'STORAGE & TRAINING', { size: 12, weight: 700, fill: C.violet, ls: 1.5 }),
    box('DB/Supabase', 1012, 166, 380, 150, 'Supabase PostgreSQL + PostGIS', ['panchayats (geometry, GIST index)', 'forecasts · advisories time series', 'Row-level security', 'supabase/migrations/001_init_postgis.sql'], C.violet),
    box('ML/Colab', 1012, 336, 380, 110, 'Google Colab training', ['notebooks/colab_training.py', 'ERA5 + SRTM + NDVI → XGBoost / RF'], C.violet),

    // column 4 · clients
    text(1500, 150, 'CLIENTS', { size: 12, weight: 700, fill: C.cyan, ls: 1.5 }),
    box('Client/NextJS', 1500, 166, 372, 170, 'Next.js 14 dashboard', ['GIS map · 303 regions (Leaflet)', 'In-browser physics engine (lib/microclimate)', 'Live Open-Meteo fetch + national grid', 'Spray, PMFBY, IMD, transect, acoustic'], C.cyan),
    box('Client/Kisan', 1500, 356, 372, 110, 'Kisan Mobile view', ['EN / हिन्दी / தமிழ் advisory + voice', 'One-tap WhatsApp share'], C.cyan),
    box('Client/Kiosk', 1500, 486, 372, 110, 'Panchayat Kiosk wallboard', ['Full-screen, live clock, alerts', 'Scannable QR → WhatsApp'], C.cyan),
    box('Client/WhatsApp', 1500, 616, 372, 110, 'WhatsApp / Telegram', ['Village broadcast of advisories', 'wa.me share links today · Cloud API next'], C.whatsapp),

    arrow(388, 221, 500, 221, 'coarse'),
    arrow(388, 351, 500, 360, 'terrain'),
    arrow(388, 481, 500, 390, 'NDVI'),
    arrow(700, 276, 700, 296, ''),
    arrow(700, 446, 700, 466, ''),
    arrow(700, 596, 700, 616, ''),
    elbow([[900, 671], [1446, 671], [1446, 251], [1500, 251]], 'JSON / REST', 1170, 671, C.emerald),
    arrow(900, 241, 1012, 241, 'persist'),
    elbow([[1012, 391], [956, 391], [956, 371], [900, 371]], 'weights', 956, 420),
    arrow(1686, 336, 1686, 356, ''),
    arrow(1686, 596, 1686, 616, ''),

    // pipeline strip
    group('Pipeline', 48, 780, [
      rect(0, 0, 1824, 250, { r: 22, fill: C.surface, stroke: C.border }),
      text(28, 44, 'DOWNSCALING PIPELINE — per panchayat', { size: 12, weight: 700, fill: C.emerald, ls: 1.5 }),
      ...[
        ['1 · Ingest', 'Block forecast T, P, wind, RH', 'at grid-cell mean height'],
        ['2 · Δz lapse', 'Tmax −5.0 °C/km', 'Tmin −6.5 (winter −4.5) °C/km'],
        ['3 · Terrain', 'Cold-air pooling × D8 drainage', 'orographic lift · gap funnelling'],
        ['4 · Surface', 'Urban heat island +2.2 °C', 'desert heating · coastal RH'],
        ['5 · Advise', 'Hourly spray status, ET₀', 'pest rules, PMFBY triggers'],
        ['6 · Deliver', 'Dashboard · Kisan · Kiosk', 'WhatsApp in 3 languages'],
      ].map(([t, a, b], i) =>
        group(`Step/${t}`, 28 + i * 298, 70, [rect(0, 0, 278, 150, { r: 16, fill: C.inset, stroke: C.border }), circle(30, 34, 14, C.emerald + '33', C.emerald, 1.5), text(30, 39, String(i + 1), { size: 13, weight: 800, anchor: 'middle', fill: '#DDF7A6' }), text(54, 39, t.slice(4), { size: 15, weight: 800 }), text(18, 84, a, { size: 12.5, fill: C.text2 }), text(18, 106, b, { size: 12.5, fill: C.text2 })])
      ),
    ]),
  ];
  return frame('05 Backend Architecture', 80, 2240, 1920, 1080, kids, { label: '05 · Backend & data architecture (1920 × 1080)' });
}

// ---------- 06 · API reference ----------
function apiReference() {
  const endpoint = (y, method, route, desc, example) =>
    group(`Endpoint/${method} ${route}`, 40, y, [
      rect(0, 0, 1120, 170, { r: 18, fill: C.surface, stroke: C.border }),
      pill(`Method/${method}`, 20, 20, method, { w: 66, h: 28, fill: method === 'GET' ? C.cyan + '33' : C.emerald + '33', color: method === 'GET' ? '#B9DEFF' : '#DDF7A6', size: 12, r: 8 }),
      text(100, 40, route, { size: 17, weight: 700, font: MONO }),
      text(20, 76, desc, { size: 13, fill: C.text2 }),
      rect(20, 94, 1080, 58, { r: 10, fill: C.inset }),
      ...example.map((l, i) => text(36, 118 + i * 20, l, { size: 12, fill: '#DDF7A6', font: MONO })),
    ]);
  const kids = [
    text(40, 64, 'API reference · FastAPI', { size: 30, weight: 800, font: DISPLAY }),
    text(40, 94, 'uvicorn app.main:app --reload --port 8000   →   Swagger UI at /docs', { size: 14, fill: C.muted, font: MONO }),
    endpoint(130, 'GET', '/health', 'Liveness probe for Render / Railway.', ['{ "status": "online", "system": "AeroAgro AI FastAPI Backend", "version": "1.0.0" }']),
    endpoint(320, 'GET', '/api/v1/panchayats', 'Monitored panchayats with terrain covariates (elevation, slope, drainage, NDVI).', ['{ "status": "success", "count": 9, "data": [ { "id": "tn_thiruvaiyaru", "elevationM": 38.0, … } ] }']),
    endpoint(510, 'GET', '/api/v1/downscale?block_lat=18.45&block_lng=73.65', 'Fetch the coarse block forecast and downscale it for every panchayat.', ['{ "block_coarse_baseline": { "tempMax": 31.5, … },', '  "downscaled_panchayats": [ { "temp_min_c": 14.2, "frost_hazard_score": 25, … } ] }']),
    endpoint(700, 'POST', '/api/v1/advisory', 'Body: { "panchayat_id": "tn_ooty", "crop_name": "Table Grapes", "language": "en" | "mr" }', ['{ "spray_summary": "06:00 to 10:00", "irrigation_action": "NORMAL IRRIGATION SCHEDULE",', '  "disease_alerts": [ … ], "whatsapp_message": "🌱 *AGROMET ADVISORY: …" }']),
  ];
  return frame('06 API Reference', 2120, 2240, 1200, 900, kids, { label: '06 · API reference (1200 × 900)' });
}

// ---------- 08 · landing hero ----------
function hero() {
  const W = 1340;
  const H = 780;
  const topoFile = path.join(ROOT, 'frontend', 'src', 'assets', 'topo.svg');
  const topo = fs.existsSync(topoFile) ? (fs.readFileSync(topoFile, 'utf8').match(/<g[\s\S]*<\/g>/) || [''])[0] : '';
  const revealFile = path.join(ROOT, 'design', 'screens', 'reveal.png');
  const reveal = fs.existsSync(revealFile) ? fs.readFileSync(revealFile).toString('base64') : null;

  const kids = [
    `<clipPath id="heroClip"><rect width="${W}" height="${H}" rx="28"/></clipPath>`,
    `<g clip-path="url(#heroClip)" opacity="0.9"><g transform="scale(${W / 1600})">${topo}</g></g>`,
    `<g id="Hero_Copy">`,
    rect(56, 70, 330, 30, { r: 15, fill: C.emerald + '1A', stroke: C.emerald + '44' }),
    circle(74, 85, 4, C.emerald),
    text(88, 90, 'Live microclimate forecasts for Indian farms', { size: 13, fill: C.emerald, weight: 600 }),
    text(56, 180, 'Weather for', { size: 68, weight: 500, font: DISPLAY }),
    text(56, 252, 'your village,', { size: 68, weight: 500, font: DISPLAY }),
    `<text x="56" y="324" fill="${C.emerald}" font-family="${DISPLAY}" font-size="68" font-style="italic">not your district.</text>`,
    text(56, 376, 'AeroAgro sharpens 18 km forecasts into 1.2 km microclimates using terrain', { size: 17, fill: C.text2 }),
    text(56, 402, 'physics, then tells each farmer when to spray, water and protect their crop.', { size: 17, fill: C.text2 }),
    group('Hero/Search', 56, 440, [rect(0, 0, 380, 56, { r: 16, fill: C.surface, stroke: C.borderStrong }), circle(30, 28, 8, 'none', C.muted, 2), text(52, 34, 'Find your village, district or crop', { size: 15, fill: C.muted })]),
    pill('Hero/UseLocation', 448, 440, 'Use my location', { w: 170, h: 56, fill: C.surface2, color: C.text, stroke: C.borderStrong, size: 15, r: 16 }),
    text(56, 540, 'Try', { size: 14, fill: C.muted }),
    ...['Ooty', 'Munnar', 'Kotgarh apples', 'Jaisalmer'].map((c, i, a) => {
      const x = 92 + a.slice(0, i).reduce((s, v) => s + v.length * 7.6 + 40, 0);
      return pill(`Hero/Try/${c}`, x, 520, c, { w: Math.round(c.length * 7.6 + 30), h: 30, fill: C.surface2, color: C.text2, stroke: C.border, size: 13, r: 15 });
    }),
    line(56, 590, 620, 590, C.border),
    ...[['303', 'districts & metros'], ['225×', 'finer than 18 km'], ['3', 'languages + voice'], ['₹0', 'data cost']].map(([v, l], i) =>
      group(`Hero/Stat/${l}`, 56 + i * 145, 610, [text(0, 36, v, { size: 34, font: DISPLAY }), text(0, 60, l, { size: 12, fill: C.muted })])
    ),
    `</g>`,
    reveal
      ? group('Hero/ResolutionReveal', 700, 90, [`<image width="580" height="600" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${reveal}"/>`])
      : card('Hero/ResolutionReveal', 700, 90, 580, 600, [text(290, 300, 'Resolution reveal', { anchor: 'middle', fill: C.muted })]),
  ];
  return frame('08 Landing Hero', 2080, 1320, W, H, kids, { label: '08 · Landing hero with resolution reveal (1340 × 780)' });
}

// ---------- 07 · reference screenshots ----------
function screenshots() {
  const dir = path.join(ROOT, 'design', 'screens');
  // [file, width, height, label, x, y, scale]
  const shots = [
    ['hero.png', 1440, 900, 'Landing hero', 40, 110, 0.5],
    ['desktop-dashboard.png', 1440, 1000, 'Live dashboard', 800, 110, 0.5],
    ['farmer-app.png', 1440, 900, 'Farmer app', 1560, 110, 0.45],
    ['kiosk.png', 1440, 900, 'Village kiosk', 40, 680, 0.5],
    ['pmfby-certificate.png', 672, 640, 'Insurance evidence report', 800, 680, 0.62],
    ['mobile-dashboard.png', 390, 844, 'Phone', 1260, 680, 0.55],
  ];
  const kids = [text(40, 64, 'Reference screenshots of the running app', { size: 28, font: DISPLAY })];
  for (const [file, w, h, label, x, y, s] of shots) {
    const p = path.join(dir, file);
    if (!fs.existsSync(p)) continue;
    const b64 = fs.readFileSync(p).toString('base64');
    kids.push(
      group(`Screen/${label}`, x, y, [
        text(0, -12, label, { size: 14, fill: C.muted }),
        `<image width="${Math.round(w * s)}" height="${Math.round(h * s)}" href="data:image/png;base64,${b64}"/>`,
        rect(0, 0, Math.round(w * s), Math.round(h * s), { stroke: C.borderStrong }),
      ])
    );
  }
  return frame('07 Screens', 80, 3440, 2260, 1180, kids, { label: '07 · Reference screenshots (raster)' });
}

// ---------- assemble ----------
const W = 3500;
const H = 4700;
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="${C.muted}"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.canvas}"/>
  ${designSystem()}
  ${desktop()}
  ${mobile()}
  ${kiosk()}
  ${hero()}
  ${backend()}
  ${apiReference()}
  ${screenshots()}
</svg>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, svg);
fs.writeFileSync(PUBLIC_COPY, svg);
console.log(`Wrote ${path.relative(ROOT, OUT)} (${(svg.length / 1024).toFixed(0)} KB) and ${path.relative(ROOT, PUBLIC_COPY)}`);
