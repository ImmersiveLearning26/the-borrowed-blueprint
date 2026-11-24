# Audio generation for Lovable: The Borrowed Blueprint

**Lovable: this file is your complete brief for the voice audio.** Generate all **106 clips** listed below, one MP3 per clip, using the exact ID, file name and words given. The app already plays these files; it just needs them to exist.

This file is generated from `app/assets/audio-manifest.json`, which is the list the app reads at runtime. If the two ever disagree, the manifest wins. `production/ALL_AUDIO_SCRIPTS.md` holds the same scripts in the original handoff format.

## What to produce

- **106 MP3 files**, one per clip ID, about 11 minutes of speech in total (planning estimate).
- **File name = clip ID + `.mp3`**, exactly as listed (case matters: `S4_EZE.mp3`, `SRC_basque.mp3`).
- **Where they go:** the folder `assets/audio/` next to the app's `index.html`. In this kit that is `app/assets/audio/`. In a Vite or Lovable project, put them in `public/assets/audio/` so they are served at `/assets/audio/<ID>.mp3`.
- **Words:** use the script text exactly. Do not paraphrase, shorten, add greetings, or insert the learner's name. Spelling and punctuation are part of the direction.
- **Format:** MP3, mono, 44.1 kHz, 128 kbps. Loudness about −16 LUFS integrated, true peak at or below −1 dBTP. Keep WAV masters separately if your tool provides them.
- **Clean voice only:** no music, reverb, sound effects, intros or outros in the voice files.

## Rules the app depends on

1. **Prerecorded only.** Generate the files once, ahead of time, and ship them with the app. Do not generate speech live while a learner is using the app, do not use the browser's built-in speech (speechSynthesis), and do not add a live AI voice. The guide is scripted, branching, prerecorded audio.
2. **Keep API keys out of the app.** If you use a text-to-speech service (for example ElevenLabs), call it from a one-off script or a server-side function, store the key as a server secret, and save the resulting MP3s into the folder above. Never put a key in browser code.
3. **One voice per speaker, the same voice every time.** All 35 guide lines must sound like the same guide; all Dr Eze lines like the same Dr Eze, and so on.
4. **Fictional people.** Every speaker is a fictional character. Do not clone or imitate any real, named person's voice.
5. **Do not change the code to fit the audio.** Missing or misnamed files fall back to on-screen text, so a wrong file name fails quietly. Match the names exactly.
6. **Long lines are fine.** Natural pace is about 125–145 words per minute. Never speed up or cut a line to hit the estimated duration; clear diction comes first.

## Voices

| Speaker ID | Character | Clips | Voice direction |
|---|---|---|---|
| `guide` | Guide | 35 | Nigerian English. Gender-neutral or soft female. Clear, calm, conversational; the friendly voice that explains each step. |
| `narrator` | Narrator | 4 | Nigerian English. Formal and composed; reads the four-part opening briefing. |
| `eze` | Dr Ngozi Eze | 32 | Mature Nigerian woman. Firm and efficient, with measured warmth. |
| `marin` | Prof. Elena Marín | 23 | Mature Spanish woman speaking English with a light Spanish accent. Calm and precise. |
| `sani` | Mr Yakubu Sani | 9 | Mature Nigerian man. Dry, direct, controlled. |
| `governors` | Governors’ Forum delegate | 1 | Nigerian man. Collegial but sceptical. Must sound different from Mr Sani. |
| `federal` | Federal Ministry delegate | 1 | Nigerian woman. Concise and exacting. Must sound different from Dr Eze. |
| `assembly` | National Assembly delegate | 1 | Nigerian man. Measured and analytical. Must sound different from the other men. |

## Pronunciation

| Word | Say it as |
|---|---|
| FAAC | “fack” |
| RMAFC | “R M A F C” (letters) |
| Basque | “bask” |
| Navarre | “nuh-VAR” |
| Catalonia | “kat-uh-LOH-nee-uh” |
| Marín | “mah-REEN” |
| Abuja | “ah-BOO-jah” |

Ask a Nigerian and a Spanish speaker, or the subject expert, to confirm local names before final export.

## Before publishing: subject-expert review

- `S4_SANI` is kept word for word from the source brief, but its absolute historical claim must be checked by a subject expert before release.
- The simplified legal consequences in the D3 dispute lines and in feature C (`FEATURE_C`, `CHECK_C`, `DECISION_C_*`) also need review.
- Generate them as written; if the expert changes the wording, update the manifest first, then regenerate only those clips.

