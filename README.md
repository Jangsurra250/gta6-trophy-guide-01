# Leonida Trophy Guide &amp; Tracker — GTA 6, all 55 PS5 trophies

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun · gta6-trophy-guide-01 rank](https://make.fun/badge/gta6-trophy-guide-01/Jangsurra250/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun · gta6-trophy-guide-01 reward](https://make.fun/badge/gta6-trophy-guide-01/Jangsurra250/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides you to the platinum in Grand Theft Auto VI on PlayStation 5 and tracks your progress — built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it covers

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze (28 hidden until earned), each with its official name, description and grade as PlayStation publishes them, plus a guide written for this page, in our own words, with the source of each fact named beside it.
- **A tracker** — tick trophies off as you earn them; progress saves in the browser (localStorage), exports to a file, and imports back. Filters by kind (story, missable, collectibles, activities, online), grade, roadmap stage and earned state, plus text search.
- **A spoiler setting** — hides the names and descriptions of story trophies until you earn them.
- **A roadmap to the platinum** — three stages, about 200 hours at 4/10 difficulty: story (60–80 h), the 100% completion checklist (~100 h), cleanup (~10 h).
- **The one missable trophy, flagged** — Positive Mental Attitude: meditate at every spot across Leonida, starting with Lucia on the balcony at Jason's house in Chapter 1, after the mission Down to Earth. It disappears after Chapter 1, so do it.

## Honest about what is not known yet

Five trophies had no confirmed unlock method when the game launched — In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin. Their guides say so plainly and give the best lead from the trophy description, instead of inventing a method. PowerPyx lists all five as not yet known.

## Facts that shape the roadmap

- 0 online trophies — the whole set is single-player and offline.
- One playthrough is enough; there is no mission replay and no New Game Plus, so keep a manual save at the start of every chapter.
- Cheats disable trophies and saving — keep them off on a trophy run.
- The 100% checklist (Progress, then Stats, then 100% Completion, after the story) is lenient: 70 of 80 challenges, 300 of 397 stunts, 15 of 18 card sets, 200 of 277 vehicles, 100 of 255 animals, 50 of 66 weapons. Only robberies, underwater discoveries, all 42 shooting-range golds, all 42 drone time trials and all 15 of Bret's Target Decks need everything.

## Run it

Static files under `app/` — no build step, no network at run time:

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (writes `out/` with `app/`, `screenshots/` and `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

PowerPyx (trophy guide &amp; roadmap, 100% completion checklist), GTABase (trophies &amp; achievements list), Push Square (trophy guide &amp; roadmap), Beebom (meditation spots), KeenGamer (trophy guide &amp; platinum roadmap). Every trophy's guide names its sources; the full links are in `app/data/trophies.json` and in the app's About section.

## License

MIT — see [LICENSE](LICENSE). Unofficial fan guide, not affiliated with or endorsed by Rockstar Games. No Rockstar logo, official artwork or game screenshots are used anywhere in this guide.
