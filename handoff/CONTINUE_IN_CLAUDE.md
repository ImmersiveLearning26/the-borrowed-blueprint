# Continue in Claude

Continue this supplied reference implementation for **The Borrowed Blueprint**, DPA 9109. Preserve the source learning tasks and the user-approved visual direction. Do not redesign it or switch to separate page backgrounds.

Read `START-HERE.md`, `design/REPLICATION_SPEC.md`, `design/PAGE_STATE_MAP.md`, `production/ALL_AUDIO_SCRIPTS.md` and `verification/VERIFICATION.md` first. The user’s latest corrections override the older design-system ZIP.

## Fixed decisions

- One continuous **2D** atlas, one mounted SVG/map surface, one stateful application. No 3D assets, offices, desks, folders, spherical map or decorative diorama.
- Spain and Nigeria are geographic locations in the same world. Transition with a pan/zoom of the same map. Do not fake country positions, move countries independently or turn surrounding land into sea to create UI space.
- Preserve clear pale-blue sea, warm sand land, restrained orange selection, charcoal primary buttons, ivory glass, Afacad and Manrope.
- Typography and spacing matter: options align to a common rail; consistent margins, button widths and gaps; fixed global tools; one consistent speaker dock.
- Most instructions are spoken. Keep necessary choices visible; no duplicated question headings, speech paragraphs or helper slogans. Captions are off until requested. Sound-off and missing-audio fallback must remain accessible.
- The “AI” guide is contextual **prerecorded branching audio**. Do not add live LLM calls, mic permission, speech input, fake reasoning delay or claims of actual AI computation.
- When a character appears, the guide moves aside. Only that character speaks. Their image briefly resolves through small square particles, then stays clear. Their small card folds to a replay portrait. The guide returns when it speaks again.
- Smooth Apple-inspired coloured ribbon waveform; no tall bar equalizer. The current implementation drives its amplitude from actual audio playback when available. No claim of an exact proprietary Apple animation match.
- Keep wrong decisions and their consequences. No forced retry for a right answer. Every attempt reaches the retreat.

## First complete path to verify

Start → identity → opening briefing → stance → two or more sources → claim + two attachments → all three disputes → optional enforcement follow-up → roundtable → three Transfer/Adapt/Reject decisions and optional checks → two-part closing line → weakest-strand challenge → closing stance → outcome.

Confirm a choice twice: the second submission must not change the score. Reload in the middle: Continue must return to the same stage. Minimise/replay a character: learning state must not change. Switching narration must cancel the previous speaker. Reduced motion must reach identical end states.

## Continue in this order

1. Run the preview and the existing engine tests. Recheck actual layout at 1366×768, 1024×768, 390×844 and 360×640.
2. Refine alignment using `styles.css`, never the map geometry. Where a speaking card opens, keep the selected region visible in the remaining map area.
3. Generate or import all voice clips from the MD file. Voice provider is not hard-coded. Map each clip to `assets/audio/<ID>.mp3` and verify manifest coverage.
4. Test character handoff, replay, skip, muted mode, CC, browser autoplay restrictions and resume with actual audio. Long lines may exceed the original eight-second suggestion; diction takes priority.
5. Apply subject-expert review flags in `SOURCE_DECISIONS.md`. Do not invent legal/historical corrections or revise the rubric silently.
6. If a hosted learner system is required, implement the backend contract with authenticated per-user access and a real facilitator role. Never expose all records through a public client query.
7. Run acceptance checks, record what you observed, then package the final build.

## What may be refined

Spacing, content fit, animation timing, responsive panel placement, SVG rendering performance, pronunciation after review. Keep the source-derived geography. Current admin0 outlines are generalised at 1:50m and admin1 at 1:10m; a higher-resolution coastline can replace them only with the same coordinate transform and attribution record.

## Do not interpret as finished production media

The reference board is approximate design imagery. The standalone atlas is a real map export, not an AI-drawn political map. Portraits are generated fictional characters. Audio scripts are complete but recordings are not bundled. Browser verification limits are in the verification report. No deployment or account configuration has been done.
