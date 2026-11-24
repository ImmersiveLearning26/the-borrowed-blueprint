# Verification report — 24 November 2026

This is an editable reference implementation for Claude, not a deployed course.

## Automated checks

- `node verification/engine.test.mjs`: passed, 3,807 accepted/validated actions; 90 unique triggered clips present in the 106-clip manifest. Optional read/help clips account for the remainder.
- Browser smoke test: Chromium headless shell 151, Python Playwright. All 14 logical page states render with no JavaScript errors.
- 1366×768, 1024×768, 390×844 and 360×640: no document overflow in tested transfer view. Long tasks use an internal scrolling panel, especially on small phones.
- Option text-size setting reaches 125%. Reduced-motion camera reaches final focus.
- Real learner Start → identity → briefing → reload → Continue restores the briefing; developer controls are hidden without `?dev=1`.
- Source replay does not charge hours again. Missing audio exposes text. Character minimize and replay work.
- In-memory synthetic WAV test verifies decoding, playback, skip, queue replacement and mute through one AudioElement. The test sound is not bundled or presented as a voice recording.

Full machine output: `browser-results.json`. Screenshots: `design/screens/`, four responsive captures in this directory, and the long reference under `production/`.

## Visual review

Reviewed Spain research, Nigeria transfer, character dock and mobile layouts. Corrected a rectangular atlas edge by extending vector drawing outside the export viewport. Controls are fixed in screen space and remain independent of map zoom. Changed the skip icon so it is distinct from Play. Production portrait and ocean assets are local; fonts and icons work without third-party runtime calls.

## Remaining production work

Generate and audition the 106 voice recordings. Test pronunciation, timing, long queues, autoplay restrictions and waveform behaviour with final media on target devices. Native Safari/iOS and Android hardware have not been tested. The source scenario's legal/historical review flags remain in SOURCE_DECISIONS.md. Final exact shared-element portrait folding can be refined; current reveal is a CSS approximation. Backend authentication, facilitator dashboard and official submission are specified but not implemented.

No formal screen-reader audit or pixel-for-pixel comparison to proprietary Apple animation is claimed. Default missing-audio text is intentional for accessibility; with real audio and CC off, the speech paragraph is hidden.

## Re-run

```sh
node verification/engine.test.mjs
python -m pip install playwright
python -m playwright install chromium
python verification/browser_smoke.py
```

An existing compatible browser can be selected with `--browser /absolute/path/to/chrome`. Tests run a temporary local HTTP server; they do not publish the app. The developer selector creates synthetic states solely for visual checks and is separate from learner progress.
