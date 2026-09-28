// AeroAgro AI · Figma plugin · "Monsoon Almanac" design system
// Generates the design system and product screens as native, editable Figma layers:
// a colour-variable collection with Paper and Night modes, text styles, variant components,
// auto-layout screens and native charts. Night bands simply switch variable mode.
// DATA is a live engine snapshot; IMAGES are renders of the live canvases.
// Both are injected by scripts/build_figma_plugin.mjs.

/* global DATA, IMAGES, figma */

// ---------------------------------------------------------------- tokens (two themes, one set of names)
const PAPER = {
  bg: '#F3EFE6', surface: '#FBF9F4', surface2: '#EBE6DA', raised: '#E2DCCD', line: '#141C16',
  ink: '#121814', ink2: '#3C4640', muted: '#707872', accent: '#1E6334', accentInk: '#F7F5EE', marker: '#D4F25A',
  sky: '#1D68B2', sun: '#B06808', alert: '#C43A22', frost: '#266EBE', good: '#1E803E', warn: '#A66C00', bad: '#C43030',
  btn: '#121814', btnInk: '#F3EFE6',
};
const NIGHT = {
  bg: '#0B110E', surface: '#111814', surface2: '#18201B', raised: '#1F2923', line: '#E2F0E7',
  ink: '#EEF2EC', ink2: '#B8C4BD', muted: '#808E86', accent: '#C8F169', accentInk: '#0C120A', marker: '#C8F169',
  sky: '#7DC4FF', sun: '#F6B94C', alert: '#FF7A66', frost: '#A5D8FF', good: '#2FB344', warn: '#F2B01E', bad: '#E5484D',
  btn: '#C8F169', btnInk: '#0C120A',
};
const NOTES = {
  bg: 'Page', surface: 'Card stock', surface2: 'Inset', raised: 'Pressed', line: 'Hairlines at 8–16 %', ink: 'Text',
  ink2: 'Secondary text', muted: 'Labels', accent: 'Field green / lime', accentInk: 'On accent', marker: 'Highlighter',
  sky: 'Rain, cold', sun: 'Heat, 18 km block', alert: 'Hazard', frost: 'Frost', good: 'Safe', warn: 'Caution', bad: 'Stop',
  btn: 'Primary button', btnInk: 'On button',
};

let THEME = 'paper';
const T = () => (THEME === 'night' ? NIGHT : PAPER);
const V = {};
let COLLECTION = null;
const MODES = {};
const S = {};
const FONT = {};

const hexToRgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });

function paint(key, opacity) {
  const hex = T()[key] || key;
  let p = { type: 'SOLID', color: hexToRgb(hex), opacity: opacity == null ? 1 : opacity };
  // Bind to the variable so the colour follows the frame's mode (Paper / Night)
  const bindable = V[key] && (THEME === 'paper' || MODES.night);
  if (bindable && figma.variables && figma.variables.setBoundVariableForPaint) {
    try {
      p = figma.variables.setBoundVariableForPaint(p, 'color', V[key]);
    } catch (e) {
      /* raw colour fallback */
    }
  }
  return p;
}

function gradient(stops, angle) {
  const a = ((angle || 0) * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);
  return {
    type: 'GRADIENT_LINEAR',
    gradientTransform: [
      [c, s, (1 - c - s) / 2],
      [-s, c, (1 + s - c) / 2],
    ],
    gradientStops: stops.map(([pos, hex, op]) => {
      const { r, g, b } = hexToRgb(T()[hex] || hex);
      return { position: pos, color: { r, g, b, a: op == null ? 1 : op } };
    }),
  };
}

/** Build inside a night band: raw colours switch now; bound colours switch through the frame's variable mode. */
async function night(fn) {
  const prev = THEME;
  THEME = 'night';
  try {
    return await fn();
  } finally {
    THEME = prev;
  }
}
function setNightMode(node) {
  if (COLLECTION && MODES.night && node.setExplicitVariableModeForCollection) {
    try {
      node.setExplicitVariableModeForCollection(COLLECTION, MODES.night);
    } catch (e) {
      /* raw colours already applied */
    }
  }
}

// ---------------------------------------------------------------- fonts
async function resolveFonts() {
  const all = await figma.listAvailableFontsAsync();
  const has = (family, style) => all.some((f) => f.fontName.family === family && f.fontName.style === style);
  const pick = (families, styles) => {
    for (const family of families) for (const style of styles) if (has(family, style)) return { family, style };
    return null;
  };
  const INTER = { family: 'Inter', style: 'Regular' };
  FONT.display = pick(['Instrument Serif', 'Fraunces', 'Playfair Display'], ['Regular']) || INTER;
  FONT.displayItalic = pick(['Instrument Serif', 'Fraunces', 'Playfair Display'], ['Italic']) || FONT.display;
  FONT.sans = pick(['Inter Tight', 'Inter'], ['Regular']) || INTER;
  FONT.sansMedium = pick(['Inter Tight', 'Inter'], ['Medium']) || FONT.sans;
  FONT.sansSemi = pick(['Inter Tight', 'Inter'], ['SemiBold', 'Semi Bold', 'Bold']) || FONT.sans;
  FONT.mono = pick(['JetBrains Mono', 'Roboto Mono', 'IBM Plex Mono'], ['Regular']) || INTER;
  FONT.monoBold = pick(['JetBrains Mono', 'Roboto Mono', 'IBM Plex Mono'], ['Bold', 'SemiBold', 'Medium']) || FONT.mono;
  FONT.deva = pick(['Poppins', 'Mukta', 'Hind', 'Noto Sans Devanagari'], ['Regular']);
  FONT.malayalam = pick(['Noto Sans Malayalam', 'Manjari'], ['Regular']);
  await figma.loadFontAsync(INTER);
  for (const f of Object.values(FONT).filter(Boolean)) await figma.loadFontAsync(f);
}

// ---------------------------------------------------------------- variables & text styles
async function setupVariables() {
  if (!figma.variables || !figma.variables.createVariableCollection) return;
  try {
    const name = 'AeroAgro · Monsoon Almanac';
    const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === name) || figma.variables.createVariableCollection(name);
    MODES.paper = col.modes[0].modeId;
    col.renameMode(MODES.paper, 'Paper');
    const existingNight = col.modes.find((m) => m.name === 'Night');
    try {
      MODES.night = existingNight ? existingNight.modeId : col.addMode('Night');
    } catch (e) {
      MODES.night = null; // plan without extra modes: night bands fall back to raw colours
    }
    const vars = await figma.variables.getLocalVariablesAsync('COLOR');
    for (const k of Object.keys(PAPER)) {
      const vname = `color/${k}`;
      let v = vars.find((x) => x.name === vname && x.variableCollectionId === col.id);
      if (!v) v = figma.variables.createVariable(vname, col, 'COLOR');
      v.setValueForMode(MODES.paper, Object.assign(hexToRgb(PAPER[k]), { a: 1 }));
      if (MODES.night) v.setValueForMode(MODES.night, Object.assign(hexToRgb(NIGHT[k]), { a: 1 }));
      v.description = NOTES[k] || '';
      V[k] = v;
    }
    COLLECTION = col;
  } catch (e) {
    console.warn('Variables unavailable, using raw colours', e);
  }
}

const TEXT_STYLES = [
  ['display/poster', 'display', 128, 0.9, -2.5],
  ['display/xl', 'display', 72, 0.95, -1.5],
  ['display/l', 'display', 48, 1.0, -1],
  ['display/m', 'display', 32, 1.05, -0.5],
  ['display/s', 'display', 24, 1.1, 0],
  ['body/l', 'sans', 18, 1.55, 0],
  ['body/m', 'sans', 15, 1.55, 0],
  ['body/m-strong', 'sansSemi', 15, 1.4, 0],
  ['body/s', 'sans', 12.5, 1.45, 0],
  ['mono/label', 'mono', 11, 1.4, 18],
  ['mono/data', 'mono', 11.5, 1.45, 0],
  ['mono/readout', 'monoBold', 13, 1.3, 0],
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
  if (o.shadow)
    f.effects = [
      { type: 'DROP_SHADOW', color: { r: 0.07, g: 0.09, b: 0.08, a: THEME === 'night' ? 0.6 : 0.16 }, offset: { x: 0, y: 18 }, radius: 40, spread: -22, visible: true, blendMode: 'NORMAL' },
    ];
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
  if (o.align) t.textAlignHorizontal = o.align;
  t.fills = [paint(color || 'ink', o.opacity)];
  if (o.w) {
    t.textAutoResize = 'HEIGHT';
    t.resize(o.w, t.height);
  }
  return t;
}

/** Title with an italic, accent-coloured tail: "One village. |Its own forecast." */
async function title(plain, accent, style, o) {
  const t = await text(plain + accent, style, 'ink', o);
  if (accent) {
    t.setRangeFontName(plain.length, plain.length + accent.length, FONT.displayItalic);
    t.setRangeFills(plain.length, plain.length + accent.length, [paint('accent')]);
  }
  return t;
}

