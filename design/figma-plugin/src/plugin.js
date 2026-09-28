// AeroAgro AI · Figma plugin
// Generates the "Field Instrument" design system and product screens as native, editable Figma
// layers: colour variables, text styles, variant components, auto-layout screens, native charts.
// DATA is a live engine snapshot (Open-Meteo + Copernicus DEM, run through the real downscaler);
// IMAGES are PNG renders of the live canvases. Both are injected by scripts/build_figma_plugin.mjs.

/* global DATA, IMAGES, figma */

// ---------------------------------------------------------------- tokens
const TOKENS = {
  bg: '#0A0E0C',
  surface: '#111714',
  surface2: '#18201C',
  raised: '#1F2924',
  line: '#E2F0E7',
  ink: '#ECF2EE',
  ink2: '#B8C4BD',
  muted: '#808E86',
  accent: '#C8F169',
  accentInk: '#0C120A',
  sky: '#7DC4FF',
  sun: '#F6B94C',
  alert: '#FF7A66',
  frost: '#A5D8FF',
  good: '#2FB344',
  warn: '#F2B01E',
  bad: '#E5484D',
};
const TOKEN_NOTES = {
  bg: 'Page · field at night',
  surface: 'Cards',
  surface2: 'Inset tiles',
  raised: 'Selected / hover',
  line: 'Hairlines at 6–14 %',
  ink: 'Primary text',
  ink2: 'Secondary text',
  muted: 'Labels, captions',
  accent: 'New-leaf lime · the one accent',
  accentInk: 'Text on accent',
  sky: 'Rain, water, cold',
  sun: 'Heat, 18 km block',
  alert: 'Hazard',
  frost: 'Frost',
  good: 'Status · safe',
  warn: 'Status · caution',
  bad: 'Status · stop',
};
const V = {}; // variables by token key
const S = {}; // text styles by key
const FONT = {}; // resolved fonts by role

const hexToRgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });

function paint(key, opacity) {
  const hex = TOKENS[key] || key;
  let p = { type: 'SOLID', color: hexToRgb(hex), opacity: opacity == null ? 1 : opacity };
  if (V[key] && figma.variables && figma.variables.setBoundVariableForPaint) {
    try {
      p = figma.variables.setBoundVariableForPaint(p, 'color', V[key]);
    } catch (e) {
      /* unbound fallback */
    }
  }
  return p;
}

function gradient(stops, angle) {
  // angle 0 = left→right, 90 = top→bottom
  const a = ((angle || 0) * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);
  return {
    type: 'GRADIENT_LINEAR',
    gradientTransform: [
      [c, s, (1 - c - s) / 2],
      [-s, c, (1 + s - c) / 2],
    ],
    gradientStops: stops.map(([pos, hex, op]) => {
      const { r, g, b } = hexToRgb(TOKENS[hex] || hex);
      return { position: pos, color: { r, g, b, a: op == null ? 1 : op } };
    }),
  };
}

// ---------------------------------------------------------------- fonts
async function resolveFonts() {
  const all = await figma.listAvailableFontsAsync();
  const has = (family, style) => all.some((f) => f.fontName.family === family && f.fontName.style === style);
  const pick = (families, styles) => {
    for (const family of families) for (const style of styles) if (has(family, style)) return { family, style };
    return null;
  };
  const inter = (style) => pick(['Inter'], [style, style.replace('SemiBold', 'Semi Bold'), 'Regular']) || { family: 'Inter', style: 'Regular' };
  FONT.display = pick(['Fraunces'], ['Regular', '9pt Regular', 'Light']) || inter('Regular');
  FONT.displayItalic = pick(['Fraunces'], ['Italic', '9pt Italic', 'Light Italic']) || pick(['Inter'], ['Italic']) || FONT.display;
  FONT.sans = pick(['Plus Jakarta Sans', 'Inter'], ['Regular']) || inter('Regular');
  FONT.sansMedium = pick(['Plus Jakarta Sans', 'Inter'], ['Medium']) || FONT.sans;
  FONT.sansSemi = pick(['Plus Jakarta Sans', 'Inter'], ['SemiBold', 'Semi Bold', 'Bold']) || FONT.sans;
  FONT.sansBold = pick(['Plus Jakarta Sans', 'Inter'], ['Bold', 'ExtraBold']) || FONT.sansSemi;
  FONT.mono = pick(['JetBrains Mono', 'Roboto Mono', 'IBM Plex Mono', 'Source Code Pro'], ['Regular']) || inter('Regular');
  FONT.monoBold = pick(['JetBrains Mono', 'Roboto Mono', 'IBM Plex Mono', 'Source Code Pro'], ['Bold', 'SemiBold', 'Medium']) || FONT.mono;
  FONT.deva = pick(['Poppins', 'Mukta', 'Hind', 'Noto Sans Devanagari'], ['Regular']);
  FONT.malayalam = pick(['Noto Sans Malayalam', 'Manjari', 'Baloo Chettan 2'], ['Regular']);
  const load = Object.values(FONT).filter(Boolean);
  for (const f of load) await figma.loadFontAsync(f);
}

// ---------------------------------------------------------------- variables & styles
async function setupVariables() {
  if (!figma.variables || !figma.variables.createVariableCollection) return;
  try {
    const existing = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === 'AeroAgro · Field Instrument');
    const col = existing || figma.variables.createVariableCollection('AeroAgro · Field Instrument');
    const mode = col.modes[0].modeId;
    col.renameMode(mode, 'Night');
    const vars = await figma.variables.getLocalVariablesAsync('COLOR');
    for (const [k, hex] of Object.entries(TOKENS)) {
      const name = `color/${k}`;
      let v = vars.find((x) => x.name === name && x.variableCollectionId === col.id);
      if (!v) v = figma.variables.createVariable(name, col, 'COLOR');
      v.setValueForMode(mode, Object.assign(hexToRgb(hex), { a: 1 }));
      v.description = TOKEN_NOTES[k] || '';
      V[k] = v;
    }
  } catch (e) {
    console.warn('Variables unavailable, using raw colours', e);
  }
}

const TEXT_STYLES = [
  ['display/xl', 'display', 64, 1.02, -2],
  ['display/l', 'display', 40, 1.08, -1],
  ['display/m', 'display', 28, 1.15, -0.5],
  ['display/s', 'display', 20, 1.2, 0],
  ['body/l', 'sans', 17, 1.6, 0],
  ['body/m', 'sans', 14, 1.55, 0],
  ['body/m-strong', 'sansSemi', 14, 1.4, 0],
  ['body/s', 'sans', 12, 1.45, 0],
  ['mono/label', 'mono', 10, 1.4, 16],
  ['mono/data', 'mono', 11, 1.45, 2],
  ['mono/readout', 'monoBold', 13, 1.3, 0],
  ['mono/figure', 'monoBold', 26, 1.1, -2],
];

async function setupTextStyles() {
  const existing = await figma.getLocalTextStylesAsync();
  for (const [name, role, size, lh, ls] of TEXT_STYLES) {
    let st = existing.find((s) => s.name === `AeroAgro/${name}`);
    if (!st) st = figma.createTextStyle();
    st.name = `AeroAgro/${name}`;
    st.fontName = FONT[role];
    st.fontSize = size;
    st.lineHeight = { unit: 'PERCENT', value: lh * 100 };
    st.letterSpacing = { unit: 'PERCENT', value: ls };
    if (name === 'mono/label') st.textCase = 'UPPER';
    S[name] = st;
  }
}

// ---------------------------------------------------------------- node helpers
function frame(name, o) {
  o = o || {};
  const f = figma.createFrame();
  f.name = name;
  f.fills = o.fill ? (Array.isArray(o.fill) ? o.fill : [o.fill]) : [];
  f.clipsContent = !!o.clip;
  if (o.dir) {
    f.layoutMode = o.dir === 'row' ? 'HORIZONTAL' : 'VERTICAL';
    f.itemSpacing = o.gap || 0;
    const p = o.pad == null ? 0 : o.pad;
    const [pt, pr, pb, pl] = Array.isArray(p) ? (p.length === 2 ? [p[0], p[1], p[0], p[1]] : p) : [p, p, p, p];
    f.paddingTop = pt;
    f.paddingRight = pr;
    f.paddingBottom = pb;
    f.paddingLeft = pl;
    f.primaryAxisAlignItems = o.justify || 'MIN';
    f.counterAxisAlignItems = o.align || 'MIN';
    f.primaryAxisSizingMode = 'AUTO';
    f.counterAxisSizingMode = 'AUTO';
    if (o.w != null) {
      if (o.dir === 'row') f.primaryAxisSizingMode = 'FIXED';
      else f.counterAxisSizingMode = 'FIXED';
      f.resize(o.w, Math.max(1, o.h || f.height));
    }
    if (o.h != null) {
      if (o.dir === 'row') f.counterAxisSizingMode = 'FIXED';
      else f.primaryAxisSizingMode = 'FIXED';
      f.resize(Math.max(1, o.w || f.width), o.h);
    }
  } else if (o.w != null || o.h != null) f.resize(o.w || 100, o.h || 100);
  if (o.radius != null) f.cornerRadius = o.radius;
  if (o.stroke) {
    f.strokes = [paint(o.stroke[0], o.stroke[1])];
    f.strokeWeight = o.stroke[2] || 1;
    f.strokeAlign = 'INSIDE';
  }
  if (o.shadow) f.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.55 }, offset: { x: 0, y: 18 }, radius: 40, spread: -16, visible: true, blendMode: 'NORMAL' }];
  return f;
}

