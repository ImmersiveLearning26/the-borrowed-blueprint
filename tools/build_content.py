import json,pathlib,math
R=pathlib.Path(__file__).resolve().parents[1]; A=[]
def say(i,s,t,tr,origin='Adapted from source brief'):
 A.append(dict(id=i,speaker=s,text=t,trigger=tr,origin=origin,file=f'assets/audio/{i}.mp3',estimatedSeconds=round(len(t.split())/2.35+0.5,1)))
say('G01','guide','Welcome. Enter your name, then your matriculation number.','Enter identity','New interface guidance')
say('N01','narrator','Abuja. A dispute over the Federation Account has reached the Supreme Court.','Opening briefing 1','Source verbatim')
say('N02','narrator','In seventy-two hours, the Federal Government and the states meet to ask how such disputes should be settled.','Opening briefing 2','Source verbatim')
say('N03','narrator','Spain is the model on the table. Seventeen regions. Different powers. Different fiscal deals. Yet the conflict has never fully gone away.','Opening briefing 3','Source verbatim')
say('N04','narrator','You are the analyst. What can Nigeria borrow from Spain, and where does the comparison break?','Opening briefing 4','Source verbatim')
say('S1_EZE','eze','I need a brief I can defend at the retreat. We will compare Spain with Nigeria, then decide what travels and what does not.','Enter stance')
say('S1_QUESTION','guide','What is your starting position on Spain? Choose the view closest to your own.','Stance question','New interface guidance')
stances=['Spain proves devolution can be managed.','Spain proves asymmetry fuels permanent conflict.','Spain is too different to teach Nigeria anything.']
for i,t in enumerate(['Then show me how. Start with Catalonia.','Then show me where it breaks.','Then show me why.']):say(f'S1_REPLY_{i}','eze',t,f'Opening stance {i}','Source verbatim')
say('S2_ENTER','guide','You have twenty-four research hours. Open at least two sources. Each new source costs six hours. Save time if you want to check your recommendations later.','Enter research')
say('S2_FREE','guide','Catalonia is already open. This first source costs you no research hours.','Stance 0 research entry')
sources=[
 dict(id='constitution',title='1978 Constitution',lon=-3.7038,lat=40.4168,regions=[],text='No single model. Seventeen autonomous communities. Powers devolved region by region, at different speeds. The centre keeps wide powers to coordinate.'),
 dict(id='basque',title='Basque Country & Navarre',lon=-1.95,lat=42.9,regions=['País Vasco','Foral de Navarra'],text='The Basque Country and Navarre have a special fiscal regime. They collect most taxes and pay the State a negotiated sum for State services.'),
 dict(id='catalonia',title='Catalonia',lon=1.6,lat=41.8,regions=['Cataluña'],text='The statute was reformed in 2006. The Constitutional Court limited parts of it in 2010. The 2017 referendum was ruled unlawful, and Article 155 was invoked.'),
 dict(id='andalusia',title='Andalusia',lon=-4.7,lat=37.4,regions=['Andalucía'],text='Andalusia is in the common regime. It is funded through a national formula and transfers. Disputes centre on how fair the formula is.')]
for s in sources:say('SRC_'+s['id'],'marin',s['text'],'Open or replay '+s['title'])
say('S2_CLAIM','guide','Choose the claim your reading can support. Then attach two of the sources you opened.','Enter claim builder')
claims=[
 'Asymmetry breeds tension because each region measures fairness against another’s deal.',
 'The open constitutional design leaves fiscal terms permanently renegotiable.',
 'Tension is driven by nationalist party mobilisation.',
 'Litigation has replaced political bargaining.']
for i,c in enumerate(claims):say(f'CLAIM_{i}','guide',c,f'Optional read claim {i}','Source verbatim')
for k,t in [('full','The evidence carries the claim.'),('partial','Half of this is assertion. The retreat will find it.'),('none','Nothing here supports that.')]:say('S2_'+k,'eze',t,'Claim fit '+k,'Source verbatim')
say('S3_ENTER','guide','Three disputes are arriving. Choose the institution that should handle each one. Your decision locks when you confirm it, and earlier choices can make the next dispute harder.','Enter dispute desk')
mechanisms=['Bilateral commission','Multilateral fiscal council','Constitutional Court','Article 155 intervention']
disputes=[
 'Madrid and the Basque government disagree on the annual payment under their fiscal agreement.',
 'Several regions say the common funding formula shortchanges them.',
 'A regional parliament passes a law the central government says exceeds regional powers.']