## How the app uses the clips

- The app looks up each clip by ID in `app/assets/audio-manifest.json` and loads its `file` path.
- Some IDs are chosen at runtime by pattern, so every one listed must exist: `SRC_<source>`, `CLAIM_0–3`, `LESSON_0–3`, `LIMIT_0–3`, `BAND_0–3`, `FEATURE_A–C`, `CHECK_A–C`, `TEST_A–C`, `DECISION_<A–C>_<0–2>`, `CHALLENGE_<strand>`, `D3_FOLLOW_<n>`, `S1_REPLY_<n>`, `S2_<…>`.
- Narration `N01`–`N04` plays as one queued opening, so keep the narrator's level and tone continuous across the four files.
- Captions are off by default. When a file is missing or sound is off, the app shows the line as text with a "Next line" button instead.

## Check your work

Run this from the kit folder after generating. It lists any clip that is missing or empty:

```bash
node -e "const fs=require('fs'),m=JSON.parse(fs.readFileSync('app/assets/audio-manifest.json'));const miss=m.filter(c=>{try{return fs.statSync('app/'+c.file).size<1000}catch{return true}}).map(c=>c.id);console.log(miss.length?'Missing: '+miss.join(', '):'All '+m.length+' clips present')"
```

Then open the app, turn sound on, and play through: each line should now be heard, the guide's waveform should follow the voice, and the text-only "Next line" fallback should no longer appear for clips that exist.

## All 106 clips

Grouped by voice so each voice can be generated in one batch. Within a voice, clips are in the order the learner meets them.

### Guide (`guide`): 35 clips

#### G01

- **File:** `assets/audio/G01.mp3`  
- **Plays when:** Enter identity  
- **Source:** New interface guidance  
- **About:** 3.9 s

> Welcome. Enter your name, then your matriculation number.

#### S1_QUESTION

- **File:** `assets/audio/S1_QUESTION.mp3`  
- **Plays when:** Stance question  
- **Source:** New interface guidance  
- **About:** 6.5 s

> What is your starting position on Spain? Choose the view closest to your own.

#### S2_ENTER

- **File:** `assets/audio/S2_ENTER.mp3`  
- **Plays when:** Enter research  
- **Source:** Adapted from source brief  
- **About:** 11.6 s

> You have twenty-four research hours. Open at least two sources. Each new source costs six hours. Save time if you want to check your recommendations later.

#### S2_FREE

- **File:** `assets/audio/S2_FREE.mp3`  
- **Plays when:** Stance 0 research entry  
- **Source:** Adapted from source brief  
- **About:** 5.6 s

> Catalonia is already open. This first source costs you no research hours.

#### S2_CLAIM

- **File:** `assets/audio/S2_CLAIM.mp3`  
- **Plays when:** Enter claim builder  
- **Source:** Adapted from source brief  
- **About:** 6.9 s

> Choose the claim your reading can support. Then attach two of the sources you opened.

#### CLAIM_0

- **File:** `assets/audio/CLAIM_0.mp3`  
- **Plays when:** Optional read claim 0  
- **Source:** Source verbatim  
- **About:** 5.2 s

> Asymmetry breeds tension because each region measures fairness against another’s deal.

#### CLAIM_1

- **File:** `assets/audio/CLAIM_1.mp3`  
- **Plays when:** Optional read claim 1  
- **Source:** Source verbatim  
- **About:** 4.3 s

> The open constitutional design leaves fiscal terms permanently renegotiable.

#### CLAIM_2

- **File:** `assets/audio/CLAIM_2.mp3`  
- **Plays when:** Optional read claim 2  
- **Source:** Source verbatim  
- **About:** 3.5 s

> Tension is driven by nationalist party mobilisation.

#### CLAIM_3

- **File:** `assets/audio/CLAIM_3.mp3`  
- **Plays when:** Optional read claim 3  
- **Source:** Source verbatim  
- **About:** 2.6 s

> Litigation has replaced political bargaining.

#### S3_ENTER

- **File:** `assets/audio/S3_ENTER.mp3`  
- **Plays when:** Enter dispute desk  
- **Source:** Adapted from source brief  
- **About:** 12.4 s

> Three disputes are arriving. Choose the institution that should handle each one. Your decision locks when you confirm it, and earlier choices can make the next dispute harder.

#### S3_QUESTION

- **File:** `assets/audio/S3_QUESTION.mp3`  
- **Plays when:** After dispute narration  
- **Source:** Adapted from source brief  
- **About:** 2.6 s

