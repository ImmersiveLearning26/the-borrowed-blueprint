# The Borrowed Blueprint — Claude replication kit

A runnable, editable reference implementation plus production scripts and map assets for DPA 9109. Doctoral learners prepare a comparative brief on Spain and Nigeria, defend it at a retreat, and review the consequences of their decisions.

## Open the preview

From this extracted folder, with Python 3 installed:

```sh
python -m http.server 8765 --directory app
```

Open **http://localhost:8765**. Do not double-click `index.html`; local fetches require a server.

Developer preview: **http://localhost:8765/?dev=1**. Its page selector and saved run are separate from learner progress. The selector is for visual review, not a valid scored attempt.

No npm install or API keys are needed. All fonts, icons, maps and character imagery are local. The guide uses a deterministic prerecorded-clip queue; no live AI service is connected.

**What changed since the first handoff:** see `CHANGES.md`.

**Next design step:** `CLARITY_REVIEW_AND_EXPLAINER_PLAN.md` (explainers to make the run easier to follow) and `EXPLAINER_IMAGE_ASSETS.md` (the images it needs).

## Audio: give Lovable this file

**`AUDIO_GENERATION_FOR_LOVABLE.md`** is the complete brief for generating all 106 voice clips: voices, pronunciation, format, file names, where the files go, and every line word for word. It is built from `app/assets/audio-manifest.json`; rebuild it with `python tools/build_audio_guide.py .` if the scripts change.

## Give Claude these files first

1. `handoff/CONTINUE_IN_CLAUDE.md`
2. `design/REPLICATION_SPEC.md`
3. `design/PAGE_STATE_MAP.md`
4. `production/ALL_AUDIO_SCRIPTS.md`
5. `verification/VERIFICATION.md`

## What is included

- `app/`: editable HTML/CSS/JavaScript, all logical pages, persistence, decisions, branching, scores, audio queue and map camera.
- `production/ALL_AUDIO_SCRIPTS.md`: **106 clips**, voice casting, filenames, triggers and generation directions.
- `app/assets/audio-manifest.json`: the same 106 scripts in machine-readable form.
- `production/Continuous_Atlas_Master.png`: **4096 × 6237** continuous atlas image (check the actual file dimensions if regenerated).
- `production/Continuous_Atlas_Master.svg`: self-contained continuous vector atlas with embedded decorative ocean raster.
- `app/assets/atlas-master.svg`: lightweight runtime vector map. It uses `ocean-texture.png`; keep them together.
- `app/assets/regions.json` and `source-regions.geojson`: source-derived Spanish autonomous-community and Nigerian state paths.
- `app/assets/characters.png`: one three-panel portrait sprite, addressed by CSS without three duplicate files.
- `design/approved-layout-reference.png`: generated design reference, not a screenshot or cartographic source.
- `production/Page_Flow_Long_Reference.png`: one long visual strip of the page states and character behaviours.
- `design/screens/`: individual page references captured from the supplied code.
- Original source brief and supplied design-system ZIP retained under `design/`.

## Production still required

Generate the audio files and place them in `app/assets/audio/` using the exact IDs in the manifest. Follow `AUDIO_GENERATION_FOR_LOVABLE.md`. Until then, the preview exposes the text of each missing line, with Next line. This temporary fallback is essential: the task cannot depend on silent instructions. Once real clips exist, captions remain **off by default**, as requested.

The app stores progress locally. A hosted facilitator dashboard, authentication and server submission are **not implemented**; see the backend contract. Delegate voices have monogram tiles rather than invented portraits. Official institutional ident artwork and optional music/video assets have not been supplied.

The original brief’s written closing line is implemented as a two-part selection builder to honour the standing no-free-text-scoring preference. The resulting sentence remains in Brief Notes. The precise adaptation and source ambiguities are documented, not hidden.

## Verify logic

Requires Node.js supporting ES modules and structuredClone:

```sh
node verification/engine.test.mjs
```

Source entry points: `app/app.js` (screen rendering), `engine.js` (rules), `map.js` (one persistent camera), `audio.js` (one speech queue), `content.js` (copy), `styles.css` (layout/motion).
