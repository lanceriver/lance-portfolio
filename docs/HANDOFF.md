# Handoff — lance-portfolio, Spotify connected

_Last updated 2026-10-22. One living file — rewrite, don't append._

## TL;DR
- **Live:** https://lanceriver.com/#notes. PRs #13–#17 are merged and deployed, including the Spotify turntable and its API.
- **Git:** local `main` includes deployed commit `5542430` and unpushed docs commits `04eb2ba`, `3086287`, and `af33b72`; after this handoff update is committed, it will be four documentation commits ahead of `origin/main`. These are docs-only updates. Merged branches `codex/spotify-turntable` and `codex/spotify-lambda-quota` are retained locally and remotely.
- **Checks:** PR #17 CI run **39713893035** passed; final website deployment **39714002246** passed tests and deploy. The corrected AWS change set completed successfully. The live API returns HTTP 200 with exactly `playing`, `title`, `artist`, and `url`, and CORS allows `https://lanceriver.com`. The deployed bundle includes the public endpoint and official Spotify logo, excludes the `Harvest Moon` prototype, and the logo returns HTTP 200.
- **Open work:** No open PRs and no pending deployment or approval. Spotify previews are stopped and its temporary worktree is removed; only the main checkout remains. Merged branches are retained locally and remotely. The four pre-existing untracked items below remain untouched.
- **Next:** no required work. Lance may do the optional physical-phone check of Worn; restoring Lambda concurrency reservation 1 is optional only after account quota allows at least 10 unreserved slots.
- **Untouched, pre-existing untracked files:** `.impeccable/`, `docs/daily-priorities.md`, `assets-source/IMG_7501.JPG`, and `assets-source/Sandstone Pillars and Mountain Pavilion.png`. Leave them alone. The last PNG was previously reported identical to committed `zhangjiajie-pillars.png`; not rechecked here.

## Where the product is

| Area | Current state |
|---|---|
| Field Notes photos | Seven of Lance's own travel photographs. Existing: Zhangjiajie, Furong Ancient Town and Terracotta Army. Added: misty mountain road, coastal train, torii corridor and bamboo canopy. All open through the existing expand/lightbox interaction. |
| Field Notes composition | **Approved by Lance.** A tighter, overlapping photo pile. Keep the colophon and turntable, with clear space around them below the photographs. Removed: painted alpine band, palette/"Sampled from the desk", Aa/type specimen, ampersand, and "Kept because the blue was right" slip. Do not restore them from older design decisions. Other sections' paintings remain. |
| Turntable | Spotify-backed frontend and `GET /now-playing` API are deployed. The corrected Lambda shares account concurrency; the first change set's reservation failure was resolved in PR #17. A refreshed production page visibly showed the real Spotify last-played track and link. The live API returns the four expected fields with production CORS. The record label remains Lance's Zhangjiajie photograph, not album art. |
| Worn (Plate III) | PR #15 is live. Six screens retain their staggered desktop entrance and drift; on phones all figures are visible and stationary from first layout in one horizontal swipe row. Hover lift is limited to fine-pointer desktop. Lance plans an optional physical-phone check after merge. |
| Hosting | Existing S3 + CloudFront deployment. Distribution `E1ZCFALE8XHKH7`; hosted zone `Z08238469JD0YFW9R421`. Every push to `main`, including docs-only pushes, triggers deployment. |
| Old AWS site | Retired earlier on 2026-10-22, documented in `infra/README.md` (`f9e9524`). No old-site infrastructure changes this session; the Spotify changeset is deployed. Previous backup: `~/Documents/aws-old-site-backup-2026-10-22/`. Keep the current `lance-portfolio`, `exoplanets-backend` and `aws-sam-cli-managed-default` stacks. |

## Done / left

