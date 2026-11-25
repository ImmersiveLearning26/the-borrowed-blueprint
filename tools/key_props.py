"""Key the explainer props off their chroma background, trim them and export web copies.

Usage (from the kit root):  python tools/key_props.py <folder of source images> [out_root]
Reads <ID>-<name>.jpg|png (green key RGB 0 255 0; P25 flag on magenta 255 0 255).
Writes  production/explainer-props/keyed/<ID>-<name>.png   (full-resolution master with alpha)
        app/assets/props/<ID>-<name>.webp                   (longest side at most 768 px, for the app)
        app/assets/props/props.json                          (size and aspect ratio per prop)

Method (Design Strategies library, 08_Motion_Graphics_Films): a soft colour key, then the key colour is clamped
only where it dominates (G down to (R+B)/2 for green), never a blanket despill, which turns cream and grey pink.
Small specks are dropped, and each prop is trimmed to its alpha bounds with a small margin.
"""
import json, os, sys
from collections import deque
import numpy as np
from PIL import Image

src = sys.argv[1]
root = sys.argv[2] if len(sys.argv) > 2 else '.'
keyed_dir = os.path.join(root, 'production/explainer-props/keyed'); os.makedirs(keyed_dir, exist_ok=True)
web_dir = os.path.join(root, 'app/assets/props'); os.makedirs(web_dir, exist_ok=True)
smooth = lambda a, b, x: np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))

def keep_main_parts(alpha):
    """Drop isolated specks: label components on a 4x-downsampled mask, keep parts >= 1.5% of the largest."""
    h, w = alpha.shape; s = 4
    m = alpha[::s, ::s] > 0.5; lab = np.zeros(m.shape, int); sizes = [0]; n = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]: continue
        n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; c = 0
        while q:
            y, x = q.popleft(); c += 1
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < m.shape[0] and 0 <= xx < m.shape[1] and m[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n; q.append((yy, xx))
        sizes.append(c)
    if n == 0: return alpha
    big = max(sizes); keep = np.array([sz >= 0.015 * big for sz in sizes]); keep[0] = False
    mask = keep[lab]
    # grow the kept mask back to full size with a small margin so soft edges survive
    full = np.kron(mask, np.ones((s, s), bool))[:h, :w]
    from PIL import ImageFilter
    grown = np.array(Image.fromarray((full * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 0
    return alpha * grown

meta = {}
for f in sorted(os.listdir(src)):
    if not f.lower().endswith(('.jpg', '.jpeg', '.png')): continue
    ident = os.path.splitext(f)[0]
    rgb = np.asarray(Image.open(os.path.join(src, f)).convert('RGB')).astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    magenta = ident.startswith('P25')
    dom = (np.minimum(r, b) - g) if magenta else (g - np.maximum(r, b))     # how strongly the key colour dominates
    alpha = 1 - smooth(28, 96, dom)                                          # soft matte
    alpha[alpha < 0.05] = 0
    alpha = keep_main_parts(alpha)
    # Clamp spill wherever the key colour dominates (edges, reflections, glass); no prop is meant to be that colour.
    spill = (dom > 0).astype(np.float32)
    out = rgb.copy()
    if magenta:
        m = np.minimum(r, b); excess = np.clip(m - g, 0, None) * spill
        out[..., 0] = r - excess; out[..., 2] = b - excess
    else:
        out[..., 1] = np.where(spill > 0, np.minimum(g, (r + b) / 2), g)
    rgba = np.dstack([np.clip(out, 0, 255), alpha * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    ys, xs = np.nonzero(alpha > 0.02); pad = 6
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad + 1), min(im.height, ys.max() + pad + 1))
    im = im.crop(box)
    im.save(os.path.join(keyed_dir, ident + '.png'), optimize=True)
    web = im.copy(); web.thumbnail((768, 768), Image.LANCZOS)
    web.save(os.path.join(web_dir, ident + '.webp'), 'WEBP', quality=90, method=6)
    edge_touch = [side for side, hit in (('left', box[0] == 0), ('top', box[1] == 0), ('right', box[2] == rgb.shape[1]), ('bottom', box[3] == rgb.shape[0])) if hit]
    meta[ident] = {'file': f'assets/props/{ident}.webp', 'width': web.width, 'height': web.height, 'aspect': round(web.width / web.height, 4),
                   **({'touchesFrame': edge_touch} if edge_touch else {})}
    print(f'{ident:28} {web.width}x{web.height}  {os.path.getsize(os.path.join(web_dir, ident + ".webp")) // 1024} KB' + (f'  touches frame: {",".join(edge_touch)}' if edge_touch else ''))
json.dump(meta, open(os.path.join(web_dir, 'props.json'), 'w'), indent=1)
print(len(meta), 'props')
