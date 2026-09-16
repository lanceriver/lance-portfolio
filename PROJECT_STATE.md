# PROJECT_STATE.md

> Do not inspect, read, copy from, or use any resume-frontend or previous resume-website project. The approved prototype, current brief, direction files, and Claude's new project folder are the only local design authorities.

**Project:** Lance Rivera portfolio — independent Claude interpretation
**Location:** `/Users/lance/Documents/Projects/lance-portfolio-claude`
**Last updated:** 2026-09-16 — review rounds 1–8 applied (D27–D50); posts routed and pre-rendered, first travel photograph on the desk, ascent back on CSS sticky. Under version control on branch `turntable-prototype`; awaiting a real-browser motion pass

---

## CURRENT PHASE

**Phases 1–7 complete. Only the Phase 8 walkthrough remains, and it needs a browser that composites.**

| Phase | Owner | Status |
|-------|-------|--------|
| 1 · Study prototype, set direction | Opus | ✅ complete |
| 2 · Explore Work concepts | Sonnet | ◐ partial — both agents killed by a usage limit, but each left a working file |
| 3 · Review, KEEP/REFINE/REJECT | Opus | ✅ complete — both rejected, one detail adopted (D24–D26) |
| 4 · Production implementation | Opus (Sonnet unavailable) | ✅ complete |
| 5 · Mechanical QA | Haiku | ✅ complete — 0 critical, 0 major, 2 minor |
| 6 · Technical fixes | Opus | ✅ complete — both minors resolved (D20, D21) |
| 7 · Regression QA | — | n/a — no non-trivial fixes to regress |
| 8 · Full browser walkthrough | Opus | ⚠ blocked on environment — see below |

---

## COMPLETED — PHASE 1

- Located the authorised bundle at `~/Downloads/lance_astra_handoff_bundle/` (prototype HTML, 59 MB with embedded base64; approved alpine artwork, 1672×941).
- Confirmed the prohibited folders exist in the workspace (`resume-frontend`, `resume-frontend-new`, `resume-frontend-vite` under `resume_website`; `resume-website-v2` under `Projects`). **None opened.**
- Served the prototype on `127.0.0.1:4599` and scrolled the whole page in-browser, section by section, at nine scroll positions; exercised the Writing-stack interaction.
- Extracted the prototype's embedded images: **15 occurrences, 4 unique plates.**
- Sampled real pixel values from all four plates with Pillow → the full colour system in `DESIGN_DIRECTION.md` §2 is measured, not estimated.
- Diagnosed both transition failures from pixel data (see `DECISIONS.md` D3, D4).
- Wrote `DESIGN_DIRECTION.md`, `MOTION_DIRECTION.md`, `DECISIONS.md`, `PROJECT_STATE.md`, `NEXT_ACTIONS.md`.
- Copied the four authorised plates to `assets-source/` with `PROVENANCE.md`.

## PROTOTYPE ASSESSMENT (Opus, from in-browser study)

**Strong — preserve:**
- Hero composition. Genuinely excellent; the painting carries it.
- The plate-sheet motif (paper, caption, soft shadow) — the connective tissue between illustration and interface.
- The Writing stack: physical arrival, bounded to 3, varied direction. The best interaction present.
- Huge italic serif display type.
- Oversized ghost numerals.

**Weak — replace:**
- **Work alternates image-left/copy-right ×4.** Mechanical mirroring; exactly what the brief forbids.
- **Hero → page seam is visible** — cool painted snow `#B3C0D8` meeting warm cream `#F1EFE6` across 28vh. A hue jump, not a luminance one.
- **Back Cover transition reads as stacked CSS gradient rectangles**, with a clear horizontal seam and a haze over the incoming mountains.
- **Back Cover type repeats the Hero's treatment** (bottom-left + scrim) and its contact line is poorly legible over the bright coast.
- **Field Notes is three large rectangles on a muddy beige**, sparse rather than composed.
- **One reveal function for everything** — `settle from offset + fade`. No section has its own motion personality.
- Sticky Work scenes let two projects share the screen mid-transition; reads crowded rather than deliberate.
- Nav light/dark toggle misfires over the Writing section.
- Display face is Georgia (a system fallback), not a chosen editorial serif.

## CURRENT IMPLEMENTATION

Vite 6 + React 18 + TypeScript + `motion`, dev server on **5173**.

Built and verified in-browser:
- **Tokens + base** — sampled palette, Fraunces + Archivo, zero border-radius rule, reduced-motion base.
- **Shared scroll driver** — one rAF loop for the whole page; sections register callbacks instead of adding listeners.
- **Nav** — hairline, tone driven by `data-tone` on the section under it. No pill.
- **Hero** — static plate, snowfall (70), flock (7, straight flight, continuous flap), IMPRESS type, scroll dissolve to `#B3C0D8`. 70 flakes + 7 birds confirmed animating. Scrim reworked to a bottom-left ellipse so the painting is not dulled overall.
- **Crossing** — short now (462px). Owns the ground warm-up `#B3C0D8 → #D7DBE0 → #F0EAE0`, spread over the section plus a viewport, and the About anchor.
- **PlateIndex** — the List of Plates as a full-screen overlay opened from `Work` in the nav; rows jump to `#plate-i…iv`. Focus-trapped, Escape closes, scroll locked while open. Replaces the inline contents section (D34).
- **Work** — four scenes, four logics, all verified visually:
  I *arrival* (plate dominant, copy block hangs over its corner) · II *aperture* (a slot widens across the title, letterforms flipping ink→cream — verified at slot 41/22/9) · III *horizontal* (pinned rail of three genuinely different crops passing behind a printed head panel) · IV *rest* (small plate, enormous numeral, large silence).