> Which mechanism fits this dispute?

#### D3_FOLLOW_Q

- **File:** `assets/audio/D3_FOLLOW_Q.mp3`  
- **Plays when:** D3_FOLLOW_Q branch  
- **Source:** Adapted from source brief  
- **About:** 6.5 s

> Invoke Article 155 now, or let the Court use its own enforcement powers first?

#### S4_GUIDE

- **File:** `assets/audio/S4_GUIDE.mp3`  
- **Plays when:** After roundtable opening  
- **Source:** Adapted from source brief  
- **About:** 12.4 s

> For each feature, choose Transfer, Adapt, or Reject. A source check costs six reserve hours. You can decide without a check, but borrowing without checking raises fit risk.

#### FEATURE_A

- **File:** `assets/audio/FEATURE_A.mp3`  
- **Plays when:** Introduce card A  
- **Source:** Adapted from source brief  
- **About:** 3.1 s

> Bilateral fiscal deals for particular regions.

#### FEATURE_B

- **File:** `assets/audio/FEATURE_B.mp3`  
- **Plays when:** Introduce card B  
- **Source:** Adapted from source brief  
- **About:** 3.1 s

> Sector conferences and signed cooperation agreements.

#### FEATURE_C

- **File:** `assets/audio/FEATURE_C.mp3`  
- **Plays when:** Introduce card C  
- **Source:** Adapted from source brief  
- **About:** 5.6 s

> Automatic suspension of a contested regional law while the Constitutional Court decides.

#### S4_NO_HOURS

- **File:** `assets/audio/S4_NO_HOURS.mp3`  
- **Plays when:** Attempt source check with under six hours  
- **Source:** New interface guidance  
- **About:** 7.7 s

> There are not enough reserve hours for another check. The earlier sources remain in your brief notes.

#### CLOSE_Q

- **File:** `assets/audio/CLOSE_Q.mp3`  
- **Plays when:** Closing line builder  
- **Source:** New interaction adaptation  
- **About:** 9.0 s

> Close your brief with one usable lesson and one Nigerian limit. Choose a lesson, then the limit that qualifies it.

#### LESSON_0

- **File:** `assets/audio/LESSON_0.mp3`  
- **Plays when:** Read lesson option 0  
- **Source:** New structured closing option  
- **About:** 6.9 s

> Nigeria can use regular sector conferences and written cooperation agreements to resolve disagreements before litigation.

#### LESSON_1

- **File:** `assets/audio/LESSON_1.mp3`  
- **Plays when:** Read lesson option 1  
- **Source:** New structured closing option  
- **About:** 7.7 s

> Nigeria can adapt transparent negotiated fiscal rules so that every state has a fair route to participation.

#### LESSON_2

- **File:** `assets/audio/LESSON_2.mp3`  
- **Plays when:** Read lesson option 2  
- **Source:** New structured closing option  
- **About:** 6.5 s

> Nigeria can match each dispute to negotiation, coordination or adjudication before choosing a response.

#### LESSON_3

- **File:** `assets/audio/LESSON_3.mp3`  
- **Plays when:** Read lesson option 3  
- **Source:** New structured closing option  
- **About:** 7.3 s

> Nigeria can learn from Spain by seeking better outcomes and keeping an open mind about reform.

#### LIMIT_0

- **File:** `assets/audio/LIMIT_0.mp3`  
- **Plays when:** Read limit option 0  
- **Source:** New structured closing option  
- **About:** 7.3 s

> But the constitution and the equal status of states constrain how such arrangements can be introduced.

#### LIMIT_1

- **File:** `assets/audio/LIMIT_1.mp3`  
- **Plays when:** Read limit option 1  
- **Source:** New structured closing option  
- **About:** 6.0 s

> But party alignment and state-centre trust will shape whether cooperation works in practice.

#### LIMIT_2

- **File:** `assets/audio/LIMIT_2.mp3`  
- **Plays when:** Read limit option 2  
- **Source:** New structured closing option  
- **About:** 6.9 s

> But resource control, derivation and FAAC politics limit the case for copying special fiscal deals.

#### LIMIT_3

- **File:** `assets/audio/LIMIT_3.mp3`  
- **Plays when:** Read limit option 3  
- **Source:** New structured closing option  
- **About:** 6.9 s

> But progress will depend on everyone making a strong effort and remaining positive about change.

#### S5_ENTER

