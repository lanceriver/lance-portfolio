# Handoff — lance-portfolio, post-PR21 (nothing in flight)

_Last updated 2026-10-24. One living file — rewrite, don't append._

## TL;DR

- **Nothing is in flight.** No open PRs, and the only worktree is the primary checkout. `main` is level with `origin/main` (`629a5a4` before this commit).
- **Shipped and live:** PR20 (Airtable aperture), PR23 (SEO), and [PR21](https://github.com/lanceriver/lance-portfolio/pull/21) (nav, accessibility, About/Experience sidebar, Worn first). PR21 merged 2026-10-23 as `ef2cc45`; deploy run `39964932069` passed test and deploy. [PR22](https://github.com/lanceriver/lance-portfolio/pull/22) was closed as redundant.
- **Lance confirmed on 2026-10-24:** the sitemap was submitted and indexing requested in Search Console, and the shipped About sidebar and Worn-first order were checked on a real phone.
- **Tests:** not run this session. The last observed result is CI's `test` job passing on run `39964932069`.
- **Next:** no task is queued. Lance decides what comes next; see "Decisions pending".
- **Uncommitted/untracked (not created this session, except as noted):** `.claude/launch.json` (formatting only), `.impeccable/` (critiques), `assets-source/IMG_7501.JPG`, `assets-source/Sandstone Pillars and Mountain Pavilion.png`. `docs/daily-priorities.md` was rewritten this session and is committed with this file.

## Where the product is

| Area | State |
|---|---|
| Work | **Live.** Worn is Plate I (still scene) and the Airtable Clone is Plate II (table through the aperture). Pool Safety moved to Experience. D57, D60, D63. |
| About / Experience | **Live.** This is mock R from `docs/experience-mocks/`, recorded as D62. A pinned left sidebar (≥901px wide and ≥680px tall) holds "About.", the route, the interests under an "Interests" label, education and the résumé link. The right column holds the bio and the roles. Each role shows its dates, then role · employer in Georgia, then the summary. There is no visible "Experience" heading; a hidden h3 labels the list. Type uses three steps: 13, 17 and 21px. |
| Nav and accessibility | **Live** via PR21: hide-on-scroll nav, accessibility fixes and footer fixes. |
| SEO | **Live** (D61): robots, sitemap, OG/Twitter tags, JSON-LD and prerendered `#root`. Search Console is done. |

## Key findings (the why)

- **Experience took about 18 mock rounds.** All of them are in `docs/experience-mocks/` (README says what each was and why it failed). Don't re-propose them.
  - Rejected: A lead entry, B unfolding index, C prose with margin notes, D run-in inside About, and E by place. Lance called D and E "terrible". The tabbed selector was dropped on purpose.
  - Lance liked brittanychiang.com's *organisation* in the site's own type. He disliked an empty left column, ruled eyebrow labels (an AI tell), tech tags, and interest category labels.
- **Content constraints still hold.**
  - Text only.
  - Keep Lance's Pool Safety wording.
  - Facts come only from `public/lance-rivera-resume.pdf`.
  - Keep "coordinated" for the VBA work.
  - Worn Fig. 2 stays.
- **Impeccable critique** of 2026-10-22 scored 24/36 (`.impeccable/critique/2026-10-22T10-49-24Z__src-app-tsx.md`, untracked). PR21 shipped its top items: the nav, the thin Pool Safety scene, the footer and accessibility. The copy items (self-narrating copy) are still open, and the critique hasn't been re-run since.

## Done / left

**Done:** PR20, PR21 and PR23 are merged and deployed. PR22 is closed, and its branch and worktree are gone. Search Console and the real-phone check are done (Lance).

**Left (optional, unscheduled):**
1. Copy pass (Impeccable clarify/distill) on the self-narrating copy the critique flagged.
2. Re-run the Impeccable critique on the live site for a new score.
3. Switch post share images from WebP to JPG for wider link-preview support.
4. Cleanup:
   - Delete the remote branch `claude/lanceriver-critique-yqatzp`. Its PRs (#7–#11) are merged and its tip `1d076f4` is in main.
   - Revert the `.claude/launch.json` reformat.
   - Decide whether `.impeccable/` should be committed or gitignored.

## Decisions pending with Lance

1. **What's next for the site.** The critique's main items have shipped. Options: the copy pass, a new critique round, or new content.
2. **Bakery spelling** for a caption ("Apoli Itabakery"?).
3. **Unused images:** the travel originals, other paintings, and the two untracked files in `assets-source/`.
4. **`airtable-local-pg` Docker container** (1,000,050 faker rows, last known stopped): remove it if there will be no more Airtable captures. Its status was unverified this session because Docker wasn't running.

## Workflow / environment notes

- **Build/verify:** `npm run build && npm run verify`. For production-identical prerender output, use `SITE_URL=https://lanceriver.com npm run build`.
- **Deploys:** a push or merge to `main` deploys to lanceriver.com via GitHub Actions. Ask before merging.
- **GitHub:** prefix commands with `GH_TOKEN="$(gh auth token --user lanceriver)"`, and never print the token.
- **Mocks:** `docs/experience-mocks/show-switcher.cjs` opens a Playwright-driven Chrome window with a mock switcher against a running preview.
  - Playwright is at `/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`, with Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
  - Set `html{scroll-behavior:auto!important}` before scrolling programmatically.
  - In production, abort non-GET `execute-api` requests (the visitor counter).
- **Preview:** Lance previews in Google Chrome. The in-app browser pane scales large viewports down, so don't use it for captures. `.claude/launch.json` has `proto-study` and `dev`.
- **Codex:** `codex exec -C <worktree> -s danger-full-access -o <file> "<prompt>"`. If it hits its usage limit, fall back to a Sonnet subagent.
- **Favicon:** Chrome caches favicons. Open `/favicon.ico`, then hard-reload.
- **Decision numbers:** the latest is D63 in `DECISIONS.md`.

## How we work

- Opus designs and reviews. Codex (preferred) or Sonnet implements in a worktree from a written spec. Haiku handles push, PR, merge and cleanup.
- A feature branch and PR for all code. Docs-only changes can go straight to main.
- Use Impeccable for design work. For an open direction, run the shape playbook first.
- Short replies. Act, don't instruct.

## Ephemeral artifacts

The old scratchpad `/private/tmp/claude-501/-Users-lance-Documents-Projects-lance-portfolio-claude/368cc597-c98f-4717-98b8-ee8882ceb239/scratchpad/` (specs, critique screenshots, mock captures, SEO image sources) may already be gone. Everything needed was preserved in `docs/experience-mocks/` and `DECISIONS.md`.

## Suggested next session

1. Ask Lance what's next (Decisions pending #1).
2. If it's polish: run the Impeccable critique on lanceriver.com, then the copy pass.
3. Run the cleanup items on Lance's word.
