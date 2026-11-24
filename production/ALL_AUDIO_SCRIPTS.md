# Complete audio production script — The Borrowed Blueprint

106 separate clips. Generate one file per ID; preserve spelling and punctuation. Text is the recording script, not default visible UI. Captions are off by default by the user’s latest direction. Sound-off or missing-audio fallback exposes text so the task remains usable.

## Voice casting

- **guide** — Nigerian English; gender-neutral or soft female; clear, calm, conversational.
- **narrator** — Nigerian English; formal, composed.
- **eze** — Mature Nigerian female; firm and efficient, measured warmth.
- **marin** — Mature Spanish female; light Spanish accent in English, calm and precise.
- **sani** — Mature Nigerian male; dry, direct, controlled.
- **governors** — Nigerian male; collegial but sceptical; distinct from Sani.
- **federal** — Nigerian female; concise, exacting; distinct from Eze.
- **assembly** — Nigerian male; measured, analytical; distinct from the other men.

## Recording and delivery

- Deliver MP3 mono, 44.1 kHz, 128 kbps, roughly −16 LUFS integrated, true peak at or below −1 dBTP. Keep WAV masters separately. No music, reverb or sound effects baked into voice.
- Keep each character’s voice consistent. Use Nigerian English for Nigerian speakers. Do not imitate a named real person.
- Natural pace around 125–145 words/minute. Do not force long lines into eight seconds; trim wording only with content approval. Duration estimates below are planning estimates.
- Record narration N01–N04 as separate clips; they queue as one opening. The original 30–35 second target may require longer for clear diction.
- Pronunciation: FAAC = “fack”; RMAFC = “R M A F C”; Basque = “bask”; Navarre = “nuh-VAR”; Catalonia = “kat-uh-LOH-nee-uh”; Marín = “mah-REEN”; Abuja = “ah-BOO-jah”. Ask cast/subject expert to confirm local names.
- Waveforms respond to playback amplitude. Portrait pixel reveal is brief at entry only. Globe activity represents a UI handoff/audio preparation, not live LLM reasoning. One audio queue; no overlapping speakers.
- Every clip has a pause, replay and skip path. Stopping sound pauses playback and exposes the current text. Next line advances the retained queue in text mode.
- `S4_SANI` is preserved verbatim from the source but its absolute historical claim needs subject-expert review before publication. Also review simplified legal consequences in D3 and feature C. Do not silently replace the source claim.

## Clip catalogue

### G01 · guide
**File:** `assets/audio/G01.mp3`  
**Trigger:** Enter identity  
**Origin:** New interface guidance  
**Estimated duration:** 3.9 seconds

Welcome. Enter your name, then your matriculation number.

### N01 · narrator
**File:** `assets/audio/N01.mp3`  
**Trigger:** Opening briefing 1  
**Origin:** Source verbatim  
**Estimated duration:** 5.6 seconds

Abuja. A dispute over the Federation Account has reached the Supreme Court.

### N02 · narrator
**File:** `assets/audio/N02.mp3`  
**Trigger:** Opening briefing 2  
**Origin:** Source verbatim  
**Estimated duration:** 8.2 seconds

In seventy-two hours, the Federal Government and the states meet to ask how such disputes should be settled.

### N03 · narrator
**File:** `assets/audio/N03.mp3`  
**Trigger:** Opening briefing 3  
**Origin:** Source verbatim  
**Estimated duration:** 9.9 seconds

Spain is the model on the table. Seventeen regions. Different powers. Different fiscal deals. Yet the conflict has never fully gone away.

### N04 · narrator
**File:** `assets/audio/N04.mp3`  
**Trigger:** Opening briefing 4  
**Origin:** Source verbatim  
**Estimated duration:** 7.3 seconds

You are the analyst. What can Nigeria borrow from Spain, and where does the comparison break?

### S1_EZE · eze
**File:** `assets/audio/S1_EZE.mp3`  
**Trigger:** Enter stance  
**Origin:** Adapted from source brief  
**Estimated duration:** 10.7 seconds

