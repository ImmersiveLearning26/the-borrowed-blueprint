"""Build the briefing films (F1–F4) as ONE continuous HyperFrames composition: a diagonal queue of glass cards.

Run from the kit root:  python production/films/build.py
Writes production/films/index.html, compositions/briefing.html and films.json (the cut points for the app).

Choreography (after the Annnimate "diagonal gallery", in our design system; see FILM_DESIGN_SYSTEM.md):
- The current beat is a large glass card in the middle; the next waits small at the bottom right; the last one
  shrinks to the top left; older ones drift further up-left and vanish. Each beat steps the whole queue on.
- The 14 beats of the four films form one queue, so every film ends with the next film's first card waiting at
  the bottom right, and the next film opens by stepping it into the middle: the films lead into each other.
- A rolling step number (01–14) sits bottom left; the copy beside the card slides out up and in from below
  through a mask; the film's kicker and two-line headline (ink + dim) sit above the card's left edge, led by the
  AI orb, which speaks for the whole briefing.
- Inside each card: the app's map with the location pin, glow outline and curving dashed paths ridden by the
  pulsing dot, or the supplied props on paper. Motion uses the app's curves.
"""
import json, math, re, pathlib, subprocess

KIT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).resolve().parent
cfg = json.load(open(KIT / 'app/assets/map-config.json'))
regions = json.load(open(KIT / 'app/assets/regions.json'))
props = json.load(open(KIT / 'app/assets/props/props.json'))
W, H = 1280, 720
west, south, east, north = cfg['bounds']; AW = cfg['width']
merc = lambda lat: 180 / math.pi * math.log(math.tan(math.pi / 4 + lat * math.pi / 360))
def xy(lon, lat): return ((lon - west) * AW / (east - west), (merc(north) - merc(lat)) * AW / (east - west))

# ---- layout (12-column grid, 64 px margins, 8 px rhythm)
M = 64
CW, CH = 480, 360                       # the large card (glass rim included)
RIM = 10; IW, IH = CW - 2 * RIM, CH - 2 * RIM
CX, CY = 400, H - M - CH                # card top-left: its bottom edge sits on the step number's baseline
THUMB, GAP, DRIFT = .22, .06, .5
COPY_X = CX + CW + 36; COPY_W = W - M - COPY_X
HEAD_Y = 144

NUM = re.compile(r'-?\d+\.?\d*')
def bbox(d):
    v = [float(x) for x in NUM.findall(d)]; return min(v[0::2]), min(v[1::2]), max(v[0::2]), max(v[1::2])
def shrink(d): return NUM.sub(lambda m: f'{float(m.group()):.1f}', d)
def country(name): return next(c for c in cfg['countries'] if c['name'] == name)
def prop_name(pid): return next(k for k in props if k.startswith(pid))

class View:
    """Fit a lon/lat box into a stage rectangle of a canvas (cw × ch px); maps atlas units to canvas pixels."""
    def __init__(self, lon0, lat0, lon1, lat1, stage, cw, ch):
        sx, sy, sw, sh = stage; x0, y0 = xy(lon0, lat1); x1, y1 = xy(lon1, lat0); self.cw, self.ch = cw, ch
        self.s = min(sw / (x1 - x0), sh / (y1 - y0))
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        self.vx, self.vy = cx - (sx + sw / 2) / self.s, cy - (sy + sh / 2) / self.s
    def px(self, lon, lat): x, y = xy(lon, lat); return round((x - self.vx) * self.s, 1), round((y - self.vy) * self.s, 1)
    def svg(self, inner, cls='map'):
        vw, vh = self.cw / self.s, self.ch / self.s
        rx0, ry0, rx1, ry1 = self.vx - vw * .2, self.vy - vh * .2, self.vx + vw * 1.2, self.vy + vh * 1.2
        land = ''.join(f'<path class="land" d="{shrink(c["path"])}"/>' for c in cfg['countries']
                       if (lambda b: b[0] < rx1 and b[2] > rx0 and b[1] < ry1 and b[3] > ry0)(bbox(c['path'])))
        return (f'<svg class="{cls}" data-layout-allow-overflow viewBox="{self.vx:.1f} {self.vy:.1f} {vw:.1f} {vh:.1f}" '
                f'width="{self.cw}" height="{self.ch}" aria-hidden="true">{land}{inner}</svg>')

STAGE = (20, 20, IW - 40, IH - 40)
NG = lambda: View(2.6, 4.0, 14.8, 13.9, STAGE, IW, IH)
ES = lambda: View(-9.6, 35.6, 4.4, 44.0, STAGE, IW, IH)
BR = lambda: View(-12.0, 3.0, 16.0, 45.5, STAGE, IW, IH)