async function text(str, style, color, o) {
  o = o || {};
  const t = figma.createText();
  const st = S[style];
  const role = o.font || (st ? TEXT_STYLES.find((x) => x[0] === style)[1] : 'sans');
  t.fontName = FONT[role] || FONT.sans;
  t.characters = String(str);
  if (st) {
    try {
      if (!o.font) await t.setTextStyleIdAsync(st.id);
      else {
        t.fontSize = st.fontSize;
        t.lineHeight = st.lineHeight;
        t.letterSpacing = st.letterSpacing;
      }
    } catch (e) {
      t.fontSize = st.fontSize;
    }
  }
  if (o.size) t.fontSize = o.size;
  if (o.upper) t.textCase = 'UPPER';
  if (o.align) t.textAlignHorizontal = o.align;
  t.fills = [paint(color || 'ink', o.opacity)];
  if (o.w) {
    t.textAutoResize = 'HEIGHT';
    t.resize(o.w, t.height);
  }
  return t;
}

function add(parent, child, o) {
  parent.appendChild(child);
  o = o || {};
  const row = parent.layoutMode === 'HORIZONTAL';
  // "fill width": grow along a row, stretch across a column. Try the modern sizing API first;
  // a hugging parent can refuse it, so fall back to the legacy properties, which apply once it is sized.
  if (o.fill) {
    try {
      child.layoutSizingHorizontal = 'FILL';
    } catch (e) {
      if (row) child.layoutGrow = 1;
      else child.layoutAlign = 'STRETCH';
    }
  }
  if (o.fillV) {
    try {
      child.layoutSizingVertical = 'FILL';
    } catch (e) {
      if (row) child.layoutAlign = 'STRETCH';
      else child.layoutGrow = 1;
    }
  }
  if (o.grow) child.layoutGrow = 1;
  if (o.abs) {
    child.layoutPositioning = 'ABSOLUTE';
    child.x = o.abs[0];
    child.y = o.abs[1];
  }
  return child;
}

function rect(w, h, fill, o) {
  o = o || {};
  const r = figma.createRectangle();
  r.resize(Math.max(0.01, w), Math.max(0.01, h));
  r.fills = [fill.type ? fill : paint(fill, o.opacity)];
  if (o.radius != null) r.cornerRadius = o.radius;
  if (o.name) r.name = o.name;
  return r;
}

/** Eight accent corner ticks, pinned to the corners so they follow resizing. */
function hudCorners(target) {
  const L = 12, T = 1.5;
  const spots = [
    [0, 0, L, T, 'MIN', 'MIN'],
    [0, 0, T, L, 'MIN', 'MIN'],
    [target.width - L, 0, L, T, 'MAX', 'MIN'],
    [target.width - T, 0, T, L, 'MAX', 'MIN'],
    [0, target.height - T, L, T, 'MIN', 'MAX'],
    [0, target.height - L, T, L, 'MIN', 'MAX'],
    [target.width - L, target.height - T, L, T, 'MAX', 'MAX'],
    [target.width - T, target.height - L, T, L, 'MAX', 'MAX'],
  ];
  for (const [x, y, w, h, hc, vc] of spots) {
    const r = rect(w, h, 'accent', { opacity: 0.6, name: 'hud-tick' });
    target.appendChild(r);
    if (target.layoutMode && target.layoutMode !== 'NONE') r.layoutPositioning = 'ABSOLUTE';
    r.x = x;
    r.y = y;
    r.constraints = { horizontal: hc, vertical: vc };
  }
}

function svg(markup, name) {
  const n = figma.createNodeFromSvg(markup);
  n.name = name || 'icon';
  n.fills = [];
  return n;
}

