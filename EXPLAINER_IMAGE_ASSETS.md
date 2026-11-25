# Images I need: explainer props for The Borrowed Blueprint

**For you to generate.** These are the only pictures the explainers need (see `CLARITY_REVIEW_AND_EXPLAINER_PLAN.md`). I don't draw images or vector illustrations myself. Maps, arrows, stamps, timelines, ticks, labels, and every word or number are drawn in code over your props.

## Status (25 November 2026)

All 25 props were received and keyed with `tools/key_props.py`. The app copies are in `app/assets/props/` (WebP, at most 768 px, 1.6 MB in total, sizes in `props.json`). The originals and full-resolution keyed masters are in `production/explainer-props/`.

- **Rerun P10 (gold envelope):** the foil caught a strong green reflection in its lower right; after keying it shows an olive band and a rusty fringe along the bottom edge.
- **Rerun P22 (signed agreement), if possible:** the paper runs off three edges of the frame, so it has straight cut edges. It is usable if the sheet is always shown cropped.
- **P24 (Spanish flag):** the pole runs off the bottom of the frame. It is fine, because the pole can be shown cropped.
- The source images are 1024 px rather than 2K, which is enough for the sizes the explainers use.

## How to generate

- **Tool:** Nano Banana Pro (Gemini 3 Pro Image), aspect ratio **1:1**, resolution **2K**, one image per prompt. GPT-Image-2 or Kling Image 4.0 also work. (Same method as `library/image_prompt_template.md`.)
- **Use each prompt exactly as written.** Each one is the full template with the object filled in.
- **One object per image,** on a flat pure green background (RGB 0 255 0). The Nigerian flag uses magenta instead, because it is green.
- **Rerun an image if it has:** readable text or numbers, a green tint on the object, a shadow or floor on the background, more than one object, or a cartoon or 3D-render look.
- **Keep the set consistent:** same soft front-left light, same muted colour, and similar framing across all props.
- **No real people, no faces, no logos, no real building portraits.** The court is a generic model, not the actual Spanish or Nigerian court.

## How to deliver them

- Put them in one folder named `explainer-props/` and zip it, or add it to the kit at `app/assets/props/`.
- **Name each file by its ID and name,** for example `P04-gavel.png`. PNG or high-quality JPEG; 2048 px is fine.
- Leave the green background on. I key it out myself (colour key, then clamp green only where it dominates), trim each prop, and check them together on the map's real colours.
- If a prop can't be made cleanly, skip it and tell me; the explainer will fall back to a drawn element.

## Required props (23)

| ID | File | What it stands for | Used in |
|---|---|---|---|
| P01 | `P01-naira-bundle.png` | Federation Account money | F1, F17 |
| P02 | `P02-revenue-bowl.png` | The shared pot: Federation Account / national formula | F1, F8, F11, F17 |
| P03 | `P03-oil-barrel.png` | Oil revenue, derivation, resource control | F17 |
| P04 | `P04-gavel.png` | Courts and rulings | F1, F7, F12, F13, H7 |
| P05 | `P05-balance-scale.png` | Fairness; evidence weighed against a claim | F8, F9, H3, H4 |
| P06 | `P06-constitution-book.png` | Constitution, statutes, laws | F5, F7, F12 |
| P07 | `P07-coin-stack.png` | Taxes collected in a region | F6 |
| P08 | `P08-regional-strongbox.png` | A region keeping and managing its own taxes | F6, F10 |
| P09 | `P09-sealed-envelope.png` | A negotiated payment or deal | F3, F6, F10, F14 |
| P10 | `P10-gold-envelope.png` | A special deal for one region or state | F3, F14 |
| P11 | `P11-ballot-box.png` | The 2017 Catalan referendum | F7 |
| P12 | `P12-rubber-stamp.png` | Decrees, suspension, Article 155 (the stamp mark itself is drawn in code) | F7, F13, F16, H8 |
| P13 | `P13-padlock.png` | Intervention; powers taken over | F13, H8 |
| P14 | `P14-hourglass.png` | Time: 72 hours, research hours, reserve hours | F2, H1, H2 |
| P15 | `P15-desk-calendar.png` | The five-month limit | F16 |
| P16 | `P16-magnifier.png` | Checking a source | F4, H2 |
| P17 | `P17-case-folder.png` | The brief; evidence | F4, F9, H4 |
| P18 | `P18-round-table.png` | Multilateral meeting / sector conference | F2, F15, H6 |
| P19 | `P19-bilateral-table.png` | Bilateral commission: centre and one region | H5 |
| P20 | `P20-court-facade.png` | Constitutional Court / Supreme Court (generic, not a real building) | F1, F16, H7 |
| P21 | `P21-desk-microphone.png` | The retreat, a delegate speaking | F18 |
| P22 | `P22-signed-agreement.png` | Signed cooperation agreements | F15 |
| P23 | `P23-desk-calculator.png` | The funding formula | F8, F11 |

## Optional props (2)

| ID | File | What it stands for | Used in |
|---|---|---|---|
| P24 | `P24-flag-spain.png` | Spain (optional; the map already shows the country) | F3 |
| P25 | `P25-flag-nigeria.png` | Nigeria (optional). Uses a magenta key because the flag is green. | F1 |

## Prompts (copy one at a time)

### P01 · naira-bundle

Save as `P01-naira-bundle.png`. Federation Account money.

```
A neat bundle of paper banknotes in muted green, violet and brown tones held by a plain paper band, the printed details soft and unreadable, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P02 · revenue-bowl

Save as `P02-revenue-bowl.png`. The shared pot: Federation Account / national formula.

```
A wide, shallow polished brass bowl heaped with mixed coins, like a shared treasury pot, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P03 · oil-barrel