# ---- small building blocks (all positions in card-inner pixels)
def pin_el(pid, x, y): return f'<div id="{pid}" class="pin" style="left:{x - 18:.0f}px;top:{y - 54:.0f}px"><i class="ripple"></i><img src="assets/pin.png" alt=""/></div>'
def pill_el(pid, x, y, text, extra=''): return f'<div id="{pid}" class="pill lite" style="left:{x:.0f}px;top:{y:.0f}px{extra}">{text}</div>'
def img_el(iid, pid, x, y, s): return f'<img id="{iid}" class="prop" src="assets/props/{prop_name(pid)}.png" alt="" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px"/>'
def curve(cid, d):
    return (f'<mask id="{cid}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="{IW}" height="{IH}"><path id="{cid}-r" class="rev" d="{d}" pathLength="1"/></mask>'
            f'<path id="{cid}" class="curve" d="{d}" mask="url(#{cid}-m)"/>')
def overlay(inner): return f'<svg class="map" width="{IW}" height="{IH}" aria-hidden="true">{inner}</svg>'
def trav(tid): return f'<div id="{tid}" class="trav"><i></i></div>'
def s_curve(x0, y0, x1, y1, bend=.3):
    dx, dy = x1 - x0, y1 - y0; n = math.hypot(dx, dy) or 1; nx, ny = -dy / n, dx / n; b = n * bend
    c1 = (x0 + dx * .3 + nx * b, y0 + dy * .3 + ny * b); c2 = (x0 + dx * .7 - nx * b, y0 + dy * .7 - ny * b)
    return f'M {x0:.0f} {y0:.0f} C {c1[0]:.0f} {c1[1]:.0f} {c2[0]:.0f} {c2[1]:.0f} {x1:.0f} {y1:.0f}'

FAST_TRACK = {'Cataluña', 'País Vasco', 'Galicia', 'Andalucía', 'Foral de Navarra'}   # illustrative: earlier, wider powers
DEAL = {'País Vasco', 'Foral de Navarra'}
def spain_regions(gid, with_canary=False):
    v = ES(); comm = [r for r in regions if r['country'] == 'ESP' and r['name'] not in ('Ceuta', 'Melilla')]
    main = sorted([r for r in comm if r['name'] != 'Canary Is.'], key=lambda r: bbox(r['path'])[1])
    rp = lambda r: f'<path class="reg{" fast" if r["name"] in FAST_TRACK else ""}{" deal" if r["name"] in DEAL else ""}" d="{shrink(r["path"])}"/>'
    inset = frame = ''
    if with_canary:
        canary = next(r for r in comm if r['name'] == 'Canary Is.'); cb = bbox(canary['path']); iw = 120; ix = 24
        k = iw / v.s / (cb[2] - cb[0]); ih = (cb[3] - cb[1]) * k * v.s; iy = IH - 24 - ih
        tx = v.vx + ix / v.s - cb[0] * k; ty = v.vy + iy / v.s - cb[1] * k
        inset = f'<g transform="translate({tx:.1f} {ty:.1f}) scale({k:.4f})">{rp(canary)}</g>'
        frame = f'<div id="{gid}-inset" class="inset" style="left:{ix - 10}px;top:{iy - 10:.0f}px;width:{iw + 20}px;height:{ih + 20:.0f}px"></div>'
    es = country('Spain')
    return v, v.svg(f'<g id="{gid}">{"".join(rp(r) for r in main)}{inset}</g><path class="edge" d="{shrink(es["path"])}"/>') + frame

# ---- the beats: (film, kicker/headline for the film's first beat, copy title, copy text, card builder, beat time)
# Card builders return (inner html, paper background?, js to run with the card's landing time T).
def c_abuja():
    v = NG(); ng = country('Nigeria'); adm = ''.join(f'<path class="adm" d="{shrink(r["path"])}"/>' for r in regions if r['country'] == 'NGA')
    ax, ay = v.px(7.49, 9.06)
    return (v.svg(f'<g>{adm}</g><path id="k1-ng" class="glow" d="{shrink(ng["path"])}" pathLength="1"/>') +
            pin_el('k1-pin', ax, ay) + pill_el('k1-l', ax + 24, ay - 52, 'Abuja'), False,
            "draw('#k1-ng',T+.25,.9);pin('#k1-pin',T+.4);pill('#k1-l',T+.55);")