const ICON = {
  rain: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M16 14v6M8 14v6M12 16v6"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7l10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  spark: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
  drop: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z"/>',
  wind: '<path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  snow: '<path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  radar: '<path d="M19.1 4.9A10 10 0 1 1 12 2M12 6a6 6 0 1 0 6 6M12 12l7-7"/><circle cx="12" cy="12" r="2"/>',
  spray: '<path d="M3 3h.01M7 5h.01M11 7h.01M3 7h.01M7 9h.01M3 11h.01"/><rect x="15" y="5" width="4" height="4"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2M13 16h8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
};
function icon(key, color, size) {
  const s = size || 16;
  const n = svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${TOKENS[color] || color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[key]}</svg>`,
    `icon/${key}`
  );
  return n;
}

function image(key, w, h, name) {
  const r = figma.createRectangle();
  r.name = name || key;
  r.resize(w, h);
  if (IMAGES[key]) {
    const img = figma.createImage(figma.base64Decode(IMAGES[key]));
    r.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
  } else r.fills = [paint('surface2')];
  return r;
}

const f1 = (n) => (Math.abs(n) < 0.05 ? '0.0' : n < 0 ? `−${Math.abs(n).toFixed(1)}` : n.toFixed(1));
const sgn = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}`;

// ---------------------------------------------------------------- components
const COMP = {};

async function buildComponents(page) {
  const board = frame('Components', { dir: 'col', gap: 48, pad: 64, fill: paint('bg') });
  page.appendChild(board);
  add(board, await text('Components', 'display/l', 'ink'));
  add(board, await text('Variant components used by every screen. Built from the colour variables and AeroAgro text styles, so a token change restyles the whole file.', 'body/m', 'ink2', { w: 760 }));

  const row = async (title) => {
    const r = frame(title, { dir: 'col', gap: 16 });
    add(r, await text(title, 'mono/label', 'muted'));
    const items = frame(`${title} · set`, { dir: 'row', gap: 24, align: 'CENTER' });
    add(r, items);
    add(board, r);
    return items;
  };

  // Button
  const btns = [];
  for (const kind of ['Primary', 'Ghost']) {
    const c = figma.createComponent();
    c.name = `Kind=${kind}`;
    c.layoutMode = 'HORIZONTAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'AUTO';
    c.itemSpacing = 8;
    c.paddingLeft = c.paddingRight = 16;
    c.paddingTop = c.paddingBottom = 10;
    c.cornerRadius = 10;
    c.counterAxisAlignItems = 'CENTER';
    c.fills = [paint(kind === 'Primary' ? 'accent' : 'surface2')];
    if (kind === 'Ghost') {
      c.strokes = [paint('line', 0.1)];
      c.strokeWeight = 1;
    }
    add(c, icon(kind === 'Primary' ? 'file' : 'spark', kind === 'Primary' ? 'accentInk' : 'ink', 16));
    const t = await text(kind === 'Primary' ? 'Agromet bulletin' : 'Ask AeroAgro', 'body/m-strong', kind === 'Primary' ? 'accentInk' : 'ink');
    t.name = 'Label';
    add(c, t);
    btns.push(c);
  }
  const btnSet = figma.combineAsVariants(btns, await row('Button'));
  btnSet.name = 'Button';
  btnSet.layoutMode = 'HORIZONTAL';
  btnSet.itemSpacing = 16;
  COMP.button = btnSet;

  // Chip
  const chips = [];
  for (const state of ['Off', 'On']) {
    const c = figma.createComponent();
    c.name = `State=${state}`;
    c.layoutMode = 'HORIZONTAL';
    c.primaryAxisSizingMode = c.counterAxisSizingMode = 'AUTO';
    c.paddingLeft = c.paddingRight = 10;
    c.paddingTop = c.paddingBottom = 6;
    c.cornerRadius = 6;
    c.fills = [paint(state === 'On' ? 'accent' : 'surface2')];
    c.strokes = [paint(state === 'On' ? 'accent' : 'line', state === 'On' ? 1 : 0.1)];
    c.strokeWeight = 1;
    const t = await text('Night low', 'body/s', state === 'On' ? 'accentInk' : 'ink2', { font: 'sansMedium' });
    t.name = 'Label';
    add(c, t);
    chips.push(c);
  }
  const chipSet = figma.combineAsVariants(chips, await row('Chip'));
  chipSet.name = 'Chip';
  chipSet.layoutMode = 'HORIZONTAL';
  chipSet.itemSpacing = 16;
  COMP.chip = chipSet;

  // Verdict tile
  const verdicts = [];
  for (const [tone, color, word, headline] of [
    ['Good', 'good', 'Go', 'Best between 08:00–10:00'],
    ['Warn', 'warn', 'Increase', '5.2 mm deficit · drip after 17:00'],
    ['Bad', 'bad', 'Stop', 'Rain within 2 h · wash-off'],
  ]) {
    const c = figma.createComponent();
    c.name = `Tone=${tone}`;
    c.layoutMode = 'VERTICAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(320, 10);
    c.itemSpacing = 10;
    c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 16;
    c.cornerRadius = 12;
    c.fills = [paint('surface2')];
    c.strokes = [paint(color, 0.35)];
    c.strokeWeight = 1;
    const head = frame('Head', { dir: 'row', gap: 8, align: 'CENTER' });
    add(head, icon('spray', 'ink2', 16));
    add(head, await text('Spraying', 'body/m-strong', 'ink'), { grow: true });
    const pill = frame('Verdict', { dir: 'row', pad: [3, 8], radius: 999, fill: paint(color, 0.16) });
    const pt = await text(word, 'body/s', color, { font: 'sansSemi' });
    pt.name = 'Verdict label';
    add(pill, pt);
    add(head, pill);
    add(c, head, { fill: true });
    const h = await text(headline, 'body/m-strong', 'ink');
    h.name = 'Headline';
    add(c, h, { fill: true });
    verdicts.push(c);
  }
  const vSet = figma.combineAsVariants(verdicts, await row('Verdict tile'));
  vSet.name = 'Verdict tile';
  vSet.layoutMode = 'HORIZONTAL';
  vSet.itemSpacing = 16;
  COMP.verdict = vSet;

  // Section head
  const sh = figma.createComponent();
  sh.name = 'Section head';
  sh.layoutMode = 'VERTICAL';
  sh.primaryAxisSizingMode = 'AUTO';
  sh.counterAxisSizingMode = 'FIXED';
  sh.resize(1000, 10);
  sh.itemSpacing = 12;
  sh.fills = [];
  const kick = frame('Kicker', { dir: 'row', gap: 12, align: 'CENTER' });
  const idx = frame('Index', { dir: 'row', pad: [2, 6], radius: 4, fill: paint('accent') });
  const it = await text('02', 'mono/label', 'accentInk', { font: 'monoBold' });
  it.name = 'Index';
  add(idx, it);
  add(kick, idx);
  const kt = await text('Downscaling engine', 'mono/label', 'ink2');
  kt.name = 'Kicker';
  add(kick, kt);
  add(kick, rect(10, 1, 'line', { opacity: 0.18, name: 'Rule' }), { grow: true });
  const mt = await text('Physics-informed · explainable', 'mono/label', 'muted');
  mt.name = 'Meta';
  add(kick, mt);
  add(sh, kick, { fill: true });
  const ht = await text('From block to panchayat, shown working', 'display/l', 'ink');
  ht.name = 'Title';
  add(sh, ht);
  add(await row('Section head'), sh);
  COMP.section = sh;

  // Readout
  const ro = figma.createComponent();
  ro.name = 'Readout';
  ro.layoutMode = 'VERTICAL';
  ro.primaryAxisSizingMode = 'AUTO';
  ro.counterAxisSizingMode = 'FIXED';
  ro.resize(200, 10);
  ro.itemSpacing = 4;
  ro.paddingLeft = ro.paddingRight = 12;
  ro.paddingTop = ro.paddingBottom = 10;
  ro.cornerRadius = 8;
  ro.fills = [];
  ro.strokes = [paint('line', 0.08)];
  ro.strokeWeight = 1;
  const rl = await text('Block forecast', 'body/s', 'muted');
  rl.name = 'Label';
  add(ro, rl);
  const rv = await text('17.2 °C', 'mono/readout', 'sun');
  rv.name = 'Value';
  add(ro, rv);
  add(await row('Readout'), ro);
  COMP.readout = ro;

  // Scale bar & north arrow
  const sb = figma.createComponent();
  sb.name = 'Scale bar';
  sb.fills = [];
  sb.resize(120, 18);
  for (let i = 0; i < 4; i++) {
    const seg = rect(30, 5, i % 2 ? '#FFFFFF' : '#000000', { opacity: i % 2 ? 0.85 : 0.6 });
    sb.appendChild(seg);
    seg.x = i * 30;
    seg.y = 0;
  }
  const sbBorder = figma.createRectangle();
  sbBorder.resize(120, 5);
  sbBorder.fills = [];
  sbBorder.strokes = [paint('#FFFFFF', 0.7)];
  sbBorder.strokeWeight = 1;
  sb.appendChild(sbBorder);
  const s0 = await text('0', 'mono/data', '#FFFFFF', { size: 9 });
  sb.appendChild(s0);
  s0.x = 0;
  s0.y = 6;
  const s1 = await text('6 km', 'mono/data', '#FFFFFF', { size: 9 });
  s1.name = 'Distance';
  sb.appendChild(s1);
  s1.x = 120 - s1.width;
  s1.y = 6;
  const na = figma.createComponent();
  na.name = 'North arrow';
  na.fills = [];
  na.resize(20, 28);
  const arrow = svg('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28"><path d="M10 2 L16 18 L10 14.5 L4 18 Z" fill="#FFFFFF" fill-opacity=".9"/><path d="M10 2 L10 14.5 L4 18 Z" fill="#000000" fill-opacity=".35"/></svg>', 'arrow');
  na.appendChild(arrow);
  const nt = await text('N', 'mono/data', '#FFFFFF', { size: 8 });
  na.appendChild(nt);
  nt.x = 7;
  nt.y = 18;
  const carto = await row('Cartographic furniture');
  add(carto, sb);
  add(carto, na);
  COMP.scale = sb;
  COMP.north = na;

  // HUD panel
  const hp = figma.createComponent();
  hp.name = 'HUD panel';
  hp.resize(360, 200);
  hp.cornerRadius = 14;
  hp.fills = [paint('surface')];
  hp.strokes = [paint('line', 0.08)];
  hp.strokeWeight = 1;
  hudCorners(hp);
  const hpl = await text('FIG 2.1 · LIVE COPERNICUS GLO-90 DEM', 'mono/label', 'muted');
  hp.appendChild(hpl);
  hpl.x = 20;
  hpl.y = 20;
  add(await row('HUD panel (corner ticks follow resizing)'), hp);
  COMP.hud = hp;

  return board;
}

// ---------------------------------------------------------------- foundations page
async function buildFoundations(page) {
  const board = frame('Foundations', { dir: 'col', gap: 56, pad: 64, fill: paint('bg'), w: 1440 });
  page.appendChild(board);
  add(board, await text('Foundations · Field Instrument', 'display/l', 'ink'));
  add(
    board,
    await text(
      'A night-time field instrument: one lime accent on green-black, serif headlines for the human story, monospace for every measured number. Every colour below is a Figma variable; every type ramp entry is a text style.',
      'body/l',
      'ink2',
      { w: 900 }
    )
  );

  // colour
  const colours = frame('Colour variables', { dir: 'col', gap: 16 });
  add(colours, await text('Colour · variables (collection “AeroAgro · Field Instrument”, mode Night)', 'mono/label', 'muted'));
  const grid = frame('Swatches', { dir: 'row', gap: 16 });
  grid.layoutWrap = 'WRAP';
  grid.counterAxisSpacing = 16;
  grid.primaryAxisSizingMode = 'FIXED';
  grid.resize(1312, 10);
  for (const [k, hex] of Object.entries(TOKENS)) {
    const sw = frame(`swatch/${k}`, { dir: 'col', gap: 0, radius: 10, clip: true, stroke: ['line', 0.1], w: 150, fill: paint('surface') });
    add(sw, rect(150, 72, k), { fill: true });
    const meta = frame('meta', { dir: 'col', gap: 2, pad: 10 });
    add(meta, await text(k, 'body/m-strong', 'ink'));
    add(meta, await text(hex, 'mono/data', 'muted'));
    add(meta, await text(TOKEN_NOTES[k], 'body/s', 'ink2', { w: 130 }));
    add(sw, meta, { fill: true });
    add(grid, sw);
  }
  add(colours, grid);
  add(board, colours, { fill: true });

  // thermal ramp
  const ramp = frame('Night thermal ramp', { dir: 'col', gap: 10 });
  add(ramp, await text('Data ramp · night minimum −3 → 17 °C (frost burns white, warm valleys glow amber)', 'mono/label', 'muted'));
  const bar = rect(900, 16, gradient([[0, '#FFFFFF'], [0.15, '#C8F2FF'], [0.25, '#76D6FF'], [0.35, '#40A4F5'], [0.45, '#426CDE'], [0.55, '#604AC4'], [0.65, '#8A40A8'], [0.75, '#B84680'], [0.85, '#E0645A'], [1, '#F6B94C']], 0), { radius: 8, name: 'ramp' });
  add(ramp, bar);
  add(board, ramp);

  // type
  const type = frame('Type ramp', { dir: 'col', gap: 18 });
  add(type, await text('Typography · text styles', 'mono/label', 'muted'));
  const samples = {
    'display/xl': 'Weather for your village',
    'display/l': 'From block to panchayat',
    'display/m': 'The week ahead in Munnar',
    'display/s': 'Why your village differs',
    'body/l': 'AeroAgro sharpens 18 km forecasts into 1.2 km microclimates.',
    'body/m': 'Spraying stops above 15 km/h wind or when rain is due within two hours.',
    'body/m-strong': 'Best between 08:00–10:00',
    'body/s': 'Crop water demand (FAO-56 reference ET) 3.4 mm/day',
    'mono/label': 'Fig 2.1 · Live Copernicus GLO-90 DEM',
    'mono/data': 'ΔT = −Γn·Δz = −6.5 K/km × 0.062 km',
    'mono/readout': '17.2 → 16.8 °C',
    'mono/figure': '10.5 °C',
  };
  for (const [name, role, size] of TEXT_STYLES) {
    const r = frame(name, { dir: 'row', gap: 24, align: 'CENTER' });
    const meta = await text(`${name}\n${FONT[role].family} ${FONT[role].style} · ${size}`, 'mono/data', 'muted', { w: 260 });
    add(r, meta);
    add(r, await text(samples[name], name, name.startsWith('mono/label') ? 'muted' : 'ink'));
    add(type, r);
  }
  add(board, type);

  // spacing & radius
  const sp = frame('Spacing', { dir: 'col', gap: 12 });
  add(sp, await text('Spacing · 4 pt base · radius 6 / 10 / 14', 'mono/label', 'muted'));
  const bars = frame('scale', { dir: 'row', gap: 20, align: 'MAX' });
  for (const n of [4, 8, 12, 16, 24, 32, 48, 64]) {
    const col = frame(`space/${n}`, { dir: 'col', gap: 6, align: 'CENTER' });
    add(col, rect(n, n, 'accent', { opacity: 0.85 }));
    add(col, await text(String(n), 'mono/data', 'muted'));
    add(bars, col);
  }
  for (const r of [6, 10, 14]) {
    const col = frame(`radius/${r}`, { dir: 'col', gap: 6, align: 'CENTER' });
    const box = rect(56, 56, 'surface2', { radius: r });
    box.strokes = [paint('accent', 0.6)];
    box.strokeWeight = 1;
    add(col, box);
    add(col, await text(`r ${r}`, 'mono/data', 'muted'));
    add(bars, col);
  }
  add(sp, bars);
  add(board, sp);
  return board;
}

// ---------------------------------------------------------------- screen pieces
function inst(set, variant) {
  const node = variant ? set.children.find((c) => c.name === variant) || set.defaultVariant : set.defaultVariant || set;
  return node.createInstance();
}

async function setLabel(instance, name, value) {
  const t = instance.findOne((n) => n.type === 'TEXT' && n.name === name);
  if (t) t.characters = value;
}

async function header(w) {
  const h = frame('Header', { dir: 'row', gap: 16, pad: [14, 32], align: 'CENTER', w, fill: paint('bg', 0.92) });
  h.strokes = [paint('line', 0.07)];
  h.strokeWeight = 1;
  h.strokeTopWeight = 0;
  h.strokeLeftWeight = 0;
  h.strokeRightWeight = 0;
  const logo = frame('Logo', { dir: 'row', gap: 10, align: 'CENTER' });
  const mark = frame('Mark', { w: 32, h: 32, radius: 9, fill: paint('accent') });
  const leaf = svg('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0C120A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 24V13.5M16 13.5c0-3.6 2.6-6 6.5-6 0 3.6-2.6 6-6.5 6zM16 16.5c0-2.8-2-4.6-5-4.6 0 2.8 2 4.6 5 4.6z"/></svg>', 'leaf');
  mark.appendChild(leaf);
  add(logo, mark);
  add(logo, await text('AeroAgro AI', 'display/s', 'ink'));
  add(h, logo);
  if (w > 600) {
    const search = frame('Search', { dir: 'row', gap: 10, pad: [10, 14], radius: 10, fill: paint('surface'), stroke: ['line', 0.1], w: 440, align: 'CENTER' });
    add(search, await text('Search village, district or crop', 'body/m', 'muted'), { grow: true });
    add(search, await text('/', 'mono/data', 'muted'));
    add(h, search);
  }
  add(h, frame('spacer', { dir: 'row' }), { grow: true });
  const live = frame('Scenario', { dir: 'row', gap: 8, pad: [9, 12], radius: 10, fill: paint('surface'), stroke: ['line', 0.1], align: 'CENTER' });
  add(live, rect(8, 8, 'good', { radius: 4 }));
  add(live, await text('Live today', 'body/m-strong', 'ink'));
  add(h, live);
  return h;
}

async function telemetry(w) {
  const t = frame('Telemetry strip', { dir: 'row', gap: 20, pad: [6, 32], align: 'CENTER', w, fill: paint('surface', 0.6), clip: true });
  const r = DATA.region;
  const dz = r.elevationM - DATA.cellElevationM;
  const items = [
    ['● LIVE', ''],
    ['NWP', 'OPEN-METEO BEST MATCH'],
    ['POS', `${r.lat.toFixed(3)}°N ${r.lng.toFixed(3)}°E`],
    ['ELEV', `${r.elevationM.toLocaleString('en-IN')} M A.S.L.`],
    ['NWP CELL', `${DATA.cellElevationM} M`],
    ['ΔZ', `${dz >= 0 ? '+' : '−'}${Math.abs(dz)} M`],
    ['DEM', 'GLO-90 · 225 × 1.2 KM'],
    ['GRID', '18 KM → 1.2 KM'],
  ];
  for (const [k, v] of items) {
    const it = frame(k, { dir: 'row', gap: 6 });
    add(it, await text(k, 'mono/label', k.startsWith('●') ? 'good' : 'muted'));
    if (v) add(it, await text(v, 'mono/label', 'ink2'));
    add(t, it);
  }
  return t;
}

async function sectionHead(index, kicker, title, meta, w) {
  const s = COMP.section.createInstance();
  s.resize(w, s.height);
  await setLabel(s, 'Index', index);
  await setLabel(s, 'Kicker', kicker);
  await setLabel(s, 'Meta', meta);
  await setLabel(s, 'Title', title);
  return s;
}

async function hudPanel(name, w, fig, title) {
  const p = frame(name, { dir: 'col', gap: 14, pad: 24, radius: 14, fill: paint('surface'), stroke: ['line', 0.08], w });
  add(p, await text(fig, 'mono/label', 'muted'));
  if (title) add(p, await text(title, 'display/m', 'ink', { w: w - 48 }));
  return p;
}

async function todayCard(w) {
  const f = DATA.fine, c = DATA.coarse, r = DATA.region;
  const card = frame('Today card', { dir: 'col', gap: 0, radius: 14, clip: true, fill: paint('surface'), stroke: ['line', 0.08], w });
  const sky = frame('Sky', { dir: 'col', gap: 10, pad: 24, fill: gradient([[0, '#20343F'], [0.85, '#11191C']], 70) });
  add(sky, await text('Today in', 'mono/label', 'muted'));
  add(sky, await text(r.name, 'display/m', 'ink', { w: w - 48 }));
  const where = frame('Place', { dir: 'row', gap: 6, align: 'CENTER' });
  // Regional script gets its own run in a font that has the glyphs
  if (r.regional && FONT.malayalam && /[ഀ-ൿ]/.test(r.regional)) add(where, await text(`${r.regional} ·`, 'body/m', 'ink2', { font: 'malayalam' }));
  add(where, await text(`${r.district}, ${r.state}`, 'body/m', 'ink2'));
  add(sky, where);
  const big = frame('Temperature', { dir: 'row', gap: 6, align: 'MAX' });
  add(big, await text(`${Math.round(f.tempMax)}°`, 'display/xl', 'ink', { size: 72 }));
  add(big, await text(`/ ${Math.round(f.tempMin)}°`, 'display/m', 'ink2'));
  add(sky, big);
  add(sky, await text(f.rainfallMm >= 2 ? 'Passing showers' : 'Pleasant', 'body/m-strong', 'ink'));
  const chips = frame('Metrics', { dir: 'row', gap: 8 });
  for (const [ic, label, v] of [
    ['rain', 'Rain', `${f.rainfallMm} mm`],
    ['wind', 'Wind', `${f.windSpeedKmh} km/h`],
    ['drop', 'Humidity', `${f.relativeHumidity}%`],
  ]) {
    const m = frame(label, { dir: 'col', gap: 2, pad: [10, 12], radius: 10, fill: paint('#000000', 0.2) });
    const l = frame('l', { dir: 'row', gap: 6, align: 'CENTER' });
    add(l, icon(ic, 'ink2', 13));
    add(l, await text(label, 'body/s', 'ink2'));
    add(m, l);
    add(m, await text(v, 'mono/readout', 'ink'));
    add(chips, m, { grow: true });
  }
  add(sky, chips, { fill: true });
  add(card, sky, { fill: true });

  const tbl = frame('Block vs village', { dir: 'col', gap: 8, pad: 24 });
  add(tbl, await text('District forecast vs your village', 'body/m-strong', 'ink'));
  const rows = [
    ['', '18 km block', '1.2 km local', 'Δ'],
    ['Night low', `${c.tempMin}°`, `${f.tempMin}°`, sgn(f.tempMin - c.tempMin)],
    ['Day high', `${c.tempMax}°`, `${f.tempMax}°`, sgn(f.tempMax - c.tempMax)],
    ['Rain', `${c.rainfallMm} mm`, `${f.rainfallMm} mm`, sgn(f.rainfallMm - c.rainfallMm)],
    ['Wind', `${c.windSpeedKmh} km/h`, `${f.windSpeedKmh} km/h`, sgn(f.windSpeedKmh - c.windSpeedKmh)],
  ];
  for (const [i, rr] of rows.entries()) {
    const line = frame(`row ${i}`, { dir: 'row', gap: 8, pad: [6, 0] });
    if (i) {
      line.strokes = [paint('line', 0.07)];
      line.strokeWeight = 1;
      line.strokeBottomWeight = line.strokeLeftWeight = line.strokeRightWeight = 0;
    }
    const widths = [0, 100, 100, 60];
    for (const [k, cell] of rr.entries()) {
      const t = await text(cell, i === 0 ? 'mono/label' : k === 0 ? 'body/m' : 'mono/data', i === 0 ? (k === 2 ? 'accent' : 'muted') : k === 2 ? 'ink' : k === 3 ? 'sky' : 'ink2', { align: k ? 'RIGHT' : 'LEFT' });
      if (k) {
        t.textAutoResize = 'HEIGHT';
        t.resize(widths[k], t.height);
      }
      add(line, t, k ? {} : { grow: true });
    }
    add(tbl, line, { fill: true });
  }
  add(card, tbl, { fill: true });
  hudCorners(card);
  return card;
}

async function dayCard(d, i, best, lo, hi, maxRain) {
  const card = frame(`Day ${i + 1} · ${d.label}`, { dir: 'col', gap: 6, pad: [14, 8], radius: 12, align: 'CENTER', w: 112, fill: paint(best ? 'accent' : 'surface2', best ? 0.06 : 0.6), stroke: [best ? 'accent' : 'line', best ? 0.7 : 0.07] });
  if (best) {
    const tag = frame('Best tag', { dir: 'row', pad: [2, 6], radius: 999, fill: paint('accent') });
    add(tag, await text('Best to spray', 'mono/label', 'accentInk', { size: 8 }));
    add(card, tag);
  }
  add(card, await text(d.label, 'body/m-strong', i === 0 ? 'accent' : 'ink'));
  add(card, await text(d.date, 'body/s', 'muted'));
  add(card, await text(`${Math.round(d.fine.tempMax)}°`, 'mono/readout', 'ink'));
  // temperature range: village gradient bar + dashed block ghost
  const track = frame('Range', { w: 40, h: 72 });
  const y = (t) => ((hi - t) / (hi - lo || 1)) * 72;
  const ghost = figma.createRectangle();
  ghost.resize(5, Math.max(2, y(d.coarse.tempMin) - y(d.coarse.tempMax)));
  ghost.x = 11;
  ghost.y = y(d.coarse.tempMax);
  ghost.cornerRadius = 3;
  ghost.fills = [];
  ghost.strokes = [paint('sun', 0.6)];
  ghost.dashPattern = [2, 2];
  ghost.strokeWeight = 1;
  track.appendChild(ghost);
  const bar = rect(8, Math.max(2, y(d.fine.tempMin) - y(d.fine.tempMax)), gradient([[0, 'sun'], [1, 'sky']], 90), { radius: 4, name: 'village range' });
  bar.x = 20;
  bar.y = y(d.fine.tempMax);
  track.appendChild(bar);
  add(card, track);
  add(card, await text(`${Math.round(d.fine.tempMin)}°`, 'mono/data', 'ink2'));
  const rain = frame('Rain bars', { w: 40, h: 36 });
  for (const [k, v, fill] of [
    [0, d.coarse.rainfallMm, 'sun'],
    [1, d.fine.rainfallMm, 'sky'],
  ]) {
    const hgt = Math.max(2, (v / maxRain) * 36);
    const r = rect(9, hgt, fill, { opacity: k ? 1 : 0.35, radius: 2 });
    r.x = 9 + k * 13;
    r.y = 36 - hgt;
    rain.appendChild(r);
  }
  add(card, rain);
  add(card, await text(`${d.fine.rainfallMm} mm`, 'mono/data', 'sky'));
  const ok = d.spray.hours > 0;
  const chip = frame('Spray', { dir: 'row', pad: [4, 6], radius: 6, justify: 'CENTER', fill: paint(ok ? (d.spray.hours >= 3 ? 'good' : 'warn') : 'bad', 0.15) });
  add(chip, await text(ok ? `${d.spray.start.slice(0, 2)}–${d.spray.end.slice(0, 2)} h` : 'Rain', 'mono/data', ok ? (d.spray.hours >= 3 ? 'good' : 'warn') : 'bad'));
  add(card, chip, { fill: true });
  return card;
}

async function weekStrip(w) {
  const panel = await hudPanel('Week forecast', w, 'Fig 1.2 · 7-day village outlook · live', `The week ahead in ${DATA.region.name}`);
  const stats = frame('Stats', { dir: 'row', gap: 8 });
  const best = DATA.bestSprayDay;
  for (const [label, value, sub] of [
    ['Week rain', `${DATA.weekRain} mm`, `block ${DATA.weekRainBlock} mm`],
    ['Rainy days', `${DATA.week.filter((d) => d.fine.rainfallMm >= 2.5).length} of 7`, '2.5 mm+ days (IMD)'],
    ['Best spray day', best >= 0 ? DATA.week[best].label : 'None', best >= 0 ? DATA.week[best].spray.label : '—'],
    ['Dry spell', DATA.dry ? `${DATA.dry[1] - DATA.dry[0] + 1} days` : 'None', DATA.dry ? '' : 'harvest under cover'],
  ]) {
    const s = frame(label, { dir: 'col', gap: 2, pad: [10, 12], radius: 10, fill: paint('surface2') });
    add(s, await text(label, 'body/s', 'muted'));
    add(s, await text(value, 'mono/readout', 'ink'));
    add(s, await text(sub, 'body/s', 'muted'));
    add(stats, s, { grow: true });
  }
  add(panel, stats, { fill: true });
  const days = frame('Days', { dir: 'row', gap: 8 });
  const lo = Math.min(...DATA.week.flatMap((d) => [d.fine.tempMin, d.coarse.tempMin]));
  const hi = Math.max(...DATA.week.flatMap((d) => [d.fine.tempMax, d.coarse.tempMax]));
  const maxRain = Math.max(5, ...DATA.week.map((d) => Math.max(d.fine.rainfallMm, d.coarse.rainfallMm)));
  for (const [i, d] of DATA.week.entries()) add(days, await dayCard(d, i, i === best, lo, hi, maxRain), { grow: true });
  add(panel, days, { fill: true });
  hudCorners(panel);
  return panel;
}

async function waterfall(w) {
  const panel = await hudPanel('Explain panel', w, 'Fig 2.2 · Explainable AI', 'Why your village differs');
  const c = DATA.coarse.tempMin, f = DATA.fine.tempMin;
  const steps = DATA.steps.tmin;
  const lead = [...steps].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];
  const note = frame('Reasoning', { dir: 'col', pad: 14, radius: 12, fill: paint('accent', 0.06), stroke: ['accent', 0.25] });
  add(note, await text(`${DATA.region.name}: ${Math.abs(f - c).toFixed(1)} °C ${f < c ? 'cooler' : 'warmer'} than the district forecast. The biggest factor is ${lead ? lead.label.toLowerCase() : 'none'} (${lead ? sgn(lead.value) : '0.0'} °C).`, 'body/m', 'ink2', { w: w - 76 }));
  add(panel, note, { fill: true });

  const rows = [{ label: 'Block forecast · 18 km', eq: 'NWP grid-cell mean', from: c, to: c, kind: 'start' }];
  let v = c;
  for (const s of steps) {
    rows.push({ label: s.label, eq: s.eq || s.why, from: v, to: v + s.value, kind: 'step' });
    v += s.value;
  }
  rows.push({ label: 'Your village · 1.2 km', eq: 'T = T₀ + ΣΔT', from: f, to: f, kind: 'end' });
  const all = rows.flatMap((r) => [r.from, r.to]);
  const pad = Math.max(0.6, (Math.max(...all) - Math.min(...all)) * 0.25);
  const lo = Math.min(...all) - pad, hi = Math.max(...all) + pad;
  const trackW = w - 48 - 200 - 70 - 24;
  const x = (n) => ((n - lo) / (hi - lo)) * trackW;
  for (const r of rows) {
    const line = frame(r.label, { dir: 'row', gap: 12, align: 'CENTER' });
    const lab = frame('label', { dir: 'col', gap: 2, w: 200 });
    add(lab, await text(r.label, r.kind === 'step' ? 'body/m' : 'body/m-strong', r.kind === 'step' ? 'ink2' : 'ink'));
    add(lab, await text(r.eq, 'mono/data', 'muted', { size: 9.5, w: 200 }));
    add(line, lab);
    const track = frame('track', { w: trackW, h: 26, radius: 6, fill: paint('surface2') });
    const isStep = r.kind === 'step';
    const a = isStep ? x(Math.min(r.from, r.to)) : 0;
    const bw = isStep ? Math.max(2, Math.abs(x(r.to) - x(r.from))) : x(r.to);
    const color = r.kind === 'start' ? 'sun' : r.kind === 'end' ? 'accent' : r.to < r.from ? 'sky' : 'sun';
    const bar = rect(bw, 18, isStep ? paint(color) : gradient([[0, color, 0.2], [1, color, 1]], 0), { radius: 4 });
    bar.x = a;
    bar.y = 4;
    track.appendChild(bar);
    add(line, track);
    add(line, await text(isStep ? sgn(r.to - r.from) : f1(r.to), 'mono/readout', r.kind === 'end' ? 'accent' : r.kind === 'start' ? 'sun' : 'ink2', { align: 'RIGHT', w: 70 }));
    add(panel, line);
  }
  const model = frame('Model', { dir: 'col', gap: 2, pad: 14, radius: 10, fill: paint('bg', 0.5), stroke: ['line', 0.08] });
  add(model, await text('Model · night low', 'mono/label', 'muted'));
  add(model, await text('T₁.₂ = T₁₈ + Σ ΔTᵢ', 'mono/data', 'ink2', { size: 12 }));
  add(model, await text(`     = ${f1(c)}${steps.map((s) => ` ${s.value < 0 ? '−' : '+'} ${Math.abs(s.value).toFixed(1)}`).join('')}`, 'mono/data', 'ink2', { size: 12 }));
  add(model, await text(`     = ${f1(f)} °C`, 'mono/readout', 'accent'));
  add(panel, model, { fill: true });
  hudCorners(panel);
  return panel;
}

