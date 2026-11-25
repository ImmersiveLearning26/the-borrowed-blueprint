# Clarity review and explainer plan: The Borrowed Blueprint

**Status (25 Nov 2026):** films F1–F4 (the opening briefing) are built and in the app as one see-through diagonal queue (`production/films/`). Hover explainers H1–H12 are built live in the app (`app/hover.js`); their one-line definitions still need subject-expert approval, and touch devices do not get them yet (the ⓘ tap target is still to do). Everything else in this file is still a proposal. The images are in `app/assets/props/` (see `EXPLAINER_IMAGE_ASSETS.md`).

The goal: a student who plays once should be able to say what they were asked to do, what each choice meant, and why their result came out the way it did. Today the simulation explains almost everything through speech, over a map that mostly stays still. If a student misses a line, mishears a term or doesn't know the background, there is nothing on screen to catch them.

## 1. Where a student is likely to get lost

| # | Moment | What the student meets | Why it may confuse | Fix (section 3) |
|---|---|---|---|---|
| 1 | Opening briefing (N01–N04) | Four narrated lines over a still map | "Federation Account", "Supreme Court", "seventy-two hours" and "the model on the table" are spoken once, with no picture of the situation or of the student's role | Film F1–F4 |
| 2 | The whole run | No sense of the stages ahead or of where they are | The run has nine parts (brief, research, claim, disputes, roundtable, transfer, closing, retreat, outcome), but nothing shows them | Chapter rail (U1) |
| 3 | Status chips | "24h research", "12h reserve", "AC 70 · Fit 0" | "AC" and "Fit" are never explained on screen; it is not clear what raises or lowers them or why they matter | Chip explainers H1–H3, change pulses U3 |
| 4 | Research | Four source pins; each costs six hours | Which sources matter for which question; what "special fiscal regime" and "common regime" mean | Source films F5–F8, glossary U2 |
| 5 | Claim | Four claims, then attach two sources | The idea that a claim must be *supported by the attached evidence* is only implied | Hover H4, film F9 |
| 6 | Disputes | Three cases, four institutions | What each institution actually does (bilateral commission, multilateral fiscal council, Constitutional Court, Article 155) is never shown; a wrong route only says why afterwards | Mechanism explainers H5–H8, dispute films F10–F12 |
| 7 | Escalation / enforcement | "The region says it will ignore an adverse ruling" | A cause-and-effect chain (your earlier route → a harder third case) is invisible | Film F13 |
| 8 | Roundtable → transfer | Transfer / Adapt / Reject for three Spanish features | The three verbs are not defined; the Nigerian context (FAAC, derivation, resource control, 36 equal states) is assumed | Hover H9, films F14–F17 |
| 9 | Source checks | "A check costs six reserve hours… borrowing without checking raises fit risk" | Spoken once; the trade-off is not visible when deciding | Chip explainer H2, U3 |
| 10 | Closing line | Choose a lesson, then a limit | Why a lesson needs a limit | Hover H10 |
| 11 | Retreat | A delegate challenges the weakest strand; concede / defend / reframe | That the challenge targets *their own* weakest strand, and what each response risks | Film F18, hover H11 |
| 12 | Outcome | Band, score, four strands | How the four strands were earned (now on the end page, but without a "why") | Strand explainers H12 |

## 2. What to add (three layers)

1. **Films while a line is spoken.** A short motion-graphics film plays beside the speaker as they talk, beat for beat with the voice. This is where most understanding happens.
2. **Hover and tap explainers.** A small glass card with a looping 4–6 second animation and one plain sentence, on terms, chips, mechanisms and choices. Hover on desktop; on touch, a small ⓘ to tap.
3. **Small interface aids** that need no images: a chapter rail, glossary underlines and change pulses on the chips.

## 3. The explainers

### 3a. Films during speech (F)

Each film plays inside a glass window that grows out of whoever is speaking, the orb or the character card, in the free part of the map. It never covers the task rail or the selected region. It plays muted, because the voice carries the sound, and stays in step with the recorded line using its real timing. It has a pause button, and plays automatically the first time only; after that, a small "▶ Film" chip replays it. With reduced motion or Save-Data, the window shows one still frame.