def c_account():
    a, b = s_curve(236, 170, 300, 100, .25), s_curve(236, 170, 300, 252, .25)
    return (img_el('k2-bowl', 'P02', 28, 70, 200) + overlay(curve('k2-a', a) + curve('k2-b', b)) +
            pill_el('k2-p1', 312, 80, '● The centre') + pill_el('k2-p2', 312, 232, '● 36 states') + trav('k2-t1') + trav('k2-t2'), True,
            "ride('#k2-a','#k2-a-r','#k2-t1',T+.35,.55);ride('#k2-b','#k2-b-r','#k2-t2',T+.45,.55);pill('#k2-p1',T+.8);pill('#k2-p2',T+.9);")
def c_court():
    return (img_el('k3-court', 'P20', 60, 30, 230) + img_el('k3-gavel', 'P04', 300, 130, 130) +
            pill_el('k3-stamp', 140, 270, 'Dispute', ';color:#c2410c'), True,
            "tl.fromTo('#k3-gavel',{rotation:-28,transformOrigin:'80% 80%'},{rotation:0,duration:.35,ease:'back.out(2.4)',immediateRender:false},T+.55);"
            "tl.fromTo('#k3-stamp',{opacity:0,scale:1.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2)',immediateRender:false},T+.8);")
def c_hours():
    return (img_el('k4-hg', 'P14', 36, 60, 220) + '<div class="big72" style="left:270px;top:64px">72</div>'
            '<div class="unit" style="left:276px;top:232px">hours</div>', True,
            "tl.fromTo('#k4-hg',{rotation:0},{rotation:180,duration:.6,ease:'back.inOut(1.4)',immediateRender:false},T+.5);")
def c_meet():
    return (img_el('k5-table', 'P18', 16, 60, 210) + pill_el('k5-p1', 240, 100, '● The centre') + pill_el('k5-p2', 240, 200, '● 36 states'), True,
            "pill('#k5-p1',T+.5);pill('#k5-p2',T+1.0);")
def c_question():
    ys = [72, 170, 268]
    cs = ''.join(curve(f'k6-q{i}', s_curve(168, 170, 352, y, .18)) for i, y in enumerate(ys))
    qs = ''.join(f'<div id="k6-b{i}" class="qt lite" style="left:356px;top:{y - 32}px">?</div>' for i, y in enumerate(ys))
    return (img_el('k6-table', 'P18', 16, 100, 150) + overlay(cs) + qs + ''.join(trav(f'k6-t{i}') for i in range(3)), True,
            "for(let i=0;i<3;i++){ride('#k6-q'+i,'#k6-q'+i+'-r','#k6-t'+i,T+.35+i*.12,.6);pop('#k6-b'+i,T+1.0+i*.12);}")
def c_spain():
    v = ES(); es = country('Spain'); mx, my = v.px(-3.7, 40.42)
    return (v.svg(f'<path id="k7-es" class="glow" d="{shrink(es["path"])}" pathLength="1"/>') + pin_el('k7-pin', mx, my) +
            pill_el('k7-l', mx + 24, my - 52, 'Madrid'), False, "draw('#k7-es',T+.25,1.0);pin('#k7-pin',T+.55);pill('#k7-l',T+.7);")
def c_regions():
    v, svg = spain_regions('k8-regs', True)
    return (svg + '<div id="k8-c" class="pill lite count17" style="left:318px;top:250px"><b id="k8-n">0</b> regions</div>', False,
            "tl.fromTo('#k8-regs .reg',{fill:'#e9dfc7'},{fill:'#fbf6ea',duration:.14,stagger:.05,ease:'none',immediateRender:false},T+.3);"
            "pill('#k8-c',T+.3);tl.fromTo('#k8-n',{textContent:0},{textContent:17,duration:.85,snap:{textContent:1},ease:'power1.out',immediateRender:false},T+.3);")
def c_powers():
    v, svg = spain_regions('k9-regs')
    return (svg + pill_el('k9-p1', 236, 226, '<span class="sw" style="background:#e8a86b"></span>Wider, sooner') +
            pill_el('k9-p2', 236, 276, '<span class="sw" style="background:#fbf6ea"></span>Added later'), False,
            "tl.fromTo('#k9-regs .reg.fast',{fill:'#fbf6ea'},{fill:'#e8a86b',duration:.2,stagger:.06,ease:'power1.out',immediateRender:false},T+.35);"
            "pill('#k9-p1',T+.5);pill('#k9-p2',T+.6);")
def c_deals():
    v, svg = spain_regions('k10-regs')
    ic = lambda p: f'<img class="ic" src="assets/props/{prop_name(p)}.png" alt=""/>'
    return (svg + pill_el('k10-p1', 220, 218, ic('P10') + 'Own tax deal') + pill_el('k10-p2', 220, 272, ic('P09') + 'Common formula'), False,
            "tl.fromTo('#k10-regs .reg.deal',{fill:'#fbf6ea'},{fill:'#f0cf7a',duration:.2,ease:'power1.out',immediateRender:false},T+.35);"
            "pill('#k10-p1',T+.45);pill('#k10-p2',T+.6);")