Save as `P03-oil-barrel.png`. Oil revenue, derivation, resource control.

```
A dented steel crude-oil drum painted dark blue-grey, with a small dark oil drip running down one side, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P04 · gavel

Save as `P04-gavel.png`. Courts and rulings.

```
A dark wooden judge's gavel resting on its round wooden sound block, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P05 · balance-scale

Save as `P05-balance-scale.png`. Fairness; evidence weighed against a claim.

```
An antique brass balance scale with two shallow pans, perfectly level, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P06 · constitution-book

Save as `P06-constitution-book.png`. Constitution, statutes, laws.

```
A thick closed book bound in dark red leather with a plain gold-tooled spine and raised bands, no lettering anywhere, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P07 · coin-stack

Save as `P07-coin-stack.png`. Taxes collected in a region.

```
A small neat stack of bimetallic gold-and-silver coins, the faces smooth and unreadable, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P08 · regional-strongbox

Save as `P08-regional-strongbox.png`. A region keeping and managing its own taxes.

```
A small wooden strongbox with iron corner bands and a closed hasp, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P09 · sealed-envelope

Save as `P09-sealed-envelope.png`. A negotiated payment or deal.

```
A plain cream paper envelope closed with a red wax seal that has a simple abstract pattern, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P10 · gold-envelope

Save as `P10-gold-envelope.png`. A special deal for one region or state.

```
A gold-foil paper envelope closed with a deep red wax seal, slightly luxurious, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P11 · ballot-box

Save as `P11-ballot-box.png`. The 2017 Catalan referendum.

```
A translucent plastic ballot box with a sealed lid and a folded paper ballot half inserted in its slot, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P12 · rubber-stamp

Save as `P12-rubber-stamp.png`. Decrees, suspension, Article 155 (the stamp mark itself is drawn in code).

```
A wooden-handled office rubber stamp standing upright, its rubber face hidden underneath, seen in clean side profile. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P13 · padlock

Save as `P13-padlock.png`. Intervention; powers taken over.

```
A heavy closed brass padlock with a steel shackle, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P14 · hourglass

Save as `P14-hourglass.png`. Time: 72 hours, research hours, reserve hours.

```
A brass-and-glass hourglass with pale sand, about half the sand fallen, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P15 · desk-calendar

Save as `P15-desk-calendar.png`. The five-month limit.

```
A desk flip calendar on a small metal stand, its pages blank, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P16 · magnifier

Save as `P16-magnifier.png`. Checking a source.

```
A brass magnifying glass with a dark wooden handle, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P17 · case-folder

Save as `P17-case-folder.png`. The brief; evidence.

```
A closed manila case folder with a few paper edges showing and a string tie, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P18 · round-table

Save as `P18-round-table.png`. Multilateral meeting / sector conference.

```
A small round wooden conference table with six matching chairs around it, empty, seen from a high three-quarter view looking down at about 45 degrees. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P19 · bilateral-table

Save as `P19-bilateral-table.png`. Bilateral commission: centre and one region.

```
A small rectangular wooden table with exactly two chairs facing each other across it, empty, seen from a high three-quarter view looking down at about 45 degrees. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P20 · court-facade

Save as `P20-court-facade.png`. Constitutional Court / Supreme Court (generic, not a real building).

```
A small architectural model of a neoclassical courthouse front with four stone columns and a pediment, plain stone with no inscription, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P21 · desk-microphone

Save as `P21-desk-microphone.png`. The retreat, a delegate speaking.

```
A slim conference-desk microphone on a round base with a short flexible neck, seen in clean side profile. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P22 · signed-agreement

Save as `P22-signed-agreement.png`. Signed cooperation agreements.

```
A fountain pen resting diagonally across a single sheet of cream paper with a handwritten flourish where a signature would be, no readable writing, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P23 · desk-calculator

Save as `P23-desk-calculator.png`. The funding formula.

```
A vintage beige desk calculator with a printed paper roll, the keys unmarked, seen from a three-quarter view slightly above. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P24 · flag-spain (optional)

Save as `P24-flag-spain.png`. Spain (optional; the map already shows the country).

```
A small rectangular fabric flag with three horizontal stripes, red, yellow and red, the yellow stripe twice as tall, no emblem, on a short wooden pole, gently rippling, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid green chroma key background RGB 0 255 0 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no green light spilling onto the object, no green on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

### P25 · flag-nigeria (optional)

Save as `P25-flag-nigeria.png`. Nigeria (optional). Uses a magenta key because the flag is green..

```
A small rectangular fabric flag with three vertical stripes, green, white and green, on a short wooden pole, gently rippling, seen straight on from the front at eye level. Photorealistic studio product photograph, a real physical object, sharp focus throughout, natural true-to-life materials and colours, slightly muted and desaturated, soft even diffused studio lighting from the front-left, no harsh highlights. IMPORTANT: exactly ONE centered object, the whole object fully in frame with a small margin, on a completely flat uniform pure vivid magenta chroma key background RGB 255 0 255 filling the entire frame edge to edge. No shadow cast on the background, no floor, no reflections, no magenta light spilling onto the object, no magenta on the object itself. Not an illustration, not paper, not a cut-out, not a collage, not a 3D render, not a cartoon. No text, no words, no letters, no numbers, no logos. Square image.
```

## Not needed as images

These will be drawn in code, so please don't generate them:

- Maps of Spain or Nigeria, regions, borders, routes or arrows
- Stamp marks ("UNLAWFUL", "SUSPENDED"), labels, captions, numbers, dates or timelines
- Icons for Transfer / Adapt / Reject, concede / defend / reframe, chips and gauges
- People, crowds or portraits (the characters already have portraits)