- **File:** `assets/audio/S5_ENTER.mp3`  
- **Plays when:** Enter retreat  
- **Source:** Adapted from source brief  
- **About:** 9.4 s

> The retreat has begun. A delegate will test the weakest part of your brief. Your earlier choices are on the table.

#### S5_RESPONSE

- **File:** `assets/audio/S5_RESPONSE.mp3`  
- **Plays when:** Retreat response prompt  
- **Source:** Adapted from source brief  
- **About:** 6.0 s

> Concede and adjust, defend using your sources, or reframe this as further research.

#### S5_STANCE

- **File:** `assets/audio/S5_STANCE.mp3`  
- **Plays when:** Repeat stance poll  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> Return to your opening position. Which view do you hold now?

#### DEBRIEF_LESSONS

- **File:** `assets/audio/DEBRIEF_LESSONS.mp3`  
- **Plays when:** Optional final learning summary  
- **Source:** Adapted from source brief  
- **About:** 12.0 s

> Asymmetry is a design choice with costs. Match the dispute to the mechanism. Borrow principles with clear limits. A brief must survive challenge, not only read well.

#### DEBRIEF_REVIEW

- **File:** `assets/audio/DEBRIEF_REVIEW.mp3`  
- **Plays when:** Enter debrief controls  
- **Source:** Adapted from source brief  
- **About:** 9.0 s

> Open your choices to revisit the decisions, or open your brief to read the record. Restart begins a new attempt.

#### HELP_RESEARCH

- **File:** `assets/audio/HELP_RESEARCH.mp3`  
- **Plays when:** Research Help  
- **Source:** New interface guidance  
- **About:** 7.3 s

> Select a map point or its matching source button. Read or listen, then choose another source.

#### HELP_OPTIONS

- **File:** `assets/audio/HELP_OPTIONS.mp3`  
- **Plays when:** Options Help  
- **Source:** New interface guidance  
- **About:** 5.2 s

> Select an option, then confirm. Once confirmed, your decision is saved.

#### HELP_CAPTIONS

- **File:** `assets/audio/HELP_CAPTIONS.mp3`  
- **Plays when:** Settings Help  
- **Source:** New interface guidance  
- **About:** 7.7 s

> Captions show the current spoken line. Full source text and your record are available in Brief Notes.

#### RESUME

- **File:** `assets/audio/RESUME.mp3`  
- **Plays when:** Saved run landing  
- **Source:** New interface guidance  
- **About:** 5.6 s

> Your saved brief is ready. Continue from where you stopped, or restart.

### Narrator (`narrator`): 4 clips

#### N01

- **File:** `assets/audio/N01.mp3`  
- **Plays when:** Opening briefing 1  
- **Source:** Source verbatim  
- **About:** 5.6 s

> Abuja. A dispute over the Federation Account has reached the Supreme Court.

#### N02

- **File:** `assets/audio/N02.mp3`  
- **Plays when:** Opening briefing 2  
- **Source:** Source verbatim  
- **About:** 8.2 s

> In seventy-two hours, the Federal Government and the states meet to ask how such disputes should be settled.

#### N03

- **File:** `assets/audio/N03.mp3`  
- **Plays when:** Opening briefing 3  
- **Source:** Source verbatim  
- **About:** 9.9 s

> Spain is the model on the table. Seventeen regions. Different powers. Different fiscal deals. Yet the conflict has never fully gone away.

#### N04

- **File:** `assets/audio/N04.mp3`  
- **Plays when:** Opening briefing 4  
- **Source:** Source verbatim  
- **About:** 7.3 s

> You are the analyst. What can Nigeria borrow from Spain, and where does the comparison break?

### Dr Ngozi Eze (`eze`): 32 clips

#### S1_EZE

- **File:** `assets/audio/S1_EZE.mp3`  
- **Plays when:** Enter stance  
- **Source:** Adapted from source brief  
- **About:** 10.7 s

> I need a brief I can defend at the retreat. We will compare Spain with Nigeria, then decide what travels and what does not.

#### S1_REPLY_0

- **File:** `assets/audio/S1_REPLY_0.mp3`  
- **Plays when:** Opening stance 0  
- **Source:** Source verbatim  
- **About:** 3.5 s

> Then show me how. Start with Catalonia.

#### S1_REPLY_1

- **File:** `assets/audio/S1_REPLY_1.mp3`  
- **Plays when:** Opening stance 1  
- **Source:** Source verbatim  
- **About:** 3.1 s

> Then show me where it breaks.