def c_conflict():
    v, svg = spain_regions('k11-regs'); cx, cy = v.px(2.17, 41.39); bx, by = v.px(-2.6, 43.0)
    return (svg + pin_el('k11-pin', cx, cy) + pill_el('k11-l', cx - 128, cy - 52, 'Catalonia') +
            f'<div id="k11-r1" class="ring" style="left:{cx:.0f}px;top:{cy - 6:.0f}px"></div><div id="k11-r2" class="ring" style="left:{bx:.0f}px;top:{by:.0f}px"></div>', False,
            "pin('#k11-pin',T+.35);pill('#k11-l',T+.5);"
            "tl.fromTo('#k11-r1',{opacity:.95,scale:.5},{opacity:0,scale:2.6,duration:.9,ease:'power2.out',repeat:1,repeatDelay:.05,immediateRender:false},T+.75);"
            "tl.fromTo('#k11-r2',{opacity:.95,scale:.5},{opacity:0,scale:2.6,duration:.9,ease:'power2.out',immediateRender:false},T+1.05);")
def c_role():
    return (img_el('k12-folder', 'P17', 110, 26, 240) + pill_el('k12-l', 172, 272, 'Your brief'), True,
            "tl.fromTo('#k12-folder',{y:14},{y:0,duration:.5,ease:'back.out(1.6)',immediateRender:false},T+.3);pill('#k12-l',T+.55);")
def bridge(cid, live):
    v = BR(); es, ng = country('Spain'), country('Nigeria')
    sx, sy = v.px(-3.7, 40.42); nx, ny = v.px(7.49, 9.06); d = s_curve(sx + 6, sy + 10, nx - 4, ny - 56, .30)
    html = (v.svg(f'<path id="{cid}-es" class="glow{"" if live else " on"}" d="{shrink(es["path"])}" pathLength="1"/>'
                  f'<path id="{cid}-ng" class="glow{"" if live else " on"}" d="{shrink(ng["path"])}" pathLength="1"/>') +
            overlay(curve(f'{cid}-j', d)) + pin_el(f'{cid}-p1', sx, sy) + pill_el(f'{cid}-l1', sx + 24, sy - 52, 'Spain') +
            pin_el(f'{cid}-p2', nx, ny) + pill_el(f'{cid}-l2', nx + 24, ny - 52, 'Nigeria'))
    return html
def c_borrow():
    return (bridge('k13', True) + trav('k13-t') + '<div id="k13-b" class="pill lite" style="left:0;top:0">borrow?</div>', False,
            "draw('#k13-es',T+.2,.5);pin('#k13-p1',T+.25);pill('#k13-l1',T+.4);draw('#k13-ng',T+.45,.5);pin('#k13-p2',T+.5);pill('#k13-l2',T+.65);"
            "ride('#k13-j','#k13-j-r','#k13-t',T+.8,1.2);pill('#k13-b',T+1.3);")
def c_break():
    cross = (KIT / 'production/films/assets/marks/cross-rounded.svg').read_text(); path = re.search(r'd="([^"]+)"', cross).group(1)
    return (bridge('k14', False) + f'<svg id="k14-x" class="xmark" viewBox="232 410 124 120" width="56" height="54" aria-hidden="true"><path fill="#EA3442" d="{path}"/></svg>', False,
            "tl.fromTo('#k14-x',{opacity:0,scale:.4,rotation:-20,transformOrigin:'50% 50%'},{opacity:1,scale:1,rotation:0,duration:.5,ease:'back.out(2.2)',immediateRender:false},T+.75);")

FILMS = [('F1', 'N01', 0.0, 4.5), ('F2', 'N02', 4.5, 6.8), ('F3', 'N03', 11.3, 9.4), ('F4', 'N04', 20.7, 6.6)]
HEADS = {'F1': ('Part one', 'The dispute', 'in Abuja'), 'F2': ('Part two', 'The meeting', 'in 72 hours'),
         'F3': ('Part three', 'The model', 'on the table'), 'F4': ('Part four', 'Your brief', 'borrow or break')}
