# Handoff — lance-portfolio, album artwork awaiting approval

_Last updated 2026-10-22. One living file — rewrite, don't append._

## TL;DR

- **Next step: get Lance's visual approval for album artwork in [PR #18](https://github.com/lanceriver/lance-portfolio/pull/18), then merge and deploy.** He said “going to handoff” after seeing the preview; this is not approval. Do not merge or execute its AWS change set yet.
- **Live:** https://lanceriver.com/#notes. PRs #13–#17 are merged and deployed. Spotify current/recent track metadata works; production has no album cover yet. Deployed remote main is `55424300bb3cef880a4f08cb7e0dd27dfd101000`.
- **Album work:** `/private/tmp/lance-portfolio-album-art`, branch `codex/spotify-album-art`, clean and pushed at `b60fb4ab65f05be18fd5005f70c452e5144a5322`. PR #18 remains OPEN; CI run `39715788803` passed. It is attached to this chat.
- **AWS:** album change set is AVAILABLE and **unexecuted**; exact ARN/steps below.
- **Primary git:** `/Users/lance/Documents/Projects/lance-portfolio-claude` stays on `main`, at `63c8616` before this handoff commit, four documentation commits ahead of `origin/main`. This handoff adds a fifth local docs commit. Do not push these automatically: every main push deploys.
- **Pre-existing untracked items, untouched:** `.impeccable/`, `docs/daily-priorities.md`, `assets-source/IMG_7501.JPG`, `assets-source/Sandstone Pillars and Mountain Pavilion.png`. Leave them alone.
- **Preview running:** website `http://127.0.0.1:5195/?settled=1`, local Spotify API `http://127.0.0.1:5196/now-playing`. The browser tab no longer appears in this session inventory; reopen the preview URL if needed. Servers may need restarting after handoff/reboot.

## Where the product is

Field Notes has seven photographs, the approved compact pile and separate colophon/player. Spotify metadata is live; sleeve PR18 is pending. Worn phone figures are stationary immediately while desktop animation remains. Hosting is S3/CloudFront (`E1ZCFALE8XHKH7`, zone `Z08238469JD0YFW9R421`); main pushes deploy the website, SAM deploys infrastructure manually.

Old AWS site retired earlier2026-10-22 (`infra/README.md`, `f9e9524`); backup `~/Documents/aws-old-site-backup-2026-10-22/`. Keep stacks `lance-portfolio`, `exoplanets-backend`, `aws-sam-cli-managed-default`.

## Active change: album art (PR #18)

Lance asked “can we add the album art somewhere to it?” The concrete preview was shown with the real last-played “It's Just Us” / Kali Uchis cover. This is transient playback data, not permanent portfolio content.

**Implementation at `b60fb4a`:**