for i,t in enumerate(disputes):say('D'+str(i+1),'eze',t,f'Dispute {i+1} arrives','Source verbatim')
say('D3_ESC','eze','A regional parliament passes a law the central government says exceeds regional powers. The region now says it will ignore an adverse ruling.','D3 after D1 or D2 misroute')
say('S3_QUESTION','guide','Which mechanism fits this dispute?','After dispute narration')
reactions={
 'D1_0':('eze','Settled in the bilateral commission. No court needed.'),
 'D1_1':('marin','The council handles the common formula, not the Basque payment.'),
 'D1_2':('marin','Slow and adversarial. The agreement has its own commission.'),
 'D1_3':('marin','Last resort. Spain used it in 2017, after the Court, not before.'),
 'D2_0':('sani','One region’s deal fuels others’ grievance.'),
 'D2_1':('eze','Talks open with all regions. No ruling, no winner. The centre keeps the final say.'),
 'D2_2':('marin','The Court judges legality, not funding formulas. The politics stays unresolved.'),
 'D2_3':('marin','Last resort. Spain used it in 2017, after the Court, not before.'),
 'D3_0':('marin','A private deal over a public law does not settle the constitutional question.'),
 'D3_1':('marin','The council cannot rule on legality. The law stays in force.'),
 'D3_2':('eze','The government challenges. The law is suspended. The Court must confirm or lift this within five months.'),
 'D3_3':('marin','Last resort. Spain used it in 2017, after the Court, not before.'),
 'D3_ESC_OK':('eze','The Court rules against the region. The region does not comply. You now have a further decision.'),
 'D3_ESC_BAD':('eze','The law stays in force, and the region keeps its position.'),
 'D1_COUNTER':('eze','A quiet settlement, in the most asymmetric case. Does that fit your thesis?'),
 'D3_FOLLOW_Q':('guide','Invoke Article 155 now, or let the Court use its own enforcement powers first?'),
 'D3_FOLLOW_0':('marin','Intervention needs an absolute Senate majority. Order is restored faster, but regional grievance deepens.'),
 'D3_FOLLOW_1':('marin','Since 2015, the Court can enforce its rulings, including fines and suspension of officials. Slower enforcement keeps the centre’s legitimacy while tension persists.')}
for k,(s,t) in reactions.items():say(k,s,t,k+' branch')
say('S4_EZE','eze','Three Spanish features. Tell us what Nigeria can take, and what it cannot.','Roundtable opening 1','Source verbatim')
say('S4_MARIN','marin','Spain’s system works because of how it was built, not only what it contains. Copy the parts and you may miss that.','Roundtable opening 2','Source verbatim')
say('S4_SANI','sani','Spain has no resource control history. We do. Start there.','Roundtable opening 3; subject expert review before release','Source verbatim; review flag')
say('S4_GUIDE','guide','For each feature, choose Transfer, Adapt, or Reject. A source check costs six reserve hours. You can decide without a check, but borrowing without checking raises fit risk.','After roundtable opening')
features=[
 dict(id='A',title='Bilateral fiscal deals',question='Give one state a special deal and thirty-five will want theirs.',check='The Basque and Navarre arrangements rest on historic rights recognised in the Constitution itself. They were not designed as a template.',points=[0,10,5]),
 dict(id='B',title='Sector conferences & agreements',question='Spain’s calm owes something to shared parties. Ours do not always align.',check='Sector conferences, cooperation agreements and party alignment each help prevent contestation.',points=[10,5,0]),
 dict(id='C',title='Automatic suspension of state laws',question='Our Supreme Court already hears these cases. And this power would sit in Abuja.',check='The power sits in Spain’s Constitution, Article 161.2, and lapses after five months unless the Court confirms it. Nigeria would need an amendment.',points=[0,5,10])]
for f in features:
 say('FEATURE_'+f['id'],'guide',{'A':'Bilateral fiscal deals for particular regions.','B':'Sector conferences and signed cooperation agreements.','C':'Automatic suspension of a contested regional law while the Constitutional Court decides.'}[f['id']],'Introduce card '+f['id'])
 say('TEST_'+f['id'],'sani',f['question'],'Nigerian test '+f['id'],'Source verbatim')
 say('CHECK_'+f['id'],'marin',f['check'],'Paid source check '+f['id'])
responses={
 'A_0':('sani','You have reopened resource control.'),
 'A_1':('marin','Keep the principle: open, rules-based arrangements any state can qualify for.'),
 'A_2':('eze','Safe. But you lose Spain’s lesson on transparent, negotiated rules.'),
 'B_0':('eze','No amendment needed. Do it.'),
 'B_1':('marin','Reasonable, but do not overbuild what already works.'),
 'B_2':('marin','Then states keep reaching for the courts first.'),
 'C_0':('sani','Abuja could freeze any state law. No.'),
 'C_1':('eze','With what safeguard? Otherwise it is a weapon.'),
 'C_2':('marin','In Spain the centre holds it. Your states would never accept that.')}