I need a brief I can defend at the retreat. We will compare Spain with Nigeria, then decide what travels and what does not.

### S1_QUESTION · guide
**File:** `assets/audio/S1_QUESTION.mp3`  
**Trigger:** Stance question  
**Origin:** New interface guidance  
**Estimated duration:** 6.5 seconds

What is your starting position on Spain? Choose the view closest to your own.

### S1_REPLY_0 · eze
**File:** `assets/audio/S1_REPLY_0.mp3`  
**Trigger:** Opening stance 0  
**Origin:** Source verbatim  
**Estimated duration:** 3.5 seconds

Then show me how. Start with Catalonia.

### S1_REPLY_1 · eze
**File:** `assets/audio/S1_REPLY_1.mp3`  
**Trigger:** Opening stance 1  
**Origin:** Source verbatim  
**Estimated duration:** 3.1 seconds

Then show me where it breaks.

### S1_REPLY_2 · eze
**File:** `assets/audio/S1_REPLY_2.mp3`  
**Trigger:** Opening stance 2  
**Origin:** Source verbatim  
**Estimated duration:** 2.2 seconds

Then show me why.

### S2_ENTER · guide
**File:** `assets/audio/S2_ENTER.mp3`  
**Trigger:** Enter research  
**Origin:** Adapted from source brief  
**Estimated duration:** 11.6 seconds

You have twenty-four research hours. Open at least two sources. Each new source costs six hours. Save time if you want to check your recommendations later.

### S2_FREE · guide
**File:** `assets/audio/S2_FREE.mp3`  
**Trigger:** Stance 0 research entry  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.6 seconds

Catalonia is already open. This first source costs you no research hours.

### SRC_constitution · marin
**File:** `assets/audio/SRC_constitution.mp3`  
**Trigger:** Open or replay 1978 Constitution  
**Origin:** Adapted from source brief  
**Estimated duration:** 9.4 seconds

No single model. Seventeen autonomous communities. Powers devolved region by region, at different speeds. The centre keeps wide powers to coordinate.

### SRC_basque · marin
**File:** `assets/audio/SRC_basque.mp3`  
**Trigger:** Open or replay Basque Country & Navarre  
**Origin:** Adapted from source brief  
**Estimated duration:** 10.7 seconds

The Basque Country and Navarre have a special fiscal regime. They collect most taxes and pay the State a negotiated sum for State services.

### SRC_catalonia · marin
**File:** `assets/audio/SRC_catalonia.mp3`  
**Trigger:** Open or replay Catalonia  
**Origin:** Adapted from source brief  
**Estimated duration:** 11.6 seconds

The statute was reformed in 2006. The Constitutional Court limited parts of it in 2010. The 2017 referendum was ruled unlawful, and Article 155 was invoked.

### SRC_andalusia · marin
**File:** `assets/audio/SRC_andalusia.mp3`  
**Trigger:** Open or replay Andalusia  
**Origin:** Adapted from source brief  
**Estimated duration:** 10.3 seconds

Andalusia is in the common regime. It is funded through a national formula and transfers. Disputes centre on how fair the formula is.

### S2_CLAIM · guide
**File:** `assets/audio/S2_CLAIM.mp3`  
**Trigger:** Enter claim builder  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.9 seconds

Choose the claim your reading can support. Then attach two of the sources you opened.

### CLAIM_0 · guide
**File:** `assets/audio/CLAIM_0.mp3`  
**Trigger:** Optional read claim 0  
**Origin:** Source verbatim  
**Estimated duration:** 5.2 seconds

Asymmetry breeds tension because each region measures fairness against another’s deal.

### CLAIM_1 · guide
**File:** `assets/audio/CLAIM_1.mp3`  
**Trigger:** Optional read claim 1  
**Origin:** Source verbatim  
**Estimated duration:** 4.3 seconds

The open constitutional design leaves fiscal terms permanently renegotiable.