# beat times are local to their film and land on the recorded phrase that names them
BEATS = [
    ('F1', .05, 'Abuja', 'Nigeria’s <b>capital</b>.', c_abuja),
    ('F1', 1.2, 'Federation Account', '<b>Shared</b> revenue.', c_account),
    ('F1', 2.55, 'Supreme Court', 'Now a <b>legal dispute</b>.', c_court),
    ('F2', .12, '72 hours', 'Until the <b>meeting</b>.', c_hours),
    ('F2', 1.45, 'Who meets', 'Centre and <b>36 states</b>.', c_meet),
    ('F2', 3.3, 'The question', 'How should disputes <b>be settled</b>?', c_question),
    ('F3', .12, 'Spain', 'The <b>model</b> on the table.', c_spain),
    ('F3', 2.35, 'Seventeen regions', 'Called <b>autonomous communities</b>.', c_regions),
    ('F3', 3.7, 'Different powers', '<b>Wider</b> for some.', c_powers),
    ('F3', 5.05, 'Different fiscal deals', 'Two keep <b>own taxes</b>.', c_deals),
    ('F3', 6.55, 'The catch', 'The conflict <b>never fully went away</b>.', c_conflict),
    ('F4', .12, 'Your role', 'You are <b>the analyst</b>.', c_role),
    ('F4', 1.65, 'The question', 'What can Nigeria <b>borrow</b>?', c_borrow),
    ('F4', 3.8, 'The limit', 'Where does it <b>break</b>?', c_break),
]
start = {f: s for f, _, s, _ in FILMS}
TOTAL = round(sum(d for *_, d in FILMS), 2)

cards, copies, inner_js, times = [], [], [], []
for i, (film, lt, title, text, fn) in enumerate(BEATS):
    t = round(start[film] + lt, 2); times.append(t)
    html, paper, js = fn()
    cards.append(f'<div id="card{i}" class="card pane" data-layout-ignore><div class="inner{" paper" if paper else ""}">{html}</div></div>')
    copies.append(f'<div id="cp{i}" class="cp"><div class="lw"><p class="ln ct">{title}</p></div><div class="lw"><p class="ln cx">{text}</p></div></div>')
    inner_js.append('{const T=%s;%s}' % (t, js))
film_first = {}
for i, (film, *_r) in enumerate(BEATS): film_first.setdefault(film, i)
heads = ''.join(f'<div id="hd{j}" class="hd"><div class="lw"><p class="ln kick">{HEADS[f][0]}</p></div>'
                f'<div class="lw lw-h"><p class="ln h1">{HEADS[f][1]}</p></div><div class="lw lw-h"><p class="ln h1 dim">{HEADS[f][2]}</p></div></div>'
                for j, (f, *_r) in enumerate(FILMS))
head_times = [times[film_first[f]] for f, *_r in FILMS]

backdrop = View(-22.0, -2.0, 32.0, 50.0, (0, 0, W, H), W, H).svg('', 'map backdrop')
orb_imgs = ''.join(f'<img src="assets/orb/orb-{i:02d}.png" alt=""/>' for i in range(12))
digits = ''.join('<span class="dg"><span class="dgc">' + ''.join(f'<span>{d}</span>' for d in range(10)) + '</span></span>' for _ in range(2))

