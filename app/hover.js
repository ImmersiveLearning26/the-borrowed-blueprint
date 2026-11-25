// Hover explainers (H1–H12 in CLARITY_REVIEW_AND_EXPLAINER_PLAN.md).
// One liquid-glass card grows out of the thing it explains after a 300 ms hover (or keyboard focus) and folds away
// when you leave. It holds only a small looping vector scene, no words on screen: organic forms (rings, arcs,
// droplets, flowing curves, soft shapes) with the supplied props, the location pin and the rounded cross.
// The sentence is still there for screen readers. It never covers text already on screen (see place()).
// No background blur: the card's own glass refracts what is behind it. Reduced motion shows the settled frame.
// The one-line definitions are drafts that need subject-expert approval.
import {reducedMotion} from './motion.js';

const P = n => `assets/props/${n}.webp`;
const img = (n, cls, style = '') => `<img class="${cls}" src="${P(n)}" alt="" style="${style}">`;
const pin = (cls, style) => `<span class="hx-pin ${cls}" style="${style}"><img src="assets/pin.png" alt=""></span>`;
const cross = (cls, style) => `<img class="hx-x ${cls}" src="assets/marks/cross-rounded.svg" alt="" style="${style}">`;
const svg = inner => `<svg class="hx-svg" viewBox="0 0 264 132" aria-hidden="true">${inner}</svg>`;
const curve = (cls, d) => `<path class="hx-curve ${cls}" d="${d}"/>`;
const dot = (cls, path) => `<span class="hx-dot ${cls}" style="offset-path:path('${path}')"></span>`;
// an arc of a circle, angles in degrees clockwise from 12 o'clock
const arc = (cx, cy, r, a0, a1) => {
  const p = a => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)].map(v => v.toFixed(1));
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const tick = (cls, cx, cy) => `<g class="hx-tick ${cls}"><circle cx="${cx}" cy="${cy}" r="11"/><path d="M ${cx - 5} ${cy} l 3.5 3.5 l 6.5 -7"/></g>`;
const H6 = [[22, 22], [242, 22], [22, 110], [242, 110], [132, 8]].map(([x, y], i) => {
  const dx = 132 - x, dy = 70 - y, n = Math.hypot(dx, dy), ex = 132 - dx / n * 40, ey = 70 - dy / n * 40, b = i % 2 ? -14 : 14;
  return `M ${x} ${y} Q ${(x + ex) / 2 - dy / n * b} ${(y + ey) / 2 + dx / n * b} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
});
const H9 = [0, 1, 2].map(i => `M 30 ${24 + i * 42} C 80 ${6 + i * 42} 150 ${44 + i * 42} ${i === 2 ? 150 : 222} ${24 + i * 42}`);

// Each scene is drawn on a 264 × 132 stage. t: the sentence screen readers hear.
const S = {
  // 24 research hours as a ring of four 6-hour arcs; each source you open drips one away
  H1: {t: 'Research hours. You have 24 hours to read. Each new source costs six. Choose what you need.',
    s: img('P14-hourglass', 'hx-hg', 'left:22px;top:22px;width:84px;height:84px') +
      svg(`<circle class="hx-faint" cx="180" cy="62" r="38"/>` + [0, 1, 2, 3].map(i => `<path class="hx-arc h1a${i}" d="${arc(180, 62, 38, i * 90 + 7, i * 90 + 83)}"/>` +
        `<circle class="hx-drop h1d${i}" cx="${(180 + 38 * Math.sin((i * 90 + 45) * Math.PI / 180)).toFixed(1)}" cy="${(62 - 38 * Math.cos((i * 90 + 45) * Math.PI / 180)).toFixed(1)}" r="4"/>`).join(''))},
  // the reserve: a magnifier glides over a source; once it is checked, one of the two 6-hour halves drains
  H2: {t: 'Reserve hours. Hours left to check a source before you borrow from it.',
    s: svg(`<path class="hx-leaf" d="M 40 96 C 30 60 62 26 104 30 C 112 62 92 100 40 96 Z"/><path class="hx-vein" d="M 44 92 C 62 72 80 52 100 34"/>` +
      `<circle class="hx-faint" cx="206" cy="66" r="30"/><path class="hx-arc h2a0" d="${arc(206, 66, 30, 6, 174)}"/><path class="hx-arc h2a1" d="${arc(206, 66, 30, 186, 354)}"/>` +
      `<circle class="hx-drop h2d" cx="176" cy="66" r="4"/>` + tick('h2t', 104, 30)) +
      `<img class="hx-mag" src="${P('P16-magnifier')}" alt="" style="width:58px;height:58px;offset-path:path('M 30 40 C 70 10 60 110 110 70')">`},
  // credibility swells when evidence lands; fit risk swells when you borrow along an unchecked path
  H3: {t: 'Credibility and fit risk. Credibility rises when your evidence supports you. Fit risk rises when you borrow without checking.',
    s: svg(`<circle class="hx-orb ac" cx="150" cy="50" r="24"/><circle class="hx-orb fr" cx="214" cy="92" r="20"/>` +
      curve('h3c', 'M 24 112 C 70 132 150 120 196 98') + `<circle class="hx-ripple h3r" cx="150" cy="50" r="24"/>`) +
      img('P17-case-folder', 'hx-fold', 'left:0;top:0;width:50px;height:50px;offset-path:path(\'M 30 28 C 60 6 100 20 150 50\')') +
      dot('h3d', 'M 24 112 C 70 132 150 120 196 98')},
  // a claim hangs heavy until two sources float in and the scale settles level
  H4: {t: 'A strong claim is one your two attached sources actually support.',
    s: img('P05-balance-scale', 'hx-scale', 'left:72px;top:6px;width:120px;height:120px') +
      img('P17-case-folder', 'hx-f1', 'left:0;top:0;width:34px;height:34px;offset-path:path(\'M 250 10 C 230 40 200 30 172 60\')') +
      img('P17-case-folder', 'hx-f2', 'left:0;top:0;width:34px;height:34px;offset-path:path(\'M 260 120 C 230 100 214 90 192 62\')') +
      svg(`<circle class="hx-ripple h4r" cx="132" cy="66" r="44"/>`)},
  // Madrid and one region travel to the same table, then an agreement appears
  H5: {t: 'Bilateral commission. Madrid and one region settle their own agreement, face to face.',
    s: svg(curve('h5a', 'M 40 64 C 64 28 96 36 110 66') + curve('h5b', 'M 224 64 C 200 28 168 36 154 66') + `<circle class="hx-ripple h5r" cx="132" cy="80" r="34"/>`) +
      pin('', 'left:28px;top:30px') + img('P24-flag-spain', 'hx-flag', 'left:26px;top:76px;width:28px;height:28px') + pin('', 'left:212px;top:30px') +
      img('P19-bilateral-table', 'hx-mid', 'left:96px;top:46px;width:72px;height:72px') +
      dot('h5d1', 'M 40 64 C 64 28 96 36 110 66') + dot('h5d2', 'M 224 64 C 200 28 168 36 154 66') +
      img('P22-signed-agreement', 'hx-sign', 'left:112px;top:2px;width:40px;height:40px')},
  // every seat converges on one table; a ripple when they have all arrived
  H6: {t: 'Multilateral fiscal council. All regions and the centre negotiate the shared funding rules together.',
    s: svg(H6.map((d, i) => curve('h6c' + i, d)).join('') + `<circle class="hx-ripple h6r" cx="132" cy="70" r="40"/>`) +
      img('P18-round-table', 'hx-mid', 'left:98px;top:36px;width:68px;height:68px') + H6.map((d, i) => dot('h6d' + i, d)).join('')},
  // a law drifts into the court and is judged (tick); the money beside it is not the court's to set (cross)
  H7: {t: 'Constitutional Court. Judges whether a law is constitutional. It does not set funding.',
    s: img('P20-court-facade', 'hx-court', 'left:14px;top:16px;width:100px;height:100px') +
      `<span class="hx-law" style="offset-path:path('M 150 40 C 130 10 100 20 70 52')"><svg viewBox="-14 -34 40 40" width="40" height="40"><path class="hx-leaf" d="M 0 0 C -10 -22 8 -34 22 -30 C 26 -10 14 6 0 0 Z"/></svg></span>` +
      svg(tick('h7t', 96, 22)) +
      img('P07-coin-stack', 'hx-coin', 'left:180px;top:60px;width:56px;height:56px') + cross('h7x', 'left:194px;top:72px;width:28px;height:28px')},
  // the Senate arc fills past half; the padlock settles on the region; the stamp lands
  H8: {t: 'Article 155 intervention. A last resort: the centre takes over a region’s powers, with a Senate majority.',
    s: svg(`<path class="hx-region" d="M24 70 C20 40 50 22 80 28 C110 34 124 52 116 78 C108 104 70 112 46 104 C30 98 26 86 24 70 Z"/>` +
      `<path class="hx-faint" d="${arc(204, 96, 40, -90, 90)}"/><path class="hx-gauge" d="${arc(204, 96, 40, -90, 90)}" pathLength="100"/><path class="hx-notch" d="M 204 50 v 10"/>`) +
      img('P13-padlock', 'hx-lock', 'left:46px;top:34px;width:48px;height:48px') + img('P12-rubber-stamp', 'hx-stamp', 'left:184px;top:70px;width:40px;height:40px')},
  // the same seed travels three times: it arrives unchanged, it arrives transformed, it is stopped
  H9: {t: 'Transfer takes it as is. Adapt keeps the principle and changes the form. Reject leaves it.',
    s: svg(H9.map((d, i) => curve('h9c' + i, d)).join('') + `<circle class="hx-ripple h9r" cx="222" cy="24" r="10"/><circle class="hx-ripple h9r2" cx="222" cy="66" r="12"/>`) +
      H9.map((d, i) => `<span class="hx-seed h9s${i}" style="offset-path:path('${d}')"></span>`).join('') + cross('h9x', 'left:140px;top:96px;width:22px;height:22px')},
  // a lesson (the book) is only usable once the Nigerian condition wraps around it
  H10: {t: 'A usable lesson always comes with the Nigerian condition that limits it.',
    s: img('P06-constitution-book', 'hx-book', 'left:84px;top:22px;width:88px;height:88px') +
      svg(`<path class="hx-wrap" d="${arc(128, 66, 54, 200, 520)}" pathLength="100"/>` + tick('h10t', 196, 24)) +
      img('P25-flag-nigeria', 'hx-ng', 'left:0;top:0;width:34px;height:34px;offset-path:path(\'M 250 120 C 230 130 200 120 180 104\')')},
  // concede heals the crack; defend raises the sources; reframe circles round the question
  H11: {t: 'Concede fixes it. Defend needs sources. Reframe avoids the question.',
    s: svg(`<path class="hx-blob" d="M 18 70 C 14 44 40 32 58 36 C 80 40 88 60 80 82 C 72 100 40 104 26 94 C 20 88 18 80 18 70 Z"/>` +
      `<path class="hx-crack" d="M 50 36 L 46 52 L 56 60 L 48 78 L 54 100" pathLength="100"/>` +
      curve('h11c', 'M 196 98 C 172 64 192 18 226 28 C 254 38 252 82 224 96') +
      `<path class="hx-q" d="M 214 52 C 214 40 236 40 236 52 C 236 62 224 62 224 72"/><circle class="hx-qdot" cx="224" cy="82" r="2.6"/>`) +
      img('P17-case-folder', 'h11f', 'left:104px;top:34px;width:56px;height:56px') + dot('h11d', 'M 196 98 C 172 64 192 18 226 28 C 254 38 252 82 224 96')},
};
const STRAND = {
  asymmetry: 'Whether you saw that Spain’s regions hold different powers and different fiscal deals.',
  mechanisms: 'Whether you sent each dispute to the body that can actually settle it.',
  transfer: 'Whether you transferred, adapted or rejected each feature for Nigeria’s conditions.',
  limits: 'Whether your lesson came with the Nigerian condition that limits it.',
};
export const strandText = id => STRAND[id] || '';
function strandScene(label, pct) {
  const r = 40, c = 2 * Math.PI * r;
  return {s: svg(`<circle class="hx-faint" cx="132" cy="66" r="${r}"/><circle class="hx-ring" cx="132" cy="66" r="${r}" style="--c:${c.toFixed(1)};--to:${(c * (1 - pct)).toFixed(1)}"/>`)};
}

let card, timer, closeT, anchor = null;
function scene(key) {
  if (key.startsWith('H12:')) {const [, id, label, pct] = key.split(':'); return {...strandScene(label, +pct), t: label + '. ' + (STRAND[id] || '')};}
  return S[key];
}
// The card's inner HTML for a key (also used by the test gallery): the scene only; the sentence is for screen readers.
export function cardHTML(key) {const sc = scene(key); return sc ? `<div class="hx-stage ${key.split(':')[0].toLowerCase()}">${sc.s}</div><span class="sr">${sc.t}</span>` : '';}
// Everything on screen that carries words: a card may never sit on top of any of it.
const TEXT = '#actions,#status,#caption,#character,header nav,#guide .guide-controls,#film.on,#ending .end-drum,#ending .end-detail,.marker .label,dialog[open],#toast,#dev';
function obstacles(a) {
  const out = [];
  for (const el of document.querySelectorAll(TEXT)) {
    if (el === card || card.contains(el)) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    // the panel the anchor lives in counts as a whole; map labels weigh less than reading text
    out.push({r, w: el.matches('.marker .label') ? .35 : 1});
  }
  return out;
}
const area = (x, y, w, h, r) => Math.max(0, Math.min(x + w, r.right) - Math.max(x, r.left)) * Math.max(0, Math.min(y + h, r.bottom) - Math.max(y, r.top));
function place(a, prefer, around) {
  const ra = a.getBoundingClientRect(), ro = around && around.getBoundingClientRect();
  const r = ro ? {left: ro.left, right: ro.right, top: ra.top, bottom: ra.bottom, width: ro.width, height: ra.height} : ra;
  const w = card.offsetWidth, h = card.offsetHeight, g = 14, m = 16, obs = obstacles(a);
  const clampX = x => Math.max(m, Math.min(innerWidth - m - w, x)), clampY = y => Math.max(m, Math.min(innerHeight - m - h, y));
  // candidates: each side of the anchor, slid start / centre / end along it
  const cand = [];
  const xs = [r.left, r.left + r.width / 2 - w / 2, r.right - w], ys = [r.top, r.top + r.height / 2 - h / 2, r.bottom - h];
  for (const y of ys) {cand.push({side: 'left', x: r.left - g - w, y}); cand.push({side: 'right', x: r.right + g, y});}
  for (const x of xs) {cand.push({side: 'above', x, y: r.top - g - h}); cand.push({side: 'below', x, y: r.bottom + g});}
  const order = [prefer, 'left', 'right', 'below', 'above'].filter(Boolean);
  let best = null;
  for (const c of cand) {
    const x = clampX(c.x), y = clampY(c.y);
    let cost = obs.reduce((s, o) => s + area(x, y, w, h, o.r) * o.w, 0);
    cost += area(x, y, w, h, ra) * 4;                    // never cover the thing it explains
    cost += (Math.abs(x - c.x) + Math.abs(y - c.y)) * 2;  // clamped off its side: a little worse
    cost += order.indexOf(c.side) * 40;                    // ties go to the preferred side
    if (!best || cost < best.cost) best = {x, y, cost};
  }
  card.style.left = best.x + 'px'; card.style.top = best.y + 'px';
  // grow out of the anchor: the transform origin is the point of the card nearest to it
  const ox = Math.max(0, Math.min(w, ra.left + ra.width / 2 - best.x)), oy = Math.max(0, Math.min(h, ra.top + ra.height / 2 - best.y));
  card.style.transformOrigin = `${ox}px ${oy}px`;
}
function open(a, key, prefer, around) {
  const sc = scene(key); if (!sc) return;
  clearTimeout(closeT); anchor = a;
  card.innerHTML = cardHTML(key);
  card.classList.toggle('still', reducedMotion());
  card.hidden = false; card.classList.remove('out'); place(a, prefer, around);
  card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
  a.setAttribute('aria-describedby', 'hx');
}
function close() {
  if (!anchor) return; anchor.removeAttribute('aria-describedby'); anchor = null;
  card.classList.remove('in'); card.classList.add('out');
  closeT = setTimeout(() => {card.hidden = true; card.classList.remove('out');}, 200);
}

// resolve(el) → {key, anchor, side?, around?} | null (side: the preferred side for the card, so it never covers neighbours), supplied by the app (it knows the stage and the option order).
export function mountHover(resolve) {
  card = document.createElement('div'); card.id = 'hx'; card.setAttribute('role', 'tooltip'); card.hidden = true; document.body.append(card);
  const want = e => {const hit = resolve(e.target); return hit && hit.anchor;};
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const hit = resolve(e.target);
    if (!hit) return;
    if (anchor === hit.anchor) {clearTimeout(closeT); return;}
    clearTimeout(timer); timer = setTimeout(() => open(hit.anchor, hit.key, hit.side, hit.around), anchor ? 60 : 300);
  });
  document.addEventListener('pointerout', e => {
    if (e.pointerType !== 'mouse') return;
    const from = want(e), to = e.relatedTarget && resolve(e.relatedTarget);
    if (from && (!to || to.anchor !== from)) {clearTimeout(timer); if (anchor) closeT = setTimeout(close, 140);}
  });
  document.addEventListener('focusin', e => {const hit = resolve(e.target); if (hit && e.target.matches(':focus-visible')) open(hit.anchor, hit.key, hit.side, hit.around);});
  document.addEventListener('focusout', () => close());
  document.addEventListener('keydown', e => {if (e.key === 'Escape') close();});
  addEventListener('scroll', () => close(), true);
  return {close};
}