### CLAIM_2 · guide
**File:** `assets/audio/CLAIM_2.mp3`  
**Trigger:** Optional read claim 2  
**Origin:** Source verbatim  
**Estimated duration:** 3.5 seconds

Tension is driven by nationalist party mobilisation.

### CLAIM_3 · guide
**File:** `assets/audio/CLAIM_3.mp3`  
**Trigger:** Optional read claim 3  
**Origin:** Source verbatim  
**Estimated duration:** 2.6 seconds

Litigation has replaced political bargaining.

### S2_full · eze
**File:** `assets/audio/S2_full.mp3`  
**Trigger:** Claim fit full  
**Origin:** Source verbatim  
**Estimated duration:** 2.6 seconds

The evidence carries the claim.

### S2_partial · eze
**File:** `assets/audio/S2_partial.mp3`  
**Trigger:** Claim fit partial  
**Origin:** Source verbatim  
**Estimated duration:** 4.8 seconds

Half of this is assertion. The retreat will find it.

### S2_none · eze
**File:** `assets/audio/S2_none.mp3`  
**Trigger:** Claim fit none  
**Origin:** Source verbatim  
**Estimated duration:** 2.2 seconds

Nothing here supports that.

### S3_ENTER · guide
**File:** `assets/audio/S3_ENTER.mp3`  
**Trigger:** Enter dispute desk  
**Origin:** Adapted from source brief  
**Estimated duration:** 12.4 seconds

Three disputes are arriving. Choose the institution that should handle each one. Your decision locks when you confirm it, and earlier choices can make the next dispute harder.

### D1 · eze
**File:** `assets/audio/D1.mp3`  
**Trigger:** Dispute 1 arrives  
**Origin:** Source verbatim  
**Estimated duration:** 6.5 seconds

Madrid and the Basque government disagree on the annual payment under their fiscal agreement.

### D2 · eze
**File:** `assets/audio/D2.mp3`  
**Trigger:** Dispute 2 arrives  
**Origin:** Source verbatim  
**Estimated duration:** 4.3 seconds

Several regions say the common funding formula shortchanges them.

### D3 · eze
**File:** `assets/audio/D3.mp3`  
**Trigger:** Dispute 3 arrives  
**Origin:** Source verbatim  
**Estimated duration:** 6.0 seconds

A regional parliament passes a law the central government says exceeds regional powers.

### D3_ESC · eze
**File:** `assets/audio/D3_ESC.mp3`  
**Trigger:** D3 after D1 or D2 misroute  
**Origin:** Adapted from source brief  
**Estimated duration:** 10.3 seconds

A regional parliament passes a law the central government says exceeds regional powers. The region now says it will ignore an adverse ruling.

### S3_QUESTION · guide
**File:** `assets/audio/S3_QUESTION.mp3`  
**Trigger:** After dispute narration  
**Origin:** Adapted from source brief  
**Estimated duration:** 2.6 seconds

Which mechanism fits this dispute?

### D1_0 · eze
**File:** `assets/audio/D1_0.mp3`  
**Trigger:** D1_0 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 3.9 seconds

Settled in the bilateral commission. No court needed.

### D1_1 · marin
**File:** `assets/audio/D1_1.mp3`  
**Trigger:** D1_1 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 4.8 seconds

The council handles the common formula, not the Basque payment.

### D1_2 · marin
**File:** `assets/audio/D1_2.mp3`  
**Trigger:** D1_2 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 4.3 seconds

Slow and adversarial. The agreement has its own commission.

### D1_3 · marin
**File:** `assets/audio/D1_3.mp3`  
**Trigger:** D1_3 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.6 seconds

Last resort. Spain used it in 2017, after the Court, not before.

### D2_0 · sani
**File:** `assets/audio/D2_0.mp3`  
**Trigger:** D2_0 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 3.1 seconds

One region’s deal fuels others’ grievance.

### D2_1 · eze
**File:** `assets/audio/D2_1.mp3`  
**Trigger:** D2_1 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.9 seconds

Talks open with all regions. No ruling, no winner. The centre keeps the final say.