function add(parent, child, o) {
  parent.appendChild(child);
  o = o || {};
  const row = parent.layoutMode === 'HORIZONTAL';
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
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  radar: '<path d="M19.1 4.9A10 10 0 1 1 12 2M12 6a6 6 0 1 0 6 6M12 12l7-7"/><circle cx="12" cy="12" r="2"/>',
  spray: '<path d="M3 3h.01M7 5h.01M11 7h.01M3 7h.01M7 9h.01M3 11h.01"/><rect x="15" y="5" width="4" height="4"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2M13 16h8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="m17 2-5 5-5-5"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  cloud: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M8 19v1M12 19v2M16 19v1"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  locate: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  map: '<path d="M9 3 3 5.5v15.5l6-2.5 6 2.5 6-2.5V3l-6 2.5zM9 3v15.5M15 5.5V21"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L2 10l8-8z"/>',
  down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
};
function icon(key, color, size) {
  const s = size || 16;
  return svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${T()[color] || color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[key]}</svg>`,
    `icon/${key}`
  );
}

function image(key, w, h, name, radius) {
  const r = figma.createRectangle();
  r.name = name || key;
  r.resize(w, h);
  if (IMAGES[key]) {
    const img = figma.createImage(figma.base64Decode(IMAGES[key]));
    r.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
  } else r.fills = [paint('surface2')];
  if (radius) r.cornerRadius = radius;
  return r;
}

function rule(w) {
  return rect(w, 1, 'line', { opacity: 0.16, name: 'rule' });
}

const f1 = (n) => (Math.abs(n) < 0.05 ? '0.0' : n < 0 ? `−${Math.abs(n).toFixed(1)}` : n.toFixed(1));
const sgn = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}`;

// ---------------------------------------------------------------- components
const COMP = {};

function componentFrame(name, o) {
  const c = figma.createComponent();
  c.name = name;
  c.fills = o && o.fill ? [o.fill] : [];
  if (o && o.dir) {
    c.layoutMode = o.dir === 'row' ? 'HORIZONTAL' : 'VERTICAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'AUTO';
    c.itemSpacing = o.gap || 0;
    const p = o.pad || 0;
    const [pt, pr, pb, pl] = Array.isArray(p) ? (p.length === 2 ? [p[0], p[1], p[0], p[1]] : p) : [p, p, p, p];
    c.paddingTop = pt;
    c.paddingRight = pr;
    c.paddingBottom = pb;
    c.paddingLeft = pl;
    c.counterAxisAlignItems = o.align || 'MIN';
    if (o.w) {
      if (o.dir === 'row') c.primaryAxisSizingMode = 'FIXED';
      else c.counterAxisSizingMode = 'FIXED';
      c.resize(o.w, 10);
    }
  }
  if (o && o.radius != null) c.cornerRadius = o.radius;
  if (o && o.stroke) {
    c.strokes = [paint(o.stroke[0], o.stroke[1])];
    c.strokeWeight = 1;
  }
  return c;
}

async function buildComponents(page) {
  const board = frame('Components', { dir: 'col', gap: 56, pad: 80, fill: paint('bg'), w: 1440 });
  page.appendChild(board);
  add(board, await text('C / COMPONENTS', 'mono/label', 'muted'));
  add(board, await title('Parts that ', 'build every page.', 'display/xl', { w: 1100 }));
  add(board, await text('Variant components bound to the colour variables and AeroAgro text styles. Switch a frame to the Night mode and every instance follows.', 'body/l', 'ink2', { w: 760 }));

  const row = async (label) => {
    const r = frame(label, { dir: 'col', gap: 18 });
    add(r, rule(1280));
    add(r, await text(label, 'mono/label', 'muted'));
    const items = frame(`${label} · set`, { dir: 'row', gap: 24, align: 'CENTER' });
    add(r, items);
    add(board, r);
    return items;
  };

  // Button · Kind
  const btns = [];
  for (const kind of ['Primary', 'Ghost']) {
    const c = componentFrame(`Kind=${kind}`, { dir: 'row', gap: 10, pad: [14, 24], align: 'CENTER', radius: 8, fill: kind === 'Primary' ? paint('btn') : undefined, stroke: kind === 'Ghost' ? ['line', 0.16] : null });
    add(c, icon(kind === 'Primary' ? 'locate' : 'file', kind === 'Primary' ? 'btnInk' : 'ink', 18));
    const t = await text(kind === 'Primary' ? 'Use my location' : 'Agromet bulletin', 'body/m-strong', kind === 'Primary' ? 'btnInk' : 'ink');
    t.name = 'Label';
    add(c, t);
    btns.push(c);
  }
  COMP.button = figma.combineAsVariants(btns, await row('Button · Kind'));
  COMP.button.name = 'Button';
  COMP.button.layoutMode = 'HORIZONTAL';
  COMP.button.itemSpacing = 16;

  // Chip · State
  const chips = [];
  for (const state of ['Off', 'On']) {
    const c = componentFrame(`State=${state}`, { dir: 'row', pad: [7, 14], radius: 8, fill: state === 'On' ? paint('btn') : undefined, stroke: state === 'Off' ? ['line', 0.14] : null });
    const t = await text('Munnar', 'body/s', state === 'On' ? 'btnInk' : 'ink2', { font: 'sansMedium' });
    t.name = 'Label';
    add(c, t);
    chips.push(c);
  }
  COMP.chip = figma.combineAsVariants(chips, await row('Chip · State'));
  COMP.chip.name = 'Chip';
  COMP.chip.layoutMode = 'HORIZONTAL';
  COMP.chip.itemSpacing = 16;

  // Verdict tile · Tone
  const tiles = [];
  for (const [tone, color, word, head] of [
    ['Good', 'good', 'Go', '08:00–10:00'],
    ['Warn', 'warn', 'Short window', '10:00–12:00'],
    ['Bad', 'bad', 'Hold off', 'No safe window'],
  ]) {
    const c = componentFrame(`Tone=${tone}`, { dir: 'col', gap: 12, pad: 20, radius: 18, w: 360, fill: paint('bg', 0.5), stroke: ['line', 0.1] });
    const h = frame('Head', { dir: 'row', gap: 8, align: 'CENTER' });
    add(h, icon('spray', 'ink2', 16));
    add(h, await text('Spraying', 'body/m', 'ink2'), { grow: true });
    const pill = frame('Verdict', { dir: 'row', pad: [4, 10], radius: 8, fill: paint(color, 0.15) });
    const pt = await text(word, 'body/s', color, { font: 'sansSemi' });
    pt.name = 'Verdict label';
    add(pill, pt);
    add(h, pill);
    add(c, h, { fill: true });
    const ht = await text(head, 'display/m', 'ink');
    ht.name = 'Headline';
    add(c, ht);
    tiles.push(c);
  }
  COMP.verdict = figma.combineAsVariants(tiles, await row('Verdict tile · Tone'));
  COMP.verdict.name = 'Verdict tile';
  COMP.verdict.layoutMode = 'HORIZONTAL';
  COMP.verdict.itemSpacing = 16;

  // Section head
  const sh = componentFrame('Section head', { dir: 'col', gap: 18, w: 1280 });
  add(sh, rule(1280), { fill: true });
  const body = frame('Body', { dir: 'row', gap: 40, align: 'MAX' });
  const left = frame('Left', { dir: 'col', gap: 16 });
  const k = await text('01 / YOUR VILLAGE, TODAY', 'mono/label', 'muted');
  k.name = 'Kicker';
  add(left, k);
  const tt = await title('One village. ', 'Its own forecast.', 'display/xl');
  tt.name = 'Title';
  add(left, tt);
  add(body, left, { grow: true });
  const meta = await text('Pick any of 303 regions. Everything is re-computed for that exact place.', 'body/m', 'ink2', { w: 360 });
  meta.name = 'Meta';
  add(body, meta);
  add(sh, body, { fill: true });
  add(await row('Section head'), sh);
  COMP.section = sh;

  // Card
  const card = componentFrame('Card', { dir: 'col', gap: 12, pad: 28, w: 420, radius: 20, fill: paint('surface'), stroke: ['line', 0.08] });
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0.07, g: 0.09, b: 0.08, a: 0.16 }, offset: { x: 0, y: 18 }, radius: 40, spread: -22, visible: true, blendMode: 'NORMAL' }];
  add(card, await text('PRINT', 'mono/label', 'muted'));
  add(card, await text('Agromet bulletin', 'display/m', 'ink'));
  add(card, await text('Five-day GKMS-format advisory with SMS text and QR.', 'body/m', 'ink2', { w: 364 }));
  add(await row('Card'), card);
  COMP.card = card;

  // Night-mode specimen of the same components
  await night(async () => {
    const nb = frame('Night mode specimen', { dir: 'row', gap: 24, pad: 32, radius: 20, fill: paint('bg'), align: 'CENTER' });
    setNightMode(nb);
    add(nb, COMP.button.children.find((c) => c.name === 'Kind=Primary').createInstance());
    add(nb, COMP.chip.children.find((c) => c.name === 'State=On').createInstance());
    add(nb, COMP.verdict.children.find((c) => c.name === 'Tone=Good').createInstance());
    add(nb, await text('Same components, Night mode →', 'mono/label', 'muted'));
    add(await row('Variable mode · Night'), nb);
  });
  return board;
}