#### S1_REPLY_2

- **File:** `assets/audio/S1_REPLY_2.mp3`  
- **Plays when:** Opening stance 2  
- **Source:** Source verbatim  
- **About:** 2.2 s

> Then show me why.

#### S2_full

- **File:** `assets/audio/S2_full.mp3`  
- **Plays when:** Claim fit full  
- **Source:** Source verbatim  
- **About:** 2.6 s

> The evidence carries the claim.

#### S2_partial

- **File:** `assets/audio/S2_partial.mp3`  
- **Plays when:** Claim fit partial  
- **Source:** Source verbatim  
- **About:** 4.8 s

> Half of this is assertion. The retreat will find it.

#### S2_none

- **File:** `assets/audio/S2_none.mp3`  
- **Plays when:** Claim fit none  
- **Source:** Source verbatim  
- **About:** 2.2 s

> Nothing here supports that.

#### D1

- **File:** `assets/audio/D1.mp3`  
- **Plays when:** Dispute 1 arrives  
- **Source:** Source verbatim  
- **About:** 6.5 s

> Madrid and the Basque government disagree on the annual payment under their fiscal agreement.

#### D2

- **File:** `assets/audio/D2.mp3`  
- **Plays when:** Dispute 2 arrives  
- **Source:** Source verbatim  
- **About:** 4.3 s

> Several regions say the common funding formula shortchanges them.

#### D3

- **File:** `assets/audio/D3.mp3`  
- **Plays when:** Dispute 3 arrives  
- **Source:** Source verbatim  
- **About:** 6.0 s

> A regional parliament passes a law the central government says exceeds regional powers.

#### D3_ESC

- **File:** `assets/audio/D3_ESC.mp3`  
- **Plays when:** D3 after D1 or D2 misroute  
- **Source:** Adapted from source brief  
- **About:** 10.3 s

> A regional parliament passes a law the central government says exceeds regional powers. The region now says it will ignore an adverse ruling.

#### D1_0

- **File:** `assets/audio/D1_0.mp3`  
- **Plays when:** D1_0 branch  
- **Source:** Adapted from source brief  
- **About:** 3.9 s

> Settled in the bilateral commission. No court needed.

#### D2_1

- **File:** `assets/audio/D2_1.mp3`  
- **Plays when:** D2_1 branch  
- **Source:** Adapted from source brief  
- **About:** 6.9 s

> Talks open with all regions. No ruling, no winner. The centre keeps the final say.

#### D3_2

- **File:** `assets/audio/D3_2.mp3`  
- **Plays when:** D3_2 branch  
- **Source:** Adapted from source brief  
- **About:** 7.7 s

> The government challenges. The law is suspended. The Court must confirm or lift this within five months.

#### D3_ESC_OK

- **File:** `assets/audio/D3_ESC_OK.mp3`  
- **Plays when:** D3_ESC_OK branch  
- **Source:** Adapted from source brief  
- **About:** 7.7 s

> The Court rules against the region. The region does not comply. You now have a further decision.

#### D3_ESC_BAD

- **File:** `assets/audio/D3_ESC_BAD.mp3`  
- **Plays when:** D3_ESC_BAD branch  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> The law stays in force, and the region keeps its position.

#### D1_COUNTER

- **File:** `assets/audio/D1_COUNTER.mp3`  
- **Plays when:** D1_COUNTER branch  
- **Source:** Adapted from source brief  
- **About:** 6.0 s

> A quiet settlement, in the most asymmetric case. Does that fit your thesis?

#### S4_EZE

- **File:** `assets/audio/S4_EZE.mp3`  
- **Plays when:** Roundtable opening 1  
- **Source:** Source verbatim  
- **About:** 6.0 s

> Three Spanish features. Tell us what Nigeria can take, and what it cannot.

#### DECISION_A_2

- **File:** `assets/audio/DECISION_A_2.mp3`  
- **Plays when:** Feature decision A_2  
- **Source:** Source verbatim  
- **About:** 4.8 s

> Safe. But you lose Spain’s lesson on transparent, negotiated rules.

#### DECISION_B_0

- **File:** `assets/audio/DECISION_B_0.mp3`  
- **Plays when:** Feature decision B_0  
- **Source:** Source verbatim  
- **About:** 2.6 s

> No amendment needed. Do it.

#### DECISION_C_1

- **File:** `assets/audio/DECISION_C_1.mp3`  
- **Plays when:** Feature decision C_1  
- **Source:** Source verbatim  
- **About:** 3.9 s