### D2_2 · marin
**File:** `assets/audio/D2_2.mp3`  
**Trigger:** D2_2 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

The Court judges legality, not funding formulas. The politics stays unresolved.

### D2_3 · marin
**File:** `assets/audio/D2_3.mp3`  
**Trigger:** D2_3 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.6 seconds

Last resort. Spain used it in 2017, after the Court, not before.

### D3_0 · marin
**File:** `assets/audio/D3_0.mp3`  
**Trigger:** D3_0 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.0 seconds

A private deal over a public law does not settle the constitutional question.

### D3_1 · marin
**File:** `assets/audio/D3_1.mp3`  
**Trigger:** D3_1 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

The council cannot rule on legality. The law stays in force.

### D3_2 · eze
**File:** `assets/audio/D3_2.mp3`  
**Trigger:** D3_2 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 7.7 seconds

The government challenges. The law is suspended. The Court must confirm or lift this within five months.

### D3_3 · marin
**File:** `assets/audio/D3_3.mp3`  
**Trigger:** D3_3 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.6 seconds

Last resort. Spain used it in 2017, after the Court, not before.

### D3_ESC_OK · eze
**File:** `assets/audio/D3_ESC_OK.mp3`  
**Trigger:** D3_ESC_OK branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 7.7 seconds

The Court rules against the region. The region does not comply. You now have a further decision.

### D3_ESC_BAD · eze
**File:** `assets/audio/D3_ESC_BAD.mp3`  
**Trigger:** D3_ESC_BAD branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

The law stays in force, and the region keeps its position.

### D1_COUNTER · eze
**File:** `assets/audio/D1_COUNTER.mp3`  
**Trigger:** D1_COUNTER branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.0 seconds

A quiet settlement, in the most asymmetric case. Does that fit your thesis?

### D3_FOLLOW_Q · guide
**File:** `assets/audio/D3_FOLLOW_Q.mp3`  
**Trigger:** D3_FOLLOW_Q branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.5 seconds

Invoke Article 155 now, or let the Court use its own enforcement powers first?

### D3_FOLLOW_0 · marin
**File:** `assets/audio/D3_FOLLOW_0.mp3`  
**Trigger:** D3_FOLLOW_0 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.5 seconds

Intervention needs an absolute Senate majority. Order is restored faster, but regional grievance deepens.

### D3_FOLLOW_1 · marin
**File:** `assets/audio/D3_FOLLOW_1.mp3`  
**Trigger:** D3_FOLLOW_1 branch  
**Origin:** Adapted from source brief  
**Estimated duration:** 10.3 seconds

Since 2015, the Court can enforce its rulings, including fines and suspension of officials. Slower enforcement keeps the centre’s legitimacy while tension persists.

### S4_EZE · eze
**File:** `assets/audio/S4_EZE.mp3`  
**Trigger:** Roundtable opening 1  
**Origin:** Source verbatim  
**Estimated duration:** 6.0 seconds

Three Spanish features. Tell us what Nigeria can take, and what it cannot.

### S4_MARIN · marin
**File:** `assets/audio/S4_MARIN.mp3`  
**Trigger:** Roundtable opening 2  
**Origin:** Source verbatim  
**Estimated duration:** 9.9 seconds

Spain’s system works because of how it was built, not only what it contains. Copy the parts and you may miss that.

### S4_SANI · sani
**File:** `assets/audio/S4_SANI.mp3`  
**Trigger:** Roundtable opening 3; subject expert review before release  
**Origin:** Source verbatim; review flag  
**Estimated duration:** 4.8 seconds

Spain has no resource control history. We do. Start there.

### S4_GUIDE · guide
**File:** `assets/audio/S4_GUIDE.mp3`  
**Trigger:** After roundtable opening  
**Origin:** Adapted from source brief  
**Estimated duration:** 12.4 seconds

For each feature, choose Transfer, Adapt, or Reject. A source check costs six reserve hours. You can decide without a check, but borrowing without checking raises fit risk.

