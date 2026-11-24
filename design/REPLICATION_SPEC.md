# Replication specification

## Product and state architecture

Audience: doctoral candidates in Public Policy. Role: Policy Analyst, Intergovernmental Relations Unit, Abuja. Task: support a claim about Spanish asymmetry, match disputes to mechanisms, distinguish what Nigeria can transfer/adapt/reject, and defend a brief under challenge.

The source has five logical scenes. The implementation has sub-states, all inside one HTML document:

```text
landing → identity → briefing → stance → research → claim
→ disputes [three cases] → enforcement [conditional]
→ roundtable → transfer [three features] → closing
→ challenge → stanceClose → debrief
```

`app/engine.js` is the authoritative deterministic state reducer. `dispatch(state, action, payload)` clones state and returns `{state, clips}`. Each action validates stage and lock state. No assessment depends on animation completion or audio duration. `pending` holds a consequence until Continue. Do not skip recording a choice when the learner skips its audio.

`app/app.js` renders the controls. The atlas is created once and never unmounted during ordinary navigation. One `Atlas` object owns camera position. No router reload, no background swap, no one-map-per-stage.

## Visual hierarchy and alignment

Desktop baseline 1366×768, secondary 1024×768. Outer safe margin 32px; action rail 290px; top tools 32px from top/right; actions start at 104px; speaker dock bottom/right 32px. Buttons minimum 44px high, equal widths, 12px row gaps. Groups have 24px breathing space. A fixed portrait dock plus small side globe must never sit on top of the active geography.

Use Afacad 500/600 for display: title roughly 40–52px at desktop, section result 28–30px, questions primarily audio. Use Manrope for controls: 14–16px, names/meta 12px. Line-height 1.45–1.65 for source text that the learner requests. Options have enough lines to preserve their meaning; do not compress them into misleading one-word labels.

A 44px icon target may contain an 18–20px Phosphor bold glyph. All icons need accessible names. Tooltips are optional, never the only explanation. Orange identifies active selection/focus; it is not a decoration or correctness cue. Avoid an orange ribbon on every heading.

Warm sea/land aesthetic comes from `app/assets/atlas-master.svg`, with subtle raster ocean texture. Ivory glass is CSS blur, bright top edge and soft long shadow; no heavy borders or repeated nested cards. The map is the primary visual. The content interface should be quiet while a learner looks at a region.

## Text policy

- Show the title once on landing, plus Start or Continue/Restart.
- Keep choices, location labels, necessary context such as a feature name and resource costs visible.
- Speak questions, explanations, character challenges and feedback.
- Captions remain off by default. CC exposes the current line; Brief Notes stores the complete source/decision record.
- Sound-off or a missing clip reveals the line automatically so the learner is never asked to answer an unheard question. This is a fallback, not a permanent extra paragraph.
- No mic, chat input, fabricated thinking text or “AI analysing…” copy. Learner identity is the only required text form.
- No learner-facing “Scene 2”, “Simulation” or technical implementation labels. “Evidence” remains only where the source character’s exact scripted feedback uses it; generic interface wording uses sources.

## Continuous atlas and camera

`app/assets/map-config.json` defines a 3200×4873 export viewport, bounds west −20°, south −3°, east 20°, north 50°. It includes Spain, Portugal, the Balearics, the Canaries, France, northwest Africa and Nigeria in one north-up Web Mercator coordinate system. The standalone PNG is a larger export of this exact coordinate space. Runtime drawing extends beyond those bounds so wide or mobile views retain surrounding land.

`Atlas.xy(lon, lat)` projects all paths and hotspots. Country paths use Natural Earth admin0 data; Spanish provinces are dissolved by autonomous-community name to avoid mistaking province boundaries for community boundaries. Nigeria includes 36 state boundaries plus FCT. The source is a generalised educational atlas, not a survey or legal boundary authority.

The default is hybrid rendering:

1. Generated ocean texture: decorative blue detail only, with no geographic information.
2. Vector geographic land and borders: source-derived coordinates.
3. Vector selected-region fill and outline, projected hotspot buttons and small labels.
4. Fixed HTML controls and portraits above the map.

The PNG is useful as a static backdrop or for low-performance fallback. If replacing the SVG base with the PNG, render it in the same world bounds and keep only interactive vector highlights/markers above it. Never draw a second offset map or hand-align screenshots.

Camera modes in `app/map.js`: overview, Spain, northern Spain, Nigeria. `focus()` computes a fit to the unoccupied screen area and smoothly interpolates the SVG viewBox. A new focus cancels and retargets the active animation. Do not lock input during panning. Major international travel 900ms; nearby focus 520ms. Reduced motion sets the final view immediately. Map scale changes, screen controls do not.

On mobile, the map owns the upper region and the action rail becomes a bottom task stack. Do not squeeze the full desktop layout into the same proportions. The page itself should not scroll; long options or requested details may scroll inside their designated panel. Preserve 44px touch targets. Test text-size settings, not only the default.

## Character and guide choreography

The three primary portraits are one CSS sprite in `characters.png`: Eze at 0%, Marín at 50%, Sani at 100% horizontal background position. They are fictional characters. Preserve each face across all scenes.

| Trigger | Visual/action | Timing | Completion |
|---|---|---|---|
| Character clip enters | Guide slides to reserved side dock; character container opens from portrait anchor | 450–460ms | Name/controls settle; actual audio owns speaking state |
| Portrait first appears | Small square mosaic resolves across image only | 700ms maximum | Fully sharp portrait; no particles during the entire speech |
| Speech starts | Smooth coloured ribbon responds to playback; subtle globe movement only if it is the speaker | Live amplitude | No competing narration |
| Character ends/minimises | Card folds toward the same portrait anchor | ~200–260ms target | 44–52px replay tab |
| Guide speaks next | Guide returns to bottom centre of the free map area | ~450ms | One active waveform |
| Replay | Replay saved clip ID, never rescore or repeat transition | Immediate audio preparation | Same learning state |
| New task while audio plays | Stop old queue, replace with next queue | Immediate | No overlap |

`audio.js` uses one HTMLAudioElement plus one analyser. `app.js` turns playback amplitude into continuous wave paths. CSS is a graceful fallback if Web Audio is unavailable. Never request microphone permission. No exact proprietary Apple animation is asserted; the style is smooth, luminous and restrained.

Important final polish: the reference uses CSS container transitions; the final builder should measure the expanded/minimised rects for an exact shared-element fold, keeping the same anchor. The current sprite reveal is a CSS square-mask approximation, not a real image-generation process. No LLM is involved.

## State, persistence and controls

Learner state: `borrowed-blueprint-v1`; developer state: `borrowed-blueprint-dev-v1`. Preferences are separate keys. Save after each accepted state mutation. Resume never reopens a submitted choice. Explicit Restart requests confirmation because it clears that browser’s attempt. Returning to landing does not erase a run.

Sound, captions, reduced motion and text size persist. Muting stops playback, preserves the current line for reading and never changes assessment. Notes/Settings are requested panels, not automatic centre-screen modals. Dialog focus must return to its trigger. Only one speaker at a time.

The dev selector is available only with `?dev=1`. Its synthesized states are for layout inspection. They must never become the official learner record or facilitator results.

## Source scoring and adaptations

See `SOURCE_DECISIONS.md` for exact rules and choices made to resolve source contradictions. Do not infer a “right” opening stance. Four strands total 100: asymmetry 20, mechanism matching 30, transfer judgement 30, lessons/limits 20. Final adjustment and risk band rules live in `engine.js`.

## Production boundaries

No audio is generated in this kit; the full scripts and exact target filenames are supplied. No live AI, backend, facilitator dashboard, official ident or finished opening video is claimed. The code is editable replication/reference code, ready to continue in Claude; test the final asset-backed build before release.
