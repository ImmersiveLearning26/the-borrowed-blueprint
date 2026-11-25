// Motion helpers (Design Strategies library, 06_Motion_System.md).
// - speech(): the same speech-like envelope the orb shader uses, so the orb and the ribbon move together.
// - Talk: one animation loop that drives the agent orb and every ribbon waveform from real playback level when
//   audio is playing, or from the speech envelope while a text-only line is showing. It stops when nobody speaks.
// - rubberBand(): iOS-style rubber banding at the ends of a scroll area, then a spring back.
// - patch(): update a panel in place, so CSS transitions run instead of the DOM being rebuilt.
// - stagger(): container first, then children rise in 40ms apart; the old content leaves faster than the new arrives.

export const reducedMotion = () => document.body.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;

const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
export const speech = t => {
  const phrase = smooth(-0.8, -0.3, 0.6 * Math.sin(t * 2.7) + 0.5 * Math.sin(t * 1.53 + 1.2));
  const syllable = Math.max(0, Math.sin(t * 17 + 1.6 * Math.sin(t * 5.3)));
  const stress = 0.6 + 0.4 * Math.sin(t * 3.7 + 0.7);
  return phrase * (0.35 + 0.65 * syllable) * (0.25 + stress);
};

// Reading time for a text-only line: about 2.6 words a second, between 2 and 14 seconds.
export const readingMs = text => Math.min(14000, Math.max(2000, String(text || '').split(/\s+/).filter(Boolean).length * 385));

/** Draws a smooth three-strand ribbon into an SVG (viewBox 0 0 100 30). level 0 is a flat line. */
export function drawRibbon(svg, level, phase) {
  const paths = svg.querySelectorAll('path');
  paths.forEach((path, i) => {
    const amp = (0.6 + level * 11) * (1 - i * 0.22);
    let d = '';
    for (let x = 0; x <= 100; x += 2) {
      const win = Math.sin(Math.PI * x / 100) ** 1.6;                       // pinned at both ends, fullest in the middle
      const y = 15 + Math.sin(x / (11 + i * 3) + phase * (1 + i * 0.35) + i * 1.9) * win * amp;
      d += (x ? ' L' : 'M') + x + ' ' + y.toFixed(2);
    }
    path.setAttribute('d', d);
  });
}

export class Talk {
  constructor() { this.who = null; this.mode = 'idle'; this.audio = 0; this.level = 0; this.t = 0; this.until = 0; this.raf = 0; this.last = 0; this.orb = null; }
  /** who: 'guide' | 'character' | null. mode: 'audio' (real playback) | 'text' (text-only line) | 'idle'. */
  set(who, mode, text) {
    const key = who + '|' + mode + '|' + text;
    if (key === this.key) return;
    this.key = key; this.who = who; this.mode = mode;
    if (mode === 'text') this.until = performance.now() + readingMs(text);
    this.wake();
  }
  wake() { if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame(this.frame); } }
  frame = now => {
    this.raf = 0;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0; this.last = now;
    const reduced = reducedMotion();
    let target = 0;
    if (!reduced && this.mode === 'audio') target = this.audio;
    else if (!reduced && this.mode === 'text' && now < this.until) { this.t += dt; target = speech(this.t) * 0.75; }
    // Rise quickly, fall slower, like a level meter.
    this.level += (target - this.level) * (1 - Math.exp(-dt / (target > this.level ? 0.06 : 0.22)));
    const phase = now / 380;
    document.querySelectorAll('#guide .ribbon').forEach(r => drawRibbon(r, this.who === 'guide' ? this.level : 0, phase));
    document.querySelectorAll('#character .ribbon').forEach(r => drawRibbon(r, this.who === 'character' ? this.level : 0, phase));
    if (this.orb && !this.ending) {   // on the end page the orb performs on its own
      const guideTalking = this.who === 'guide' && target > 0;
      this.orb.set(guideTalking ? { level: this.level, speed: 0.7, energy: 0.18 } : { level: undefined, speed: 0, energy: 0.18 });
      this.orb.container.parentElement.style.setProperty('--talk', (this.who === 'guide' ? this.level : 0).toFixed(3));
    }
    const settled = target === 0 && this.level < 0.002;
    if (settled) { this.level = 0; document.querySelectorAll('.ribbon').forEach(r => drawRibbon(r, 0, phase)); return; }
    this.raf = requestAnimationFrame(this.frame);
  };
}

/** iOS rubber banding: past the end of a scroll area the content follows a shrinking fraction of the drag,
 *  then springs back. Works for wheel and trackpad (including momentum) and for touch. */