### FEATURE_A · guide
**File:** `assets/audio/FEATURE_A.mp3`  
**Trigger:** Introduce card A  
**Origin:** Adapted from source brief  
**Estimated duration:** 3.1 seconds

Bilateral fiscal deals for particular regions.

### TEST_A · sani
**File:** `assets/audio/TEST_A.mp3`  
**Trigger:** Nigerian test A  
**Origin:** Source verbatim  
**Estimated duration:** 5.2 seconds

Give one state a special deal and thirty-five will want theirs.

### CHECK_A · marin
**File:** `assets/audio/CHECK_A.mp3`  
**Trigger:** Paid source check A  
**Origin:** Adapted from source brief  
**Estimated duration:** 9.4 seconds

The Basque and Navarre arrangements rest on historic rights recognised in the Constitution itself. They were not designed as a template.

### FEATURE_B · guide
**File:** `assets/audio/FEATURE_B.mp3`  
**Trigger:** Introduce card B  
**Origin:** Adapted from source brief  
**Estimated duration:** 3.1 seconds

Sector conferences and signed cooperation agreements.

### TEST_B · sani
**File:** `assets/audio/TEST_B.mp3`  
**Trigger:** Nigerian test B  
**Origin:** Source verbatim  
**Estimated duration:** 5.6 seconds

Spain’s calm owes something to shared parties. Ours do not always align.

### CHECK_B · marin
**File:** `assets/audio/CHECK_B.mp3`  
**Trigger:** Paid source check B  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

Sector conferences, cooperation agreements and party alignment each help prevent contestation.

### FEATURE_C · guide
**File:** `assets/audio/FEATURE_C.mp3`  
**Trigger:** Introduce card C  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.6 seconds

Automatic suspension of a contested regional law while the Constitutional Court decides.

### TEST_C · sani
**File:** `assets/audio/TEST_C.mp3`  
**Trigger:** Nigerian test C  
**Origin:** Source verbatim  
**Estimated duration:** 6.5 seconds

Our Supreme Court already hears these cases. And this power would sit in Abuja.

### CHECK_C · marin
**File:** `assets/audio/CHECK_C.mp3`  
**Trigger:** Paid source check C  
**Origin:** Adapted from source brief  
**Estimated duration:** 10.3 seconds

The power sits in Spain’s Constitution, Article 161.2, and lapses after five months unless the Court confirms it. Nigeria would need an amendment.

### DECISION_A_0 · sani
**File:** `assets/audio/DECISION_A_0.mp3`  
**Trigger:** Feature decision A_0  
**Origin:** Source verbatim  
**Estimated duration:** 2.6 seconds

You have reopened resource control.

### DECISION_A_1 · marin
**File:** `assets/audio/DECISION_A_1.mp3`  
**Trigger:** Feature decision A_1  
**Origin:** Source verbatim  
**Estimated duration:** 5.2 seconds

Keep the principle: open, rules-based arrangements any state can qualify for.

### DECISION_A_2 · eze
**File:** `assets/audio/DECISION_A_2.mp3`  
**Trigger:** Feature decision A_2  
**Origin:** Source verbatim  
**Estimated duration:** 4.8 seconds

Safe. But you lose Spain’s lesson on transparent, negotiated rules.

### DECISION_B_0 · eze
**File:** `assets/audio/DECISION_B_0.mp3`  
**Trigger:** Feature decision B_0  
**Origin:** Source verbatim  
**Estimated duration:** 2.6 seconds

No amendment needed. Do it.

### DECISION_B_1 · marin
**File:** `assets/audio/DECISION_B_1.mp3`  
**Trigger:** Feature decision B_1  
**Origin:** Source verbatim  
**Estimated duration:** 3.9 seconds

Reasonable, but do not overbuild what already works.

### DECISION_B_2 · marin
**File:** `assets/audio/DECISION_B_2.mp3`  
**Trigger:** Feature decision B_2  
**Origin:** Source verbatim  
**Estimated duration:** 3.9 seconds