async function gridPanel(w) {
  const g = DATA.grid.tempMin;
  const panel = await hudPanel('Block grid panel', w, 'Fig 2.1 · Live Copernicus GLO-90 DEM', '225 village cells inside one forecast block');
  const chips = frame('Variables', { dir: 'row', gap: 6 });
  for (const [i, label] of ['Night low', 'Day high', 'Rain', 'Wind', 'Terrain'].entries()) {
    const c = inst(COMP.chip, i === 0 ? 'State=On' : 'State=Off');
    await setLabel(c, 'Label', label);
    add(chips, c);
  }
  add(panel, chips);
  const body = frame('Body', { dir: 'row', gap: 24 });
  const map = frame('Map with references', { w: 388, h: 388 });
  const img = image('grid', 368, 368, 'DEM grid render · 15 × 15 cells');
  img.cornerRadius = 6;
  map.appendChild(img);
  img.x = 20;
  img.y = 20;
  for (let i = 0; i < 15; i++) {
    const col = await text(String.fromCharCode(65 + i), 'mono/data', 'muted', { size: 9 });
    map.appendChild(col);
    col.x = 20 + i * (368 / 15) + 368 / 30 - col.width / 2;
    col.y = 4;
    const row = await text(String(i + 1), 'mono/data', 'muted', { size: 9 });
    map.appendChild(row);
    row.x = 2;
    row.y = 20 + i * (368 / 15) + 368 / 30 - row.height / 2;
  }
  add(body, map);
  const stats = frame('Stats', { dir: 'col', gap: 8 });
  const hero = frame('Spread', { dir: 'col', gap: 4, pad: 14, radius: 10, fill: paint('surface2') });
  add(hero, await text('Hidden inside the block', 'body/s', 'muted'));
  add(hero, await text(`${(g.hi - g.lo).toFixed(1)} °C`, 'mono/figure', 'accent'));
  add(hero, await text('spread the 18 km forecast cannot see', 'body/s', 'ink2'));
  add(stats, hero, { fill: true });
  for (const [label, value, tone] of [
    ['Block forecast', `${g.coarse} °C`, 'sun'],
    ['Your village cell', `${g.village} °C`, 'accent'],
    ['Lowest', `${g.lo} °C · ${g.loElev} m`, 'ink'],
    ['Highest', `${g.hi} °C · ${g.hiElev} m`, 'ink'],
  ]) {
    const r = COMP.readout.createInstance();
    await setLabel(r, 'Label', label);
    await setLabel(r, 'Value', value);
    const vt = r.findOne((n) => n.name === 'Value');
    if (vt) vt.fills = [paint(tone)];
    add(stats, r, { fill: true });
  }
  add(body, stats, { grow: true });
  add(panel, body, { fill: true });
  hudCorners(panel);
  return panel;
}