export function rubberBand(scroller, target = scroller) {
  let raw = 0, releaseTimer = 0, lastWheel = 0, cooling = false, touchY = null, touchBase = 0;
  const size = () => Math.max(160, scroller.clientHeight);
  const band = x => Math.sign(x) * (1 - 1 / (Math.abs(x) * 0.55 / size() + 1)) * size() * 0.35;
  const atTop = () => scroller.scrollTop <= 0;
  const atEnd = () => scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
  const show = () => { target.style.transition = 'none'; target.style.translate = `0 ${band(raw).toFixed(2)}px`; };
  const release = () => {
    clearTimeout(releaseTimer); if (!raw) return;
    raw = 0; cooling = true;
    target.style.transition = 'translate 560ms var(--spring)'; target.style.translate = '0 0';
    setTimeout(() => { cooling = false; }, 260);
  };
  scroller.addEventListener('wheel', e => {
    if (reducedMotion() || e.ctrlKey) return;
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    const now = performance.now(), gap = now - lastWheel; lastWheel = now;
    // Momentum that keeps arriving after a bounce belongs to the same gesture: let it go.
    if (cooling && gap < 120) return;
    const pullingTop = dy < 0 && atTop(), pullingEnd = dy > 0 && atEnd();
    if (raw === 0 && !pullingTop && !pullingEnd) return;
    e.preventDefault();
    raw -= dy;
    if ((pullingTop && raw < 0) || (pullingEnd && raw > 0) || (!pullingTop && !pullingEnd && Math.sign(raw) !== Math.sign(raw + dy))) raw = 0;
    show();
    clearTimeout(releaseTimer); releaseTimer = setTimeout(release, 90);
  }, { passive: false });
  scroller.addEventListener('touchstart', e => { if (e.touches.length === 1) { touchY = e.touches[0].clientY; touchBase = scroller.scrollTop; } }, { passive: true });
  scroller.addEventListener('touchmove', e => {
    if (touchY === null || reducedMotion()) return;
    const pull = e.touches[0].clientY - touchY;                              // + pulls down (towards the top edge)
    const over = pull > 0 && atTop() ? pull - touchBase : pull < 0 && atEnd() ? pull + (scroller.scrollHeight - scroller.clientHeight - touchBase) : 0;
    if ((pull > 0 && atTop() && over > 0) || (pull < 0 && atEnd() && over < 0)) { e.preventDefault(); raw = over; show(); }
    else if (raw) { raw = 0; show(); }
  }, { passive: false });
  const end = () => { touchY = null; release(); };
  scroller.addEventListener('touchend', end); scroller.addEventListener('touchcancel', end);
}

// ---- In-place updates ----
const sameShape = (a, b) => a.nodeType === b.nodeType && a.nodeName === b.nodeName &&
  (a.nodeType !== 1 || (a.childNodes.length === b.childNodes.length && [...a.childNodes].every((c, i) => sameShape(c, b.childNodes[i]))));
const HANDLERS = ['onclick', 'onsubmit', 'onchange', 'oninput'];
function sync(a, b) {
  if (a.nodeType === 3) { if (a.data !== b.data) a.data = b.data; return; }
  if (a.nodeType !== 1) return;
  for (const { name } of [...a.attributes]) if (!b.hasAttribute(name) && name !== 'style') a.removeAttribute(name);
  for (const { name, value } of [...b.attributes]) if (a.getAttribute(name) !== value) a.setAttribute(name, value);
  for (const h of HANDLERS) if (a[h] !== b[h]) a[h] = b[h];
  if ('disabled' in a) a.disabled = b.disabled;
  [...a.childNodes].forEach((c, i) => sync(c, b.childNodes[i]));
}
/** Replace parent's children with next, keeping existing nodes where the structure matches.
 *  Returns true when it patched in place, false when it had to replace. */
export function patch(parent, next) {
  const old = [...parent.childNodes];
  if (old.length === next.length && old.every((o, i) => sameShape(o, next[i]))) { old.forEach((o, i) => sync(o, next[i])); return true; }
  parent.replaceChildren(...next); return false;
}

/** Stage a panel change: a snapshot of the old content leaves fast (140ms, ease-in) while the new children
 *  rise 10px and fade in, 40ms apart (capped so the cascade stays under about 300ms). */
