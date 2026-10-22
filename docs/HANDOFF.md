# Handoff — lance-portfolio, personal photo pile shipped

_Last updated 2026-10-22. One living file — rewrite, don't append._

## TL;DR
- **Live:** https://lanceriver.com/#notes. PR #13 added four personal travel photos; PR #14 removed the non-photo props and made a tighter pile. Lance approved the final spacing and both PRs are merged and deployed.
- **Git:** local `main` now includes deployed commit `4861a45`. The pre-existing unpushed handoff/seed-source commit was rebased onto it as `30ad659`. After this handoff is committed, local `main` is **two documentation commits ahead of `origin/main`**, with nothing pushed by this handoff task. Those commits also contain `docs/worn-screens/` seed sources. Do not mistake them for unshipped website changes.
- **Checks:** final PR #14 typecheck, production build and 34/34 verification checks passed. CI passed for head `aec94f2`. Deployment run **39708045081** passed both test (including infrastructure pytest) and deploy jobs. Live HTML/JS/CSS were checked for all seven photos, removed props, and the approved support-object spacing.
- **No open PRs or active feature worktrees.** Only the main checkout remains. Temporary previews on ports 5191/5192 were stopped; feature branches were removed locally and remotely.
- **Next:** investigate the still-unfixed Worn mobile photo movement described below. No new feature request is pending after the approved Field Notes work.
- **Untouched, pre-existing untracked files:** `.impeccable/`, `docs/daily-priorities.md`, `assets-source/IMG_7501.JPG`, and `assets-source/Sandstone Pillars and Mountain Pavilion.png`. Leave them alone. The last PNG was previously reported identical to committed `zhangjiajie-pillars.png`; not rechecked here.

## Where the product is

| Area | Current state |
|---|---|
| Field Notes photos | Seven of Lance's own travel photographs. Existing: Zhangjiajie, Furong Ancient Town and Terracotta Army. Added: misty mountain road, coastal train, torii corridor and bamboo canopy. All open through the existing expand/lightbox interaction. |
| Field Notes composition | **Approved by Lance.** A tighter, overlapping photo pile. Keep the colophon and turntable, with clear space around them below the photographs. Removed: painted alpine band, palette/"Sampled from the desk", Aa/type specimen, ampersand, and "Kept because the blue was right" slip. Do not restore them from older design decisions. Other sections' paintings remain. |
| Turntable | Still prototype playback data: `Harvest Moon`, Neil Young, `playing: true`. The temporary record label now uses Lance's Zhangjiajie photograph, not the lake painting. Real Spotify integration remains open. |
| Worn (Plate III) | PR #12 remains live. Six screens in staggered desktop rows; one horizontal swipe row on phones. The mobile movement report below was not worked on this session. |
| Hosting | Existing S3 + CloudFront deployment. Distribution `E1ZCFALE8XHKH7`; hosted zone `Z08238469JD0YFW9R421`. Every push to `main`, including docs-only pushes, triggers deployment. |
| Old AWS site | Retired earlier on 2026-10-22, documented in `infra/README.md` (`f9e9524`). No infrastructure changes this session. Previous backup: `~/Documents/aws-old-site-backup-2026-10-22/`. Keep the current `lance-portfolio`, `exoplanets-backend` and `aws-sam-cli-managed-default` stacks. |

## Done / left

- **PR #13:** https://github.com/lanceriver/lance-portfolio/pull/13 — merged as `23da8cd`. Added four photos, dated captions, metadata-stripped WebP exports and provenance. Deployment run `39706220238` passed.
- **PR #14:** https://github.com/lanceriver/lance-portfolio/pull/14 — merged as `4861a45`. Removed props, compacted the pile, added keyboard-focus lifting, and then spaced the turntable/colophon further apart at Lance's request. Final branch head was `aec94f2`; final deployment run `39708045081` passed.
- **Verification:** browser checks at 1440×1000, 1024×900 and 390×844 confirmed all seven photos load and expand, removed props are absent, keyboard focus raises a print, and there is no horizontal overflow or page error. Final geometry checks confirmed neither support object overlaps a photo or each other at these widths. Phone touch expand/close also passed. These were browser checks, not a physical-phone verification.
- **Build warnings:** two existing Vite warnings reproduce on baseline main as well as these changes: `__VITE_PUBLIC_ASSET__2179b098__` and `__VITE_PUBLIC_ASSET__5467e91e__`. Build succeeds and those placeholders were not found in final generated output. No unrelated fixes were made.
- **Left:** real-phone Worn bug investigation, Spotify integration/sign-off, and any further work Lance chooses. No Field Notes repair remains open.

## Key findings and final layout

