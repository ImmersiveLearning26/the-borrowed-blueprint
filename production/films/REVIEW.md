# Review: briefing films F1–F4 (25 November 2026)

Four silent explainer films, one per opening narration line (N01–N04), shown in the app's film window while the line plays. Built with `build.py` (edit there, then `python production/films/build.py` from the kit root); rendered to `renders/briefing-films.mp4` and cut into `app/assets/films/F1–F4.mp4` (115–291 KB each) with poster stills.

## Creative calls

- **Beat-timed to the recorded voice.** Phrase timings come from silence detection on the delivered MP3s; each picture lands on the phrase that names it (for example, "Seventeen regions" at 2.37 s in N03 starts the region count).
- **Your library's film rules:** props are the supplied photoreal cut-outs; the map, lines, stamp, crack, arcs and every word are drawn in code; 12 fps stepped motion with anticipation and about 9% overshoot; one orange accent per beat; Afacad titles with one hot word.
- **The real map:** borders come from the app's own atlas data, so the films match the map students use.
- **Sized for a small window:** titles at 64 px and labels at 28–30 px on a 1280 × 720 frame, because the film plays at about 560 px wide on desktop and full width on phones.
- **Canary Islands inset (F3)** so all seventeen communities are on screen when the counter reaches 17.

## Needs subject-expert approval

- **F3 "Different powers":** Catalonia, the Basque Country, Galicia, Andalusia and Navarre are shaded as "wider powers, sooner" (the fast-track communities). This is a deliberate simplification.
- **F3 "Different fiscal deals":** "Own tax deal" on the Basque Country and Navarre; "Common formula" for the rest.
- **F1:** lines from the Federation Account to each state illustrate shared revenue; they do not show amounts.

## Measured

- `hyperframes check`: passes with no errors or warnings after fixes (type sizes, contrast, overlaps, audio lengths, map overflow marked as intended).
- Snapshots of every beat's settled frame, before and after fixes; seam sheets between films.
- In the app (headless Chrome, 1366 × 768 and 390 × 844): the film opens on its line, stays within about 0.1 s of the voice, pauses and resumes with it, swaps in place to the next film, shows a "Watch the film" chip on replays, and closes when the voice stops.

## Not checked

- Nobody has watched the films with the sound on at full speed on a real device; headless Chrome has no audio output, so the end-of-queue close was only checked by stopping the voice.
- The narration's pronunciation and the films' fit to it were measured, not heard.

## Weakest shot

F2's last beat: three dashed routes ending in "?" are abstract. With more time, each route would end in a small prop for the institutions the dispute desk introduces later (two-chair table, round table, courthouse).

## Warnings kept on purpose

- F3's key "Wider powers, sooner / Powers added later" is on screen about 1.1 s; the narration only gives "Different powers" that long, and the key must leave with the shading it explains.
