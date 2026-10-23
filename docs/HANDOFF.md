# Handoff — lance-portfolio, redo the text-only Experience section

_Last updated 2026-10-23. One living file — rewrite, don't append._

## TL;DR

- **Next:** redo the text-only Experience section. Lance rejected all three directions shown on 2026-10-23 (A lead entry, B unfolding index, C prose with margin notes). He hasn't said why, so ask before designing a new round. The rejected mocks and how to show them are in `docs/experience-mocks/README.md`. Don't repeat them.
- **The Experience work belongs to [PR21](https://github.com/lanceriver/lance-portfolio/pull/21)** (`codex/portfolio-refinements`, head `1f35ee3`), worktree `/Users/lance/.codex/worktrees/portfolio-refinements/lance-portfolio-claude`. That worktree has one uncommitted change, in `scripts/verify-scroll-math.mjs` (headings Work II/III → I/II only). Preserve it.
- **Shipped this session:**
  - [PR20](https://github.com/lanceriver/lance-portfolio/pull/20): Airtable table through the aperture, rust title, ruled index. Merged as `1d076f4`.
  - [PR23](https://github.com/lanceriver/lance-portfolio/pull/23): SEO. Merged as `fc26b06`; deploy run `39939425967` succeeded.
  - Both were verified on lanceriver.com. Their branches and worktrees are deleted.
- **Open and conflicting:** [PR22](https://github.com/lanceriver/lance-portfolio/pull/22) (`feat/nav-a11y`, `d5bc69c`, worktree `/Users/lance/Documents/Projects/lance-portfolio-nav`). It duplicates PR21's nav and accessibility work and is now CONFLICTING with main. The recommendation is to close it and remove its worktree. **Lance hasn't decided.**
- **Primary checkout:** `main`, ahead 11 / behind 4 of origin/main after this commit. Every ahead commit is a local handoff doc. Don't push or rebase automatically, because a push to main deploys.
- **Last observed tests:** PR23 build and `npm run verify` ALL PASS 39/0 (after the merge). PR21's verify was 42/0 per the previous handoff, not re-run by me.

## Where the product is

| Area | State |
|---|---|
| Work II Airtable (PR20) | **Live.** The table slides up through the aperture, toned to plate stock; the title flips to `--rust`. A ruled index (01 Views / 02 Filter / 03 Sort) sits below. DECISIONS D57. Captures came from a local copy of the app with 1,000,050 faker rows. |
| SEO (PR23) | **Live:** `robots.txt`, `sitemap.xml` written by `scripts/prerender.mjs`, home canonical/OG/Twitter tags, `og/home.jpg` (1200×630), `favicon.ico`, `apple-touch-icon.png`, Person and BlogPosting JSON-LD, and real text inside `#root` that React's createRoot replaces on mount. Posts now preload only their own image (saves 554KB on retina phones). DECISIONS **D61**, which skips D58–D60 because PR21 uses them. |
| PR21 (Codex session) | Open, not deployed. Hide-on-scroll nav, accessibility, About rewrite, Experience register, Pool Safety removed from Work, footer fixes. Mergeable status was UNKNOWN when checked, and it probably conflicts with main on DECISIONS.md after #20/#23. |
| PR22 (this session) | Open, conflicting, redundant with PR21. |
| Experience | PR21 has a plain three-column register (dates / employer+role / summary) in `src/components/Crossing.tsx` and `crossing.css`. Lance finds it too plain. Three replacements were rejected; see below. |

## Key findings (the why)

- **The Experience content is unequal, and that's the core design problem.**
  - Pool Safety has six real facts; CSESoc and SAF have one line each. A register gives them equal weight.
  - It also repeats the interests strip directly above (ruled, columned), and its type sits in a narrow 13–21px band.
- **Constraints Lance has set:**
  - Text only: no images, diagrams or fake screenshots.
  - Keep his Pool Safety wording. He declined a rewrite into short claims.
  - Worn Fig. 2 stays.
  - Approved for sharing: "we can share the architecture and all that its fine".
  - Facts come only from `public/lance-rivera-resume.pdf`; invent nothing. Keep "coordinated" for the VBA work.
- **Facts:**
  - Pool Safety Solutions: Junior Systems Engineer, Mar 2026–present.
  - UNSW CSESoc: Marketing Subcommittee, Mar–Dec 2025 (9,000+ followers, 50,000+ views).
  - Singapore Armed Forces: Administrative Assistant, National Service, Nov 2022–Nov 2024 (VBA automation, 90% less processing time; a Telegram bot).
  - UNSW BSc Computer Science, finishing Dec 2026.
- **Rejected so far:**
  - Codex's earlier options: oversized names with expanders, an editorial layout, a chapter selector.
  - My three mocks, A, B and C (see `docs/experience-mocks/`).
  - I dropped a tabbed selector on purpose: it's the Brittany Chiang pattern.
- **Impeccable critique** (2026-10-22, `.impeccable/critique/2026-10-22T10-49-24Z__src-app-tsx.md`, untracked): 24/36. Top issues were the nav, Pool Safety being the thinnest scene, back-cover legibility, accessibility, and self-narrating copy. PR21 and PR22 cover the nav and accessibility items; PR21 also covers Pool Safety and the footer.
- **SEO:** the domain already has a `google-site-verification` TXT record in Route 53, so Search Console was set up at some point.

## Done / left

**Done:** PR20 and PR23 merged and deployed, with production checked (prerender replaced on mount, no page errors). The rejected Experience mocks are preserved.

**Left:**
1. A new round of text-only Experience directions. Ask Lance what failed in A, B and C first.
2. PR22: close it and remove `lance-portfolio-nav`, but only on Lance's word.
3. PR21: resolve conflicts with main (DECISIONS.md at minimum), finish Experience, then merge when Lance asks.
4. **Lance:** in Google Search Console, open the lanceriver.com property, submit `sitemap.xml`, and request indexing for `/`.
5. Optional from the critique: copy pass (clarify/distill), real-phone checks, post share images as JPG (still WebP).

## Decisions pending with Lance

1. **Experience:** why A, B and C failed, and what to try next.
2. **PR22:** close it as redundant with PR21 (recommended), or keep it.
3. **Local main:** rebase the 11 docs commits onto origin/main and decide whether to push. A push deploys.
4. Older optional items: the bakery spelling ("Apoli Itabakery") for a caption, unused travel originals, other paintings.

## Workflow / environment notes

- **Build/verify:** `npm run build && npm run verify`. For production-identical prerender output, use `SITE_URL=https://lanceriver.com npm run build`.
- **PR21 preview:** `.claude/launch.json` entry `pr21-preview` (port 5197, `--prefix` to the Codex worktree). I started it this session with `preview_start` and it was **running at handoff**. That modifies `.claude/launch.json` (uncommitted, along with the `nav-a11y` entry).
- **Lance previews in Google Chrome.** The Claude in Chrome extension was **not connected**, so mocks were shown in a Playwright-driven Chrome window (`docs/experience-mocks/show-switcher.cjs`). One such window may still be open.
- **Playwright:** `/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`, with Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
  - Set `html{scroll-behavior:auto!important}` before scrolling programmatically.
  - In production, abort non-GET `execute-api` requests (the visitor counter).
  - The in-app browser pane renders large viewports scaled down, so don't use it for captures.
- **Codex:** `codex exec -C <worktree> -s danger-full-access -o <file> "<prompt>"`. It hit its usage limit once on 2026-10-22; fall back to a Sonnet subagent.
- **GitHub:** prefix commands with `GH_TOKEN="$(gh auth token --user lanceriver)"`, and never print the token.
- **Local Airtable app:** Docker container `airtable-local-pg` is **stopped, not removed** and still holds 1,000,050 rows. The clone is in an old scratchpad; recreate it if needed.
- **Favicon:** the file is live and valid. Chrome caches favicons, so if it doesn't show, open `/favicon.ico`, then hard-reload.

## How we work

- Opus designs and reviews. Codex (preferred) or Sonnet implements in a worktree from a written spec. Haiku does push/PR/merge/cleanup.
- A feature branch and PR for all code. Ask before merging, because merging deploys.
- Use Impeccable for design work (`/Users/lance/.claude/skills/impeccable`); for an open direction, the shape playbook comes first.
- Short replies. Act, don't instruct.

## Ephemeral artifacts

The scratchpad `/private/tmp/claude-501/-Users-lance-Documents-Projects-lance-portfolio-claude/368cc597-c98f-4717-98b8-ee8882ceb239/scratchpad/` vanishes on reboot. It holds:
- the specs: `airtable-spec.md`, `nav-a11y-spec.md`, `seo-spec.md`;
- the critique evidence: `critique-a/` screenshots and `critique-b/detect.json`;
- the mock screenshots: `cap/out/exp/`;
- the SEO image sources: `seo/`.

The mocks and their notes are preserved in `docs/experience-mocks/`. Nothing personal was copied into the repo.

## Suggested next session

1. Read this file and `docs/experience-mocks/README.md`. Check `git -C <Codex worktree> status`.
2. Ask Lance in one round what failed in A, B and C (too loud, too plain, wrong hierarchy, interaction?). Then use Impeccable shape to propose new directions that differ from all six rejected ones.
3. Mock them on the PR21 preview and show them in Chrome with the switcher. Build only after Lance picks one, into PR21.
4. Raise PR22 closure and the Search Console step if Lance hasn't acted on them.
