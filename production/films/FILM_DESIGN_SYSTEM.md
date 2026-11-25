# Film design system (briefing films and future hover films)

Every film follows the app's own design language: Apple-style glass, a strict grid, one text hierarchy, and the app's motion curves. `build.py` encodes these rules; change them there, not per film.

## One continuous queue (after the Annnimate diagonal gallery)
- The four films are a single composition (`compositions/briefing.html`) of 14 beats, cut into F1–F4 for the app. Each film's last frame is the next film's first frame, so they lead into each other. In the app, the outgoing film holds its last frame until the next one is playing, so there is no wipe or flash.
- **Current beat:** a large glass card, 480 × 360, bottom edge on the step number's baseline (64 px from the bottom).
- **Next beat:** waits at 22% scale at the bottom right; the **last beat** shrinks to the top left; older ones drift further up-left and vanish.
- Each beat steps the whole queue on: 0.85 s, `power2.inOut`, with a gentle `back.out(1.15)` landing for the card that takes the centre.
- **Step number** 01–14, Afacad 128 px, bottom left; its digits roll with the step. The total ("/ 14") is set in Manrope 20 px.
- **Copy** beside the card (title Afacad 32 px, line Manrope 21 px with one bold phrase) slides out upward in 0.25 s and in from below in 0.6 s with a 0.06 s stagger, through a mask.
- **Above the card's left edge:** the AI orb with the film's kicker ("Part one"), then a two-line headline (Afacad 56 px, ink then dim). The headline changes only when a new film starts.

## Frame and grid
- Canvas 1280 × 720. Margins 64 px. Spacing in steps of 8 px. Card left edge at 400 px; copy column from 916 px to 1216 px.
- Backdrop: the app's map, veiled to paper, so the glass has something to read through.
- Nothing overlaps outside the queue's own diagonal. `hyperframes check` must report 0 errors.

## Type hierarchy
| Role | Font | Size |
|---|---|---|
| Kicker | Manrope 700, caps, +0.16em | 20 px |
| Headline | Afacad 600 (second line dim) | 56 px |
| Copy title / line | Afacad 600 / Manrope 500 | 32 px / 21 px |
| Labels in cards | Manrope 700 | 20 px |

The floor is 19 px. Copy stays up for at least 0.5 s plus 0.3 s per word, so keep each line to five words or fewer.

## Glass
- Cards use the app's glass (blur); labels and badges inside cards use a lighter glass without blur, to keep the render light. The app's glass is: 62% warm-white tint, 22 px blur, saturation 165%, an inner shine edge and a soft shadow.
- Corner radii: card 32 (inner picture 24, inside a 10 px glass rim), pill 14, badge round.
- In the app, the film card's edges feather into the glass so light appears to diffuse at the rim.

## Places and paths
- Every place is marked with the **location pin** (`assets/pin.png`), a ground ripple, and a glass name pill to its upper right.
- The country in focus gets the thin orange glow outline, drawn on.
- Movement follows **curving dashed paths** (S-curves or arcs, never straight arrows), revealed as a pulsing orange traveller dot rides along them, as in the app's map journey.

## The AI orb
The orb leads the headline above the card and "speaks" for the whole briefing, using frames captured from the app's own orb.

## Motion
- Use the app's curves: `power3.out` for entrances, `power2.in` for exits (exits are faster), `power2.inOut` for travel, and `back.out(1.6)` for tiles and pins.
- Text enters 12 px up with a 0.05 s stagger. Each beat starts on the recorded phrase that names it.
- Use one orange accent (#ff7a1a) per beat.

## Supplied marks
- `assets/marks/cross-rounded.svg`: the rounded red cross for "where it breaks" (shape 11 from your crosses SVG).

## Vector graphics to supply
These would replace the remaining code-drawn marks and keep every film in one visual family. Please send plain SVGs (no scripts), ideally on a 24 px or 48 px grid:
1. **Check mark** in the same family as the rounded cross, for "this transfers".
2. **Curved arrowhead / path end cap** to finish a curving path where it lands.
3. **Crack or fault line**, for regional tension (F3).
4. **Stamp frame** (rounded rectangle with a rough edge), for "Dispute", "Approved" and similar.
5. **Question badge** glyph, if you'd like it to differ from the Afacad "?".
6. **Coin / naira glyph**, for money flows along paths.
7. **Spain and Nigeria flags as flat rounded-square icons** (optional), for the name pills.

## Glass (app-wide)
One recipe everywhere, matching the ⋯ menu button: neutral white at 22–32% over the backdrop blurred 3 px and bent through #glass-distortion, two bright inner edges, a soft shadow. Hover and selected states are only a little denser. No warm, near-opaque panels.

## Hover explainers (app/hover.js)
- A liquid-glass card, 280 px wide, grows out of the hovered item on the app's spring after a 300 ms pause. Keyboard focus also opens it, and Esc closes it.
- It never covers text: every side and slide position is scored against the text on screen (the task rail, chips, caption, character card, toolbar, end card, map labels), and the clearest position wins.
- It holds only a small looping vector scene, with no words on screen; the sentence is there for screen readers. Forms are organic: rings and arcs, droplets, flowing curves with the orange dot, soft leaf and blob shapes, the props, pins and the rounded cross. No boxes or bars.
- Every loop shares one 5 s clock and settles at about 78%. With reduced motion the card shows that settled frame.

## End page (progressive reveal)
- The orb glides left and pulses. A spark of its light travels along a curve to the right.
- The outcome turns up on a 3D drum of words (after Annnimate's rotating words): the four strands, credibility, fit risk, then it lands on the verdict. The orb's colours sweep through each word as it lands.
- A glass selection band (like an iOS picker) sits behind the centre row, with a "+" in it.
- Dots, the scroll wheel, arrow keys or a tap on a word turn the drum. Tapping the centre word or "+" opens it into a glass card (FLIP, on the spring) while the drum steps back. Restart sits on its own in the primary ink.