async function pipeline(w) {
  const r = DATA.region;
  const p = frame('Pipeline', { dir: 'row', gap: 1, radius: 10, clip: true, fill: paint('line', 0.08), w });
  for (const [i, [ic, k, t, d]] of [
    ['rain', 'IN', 'NWP block forecast', `Open-Meteo · cell ${DATA.cellElevationM} m`],
    ['layers', 'TERRAIN', 'DEM + covariates', `GLO-90 · slope ${r.slopeDeg}° · D ${r.drainage}`],
    ['cpu', 'MODEL', 'Physics inference', 'Γ lapse · pooling · orographic · OI'],
    ['file', 'OUT', 'Village advisory', `${r.elevationM} m · Δx 1.2 km · 7 days`],
  ].entries()) {
    const cell = frame(k, { dir: 'row', gap: 12, pad: [12, 16], fill: paint('surface'), align: 'CENTER' });
    const ib = frame('icon', { dir: 'row', pad: 8, radius: 6, fill: paint(i === 3 ? 'accent' : 'surface2') });
    add(ib, icon(ic, i === 3 ? 'accentInk' : 'ink2', 16));
    add(cell, ib);
    const tx = frame('text', { dir: 'col', gap: 1 });
    add(tx, await text(`${String(i + 1).padStart(2, '0')} · ${k}`, 'mono/label', 'muted'));
    add(tx, await text(t, 'body/m-strong', 'ink'));
    add(tx, await text(d, 'mono/data', 'muted', { size: 10 }));
    add(cell, tx);
    add(p, cell, { grow: true });
  }
  return p;
}

