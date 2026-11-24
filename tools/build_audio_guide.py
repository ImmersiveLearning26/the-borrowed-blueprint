"""Rebuild AUDIO_GENERATION_FOR_LOVABLE.md from app/assets/audio-manifest.json. Run from the kit root: python tools/build_audio_guide.py ."""
import json, sys, pathlib, collections

kit = pathlib.Path(sys.argv[1])
clips = json.load(open(kit / 'app/assets/audio-manifest.json', encoding='utf-8'))

VOICES = [
    ('guide', 'Guide', 'Nigerian English. Gender-neutral or soft female. Clear, calm, conversational; the friendly voice that explains each step.'),
    ('narrator', 'Narrator', 'Nigerian English. Formal and composed; reads the four-part opening briefing.'),
    ('eze', 'Dr Ngozi Eze', 'Mature Nigerian woman. Firm and efficient, with measured warmth.'),
    ('marin', 'Prof. Elena Marín', 'Mature Spanish woman speaking English with a light Spanish accent. Calm and precise.'),
    ('sani', 'Mr Yakubu Sani', 'Mature Nigerian man. Dry, direct, controlled.'),
    ('governors', 'Governors’ Forum delegate', 'Nigerian man. Collegial but sceptical. Must sound different from Mr Sani.'),
    ('federal', 'Federal Ministry delegate', 'Nigerian woman. Concise and exacting. Must sound different from Dr Eze.'),
    ('assembly', 'National Assembly delegate', 'Nigerian man. Measured and analytical. Must sound different from the other men.'),
]
NAMES = {k: n for k, n, _ in VOICES}
count = collections.Counter(c['speaker'] for c in clips)
total_s = sum(c.get('estimatedSeconds', 0) for c in clips)

out = []
w = out.append
w('# Audio generation for Lovable: The Borrowed Blueprint')
w('')
w(f'**Lovable: this file is your complete brief for the voice audio.** Generate all **{len(clips)} clips** listed below, '
  'one MP3 per clip, using the exact ID, file name and words given. The app already plays these files; it just needs them to exist.')
w('')
w('This file is generated from `app/assets/audio-manifest.json`, which is the list the app reads at runtime. '
  'If the two ever disagree, the manifest wins. `production/ALL_AUDIO_SCRIPTS.md` holds the same scripts in the original handoff format.')
w('')
w('## What to produce')
w('')
w(f'- **{len(clips)} MP3 files**, one per clip ID, about {round(total_s/60)} minutes of speech in total (planning estimate).')
w('- **File name = clip ID + `.mp3`**, exactly as listed (case matters: `S4_EZE.mp3`, `SRC_basque.mp3`).')
w('- **Where they go:** the folder `assets/audio/` next to the app\'s `index.html`. In this kit that is `app/assets/audio/`. '
  'In a Vite or Lovable project, put them in `public/assets/audio/` so they are served at `/assets/audio/<ID>.mp3`.')
w('- **Words:** use the script text exactly. Do not paraphrase, shorten, add greetings, or insert the learner\'s name. '
  'Spelling and punctuation are part of the direction.')
w('- **Format:** MP3, mono, 44.1 kHz, 128 kbps. Loudness about −16 LUFS integrated, true peak at or below −1 dBTP. '
  'Keep WAV masters separately if your tool provides them.')
w('- **Clean voice only:** no music, reverb, sound effects, intros or outros in the voice files.')
w('')
w('## Rules the app depends on')
w('')
w('1. **Prerecorded only.** Generate the files once, ahead of time, and ship them with the app. Do not generate speech live while a learner is using the app, '
  'do not use the browser\'s built-in speech (speechSynthesis), and do not add a live AI voice. The guide is scripted, branching, prerecorded audio.')
w('2. **Keep API keys out of the app.** If you use a text-to-speech service (for example ElevenLabs), call it from a one-off script or a server-side function, '
  'store the key as a server secret, and save the resulting MP3s into the folder above. Never put a key in browser code.')
w(f'3. **One voice per speaker, the same voice every time.** All {count["guide"]} guide lines must sound like the same guide; all Dr Eze lines like the same Dr Eze, and so on.')
w('4. **Fictional people.** Every speaker is a fictional character. Do not clone or imitate any real, named person\'s voice.')
w('5. **Do not change the code to fit the audio.** Missing or misnamed files fall back to on-screen text, so a wrong file name fails quietly. Match the names exactly.')
w('6. **Long lines are fine.** Natural pace is about 125–145 words per minute. Never speed up or cut a line to hit the estimated duration; clear diction comes first.')
w('')
w('## Voices')
w('')
w('| Speaker ID | Character | Clips | Voice direction |')
w('|---|---|---|---|')
for k, n, d in VOICES:
    w(f'| `{k}` | {n} | {count.get(k, 0)} | {d} |')
