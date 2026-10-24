# Daily priorities — 2026-10-24

## Do first
- ~~Rewrite `docs/HANDOFF.md`: it still says Experience is unsolved and PR21/PR22 are open, but mock R shipped in PR21 (D62), Worn-first shipped (D63), and PR22 was closed. Next session will be misbriefed otherwise.~~
- ~~Lance: in Google Search Console (lanceriver.com), submit `sitemap.xml` and request indexing for `/`. Only remaining step from PR23 (SEO, D61).~~

## Then
- ~~Check the shipped About/Experience sidebar (D62) and Worn-first order (D63) on a real phone. PR21 was verified on desktop; the sidebar only pins at ≥680px tall.~~
- Copy pass from the 2026-10-22 critique (clarify/distill self-narrating copy). `.impeccable/critique/2026-10-22T10-49-24Z__src-app-tsx.md`.
- Re-run Impeccable critique on the live site to get a new score after PR20/21/23 (last: 24/36).

## Needs Lance's call
- What's next for the portfolio now that the critique's top items (nav, a11y, Pool Safety, footer, Experience) have shipped.
- Bakery spelling for a caption ("Apoli Itabakery"?).
- Whether to use the unused travel originals / other paintings, incl. untracked `assets-source/IMG_7501.JPG` and `assets-source/Sandstone Pillars and Mountain Pavilion.png`.

## Carried / not today
- Post share images still WebP; switch to JPG for wider link-preview support.

## Cleanup
- Delete remote branch `claude/lanceriver-critique-yqatzp`: its PRs (#7–#11) are merged and its tip `1d076f4` is in main.
- `.claude/launch.json`: uncommitted change is a reformat only (the PR21/nav preview entries are already gone). Revert it.
- Stopped Docker container `airtable-local-pg` (1,000,050 rows): remove if no more Airtable captures are needed.
- `.impeccable/` is untracked: decide whether critiques belong in the repo or `.gitignore`.