async function chatPanel(w, h) {
  const panel = frame('Ask AeroAgro', { dir: 'col', gap: 0, radius: 14, clip: true, fill: paint('surface'), stroke: ['line', 0.08], w, h });
  const head = frame('Header', { dir: 'row', gap: 12, pad: [16, 20], align: 'CENTER' });
  const av = frame('Avatar', { dir: 'row', pad: 12, radius: 12, fill: paint('bg'), stroke: ['accent', 0.8, 1.5] });
  add(av, icon('spark', 'accent', 18));
  add(head, av);
  const ht = frame('Title', { dir: 'col', gap: 2 });
  add(ht, await text('Ask AeroAgro', 'display/s', 'ink'));
  add(ht, await text(`Farm assistant for ${DATA.region.name} · answers from the village forecast`, 'body/s', 'muted'));
  add(head, ht, { grow: true });
  add(panel, head, { fill: true });
  const conv = frame('Conversation', { dir: 'col', gap: 14, pad: [16, 20] });
  for (const m of DATA.chat) {
    const u = frame('User', { dir: 'row', justify: 'MAX' });
    const ub = frame('bubble', { dir: 'row', pad: [10, 14], radius: 14, fill: paint('raised') });
    const isDeva = /[ऀ-ॿ]/.test(m.q);
    add(ub, await text(m.q, 'body/m', 'ink', isDeva && FONT.deva ? { font: 'deva' } : {}));
    add(u, ub);
    add(conv, u, { fill: true });
    const a = frame('AI', { dir: 'row', gap: 10 });
    const aic = frame('ai', { dir: 'row', pad: 6, radius: 8, fill: paint('accent', 0.15) });
    add(aic, icon('spark', 'accent', 14));
    add(a, aic);
    const col = frame('answer', { dir: 'col', gap: 6 });
    const ab = frame('bubble', { dir: 'col', pad: [10, 14], radius: 14, fill: paint('surface2'), stroke: ['line', 0.08] });
    const answerDeva = /[ऀ-ॿ]/.test(m.a);
    add(ab, await text(m.a, 'body/m', 'ink2', Object.assign({ w: w - 110 }, answerDeva && FONT.deva ? { font: 'deva' } : {})));
    add(col, ab);
    const src = frame('sources', { dir: 'row', gap: 6 });
    for (const s of m.sources.slice(0, 3)) {
      const c = frame(s, { dir: 'row', pad: [2, 8], radius: 999, stroke: ['line', 0.1] });
      add(c, await text(s, 'body/s', 'muted', { size: 10 }));
      add(src, c);
    }
    if (m.action) {
      const c = frame('action', { dir: 'row', pad: [2, 10], radius: 999, fill: paint('accent', 0.15) });
      add(c, await text(`${m.action} ↗`, 'body/s', 'accent', { size: 10, font: 'sansSemi' }));
      add(src, c);
    }
    add(col, src);
    add(a, col);
    add(conv, a, { fill: true });
  }
  add(panel, conv, { fill: true, grow: true });
  const input = frame('Input', { dir: 'row', gap: 8, pad: 12, align: 'CENTER' });
  const mic = frame('Mic', { dir: 'row', pad: 12, radius: 10, fill: paint('surface2'), stroke: ['line', 0.1] });
  add(mic, icon('mic', 'ink2', 16));
  add(input, mic);
  const field = frame('Field', { dir: 'row', pad: [12, 14], radius: 10, fill: paint('bg', 0.6), stroke: ['line', 0.1] });
  add(field, await text('Ask about spraying, rain, irrigation, frost…', 'body/m', 'muted'));
  add(input, field, { grow: true });
  const send = frame('Send', { dir: 'row', pad: 12, radius: 10, fill: paint('accent') });
  add(send, icon('send', 'accentInk', 16));
  add(input, send);
  add(panel, input, { fill: true });
  hudCorners(panel);
  return panel;
}

