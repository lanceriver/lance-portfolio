# Handoff — lance-portfolio, live site + next build round

_Last updated 2026-10-22. One living file — rewrite, don't append._

## TL;DR
- `main` at `8f92aef`, level with `origin/main`. No open PRs, one worktree (this checkout). Repo `lanceriver/lance-portfolio` is **public**.
- **Live at https://lanceriver.com** (AWS stack `lance-portfolio`, us-east-1). Every merge to `main` deploys via `.github/workflows/deploy.yml`; last deploy run 39605694781 succeeded and all runbook checks passed (200/301/404, headers, CORS, counter).
- Last observed: `npm run build` clean, `npm run verify` 34/34, `pytest infra/tests` 5/5, CI green on PR #6.
- Untracked here (not committed, leave unless Lance says): `.impeccable/` (critiques), `docs/daily-priorities.md`, `assets-source/Sandstone Pillars and Mountain Pavilion.png` (byte-identical to committed `assets-source/zhangjiajie-pillars.png`; safe to delete with Lance's OK).
- **Next:** mobile layout (no horizontal scroll, ever). Then personal photos/interests, Spotify turntable, real product screenshots.

## Lance's priorities for 2026-10-22 (his words, in order)
1. **Mobile layout.** You can zoom out and scroll sideways on a phone; that must never happen. Wants a proper mobile layout, not just an overflow clamp.
2. **Personalise:** more of his own photos, plus creative sections for his interests (he'll bring specifics).
3. **Spotify:** wire the Field Notes record player (placeholder) to the Spotify API to show what he's listening to now.
4. **Real product screenshots** in Work instead of the placeholder paintings, especially **Worn**.

## Where the product is
| Area | State |
|---|---|
| Content | Real. Plates: I Pool Safety Solutions (résumé-level, no link), II Airtable Clone (live demo + code), III Worn ("In progress", repo private). Two real posts. Contact links real. Résumé PDF with phone redacted. (PR #3) |
| Hero | Zhangjiajie painting (AI-generated from Lance's photo) + 2x export from his 4K upscale. Dissolves into cloud cream `#F1E7D5` (`--hero-exit`). Snowfall commented out with TODO (needs a mist treatment); flock active. (PR #4) |
| Hosting | S3 (private, OAC) + CloudFront `E1ZCFALE8XHKH7` + ACM + Route 53 zone `Z08238469JD0YFW9R421`. URL function: www→apex, `/x`→`/x/`, dir index. Blog CNAME (hashnode) + Google TXT carried over. (PRs #5, #6) |
| Visitor counter | HTTP API `https://jjplj3vij6.execute-api.us-east-1.amazonaws.com/visits` → Lambda (py3.12) → DynamoDB `lance-portfolio-VisitsTable-O9ZVHTEJH9U4`, seeded 1330. Shown on Back Cover. |
| Deploy | OIDC role `lance-portfolio-DeployRole-Y046qF6SYJUz`, trust = immutable sub `repo:lanceriver@138498184/lance-portfolio@1372895004:ref:refs/heads/main`; can only write the site bucket + invalidate the distribution. Repo variables hold role ARN, bucket, distribution id, API URL. |

## Key findings (the why)
- **Mobile overflow root cause** (critique 2026-10-21, `.impeccable/critique/2026-10-21T10-06-58Z__src-app-tsx.md`): `overflow-x: clip` is on `body` only (`src/styles/base.css:16`), so the fixed nav sizes to the overflowing layout viewport (scrollWidth 502 at 375px) and Contact falls off-screen. Offenders then: Field Notes `.obj--type` / `.specimen`, `.scene__num--ii`. The Fieldguide rail has since been removed. Clamp on `html` is the floor, but Lance wants a real mobile composition: Field Notes desk is a ~5,200px single column on phones and the page is ~14k px.
- **Turntable placeholder:** `src/components/FieldNotes.tsx` ~line 353, `NOW_PLAYING` const shaped like Spotify `currently-playing`, falls back to last track when nothing plays (DECISIONS D48). Record spins only while playing.
- **Spotify needs a server side:** the client secret + refresh token can't ship to the browser. Plan: Lambda `GET /now-playing` on the existing `VisitsApi` (CORS already locked to the site), short cache (~30s), scopes `user-read-currently-playing` + `user-read-recently-played`, secrets in SSM SecureString or Secrets Manager. **Secrets = Lance's sign-off on approach before implementing** (CLAUDE.md). One-time OAuth to get the refresh token must be done by Lance in his browser.
- **Screenshots:** Worn lives in private repo `lanceriver/fits-app-workspace` (no public link, plate says "In progress"). Airtable clone demo sits behind Google sign-in (Lance must be the one signed in). Pool Safety: no screenshots, ever (employer system; résumé-level only).
- **Critique 2026-10-21:** 22/36. P0 (demo content) fixed. Open P1s: Back Cover contact text illegible over the painting; nav has no ground; imagery reuse. Background research: hiring managers skim ~60s for role, stack, one project, code.
- GitHub Actions on the `lanceriver` account failed on billing while the repo was private; making it public fixed it. Keep it public or fix billing before going private.
- The auto-mode permission classifier blocks DNS/cert/CloudFront edits and making repos public. Those steps need Lance to run the command.

## Decisions pending with Lance
1. **Retire the old site** (list in `infra/README.md`): bucket `lanceriver.com`, distribution `EAKMWW6S5Z3KD` (aliases already removed), role `GitHubAction-AssumeRoleWithAction`, table `lancerivervisitor_counter`, stacks `v1 v1point1 v1point2 testingWebsiteStack hello helloooo`, ~20 py3.9 Lambdas, 7 old APIs, expired cert, orphaned zone `Z045884510L49TOC5SLX0` ($0.50/mo). Recommend: yes, now that cutover is verified. Leave `exoplanets-backend`, `cobber-driver-onboarding-dev` alone (other projects).
2. **Spotify secret storage:** SSM SecureString (free, recommended) vs Secrets Manager ($0.40/mo, rotation).
3. **Imagery direction:** Lance chose Zhangjiajie for the hero; the remaining plates (coastal road, lake terrace, hill path, alpine village) are generic AI paintings. Recommendation from the critique: regenerate plates from his own trips (prompt template is the one used for the hero, in this session's transcript; style ref `assets-source/alpine-village.png`). Ask before generating.

## Workflow / environment notes
- Dev: `npm run dev` here (port 5173), or preview config `lance-portfolio` (port 5190) in `/Users/lance/Documents/Projects/resume_website/.claude/launch.json` (preview_start resolves configs from that session's cwd).
- Verify: `npx tsc -b && npm run build && npm run verify`; Lambda tests `python3 -m venv /tmp/v && /tmp/v/bin/pip install -r infra/requirements-dev.txt && /tmp/v/bin/python -m pytest infra/tests`.
- AWS: `aws sso login --profile admin` (Lance runs it), then `AWS_PROFILE=admin`. Infra changes: `cd infra && sam build && sam deploy --no-execute-changeset`, show the change set, execute after OK. Profile `pss` is work, never use it.
- GitHub: `gh` active account is `digitalcommandeur` (work). For this repo prefix commands with `GH_TOKEN=$(gh auth token --user lanceriver)` instead of switching.
- Codex: `codex exec -s danger-full-access -C <worktree> "$(cat spec.md)" </dev/null`. **Redirect stdin from /dev/null**, or it hangs on "Reading additional input from stdin". It hit its usage limit once on 2026-10-21. Hide AWS creds for Codex: `AWS_CONFIG_FILE=/dev/null AWS_SHARED_CREDENTIALS_FILE=/dev/null`.
- Browser pane: emulated viewports don't run the hero entrance/IntersectionObserver reliably; verify the hero name on a real phone. `?settled=1` shows settled composition.
- Hero image: edit `assets-source/zhangjiajie-pillars*.png`, re-export with `cwebp`, `--hero-exit` is sampled from the bottom-edge cloud (x 0–65%).

## How we work
- Feature branch + PR for code; docs-only may go to main. Worktree per branch; remove worktree + branches when merged.
- Opus designs/reviews; implementation to Codex (preferred) or Sonnet with self-contained specs; mechanical git/PR jobs to Haiku. **Trivial swaps (asset + a few lines) done inline** (memory, 2026-10-21).
- Auth/secrets/payments/access control: Lance signs off the approach first. Outward actions (deploys, deletes, public changes) confirmed per action.
- Lance's taste: no generic dev-portfolio look; opinionated, referenced design. Don't add disclosure copy he didn't ask for (he rejected "AI-generated" in the colophon).

## Ephemeral artifacts
- Session scratchpad `/private/tmp/claude-501/-Users-lance-Documents-Projects-resume-website/7363c24f-.../scratchpad/`: specs (`spec-*.md`), Codex logs, crops. All landed work is in git; the specs are not needed again.
- `~/Downloads/zhangjiajie_hero_4k_lossless.png` — already copied into `assets-source/zhangjiajie-pillars-4k.png`.
- Travel photo originals: `assets-source/travel/*.JPG` (gitignored by design; Photos library is the archive). Ingest new ones with `python3 scripts/ingest-photo.py` (strips GPS).

## Suggested next session
1. Open the session in **this** directory so the hook injects this file.
2. Mobile layout: measure every section at 375/390/430px for `scrollWidth > innerWidth`, clamp overflow at the root, then design the phone composition section by section (Work scenes, Field Notes desk, Back Cover contact on a clean ground). Opus designs; spec to Codex; verify on a real phone.
3. Ask Lance which photos and interests to add; plan the personal sections with him before building.
4. Spotify: get Lance's sign-off on secret storage, have him create the Spotify app + do the one-time auth, then Lambda `GET /now-playing` + wire `Turntable`.
5. Screenshots: Worn from the simulator (Claude drives it), Airtable clone with Lance signed in; swap them into the plates in a print treatment that fits the plate-book.
6. Old-site retirement once Lance OKs decision 1.
