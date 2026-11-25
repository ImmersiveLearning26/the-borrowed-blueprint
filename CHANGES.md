# Changes since the original handoff (24–25 November 2026)

The learning content, scoring rules, saved-run format and map geography are unchanged. `node verification/engine.test.mjs` still passes (3,807 actions). These changes apply the user's Design Strategies library (motion, type and spacing) and later design direction.

## Audio

- **`AUDIO_GENERATION_FOR_LOVABLE.md`** (new, kit root): the complete brief for generating all 106 voice clips. Rebuild it from the manifest with `python tools/build_audio_guide.py .`.
- **All 106 voice clips are now bundled** in `app/assets/audio/` (supplied 25 Nov 2026): MP3, mono, 44.1 kHz, about 128 kbps, about 9.9 minutes in total. Loudness −15.4 to −20.0 LUFS (median −16.9), no clipping, no clip cut off at the end. Five clips sit slightly below −19 LUFS (`FEATURE_A`, `DECISION_A_0`, `DECISION_B_2`, `S4_REJECT`, `CLOSE_ACCEPT`). Seven read fast for the brief (186–226 words a minute: `S1_EZE`, `S2_CLAIM`, `DECISION_C_1`, `S4_ART155`, `CLOSE_ACCEPT`, `S5_ENTER`, `CHALLENGE_limits`) and `CHECK_B` reads slowly (92). Many clips begin speaking at the very first millisecond. Nobody has listened through them for wording, pronunciation or voice consistency yet.
- A missing clip still falls back to on-screen text with "Next line".

## Agent and characters

- **Agent orb:** the guide's bubble is the dark glass Strands orb from The Analyst's Brief (`app/strands.js`). It is still when nobody speaks; its strands follow the voice.
- **Waveform:** the guide's and characters' ribbon waveforms follow real playback level, or a speech rhythm while a text-only line is showing (`app/motion.js`). No fake thinking delay.
- **Character card:** the portrait fills the card edge to edge and fades into the glass at the bottom; name and player sit on the fade. Portraits are drawn into canvases with a cover crop (never stretched) and resolve through small square pixels from the top down. Cards announce while their speaker talks, then fold to a round portrait tab; hover or focus reopens them.

## Interface

- **Liquid glass** on every surface, after lucasromerodb/liquid-glass-effect-macos: a blurred backdrop bent through an SVG displacement filter (`#glass-distortion` in `index.html`), an undistorted tint and a shine edge. Main buttons are dark tinted glass.
- **Type scale and spacing** from the library: Afacad display sizes, Manrope body, kicker labels, an 8px rhythm in the task rail.
- **Motion:** spring and ease curves from the library's tokens; staged entries; iOS rubber-band scrolling at the ends of scroll areas; things close faster than they open; reduced motion reaches the same end states instantly.
- **Tools:** sound, captions, notes and settings fold into one ⋯ button and unfold on hover or focus.
- **Menu:** a multi-level drawer (Menu → Your brief / Your choices / What changed / Settings → Text size, plus Restart). Levels slide in like an iOS navigation stack.
- **Options read aloud:** the play control sits in each option's lower-right corner. Pressing it squeezes the option into a glass circle that flies to the caption and ripples it open.
- **Layout:** the task rail grows down to whatever is docked at the bottom right. In a browser, no surface overlapped another at 1366×768 after the final changes. 1024×768, 390×844 and 360×640 were checked before the last round (pins, full-bleed portraits, option flight) and should be re-checked.

## Map

- **Journey:** moving between Spain and Nigeria is a curving camera journey with a pulsing dot and a dashed trail; the country's thin glow line draws on arrival. Short moves tilt gently.
- **Pins:** source markers are the supplied 3D location pin (`app/assets/pin.png`) with a ripple and high-contrast glass labels; labels flip sides to avoid each other, and place names under a pin fade out.
- **Highlights:** the selected source's communities get a thin glow line; the 1978 Constitution, a national source, lights all of Spain's communities.
- The camera keeps pins above the caption on the research step.

## End page and later fixes (25 November 2026)

- **End page:** when the brief is judged, the map dims and the AI bubble glides to the centre, pulses and loops circle → box → wobbly blob → circle. After one loop it glides left and the outcome opens out of it: verdict and score (counting up on a ring), Dr Eze's verdict line, whether you held your position, the four rubric strands as filling meters (weakest marked), credibility and fit risk, and Your choices / What changed / Your brief / Restart. Phones stack the bubble above the card.
- **Reading an option aloud:** the option now stays in place, greyed and inactive, while its line is read, instead of disappearing.
- **Performance:** in headless Chrome on an Apple M2 at 1366×768 (retina), the app holds 60fps idle, during camera moves, during the Spain–Nigeria journey and while audio plays, and the waveform follows the voice. The orb now rests when idle, and the selected pin's ripple runs four times instead of forever. The slow frame rates seen earlier came from the desktop app's browser pane being throttled, not from the app.
- **Next:** `CLARITY_REVIEW_AND_EXPLAINER_PLAN.md` proposes explainer films, hover explainers and interface aids to make the simulation easier to follow; `EXPLAINER_IMAGE_ASSETS.md` lists the 23 photoreal props (with prompts) needed to build them.

## Briefing films (25 November 2026)

- **Four explainer films** (F1–F4) play in a glass window while the opening narration (N01–N04) is spoken: the Federation Account dispute reaching the Supreme Court, the 72-hour meeting, Spain's seventeen communities with different powers and fiscal deals, and the analyst's question (what can Nigeria borrow, and where does the comparison break).
- Built with HyperFrames in `production/films/` from the supplied props and the app's own map; see `production/films/REVIEW.md`. App files: `app/assets/films/` (F1–F4 MP4, posters, `films.json`).
- **Film window:** grows out of the guide's orb into the free top-left of the map (across the top on phones), stays locked to the voice, pauses with it, and swaps in place between lines. It plays by itself the first time a line is heard; on replays a "Watch the film" chip offers it. Reduced motion or data-saver shows the still poster.

## Developer page

- The `?dev=1` step selector now opens only for the registered developer email, via **Option/Alt+Shift+D**. Only a SHA-256 fingerprint of the email is in `app.js`.
- This is a browser-side gate, not access control. Real protection needs the server sign-in described in `handoff/BACKEND_CONTRACT.md`; when it exists, set `window.BLUEPRINT_SESSION.email` and the app uses it instead of asking.
- `verification/browser_smoke.py` now needs `--dev-email <registered email>`.

## Out of date in this package

- The images in `design/screens/` and `verification/*.png`, `verification/browser-results.json` and `verification/VERIFICATION.md` show the build before these changes. Re-run `verification/browser_smoke.py` (with Playwright) to refresh them; note that it overwrites `design/screens/`.
- The map pin came from a stock-style download; confirm its licence and credit line before release (see `production/ATTRIBUTION.md`).