- **PR #13:** https://github.com/lanceriver/lance-portfolio/pull/13 — merged as `23da8cd`. Added four photos, dated captions, metadata-stripped WebP exports and provenance. Deployment run `39706220238` passed.
- **PR #14:** https://github.com/lanceriver/lance-portfolio/pull/14 — merged as `4861a45`. Removed props, compacted the pile, added keyboard-focus lifting, and then spaced the turntable/colophon further apart at Lance's request. Final branch head was `aec94f2`; final deployment run `39708045081` passed.
- **PR #15:** https://github.com/lanceriver/lance-portfolio/pull/15 — merged as `2ea61de`. Mobile Worn figures render visible and stationary, while desktop entrance remains; hover lift follows live fine-pointer capability. CI run `39709497721` passed and deployment run `39709617067` succeeded.
- **PR #16:** https://github.com/lanceriver/lance-portfolio/pull/16 — merged as `d5e2349`. CI run `39713297867` and website deployment run `39713411557` passed. This shipped the Spotify-backed turntable frontend.
- **PR #17:** https://github.com/lanceriver/lance-portfolio/pull/17 — merged as `5542430`. CI run `39713893035` passed; final website deployment run `39714002246` passed tests and deploy. It comments out `ReservedConcurrentExecutions` with the required TODO and documents shared Lambda capacity; no permissions or API code changed. Branch `codex/spotify-lambda-quota` is retained locally and remotely.
- **Spotify setup:** Lance created the `Lance Portfolio` developer app with loopback redirect `127.0.0.1:8888/callback`, authorized the approved read-only current/recent playback scopes, and completed PKCE bootstrap. `scripts/connect-spotify.py` succeeded. Credentials were saved as an AWS-managed-key SSM `SecureString` at `/lance-portfolio/spotify/credentials`; no token or client secret is in source, logs, frontend, or this handoff. The selected store is standard SSM SecureString, not Secrets Manager. Spotify authorization needs reconnecting after 180 days.
- **Now-playing service:** PR #16 adds a Python Lambda/API Gateway `GET /now-playing` handler in a separate `infra/spotify` package. It reads the exact SSM parameter, caches metadata for 30 seconds, and caches Spotify access tokens until 60 seconds before expiry (normally about an hour); it retries once after 401 and cools down on 429. Bootstrap validates loopback/state with PKCE; no client secret is needed. The deployed handler returns HTTP 200 with exactly `playing`, `title`, `artist`, and `url`, and CORS allows `https://lanceriver.com`. Its last real response reported a stopped track; this is transient playback metadata, not permanent portfolio content. The frontend polls every 30 seconds only while the document is visible; the song link and official Spotify mark are included. It keeps the travel photo as the record label, uses no album art, and shows an honest unavailable state when playback metadata is unavailable.
- **GitHub configuration:** repository variable `NOW_PLAYING_API_URL` is set to the public API URL `https://jjplj3vij6.execute-api.us-east-1.amazonaws.com/now-playing`.
- **AWS deployment:** the initial PR #16 change set rolled back cleanly because total and unreserved Lambda concurrency were both 10; reserving 1 would leave fewer than the required 10 unreserved. PR #17 removed the reservation and documented shared capacity. Corrected changeset `arn:aws:cloudformation:us-east-1:319611139788:changeSet/samcli-deploy1792637627/19d101e2-6e5e-4715-97ae-62cb6e37a14b` was applied successfully; stack update completed. The changeset added the Spotify function, role and invoke permission, and modified the existing API without changing visitor-counter code. Optional TODO: restore reservation 1 only after quota allows at least 10 unreserved concurrency slots.
- **Verification:** browser checks at 1440×1000, 1024×900 and 390×844 confirmed all seven photos load and expand, removed props are absent, keyboard focus raises a print, and there is no horizontal overflow or page error. Final geometry checks confirmed neither support object overlaps a photo or each other at these widths. Phone touch expand/close also passed. These were browser checks, not a physical-phone verification.
- **Spotify verification:** local TypeScript/build, 34/34 verification checks, 22 isolated Python tests, and SAM lint/build passed. Desktop and mobile UI states passed for playing, paused, error, empty, long text, and unsafe links. A refreshed production page visibly showed the real Spotify last-played track and link. The deployed bundle contains the public API endpoint and official logo, excludes the `Harvest Moon` prototype, and the logo returns HTTP 200. API verification confirmed the exact response shape and production CORS.
- **Build warnings:** two existing Vite warnings reproduce on baseline main as well as these changes: `__VITE_PUBLIC_ASSET__2179b098__` and `__VITE_PUBLIC_ASSET__5467e91e__`. Build succeeds and those placeholders were not found in final generated output. No unrelated fixes were made.
- **Worn browser QA:** at mobile widths (390px portrait, 844px landscape, 900px boundary), all six figures were visible at `y=0`, scale 1 and opacity 1 in 253 sampled frames. An emulated touch swipe reached `scrollLeft=258` with all figures stationary. At 1440px desktop the entrance remained, and hover reached `y=-10`; changing reduced-motion live cleared the hover. These are browser checks, not a physical-phone check.
- **Left:** no required work. The API and website deployments are verified. Lance may do his planned physical-phone check of Worn; restoring the Lambda concurrency reservation is optional after an account quota increase. No Field Notes repair remains open.

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