CSS = f"""
@font-face{{font-family:'Afacad';src:url('assets/fonts/afacad.ttf');font-weight:400 700}}
@font-face{{font-family:'Manrope';src:url('assets/fonts/manrope.ttf');font-weight:200 800}}
#root{{position:absolute;inset:0;overflow:hidden;background:transparent;font-family:'Manrope',sans-serif;color:#1d2321}}
.map{{position:absolute;left:0;top:0}}
.backdrop .land{{fill:#ebe3cf;stroke:#c9c1ac}}
.hd,.cp,.count,.orb{{z-index:5}}
.hd,.cp,.count{{text-shadow:0 0 14px rgba(244,241,236,.95),0 0 3px rgba(244,241,236,.9)}}
.veil{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(244,241,236,.72),rgba(244,241,236,.5))}}
.land{{fill:rgba(233,223,199,.9);stroke:#8b897c;stroke-width:1.1;vector-effect:non-scaling-stroke}}
.adm{{fill:none;stroke:#aaa18c;stroke-width:.7;vector-effect:non-scaling-stroke;opacity:.7}}
.reg{{fill:#fbf6ea;stroke:#8b897c;stroke-width:.8;vector-effect:non-scaling-stroke}}
.edge{{fill:none;stroke:#ff7a1a;stroke-width:2;vector-effect:non-scaling-stroke;stroke-linejoin:round}}
.glow{{fill:none;stroke:#ff7a1a;stroke-width:2.4;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}}
.glow.on{{stroke-dashoffset:0}}
.glass{{background:rgba(252,251,247,.62);backdrop-filter:blur(22px) saturate(165%);-webkit-backdrop-filter:blur(22px) saturate(165%);
 box-shadow:inset 2px 2px 1px 0 rgba(255,255,255,.55),inset -1px -1px 1px 1px rgba(255,255,255,.45),0 6px 6px rgba(0,0,0,.12),0 0 20px rgba(0,0,0,.08)}}
.lite{{background:rgba(252,251,247,.9);box-shadow:inset 1px 1px 1px 0 rgba(255,255,255,.7),0 4px 6px rgba(0,0,0,.12),0 0 14px rgba(0,0,0,.06)}}
.pane{{background:linear-gradient(135deg,rgba(255,255,255,.30),rgba(255,255,255,.07) 42%,rgba(255,255,255,.04) 60%,rgba(255,255,255,.16));border:1px solid rgba(255,255,255,.62);box-shadow:inset 1.5px 1.5px 1px rgba(255,255,255,.75),inset -1px -1px 1px rgba(255,255,255,.35),0 14px 34px rgba(29,35,33,.10),0 2px 6px rgba(29,35,33,.06)}}
.card{{position:absolute;left:{CX}px;top:{CY}px;width:{CW}px;height:{CH}px;border-radius:32px;padding:{RIM}px;will-change:transform}}
.inner{{position:relative;width:{IW}px;height:{IH}px;border-radius:{32 - RIM + 2}px;overflow:hidden;background:transparent}}
.inner.paper{{background:transparent}}
.prop{{position:absolute;object-fit:contain}}
.pin{{position:absolute;width:36px;height:54px;opacity:0}}
.pin img{{position:absolute;inset:0;width:36px;height:54px}}
.ripple{{position:absolute;left:-6px;top:44px;width:48px;height:18px;border-radius:50%;border:2px solid #ff7a1a;box-shadow:0 0 12px #ff7a1a88;opacity:0}}
.pill{{position:absolute;display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:14px;font-weight:700;font-size:20px;line-height:1.2;white-space:nowrap;opacity:0}}
.pill .ic{{width:28px;height:28px;object-fit:contain}}
.sw{{width:22px;height:16px;border-radius:5px;border:1px solid #8b897c;display:inline-block}}
.count17{{font-size:20px}} .count17 b{{font-family:'Afacad',sans-serif;font-weight:600;font-size:40px;line-height:1;font-variant-numeric:tabular-nums}}
.big72{{position:absolute;font-family:'Afacad',sans-serif;font-weight:600;font-size:168px;line-height:1;letter-spacing:-.04em}}
.unit{{position:absolute;font-weight:700;font-size:24px;letter-spacing:.16em;text-transform:uppercase;color:#53625d}}
.qt{{position:absolute;width:64px;height:64px;border-radius:50%;opacity:0;display:grid;place-items:center;font-family:'Afacad',sans-serif;font-weight:600;font-size:36px}}
.curve{{fill:none;stroke:#1d2321;stroke-opacity:.6;stroke-width:2.5;stroke-linecap:round;stroke-dasharray:8 10}}
.rev{{fill:none;stroke:#fff;stroke-width:28;stroke-dasharray:1;stroke-dashoffset:1}}
.trav{{position:absolute;left:-9px;top:-9px;width:18px;height:18px;border-radius:50%;background:#ff7a1a;border:3px solid #fffdf9;box-shadow:0 2px 6px #1d232144;opacity:0}}
.trav i{{position:absolute;inset:-9px;border-radius:50%;border:2px solid #ff7a1a;opacity:0}}
.ring{{position:absolute;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:3px solid #ff7a1a;opacity:0}}
.inset{{position:absolute;border:1.5px dashed #8b897c;border-radius:12px}}
.xmark{{position:absolute;left:0;top:0;opacity:0;filter:drop-shadow(0 4px 8px #1d232133)}}
/* type: kicker → headline (ink, then dim) above the card; copy title → line beside it */
.orb{{position:absolute;left:{CX}px;top:{M}px;width:48px;height:48px}}
.orb img{{position:absolute;inset:-6px;width:60px;height:60px;opacity:0}}
.hd{{position:absolute;left:{CX}px;top:{M}px;width:{W - M - CX}px}}
.lw{{overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}}
.ln{{margin:0}}
.kick{{margin:12px 0 0 64px;font-weight:700;font-size:20px;line-height:1.2;letter-spacing:.16em;text-transform:uppercase;color:#53625d}}
.lw-h:first-of-type{{margin-top:0}}
.hd .lw-h{{}}
.h1{{font-family:'Afacad',sans-serif;font-weight:600;font-size:56px;line-height:1;letter-spacing:-.025em}}
.hd>.lw:nth-child(2){{margin-top:{HEAD_Y - M - 36}px}}
.dim{{color:#5f6964}}
.cp{{position:absolute;left:{COPY_X}px;top:{CY}px;width:{COPY_W}px}}
.ct{{font-family:'Afacad',sans-serif;font-weight:600;font-size:32px;line-height:1.1;letter-spacing:-.01em}}
.cp>.lw+.lw{{margin-top:12px}}
.cx{{font-weight:500;font-size:21px;line-height:1.42;color:#53625d}}
.cx b{{font-weight:700;color:#1d2321}}
.count{{position:absolute;left:{M}px;bottom:{M}px;display:flex;align-items:baseline;gap:12px}}
.num{{display:inline-flex;font-family:'Afacad',sans-serif;font-weight:500;font-size:128px;line-height:1;letter-spacing:-.04em;margin-bottom:-.12em}}
.dg{{display:inline-block;height:1em;overflow:hidden}}
.dgc{{display:block}} .dgc>span{{display:block;height:1em}}
.tot{{font-weight:600;font-size:20px;color:#5f6964}}"""

