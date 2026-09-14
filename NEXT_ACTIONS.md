# NEXT_ACTIONS.md

> Do not inspect, read, copy from, or use any resume-frontend or previous resume-website project. The approved prototype, current brief, direction files, and Claude's new project folder are the only local design authorities.

**On resume ("Read the project state and continue"):** read `PROJECT_STATE.md` → `DECISIONS.md` → `MOTION_DIRECTION.md` → `DESIGN_DIRECTION.md`, then start at **THE EXACT NEXT ACTION** below. Do not re-plan or redo anything `PROJECT_STATE.md` marks complete unless it is recorded there as failed.

**Last checkpoint:** 2026-09-11 — review rounds 1–4 applied (letter hover D39/D40, ridge join D41, the ascent D42, flock occlusion D43, masthead rule off, post routes D44). Built clean, `npm run verify` 42/42. One phase left.

**To run:** `npm run dev` in `/Users/lance/Documents/Projects/lance-portfolio-claude` → `http://localhost:5173`
**To re-verify the scroll maths after touching any driver:** `npm run verify`

---

## THE EXACT NEXT ACTION

**Phase 8 — watch the motion in a browser that composites, then take the final art-direction pass.**

**Model:** Opus. This is aesthetic judgement, not implementation.

**Why it is still outstanding:** everything structural has been verified — build, scroll maths (23 assertions), composition, both painting joins, the Writing-stack bounds, source isolation, and a full Haiku QA pass. What has *never been observed* is the motion actually running. The browser pane in this session does not composite while being driven by tooling, so `requestAnimationFrame` and `IntersectionObserver` throttle to a standstill and every entrance looks frozen. This is an environment limit, not a defect.

**Do:** open `http://localhost:5173` in a normal browser and scroll the whole page, slowly, twice.

**Judge, in this order:**
1. **Rhythm** — MOTION_DIRECTION §4. spectacle → rest → spectacle → precision → travel → rest → tactile → controlled → cinematic. Do any two adjacent sections compete? The reader should exhale twice: after the Crossing, and at Work IV.
2. **Both joins in motion** — the hero dissolve and the back-cover feather were verified as still frames. Confirm they hold while scrolling, at several speeds, and on the way back up.
3. **Nav tone** across every ground: Hero (cream) → Crossing/Work/Notes (ink) → Writing (cream) → Back Cover (cream). The reference prototype misfired here. The probe now samples at the ink's own height, not the nav's top edge (D41) — check every join, not just the ridge.
3z. **The post page** (D44). Read one end to end at full size. Is the measure right, is the pull-quote hang doing anything, does the plate want to be larger or smaller? Then: the stack plate flying into the post's hero via `layoutId` was cut because a cross-route shared element could not be verified here — try it, it is the one piece of continuity the route costs you. Article bodies are demo copy and want replacing.
3a. **The ascent** (Field Notes → Writing, D41/D42) — the one thing on this page that has never been seen moving by anyone but Lance. Is the hold the right length? Does the range read as a landform climbing in front of the desk, or as a shape sliding over it? Does the crest sweep register at normal scroll speed? What does it do on the way back *up*? The hold is a scroll-driven transform because `position: sticky` could not be verified here (D42) — if it behaves correctly in a real browser, sticky is worth revisiting as the simpler implementation.
4. **Ground continuity** — the knocked-out panels (`.scene__caption-block`, `.rail__head`) paint `var(--page-ground)`; any seam against the body means the value stopped updating.
5. **Field Notes entrances** — six objects, six trajectories, irregular timing. If they read as one staggered group, the irregularity is not reading and the delays need re-authoring.
6. **The Writing stack** — is it fun enough that you cycle the list on purpose? That is the acceptance test, not the spec.
7. **Section individuality** — cover the content and identify each section by its motion alone.

**Opus has authority to remove technically good work that harms the experience, and should use it.**

Then the brief's final checklists: Hero · Work · Field Notes · Writing · Back Cover · source integrity (the last one is already confirmed — see `PROJECT_STATE.md`).

---

## OPTIONAL, IF THE WORK SECTION DOESN'T LAND

The Phase-2 explorations never ran — both Sonnet agents were killed by a usage limit before producing output, so there are no competing Work concepts. `DECISIONS.md` D6 fixed the four logics and they were implemented directly. If the built Work section reads weak on review, commission the two-concept exploration then; the brief for it is in this file's git history.

---

## COMPLETED PHASES — do not redo

| Phase | Owner | Outcome |
|-------|-------|---------|
| 1 · Study prototype, set direction | Opus | Five direction documents; palette sampled from the plates; both prototype transition failures diagnosed from pixel data |
| 2 · Explore Work concepts | Sonnet | **Never ran** — both agents killed by a usage limit. Skipped deliberately; see OPTIONAL above |
| 3 · Review concepts | Opus | n/a — nothing to review |
| 4 · Production implementation | Opus | All six sections built; `npm run build` clean |
| 5 · Mechanical QA | Haiku | 22 checks, 0 critical, 0 major, 2 minor |
| 6 · Technical fixes | Opus | Both minors resolved — `DECISIONS.md` D20 (override) and D21 (accepted) |
| 7 · Regression QA | — | n/a — no non-trivial fixes to regress |

Details in `PROJECT_STATE.md`. Rationale in `DECISIONS.md`.

---

## KNOWN ENVIRONMENT GOTCHAS

- **Sonnet 5 was rate-limited** (reset 2:30am Australia/Sydney). Check availability before delegating.
- **The browser pane must be *displayed* or the page does not composite.** While it is hidden, `requestAnimationFrame` and `IntersectionObserver` are throttled to a near stop, so `whileInView` entrances appear frozen and screenshots go stale. This looks exactly like an app bug and is not one. Re-display the pane with `preview_start` and use `?settled=1` to review composition.
- **Screenshots only track the viewport at `scrollY === 0`.** To inspect anything lower, set a negative `margin-top` on `<main>` (or, for a sticky scene, hide the element above it and set `position: relative` on the scene) rather than scrolling.
- Emulated viewports (`resize_window`) mis-composite `position: sticky`. Judge sticky scenes at the pane's native size.
- `scroll-behavior: smooth` breaks programmatic `window.scrollTo` — inject `html{scroll-behavior:auto!important}` first and verify `window.scrollY` landed.
- React uses delegated events: dispatching `mouseenter` does **not** reach `onMouseEnter`. Use `new MouseEvent('click', { bubbles: true })`.
- `preview_start` by launch-config **name** resolves the *original* working directory's `.claude/launch.json`, not this project's. Start Vite with `npm run dev` and open by URL.
- Writing a file switches the pane to it as a local file preview, which cannot navigate to `http://`. Open a fresh tab.
- Pillow venv for pixel sampling: `<session scratchpad>/.venv/bin/python`.