w('')
w('## Pronunciation')
w('')
w('| Word | Say it as |')
w('|---|---|')
for a, b in [('FAAC', '“fack”'), ('RMAFC', '“R M A F C” (letters)'), ('Basque', '“bask”'), ('Navarre', '“nuh-VAR”'),
             ('Catalonia', '“kat-uh-LOH-nee-uh”'), ('Marín', '“mah-REEN”'), ('Abuja', '“ah-BOO-jah”')]:
    w(f'| {a} | {b} |')
w('')
w('Ask a Nigerian and a Spanish speaker, or the subject expert, to confirm local names before final export.')
w('')
w('## Before publishing: subject-expert review')
w('')
w('- `S4_SANI` is kept word for word from the source brief, but its absolute historical claim must be checked by a subject expert before release.')
w('- The simplified legal consequences in the D3 dispute lines and in feature C (`FEATURE_C`, `CHECK_C`, `DECISION_C_*`) also need review.')
w('- Generate them as written; if the expert changes the wording, update the manifest first, then regenerate only those clips.')
w('')
w('## How the app uses the clips')
w('')
w('- The app looks up each clip by ID in `app/assets/audio-manifest.json` and loads its `file` path.')
w('- Some IDs are chosen at runtime by pattern, so every one listed must exist: `SRC_<source>`, `CLAIM_0–3`, `LESSON_0–3`, `LIMIT_0–3`, '
  '`BAND_0–3`, `FEATURE_A–C`, `CHECK_A–C`, `TEST_A–C`, `DECISION_<A–C>_<0–2>`, `CHALLENGE_<strand>`, `D3_FOLLOW_<n>`, `S1_REPLY_<n>`, `S2_<…>`.')
w('- Narration `N01`–`N04` plays as one queued opening, so keep the narrator\'s level and tone continuous across the four files.')
w('- Captions are off by default. When a file is missing or sound is off, the app shows the line as text with a "Next line" button instead.')
w('')
w('## Check your work')
w('')
w('Run this from the kit folder after generating. It lists any clip that is missing or empty:')
w('')
w('```bash')
w('node -e "const fs=require(\'fs\'),m=JSON.parse(fs.readFileSync(\'app/assets/audio-manifest.json\'));const miss=m.filter(c=>{try{return fs.statSync(\'app/\'+c.file).size<1000}catch{return true}}).map(c=>c.id);console.log(miss.length?\'Missing: \'+miss.join(\', \'):\'All \'+m.length+\' clips present\')"')
w('```')
w('')
w('Then open the app, turn sound on, and play through: each line should now be heard, the guide\'s waveform should follow the voice, '
  'and the text-only "Next line" fallback should no longer appear for clips that exist.')
w('')
w(f'## All {len(clips)} clips')
w('')
w('Grouped by voice so each voice can be generated in one batch. Within a voice, clips are in the order the learner meets them.')
w('')
for k, n, _ in VOICES:
    group = [c for c in clips if c['speaker'] == k]
    if not group:
        continue
    w(f'### {n} (`{k}`): {len(group)} clips')
    w('')
    for c in group:
        w(f'#### {c["id"]}')
        w('')
        w(f'- **File:** `{c["file"]}`  ')
        w(f'- **Plays when:** {c["trigger"]}  ')
        w(f'- **Source:** {c["origin"]}  ')
        w(f'- **About:** {c.get("estimatedSeconds", "?")} s')
        w('')
        w('> ' + c['text'].replace('\n', '\n> '))
        w('')
unknown = [c for c in clips if c['speaker'] not in NAMES]
if unknown:
    raise SystemExit('speakers without a voice: %s' % sorted({c["speaker"] for c in unknown}))
w('## Optional sounds (not required)')
w('')
w('These are not wired into the app and are not needed for launch. Only make them if asked.')
w('')
w('| ID | Sound | When | Direction |')
w('|---|---|---|---|')
w('| FX_SELECT | Soft tick | Confirming a choice | 60–100 ms, low volume, never a right/wrong cue |')
w('| FX_FOLD | Soft airy transition | Character card folds to its portrait | 120–180 ms |')
w('| FX_PAN | Quiet airy sweep | The Spain–Nigeria map journey | At most 500 ms |')
w('| MUSIC_BED | Calm, hopeful ambient instrumental | Optional after Start | No vocals, 20–30% level at most, silent under all speech |')
w('')
(kit / 'AUDIO_GENERATION_FOR_LOVABLE.md').write_text('\n'.join(out), encoding='utf-8')
print('wrote', len(clips), 'clips;', dict(count))