Then states keep reaching for the courts first.

### DECISION_C_0 · sani
**File:** `assets/audio/DECISION_C_0.mp3`  
**Trigger:** Feature decision C_0  
**Origin:** Source verbatim  
**Estimated duration:** 3.5 seconds

Abuja could freeze any state law. No.

### DECISION_C_1 · eze
**File:** `assets/audio/DECISION_C_1.mp3`  
**Trigger:** Feature decision C_1  
**Origin:** Source verbatim  
**Estimated duration:** 3.9 seconds

With what safeguard? Otherwise it is a weapon.

### DECISION_C_2 · marin
**File:** `assets/audio/DECISION_C_2.mp3`  
**Trigger:** Feature decision C_2  
**Origin:** Source verbatim  
**Estimated duration:** 5.6 seconds

In Spain the centre holds it. Your states would never accept that.

### S4_REJECT · marin
**File:** `assets/audio/S4_REJECT.mp3`  
**Trigger:** Opening stance 2, Reject without check  
**Origin:** Source verbatim  
**Estimated duration:** 3.5 seconds

Rejecting is easy. What would you borrow?

### S4_ART155 · sani
**File:** `assets/audio/S4_ART155.mp3`  
**Trigger:** Borrow Card C after Article 155 follow-up  
**Origin:** Source verbatim  
**Estimated duration:** 5.2 seconds

You have just shown us what Abuja would do with it.

### S4_NO_HOURS · guide
**File:** `assets/audio/S4_NO_HOURS.mp3`  
**Trigger:** Attempt source check with under six hours  
**Origin:** New interface guidance  
**Estimated duration:** 7.7 seconds

There are not enough reserve hours for another check. The earlier sources remain in your brief notes.

### CLOSE_Q · guide
**File:** `assets/audio/CLOSE_Q.mp3`  
**Trigger:** Closing line builder  
**Origin:** New interaction adaptation  
**Estimated duration:** 9.0 seconds

Close your brief with one usable lesson and one Nigerian limit. Choose a lesson, then the limit that qualifies it.

### LESSON_0 · guide
**File:** `assets/audio/LESSON_0.mp3`  
**Trigger:** Read lesson option 0  
**Origin:** New structured closing option  
**Estimated duration:** 6.9 seconds

Nigeria can use regular sector conferences and written cooperation agreements to resolve disagreements before litigation.

### LESSON_1 · guide
**File:** `assets/audio/LESSON_1.mp3`  
**Trigger:** Read lesson option 1  
**Origin:** New structured closing option  
**Estimated duration:** 7.7 seconds

Nigeria can adapt transparent negotiated fiscal rules so that every state has a fair route to participation.

### LESSON_2 · guide
**File:** `assets/audio/LESSON_2.mp3`  
**Trigger:** Read lesson option 2  
**Origin:** New structured closing option  
**Estimated duration:** 6.5 seconds

Nigeria can match each dispute to negotiation, coordination or adjudication before choosing a response.

### LESSON_3 · guide
**File:** `assets/audio/LESSON_3.mp3`  
**Trigger:** Read lesson option 3  
**Origin:** New structured closing option  
**Estimated duration:** 7.3 seconds

Nigeria can learn from Spain by seeking better outcomes and keeping an open mind about reform.

### LIMIT_0 · guide
**File:** `assets/audio/LIMIT_0.mp3`  
**Trigger:** Read limit option 0  
**Origin:** New structured closing option  
**Estimated duration:** 7.3 seconds

But the constitution and the equal status of states constrain how such arrangements can be introduced.

### LIMIT_1 · guide
**File:** `assets/audio/LIMIT_1.mp3`  
**Trigger:** Read limit option 1  
**Origin:** New structured closing option  
**Estimated duration:** 6.0 seconds

But party alignment and state-centre trust will shape whether cooperation works in practice.

### LIMIT_2 · guide
**File:** `assets/audio/LIMIT_2.mp3`  
**Trigger:** Read limit option 2  
**Origin:** New structured closing option  
**Estimated duration:** 6.9 seconds