- **Source of truth:** `src/components/FieldNotes.tsx`, `src/components/fieldnotes.css`, `DECISIONS.md` D56, and `assets-source/PROVENANCE.md`. Lance's latest direction overrides D51's old instruction to keep the painted band.
- Desktop pile width is `min(1040px, var(--shell))`. The final surface has a 1400px minimum height. Photo top offsets stay fixed at their approved positions; increasing support-object space must not stretch the whole photo arrangement.
- Final colophon: `left: 16%`, `top: 1040px`, width `min(34%, 360px)`. Final turntable: `left: 60%`, `bottom: 32px`, width `min(22%, 255px)`. Lance explicitly wanted the turntable clearly visible, separated from the photo pile and colophon.
- At ≤900px the photographs flow with alternating widths and controlled overlaps: 20px gap plus -64px sibling margin. Colophon and turntable each have an overriding +20px margin, giving 40px breathing room. **Specificity matters:** use `.obj + .obj--colophon` / `.obj + .obj--turntable`; a lone class selector loses to `.obj + .obj`.
- Pointer entry and keyboard focus both raise the chosen item using the existing persistent stack ordering. Keep all seven photographs reachable when adjusting overlaps.
- The removed palette's `swatches` export remains in `src/data.ts`; its import/rendering was removed from Field Notes. No need to reintroduce it or clean unrelated data speculatively.

### Travel assets

Originals are gitignored in `assets-source/travel/`; 17 photos are present, seven are now represented on the site and ten remain unused. Do not commit originals. The source library is the archive; the site serves committed derivatives in `public/plates/`.

| Original | New site basename | Date from EXIF |
|---|---|---|
| `IMG_7332.JPG` | `mountain-road` | 24 May 2026 |
| `IMG_4312.JPG` | `coastal-train` | 16 September 2025 |
| `DSC_0791.JPG` | `torii-corridor` | 19 February 2024 |
| `IMG_8359.JPG` | `bamboo-canopy` | 20 February 2024 |

Each new image has full/1200/800-width WebP exports. Orientation is baked in; embedded metadata was checked absent from all twelve exports. Captions deliberately describe the scenes rather than guessing place names. `IMG_7501.JPG` is the **bakery photo**, not a mystery image; it was not selected for the site. A duplicate outside `travel/` remains untracked.

## Top next item — Worn mobile swipe-row movement

Lance's earlier report on a real phone:
> On mobile the photos move up and down when you first tap them; only after a few seconds do they stay put.

**Still not reproduced or fixed.** `Screens()` in `src/components/Work.tsx` still has:
1. Entrance from `{ y: 96, opacity: 0, scale: 0.96 }` through `whileInView`, `viewport: { once: true, amount: 0.2 }`, spring stiffness 110/damping 20, and delay `i * 0.14`. Screens starting outside the horizontal viewport may rise/settle when first swiped into view. Consider disabling this entrance on phones or animating the whole row once.
2. `whileHover: { y: -10 }` is not explicitly gated behind `(hover: hover) and (pointer: fine)`. Investigate touch behavior before claiming this is the cause.

Scroll drift is already disabled at ≤900px. Verify the eventual fix on a real phone; emulation alone does not establish iOS touch-hover behavior. Work in a new feature branch/worktree and PR.

## Decisions pending with Lance

1. **Spotify:** secret-storage approach needs sign-off before implementation (previous proposal: SSM SecureString versus Secrets Manager). Lance then creates the Spotify app and completes the one-time sign-in. Target is a Lambda `GET /now-playing` feeding `Turntable` / `NOW_PLAYING` in `src/components/FieldNotes.tsx`.
2. **Other paintings:** whether to replace the remaining non-Field-Notes plates with imagery derived from his own trips. Ask before generating new artwork. The Field Notes removal does not authorize changing the hero, Work plates, Writing or Back Cover.
3. **Airtable Clone screenshot:** still an option for Plate II if Lance wants it; needs a signed-in capture.

## Workflow / environment notes

