// Generates the topographic contour backdrop used in the hero (frontend/src/assets/topo.svg).
// Value-noise terrain → marching squares → chained polylines, with every 5th line drawn as an
// "index contour" like a survey map.   Run: node scripts/generate_topo_pattern.js

const fs = require('fs');
const path = require('path');

const W = 1600;
const H = 1000;
const STEP = 8; // grid resolution in px
const LEVELS = 22;

// --- seeded value noise with fBm ---
let seed = 20260927;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const G = 64;
const lattice = Array.from({ length: G * G }, rand);
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const v = (i, j) => lattice[(((yi + j) % G) + G) % G * G + ((((xi + i) % G) + G) % G)];
  return lerp(lerp(v(0, 0), v(1, 0), xf), lerp(v(0, 1), v(1, 1), xf), yf);
}
const fbm = (x, y) => {
  let a = 0.5, f = 1, s = 0;
  for (let o = 0; o < 5; o++) {
    s += a * noise(x * f, y * f);
    a *= 0.5;
    f *= 2.03;
  }
  return s;
};

const cols = Math.floor(W / STEP) + 1;
const rows = Math.floor(H / STEP) + 1;
const field = [];
let min = Infinity, max = -Infinity;
for (let j = 0; j < rows; j++) {
  for (let i = 0; i < cols; i++) {
    const v = fbm(i * STEP / 260, j * STEP / 260);
    field.push(v);
    min = Math.min(min, v);
    max = Math.max(max, v);
  }
}
const at = (i, j) => field[j * cols + i];

// --- marching squares ---
function segments(level) {
  const segs = [];
  const interp = (x1, y1, v1, x2, y2, v2) => {
    const t = (level - v1) / (v2 - v1);
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  };
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * STEP, y = j * STEP;
      const top = interp(x, y, a, x + STEP, y, b);
      const right = interp(x + STEP, y, b, x + STEP, y + STEP, c);
      const bottom = interp(x, y + STEP, d, x + STEP, y + STEP, c);
      const left = interp(x, y, a, x, y + STEP, d);
      const table = {
        1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[top, right]],
        5: [[left, top], [bottom, right]], 6: [[top, bottom]], 7: [[left, top]], 8: [[left, top]],
        9: [[top, bottom]], 10: [[left, bottom], [top, right]], 11: [[top, right]], 12: [[left, right]],
        13: [[bottom, right]], 14: [[left, bottom]],
      };
      segs.push(...table[idx]);
    }
  }
  return segs;
}

// Chain segments into polylines to keep the file small
function chain(segs) {
  const key = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const byPoint = new Map();
  segs.forEach((s, n) => {
    for (const p of s) {
      const k = key(p);
      if (!byPoint.has(k)) byPoint.set(k, []);
      byPoint.get(k).push(n);
    }
  });
  const used = new Array(segs.length).fill(false);
  const lines = [];
  for (let n = 0; n < segs.length; n++) {
    if (used[n]) continue;
    used[n] = true;
    const line = [segs[n][0], segs[n][1]];
    for (const dir of [1, -1]) {
      for (;;) {
        const end = dir === 1 ? line[line.length - 1] : line[0];
        const next = (byPoint.get(key(end)) || []).find((m) => !used[m]);
        if (next === undefined) break;
        used[next] = true;
        const [p, q] = segs[next];
        const other = key(p) === key(end) ? q : p;
        if (dir === 1) line.push(other);
        else line.unshift(other);
      }
    }
    if (line.length > 3) lines.push(line);
  }
  return lines;
}

const paths = [];
for (let l = 1; l < LEVELS; l++) {
  const level = min + ((max - min) * l) / LEVELS;
  const index = l % 5 === 0;
  const d = chain(segments(level))
    .map((pts) => 'M' + pts.map((p) => `${Math.round(p[0])} ${Math.round(p[1])}`).join('L'))
    .join('');
  if (d) paths.push(`<path d="${d}" stroke-width="${index ? 1.3 : 0.7}" stroke-opacity="${index ? 0.16 : 0.08}"/>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><g fill="none" stroke="#C8F169" stroke-linejoin="round" stroke-linecap="round">${paths.join('')}</g></svg>`;
const out = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'topo.svg');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(`Wrote ${path.relative(process.cwd(), out)} (${(svg.length / 1024).toFixed(0)} KB, ${paths.length} contour levels)`);