// ---------------------------------------------------------------- foundations
async function buildFoundations(page) {
  const board = frame('Foundations', { dir: 'col', gap: 64, pad: 80, fill: paint('bg'), w: 1440 });
  page.appendChild(board);
  add(board, await text('F / FOUNDATIONS · MONSOON ALMANAC', 'mono/label', 'muted'));
  add(board, await title('An almanac for people, ', 'an instrument for data.', 'display/xl', { w: 1200 }));
  add(
    board,
    await text(
      'Paper sections carry the human story: big serif, calm type, one highlighter. Night bands carry the instruments: maps, the engine, field tools. Both are the same variables in two modes.',
      'body/l',
      'ink2',
      { w: 820 }
    )
  );

  // colour: paper / night pairs
  const cw = frame('Colour', { dir: 'col', gap: 18 });
  add(cw, rule(1280));
  add(cw, await text('Colour · variables in two modes (Paper / Night)', 'mono/label', 'muted'));
  const grid = frame('Swatches', { dir: 'row', gap: 16 });
  grid.layoutWrap = 'WRAP';
  grid.counterAxisSpacing = 16;
  grid.primaryAxisSizingMode = 'FIXED';
  grid.resize(1280, 10);
  for (const k of Object.keys(PAPER)) {
    const sw = frame(`swatch/${k}`, { dir: 'col', radius: 14, clip: true, w: 148, fill: paint('surface'), stroke: ['line', 0.1] });
    const pair = frame('pair', { dir: 'row', h: 64, w: 148 });
    add(pair, rect(74, 64, PAPER[k]), { grow: true });
    add(pair, rect(74, 64, NIGHT[k]), { grow: true });
    add(sw, pair, { fill: true });
    const meta = frame('meta', { dir: 'col', gap: 2, pad: 10 });
    add(meta, await text(k, 'body/m-strong', 'ink'));
    add(meta, await text(`${PAPER[k]} · ${NIGHT[k]}`, 'mono/data', 'muted', { size: 9.5 }));
    add(meta, await text(NOTES[k], 'body/s', 'ink2', { w: 128 }));
    add(sw, meta, { fill: true });
    add(grid, sw);
  }
  add(cw, grid);
  add(board, cw);

  // thermal ramp
  const rp = frame('Thermal ramp', { dir: 'col', gap: 12 });
  add(rp, rule(1280));
  add(rp, await text('Data ramp · night minimum −3 → 17 °C: frost burns white, warm valleys glow amber', 'mono/label', 'muted'));
  add(
    rp,
    rect(900, 18, gradient([[0, '#FFFFFF'], [0.15, '#C8F2FF'], [0.25, '#76D6FF'], [0.35, '#40A4F5'], [0.45, '#2670C8'], [0.55, '#1C6080'], [0.65, '#287868'], [0.75, '#969646'], [0.85, '#D6843A'], [1, '#F6B94C']], 0), { radius: 9 })
  );
  add(board, rp);

  // type
  const ty = frame('Type', { dir: 'col', gap: 22 });
  add(ty, rule(1280));
  add(ty, await text('Typography · Instrument Serif / Inter Tight / JetBrains Mono', 'mono/label', 'muted'));
  const samples = {
    'display/poster': 'Village weather at 1.2 km',
    'display/xl': 'One village. Its own forecast.',
    'display/l': 'What to do today',
    'display/m': '08:00–10:00',
    'display/s': 'Why your village differs',
    'body/l': 'AeroAgro recalculates the district forecast for 1.2 km cells.',
    'body/m': 'Spraying stops above 15 km/h wind or when rain is due within two hours.',
    'body/m-strong': 'District forecast 18 km → your village 1.2 km',
    'body/s': 'Crop water demand (FAO-56 reference ET) 2.7 mm/day',
    'mono/label': '03 / The downscaling engine',
    'mono/data': 'ΔT = −Γn·Δz = −6.5 K/km × 0.062 km',
    'mono/readout': '17.2 → 16.8 °C',
  };
  for (const [name, role, size] of TEXT_STYLES) {
    const r = frame(name, { dir: 'row', gap: 28, align: 'CENTER' });
    add(r, await text(`${name}\n${FONT[role].family} ${FONT[role].style} · ${size}`, 'mono/data', 'muted', { w: 250 }));
    add(r, await text(samples[name], name, 'ink'));
    add(ty, r);
  }
  add(board, ty);

  // space & shape
  const sp = frame('Space', { dir: 'col', gap: 14 });
  add(sp, rule(1280));
  add(sp, await text('Space · 4 pt base · shape: card 20, pill 999, figure 22', 'mono/label', 'muted'));
  const bars = frame('scale', { dir: 'row', gap: 22, align: 'MAX' });
  for (const n of [4, 8, 12, 16, 24, 32, 48, 64, 96]) {
    const col = frame(`space/${n}`, { dir: 'col', gap: 6, align: 'CENTER' });
    add(col, rect(n, n, 'accent', { opacity: 0.85 }));
    add(col, await text(String(n), 'mono/data', 'muted'));
    add(bars, col);
  }
  for (const [r, label] of [
    [20, 'card'],
    [999, 'pill'],
    [22, 'figure'],
  ]) {
    const col = frame(`radius/${label}`, { dir: 'col', gap: 6, align: 'CENTER' });
    const box = rect(label === 'pill' ? 96 : 64, label === 'pill' ? 40 : 64, 'surface', { radius: r });
    box.strokes = [paint('line', 0.2)];
    box.strokeWeight = 1;
    add(col, box);
    add(col, await text(label, 'mono/data', 'muted'));
    add(bars, col);
  }
  add(sp, bars);
  add(board, sp);
  return board;
}

// ---------------------------------------------------------------- screen sections
function inst(set, variant) {
  const node = variant ? set.children.find((c) => c.name === variant) || set.defaultVariant : set.defaultVariant || set;
  return node.createInstance();
}
async function setLabel(node, name, value) {
  const t = node.findOne((n) => n.type === 'TEXT' && n.name === name);
  if (t) t.characters = value;
  return t;
}

async function sectionHead(kicker, plain, accent, meta, w) {
  const s = COMP.section.createInstance();
  s.resize(w, s.height);
  await setLabel(s, 'Kicker', kicker);
  await setLabel(s, 'Meta', meta);
  const t = await setLabel(s, 'Title', plain + accent);
  if (t) {
    t.setRangeFontName(0, plain.length, FONT.display);
    t.setRangeFills(0, plain.length, [paint('ink')]);
    t.setRangeFontName(plain.length, plain.length + accent.length, FONT.displayItalic);
    t.setRangeFills(plain.length, plain.length + accent.length, [paint('accent')]);
  }
  return s;
}

async function ticker(w) {
  return night(async () => {
    const t = frame('Live ticker', { dir: 'row', gap: 28, pad: [9, 32], align: 'CENTER', w, fill: paint('bg'), clip: true });
    setNightMode(t);
    const r = DATA.region;
    const dz = r.elevationM - DATA.cellElevationM;
    add(t, await text('● LIVE', 'mono/label', 'good'));
    for (const [k, v] of [
      ['NWP', 'OPEN-METEO BEST MATCH'],
      ['POSITION', `${r.lat.toFixed(3)}°N ${r.lng.toFixed(3)}°E`],
      ['ELEVATION', `${r.elevationM.toLocaleString('en-IN')} M A.S.L.`],
      ['NWP CELL', `${DATA.cellElevationM} M`],
      ['ΔZ', `${dz >= 0 ? '+' : '−'}${Math.abs(dz)} M`],
      ['DEM', 'COPERNICUS GLO-90 · 225 CELLS'],
      ['GRID', '18 KM → 1.2 KM'],
    ]) {
      const it = frame(k, { dir: 'row', gap: 6 });
      add(it, await text(k, 'mono/label', 'muted'));
      add(it, await text(v, 'mono/label', 'ink2'));
      add(t, it);
    }
    return t;
  });
}