> With what safeguard? Otherwise it is a weapon.

#### CLOSE_ACCEPT

- **File:** `assets/audio/CLOSE_ACCEPT.mp3`  
- **Plays when:** Submit closing line  
- **Source:** Source verbatim  
- **About:** 2.6 s

> That goes in the brief.

#### VERDICT_concede

- **File:** `assets/audio/VERDICT_concede.mp3`  
- **Plays when:** Retreat response concede  
- **Source:** Adapted from source brief  
- **About:** 4.8 s

> The delegates accept the revised brief and note your correction.

#### VERDICT_defend_ok

- **File:** `assets/audio/VERDICT_defend_ok.mp3`  
- **Plays when:** Retreat response defend_ok  
- **Source:** Adapted from source brief  
- **About:** 3.9 s

> The delegates test your sources. Your defence holds.

#### VERDICT_defend_bad

- **File:** `assets/audio/VERDICT_defend_bad.mp3`  
- **Plays when:** Retreat response defend_bad  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> The delegates test your sources. The gap in your reading shows.

#### VERDICT_reframe

- **File:** `assets/audio/VERDICT_reframe.mp3`  
- **Plays when:** Retreat response reframe  
- **Source:** Adapted from source brief  
- **About:** 4.3 s

> The delegates note that the question was not answered.

#### S5_HELD

- **File:** `assets/audio/S5_HELD.mp3`  
- **Plays when:** Same stance at close  
- **Source:** Adapted from source brief  
- **About:** 6.0 s

> You held your opening position. Review how well your sources now support it.

#### S5_CHANGED

- **File:** `assets/audio/S5_CHANGED.mp3`  
- **Plays when:** Different stance at close  
- **Source:** Adapted from source brief  
- **About:** 6.5 s

> Your position changed. Compare your opening view with the one you are taking away.

#### BAND_0

- **File:** `assets/audio/BAND_0.mp3`  
- **Plays when:** Final outcome band 0  
- **Source:** Adapted from source brief  
- **About:** 4.8 s

> Your brief is adopted. The delegates accept its mechanism recommendations.

#### BAND_1

- **File:** `assets/audio/BAND_1.mp3`  
- **Plays when:** Final outcome band 1  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> Your brief is adopted with revisions. One section needs further work.

#### BAND_2

- **File:** `assets/audio/BAND_2.mp3`  
- **Plays when:** Final outcome band 2  
- **Source:** Adapted from source brief  
- **About:** 5.6 s

> Your brief is returned. Revisit the weak sections before the next round.

#### BAND_3

- **File:** `assets/audio/BAND_3.mp3`  
- **Plays when:** Final outcome band 3  
- **Source:** Adapted from source brief  
- **About:** 6.9 s

> Your brief is rejected. Review how you read Spain and how you judged Nigeria’s limits.

### Prof. Elena Marín (`marin`): 23 clips

#### SRC_constitution

- **File:** `assets/audio/SRC_constitution.mp3`  
- **Plays when:** Open or replay 1978 Constitution  
- **Source:** Adapted from source brief  
- **About:** 9.4 s

> No single model. Seventeen autonomous communities. Powers devolved region by region, at different speeds. The centre keeps wide powers to coordinate.

#### SRC_basque

- **File:** `assets/audio/SRC_basque.mp3`  
- **Plays when:** Open or replay Basque Country & Navarre  
- **Source:** Adapted from source brief  
- **About:** 10.7 s

> The Basque Country and Navarre have a special fiscal regime. They collect most taxes and pay the State a negotiated sum for State services.

#### SRC_catalonia

- **File:** `assets/audio/SRC_catalonia.mp3`  
- **Plays when:** Open or replay Catalonia  
- **Source:** Adapted from source brief  
- **About:** 11.6 s

> The statute was reformed in 2006. The Constitutional Court limited parts of it in 2010. The 2017 referendum was ruled unlawful, and Article 155 was invoked.

#### SRC_andalusia

- **File:** `assets/audio/SRC_andalusia.mp3`  
- **Plays when:** Open or replay Andalusia  
- **Source:** Adapted from source brief  
- **About:** 10.3 s

> Andalusia is in the common regime. It is funded through a national formula and transfers. Disputes centre on how fair the formula is.

#### D1_1

- **File:** `assets/audio/D1_1.mp3`  
- **Plays when:** D1_1 branch  
- **Source:** Adapted from source brief  
- **About:** 4.8 s