| ID | Plays with | Length | Beats (what appears, in order) | Props |
|---|---|---|---|---|
| F1 | N01 | ~5 s | Nigeria on the map → the Federation Account as one shared pot → arrows to the states → the dispute reaches court (gavel) | P01, P02, P04, P20 |
| F2 | N02 | ~7 s | A 72-hour countdown → federal and state seats around one table | P14, P18 |
| F3 | N03 | ~9 s | Camera flies to Spain → 17 regions light up at different times → two different "deal" envelopes → a crack runs through the map | P09, P10 |
| F4 | N04 | ~6 s | The case folder opens: "What can Nigeria borrow? Where does the comparison break?" → magnifier | P17, P16 |
| F5 | SRC_constitution | ~9 s | The constitution book opens → 17 tiles fall into place at different speeds → the centre keeps a coordinating thread to each | P06 |
| F6 | SRC_basque | ~9 s | Taxes flow into the regional chest → one negotiated payment travels to Madrid | P08, P07, P09 |
| F7 | SRC_catalonia | ~10 s | Timeline: 2006 statute → 2010 court trims it → 2017 ballot ruled unlawful → Article 155 seal | P06, P04, P11, P12 |
| F8 | SRC_andalusia | ~8 s | A national pot → a formula (calculator) → transfers to regions → "is it fair?" scale wobbles | P02, P23, P05 |
| F9 | S2_full / partial / none | ~3 s | The claim card on a balance scale against the two source folders: balanced / tipping / empty | P05, P17 |
| F10 | D1 | ~5 s | Madrid and the Basque chest; the annual payment envelope between them | P08, P09 |
| F11 | D2 | ~4 s | Several regions point at the national pot and calculator | P02, P23 |
| F12 | D3 / D3_ESC | ~5–7 s | A regional law document; the centre objects; (escalated) the region turns its back on the gavel | P06, P04 |
| F13 | D3_FOLLOW_0 / _1 | ~8 s | Two paths: Article 155 (padlock, Senate majority) vs Court enforcement (gavel, fines, slower) | P13, P12, P04 |
| F14 | FEATURE_A + TEST_A | ~6 s | One gold envelope to one state → 35 hands reach for theirs | P10, P09 |
| F15 | FEATURE_B + TEST_B | ~6 s | Sector conference table, signed agreement → party colours that don't match | P18, P22 |
| F16 | FEATURE_C + TEST_C | ~7 s | A state law gets a "paused" stamp from Abuja → five-month calendar → the Supreme Court already exists | P12, P15, P20 |
| F17 | S4_SANI | ~4 s | Oil barrel → derivation and resource control → the FAAC pot | P03, P02, P01 |
| F18 | S5_ENTER + CHALLENGE_* | ~5 s | The retreat hall; a spotlight lands on the student's weakest strand | P21 |

Films F5–F8 also play on hover over a source pin, as short loops.

### 3b. Hover and tap explainers (H)

A small glass card, 260–300px, grows from the thing it explains after a 300ms hover intent and closes when you leave. Each has a 4–6 second looping animation and one sentence of at most 20 words.

| ID | On | One-line explanation (draft; subject-expert approval needed) | Props |
|---|---|---|---|
| H1 | "24h research" chip | You have 24 hours to read. Each new source costs six. Choose what you need. | P14 |
| H2 | "12h reserve" chip | Hours left to check a source before you borrow from it. | P14, P16 |
| H3 | "AC · Fit" chip | Credibility rises when your evidence supports you. Fit risk rises when you borrow without checking. | P05 |
| H4 | Claim options | A strong claim is one your two attached sources actually support. | P05, P17 |
| H5 | Bilateral commission | Madrid and one region settle their own agreement, face to face. | P19 |
| H6 | Multilateral fiscal council | All regions and the centre negotiate the shared funding rules together. | P18 |
| H7 | Constitutional Court | Judges whether a law is constitutional. It does not set funding. | P04, P20 |
| H8 | Article 155 intervention | A last resort: the centre takes over a region's powers, with a Senate majority. | P13, P12 |
| H9 | Transfer / Adapt / Reject | Transfer: take it as is. Adapt: keep the principle, change the form. Reject: leave it. | (drawn) |
| H10 | Lesson / limit | A usable lesson always comes with the Nigerian condition that limits it. | (drawn) |
| H11 | Concede / Defend / Reframe | Concede fixes it. Defend needs sources. Reframe avoids the question. | (drawn) |
| H12 | Each strand on the end page | What the strand measured and which of your choices earned it. | (drawn) |

### 3c. Interface aids (no images)

- **U1 Chapter rail:** nine small icons at the top edge (Brief, Research, Claim, Disputes, Roundtable, Transfer, Closing, Retreat, Outcome). The current one is orange; hover shows its name. No "3 of 9" counts.
- **U2 Glossary:** dotted underline on first use of FAAC, derivation, resource control, asymmetry, common regime, special fiscal regime, Article 155, Article 161.2, sector conference. Tap for one sentence.
- **U3 Change pulses:** when hours, credibility or fit risk change, the chip pulses once and shows the change (for example "−6h", "+5 credibility") for two seconds.
- **U4 One-line task:** a small kicker above each set of choices ("Route each dispute to an institution"), so the task is on screen even when the audio was missed.

## 4. How it is built (recommended)

- **Films (F):** built in HyperFrames (HTML → video) from your props and the real atlas, beat-timed to each recorded line, 12 fps stepped motion, rendered to small MP4/WebM files (under 1MB each), lazy-loaded. This follows `08_Motion_Graphics_Films.md` in your library.
- **Hover cards (H):** built live in the app with the same props (CSS/JS animation), so they stay crisp, small and interruptible.
- **Interface aids (U):** plain app code.
- Maps, arrows, stamps, timelines, labels and every word or number are drawn in code, never generated. I generate no images or vector illustrations myself; every picture comes from `EXPLAINER_IMAGE_ASSETS.md`.

## 5. Needs a human decision

1. **Which layers to build.** All three, or start with the films for the briefing and the dispute desk.
2. **Subject-expert approval** for every one-line definition (H1–H12, U2) and for illustrative beats in F7, F13, F16 and F17. They simplify law and fiscal arrangements.
3. **Whether films play automatically the first time,** or only on request.
4. **Student testing.** A quick test with three or four students before building everything: can they explain each mechanism and their own result afterwards?
