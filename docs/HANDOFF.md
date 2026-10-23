# Handoff — portfolio refinements; text-led Experience discussion

_Last updated 2026-10-23, Australia/Sydney. One living file — rewrite, don't append._

## TL;DR

- **Next: discuss a more interesting TEXT-LED Experience section with Lance.** He has no visuals for the roles. He wants typography, composition, and interaction to make the text interesting. No replacement has been selected or implemented.
- Continue implementation in **`/Users/lance/.codex/worktrees/portfolio-refinements/lance-portfolio-claude`**, branch **`codex/portfolio-refinements`**. Its own handoff is old; this primary-checkout file is current. Do not switch the primary checkout's branch.
- **[PR21](https://github.com/lanceriver/lance-portfolio/pull/21) is OPEN, not merged/deployed.** Head `1f35ee3`, pushed and level with its remote. CI test passed in 20s: run `39778464201`. Local verify just rerun: **42 passed / 0 failed**.
- Preview **http://127.0.0.1:5197/** runs from that worktree (Node PID 53700 at handoff). Lance wants **Google Chrome**, not the in-app browser. A local preview tab and separate production tab are already open; preserve his tabs.
- Work now contains only **Plate I Airtable Clone** and **Plate II Worn**. Duplicate Pool Safety removed at Lance's request. **Worn Fig. 2 stays.**
- Primary main is ahead 9 / behind 3 before this local docs-only commit; afterward ahead 10 / behind 3. Do not automatically rebase or push it. Main pushes deploy.

## Exact latest conversation / next design decision

Lance requested removing the Pool Safety plate because Experience already covers it, and said Experience was too plain. He asked us to research other portfolios. We discussed interactive indexes, editorial spreads, and timelines, initially suggesting diagrams and artifacts. He corrected this:

> “what if i dont have visuals for any of them? i was more looking for how to make the text bit more interesting”

The last response proposed three **text-only** directions:

1. **Oversized employer names with expanding details — recommended, NOT chosen.** Bold typographic rows: year, large employer, smaller role. Click to unfold the story; Pool Safety begins open. Strong silhouette, compact page, fits the printed-book world.
2. **Editorial layout.** Everything visible; large dates in the margin, prominent employer names, shorter paragraphs underneath, selective italic emphasis. Replace the current résumé-like three-column register.
3. **Chapter selector.** Choose from three employers; one role at a time in a generous text area with a subtle page-like transition.

He has now asked for this handoff to continue talking with Claude. **Recommendation is not approval to implement option 1.** Continue the design conversation without asking for images or adding diagrams/fake screenshots. Avoid another long generic research round.

Research already done: [Brittany Chiang v4](https://v4.brittanychiang.com/#jobs) has selectable employer tabs; [Adham Dannaway's story](https://www.adhamdannaway.com/blog/how-i-became-a-designer) pairs career narrative with work. Rauno, Bruno Simon and Keita Yamada were also reviewed broadly. The later clarification makes visuals/game-like treatments irrelevant to the next decision.

## Product state

| Area | State |
|---|---|
| Existing production | PR18 Spotify shelf and PR19 expanded Field Notes shipped. PR20 Airtable aperture is merged as `1d076f4`, current fetched origin/main. Production was not rechecked for this handoff. |
| PR21 navigation/accessibility | Hide-on-scroll at all widths, keyboard-focus visibility override, live ground/hero tone. Skip links, stronger focus contrast, native photo dialog with focus trap/restore, logical Field Notes order, external-tab announcements, darker Writing metadata. |
| PR21 About | Singapore → Sydney; final-year UNSW CS, finishing Dec 2026; Junior Systems Engineer; aesthetics influencing Worn. Interests: walks, learning piano, cafés/places with character. |
| PR21 Experience | Plain ruled three-column register, factually correct; Lance finds it too plain. This is the next design target. |
| PR21 Work | Duplicate Pool Safety removed. Airtable I `#plate-i`, Worn II `#plate-ii`; index/labels updated. Existing aperture, Worn motion and six figures retained. |
| PR21 footer | Artificial blue sky cap removed after Lance reported a visible band. Full-bleed coastal painting, only actual top edge feathers on entry, fully opaque when settled. Contact targets settled point inside sticky travel, so details are visible on arrival. |
| Other PR21 | Shorter hero/footer scroll, clearer copy, Field Notes promise fixed, phone table aperture enlarged/cropped to retain legible row-number gutter. |

No PR21 work is deployed. No AWS/backend/DB changes in this session.

## Content facts and sharing approval

Lance explicitly approved sharing Pool Safety architecture/internals: **“we can share the architecture and all that its fine”**. This is portfolio content approval, not authorization to change security/payment systems.

Source: `public/lance-rivera-resume.pdf` in either checkout. It already includes the technical details publicly. Do not invent responsibilities, credentials, metrics or images.

- **Pool Safety Solutions — Junior Systems Engineer, Mar 2026–present, Sydney.** Productionised franchise prototype across NSW/QLD/VIC. Multi-tenant PostgreSQL + RLS; Docker with AWS Lightsail/ECR/S3/CloudFront; Lambda/SQS ingestion syncing GoHighLevel; Stripe/Xero APIs/webhooks; about 470 tests and staged CI/CD. Experience summarizes these facts. No internal screenshots used.
- **UNSW CSESoc — Marketing Subcommittee, Mar–Dec 2025.** Content for 9,000+ followers; 50,000+ cumulative views.
- **Singapore Armed Forces — Administrative Assistant, full-time National Service, Nov 2022–Nov 2024.** Coordinated VBA automation reducing processing time 90%; built Telegram bot using JavaScript/Google Apps Script. Keep “coordinated” for VBA; don't claim he authored all of it.
- **UNSW — BSc Computer Science, Feb 2022–Dec 2026.** Lance confirmed final year, walks, learning piano, aesthetic places/cafés, and aesthetics influencing Worn.

## Files / design authority

- Main next target: `src/components/Crossing.tsx`, `src/components/crossing.css`. Experience is nested after interests. Preserve biography, interests and live ground warm-up unless requested otherwise.
- Work: `Work.tsx`, `work.css`, `src/data.ts`, `PlateIndex.tsx`.
- Footer/contact: `BackCover.tsx`, `backcover.css`, `src/App.tsx`.
- Tokens/type: `src/styles/tokens.css`, `src/styles/base.css`.
- Read `DESIGN_DIRECTION.md`, `MOTION_DIRECTION.md`, latest `DECISIONS.md` D58–D60. Preserve Georgia/cream/ink/painted plate-book identity. Some examples in old direction docs are historically outdated; current code/later decisions matter.
- **Use Impeccable:** `/Users/lance/.agents/skills/impeccable/SKILL.md`. Context setup ran once this Codex session. Playbooks used: audit/harden, bolder/layout, clarify/distill, polish/craft-floor. These are skill workflows, not literal executable slash commands. Layout detector for Crossing returned `[]`; desktop/phone QA was bounded. Fresh Claude should follow its applicable setup.
- Avoid generic cards, invented visuals, extra photos, or drifting into unrelated site polish.

## Git / parallel work

All feature commits pushed to PR21:

```
4deaba3 Refine portfolio navigation, accessibility, and project layouts
b00f4af Remove the artificial sky band from the footer
8406de1 Expand About and simplify internal work presentation
12c82c2 Add editorial experience section beneath About
1f35ee3 Remove duplicated Pool Safety project plate
```

**Uncommitted in feature worktree:** `scripts/verify-scroll-math.mjs` changes only printed headings Work II/III → I/II. Appeared after last commit; not pushed. Preserve/review it, do not silently discard. No assertions changed; 42/42 still pass.

**Separate worktree:** `/Users/lance/Documents/Projects/lance-portfolio-nav`, `feat/nav-a11y`, head `d5bc69c`, clean and level with remote at handoff. Owner/scope not inspected. Don't modify/clean it up; coordinate before duplicating nav work.

Primary main was `c784335` before this handoff commit, with 9 local docs-only commits ahead and 3 merges behind. Existing unrelated files untouched:

- Modified `.claude/launch.json`.
- Untracked `.impeccable/`, `docs/daily-priorities.md`, `assets-source/IMG_7501.JPG`, `assets-source/Sandstone Pillars and Mountain Pavilion.png`.

No OpenSpec directory found. This handoff is committed locally on primary main under the docs-only exception, **not pushed**. Don't merge/deploy automatically.

## Validation / environment

- `npm run build`: TypeScript + Vite + prerender; latest implementation build passed. Two existing unresolved public-asset placeholder warnings remain. No new dependencies.
- `npm run verify`: rerun at handoff, **42 passed, 0 failed**.
- Latest CI: https://github.com/lanceriver/lance-portfolio/actions/runs/39778464201 — successful.
- Observed QA: desktop + 390px phone About/Experience, no horizontal overflow, 16px Experience text. Contact nav/phone menu/cold entry/reload all showed details. Work index has exactly Airtable I/Worn II; no PSS in Work; Fig2 remains. Real-device checks not performed.
- Smooth scrolling is asynchronous; immediate snapshots can show transitions. Don't diagnose transient positions as defects.
- Dev-only `?only=crossing` / `?only=work` isolate sections. Full page is canonical. Cold `/#about` has an existing restoration inconsistency; clicking About works. Don't expand this design task into router refactoring.
- Dev command: `npm run dev -- --host 127.0.0.1 --port 5197`. Worktree node_modules symlinks to primary dependencies.
- GitHub may default to work account; prefix gh commands with `GH_TOKEN="$(gh auth token --user lanceriver)"`, never print token.
- Local Airtable app and Postgres were stopped by previous Claude session; container/data kept, per its handoff (not rechecked here).

## How we work

Short direct replies; investigate first; read before editing. Feature branch + PR for code; separate worktrees for parallel tasks. Codex: Sol orchestrates/reviews, Luna implements; Claude follows its own applicable workflow. Temporary disabling gets a restoration TODO. Actual auth/access/secrets/payment changes require sign-off; never touch production DB. User previews in **Chrome**, not IAB. Don't push main as a side effect.

## Ephemeral artifacts

Not committed; vanish on reboot:

- `/private/tmp/portfolio-experience-desktop.jpg` — current About + plain Experience.
- `/private/tmp/portfolio-about-desktop.jpg` — before Experience.
- `/private/tmp/portfolio-footer-fixed.jpg` — footer after blue-cap fix.
- `/private/tmp/portfolio-two-plates.jpg` — two-project index.

Earlier Claude scratchpad: `/private/tmp/claude-501/-Users-lance-Documents-Projects-lance-portfolio-claude/0283ed32-7e68-4497-88f7-47dc149bbbd5/scratchpad/` (album/photo experiments, private photos). Don't copy personal photos into git. No new text-only ephemeral research needs preserving; decisions above capture findings.

## Older optional items still pending

Local main rebase/push decision; exact Shanghai bakery spelling (“Apoli Itabakery”) only if a named caption is wanted; real-phone shelf/Worn checks; other paintings/unused travel originals only at Lance's direction.

## Suggested next session

1. Read this primary handoff, enter feature worktree and check status. Preserve verification-label change and separate nav worktree.
2. Resume **text-only Experience** discussion. No option chosen. Focus on typography/hierarchy/interaction, not missing imagery.
3. Use Impeccable for the selected direction, bounded desktop/phone inspection, build/verify, update PR21, and show in Chrome.
4. Merge/deploy only when Lance asks. Don't repeat completed nav/footer/Work research.