JS = f"""
const tl=gsap.timeline({{paused:true}});
const E={{out:'power3.out',in:'power2.in',move:'power2.inOut',pop:'back.out(1.6)',land:'back.out(1.15)'}};
const CW={CW},CH={CH},TH={THUMB},GAP={GAP},DRIFT={DRIFT},N={len(BEATS)};
// where a card sits relative to the current one (diagonal queue): 0 large; 1 next, bottom right; -1 last, top left
function pose(rel){{const sw=CW*TH,sh=CH*TH,nx=CW/2+CW*GAP+sw/2,ny=CH/2-sh/2;
  if(rel===0)return {{x:0,y:0,scale:1,z:3}};
  if(rel===1)return {{x:nx,y:ny,scale:TH,z:2}};
  if(rel===-1)return {{x:-nx,y:-ny,scale:TH,z:1}};
  if(rel>1)return {{x:nx,y:ny,scale:0,z:0}};
  const d=(sw+CW*GAP)*DRIFT;return {{x:-nx-d,y:-ny-d,scale:0,z:0}};}}
const cards=[];for(let i=0;i<N;i++)cards.push(document.getElementById('card'+i));
cards.forEach((c,i)=>{{const p=pose(i+1);tl.set(c,{{x:p.x,y:p.y,scale:p.scale,zIndex:p.z,transformOrigin:'50% 50%',force3D:true}},0);}});
function step(k,t){{cards.forEach((c,i)=>{{const a=i-(k-1),b=i-k;if(Math.abs(a)>2&&Math.abs(b)>2)return;const p=pose(b);
  tl.set(c,{{zIndex:p.z}},t);tl.to(c,{{x:p.x,y:p.y,scale:p.scale,duration:.85,ease:b===0?E.land:E.move}},t);}});}}
// masked lines: out upward (fast), in from below (slower, staggered)
const lines=id=>'#'+id+' .ln';
gsap.set('.ln',{{yPercent:110,autoAlpha:0}});tl.set('.ln',{{yPercent:110,autoAlpha:0}},0);
function swapIn(id,prev,t){{if(prev)tl.to(lines(prev),{{yPercent:-110,autoAlpha:0,duration:.25,ease:E.in}},t);
  tl.to(lines(id),{{yPercent:0,autoAlpha:1,duration:.6,ease:E.out,stagger:.06}},t+.18);}}
// rolling step number
const cols=[...document.querySelectorAll('.dgc')];tl.set(cols,{{yPercent:0}},0);
function roll(n,t){{const s=String(n).padStart(2,'0');cols.forEach((c,p)=>tl.to(c,{{yPercent:-Number(s[p])*10,duration:.85,ease:E.move}},t));}}
// details inside a card
const pin=(sel,t)=>{{tl.fromTo(sel,{{opacity:0,y:-22}},{{opacity:1,y:0,duration:.45,ease:'back.out(2)',immediateRender:false}},t);
  tl.fromTo(sel+' .ripple',{{opacity:.9,scale:.4}},{{opacity:0,scale:2.6,duration:.9,ease:E.out,immediateRender:false}},t+.25);}};
const pill=(sel,t)=>tl.fromTo(sel,{{opacity:0,x:-8}},{{opacity:1,x:0,duration:.32,ease:E.out,immediateRender:false}},t);
const pop=(sel,t)=>tl.fromTo(sel,{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.4,ease:E.pop,immediateRender:false}},t);
const draw=(sel,t,d)=>tl.fromTo(sel,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:d,ease:E.move,immediateRender:false}},t);
const RIDES=[];
function ride(path,mask,dot,t,d){{const p=document.querySelector(path),L=p.getTotalLength()||1,dv=document.querySelector(dot);
  const at=k=>{{const q=p.getPointAtLength(Math.max(0,Math.min(1,k))*L);dv.style.left=q.x+'px';dv.style.top=q.y+'px';}};at(0);
  RIDES.push({{t:t,d:d,at:at,ease:gsap.parseEase(E.move)}});
  tl.fromTo(mask,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:d,ease:E.move,immediateRender:false}},t);
  tl.fromTo(dot,{{opacity:0}},{{opacity:1,duration:.12,immediateRender:false}},t);
  tl.to(dot,{{opacity:0,duration:.2}},t+d+.4);
  tl.fromTo(dot+' i',{{opacity:.9,scale:1}},{{opacity:0,scale:3.2,duration:.8,ease:E.out,repeat:Math.max(0,Math.round(d/.8)),immediateRender:false}},t);}}
tl.eventCallback('onUpdate',()=>{{const now=tl.time();for(const r of RIDES)r.at(r.ease(Math.max(0,Math.min(1,(now-r.t)/r.d))));}});
// static placement on the Spain–Nigeria curve (borrow? label, the cross)
for(const id of ['k13','k14']){{const p=document.getElementById(id+'-j'),L=p.getTotalLength(),m=p.getPointAtLength(L*.5),b=p.getPointAtLength(L*.34);
  const x=document.getElementById(id+'-x');if(x){{x.style.left=(m.x-28)+'px';x.style.top=(m.y-27)+'px';}}
  const bp=document.getElementById(id+'-b');if(bp){{bp.style.left=(b.x+20)+'px';bp.style.top=(b.y-18)+'px';}}}}
tl.set('#k14-j-r',{{strokeDashoffset:0}},0);tl.set('#k14-j',{{strokeOpacity:.3}},0);
['#k14-p1','#k14-p2','#k14-l1','#k14-l2'].forEach(s=>tl.set(s,{{opacity:1}},0));
// the AI orb speaks for the whole briefing (captured frames of the app's orb, stepped 12 per second)
const orbImgs=[...document.querySelectorAll('.orb img')];
tl.fromTo('.orb',{{scale:.6,opacity:0}},{{scale:1,opacity:1,duration:.4,ease:E.pop}},0);
for(let f=0;f<Math.floor({TOTAL}*12);f++){{tl.set(orbImgs,{{opacity:0}},f/12);tl.set(orbImgs[f%orbImgs.length],{{opacity:1}},f/12);}}
"""
beats_js = []
for i, t in enumerate(times):
    beats_js.append(f"step({i},{t});roll({i + 1},{t});swapIn('cp{i}',{repr('cp' + str(i - 1)) if i else 'null'},{t});")
