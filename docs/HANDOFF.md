# Handoff — lance-portfolio, Spotify record shelf shipped

_Last updated 2026-10-22. One living file — rewrite, don't append._

## TL;DR

- **Shipped:** [PR #18](https://github.com/lanceriver/lance-portfolio/pull/18) is merged as `4674ef0` and live on https://lanceriver.com/#notes. Field Notes now has a shelf of recent Spotify records beside the turntable, hover captions, and the colophon in the top-right corner.
- **AWS:** stack `lance-portfolio` reached `UPDATE_COMPLETE` (Spotify Lambda code plus the dependent `VisitsApi` body; nothing replaced). The site deploy run `39722028653` succeeded. No change sets are pending.
- **Primary git:** `/Users/lance/Documents/Projects/lance-portfolio-claude` is on `main`, **ahead 5 / behind 1** of `origin/main`. The 5 are local docs-only handoff commits (`04eb2ba`, `3086287`, `af33b72`, `63c8616`, `c39b882`); this handoff adds a 6th and 7th. The 1 is the PR #18 merge. My `git rebase origin/main` was blocked by the auto-mode classifier, so Lance must rebase or pull these himself. Do not push automatically: every push to main deploys.
- **Untracked, pre-existing, untouched:** `.impeccable/`, `docs/daily-priorities.md`, `assets-source/IMG_7501.JPG`, `assets-source/Sandstone Pillars and Mountain Pavilion.png`.
- **Worktrees:** only the primary checkout. The album worktree and `codex/spotify-album-art` (local and remote) are removed.
- **Next step:** none blocking. Lance decides on the local main rebase and the optional items below.

## Where the product is

| Area | State |
|---|---|
| Field Notes photo pile (PR13/14) | Live. Seven photos, compact pile. |
| Worn mobile motion (PR15) | Live. A physical-phone check is optional, with Lance. |
| Spotify turntable + API (PR16/17) | Live. Read-only endpoint, SSM refresh token. |
| Record shelf (PR18) | **Live, verified in production** (see below). |

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

1. **Local main:** rebase the 7 docs commits onto `origin/main` (it was blocked for me), then decide whether to push. A push deploys the site, with docs only.
2. **Other paintings:** replace the remaining non-Field-Notes artwork with travel imagery only at Lance's direction.
3. **Airtable Clone screenshot:** optional Plate II improvement that needs a signed-in capture.
4. **Optional real-phone checks:** the shelf, and Worn.

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
- **Servers:** the preview servers on 5195/5196 are stopped.

## Suggested next session

1. Read this file. Ask Lance about decision 1 (local main rebase and push).
2. Otherwise, take Lance's next direction. Don't revisit the shelf design or the unrelated imagery without it.