export function stagger(panel, oldSnapshot) {
  if (reducedMotion()) return;
  if (oldSnapshot) {
    const r = panel.getBoundingClientRect();
    if (r.width && r.height) {
      oldSnapshot.removeAttribute('id'); oldSnapshot.classList.add('leaving', 'ghost'); oldSnapshot.setAttribute('aria-hidden', 'true'); oldSnapshot.inert = true;
      Object.assign(oldSnapshot.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0, right: 'auto', bottom: 'auto', maxHeight: 'none' });
      oldSnapshot.scrollTop = panel.scrollTop;
      document.body.append(oldSnapshot);
      setTimeout(() => oldSnapshot.remove(), 200);
    }
  }
  [...panel.children].forEach((c, i) => { c.style.setProperty('--i', Math.min(i, 6)); c.classList.add('rise'); c.addEventListener('animationend', () => c.classList.remove('rise'), { once: true }); });
}

// ---- Portraits ----
// characters.png holds three square 724px panels side by side. Each portrait is drawn into a canvas with a
// cover crop (never stretched), redrawn whenever its box changes size (including while a card folds).
// A new speaker's image resolves like an image being generated: small square pixels settle from the top down,
// coarse to fine, with a faint shimmer on the cells that are resolving.
let sprite = null, spriteReady = null;
const loadSprite = () => { if (!sprite) { sprite = new Image(); sprite.src = 'assets/characters.png'; spriteReady = sprite.decode ? sprite.decode().catch(() => {}) : new Promise(r => { sprite.onload = r; }); } return spriteReady; };
const PANEL = 724, FOCUS_Y = 0.28;                                          // faces sit in the upper third
const cropFor = (i, w, h) => { const s = Math.max(w / PANEL, h / PANEL), sw = w / s, sh = h / s; return [i * PANEL + (PANEL - sw) / 2, (PANEL - sh) * FOCUS_Y, sw, sh]; };

export function mountPortrait(canvas, index, reveal) {
  const ctx = canvas.getContext('2d');
  let start = reveal && !reducedMotion() ? null : -1, raf = 0, cells = null, cellKey = '';
  const size = () => { const dpr = Math.min(2, devicePixelRatio || 1), w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr); if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; } return [w, h, dpr]; };
  const sharp = (w, h) => { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(sprite, ...cropFor(index, w, h), 0, 0, w, h); };
  const tiny = document.createElement('canvas'), tctx = tiny.getContext('2d');
  const frame = now => {
    raf = 0;
    const [w, h, dpr] = size(); if (!w || !h || !sprite?.complete) return;
    if (start === -1) { sharp(w, h); return; }
    if (start === null) start = now;
    const p = Math.min(1, (now - start) / 1150);
    const cell = Math.max(2, Math.round(4 * dpr)), cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    if (cellKey !== cols + 'x' + rows) {                                   // each cell resolves at its own moment, top first
      cellKey = cols + 'x' + rows; cells = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells[r * cols + c] = 0.08 + 0.62 * (r / rows) + 0.24 * Math.random();
    }
    // Unresolved layer: a mosaic whose blocks shrink from about 14px to 4px as generation progresses.
    const block = Math.max(cell, Math.round((14 - 10 * p) * dpr));
    tiny.width = Math.max(1, Math.ceil(w / block)); tiny.height = Math.max(1, Math.ceil(h / block));
    tctx.imageSmoothingEnabled = true; tctx.drawImage(sprite, ...cropFor(index, w, h), 0, 0, tiny.width, tiny.height);
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = Math.min(1, p / 0.12); ctx.imageSmoothingEnabled = false; ctx.drawImage(tiny, 0, 0, tiny.width * block, tiny.height * block);
    ctx.globalAlpha = 1;
    // Resolved cells show the sharp image; cells about to resolve shimmer.
    ctx.save(); ctx.beginPath();
    const glints = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const t = cells[r * cols + c];
      if (p >= t) ctx.rect(c * cell, r * cell, cell, cell);
      else if (t - p < 0.05) glints.push(c * cell, r * cell);
    }
    ctx.clip(); sharp(w, h); ctx.restore();
    ctx.fillStyle = '#fffdf8'; ctx.globalAlpha = 0.38;
    for (let k = 0; k < glints.length; k += 2) ctx.fillRect(glints[k], glints[k + 1], cell, cell);
    ctx.globalAlpha = 1;
    if (p < 1) raf = requestAnimationFrame(frame); else { start = -1; sharp(w, h); }
  };
  const draw = () => { if (!raf) raf = requestAnimationFrame(frame); };
  new ResizeObserver(draw).observe(canvas);
  loadSprite().then(draw);
}
