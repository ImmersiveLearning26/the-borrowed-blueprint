# Page replication and cue map

Every row is a view inside the same mounted application, not a different HTML page. The five source scenes expand into 14 interface states. `app/app.js:renderActions()` implements the state-specific controls; `engine.js:dispatch()` implements transitions. Shared map, voice, characters and global tools stay mounted. CSS and component code are provided, not only prompts.

| State / source scene | Camera and visible content | Entry audio | Action / next state |
|---|---|---|---|
| landing / entry | Full atlas; title; Start or Continue + Restart | Silent | Start → identity; Continue restores saved state |
| identity / 1 | Atlas overview; Name, Matriculation number, Continue | G01 | Required identity → briefing |
| briefing / 1 | Same overview; Replay, Continue | N01–N04 queued | Continue → stance |
| stance / 1 | Pan to Spain; three stance options; Confirm | S1_EZE then S1_QUESTION | Confirm → research; S1_REPLY_0/1/2 |
| research / 2 | Spain with four source hotspots; source rail; research hours | S2_ENTER; stance 0 additionally S2_FREE + SRC_catalonia | Open/replay sources; >=2 sources enables Build claim |
| claim / 2 | Spain; claim options then source attachment choices | S2_CLAIM | Choose claim + 2 opened sources → consequence S2_full/partial/none → Continue |
| disputes / 3 | Northern Spain; four mechanism options; one case at a time | S3_ENTER; D1/D2/D3 or D3_ESC; S3_QUESTION | Route each case → branch feedback → Continue; wrong routes persist |
| enforcement / 3, conditional | Same Spain camera; Article 155 now / Court enforcement first | D3_FOLLOW_Q | Choice → D3_FOLLOW_0/1 → Continue |
| roundtable / 4 | Continuous pan Spain → Nigeria; three character handoffs; Replay/Continue | S4_EZE, S4_MARIN, S4_SANI, S4_GUIDE | Continue → transfer |
| transfer / 4 | Nigeria; one feature name; check source; Transfer/Adapt/Reject | FEATURE_A/B/C then TEST_A/B/C | Optional CHECK clip; Confirm → DECISION clip; after C → closing |
| closing / 4 | Nigeria; lesson choices then Nigerian-limit choices | CLOSE_Q; option Read buttons play LESSON/LIMIT clips | Submit composed line → CLOSE_ACCEPT → Continue |
| challenge / 5 | Nigeria; three response choices | S5_ENTER, selected claim/lesson/limit, CHALLENGE_<weakest>, S5_RESPONSE | Response → VERDICT clip → Continue |
| stanceClose / 5 | Nigeria; same three opening stances | S5_STANCE | Confirm records change/no change → debrief |
| debrief / 5 | Nigeria; outcome band; Your choices / What changed / Your brief / Restart | S5_HELD or CHANGED, BAND_0..3, DEBRIEF_REVIEW | Requested detail drawers; Restart confirms clearing this attempt |

## Per-view replication rules

- Landing uses a quiet left-aligned 52px maximum heading, two-line wrap and one primary button. No dashboard panels, title subtitle or artificial scene numbering.
- Identity has two properly labelled inputs; no assessment free-text field elsewhere. Do not record audio automatically before browser interaction.
- Research source hotspots and rail address the same source IDs. A repeat click replays audio at no further cost. Region highlight is on the geographic path. Country outlines never change shape between screens.
- Claim selection is progressive disclosure: claim choices, then two source attachments. Back edits the draft only. Submit locks and records the score once.
- Disputes are three instances of one control layout. The second and third cases replace content in place. Escalation alters the third case narration; it does not create a new world.
- Roundtable switches between three portraits in one dock. Guide moves beside the dock while a character speaks. All speakers share one media player.
- Transfer keeps the feature label above the same options. Checking costs six reserve hours once per feature. A missing check is allowed and recorded.
- Closing is a two-step structured sentence builder. Read buttons speak individual choices. The final joined line is stored in Brief Notes; no model grading.
- Challenge chooses a delegate and line based on the lowest normalised strand. Retain the actual brief and earlier decisions; do not fabricate a generic debrief.
- Debrief reveals numbers and comparison detail only on request. Wrong decisions are shown alongside the supported mechanism/feature choice in Your choices.

## Transient states

`state.pending` is a locked feedback state with Continue and Replay. It is saved, so reloading does not let the learner resubmit for extra points. Draft selection is local UI state and can reset on reload before submission. Settings and Notes use a native modal dialog. Missing audio or Sound off exposes the current line and a Next line control; these temporary paragraphs are not the final audio-first layout.

## Ownership

- `engine.js`: scores, resource spending, branches, stage, locked decisions, event log.
- `content.js`: source copy, options, source locations, feature points.
- `audio-manifest.json`: 106 named audio files, speaker, transcript, trigger and provenance.
- `audio.js`: active queue, cancellation, playback state, missing-media fallback, amplitude.
- `map.js`: projection, viewBox interpolation, source markers and region highlights.
- `app.js`: rendering, preferences, dialogs, portrait choreography and persistence.
- `styles.css`: alignment, typography, responsive rules and motion.

Screenshots under `design/screens/` show the real reference implementation. The separate approved reference board is visual direction; where it distorts geography, use the real vector map.