// ---------------------------------------------------------------- screens
async function buildDesktop(page) {
  const W = 1440;
  const s = frame('Desktop · Dashboard (1440)', { dir: 'col', gap: 0, fill: paint('bg'), w: W });
  page.appendChild(s);
  add(s, await header(W), { fill: true });
  add(s, await telemetry(W), { fill: true });

  // hero
  const hero = frame('Hero', { dir: 'row', gap: 56, pad: [64, 64], align: 'CENTER' });
  const left = frame('Copy', { dir: 'col', gap: 22, w: 620 });
  const pill = frame('Live pill', { dir: 'row', gap: 8, pad: [5, 12], radius: 999, fill: paint('accent', 0.1), stroke: ['accent', 0.25], align: 'CENTER' });
  add(pill, rect(8, 8, 'accent', { radius: 4 }));
  add(pill, await text('Live microclimate forecasts for Indian farms', 'body/s', 'accent', { font: 'sansMedium' }));
  add(left, pill);
  const h1 = await text('Weather for your village, not your district.', 'display/xl', 'ink', { w: 620 });
  const cut = 'Weather for your village, '.length;
  h1.setRangeFontName(cut, h1.characters.length, FONT.displayItalic);
  h1.setRangeFills(cut, h1.characters.length, [paint('accent')]);
  add(left, h1);
  add(left, await text('AeroAgro sharpens 18 km forecasts into 1.2 km microclimates using terrain physics, then tells each farmer exactly when to spray, water and protect their crop.', 'body/l', 'ink2', { w: 600 }));
  const stats = frame('Stats', { dir: 'row', gap: 40 });
  for (const [v, l] of [
    ['303', 'districts & metros'],
    ['225×', 'finer than an 18 km grid'],
    ['3', 'languages, with voice'],
    ['₹0', 'data cost · open APIs'],
  ]) {
    const st = frame(l, { dir: 'col', gap: 2 });
    add(st, await text(v, 'mono/figure', 'ink'));
    add(st, await text(l, 'body/s', 'muted'));
    add(stats, st);
  }
  add(left, stats);
  add(hero, left);
  const fig = frame('Fig 0.1 · Resolution comparison', { dir: 'col', gap: 0, radius: 14, clip: true, fill: paint('surface'), stroke: ['line', 0.08], w: 622 });
  const cap = frame('Caption', { dir: 'col', gap: 4, pad: [16, 20] });
  add(cap, await text('Fig 0.1 · Resolution comparison', 'mono/label', 'muted'));
  add(cap, await text('Same night. Two resolutions.', 'display/s', 'ink'));
  add(fig, cap, { fill: true });
  add(fig, image('thermal', 622, 467, 'Thermal map · 18 km blocks vs 1.2 km'));
  const legend = frame('Legend', { dir: 'row', gap: 10, pad: [12, 20], align: 'CENTER' });
  add(legend, await text('−3°', 'mono/data', 'frost'));
  add(legend, rect(140, 8, gradient([[0, '#FFFFFF'], [0.25, '#76D6FF'], [0.45, '#426CDE'], [0.65, '#8A40A8'], [0.85, '#E0645A'], [1, '#F6B94C']], 0), { radius: 4 }));
  add(legend, await text('17°C', 'mono/data', 'sun'));
  add(fig, legend, { fill: true });
  hudCorners(fig);
  add(hero, fig);
  add(s, hero);

  // 01 dashboard
  const d1 = frame('01 · Live dashboard', { dir: 'col', gap: 24, pad: [48, 64] });
  add(d1, await sectionHead('01', 'Live dashboard', 'India, one village at a time', '303 regions · 1.2 km downscaled view', W - 128));
  const row1 = frame('Map + today', { dir: 'row', gap: 24 });
  const colL = frame('Left', { dir: 'col', gap: 24, w: W - 128 - 24 - 420 });
  const map = image('map', W - 128 - 24 - 420, 520, 'Live map · 303 regions');
  map.cornerRadius = 14;
  add(colL, map);
  add(colL, await weekStrip(W - 128 - 24 - 420), { fill: true });
  add(row1, colL);
  const colR = frame('Right', { dir: 'col', gap: 24, w: 420 });
  add(colR, await todayCard(420), { fill: true });
  const v1 = inst(COMP.verdict, 'Tone=Good');
  await setLabel(v1, 'Headline', DATA.spray.hours > 0 ? `Best between ${DATA.spray.label}` : 'No safe window today');
  add(colR, v1, { fill: true });
  const v2 = inst(COMP.verdict, DATA.irrigation.deficit > 5 ? 'Tone=Warn' : 'Tone=Good');
  await setLabel(v2, 'Headline', `${DATA.irrigation.action} · ET ${DATA.et0} mm/day`);
  const v2t = v2.findOne((n) => n.type === 'TEXT' && n.name === 'Verdict label');
  if (v2t) v2t.characters = DATA.irrigation.deficit > 5 ? 'Increase' : 'Normal';
  add(colR, v2, { fill: true });
  add(row1, colR);
  add(d1, row1);
  add(s, d1);

  // 02 engine
  const d2 = frame('02 · Downscaling engine', { dir: 'col', gap: 24, pad: [48, 64] });
  add(d2, await sectionHead('02', 'Downscaling engine', 'From block to panchayat, shown working', 'Physics-informed · explainable · runs in the browser', W - 128));
  add(d2, await pipeline(W - 128), { fill: true });
  const row2 = frame('Engine panels', { dir: 'row', gap: 24 });
  add(row2, await gridPanel(700));
  add(row2, await waterfall(W - 128 - 24 - 700));
  add(d2, row2);
  add(s, d2);

  // 03 assistant
  const d3 = frame('03 · Field tools & assistant', { dir: 'col', gap: 24, pad: [48, 64, 80, 64] });
  add(d3, await sectionHead('03', 'Field tools & assistant', 'Decide, verify, ask', 'Hourly spray · PMFBY · satellite · voice', W - 128));
  add(d3, await chatPanel(620, 720));
  add(s, d3);
  return s;
}