for k,(s,t) in responses.items():say('DECISION_'+k,s,t,'Feature decision '+k,'Source verbatim')
say('S4_REJECT','marin','Rejecting is easy. What would you borrow?','Opening stance 2, Reject without check','Source verbatim')
say('S4_ART155','sani','You have just shown us what Abuja would do with it.','Borrow Card C after Article 155 follow-up','Source verbatim')
say('S4_NO_HOURS','guide','There are not enough reserve hours for another check. The earlier sources remain in your brief notes.','Attempt source check with under six hours','New interface guidance')
say('CLOSE_Q','guide','Close your brief with one usable lesson and one Nigerian limit. Choose a lesson, then the limit that qualifies it.','Closing line builder','New interaction adaptation')
lessons=[
 'Nigeria can use regular sector conferences and written cooperation agreements to resolve disagreements before litigation',
 'Nigeria can adapt transparent negotiated fiscal rules so that every state has a fair route to participation',
 'Nigeria can match each dispute to negotiation, coordination or adjudication before choosing a response',
 'Nigeria can learn from Spain by seeking better outcomes and keeping an open mind about reform']
limits=[
 'but the constitution and the equal status of states constrain how such arrangements can be introduced.',
 'but party alignment and state-centre trust will shape whether cooperation works in practice.',
 'but resource control, derivation and FAAC politics limit the case for copying special fiscal deals.',
 'but progress will depend on everyone making a strong effort and remaining positive about change.']
for i,t in enumerate(lessons):say('LESSON_'+str(i),'guide',t+'.','Read lesson option '+str(i),'New structured closing option')
for i,t in enumerate(limits):say('LIMIT_'+str(i),'guide',t[0].upper()+t[1:],'Read limit option '+str(i),'New structured closing option')
say('CLOSE_ACCEPT','eze','That goes in the brief.','Submit closing line','Source verbatim')
say('S5_ENTER','guide','The retreat has begun. A delegate will test the weakest part of your brief. Your earlier choices are on the table.','Enter retreat')
challenges={
 'asymmetry':('governors','Nigeria’s states are equal. Why does Spain’s unequal design tell us anything?'),
 'mechanisms':('federal','Which Spanish mechanism would have settled our FAAC dispute? Be specific.'),
 'transfer':('sani','Name one thing in your brief that survives Nigerian politics.'),
 'limits':('assembly','You lead with a lesson. What would make it fail here?')}
for k,(s,t) in challenges.items():say('CHALLENGE_'+k,s,t,'Weakest normalised strand '+k,'Source verbatim')
say('S5_RESPONSE','guide','Concede and adjust, defend using your sources, or reframe this as further research.','Retreat response prompt')
for k,t in [('concede','The delegates accept the revised brief and note your correction.'),('defend_ok','The delegates test your sources. Your defence holds.'),('defend_bad','The delegates test your sources. The gap in your reading shows.'),('reframe','The delegates note that the question was not answered.')]:say('VERDICT_'+k,'eze',t,'Retreat response '+k)
say('S5_STANCE','guide','Return to your opening position. Which view do you hold now?','Repeat stance poll')
say('S5_HELD','eze','You held your opening position. Review how well your sources now support it.','Same stance at close')
say('S5_CHANGED','eze','Your position changed. Compare your opening view with the one you are taking away.','Different stance at close')
for i,t in enumerate(['Your brief is adopted. The delegates accept its mechanism recommendations.','Your brief is adopted with revisions. One section needs further work.','Your brief is returned. Revisit the weak sections before the next round.','Your brief is rejected. Review how you read Spain and how you judged Nigeria’s limits.']):say('BAND_'+str(i),'eze',t,'Final outcome band '+str(i))
say('DEBRIEF_LESSONS','guide','Asymmetry is a design choice with costs. Match the dispute to the mechanism. Borrow principles with clear limits. A brief must survive challenge, not only read well.','Optional final learning summary')
say('DEBRIEF_REVIEW','guide','Open your choices to revisit the decisions, or open your brief to read the record. Restart begins a new attempt.','Enter debrief controls')
# Optional accessibility/help clips, not compulsory repeated instructions.
for i,t,tr in [
 ('HELP_RESEARCH','Select a map point or its matching source button. Read or listen, then choose another source.','Research Help'),
 ('HELP_OPTIONS','Select an option, then confirm. Once confirmed, your decision is saved.','Options Help'),
 ('HELP_CAPTIONS','Captions show the current spoken line. Full source text and your record are available in Brief Notes.','Settings Help'),
 ('RESUME','Your saved brief is ready. Continue from where you stopped, or restart.','Saved run landing')]:say(i,'guide',t,tr,'New interface guidance')