- **Field Notes** — eleven objects, eleven entrances, hand-authored irregular delays; overlaps authored and measured; one large quiet region bottom-left; cursor drift on a wrapper so it never fights the entrance transform; FLIP lightbox. No haze.
- **Writing** — slate ground; plate stack with per-row entrance vectors, impact nudge, roman→italic active row with an ochre hairline. **Stack bound verified**: 9 rapid activations never exceeded 4 sheets (3 live + 1 leaving), settled to 3, z-indices strictly increasing and unique.
- **Back Cover** — bridge → feathered plate. Join verified seamless; typography recomposed bottom-left over the sea.

Plates optimised to WebP at 3 widths in `public/plates/` (12 MB PNG → 3.4 MB; hero 424 KB).

**Dev affordances** (both no-ops without the query parameter, so production is unaffected):
- `?only=<hero|crossing|work|notes|writing|contact>` renders one section at the top of the document.
- `?settled=1` resolves every arrival to its final composed state, skipping the in-view entrance — this is also how the reduced-motion end state gets checked.

Both exist because pinned, scroll-linked and in-view scenes are very hard to inspect otherwise — see the browser-pane gotchas in `NEXT_ACTIONS.md`.

## ACTIVE VARIANT

Single production implementation. The two salvaged Phase-2 explorations were reviewed and rejected (D24, D25); they remain in `explorations/` as a record, and are not wired into the app.

## FILES CREATED (all inside the new project)

```
lance-portfolio-claude/
  .claude/launch.json          dev-server config (proto-study :4599, dev :5173)
  DESIGN_DIRECTION.md          visual constitution
  MOTION_DIRECTION.md          motion constitution
  DECISIONS.md                 approved choices + immutable rules
  PROJECT_STATE.md             this file
  NEXT_ACTIONS.md              resume instructions
  assets-source/
    alpine-village.png         Plate I  — Hero
    coastal-road.png           Plate II — Back Cover
    lake-terrace.png           Plate III
    hill-path.png              Plate IV
    PROVENANCE.md
```

**Files modified outside this folder: none.**
The session working directory was moved to this folder so no other project is touched.

## VERIFICATION STATUS

**Verified:**
- `npm run build` clean — 92.9 kB gzipped JS, 6.8 kB gzipped CSS, 393 modules.
- **All 23 scroll-math assertions pass** — `node scripts/verify-scroll-math.mjs` exercises the exact formulas every driver uses, against the real measured page geometry. Written because the browser here cannot observe scroll-linked values (see below).
- Static audit: every plate path resolves; every nav anchor has a matching section id; no prohibited-source reference anywhere in `src/`, `public/` or `index.html`; `data-tone` present on all six sections.
- Writing stack bound, exercised live: 9 rapid activations never exceeded 4 sheets, settled to 3, z-indices unique and strictly increasing.
- Both painting joins inspected visually and are seamless.
- Source integrity: nothing outside this folder modified; the handoff bundle is untouched; `resume_website`'s git status is identical to the session-start snapshot.

**NOT verifiable in this environment — needs a real browser:**
The browser pane does not composite while being driven by tooling, so `requestAnimationFrame` and `IntersectionObserver` are throttled to a standstill. Entrance animations, the scroll rhythm end-to-end, and live nav-tone switching therefore could not be watched. The underlying maths is unit-tested and the CSS/JS was reviewed by hand, but **the motion itself still wants one pass in a normal browser.**

## OUTSTANDING WORK

Phases 5–8: Haiku QA (running), fixes, regression, and an Opus walkthrough in a browser that composites. See `NEXT_ACTIONS.md`.

## KNOWN BUGS

- None outstanding. Console clean.
- **Fixed during the build:** reduced motion left `--page-ground` at its cool starting value for the entire page (the driver that warms it is disabled), so Work and Field Notes would have sat on cold lavender — the Crossing now paints a static shadow→lit gradient and resolves the ground on mount. The Hero's eyebrow rule animated a registered custom property through a specificity contest — replaced with a `scaleX` on the pseudo-element. The Writing stack was unbounded (8 sheets after 4 activations, repeating z-indices) because it relied on `AnimatePresence` exits completing; it is now bounded explicitly on a timer with z from a monotonic uid. Back Cover copy wrapped to four lines because `ch` on the container resolved against the 17px body font, not the display size.
- Environment (not the app): the browser pane's screenshot region does not track the viewport on this page, and emulated viewports mis-composite `position: sticky`. Verify numerically and use `?only=` for visual checks.

Carried forward as things to avoid, observed in the reference prototype: nav light/dark misfire over Writing; Writing stack clipped by the shell edge; two Work scenes visible simultaneously mid-transition.

## AGENTS USED

| Phase | Model | Task |
|-------|-------|------|
| 1 | Opus 5 | Prototype study, pixel sampling, direction documents |
| 2 | Sonnet 5 ×2 | Work exploration + wild-card — both killed by rate limit before output (D15) |
| 4 | Opus 5 | Transition proofs, scaffold, and all six sections |
| 5 | Haiku | Mechanical QA — 22 checks, 2 minor findings |
| 6 | Opus 5 | Reviewed QA, overrode one finding (D20), accepted the other (D21) |
| 3 (late) | Opus 5 | Reviewed the salvaged explorations — both rejected, two-line plate caption adopted (D24–D26) |

## ENVIRONMENT NOTES

- Reference prototype served from `~/Downloads/lance_astra_handoff_bundle` on port **4599** (`python3 -m http.server`). Read-only; restart if the browser cannot reach it.
- Pillow is installed in a venv at the session scratchpad for pixel sampling.
- The prototype HTML is 59 MB. Strip base64 before reading it as text.