But resource control, derivation and FAAC politics limit the case for copying special fiscal deals.

### LIMIT_3 · guide
**File:** `assets/audio/LIMIT_3.mp3`  
**Trigger:** Read limit option 3  
**Origin:** New structured closing option  
**Estimated duration:** 6.9 seconds

But progress will depend on everyone making a strong effort and remaining positive about change.

### CLOSE_ACCEPT · eze
**File:** `assets/audio/CLOSE_ACCEPT.mp3`  
**Trigger:** Submit closing line  
**Origin:** Source verbatim  
**Estimated duration:** 2.6 seconds

That goes in the brief.

### S5_ENTER · guide
**File:** `assets/audio/S5_ENTER.mp3`  
**Trigger:** Enter retreat  
**Origin:** Adapted from source brief  
**Estimated duration:** 9.4 seconds

The retreat has begun. A delegate will test the weakest part of your brief. Your earlier choices are on the table.

### CHALLENGE_asymmetry · governors
**File:** `assets/audio/CHALLENGE_asymmetry.mp3`  
**Trigger:** Weakest normalised strand asymmetry  
**Origin:** Source verbatim  
**Estimated duration:** 5.6 seconds

Nigeria’s states are equal. Why does Spain’s unequal design tell us anything?

### CHALLENGE_mechanisms · federal
**File:** `assets/audio/CHALLENGE_mechanisms.mp3`  
**Trigger:** Weakest normalised strand mechanisms  
**Origin:** Source verbatim  
**Estimated duration:** 5.2 seconds

Which Spanish mechanism would have settled our FAAC dispute? Be specific.

### CHALLENGE_transfer · sani
**File:** `assets/audio/CHALLENGE_transfer.mp3`  
**Trigger:** Weakest normalised strand transfer  
**Origin:** Source verbatim  
**Estimated duration:** 4.8 seconds

Name one thing in your brief that survives Nigerian politics.

### CHALLENGE_limits · assembly
**File:** `assets/audio/CHALLENGE_limits.mp3`  
**Trigger:** Weakest normalised strand limits  
**Origin:** Source verbatim  
**Estimated duration:** 5.2 seconds

You lead with a lesson. What would make it fail here?

### S5_RESPONSE · guide
**File:** `assets/audio/S5_RESPONSE.mp3`  
**Trigger:** Retreat response prompt  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.0 seconds

Concede and adjust, defend using your sources, or reframe this as further research.

### VERDICT_concede · eze
**File:** `assets/audio/VERDICT_concede.mp3`  
**Trigger:** Retreat response concede  
**Origin:** Adapted from source brief  
**Estimated duration:** 4.8 seconds

The delegates accept the revised brief and note your correction.

### VERDICT_defend_ok · eze
**File:** `assets/audio/VERDICT_defend_ok.mp3`  
**Trigger:** Retreat response defend_ok  
**Origin:** Adapted from source brief  
**Estimated duration:** 3.9 seconds

The delegates test your sources. Your defence holds.

### VERDICT_defend_bad · eze
**File:** `assets/audio/VERDICT_defend_bad.mp3`  
**Trigger:** Retreat response defend_bad  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

The delegates test your sources. The gap in your reading shows.

### VERDICT_reframe · eze
**File:** `assets/audio/VERDICT_reframe.mp3`  
**Trigger:** Retreat response reframe  
**Origin:** Adapted from source brief  
**Estimated duration:** 4.3 seconds

The delegates note that the question was not answered.

### S5_STANCE · guide
**File:** `assets/audio/S5_STANCE.mp3`  
**Trigger:** Repeat stance poll  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

Return to your opening position. Which view do you hold now?

### S5_HELD · eze
**File:** `assets/audio/S5_HELD.mp3`  
**Trigger:** Same stance at close  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.0 seconds

You held your opening position. Review how well your sources now support it.

### S5_CHANGED · eze
**File:** `assets/audio/S5_CHANGED.mp3`  
**Trigger:** Different stance at close  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.5 seconds