- Backend `infra/spotify/spotify_app.py` adds nullable `art` from existing `item.album.images`, no extra requests/scopes/IAM. Accepts only HTTPS `i.scdn.co/image/<alphanumeric>` without credentials, explicit ports, queries or fragments. Malformed/missing art returns null. Tests and `infra/README.md` updated.
- `src/hooks/useNowPlaying.ts` accepts older API responses without art and validates CDN URLs. Hoisted into `FieldNotes` for one shared visible-only poller.
- `FieldNotes.tsx` renders a static linked sleeve directly under `.notes__surface`, outside animated `.obj` wrappers. Image failure hides it; new URL clears failure state. Travel-photo record label retained. Desktop sleeve left84%/bottom130px/width min(14%,150px); ≤900px normal flow beneath player/right aligned/width min(42%,160px)/20px gap. Complete square, contain,4px corners, focus outline. D56 updated.
- [Spotify guidance](https://developer.spotify.com/documentation/design) requires full original artwork without cropping, rotation, animation, distortion or overlays. Never place cover on spinning record or animated wrappers. Official Spotify attribution remains.

**Validation observed:** build (TypeScript/Vite/prerender),34 scroll checks,35 isolated Python tests, SAM lint/build, detector `[]`, diff-check all pass. CI [39715788803](https://github.com/lanceriver/lance-portfolio/actions/runs/39715788803), job119617451932, SUCCESS at exact PR head.

Browser batch1440×1000/1024×900/390×844 passed current/last played, legacy no-art, unsafe URLs, image failure/recovery, keyboard focus and no page errors. One initial visible poller/no offscreen polling. Full square loaded, no transformed/animated ancestors, no overlap with player/colophon/seven photos, no overflow at those widths. At320×740, existing unrelated Crossing text causes35px overflow; cover fits and adds no page width, other art checks passed. Do not expand scope into fixing it. Seven photo geometries checked, not fresh expansion of every photo; browser emulation is not physical-phone validation. Two baseline Vite public-asset warnings remain (`2179b098`, `5467e91e`); no unrelated fixes.

**Prepared deployment, not applied:**

`arn:aws:cloudformation:us-east-1:319611139788:changeSet/samcli-deploy1792638885/c010b6e9-6bea-4db2-af26-24e1ad87bcc7`

Rechecked at handoff: `CREATE_COMPLETE`, execution `AVAILABLE`. Details: `SpotifyNowPlayingFunction.Code` direct modification; `VisitsApi.Body` dynamic dependency on the function ARN. Both no replacement. No role, SSM, KMS, or visitor-counter function changes.

After Lance approves the visual and merge/deployment:

1. Recheck PR head/CI; merge via squash with exact head match. CLI fallback: `GH_TOKEN="$(gh auth token --user lanceriver)" gh pr merge 18 --repo lanceriver/lance-portfolio --squash --match-head-commit b60fb4ab65f05be18fd5005f70c452e5144a5322`. Connector merge had an argument-binding issue earlier. Retain feature branches.
2. Recheck the prepared change set still matches approved code. Execute it using `aws cloudformation execute-change-set --change-set-name <ARN> --profile admin --region us-east-1`, then `aws cloudformation wait stack-update-complete --stack-name lance-portfolio --profile admin --region us-east-1`. If stale, rebuild/prepare with SAM from merged code and inspect before executing.
3. Watch the website's main-push deployment (not only PR CI). Use `gh run list --commit <merge-sha>` to find it. Frontend is backward compatible if it deploys before API artwork support.
4. Verify live API includes safe nullable `art`, production CORS, and the real cover in the website. No test visitor-counter POSTs. Update this handoff with actual merge/deploy evidence.
5. Stop local preview servers/remove the clean temporary worktree after completion; retain local/remote merged branches. Preserve all primary local docs commits and untracked items. Fetch/rebase primary main if needed, never reset away docs.

Previous automatic review rejected production deployment from an unmerged branch. Lance explicitly approved **PR #16** merge/deployment and it shipped; that approval is not approval for #18. Do not execute #18 from its unmerged branch.

## Spotify service already shipped

- App **Lance Portfolio**, public client ID `0db1911c96f949d88be71829930bc9b7`; dashboard https://developer.spotify.com/dashboard/0db1911c96f949d88be71829930bc9b7. Lance has Premium, accepted terms, authorized read scopes.
- `scripts/connect-spotify.py` uses PKCE/state and `http://127.0.0.1:8888/callback`, no client secret. Standard SSM SecureString `/lance-portfolio/spotify/credentials` (AWS-managed aws/ssm) stores client ID/refresh token. Never print tokens. Reconnect after180 days. No new credentials needed for artwork.
- API https://jjplj3vij6.execute-api.us-east-1.amazonaws.com/now-playing. Repo variable `NOW_PLAYING_API_URL` exposes `VITE_NOW_PLAYING_API`. Production has four fields (`playing,title,artist,url`), PR18 adds nullable `art`. Separate Lambda `infra/spotify`; visitor counter `infra/visits` untouched.
- Scopes `user-read-currently-playing`, `user-read-recently-played`; metadata cache30s/token until expiry-60s, one401 retry,429 cooldown. Frontend polls30s only document visible/player in view, aborts8s, stops record on error while retaining honest metadata.
- AWS profile `admin`, account319611139788, us-east-1, stack `lance-portfolio`; SSO worked, may expire (`aws sso login --profile admin` needs Lance). Function15s/128MB shares concurrency: quota10 prevents reserving1 while leaving ≥10 unreserved. PR17 keeps reservation commented with TODO; retain it.
- PR16 merged `d5e2349`, CI39713297867/site39713411557 passed. PR17 merged `5542430`, CI39713893035/site39714002246 passed. Corrected original stack deployment completed. Earlier production page/API/logo verification passed; album art has not deployed.

## Earlier shipped work to preserve

- Photos PR13 `23da8cd`, deploy39706220238; composition PR14 `4861a45`, deploy39708045081: passed. Seven lightbox photos (Zhangjiajie, Furong, Terracotta Army, mountain road, coastal train, torii, bamboo). WebP in `public/plates/`, provenance `assets-source/PROVENANCE.md`. Originals gitignored in `assets-source/travel/` (17;ten unused), never commit. `IMG_7501.JPG` is unused bakery photo.
- Keep approved compact pile and separate support objects. Removed alpine band/palette/type/ampersand/slip stay removed; other paintings remain. Desktop surface min(1040px,shell),min-height1400; fixed photo offsets. Colophon left16%/top1040px/width min(34%,360px); player left60%/bottom32px/width min(22%,255px). Mobile gap20/margin-64; support override selectors `.obj + .obj--colophon` and `.obj + .obj--turntable` add20 (specificity matters). Retain pointer/focus lifting and seven-photo reachability. Prior1440/1024/390 QA covered image expansion/touch/focus/no overlap.
- Worn PR15 `2ea61de`, CI39709497721/deploy39709617067 passed. All six mobile figures visible/stationary initially; desktop entrance/drift retained, hover only fine-pointer non-mobile without reduced motion. Browser390/844/900/1440 and live resize/reduced-motion/swipe checks passed; physical-phone check optional with Lance.

## Decisions pending with Lance

1. **Album sleeve:** visual approval for the preview and permission to merge/deploy PR #18. Last assistant response showed `/private/tmp/album-art-desktop-preview.png` and asked this. No answer yet.
2. **Other paintings:** replace remaining non-Field-Notes artwork with travel imagery only at Lance's direction; ask before generating. Current request does not authorize hero/Work/Writing/Back Cover changes.
3. **Airtable Clone screenshot:** optional Plate II improvement requiring signed-in capture.

## Workflow / environment notes

- Sol orchestrates/reviews/handoff; Luna implements (`fork_turns:none`, `model:gpt-6-luna`). `/root/album_backend` and `/root/album_frontend` finished; Sol reviewed their changes. Feature branch + PR for code, worktrees for parallel work; trivial docs may commit on main. Auth/access/secrets/payments need signoff. Never query production DB. Read before editing; temporary disabling uses comment + TODO.
- Primary docs commits before this handoff: `04eb2ba`, `3086287`, `af33b72`, `63c8616`; this adds fifth. Do not push automatically: all main pushes deploy. Retain merged remote branches: auto-review previously rejected deletion as unnecessary destructive cleanup. Clean local temporary worktrees may be removed when finished.
- No OpenSpec or PSS implementation plan exists here (search confirmed).
- Build: `npm run build && npm run verify` (includes TypeScript). Isolated Python: `/private/tmp/portfolio-spotify-python/bin/python -m pytest infra/tests -q`, with `AWS_EC2_METADATA_DISABLED=true`, `AWS_CONFIG_FILE=/dev/null`, `AWS_SHARED_CREDENTIALS_FILE=/dev/null`. No production access for tests.
- npm CI timeout/retries are configured; audit stays enabled (previous advisory hang).
- GitHub connector works as `lanceriver`; CLI default can be wrong: prefix `GH_TOKEN="$(gh auth token --user lanceriver)"`, never print token. SSH push works. Attach all created PRs via Codex tool.
- SAM from `infra`: `sam validate --lint --template-file template.yaml && sam build --template-file template.yaml`. Prepare only: `sam deploy --template-file .aws-sam/build/template.yaml --stack-name lance-portfolio --region us-east-1 --profile admin --capabilities CAPABILITY_IAM --resolve-s3 --no-confirm-changeset --no-execute-changeset`.
- Impeccable context ran once; preserve design, bounded QA. Playwright `/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`, Chrome `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; launch/network needs escalation. `?settled=1`/reduced motion aids QA; preserve sticky transition/ResizeObserver. No test counter POSTs.
- Album worktree symlinks primary `node_modules`. Restart website there: `VITE_NOW_PLAYING_API=http://127.0.0.1:5196/now-playing npm run dev -- --host 127.0.0.1 --port 5195`. API: `/private/tmp/portfolio-spotify-python/bin/python /private/tmp/album-art-preview-api.py`; helper uses feature handler/admin profile and existing token-refresh behavior. At handoff listeners: node53348/Python53352, tool sessions84697/40686. Recheck ownership before stopping ephemeral PIDs.
- Worn simulator context, not rechecked: screens1/3/5 phone captures;2/4/6 fictional seeded diary, specs `docs/worn-screens/`. `worn-portfolio` UDID `22D896FD-B2AD-4C2A-90B5-9A5F14C556C7`, iPhone17 Pro/iOS26.5, last `fits-app-workspace origin/main fe24116`. Seed via app flags `-WardrobeSeedDiary YES -WardrobeSeedBuilder YES`; never sqlite-edit SwiftData. More device/asset details in previous handoff git history.

## Ephemeral artifacts

- `/private/tmp/album-art-desktop-preview.png`: real stopped-track desktop preview shown to Lance; `/private/tmp/album-art-preview.png`: browser phone-width screenshot. Test screenshots `album-art-{desktop,tablet,mobile,narrow}.png` may show focus/mock playing state.
- `/private/tmp/album-art-qa.cjs`: checks. `album-art-qa.json` was overwritten by the320px confirmation and holds **only narrow results**, not the entire earlier batch. Findings preserved above; do not infer complete coverage from JSON alone.
- Temp previews/evidence may vanish on reboot; code is pushed. Never copy album art/personal images into docs. Earlier photo/travel evidence is summarized in git history. Only primary and album worktrees remain.
- Durable old-site backup `~/Documents/aws-old-site-backup-2026-10-22/` was not revalidated this turn.

## Suggested next session

1. Read this file. Leave PR #18 and its change set pending until Lance approves the visual and merge/deployment. “Going to handoff” did not grant approval.
2. Show/restart preview if needed, then follow the exact head/CI/merge/deployment steps above after approval. If Lance wants layout changes, implement on the existing clean album-art worktree/branch through Luna, review and revalidate the changed behavior.
3. Verify production after deployment; only then stop previews and remove the clean temporary worktree. Retain branches and local docs commits; rewrite this living handoff again.
4. Optional Worn physical-phone check remains with Lance. Do not revisit unrelated imagery or existing narrow Crossing overflow without his direction.