## Worn mobile motion fix shipped

Baseline reproduction: figures 3–6 started at `y=96` with opacity 0 while offscreen. Swiping to the last figure produced about 700ms of delay followed by a rise and settle that took roughly 1.6 seconds. PR #15 removes the per-figure entrance on mobile: all six figures are visible and stationary immediately, including items that begin offscreen in the horizontal swipe row. Desktop keeps the staggered entrance from `y=96` and the three-depth drift. Hover lift reaches `y=-10` only when the live viewport is non-mobile, reduced motion is off, and the input supports hover with a fine pointer.

Browser QA covered 390px portrait, 844px landscape, the 900px boundary, and 1440px desktop, plus live resize and reduced-motion changes. The emulated touch swipe moved the row while every figure stayed settled. This does not verify iOS touch-hover behavior on a physical phone; Lance chose to do that check after merge. The fix is deployed, so no further reproduction or implementation is needed before that check.

## Other decisions pending with Lance

1. **Other paintings:** whether to replace the remaining non-Field-Notes plates with imagery derived from his own trips. Ask before generating new artwork. The Field Notes removal does not authorize changing the hero, Work plates, Writing or Back Cover.
2. **Airtable Clone screenshot:** still an option for Plate II if Lance wants it; needs a signed-in capture.

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
- AWS SSO, if needed later: `aws sso login --profile admin` requires Lance's browser approval. Spotify OAuth credentials are stored encrypted in SSM SecureString; its reviewed CloudFormation changeset is deployed.

## Ephemeral artifacts

- `/private/tmp/photo-pile-qa.json`: final per-viewport geometry and seven-photo interaction results, including the approved 1400px surface. Key results are preserved above.
- `/private/tmp/photo-pile-{desktop,tablet,mobile}.png`: final layout screenshots. `/private/tmp/review-photo-pile.cjs`: temporary browser QA script. These can disappear; they are not required to rebuild the site.
- `/private/tmp/travel-contact-sheet.jpg`, `/private/tmp/travel-shortlist.jpg`, `/private/tmp/travel-qa.json`, and `/private/tmp/travel-*.png`: asset-selection/PR #13 evidence, now superseded by the final pile.
- Both `/private/tmp/lance-portfolio-travel-photos` and `/private/tmp/lance-portfolio-photo-pile` worktrees were removed after deployment. Their feature branches were deleted locally/remotely.
- The merged `/private/tmp/lance-portfolio-worn-mobile` worktree was removed and previews 5193/5194 were stopped after deployment. Branch `codex/worn-mobile-motion` remains locally and remotely because automatic review rejected remote deletion as unnecessary cleanup.
- Spotify worktree `/private/tmp/lance-portfolio-spotify` was removed and previews at `127.0.0.1:5195` (Vite) and `127.0.0.1:5196` (read-only Spotify handler) were stopped after final browser review. Only the main checkout remains. PRs #16 and #17 are merged; branches `codex/spotify-turntable` and `codex/spotify-lambda-quota` are retained locally and remotely.
- Previous Worn seed/capture scratch: `/private/tmp/claude-501/-Users-lance-Documents-Projects-lance-portfolio-claude/cbd5014b-c388-4334-ab3a-c1c59ca31ba7/scratchpad/`. It may no longer exist. Text sources are preserved in `docs/worn-screens/`; do not copy fictional-person images into the repository.
- Durable old-site backup: `~/Documents/aws-old-site-backup-2026-10-22/` (carried forward; not revalidated here).

## Suggested next session

1. Read this handoff; PRs #16 and #17 and both deployments are complete. Leave the four untracked items alone. After this handoff update is committed, four local documentation commits will remain ahead of `origin/main`; do not push them unless Lance chooses to.
2. Lance may check the deployed Worn swipe row on his physical phone. Browser emulation passed; no re-reproduction or code change is pending.
3. No Spotify deployment work remains. Reauthorize after 180 days; consider restoring reserved concurrency 1 only if account quota can leave 10 slots unreserved.
4. Only revisit imagery or add more travel photos at Lance's direction. The approved Field Notes pile and the clearly separated turntable/colophon are the current baseline.