for j, t in enumerate(head_times):
    beats_js.append(f"swapIn('hd{j}',{repr('hd' + str(j - 1)) if j else 'null'},{max(0.0, t - .05)});")

comp = f"""<template>
<style>{CSS}
</style>
<div id="root" data-composition-id="briefing" data-width="{W}" data-height="{H}">
<div class="orb">{orb_imgs}</div>
{heads}
{''.join(cards)}
{''.join(copies)}
<p class="count" aria-hidden="true" data-layout-ignore><span class="num">{digits}</span><span class="tot">/ {len(BEATS):02d}</span></p>
</div>
<script>{JS}
{chr(10).join(beats_js)}
{chr(10).join(inner_js)}
tl.set({{}},{{}},{TOTAL});
window.__timelines["briefing"]=tl;
</script>
</template>
"""
for old in (OUT / 'compositions').glob('f[1-4].html'): old.unlink()
(OUT / 'compositions' / 'briefing.html').write_text(comp)

audio = []
for f, clip, s, d in FILMS:
    adur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(OUT / 'assets/audio' / f'{clip}.mp3')], capture_output=True, text=True).stdout)
    audio.append(f'      <audio id="vo-{clip}" class="clip" src="assets/audio/{clip}.mp3" data-start="{s:.2f}" data-duration="{min(adur, d):.2f}" data-track-index="10" data-volume="1"></audio>')
(OUT / 'index.html').write_text(f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <!-- The Borrowed Blueprint · briefing films F1–F4 as one diagonal queue (built by build.py; edit there and rebuild). -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: transparent; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="{W}" data-height="{H}" data-fps="30">
      <div id="briefing" data-composition-id="briefing" data-composition-src="compositions/briefing.html" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>
{chr(10).join(audio)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
""")
json.dump({'films': [{'id': f, 'clip': c, 'start': s, 'duration': d} for f, c, s, d in FILMS], 'total': TOTAL}, open(OUT / 'films.json', 'w'), indent=1)
print('built', len(BEATS), 'beats in one queue,', TOTAL, 's; beat times', times)