async function buildMobile(page) {
  const W = 390;
  const s = frame('Mobile · Farmer (390)', { dir: 'col', gap: 16, fill: paint('bg'), w: W, pad: [0, 0, 32, 0] });
  page.appendChild(s);
  s.x = 1600;
  add(s, await header(W), { fill: true });
  const body = frame('Body', { dir: 'col', gap: 16, pad: [0, 16] });
  add(body, await todayCard(W - 32), { fill: true });
  const v = inst(COMP.verdict, 'Tone=Good');
  await setLabel(v, 'Headline', DATA.spray.hours > 0 ? `Best between ${DATA.spray.label}` : 'No safe window today');
  add(body, v, { fill: true });
  const days = frame('Next days', { dir: 'row', gap: 8 });
  const lo = Math.min(...DATA.week.flatMap((d) => [d.fine.tempMin, d.coarse.tempMin]));
  const hi = Math.max(...DATA.week.flatMap((d) => [d.fine.tempMax, d.coarse.tempMax]));
  const maxRain = Math.max(5, ...DATA.week.map((d) => Math.max(d.fine.rainfallMm, d.coarse.rainfallMm)));
  for (const [i, d] of DATA.week.slice(0, 3).entries()) add(days, await dayCard(d, i, i === DATA.bestSprayDay, lo, hi, maxRain), { grow: true });
  add(body, days, { fill: true });
  add(body, await chatPanel(W - 32, 560), { fill: true });
  add(s, body, { fill: true });
  return s;
}

async function buildArchitecture(page) {
  const board = frame('Architecture', { w: 1440, h: 820, fill: paint('bg') });
  page.appendChild(board);
  const title = await text('System architecture · data → physics → farmer', 'display/l', 'ink');
  board.appendChild(title);
  title.x = 64;
  title.y = 56;
  const sub = await text('Everything runs client-side on free, keyless open data. Solid arrows: data flow. Numbers are live values for the snapshot region.', 'body/m', 'ink2', { w: 900 });
  board.appendChild(sub);
  sub.x = 64;
  sub.y = 116;

  const node = async (x, y, w, fig, head, lines, accent) => {
    const n = frame(head, { dir: 'col', gap: 6, pad: 16, radius: 12, fill: paint(accent ? 'accent' : 'surface', accent ? 0.08 : 1), stroke: [accent ? 'accent' : 'line', accent ? 0.6 : 0.1], w });
    add(n, await text(fig, 'mono/label', accent ? 'accent' : 'muted'));
    add(n, await text(head, 'body/m-strong', 'ink'));
    for (const l of lines) add(n, await text(l, 'mono/data', 'ink2', { size: 10.5, w: w - 32 }));
    board.appendChild(n);
    n.x = x;
    n.y = y;
    return n;
  };
  const arrow = (a, b) => {
    const x1 = a.x + a.width, y1 = a.y + a.height / 2, x2 = b.x, y2 = b.y + b.height / 2;
    const mx = (x1 + x2) / 2;
    const v = figma.createVector();
    v.vectorPaths = [{ windingRule: 'NONZERO', data: `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2 - 7} ${y2}` }];
    v.strokes = [paint('accent', 0.8)];
    v.strokeWeight = 1.5;
    v.strokeCap = 'ROUND';
    v.fills = [];
    v.name = `${a.name} → ${b.name}`;
    board.appendChild(v);
    const head = figma.createVector();
    head.vectorPaths = [{ windingRule: 'NONZERO', data: `M ${x2 - 8} ${y2 - 4.5} L ${x2} ${y2} L ${x2 - 8} ${y2 + 4.5} Z` }];
    head.fills = [paint('accent', 0.9)];
    head.strokes = [];
    head.name = 'arrowhead';
    board.appendChild(head);
  };
  const r = DATA.region;
  const nwp = await node(64, 200, 300, 'SOURCE · 01', 'Open-Meteo NWP', ['forecast API · best match', 'elevation = nan → raw grid-cell mean', `cell height ${DATA.cellElevationM} m`, 'hourly 06–19 h + 7 daily'], false);
  const dem = await node(64, 400, 300, 'SOURCE · 02', 'Copernicus GLO-90 DEM', ['Open-Meteo elevation API', '225 points · 3 × 100 batch', `relief ${DATA.grid.elevation.lo}–${DATA.grid.elevation.hi} m`], false);
  const reg = await node(64, 580, 300, 'SOURCE · 03', 'Region registry', ['303 panchayats / districts', 'elevation · slope · drainage D', 'terrain class · crops'], false);
  const eng = await node(520, 300, 380, 'MODEL', 'Physics-informed downscaler', ['ΔT = −Γ·Δz  (Γd 5.0 · Γn 6.5/4.5 K/km)', 'pooling −k·D·(1−θ/40), TPI hollows', 'rain × (1 + 0.6Δz⁺ + 0.6 sin θ)', 'OI blend: Lh = 250/σz km, Lz 150 m', `${r.name}: ${DATA.coarse.tempMin} → ${DATA.fine.tempMin} °C`], true);
  const outs = [
    ['OUT · 1', 'Dashboard + 1.2 km grid', ['map layer · explain waterfall']],
    ['OUT · 2', '7-day outlook + bulletin', ['GKMS format · SMS · QR']],
    ['OUT · 3', 'Ask AeroAgro', ['EN · हिन्दी · தமிழ் · voice']],
    ['OUT · 4', 'WhatsApp · kiosk · PMFBY', ['evidence report · SHA-256']],
  ];
  const outNodes = [];
  for (const [i, [fig, head, lines]] of outs.entries()) outNodes.push(await node(1056, 190 + i * 150, 320, fig, head, lines, false));
  for (const src of [nwp, dem, reg]) arrow(src, eng);
  for (const o of outNodes) arrow(eng, o);
  return board;
}

async function buildCover(page) {
  const c = frame('Cover', { w: 1440, h: 900, fill: paint('bg'), clip: true });
  page.appendChild(c);
  const img = image('thermal', 760, 571, 'cover art');
  img.opacity = 0.9;
  c.appendChild(img);
  img.x = 1440 - 760 + 60;
  img.y = 170;
  const fade = rect(900, 900, gradient([[0, 'bg', 1], [0.55, 'bg', 1], [1, 'bg', 0]], 0));
  c.appendChild(fade);
  fade.x = 0;
  fade.y = 0;
  const col = frame('Title block', { dir: 'col', gap: 22, w: 760 });
  c.appendChild(col);
  col.x = 96;
  col.y = 150;
  add(col, await text('AeroAgro AI · design file', 'mono/label', 'accent'));
  const h = await text('Weather for your village, not your district.', 'display/xl', 'ink', { w: 720, size: 76 });
  const cut = 'Weather for your village, '.length;
  h.setRangeFontName(cut, h.characters.length, FONT.displayItalic);
  h.setRangeFills(cut, h.characters.length, [paint('accent')]);
  add(col, h);
  add(col, await text('Field Instrument design system · MoES problem statement: downscaling weather forecasts from block to panchayat level for agro-meteorological advisories.', 'body/l', 'ink2', { w: 640 }));
  const meta = frame('Meta', { dir: 'col', gap: 4 });
  add(meta, await text(`Snapshot · ${DATA.region.name}, ${DATA.region.district} · ${DATA.snapshot.at.slice(0, 16).replace('T', ' ')} UTC`, 'mono/data', 'muted'));
  add(meta, await text(DATA.snapshot.source, 'mono/data', 'muted', { w: 700 }));
  add(meta, await text('Live site · aeroagro.vercel.app', 'mono/data', 'accent'));
  add(col, meta);
  hudCorners(c);
  return c;
}

// ---------------------------------------------------------------- run
async function run() {
  figma.notify('AeroAgro: resolving fonts…', { timeout: 1500 });
  await resolveFonts();
  await setupVariables();
  await setupTextStyles();

  const pages = {};
  for (const name of ['Cover', 'Foundations', 'Components', 'Desktop', 'Mobile', 'Architecture']) {
    const pg = figma.createPage();
    pg.name = `AeroAgro · ${name}`;
    pages[name] = pg;
  }
  const steps = [
    ['Foundations', buildFoundations],
    ['Components', buildComponents],
    ['Cover', buildCover],
    ['Desktop', buildDesktop],
    ['Mobile', buildMobile],
    ['Architecture', buildArchitecture],
  ];
  for (const [name, fn] of steps) {
    await figma.setCurrentPageAsync(pages[name]);
    figma.notify(`AeroAgro: building ${name}…`, { timeout: 1200 });
    const node = await fn(pages[name]);
    figma.viewport.scrollAndZoomIntoView([node]);
  }
  await figma.setCurrentPageAsync(pages.Cover);
  figma.viewport.scrollAndZoomIntoView(pages.Cover.children);
  figma.closePlugin('AeroAgro design system generated · 6 pages, variables, text styles and components');
}

run().catch((e) => {
  console.error(e);
  figma.closePlugin(`AeroAgro plugin error: ${e && e.message ? e.message : e}`);
});