- User workflow: **Sol orchestrates/reviews/hands off; Luna implements.** Code changes use a feature branch and PR, with an isolated worktree for parallel work. Documentation-only changes may be committed on main. Get the approach approved before auth, access-control, secrets or payment changes. Never connect to the production database.
- For visual changes, prepare a concrete preview, let Lance approve it, then merge. That was the explicit workflow for PR #14; his final "better, lgtm" authorized its merge.
- Dev: `npm run dev`. Verify code: `npx tsc -b && npm run build && npm run verify`. No OpenSpec directory or PSS implementation-plan file exists in this repository.
- Impeccable context setup was run once for this session. This is an existing printed/editorial visual world; preserve it and honor Lance's direction over older design rules. Use bounded desktop/mobile QA rather than repeated polishing.
- Local feature worktrees under `/private/tmp/` were writable and worked well. A managed worktree under `~/.codex/worktrees/` hit sandbox write restrictions and was archived while still empty; do not restore it for this work. Git metadata writes required normal tool escalation.
- Connected GitHub tools authenticated as `lanceriver` worked for PRs/merges. CLI fallback: `GH_TOKEN="$(gh auth token --user lanceriver)" gh ...`; never print the token. SSH push works. The commit-workflow connector filters to PR runs, so use CLI to find push-triggered deployment runs, then the connector to inspect their jobs.
- System `python3` has no Pillow. Bundled Python: `/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`. Use it for `scripts/ingest-photo.py`; that script rotates correctly and strips metadata.
- Browser QA used Playwright from `/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` with Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, requiring tool escalation. The default Playwright browser version was unavailable. Do not reinstall browsers just for this.
- `?settled=1` renders arrivals in their final positions for composition checks; reduced-motion contexts also work. The sticky Field Notes/Writing transition measures its own height with `ResizeObserver`; preserve it. Scroll tools may need a second scroll or ~3 seconds after load.
- For production smoke checks, fetch HTML/JS/CSS and use image HEAD requests when sufficient. Loading the actual page in a browser can increment the visitor counter; do not send test counter POSTs.

### Worn simulator context carried from the previous session

- Worn screens 1/3/5 are phone captures; 2/4/6 are simulator captures from a **fictional seeded diary**, not real outfits belonging to Lance. Seed specs/prompts/processing source are in `docs/worn-screens/`. The share card was chosen over a duplicate diary grid; seeded fits have no captured weather.
- Simulator `worn-portfolio`: `22D896FD-B2AD-4C2A-90B5-9A5F14C556C7` (iPhone 17 Pro, iOS 26.5). Previous build: fits-app-workspace `origin/main` `fe24116`, eight fictional fits, Sydney location. This simulator state was not rechecked here.
- Seeder: copy `Documents/SeedPhotos/*.jpg` and `Documents/SeedCutouts/<stem>_<top|bottom|shoes>.png` into the app container, launch with `-WardrobeSeedDiary YES -WardrobeSeedBuilder YES`. Do not edit SwiftData with sqlite.
- Prior simulator tooling screenshots lagged an action; use `xcrun simctl io <udid> screenshot`. Taps may need ~1.5 seconds after sheet animations. Leave `worn-trip` (759C…) and iPhone 17e suite simulator (A57A…) alone.
- AWS SSO, if needed later: `aws sso login --profile admin` requires Lance's browser approval. No AWS credentials or infrastructure were touched in this session.

## Ephemeral artifacts

- `/private/tmp/photo-pile-qa.json`: final per-viewport geometry and seven-photo interaction results, including the approved 1400px surface. Key results are preserved above.
- `/private/tmp/photo-pile-{desktop,tablet,mobile}.png`: final layout screenshots. `/private/tmp/review-photo-pile.cjs`: temporary browser QA script. These can disappear; they are not required to rebuild the site.
- `/private/tmp/travel-contact-sheet.jpg`, `/private/tmp/travel-shortlist.jpg`, `/private/tmp/travel-qa.json`, and `/private/tmp/travel-*.png`: asset-selection/PR #13 evidence, now superseded by the final pile.
- Both `/private/tmp/lance-portfolio-travel-photos` and `/private/tmp/lance-portfolio-photo-pile` worktrees were removed after deployment. Their feature branches were deleted locally/remotely.
- Previous Worn seed/capture scratch: `/private/tmp/claude-501/-Users-lance-Documents-Projects-lance-portfolio-claude/cbd5014b-c388-4334-ab3a-c1c59ca31ba7/scratchpad/`. It may no longer exist. Text sources are preserved in `docs/worn-screens/`; do not copy fictional-person images into the repository.
- Durable old-site backup: `~/Documents/aws-old-site-backup-2026-10-22/` (carried forward; not revalidated here).

## Suggested next session

1. Read this handoff; the website changes are already live and approved. Leave the four untracked items alone. The two local documentation commits remain unpushed unless Lance subsequently pushes them.
2. Reproduce and fix the Worn mobile movement in a new worktree/PR, with a real-phone check before declaring it resolved.
3. If Lance chooses Spotify instead, obtain the secret-storage approach sign-off, then wire the API after his app setup/sign-in.
4. Only revisit imagery or add more travel photos at Lance's direction. The approved Field Notes pile and the clearly separated turntable/colophon are the current baseline.
