# Handoff — lance-portfolio, record shelf and Field Notes photos shipped

_Last updated 2026-10-22. One living file — rewrite, don't append._

## TL;DR

- **Shipped:** [PR #18](https://github.com/lanceriver/lance-portfolio/pull/18) is merged as `4674ef0` and live on https://lanceriver.com/#notes. Field Notes now has a shelf of recent Spotify records beside the turntable, hover captions, and the colophon in the top-right corner.
- **AWS:** stack `lance-portfolio` reached `UPDATE_COMPLETE` (Spotify Lambda code plus the dependent `VisitsApi` body; nothing replaced). The site deploy run `39722028653` succeeded. No change sets are pending.
- **Also shipped:** [PR #19](https://github.com/lanceriver/lance-portfolio/pull/19), merged as `3a45816`; site deploy run `39724602545` succeeded. It adds real place names on four captions, five new photographs (12 in total, with the desk now 2150px tall), and tap-to-select records on touch screens. It's front-end only, with no AWS change. The branch and worktree are deleted.
- **Primary git:** `/Users/lance/Documents/Projects/lance-portfolio-claude` is on `main`, **ahead 9 / behind 2** of `origin/main` after this commit. The 9 are local docs-only handoff commits (`04eb2ba`, `3086287`, `af33b72`, `63c8616`, `c39b882`, `c79aaa1`, `b58cc27`, `a419828`, plus this one). The 2 are the PR #18 and #19 merges. My `git rebase origin/main` was blocked by the auto-mode classifier, so Lance must rebase or pull these himself. Do not push automatically: every push to main deploys.
- **Untracked, pre-existing, untouched:** `.impeccable/`, `docs/daily-priorities.md`, `assets-source/IMG_7501.JPG`, `assets-source/Sandstone Pillars and Mountain Pavilion.png`.
- **Worktrees:** only the primary checkout. The album worktree and `codex/spotify-album-art` (local and remote) are removed.
- **Next step (Lance asked, not started):** get real screenshots of the Airtable Clone for its Work entry (Plate II). See "Next task" below.
- **Also open:** Lance decides on the local main rebase and the optional items below.

## Where the product is

| Area | State |
|---|---|
| Field Notes photo pile (PR13/14) | Live. Seven photos, compact pile. |
| Worn mobile motion (PR15) | Live. A physical-phone check is optional, with Lance. |
| Spotify turntable + API (PR16/17) | Live. Read-only endpoint, SSM refresh token. |
| Record shelf (PR18) | **Live, verified in production** (see below). |
| Place names, 5 new photos, touch taps (PR19) | **Live, verified in production** (see below). |

**PR19 details:**
- **Captions:** Tianmen Mountain · Busan, Korea · Fushimi Inari, Kyoto · Arashiyama, Kyoto. The ids and image files keep their old names (`mountain-road`, `coastal-train`, and so on).
- **New prints:**
  - `obj--gamcheon` (IMG_0165): "Gamcheon, Busan · September 2025"
  - `obj--library` (IMG_4013): "Starfield Library, Seoul · September 2025"
  - `obj--kinkakuji` (IMG_8441): "Kinkaku-ji, Kyoto · February 2024"
  - `obj--market` (IMG_4127): "Market stall, Seoul · September 2025"
  - `obj--bakery` (IMG_7501): "Shanghai · May 2026". Lance named the bakery "Apoli Itabakery", but I left the name out pending the exact spelling.
- **Ingest:** done with `scripts/ingest-photo.py`. It needs Pillow, which isn't installed system-wide; a venv was used (see Ephemeral artifacts).
- **Desk:** `.notes__surface` is `max(120vh, 2150px)`. A second band of prints sits at y 900–1630. The turntable and shelf are bottom-anchored. Desktop measurements: no print clashes with the colophon, the turntable or the shelf's lift and caption zone at 1440 or 1024.
- **Touch:** on `(hover: none)`, the first tap on a record selects it (`album-crate__slot--selected`). On phones it comes forward in place and a panel `.album-crate__detail` (label, title, artist, "Open in Spotify ↗") appears below the shelf. A second tap or the link opens Spotify, and a tap outside or Escape dismisses it. Keyboard reveal uses `:has(.album-sleeve:focus-visible)`.
- **Production check (headless Chrome, visitor POST blocked):**
  - Desktop: all 9 new or renamed captions are present, no old captions remain, every image loads, the surface is 2150px, and there are no errors.
  - Phone with touch emulation: a tap selects a record, the panel shows, and its link opened the right Spotify track. No horizontal scroll.

**What the shelf does (PR18):**
- **Layout:** the current or last-played record sits nearest the turntable, in its jacket with a plain rust-label disc half out. Up to 4 earlier albums trail to the left, each showing 60% of its cover on desktop and 33% on phones.
- **Hover and focus:** an earlier cover's jacket lifts straight up. The `<a>` and `<li>` stay put, so the hit area and click target hold, with a pointer cursor at both spots. A paper caption shows "Played earlier", the title and the artist. The front record's caption says "On the turntable" or "Last played".
- **Placement:** desktop `.album-crate` is `left:38%; bottom:32px; width:min(21%,215px)`, so the jacket is about 159px at 1440. On phones it's in flow under the player, `width:min(50%,200px)`.
- **Colophon:** desktop `left:76%; top:80px; width:min(24%,250px)`.
- **API:** `now-playing` now always calls `/me/player/recently-played?limit=20` (an existing scope) and returns `art` plus `crate` (up to 4, deduped by art URL, newest first, same URL safety rules, `[]` on failure). The frontend still accepts responses without `art` or `crate`.

## Key findings (the why)

- **Spotify artwork rules:** covers must be whole, unrotated, undistorted, with no overlays and no animation in place. That rules out art on the spinning record and any fanned or rotated layout. At rest, the shelf shows earlier covers partly overlapped (a grey area Lance accepted); hover or focus shows each one in full.
- **Hover flicker:** translating the whole hovered element moves it out from under the pointer, causing a flicker loop. Keep a stationary hit area (`<li>`/`<a>`) and move only the visual child (`.album-sleeve__jacket`). Never raise the hovered `<li>` z-index, because it would swallow hovers meant for the neighbouring record's strip.
- **Iteration path, in case a revisit comes up:** square sleeve → LP jacket with disc → vertical crate (17%, then 44% peek) → horizontal shelf (chosen) → bigger covers → clickable-lift fix. Prototypes were CSS injected via Playwright against the live dev page.
- **Local preview API:** `/private/tmp/album-art-preview-api.py` used single-threaded `HTTPServer`, which hangs when Chrome opens a connection and never sends a request. Use `ThreadingHTTPServer`; the scratchpad copy did.
- **Polling:** the browser pane, when hidden, never fires the IntersectionObserver, so the page never polls. That's by design (polling only while visible), not a bug.

## Done / left

**Done (PR18 squash `4674ef0`, branch commits `b60fb4a`…`5eda0f2`):**
- Backend crate and tests: 62 isolated Python tests passed. A mutation check on the dedupe made 3 tests fail.
- `npm run build && npm run verify`: ALL PASS, 34/34, on every frontend commit.
- Headless Chrome QA at 1440, 1024 and 390: no overlaps with photos, colophon or turntable; no horizontal scroll; hover and lift stable; sliding between records works; clicks open the right track at both positions; focus lifts the jacket and draws the ring on it.
- Production check (headless Chrome against lanceriver.com, with the visitor-counter POST blocked): desktop and phone both show 5 slots with all images loaded, the caption appears on hover, no page errors, and no horizontal scroll. The live API returns HTTP 200 with `access-control-allow-origin: https://lanceriver.com`, `art`, and a crate of 4.

**Left:** nothing on PR18. A physical-phone check of the shelf hasn't been done; it's browser emulation only.

## Decisions pending with Lance

1. **Local main:** rebase the 9 docs commits onto `origin/main` (it was blocked for me), then decide whether to push. A push deploys the site, with docs only.
2. **Bakery name:** confirm the exact spelling of "Apoli Itabakery" if Lance wants it on the Shanghai caption or alt text.
3. **Other paintings:** replace the remaining non-Field-Notes artwork with travel imagery only at Lance's direction.
4. **Airtable Clone screenshots:** now requested; see "Next task".
5. **Optional real-phone checks:** the shelf taps, the new photos, and Worn. All checks so far were emulation only.
6. **Unused originals:** `assets-source/travel/` still has DSC_0740, IMG_0168, IMG_0345, IMG_3172 and IMG_4004 unused. Lance chose not to add them this round.

All merged `codex/*` branches (#15–#18) are deleted locally and on the remote (Lance approved, 2026-10-22). None remain.

## Workflow / environment notes

- **Build:** `npm run build && npm run verify`.
- **Python tests:** `AWS_EC2_METADATA_DISABLED=true AWS_CONFIG_FILE=/dev/null AWS_SHARED_CREDENTIALS_FILE=/dev/null /private/tmp/portfolio-spotify-python/bin/python -m pytest infra/tests -q`. The venv is under /private/tmp and may vanish.
- **SAM (from `infra/`):** `sam validate --lint --template-file template.yaml && sam build --template-file template.yaml`.
- **Prepare a change set:** `sam deploy --template-file .aws-sam/build/template.yaml --stack-name lance-portfolio --region us-east-1 --profile admin --capabilities CAPABILITY_IAM --resolve-s3 --no-confirm-changeset --no-execute-changeset`. Inspect it with `describe-change-set`, then `execute-change-set` and `wait stack-update-complete`. Build only from merged main.
- **AWS:** profile `admin`, account 319611139788, us-east-1; SSO was valid this session. API: https://jjplj3vij6.execute-api.us-east-1.amazonaws.com/now-playing.
- **GitHub:** prefix commands with `GH_TOKEN="$(gh auth token --user lanceriver)"`, and never print the token.
- **Visitor counter:** in Playwright against production, abort non-GET `execute-api` requests so no `POST /visits` is sent.
- **Playwright:** `/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`, with Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Use `?settled=1` for QA. Full-page screenshots resize the viewport and change the layout (`120vh`), so clip at the normal viewport instead.
- **Spotify app:** **Lance Portfolio**, client `0db1911c96f949d88be71829930bc9b7`. Refresh token in SSM `/lance-portfolio/spotify/credentials`; reconnect after 180 days with `scripts/connect-spotify.py`.

## How we work

- **Roles:** Opus designs, reviews and makes judgement calls. Implementation goes to a Sonnet subagent (or Codex in its own worktree), and mechanical jobs (merges, cleanup) go to Haiku.
- **Git:** a feature branch and PR for code; docs-only changes may go on main. Remove the worktree and branch after a merge.
- **Sign-off:** auth, secrets and payments changes need Lance's sign-off first. Never touch a production DB.

## Ephemeral artifacts

- **Scratchpad:** `/private/tmp/claude-501/-Users-lance-Documents-Projects-lance-portfolio-claude/0283ed32-7e68-4497-88f7-47dc149bbbd5/scratchpad/` holds the QA scripts (`shelf-check.cjs`, `click-check.cjs`, `prod-check.cjs`, `proto*.cjs`), the threaded `preview-api.py`, and screenshots (some show album art, so don't copy them into the repo). All will vanish on reboot. The findings are summarised above.
- **Old previews:** `/private/tmp/album-art-*.png` and `/private/tmp/album-art-preview-api.py` are obsolete.
- **Servers:** the preview servers on 5195/5196 are stopped. The temporary `.claude/launch.json` entries (`places-site`, `spotify-api`) were removed again.
- **Image venv:** `<scratchpad>/imgvenv` has Pillow and pillow-heif for `scripts/ingest-photo.py`. It will vanish; recreate it with `python3 -m venv <dir> && <dir>/bin/python -m pip install pillow pillow-heif`.
- **Contact sheet:** `<scratchpad>/contact-sheet.jpg` shows all 17 travel originals. These are personal photos, so never copy it into the repo.

## Next task: Airtable Clone screenshots (requested 2026-10-22, not started)

Lance asked: "for the airtable clone can we get screenshots from it for the portfolio". Nothing has been done yet.
- **Where it shows:** `src/data.ts`, entry `numeral: 'II'`, `name: 'Airtable Clone'`. Live site https://airtable-clone-lyra.vercel.app/, repo https://github.com/lanceriver/airtable-clone-lyra. It currently shows the painted plate `/plates/lake-terrace.webp` ("Plate II").
- **Pattern to reuse:** Worn (Plate III) shows real captures through the `screens?: Screen[]` field in `src/data.ts`, rendered as figures in `src/components/Work.tsx` (DECISIONS D54). Read both before designing; decide whether screens replace or sit beneath the plate.
- **Sign-in:** the app needs one, likely OAuth. Claude must not enter credentials or complete OAuth on the production app. Options: Lance signs in himself in the browser pane or Chrome and Claude captures; Lance takes the screenshots; or Claude runs the repo locally with seeded test data (a local dev host with test credentials is allowed). Ask Lance which.
- **Content worth showing:** a large table (the "million rows" claim), views, filters and sorting.
- **Before using any capture:** remove personal data and real emails or names.
- **How to ship:** feature branch + PR, then merge and the site deploy. Front-end only.

## Suggested next session

1. Read this file. Brief Lance and ask how to capture the Airtable Clone (sign-in route above).
2. Ask about decision 1 (local main rebase and push).
3. Don't revisit the shelf design or the unrelated imagery without Lance's direction.