> The council handles the common formula, not the Basque payment.

#### D1_2

- **File:** `assets/audio/D1_2.mp3`  
- **Plays when:** D1_2 branch  
- **Source:** Adapted from source brief  
- **About:** 4.3 s

> Slow and adversarial. The agreement has its own commission.

#### D1_3

- **File:** `assets/audio/D1_3.mp3`  
- **Plays when:** D1_3 branch  
- **Source:** Adapted from source brief  
- **About:** 5.6 s

> Last resort. Spain used it in 2017, after the Court, not before.

#### D2_2

- **File:** `assets/audio/D2_2.mp3`  
- **Plays when:** D2_2 branch  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> The Court judges legality, not funding formulas. The politics stays unresolved.

#### D2_3

- **File:** `assets/audio/D2_3.mp3`  
- **Plays when:** D2_3 branch  
- **Source:** Adapted from source brief  
- **About:** 5.6 s

> Last resort. Spain used it in 2017, after the Court, not before.

#### D3_0

- **File:** `assets/audio/D3_0.mp3`  
- **Plays when:** D3_0 branch  
- **Source:** Adapted from source brief  
- **About:** 6.0 s

> A private deal over a public law does not settle the constitutional question.

#### D3_1

- **File:** `assets/audio/D3_1.mp3`  
- **Plays when:** D3_1 branch  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> The council cannot rule on legality. The law stays in force.

#### D3_3

- **File:** `assets/audio/D3_3.mp3`  
- **Plays when:** D3_3 branch  
- **Source:** Adapted from source brief  
- **About:** 5.6 s

> Last resort. Spain used it in 2017, after the Court, not before.

#### D3_FOLLOW_0

- **File:** `assets/audio/D3_FOLLOW_0.mp3`  
- **Plays when:** D3_FOLLOW_0 branch  
- **Source:** Adapted from source brief  
- **About:** 6.5 s

> Intervention needs an absolute Senate majority. Order is restored faster, but regional grievance deepens.

#### D3_FOLLOW_1

- **File:** `assets/audio/D3_FOLLOW_1.mp3`  
- **Plays when:** D3_FOLLOW_1 branch  
- **Source:** Adapted from source brief  
- **About:** 10.3 s

> Since 2015, the Court can enforce its rulings, including fines and suspension of officials. Slower enforcement keeps the centre’s legitimacy while tension persists.

#### S4_MARIN

- **File:** `assets/audio/S4_MARIN.mp3`  
- **Plays when:** Roundtable opening 2  
- **Source:** Source verbatim  
- **About:** 9.9 s

> Spain’s system works because of how it was built, not only what it contains. Copy the parts and you may miss that.

#### CHECK_A

- **File:** `assets/audio/CHECK_A.mp3`  
- **Plays when:** Paid source check A  
- **Source:** Adapted from source brief  
- **About:** 9.4 s

> The Basque and Navarre arrangements rest on historic rights recognised in the Constitution itself. They were not designed as a template.

#### CHECK_B

- **File:** `assets/audio/CHECK_B.mp3`  
- **Plays when:** Paid source check B  
- **Source:** Adapted from source brief  
- **About:** 5.2 s

> Sector conferences, cooperation agreements and party alignment each help prevent contestation.

#### CHECK_C

- **File:** `assets/audio/CHECK_C.mp3`  
- **Plays when:** Paid source check C  
- **Source:** Adapted from source brief  
- **About:** 10.3 s

> The power sits in Spain’s Constitution, Article 161.2, and lapses after five months unless the Court confirms it. Nigeria would need an amendment.

#### DECISION_A_1

- **File:** `assets/audio/DECISION_A_1.mp3`  
- **Plays when:** Feature decision A_1  
- **Source:** Source verbatim  
- **About:** 5.2 s

> Keep the principle: open, rules-based arrangements any state can qualify for.

#### DECISION_B_1

- **File:** `assets/audio/DECISION_B_1.mp3`  
- **Plays when:** Feature decision B_1  
- **Source:** Source verbatim  
- **About:** 3.9 s

> Reasonable, but do not overbuild what already works.

#### DECISION_B_2

- **File:** `assets/audio/DECISION_B_2.mp3`  
- **Plays when:** Feature decision B_2  
- **Source:** Source verbatim  
- **About:** 3.9 s

> Then states keep reaching for the courts first.

#### DECISION_C_2

- **File:** `assets/audio/DECISION_C_2.mp3`  
- **Plays when:** Feature decision C_2  
- **Source:** Source verbatim  
- **About:** 5.6 s