Your position changed. Compare your opening view with the one you are taking away.

### BAND_0 · eze
**File:** `assets/audio/BAND_0.mp3`  
**Trigger:** Final outcome band 0  
**Origin:** Adapted from source brief  
**Estimated duration:** 4.8 seconds

Your brief is adopted. The delegates accept its mechanism recommendations.

### BAND_1 · eze
**File:** `assets/audio/BAND_1.mp3`  
**Trigger:** Final outcome band 1  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.2 seconds

Your brief is adopted with revisions. One section needs further work.

### BAND_2 · eze
**File:** `assets/audio/BAND_2.mp3`  
**Trigger:** Final outcome band 2  
**Origin:** Adapted from source brief  
**Estimated duration:** 5.6 seconds

Your brief is returned. Revisit the weak sections before the next round.

### BAND_3 · eze
**File:** `assets/audio/BAND_3.mp3`  
**Trigger:** Final outcome band 3  
**Origin:** Adapted from source brief  
**Estimated duration:** 6.9 seconds

Your brief is rejected. Review how you read Spain and how you judged Nigeria’s limits.

### DEBRIEF_LESSONS · guide
**File:** `assets/audio/DEBRIEF_LESSONS.mp3`  
**Trigger:** Optional final learning summary  
**Origin:** Adapted from source brief  
**Estimated duration:** 12.0 seconds

Asymmetry is a design choice with costs. Match the dispute to the mechanism. Borrow principles with clear limits. A brief must survive challenge, not only read well.

### DEBRIEF_REVIEW · guide
**File:** `assets/audio/DEBRIEF_REVIEW.mp3`  
**Trigger:** Enter debrief controls  
**Origin:** Adapted from source brief  
**Estimated duration:** 9.0 seconds

Open your choices to revisit the decisions, or open your brief to read the record. Restart begins a new attempt.

### HELP_RESEARCH · guide
**File:** `assets/audio/HELP_RESEARCH.mp3`  
**Trigger:** Research Help  
**Origin:** New interface guidance  
**Estimated duration:** 7.3 seconds

Select a map point or its matching source button. Read or listen, then choose another source.

### HELP_OPTIONS · guide
**File:** `assets/audio/HELP_OPTIONS.mp3`  
**Trigger:** Options Help  
**Origin:** New interface guidance  
**Estimated duration:** 5.2 seconds

Select an option, then confirm. Once confirmed, your decision is saved.

### HELP_CAPTIONS · guide
**File:** `assets/audio/HELP_CAPTIONS.mp3`  
**Trigger:** Settings Help  
**Origin:** New interface guidance  
**Estimated duration:** 7.7 seconds

Captions show the current spoken line. Full source text and your record are available in Brief Notes.

### RESUME · guide
**File:** `assets/audio/RESUME.mp3`  
**Trigger:** Saved run landing  
**Origin:** New interface guidance  
**Estimated duration:** 5.6 seconds

Your saved brief is ready. Continue from where you stopped, or restart.

## Dynamic quotation without live synthesis

At the retreat, display the selected claim, its two sources and the composed closing line on request in Brief Notes. For audio quotations queue `CLAIM_n`, `LESSON_n`, `LIMIT_n` using saved IDs; do not splice learner names or invent live speech. No name recording is required.

## Optional sound and music assets

| ID | Sound | Trigger | Direction |
|---|---|---|---|
| FX_SELECT | Soft tick | Confirm a choice | 60–100ms, low volume, never a correctness cue |
| FX_FOLD | Soft airy transition | Character folds to portrait | 120–180ms, optional |
| FX_PAN | Quiet airy sweep | Major Spain–Nigeria pan | At most 500ms; no repeat on small focus |
| MUSIC_BED | Soothing, hopeful ambient instrumental | Optional after Start | No vocals, subtle, maximum 20–30%; duck to silence during all speech |

These four assets are optional and are not wired as required assets in the preview. No sound is needed for every hover. Reduced motion does not remove spoken information.