async function nav(w, compact) {
  const n = frame('Navigation', { dir: 'row', gap: 32, pad: compact ? [14, 20] : [18, 64], align: 'CENTER', w, fill: paint('bg', 0.92) });
  const logo = frame('Logo', { dir: 'row', gap: 10, align: 'CENTER' });
  const mark = frame('Mark', { w: 34, h: 34, radius: 10, fill: paint('accent') });
  mark.appendChild(
    svg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="${PAPER.accentInk}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 24V13.5M16 13.5c0-3.6 2.6-6 6.5-6 0 3.6-2.6 6-6.5 6zM16 16.5c0-2.8-2-4.6-5-4.6 0 2.8 2 4.6 5 4.6z"/></svg>`,
      'leaf'
    )
  );
  add(logo, mark);
  add(logo, await title('AeroAgro ', 'AI', 'display/s'));
  add(n, logo);
  if (!compact) {
    const links = frame('Links', { dir: 'row', gap: 28 });
    for (const l of ['Village', 'All India', 'Engine', 'Ask', 'Tools']) add(links, await text(l, 'body/m', 'ink2'));
    add(n, links);
  }
  add(n, frame('spacer', { dir: 'row' }), { grow: true });
  const live = frame('Scenario', { dir: 'row', gap: 8, pad: [10, 16], radius: 8, fill: paint('surface'), stroke: ['line', 0.14], align: 'CENTER' });
  add(live, rect(8, 8, 'good', { radius: 4 }));
  add(live, await text('Live today', 'body/m-strong', 'ink'));
  add(n, live);
  return n;
}

async function heroPoster(w, compact) {
  const pad = compact ? 20 : 64;
  const h = frame('Hero · poster', { dir: 'col', gap: compact ? 24 : 40, pad: [compact ? 40 : 88, pad, compact ? 48 : 96, pad], w, fill: paint('bg') });
  const top = frame('Kicker row', { dir: 'row', gap: 12, align: 'CENTER' });
  add(top, await text('MOES · BLOCK → PANCHAYAT DOWNSCALING', 'mono/label', 'muted'), { grow: true });
  if (!compact) add(top, await text('● LIVE FOR 303 REGIONS', 'mono/label', 'good'));
  add(h, top, { fill: true });
  const size = compact ? 48 : 112;
  add(h, await text('Village weather at 1.2 km.', 'display/poster', 'ink', { size, w: w - 2 * pad }));
  const line2 = frame('Line 2 · highlighter', {
    dir: 'row',
    pad: [0, 8],
    fill: gradient([[0, '#FFFFFF', 0], [0.58, '#FFFFFF', 0], [0.58, PAPER.marker, 0.9], [0.9, PAPER.marker, 0.9], [0.9, '#FFFFFF', 0]], 90),
  });
  add(line2, await text('District forecasts stop at 18 km.', 'display/poster', 'ink', { font: 'displayItalic', size }));
  add(h, line2);
  const row = frame('Standfirst + search', { dir: compact ? 'col' : 'row', gap: compact ? 20 : 64, align: compact ? 'MIN' : 'MAX' });
  add(row, await text('AeroAgro recalculates the district forecast for 1.2 km cells using elevation data. For today it gives each village a spray window, an irrigation call and a crop-disease check.', 'body/l', 'ink2', { w: compact ? w - 40 : 520 }));
  const s = frame('Search group', { dir: 'col', gap: 14 });
  const bar = frame('Search bar', { dir: 'row', gap: 12 });
  const field = frame('Search field', { dir: 'row', gap: 10, pad: [16, 18], radius: 8, fill: paint('surface'), stroke: ['line', 0.14], align: 'CENTER', w: compact ? w - 40 : 400 });
  add(field, icon('search', 'muted', 18));
  add(field, await text('Find your village, district or crop', 'body/m', 'muted'));
  add(bar, field);
  if (!compact) add(bar, inst(COMP.button, 'Kind=Primary'));
  add(s, bar);
  const chips = frame('Examples', { dir: 'row', gap: 8, align: 'CENTER' });
  add(chips, await text('TRY', 'mono/label', 'muted'));
  for (const c of compact ? ['Ooty', 'Munnar', 'Jaisalmer'] : ['Ooty', 'Munnar', 'Kotgarh apples', 'Jaisalmer', 'Cauvery delta']) {
    const i = inst(COMP.chip, 'State=Off');
    await setLabel(i, 'Label', c);
    add(chips, i);
  }
  add(s, chips);
  add(row, s);
  add(h, row);
  add(h, await todayGlance(w - 2 * pad, compact), { fill: true });
  return h;
}

/** Hero "today" strip: place + temperature, then rain and the three farm verdicts. Mirrors TodayGlance.tsx. */
async function todayGlance(w, compact) {
  const f = DATA.fine, r = DATA.region;
  const tone = (t) => (t === 'good' ? ['good', 'Go'] : t === 'warn' ? ['warn', 'Short window'] : ['bad', 'Hold off']);
  const spray = tone(DATA.spray.hours >= 3 ? 'good' : DATA.spray.hours > 0 ? 'warn' : 'bad');
  const water = [DATA.irrigation.action === 'Increase irrigation' ? 'warn' : 'good', DATA.irrigation.action.replace(' irrigation', '').replace(' today', '')];
  const crop = DATA.pest.level === 'high' ? ['bad', 'High risk'] : DATA.pest.level === 'moderate' ? ['warn', 'Watch'] : ['good', 'Low risk'];

  // 1px gaps over a hairline fill draw the dividers, as in the web build
  const g = frame('Today glance', { dir: compact ? 'col' : 'row', gap: 1, radius: 20, fill: paint('line', 0.08), stroke: ['line', 0.08], w, clip: true, shadow: true });
  const cellW = compact ? (w - 1) / 2 : (w - 5 - 150 - 330) / 4;

  const place = frame('Place', { dir: 'row', gap: 16, pad: [18, 22], align: 'CENTER', fill: paint('surface'), w: compact ? w : 330 });
  const pl = frame('Name', { dir: 'col', gap: 4 });
  add(pl, await text('● LIVE TODAY', 'mono/label', 'good'));
  add(pl, await text(r.name, 'display/s', 'ink', { w: compact ? w - 150 : 190 }));
  add(pl, await text(`${r.district}, ${r.state}`, 'body/s', 'muted'));
  add(place, pl, { grow: true });
  const tp = frame('Temperature', { dir: 'col', gap: 2, align: 'MAX' });
  add(tp, await text(`${Math.round(f.tempMax)}°`, 'display/l', 'ink'));
  add(tp, await text(`night ${Math.round(f.tempMin)}°`, 'body/s', 'muted'));
  add(place, tp);
  add(g, place, compact ? { fill: true } : undefined);

  const cell = async (ico, label, body, verdict) => {
    const c = frame(label, { dir: 'col', gap: 8, pad: [18, 22], fill: paint('surface'), w: cellW });
    const k = frame('Label', { dir: 'row', gap: 6, align: 'CENTER' });
    add(k, icon(ico, 'muted', 14));
    add(k, await text(label.toUpperCase(), 'mono/label', 'muted'));
    add(c, k);
    if (verdict) {
      const pill = frame('Verdict', { dir: 'row', pad: [4, 10], radius: 8, fill: paint(verdict[0], 0.15) });
      add(pill, await text(verdict[1], 'body/s', verdict[0], { font: 'sansSemi' }));
      add(c, pill);
    }
    add(c, await text(body, verdict ? 'body/s' : 'display/s', verdict ? 'ink2' : 'ink', { w: cellW - 44 }));
    return c;
  };
  const cells = [
    await cell('rain', 'Rain', `${f.rainfallMm} mm`),
    await cell('spray', 'Spray', DATA.spray.hours ? DATA.spray.label : 'No safe window', spray),
    await cell('drop', 'Water', DATA.irrigation.deficit > 0 ? `${DATA.irrigation.deficit} mm deficit` : 'Rain covers demand', water),
    await cell('shield', (r.crops && r.crops[0]) || 'Crop health', DATA.pest.title.replace(/\s*\(.*\)$/, ''), crop),
  ];
  if (compact) {
    for (const pair of [cells.slice(0, 2), cells.slice(2)]) {
      const rw = frame('Row', { dir: 'row', gap: 1 });
      pair.forEach((c) => add(rw, c, { fillV: true }));
      add(g, rw, { fill: true });
    }
  } else cells.forEach((c) => add(g, c, { fillV: true }));

  const cta = frame('Full forecast', { dir: compact ? 'row' : 'col', gap: 8, pad: [18, 22], justify: 'CENTER', align: 'CENTER', fill: paint('btn'), w: compact ? w : 150 });
  add(cta, await text('Full forecast', 'body/m-strong', 'btnInk'));
  add(cta, icon('down', 'btnInk', 16));
  add(g, cta, compact ? { fill: true } : { fillV: true });
  return g;
}

/** Thumb-reach section tabs for phones. Mirrors SectionNav.tsx; "Today" shown as the current section. */
async function tabBar(w) {
  const bar = frame('Tab bar · mobile', { dir: 'row', pad: [8, 8, 22, 8], w, fill: paint('bg', 0.94) });
  bar.strokes = [paint('line', 0.1)];
  bar.strokeWeight = 1;
  bar.strokeRightWeight = bar.strokeBottomWeight = bar.strokeLeftWeight = 0;
  for (const [ico, label, on] of [['home', 'Today', true], ['map', 'Map'], ['cpu', 'Engine'], ['spark', 'Ask'], ['wrench', 'Tools']]) {
    const t = frame(label, { dir: 'col', gap: 4, align: 'CENTER' });
    const pill = frame('Icon', { dir: 'row', justify: 'CENTER', align: 'CENTER', w: 48, h: 28, radius: 8, fill: on ? paint('btn') : undefined });
    add(pill, icon(ico, on ? 'btnInk' : 'muted', 18));
    add(t, pill);
    add(t, await text(label, 'body/s', on ? 'ink' : 'muted', { size: 11 }));
    add(bar, t, { grow: true });
  }
  return bar;
}

async function figureBand(w, compact) {
  return night(async () => {
    const pad = compact ? 20 : 64;
    const b = frame('Figure band · night', { dir: 'col', gap: 22, pad: [compact ? 48 : 96, pad], w, fill: paint('bg') });
    setNightMode(b);
    const cap = frame('Caption', { dir: 'row', gap: 20, align: 'MAX' });
    const cl = frame('Caption left', { dir: 'col', gap: 8 });
    add(cl, await text('FIG. 1 · WORKED EXAMPLE: NIGHT MINIMUM, SIX DISTRICT BLOCKS', 'mono/label', 'muted'));
    add(cl, await title('The same night, ', 'at two resolutions.', compact ? 'display/s' : 'display/m'));
    add(cap, cl, { grow: true });
    if (!compact) {
      const leg = frame('Legend', { dir: 'row', gap: 10, align: 'CENTER' });
      add(leg, await text('−3°', 'mono/data', 'frost'));
      add(leg, rect(160, 8, gradient([[0, '#FFFFFF'], [0.25, '#76D6FF'], [0.45, '#2670C8'], [0.65, '#287868'], [0.85, '#D6843A'], [1, '#F6B94C']], 0), { radius: 4 }));
      add(leg, await text('17°C', 'mono/data', 'sun'));
      add(cap, leg);
    }
    add(b, cap, { fill: true });
    const iw = w - 2 * pad;
    add(b, image('thermal', iw, iw / 2, 'Fig 1 · 18 km blocks vs 1.2 km thermal field', 22));
    if (!compact) {
      add(b, rule(iw));
      const facts = frame('Facts', { dir: 'row', gap: 40 });
      for (const [big, k, v, color] of [
        ['18 km', 'What the district forecast sees', 'One number for 324 km²: no frost warning.', 'sun'],
        ['1.2 km', 'What AeroAgro sees', 'Lapse rate and cold-air pooling worked out for 225 cells per block.', 'accent'],
        ['−1.0 °C', 'What the farmer needed to know', 'Frost cells in hollows the district number averages away.', 'frost'],
      ]) {
        const c = frame(k, { dir: 'col', gap: 6, w: (iw - 80) / 3 });
        add(c, await text(big, 'display/l', color));
        add(c, await text(k, 'body/m-strong', 'ink'));
        add(c, await text(v, 'body/m', 'ink2', { w: (iw - 80) / 3 }));
        add(facts, c);
      }
      add(b, facts);
    }
    return b;
  });
}

async function statsRow(w) {
  const r = frame('Numbers', { dir: 'row', gap: 0, pad: [48, 64], w, fill: paint('bg') });
  r.strokes = [paint('line', 0.14)];
  r.strokeWeight = 1;
  r.strokeTopWeight = 0;
  r.strokeLeftWeight = 0;
  r.strokeRightWeight = 0;
  for (const [i, [v, k, d]] of [
    ['303', 'REGIONS', 'districts, metros and hill panchayats'],
    ['15×', 'FINER GRID', '18 km blocks split into 1.2 km cells'],
    ['3', 'LANGUAGES', 'English, Hindi and Tamil, read aloud'],
    ['0', 'API KEYS', 'open data from Open-Meteo and Copernicus'],
  ].entries()) {
    const c = frame(k, { dir: 'col', gap: 8, pad: [0, i ? 32 : 0, 0, i ? 32 : 0] });
    if (i) {
      c.strokes = [paint('line', 0.14)];
      c.strokeWeight = 1;
      c.strokeTopWeight = c.strokeRightWeight = c.strokeBottomWeight = 0;
    }
    add(c, await text(v, 'display/xl', 'ink', { font: undefined, size: undefined }));
    add(c, await text(k, 'mono/label', 'ink'));
    add(c, await text(d, 'body/s', 'muted', { w: 240 }));
    add(r, c, { grow: true });
  }
  return r;
}

async function villageSheet(w) {
  const f = DATA.fine, c = DATA.coarse, r = DATA.region;
  const card = frame('Village sheet', { dir: 'col', gap: 0, pad: 40, radius: 20, fill: paint('surface'), stroke: ['line', 0.08], w, shadow: true });
  const top = frame('Top', { dir: 'row', align: 'CENTER' });
  add(top, await text('MONDAY, 28 SEPTEMBER', 'mono/label', 'muted'), { grow: true });
  const pill = frame('Live', { dir: 'row', gap: 6, pad: [4, 10], radius: 8, stroke: ['line', 0.14], align: 'CENTER' });
  add(pill, rect(6, 6, 'good', { radius: 3 }));
  add(pill, await text('LIVE', 'mono/label', 'ink2'));
  add(top, pill);
  add(card, top, { fill: true });
  const name = await text(r.name, 'display/xl', 'ink', { size: 60, w: w - 80 });
  name.name = 'Village name';
  add(card, frame('gap', { h: 14, w: 1 }));
  add(card, name);
  const where = frame('Where', { dir: 'row', gap: 6, align: 'CENTER', pad: [10, 0, 2, 0] });
  if (r.regional && FONT.malayalam && /[ഀ-ൿ]/.test(r.regional)) add(where, await text(`${r.regional} ·`, 'body/m', 'ink2', { font: 'malayalam' }));
  add(where, await text(`${r.district}, ${r.state}`, 'body/m', 'ink2'));
  add(card, where);
  add(card, await text(`${r.lat.toFixed(3)}°N ${r.lng.toFixed(3)}°E · ${r.elevationM.toLocaleString('en-IN')} m a.s.l. · ${r.terrain}`, 'mono/data', 'muted', { w: w - 80 }));

  const big = frame('Numbers', { dir: 'row', gap: 22, align: 'MAX', pad: [28, 0, 0, 0] });
  add(big, await text(`${Math.round(f.tempMax)}°`, 'display/poster', 'ink', { size: 176 }));
  const low = frame('Low', { dir: 'col', gap: 6, pad: [0, 0, 18, 0] });
  add(low, await text(`${Math.round(f.tempMin)}°`, 'display/l', 'muted'));
  add(low, await text('NIGHT LOW', 'mono/label', 'muted'));
  add(big, low);
  add(big, frame('spacer', { dir: 'row' }), { grow: true });
  const cond = frame('Condition', { dir: 'col', gap: 6, align: 'MAX', pad: [0, 0, 18, 0] });
  add(cond, icon('cloud', 'ink', 44));
  add(cond, await text(f.rainfallMm >= 2 ? 'Passing showers' : 'Pleasant', 'body/m-strong', 'ink'));
  add(cond, await text(`Light rain, about ${f.rainfallMm} mm`, 'body/s', 'ink2'));
  add(big, cond);
  add(card, big, { fill: true });

  const m = frame('Metrics', { dir: 'row', pad: [0, 0] });
  m.strokes = [paint('line', 0.14)];
  m.strokeWeight = 1;
  m.strokeLeftWeight = m.strokeRightWeight = 0;
  for (const [i, [k, v, u]] of [
    ['RAIN', f.rainfallMm, 'mm'],
    ['WIND', f.windSpeedKmh, 'km/h'],
    ['HUMIDITY', f.relativeHumidity, '%'],
  ].entries()) {
    const cell = frame(k, { dir: 'col', gap: 4, pad: [16, 16, 16, i ? 16 : 0] });
    if (i) {
      cell.strokes = [paint('line', 0.14)];
      cell.strokeWeight = 1;
      cell.strokeTopWeight = cell.strokeRightWeight = cell.strokeBottomWeight = 0;
    }
    add(cell, await text(k, 'mono/label', 'muted'));
    const val = frame('value', { dir: 'row', gap: 4, align: 'MAX' });
    add(val, await text(String(v), 'display/m', 'ink'));
    add(val, await text(u, 'body/s', 'muted'));
    add(cell, val);
    add(m, cell, { grow: true });
  }
  add(card, frame('gap', { h: 28, w: 1 }));
  add(card, m, { fill: true });

  const cmp = frame('District vs village', { dir: 'col', gap: 0, pad: [24, 0, 0, 0] });
  const hd = frame('Head', { dir: 'row', align: 'CENTER', pad: [0, 0, 10, 0] });
  add(hd, await text('District forecast 18 km → your village 1.2 km', 'body/m-strong', 'ink'), { grow: true });
  add(hd, await text(`Δz +${r.elevationM - DATA.cellElevationM} m`, 'mono/data', 'muted'));
  add(cmp, hd, { fill: true });
  for (const [k, cv, fv, unit, up, down] of [
    ['Night low', c.tempMin, f.tempMin, '°C', 'sun', 'frost'],
    ['Day high', c.tempMax, f.tempMax, '°C', 'sun', 'frost'],
    ['Rain', c.rainfallMm, f.rainfallMm, 'mm', 'sky', 'sun'],
    ['Wind', c.windSpeedKmh, f.windSpeedKmh, 'km/h', 'alert', 'sky'],
  ]) {
    const d = Math.round((fv - cv) * 10) / 10;
    const line = frame(k, { dir: 'row', gap: 16, pad: [10, 0], align: 'CENTER' });
    line.strokes = [paint('line', 0.1)];
    line.strokeWeight = 1;
    line.strokeBottomWeight = line.strokeLeftWeight = line.strokeRightWeight = 0;
    add(line, await text(k, 'body/m', 'ink2'), { grow: true });
    add(line, await text(`${cv} ${unit}`, 'mono/data', 'muted'));
    add(line, await text(`${fv} ${unit}`, 'mono/readout', 'ink'));
    add(line, await text(Math.abs(d) < 0.1 ? 'same' : sgn(d), 'mono/readout', Math.abs(d) < 0.1 ? 'muted' : d > 0 ? up : down, { align: 'RIGHT', w: 56 }));
    add(cmp, line, { fill: true });
  }
  add(card, cmp, { fill: true });
  return card;
}

async function actionPlan(w) {
  const card = frame('What to do today', { dir: 'col', gap: 16, pad: 32, radius: 20, fill: paint('surface'), stroke: ['line', 0.08], w, shadow: true });
  const h = frame('Head', { dir: 'row', align: 'CENTER' });
  add(h, await text('What to do today', 'display/l', 'ink'), { grow: true });
  add(h, await text('ICAR AGROMET RULES', 'mono/label', 'muted'));
  add(card, h, { fill: true });
  const crops = frame('Crops', { dir: 'row', gap: 8 });
  crops.layoutWrap = 'WRAP';
  crops.counterAxisSpacing = 8;
  crops.primaryAxisSizingMode = 'FIXED';
  crops.resize(w - 64, 10);
  for (const [i, cn] of DATA.region.crops.slice(0, 5).entries()) {
    const ch = inst(COMP.chip, i === 0 ? 'State=On' : 'State=Off');
    await setLabel(ch, 'Label', cn);
    add(crops, ch);
  }
  add(card, crops);
  const sprayTone = DATA.spray.hours >= 3 ? 'Tone=Good' : DATA.spray.hours > 0 ? 'Tone=Warn' : 'Tone=Bad';
  const v1 = inst(COMP.verdict, sprayTone);
  await setLabel(v1, 'Headline', DATA.spray.hours > 0 ? DATA.spray.label : 'No safe window');
  add(card, v1, { fill: true });
  const v2 = inst(COMP.verdict, 'Tone=Good');
  await setLabel(v2, 'Headline', DATA.irrigation.action);
  await setLabel(v2, 'Verdict label', 'Water');
  add(card, v2, { fill: true });
  const v3 = inst(COMP.verdict, DATA.pest.level === 'high' ? 'Tone=Bad' : DATA.pest.level === 'moderate' ? 'Tone=Warn' : 'Tone=Good');
  await setLabel(v3, 'Headline', DATA.pest.title);
  await setLabel(v3, 'Verdict label', DATA.pest.level === 'low' ? 'Low risk' : DATA.pest.level === 'moderate' ? 'Watch' : 'High risk');
  add(card, v3, { fill: true });
  return card;
}

async function weekStrip(w) {
  const card = frame('7-day outlook', { dir: 'col', gap: 20, pad: 32, radius: 20, fill: paint('surface'), stroke: ['line', 0.08], w, shadow: true });
  const h = frame('Head', { dir: 'row', align: 'MAX' });
  const hl = frame('title', { dir: 'col', gap: 6 });
  add(hl, await text('FIG 1.2 · 7-DAY VILLAGE OUTLOOK · LIVE', 'mono/label', 'muted'));
  add(hl, await text(`The week ahead in ${DATA.region.name}`, 'display/m', 'ink'));
  add(h, hl, { grow: true });
  const b = inst(COMP.button, 'Kind=Primary');
  await setLabel(b, 'Label', 'Agromet bulletin');
  add(h, b);
  add(card, h, { fill: true });
  const days = frame('Days', { dir: 'row', gap: 10 });
  const lo = Math.min(...DATA.week.flatMap((d) => [d.fine.tempMin, d.coarse.tempMin]));
  const hi = Math.max(...DATA.week.flatMap((d) => [d.fine.tempMax, d.coarse.tempMax]));
  const maxRain = Math.max(5, ...DATA.week.map((d) => Math.max(d.fine.rainfallMm, d.coarse.rainfallMm)));
  for (const [i, d] of DATA.week.entries()) {
    const best = i === DATA.bestSprayDay;
    const col = frame(`Day ${i + 1}`, { dir: 'col', gap: 8, pad: [16, 8], radius: 16, align: 'CENTER', fill: paint(best ? 'marker' : 'bg', best ? 0.35 : 0.5), stroke: [best ? 'ink' : 'line', best ? 0.5 : 0.08] });
    add(col, await text(d.label, 'body/m-strong', i === 0 ? 'accent' : 'ink'));
    add(col, await text(d.date, 'body/s', 'muted'));
    add(col, await text(`${Math.round(d.fine.tempMax)}°`, 'display/s', 'ink'));
    const track = frame('Range', { w: 40, h: 64 });
    const y = (t) => ((hi - t) / (hi - lo || 1)) * 64;
    const bar = rect(8, Math.max(3, y(d.fine.tempMin) - y(d.fine.tempMax)), gradient([[0, 'sun'], [1, 'sky']], 90), { radius: 4 });
    bar.x = 16;
    bar.y = y(d.fine.tempMax);
    track.appendChild(bar);
    add(col, track);
    add(col, await text(`${Math.round(d.fine.tempMin)}°`, 'mono/data', 'ink2'));
    const rb = frame('Rain', { w: 40, h: 30 });
    const rh = Math.max(2, (d.fine.rainfallMm / maxRain) * 30);
    const rr = rect(10, rh, 'sky', { radius: 2 });
    rr.x = 15;
    rr.y = 30 - rh;
    rb.appendChild(rr);
    add(col, rb);
    add(col, await text(`${d.fine.rainfallMm} mm`, 'mono/data', 'sky'));
    const ok = d.spray.hours > 0;
    const sp = frame('Spray', { dir: 'row', pad: [4, 8], radius: 8, fill: paint(ok ? (d.spray.hours >= 3 ? 'good' : 'warn') : 'bad', 0.15) });
    add(sp, await text(ok ? `${d.spray.start.slice(0, 2)}–${d.spray.end.slice(0, 2)} h` : 'Rain', 'mono/data', ok ? (d.spray.hours >= 3 ? 'good' : 'warn') : 'bad', { size: 10 }));
    add(col, sp);
    add(days, col, { grow: true });
  }
  add(card, days, { fill: true });
  return card;
}

async function scanGrid(w) {
  const g = frame('Hazard scan', { dir: 'row', gap: 1, radius: 18, clip: true, fill: paint('line', 0.1), w });
  const cells = [
    ['Hazard scan', '303 regions · 43 flagged', null, 'radar'],
    ['Heavy rain', '0', 'none today', null],
    ['Moderate rain', '6', 'Ramanagara Silk City', null],
    ['Frost', '0', 'none today', null],
    ['Heat stress', '4', 'Kadapa Red Sandstone', null],
    ['Spray drift', '15', 'Dausa Aravalli Gap', null],
    ['Fungal weather', '18', 'Kodagu Madikeri Hills', null],
    ['Missed', '13', 'alerts the district forecast misses', 'missed'],
  ];
  for (const [k, v, sub, kind] of cells) {
    const c = frame(k, { dir: 'col', gap: 12, pad: 18, fill: paint(kind === 'missed' ? 'sun' : 'surface', kind === 'missed' ? 0.12 : 1) });
    if (kind === 'radar') {
      const ic = frame('icon', { dir: 'row', pad: 10, radius: 8, fill: paint('accent', 0.12) });
      add(ic, icon('radar', 'accent', 20));
      add(c, ic);
      add(c, await text(k, 'body/m-strong', 'ink'));
      add(c, await text(v, 'body/s', 'muted', { w: 120 }));
    } else {
      add(c, await text(k, 'body/s', kind === 'missed' ? 'sun' : 'ink2'));
      add(c, await text(v, 'display/l', v === '0' ? 'muted' : 'ink'));
      add(c, await text(sub, 'body/s', 'muted', { size: 11, w: 124 }));
    }
    add(g, c, { grow: true });
  }
  return g;
}

async function engineBlock(w) {
  const g = DATA.grid.tempMin;
  const wrap = frame('Engine panels', { dir: 'row', gap: 24 });
  // Grid card
  const gc = frame('Fig 2.1 · DEM grid', { dir: 'col', gap: 14, pad: 28, radius: 20, fill: paint('surface'), stroke: ['line', 0.08], w: 700 });
  add(gc, await text('FIG 2.1 · LIVE COPERNICUS GLO-90 DEM', 'mono/label', 'muted'));
  add(gc, await text('225 village cells inside one forecast block', 'display/m', 'ink', { w: 640 }));
  const body = frame('Body', { dir: 'row', gap: 24 });
  const map = frame('Grid with references', { w: 392, h: 392 });
  const img = image('grid', 372, 372, 'DEM grid · 15 × 15 cells', 8);
  map.appendChild(img);
  img.x = 20;
  img.y = 20;
  for (let i = 0; i < 15; i++) {
    const col = await text(String.fromCharCode(65 + i), 'mono/data', 'muted', { size: 9 });
    map.appendChild(col);
    col.x = 20 + i * (372 / 15) + 372 / 30 - col.width / 2;
    col.y = 3;
    const rw = await text(String(i + 1), 'mono/data', 'muted', { size: 9 });
    map.appendChild(rw);
    rw.x = 2;
    rw.y = 20 + i * (372 / 15) + 372 / 30 - rw.height / 2;
  }
  add(body, map);
  const st = frame('Stats', { dir: 'col', gap: 10 });
  const spread = frame('Spread', { dir: 'col', gap: 4, pad: 16, radius: 14, fill: paint('surface2') });
  add(spread, await text('Hidden inside the block', 'body/s', 'muted'));
  add(spread, await text(`${(g.hi - g.lo).toFixed(1)} °C`, 'display/l', 'accent'));
  add(spread, await text('spread the 18 km forecast cannot see', 'body/s', 'ink2'));
  add(st, spread, { fill: true });
  for (const [k, v, tone] of [
    ['Block forecast', `${g.coarse} °C`, 'sun'],
    ['Your village cell', `${g.village} °C`, 'accent'],
    ['Lowest', `${g.lo} °C · ${g.loElev} m`, 'ink'],
    ['Highest', `${g.hi} °C · ${g.hiElev} m`, 'ink'],
  ]) {
    const r = frame(k, { dir: 'col', gap: 2, pad: [10, 12], radius: 10, stroke: ['line', 0.08] });
    add(r, await text(k, 'body/s', 'muted'));
    add(r, await text(v, 'mono/readout', tone));
    add(st, r, { fill: true });
  }
  const dl = frame('Downloads', { dir: 'row', gap: 6, align: 'CENTER' });
  add(dl, await text('DATA', 'mono/label', 'muted'));
  for (const l of ['CSV', 'GeoJSON', 'PNG']) {
    const ch = inst(COMP.chip, 'State=Off');
    await setLabel(ch, 'Label', l);
    add(dl, ch);
  }
  add(st, dl);
  add(body, st, { grow: true });
  add(gc, body, { fill: true });
  add(wrap, gc);

  // Explain card (waterfall)
  const ew = w - 700 - 24;
  const ec = frame('Fig 2.2 · Step by step', { dir: 'col', gap: 14, pad: 28, radius: 20, fill: paint('surface'), stroke: ['line', 0.08], w: ew });
  add(ec, await text('FIG 2.2 · EXPLAINABLE AI', 'mono/label', 'muted'));
  add(ec, await text('Why your village differs', 'display/m', 'ink'));
  const c0 = DATA.coarse.tempMin, fz = DATA.fine.tempMin, steps = DATA.steps.tmin;
  const lead = [...steps].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];
  const note = frame('Reasoning', { dir: 'col', pad: 14, radius: 14, fill: paint('accent', 0.07), stroke: ['accent', 0.25] });
  add(note, await text(`${DATA.region.name}: ${Math.abs(fz - c0).toFixed(1)} °C ${fz < c0 ? 'cooler' : 'warmer'} than the district forecast. The biggest factor is ${lead ? lead.label.toLowerCase() : 'none'}.`, 'body/m', 'ink2', { w: ew - 84 }));
  add(ec, note, { fill: true });
  const rows = [{ label: 'Block forecast · 18 km', eq: 'NWP grid-cell mean', from: c0, to: c0, kind: 'start' }];
  let v = c0;
  for (const s of steps) {
    rows.push({ label: s.label, eq: s.eq || s.why, from: v, to: v + s.value, kind: 'step' });
    v += s.value;
  }
  rows.push({ label: 'Your village · 1.2 km', eq: 'T = T₀ + ΣΔT', from: fz, to: fz, kind: 'end' });
  const all = rows.flatMap((r) => [r.from, r.to]);
  const pd = Math.max(0.6, (Math.max(...all) - Math.min(...all)) * 0.25);
  const lo = Math.min(...all) - pd, hi = Math.max(...all) + pd;
  const trackW = ew - 56 - 190 - 64 - 24;
  const x = (n) => ((n - lo) / (hi - lo)) * trackW;
  for (const r of rows) {
    const line = frame(r.label, { dir: 'row', gap: 12, align: 'CENTER' });
    const lab = frame('label', { dir: 'col', gap: 2, w: 190 });
    add(lab, await text(r.label, r.kind === 'step' ? 'body/m' : 'body/m-strong', r.kind === 'step' ? 'ink2' : 'ink'));
    add(lab, await text(r.eq, 'mono/data', 'muted', { size: 9.5, w: 190 }));
    add(line, lab);
    const track = frame('track', { w: trackW, h: 26, radius: 6, fill: paint('surface2') });
    const isStep = r.kind === 'step';
    const color = r.kind === 'start' ? 'sun' : r.kind === 'end' ? 'accent' : r.to < r.from ? 'sky' : 'sun';
    const bar = rect(isStep ? Math.max(2, Math.abs(x(r.to) - x(r.from))) : x(r.to), 18, isStep ? paint(color) : gradient([[0, color, 0.2], [1, color, 1]], 0), { radius: 4 });
    bar.x = isStep ? x(Math.min(r.from, r.to)) : 0;
    bar.y = 4;
    track.appendChild(bar);
    add(line, track);
    add(line, await text(isStep ? sgn(r.to - r.from) : f1(r.to), 'mono/readout', r.kind === 'end' ? 'accent' : r.kind === 'start' ? 'sun' : 'ink2', { align: 'RIGHT', w: 64 }));
    add(ec, line);
  }
  const model = frame('Model', { dir: 'col', gap: 2, pad: 14, radius: 12, fill: paint('bg', 0.5), stroke: ['line', 0.08] });
  add(model, await text('MODEL · NIGHT LOW', 'mono/label', 'muted'));
  add(model, await text('T₁.₂ = T₁₈ + Σ ΔTᵢ', 'mono/data', 'ink2', { size: 12 }));
  add(model, await text(`     = ${f1(c0)}${steps.map((s) => ` ${s.value < 0 ? '−' : '+'} ${Math.abs(s.value).toFixed(1)}`).join('')}`, 'mono/data', 'ink2', { size: 12 }));
  add(model, await text(`     = ${f1(fz)} °C`, 'mono/readout', 'accent'));
  add(ec, model, { fill: true });
  add(wrap, ec);
  return wrap;
}

async function pipeline(w) {
  const r = DATA.region;
  const p = frame('Pipeline', { dir: 'row', gap: 1, radius: 18, clip: true, fill: paint('line', 0.08), w });
  for (const [i, [ic, k, t, d]] of [
    ['rain', 'IN', 'NWP block forecast', `Open-Meteo · cell ${DATA.cellElevationM} m`],
    ['layers', 'TERRAIN', 'DEM + covariates', `GLO-90 · slope ${r.slopeDeg}° · D ${r.drainage}`],
    ['cpu', 'MODEL', 'Physics inference', 'Γ lapse · pooling · orographic · OI'],
    ['file', 'OUT', 'Village advisory', `${r.elevationM} m · Δx 1.2 km · 7 days`],
  ].entries()) {
    const cell = frame(k, { dir: 'row', gap: 12, pad: [14, 18], fill: paint('surface'), align: 'CENTER' });
    const ib = frame('icon', { dir: 'row', pad: 9, radius: 8, fill: paint(i === 3 ? 'accent' : 'surface2') });
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
  const panel = frame('Ask AeroAgro', { dir: 'col', radius: 20, clip: true, fill: paint('surface'), stroke: ['line', 0.08], w, h, shadow: true });
  const head = frame('Header', { dir: 'row', gap: 12, pad: [18, 22], align: 'CENTER' });
  const av = frame('Avatar', { dir: 'row', pad: 11, radius: 8, fill: paint('bg'), stroke: ['accent', 0.8, 1.5] });
  add(av, icon('spark', 'accent', 18));
  add(head, av);
  const ht = frame('Title', { dir: 'col', gap: 2 });
  add(ht, await text('Ask AeroAgro', 'display/s', 'ink'));
  add(ht, await text(`Farm assistant for ${DATA.region.name} · answers computed on the device`, 'body/s', 'muted'));
  add(head, ht, { grow: true });
  add(panel, head, { fill: true });
  const conv = frame('Conversation', { dir: 'col', gap: 14, pad: [8, 22] });
  for (const m of DATA.chat) {
    const u = frame('User', { dir: 'row', justify: 'MAX' });
    const ub = frame('bubble', { dir: 'row', pad: [10, 14], radius: 16, fill: paint('btn') });
    const isDeva = /[ऀ-ॿ]/.test(m.q);
    add(ub, await text(m.q, 'body/m', 'btnInk', isDeva && FONT.deva ? { font: 'deva' } : {}));
    add(u, ub);
    add(conv, u, { fill: true });
    const a = frame('AI', { dir: 'row', gap: 10 });
    const aic = frame('ai', { dir: 'row', pad: 6, radius: 8, fill: paint('accent', 0.15) });
    add(aic, icon('spark', 'accent', 14));
    add(a, aic);
    const col = frame('answer', { dir: 'col', gap: 6 });
    const ab = frame('bubble', { dir: 'col', pad: [10, 14], radius: 16, fill: paint('surface2') });
    const deva = /[ऀ-ॿ]/.test(m.a);
    add(ab, await text(m.a, 'body/m', 'ink2', Object.assign({ w: w - 118 }, deva && FONT.deva ? { font: 'deva' } : {})));
    add(col, ab);
    const src = frame('sources', { dir: 'row', gap: 6 });
    for (const s of m.sources.slice(0, 3)) {
      const c = frame(s, { dir: 'row', pad: [2, 8], radius: 8, stroke: ['line', 0.12] });
      add(c, await text(s, 'body/s', 'muted', { size: 10 }));
      add(src, c);
    }
    add(col, src);
    add(a, col);
    add(conv, a, { fill: true });
  }
  add(panel, conv, { fill: true, grow: true });
  const input = frame('Input', { dir: 'row', gap: 8, pad: 14, align: 'CENTER' });
  const mic = frame('Mic', { dir: 'row', pad: 12, radius: 8, stroke: ['line', 0.14] });
  add(mic, icon('mic', 'ink2', 16));
  add(input, mic);
  const field = frame('Field', { dir: 'row', pad: [12, 16], radius: 8, fill: paint('bg', 0.6), stroke: ['line', 0.12] });
  add(field, await text('Ask about spraying, rain, irrigation, frost…', 'body/m', 'muted'));
  add(input, field, { grow: true });
  const send = frame('Send', { dir: 'row', pad: 12, radius: 8, fill: paint('btn') });
  add(send, icon('send', 'btnInk', 16));
  add(input, send);
  add(panel, input, { fill: true });
  return panel;
}

async function deliverCards(w) {
  const col = frame('Reach', { dir: 'col', gap: 16, w });
  for (const [k, t, d, ic] of [
    ['PRINT', 'Agromet bulletin', 'Five-day GKMS-format advisory with SMS text and QR.', 'file'],
    ['PHONE', 'Farmer app view', 'The same advice on a simple phone screen, with voice.', 'phone'],
    ['WALL', 'Village kiosk', 'Large type and a WhatsApp QR for the panchayat office.', 'tv'],
  ]) {
    const c = frame(t, { dir: 'row', gap: 18, pad: 24, radius: 20, fill: paint('surface'), stroke: ['line', 0.08], shadow: true });
    const ib = frame('icon', { dir: 'row', pad: 14, radius: 8, fill: paint('btn') });
    add(ib, icon(ic, 'btnInk', 20));
    add(c, ib);
    const tx = frame('text', { dir: 'col', gap: 4 });
    add(tx, await text(k, 'mono/label', 'muted'));
    add(tx, await text(t, 'display/m', 'ink'));
    add(tx, await text(d, 'body/m', 'ink2', { w: w - 150 }));
    add(c, tx, { grow: true });
    add(c, icon('arrow', 'muted', 20));
    add(col, c, { fill: true });
  }
  return col;
}

async function footer(w) {
  return night(async () => {
    const f = frame('Footer · night', { dir: 'col', gap: 40, pad: [80, 64, 0, 64], w, fill: paint('bg'), clip: true });
    setNightMode(f);
    const top = frame('Top', { dir: 'row', gap: 64 });
    const l = frame('Left', { dir: 'col', gap: 18, w: 520 });
    add(l, await title('Village weather at 1.2 km. ', 'District forecasts stop at 18 km.', 'display/m', { w: 520 }));
    add(l, await text('Data: Open-Meteo NWP · Copernicus GLO-90 DEM · IMD INSAT-3DR · ICAR agromet guidance. Decision-support estimates, not an official IMD forecast.', 'body/s', 'muted', { w: 440 }));
    add(top, l);
    for (const [h, links] of [
      ['PRODUCT', ['Your village', 'All India', 'Engine', 'Ask AeroAgro', 'Field tools']],
      ['BUILD', ['Source code', 'Figma plugin', 'About the project']],
      ['DATA', ['Open-Meteo', 'Copernicus DEM', 'IMD satellite']],
    ]) {
      const c = frame(h, { dir: 'col', gap: 10 });
      add(c, await text(h, 'mono/label', 'muted'));
      for (const x of links) add(c, await text(x, 'body/m', 'ink2'));
      add(top, c, { grow: true });
    }
    add(f, top, { fill: true });
    const mark = await title('AeroAgro', '.', 'display/poster', { size: 260 });
    add(f, mark);
    return f;
  });
}

// ---------------------------------------------------------------- screens
async function buildDesktop(page) {
  const W = 1440, C = W - 128;
  const s = frame('Desktop · 1440 · Monsoon Almanac', { dir: 'col', fill: paint('bg'), w: W });
  page.appendChild(s);
  add(s, await ticker(W), { fill: true });
  add(s, await nav(W), { fill: true });
  add(s, await heroPoster(W), { fill: true });
  add(s, await figureBand(W), { fill: true });
  add(s, await statsRow(W), { fill: true });

  const v = frame('(01) Your village · paper', { dir: 'col', gap: 24, pad: [80, 64], fill: paint('bg') });
  add(v, await sectionHead('01 / YOUR VILLAGE, TODAY', 'One village. ', 'Its own forecast.', 'Pick any of 303 regions. Everything here is re-computed for that exact place.', C));
  const row = frame('Sheet + plan', { dir: 'row', gap: 24 });
  add(row, await villageSheet(760));
  add(row, await actionPlan(C - 760 - 24));
  add(v, row);
  add(v, await weekStrip(C));
  add(s, v, { fill: true });

  const mapBand = await night(async () => {
    const b = frame('(02) All India · night', { dir: 'col', gap: 24, pad: [80, 64], fill: paint('bg') });
    setNightMode(b);
    add(b, await sectionHead('02 / ALL INDIA', '303 regions, ', 'today’s hazards.', 'Each dot shows today’s 1.2 km value. The hazard scan flags what the 18 km forecast misses.', C));
    add(b, await scanGrid(C));
    add(b, image('map', C, 540, 'Live map · 303 regions', 20));
    return b;
  });
  add(s, mapBand, { fill: true });

  const engBand = await night(async () => {
    const b = frame('(03) Engine · night', { dir: 'col', gap: 24, pad: [80, 64], fill: paint('bg') });
    setNightMode(b);
    add(b, await sectionHead('03 / THE DOWNSCALING ENGINE', 'How 18 km becomes ', '1.2 km.', 'Elevation from the Copernicus DEM, each physics step in order, and the equation behind every number.', C));
    add(b, await pipeline(C));
    add(b, await engineBlock(C));
    return b;
  });
  add(s, engBand, { fill: true });

  const ask = frame('(04) Ask · paper', { dir: 'col', gap: 24, pad: [80, 64], fill: paint('bg') });
  add(ask, await sectionHead('04 / ASK & REACH EVERY FARMER', 'Ask about your field, ', 'in your language.', 'Type or speak in English, Hindi or Tamil. Answers come from this village’s forecast.', C));
  const ar = frame('Ask + reach', { dir: 'row', gap: 24 });
  add(ar, await chatPanel(760, 720));
  add(ar, await deliverCards(C - 760 - 24));
  add(ask, ar);
  add(s, ask, { fill: true });
  add(s, await footer(W), { fill: true });
  return s;
}

async function buildMobile(page) {
  const W = 390;
  const s = frame('Mobile · 390', { dir: 'col', fill: paint('bg'), w: W });
  page.appendChild(s);
  add(s, await ticker(W), { fill: true });
  add(s, await nav(W, true), { fill: true });
  add(s, await heroPoster(W, true), { fill: true });
  add(s, await figureBand(W, true), { fill: true });
  const body = frame('Village', { dir: 'col', gap: 16, pad: [40, 16] });
  const sheet = await villageSheet(W - 32);
  add(body, sheet, { fill: true });
  const v = inst(COMP.verdict, DATA.spray.hours >= 3 ? 'Tone=Good' : DATA.spray.hours > 0 ? 'Tone=Warn' : 'Tone=Bad');
  await setLabel(v, 'Headline', DATA.spray.hours > 0 ? DATA.spray.label : 'No safe window');
  add(body, v, { fill: true });
  add(body, await chatPanel(W - 32, 620), { fill: true });
  add(s, body, { fill: true });
  add(s, await tabBar(W), { fill: true });
  return s;
}

async function buildArchitecture(page) {
  const board = frame('Architecture', { w: 1440, h: 860, fill: paint('bg') });
  page.appendChild(board);
  const kick = await text('A / ARCHITECTURE', 'mono/label', 'muted');
  board.appendChild(kick);
  kick.x = 80;
  kick.y = 64;
  const tt = await title('Data → physics → ', 'farmer.', 'display/xl', { w: 1100 });
  board.appendChild(tt);
  tt.x = 80;
  tt.y = 96;
  const sub = await text('A static site on a CDN: every forecast is fetched and downscaled in the browser from free, keyless open data. No server to attack, no keys to leak.', 'body/l', 'ink2', { w: 900 });
  board.appendChild(sub);
  sub.x = 80;
  sub.y = 200;

  const node = async (x, y, w, fig, head, lines, hero) => {
    const n = frame(head, { dir: 'col', gap: 6, pad: 18, radius: 18, fill: paint(hero ? 'btn' : 'surface'), stroke: ['line', hero ? 0 : 0.1], w });
    add(n, await text(fig, 'mono/label', hero ? 'btnInk' : 'muted', hero ? { opacity: 0.7 } : {}));
    add(n, await text(head, 'display/s', hero ? 'btnInk' : 'ink'));
    for (const l of lines) add(n, await text(l, 'mono/data', hero ? 'btnInk' : 'ink2', { size: 10.5, w: w - 36, opacity: hero ? 0.85 : 1 }));
    board.appendChild(n);
    n.x = x;
    n.y = y;
    return n;
  };
  const arrow = (a, b) => {
    const x1 = a.x + a.width, y1 = a.y + a.height / 2, x2 = b.x, y2 = b.y + b.height / 2, mx = (x1 + x2) / 2;
    const v = figma.createVector();
    v.vectorPaths = [{ windingRule: 'NONZERO', data: `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2 - 7} ${y2}` }];
    v.strokes = [paint('ink', 0.5)];
    v.strokeWeight = 1.5;
    v.strokeCap = 'ROUND';
    v.fills = [];
    v.name = `${a.name} → ${b.name}`;
    board.appendChild(v);
    const hd = figma.createVector();
    hd.vectorPaths = [{ windingRule: 'NONZERO', data: `M ${x2 - 8} ${y2 - 4.5} L ${x2} ${y2} L ${x2 - 8} ${y2 + 4.5} Z` }];
    hd.fills = [paint('ink', 0.6)];
    hd.strokes = [];
    hd.name = 'arrowhead';
    board.appendChild(hd);
  };
  const r = DATA.region;
  const a = await node(80, 300, 320, 'SOURCE · 01', 'Open-Meteo NWP', ['forecast API · best match', 'elevation = nan → raw block value', `cell height ${DATA.cellElevationM} m`], false);
  const b = await node(80, 480, 320, 'SOURCE · 02', 'Copernicus GLO-90', ['elevation API · 225 points', `relief ${DATA.grid.elevation.lo}–${DATA.grid.elevation.hi} m`], false);
  const c = await node(80, 640, 320, 'SOURCE · 03', 'Region registry', ['303 regions · slope · drainage', 'terrain class · crops'], false);
  const e = await node(540, 420, 380, 'MODEL', 'Physics downscaler', ['ΔT = −Γ·Δz (5.0 day · 6.5/4.5 night)', 'pooling −k·D·(1−θ/40), TPI hollows', 'rain × (1 + 0.6Δz⁺ + 0.6 sin θ)', 'OI blend Lh = 250/σz km, Lz 150 m', `${r.name}: ${DATA.coarse.tempMin} → ${DATA.fine.tempMin} °C`], true);
  const outs = [];
  for (const [i, [fig, head, lines]] of [
    ['OUT · 1', 'Village sheet + grid', ['CSV · GeoJSON · PNG export']],
    ['OUT · 2', 'Outlook + bulletin', ['GKMS format · SMS · QR']],
    ['OUT · 3', 'Ask AeroAgro', ['EN · HI · TA · voice']],
    ['OUT · 4', 'WhatsApp · kiosk · PMFBY', ['evidence · SHA-256']],
  ].entries())
    outs.push(await node(1060, 290 + i * 140, 300, fig, head, lines, false));
  for (const src of [a, b, c]) arrow(src, e);
  for (const o of outs) arrow(e, o);
  return board;
}

async function buildCover(page) {
  const c = frame('Cover', { dir: 'col', gap: 36, pad: [96, 96], w: 1440, fill: paint('bg') });
  page.appendChild(c);
  const top = frame('Top', { dir: 'row', align: 'CENTER' });
  add(top, await text('AEROAGRO AI · DESIGN FILE · MONSOON ALMANAC', 'mono/label', 'muted'), { grow: true });
  add(top, await text(`SNAPSHOT · ${DATA.region.name.toUpperCase()} · ${DATA.snapshot.at.slice(0, 10)}`, 'mono/label', 'muted'));
  add(c, top, { fill: true });
  add(c, await text('Village weather at 1.2 km.', 'display/poster', 'ink', { size: 112, w: 1248 }));
  const line2 = frame('Line 2 · highlighter', { dir: 'row', pad: [0, 8], fill: gradient([[0, '#FFFFFF', 0], [0.58, '#FFFFFF', 0], [0.58, PAPER.marker, 0.9], [0.9, PAPER.marker, 0.9], [0.9, '#FFFFFF', 0]], 90) });
  add(line2, await text('District forecasts stop at 18 km.', 'display/poster', 'ink', { font: 'displayItalic', size: 112 }));
  add(c, line2);
  add(c, await text('MoES problem statement: downscaling weather forecasts from block to panchayat level for agro-meteorological advisory services.', 'body/l', 'ink2', { w: 760 }));
  add(c, image('thermal', 1248, 624, 'Fig 1 · resolution comparison', 22));
  add(c, await text('aeroagro.vercel.app', 'mono/label', 'accent'));
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
  for (const [name, fn] of [
    ['Foundations', buildFoundations],
    ['Components', buildComponents],
    ['Cover', buildCover],
    ['Desktop', buildDesktop],
    ['Mobile', buildMobile],
    ['Architecture', buildArchitecture],
  ]) {
    await figma.setCurrentPageAsync(pages[name]);
    figma.notify(`AeroAgro: building ${name}…`, { timeout: 1200 });
    const node = await fn(pages[name]);
    figma.viewport.scrollAndZoomIntoView([node]);
  }
  await figma.setCurrentPageAsync(pages.Cover);
  figma.viewport.scrollAndZoomIntoView(pages.Cover.children);
  figma.closePlugin('AeroAgro · Monsoon Almanac generated: 6 pages, Paper/Night variables, text styles, components');
}

run().catch((e) => {
  console.error(e);
  figma.closePlugin(`AeroAgro plugin error: ${e && e.message ? e.message : e}`);
});