> In Spain the centre holds it. Your states would never accept that.

#### S4_REJECT

- **File:** `assets/audio/S4_REJECT.mp3`  
- **Plays when:** Opening stance 2, Reject without check  
- **Source:** Source verbatim  
- **About:** 3.5 s

> Rejecting is easy. What would you borrow?

### Mr Yakubu Sani (`sani`): 9 clips

#### D2_0

- **File:** `assets/audio/D2_0.mp3`  
- **Plays when:** D2_0 branch  
- **Source:** Adapted from source brief  
- **About:** 3.1 s

> One region’s deal fuels others’ grievance.

#### S4_SANI

- **File:** `assets/audio/S4_SANI.mp3`  
- **Plays when:** Roundtable opening 3; subject expert review before release  
- **Source:** Source verbatim; review flag  
- **About:** 4.8 s

> Spain has no resource control history. We do. Start there.

#### TEST_A

- **File:** `assets/audio/TEST_A.mp3`  
- **Plays when:** Nigerian test A  
- **Source:** Source verbatim  
- **About:** 5.2 s

> Give one state a special deal and thirty-five will want theirs.

#### TEST_B

- **File:** `assets/audio/TEST_B.mp3`  
- **Plays when:** Nigerian test B  
- **Source:** Source verbatim  
- **About:** 5.6 s

> Spain’s calm owes something to shared parties. Ours do not always align.

#### TEST_C

- **File:** `assets/audio/TEST_C.mp3`  
- **Plays when:** Nigerian test C  
- **Source:** Source verbatim  
- **About:** 6.5 s

> Our Supreme Court already hears these cases. And this power would sit in Abuja.

#### DECISION_A_0

- **File:** `assets/audio/DECISION_A_0.mp3`  
- **Plays when:** Feature decision A_0  
- **Source:** Source verbatim  
- **About:** 2.6 s

> You have reopened resource control.

#### DECISION_C_0

- **File:** `assets/audio/DECISION_C_0.mp3`  
- **Plays when:** Feature decision C_0  
- **Source:** Source verbatim  
- **About:** 3.5 s

> Abuja could freeze any state law. No.

#### S4_ART155

- **File:** `assets/audio/S4_ART155.mp3`  
- **Plays when:** Borrow Card C after Article 155 follow-up  
- **Source:** Source verbatim  
- **About:** 5.2 s

> You have just shown us what Abuja would do with it.

#### CHALLENGE_transfer

- **File:** `assets/audio/CHALLENGE_transfer.mp3`  
- **Plays when:** Weakest normalised strand transfer  
- **Source:** Source verbatim  
- **About:** 4.8 s

> Name one thing in your brief that survives Nigerian politics.

### Governors’ Forum delegate (`governors`): 1 clips

#### CHALLENGE_asymmetry

- **File:** `assets/audio/CHALLENGE_asymmetry.mp3`  
- **Plays when:** Weakest normalised strand asymmetry  
- **Source:** Source verbatim  
- **About:** 5.6 s

> Nigeria’s states are equal. Why does Spain’s unequal design tell us anything?

### Federal Ministry delegate (`federal`): 1 clips

#### CHALLENGE_mechanisms

- **File:** `assets/audio/CHALLENGE_mechanisms.mp3`  
- **Plays when:** Weakest normalised strand mechanisms  
- **Source:** Source verbatim  
- **About:** 5.2 s

> Which Spanish mechanism would have settled our FAAC dispute? Be specific.

### National Assembly delegate (`assembly`): 1 clips

#### CHALLENGE_limits

- **File:** `assets/audio/CHALLENGE_limits.mp3`  
- **Plays when:** Weakest normalised strand limits  
- **Source:** Source verbatim  
- **About:** 5.2 s

> You lead with a lesson. What would make it fail here?

## Optional sounds (not required)

These are not wired into the app and are not needed for launch. Only make them if asked.

| ID | Sound | When | Direction |
|---|---|---|---|
| FX_SELECT | Soft tick | Confirming a choice | 60–100 ms, low volume, never a right/wrong cue |
| FX_FOLD | Soft airy transition | Character card folds to its portrait | 120–180 ms |
| FX_PAN | Quiet airy sweep | The Spain–Nigeria map journey | At most 500 ms |
| MUSIC_BED | Calm, hopeful ambient instrumental | Optional after Start | No vocals, 20–30% level at most, silent under all speech |