content=dict(stances=stances,sources=sources,claims=claims,mechanisms=mechanisms,disputes=disputes,features=features,lessons=lessons,limits=limits)
(R/'app/content.js').write_text('export const CONTENT = '+json.dumps(content,ensure_ascii=False,indent=2)+';\n')
(R/'app/assets/audio-manifest.json').write_text(json.dumps(A,ensure_ascii=False,indent=2))
(R/'app/assets/audio').mkdir(exist_ok=True)
(R/'app/assets/audio/README.md').write_text('Place generated clips here using the exact IDs in ../audio-manifest.json. No voice recordings are bundled. The preview shows a text fallback when a clip is missing. Never silently impersonate the specified voices using browser TTS.\n')
voice={'guide':'Nigerian English; gender-neutral or soft female; clear, calm, conversational.','narrator':'Nigerian English; formal, composed.','eze':'Mature Nigerian female; firm and efficient, measured warmth.','marin':'Mature Spanish female; light Spanish accent in English, calm and precise.','sani':'Mature Nigerian male; dry, direct, controlled.','governors':'Nigerian male; collegial but sceptical; distinct from Sani.','federal':'Nigerian female; concise, exacting; distinct from Eze.','assembly':'Nigerian male; measured, analytical; distinct from the other men.'}
md=['# Complete audio production script — The Borrowed Blueprint','',f'{len(A)} separate clips. Generate one file per ID; preserve spelling and punctuation. Text is the recording script, not default visible UI. Captions are off by default by the user’s latest direction. Sound-off or missing-audio fallback exposes text so the task remains usable.','', '## Voice casting','']
for k,v in voice.items():md.append(f'- **{k}** — {v}')
md+=['','## Recording and delivery','', '- Deliver MP3 mono, 44.1 kHz, 128 kbps, roughly −16 LUFS integrated, true peak at or below −1 dBTP. Keep WAV masters separately. No music, reverb or sound effects baked into voice.','- Keep each character’s voice consistent. Use Nigerian English for Nigerian speakers. Do not imitate a named real person.','- Natural pace around 125–145 words/minute. Do not force long lines into eight seconds; trim wording only with content approval. Duration estimates below are planning estimates.','- Record narration N01–N04 as separate clips; they queue as one opening. The original 30–35 second target may require longer for clear diction.','- Pronunciation: FAAC = “fack”; RMAFC = “R M A F C”; Basque = “bask”; Navarre = “nuh-VAR”; Catalonia = “kat-uh-LOH-nee-uh”; Marín = “mah-REEN”; Abuja = “ah-BOO-jah”. Ask cast/subject expert to confirm local names.','- Waveforms respond to playback amplitude. Portrait pixel reveal is brief at entry only. Globe activity represents a UI handoff/audio preparation, not live LLM reasoning. One audio queue; no overlapping speakers.','- Every clip has a pause, replay and skip path. Stopping sound exposes the current text and cancels queued speech.','- `S4_SANI` is preserved verbatim from the source but its absolute historical claim needs subject-expert review before publication. Also review simplified legal consequences in D3 and feature C. Do not silently replace the source claim.','', '## Clip catalogue','']
for a in A:
 md += [f'### {a["id"]} · {a["speaker"]}',f'**File:** `{a["file"]}`  ',f'**Trigger:** {a["trigger"]}  ',f'**Origin:** {a["origin"]}  ',f'**Estimated duration:** {a["estimatedSeconds"]} seconds','',a['text'],'']
md+=['## Dynamic quotation without live synthesis','','At the retreat, display the selected claim, its two sources and the composed closing line on request in Brief Notes. For audio quotations queue `CLAIM_n`, `LESSON_n`, `LIMIT_n` using saved IDs; do not splice learner names or invent live speech. No name recording is required.','', '## Optional sound and music assets','', '| ID | Sound | Trigger | Direction |','|---|---|---|---|','| FX_SELECT | Soft tick | Confirm a choice | 60–100ms, low volume, never a correctness cue |','| FX_FOLD | Soft airy transition | Character folds to portrait | 120–180ms, optional |','| FX_PAN | Quiet airy sweep | Major Spain–Nigeria pan | At most 500ms; no repeat on small focus |','| MUSIC_BED | Soothing, hopeful ambient instrumental | Optional after Start | No vocals, subtle, maximum 20–30%; duck to silence during all speech |','', 'These four assets are optional and are not wired as required assets in the preview. No sound is needed for every hover. Reduced motion does not remove spoken information.']
(R/'production/ALL_AUDIO_SCRIPTS.md').write_text('\n'.join(md))
print('Audio clips',len(A),'total estimated minutes',round(sum(a['estimatedSeconds'] for a in A)/60,1))
