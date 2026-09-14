# MOTION_DIRECTION.md
### The motion constitution — Lance Rivera portfolio, Claude interpretation
**Authority:** Opus 5. Binding on every implementation agent. Read alongside `DESIGN_DIRECTION.md`.
**Status:** Approved, Phase 1.

> Do not inspect, read, copy from, or use any resume-frontend or previous resume-website project. The approved prototype, current brief, direction files, and Claude's new project folder are the only local design authorities.

---

## 1. THE THESIS

> **Everything on this page is a printed object being handled.**

Plates are laid down, lifted, slid, turned and stacked. Type is impressed, masked and carried. Nothing on this site *fades in*. Things **arrive**, and arriving takes mass, direction and a settle.

The site is motion-forward. Do not default to conservative motion. But motion here is *physical*, not decorative: it exists because a printed thing was moved, not because an element became visible.

### The banned default

```
opacity: 0, translateY(20px)  →  opacity: 1, translateY(0)
```

This is forbidden as a general-purpose reveal. If you find yourself writing it a third time, the section is not designed.

---

## 2. VOCABULARY & PHYSICS

### 2.1 The four motions

Everything on this site is built from four verbs. Each has fixed physics.

**LAY DOWN** — a plate arrives on the page.
Travels in from off-axis, rotating from a larger angle to its rest angle, scaling 0.94 → 1.
Spring: `{ stiffness: 140, damping: 18, mass: 1.1 }`. Overshoots by ~2% and settles.
Duration in practice ≈ 700–900ms. **Shadow grows as it lands** — this is what sells the mass. Animate the shadow.

**LIFT** — a plate rises toward the reader.
`translateY(-10px)`, rotation → 0° (it straightens), shadow deepens and spreads.
Spring: `{ stiffness: 300, damping: 26 }`. ~260ms. Hover only, pointer-fine only.

**SLIDE** — a plate or crop moves laterally under scroll.
Linear-to-scroll (no easing — it is bound to the user's hand), with a spring smoothing pass of `{ stiffness: 90, damping: 30 }` so it has weight but never lags visibly.

**IMPRESS** — type appears.
A mask opens from the baseline upward while the line moves up ~0.14em and an over-slant settles (italic display only: 4.5° → its rest slant).
Easing: `cubic-bezier(.16, .84, .24, 1)`. 620ms, staggered 70ms per line.
This is a letterpress impression, not a fade. **Opacity does not animate** — the mask does the work.

### 2.2 Easing set

```
--ease-settle   cubic-bezier(.16, .84, .24, 1)   /* the house curve — arrivals */
--ease-exit     cubic-bezier(.55, 0, .85, .35)   /* departures — accelerate away */
--ease-lift     cubic-bezier(.34, 1.32, .48, 1)  /* small overshoot — hover */
--ease-linear   linear                            /* scroll-bound only */
```

Never `ease`, `ease-in-out`, or `linear` for anything not scroll-bound.

### 2.3 Rules of physics

- **Arrivals overshoot. Departures do not.** Things settle into place; they leave decisively.
- **Departures are faster than arrivals** — roughly 0.6×. Leaving is not a reversed arrival.
- **Rotation always resolves toward rest, never away from it.** A plate never rotates *more* as it settles.
- **Nothing translates more than 140px** on desktop, 60px on mobile. Large travel reads as cheap.
- **Scale ranges stay inside 0.92–1.06.** Anything wider reads as a zoom effect.
- **Stagger is 60–90ms** between siblings — except Field Notes, which is deliberately irregular (§3.4).
- **Shadow is part of motion.** A moving plate whose shadow is static is a sticker, not an object.

---

## 3. SECTION PERSONALITIES

Every section moves differently. This is the point. A reader should be able to identify the section with their eyes half closed.

### 3.1 HERO — *still, alive, untouchable*

The painting does not move. This is a hard constraint and it is checked at final QA.

**Forbidden:** parallaxing the mountain; moving the village, cars, road or foreground snow; animating the painted clouds; splitting the plate into pseudo-layers; scaling regions; duplicating parts; any visible seam; any `filter`.

**Permitted and approved — exactly two atmospheres:**

**Snowfall.** ~70 flakes, sizes 1.4–4.6px, `rgba(255,255,255,.9)`, falling continuously with a slight sideways drift (±55px over the fall). Varying speeds (7–16s) give depth. Randomised negative delays so the field is already full on load. Opacity envelope `0 → .7 → .5 → 0`. Restrained density — it enhances the painting, it is not a particle demo.

**Bird flock.** Approved and **not open to reinvention.**
- Shape: the way a child draws a distant bird — a shallow squashed "m". Two simple curved strokes from a centre point, plus a short tail stroke. Warm cream `#F1E8D8`. Flat, painted. Small. No drop shadow, no gradient, no glossy vector look, no anatomy.
- Formation: ~7 birds, loose, roughly stable relative offsets, high in the sky.
- Flight: **straight horizontal travel.** Constant speed. No gliding. No boids. No wandering. No arcs. No flocking algorithm.
- Wings: **continuous flapping**, never pausing. Each bird has a slightly different phase and flap speed.
- Reset: only after the **entire** flock has exited the viewport.

**Type on load:** IMPRESS, per line, 70ms stagger. Eyebrow rule draws 0 → 38px first. Scroll cue arrives last, and drifts 3px on a slow 2.4s loop.

**On scroll:** the copy fades and lifts −24px across the last 30% of the hero's scroll range. That is the only scroll response in the Hero besides the dissolve.

### 3.2 THE CROSSING — *dissolve, then silence*

**(a) The dissolve.** Scroll-linked, driven off the hero wrapper's progress, engaging only in the last ~32% of it. The foreground snow becomes the page ground `--snow-shadow`. Because both sides of the join are the same hue and near the same value, the blend is long, soft and hueless. Add ~2% film grain across the join zone only — grain kills the last trace of a gradient band.

The ground then **warms** `--snow-shadow → --snow-drift → --snow-lit` over the following ~1.5 viewport heights, scroll-linked. This is the slowest thing on the site. It must be imperceptible while happening and obvious in retrospect.

**(b) A single breath.** One short statement, IMPRESS per line, and on into the work. Nothing here overshoots; nothing here is clever. This passage is **rest** — and it is short, because the reader is waiting to see a project.

**The List of Plates overlay** (summoned from the nav) fades its ground in over 300ms while the rows arrive on a 55ms stagger — a tween, not a spring. It is a contents page, not a physical object, so it does not LAY DOWN. Hovering a row brings its numeral to full strength and nudges it 6px right.

### 3.3 SELECTED WORK — *four different scenes in one world*

The section's motion must **develop**, not repeat. Sonnet explores the choreography (Task A); the logic below is fixed by Opus.

| Plate | Logic | Motion character |
|-------|-------|------------------|
| **I — Worn** | Arrival | The most physical moment on the site. The plate LAYS DOWN large and square, shadow blooming. One clear moment of spectacle, then stops moving entirely and lets you read. |
| **II — Tableline** | Aperture | A narrow vertical `inset()` window over the plate **widens** with scroll, revealing more painting. The title sits behind and is uncovered by the widening. Type-led, mechanical, precise — no springs here. |
| **III — Fieldguide** | Horizontal | The scene pins; content travels sideways at a rate bound to scroll. Crops of one plate pass like a train window. Bounded (≤ 1.6 viewport heights of pin) and always escapable. |
| **IV — Daybook** | Rest | Near-static. A small plate LAYS DOWN gently. An enormous numeral. Nothing else moves. Deliberate quiet before Field Notes. |

**Sequence check:** spectacle → precision → travel → stillness. If any two adjacent scenes feel like the same trick, the section has failed regardless of how good each one is.

**No scene may pin for longer than 1.6 viewport heights.** Pins are sticky-based; the user never loses scroll control.

### 3.4 FIELD NOTES — *physical, playful, irregular*

The most tactile section. Motion here should feel like objects being placed on a desk by hand, out of order.

- **Entrances differ per object.** Different trajectory, different angle, different distance, different spring. No shared reveal function. Eleven objects, eleven entrances.
- **Timing is deliberately irregular.** Not `index * 70ms`. Author the delays by hand — a cluster, a gap, a late arrival. Irregularity is the design.
- **Rotation settles with overshoot.** Objects come in at a larger angle and swing past their rest angle by ~1.2° before settling.
- **Objects pass behind one another and behind the section title.** Z-order is authored, not incidental.
- **Cursor-responsive drift:** small parallax, max 10px, spring `{ stiffness: 60, damping: 22 }`, pointer-fine only. Must be barely noticeable — if the reader notices it as an effect, halve it.
- **Hover:** LIFT — straightens to 0° and rises. This is the tactile payoff; make it feel good.
- **Click:** expand from the object's own position via FLIP to a full view, and return to the same position. Never a modal that fades in from the screen centre.
- **The quote wipe** is retained as an idea: a light wipe travels across the quote once, on first entry. Once only, never on re-entry.

**HARD RULE: no atmospheric haze.** No fog, no washed overlay, no large blur, no cloudy transparency over the section. Absolute.

### 3.5 WRITING — *the stack*

The site's best interaction. Specification is fixed.

**On hover (pointer-fine) or tap:**
1. A **new plate flies onto the stack.** Never a crossfade. Never an opacity swap.
2. **Entrance direction varies by which row was chosen** — not by a parity counter. Map each row to its own vector (e.g. from upper-right, from lower-left, from the right edge, from below) so returning to a row reproduces its own gesture. This is what makes cycling feel authored rather than random.
3. Entry: from 120–150px out, rotated 6–9°, scale 0.88 → LAY DOWN spring to its rest angle (a small non-zero rotation, −1.5° to +1.5°).
4. **Impact:** the sheets already on the stack **nudge** — 2–3px translation plus ~0.4° rotation, springing back over ~380ms. Subtle. This is the detail that makes it feel like paper.
5. **Bounded to 3 sheets.** Older sheets are removed after the incoming animation completes, never mid-flight. Previous sheets must remain visible at the pile's edges.
6. **Rapid switching must stay smooth.** Interrupting an in-flight arrival must not queue, stutter, leak DOM nodes, or break z-order. Cancel and re-target.
7. The **active row responds**: its title transitions roman → italic. Not a colour change, not a highlight. *(An ochre hairline used to draw beneath it as well. Once the row became a link and grew a "Read →", that was three markers for one state, and the rule went — DECISIONS D46.)*

Target: the interaction is fun enough that a reader cycles through the list on purpose.

### 3.6 BACK COVER — *the reverse of the Hero*

`FLAT PAGE → SKY COLOUR → ACTUAL SKY → FULL COASTAL PLATE`

Scroll-linked, in one continuous movement:

1. The slate ground of Writing gives way to a **sampled sky field** — flat `#2F8CE2`, the coastal plate's exact top-row sky. Not a gradient rectangle: a colour the page becomes.
2. The coastal plate enters **scaled up (≈1.28) and centred on its pure-sky region**, so that at the moment of the join the only painted pixels on screen are `#2F8CE2` sky. CSS colour meets painted colour and the seam does not exist.
3. As scroll continues, the plate **settles uniformly to 1.0**, and the lemons, bougainvillea, coast and sea sweep in from the edges. Uniform scale — never distortion, never a split, never a crop that moves independently of the frame.
4. Type IMPRESSES over the open sea once the plate has settled past ~70%.

Grain across the join zone, as with the Hero.

**Forbidden:** visible gradient rectangles; hard image crops at the join; an obvious bridge section; a horizontal seam; any CSS-generated environmental object over the painting (**no fake sailboat** — this was tested and rejected).

The success test: **a reader cannot point to where CSS colour becomes illustrated sky.**

---

## 4. SCROLL RHYTHM

The whole-page score. Opus judges this, not individual effects.

```
HERO             ████████  spectacle     still but alive; the painting holds you
CROSSING         ▁▁▁▁      rest          dissolve, then a quiet contents page
WORK I           ███████   spectacle     the plate lays down — the big physical moment
WORK II          ████      precision     mechanical, exact, no springs
WORK III         ██████    travel        sideways; a change of axis
WORK IV          ▁▁        rest          almost nothing moves
FIELD NOTES      █████     tactile       playful, irregular, hands-on
WRITING          ███       controlled    one repeatable, delightful interaction
BACK COVER       ███████   cinematic     the world returns; long, slow, conclusive
```

Rules that follow:

- **Two excellent effects can still be wrong if they are adjacent.** Every spectacle is followed by rest.
- The reader should exhale twice: after the Crossing, and at Work IV.
- The Back Cover is the longest, slowest movement on the page. Nothing competes with it — Writing must go quiet before it starts.
- If a new effect is proposed, the question is not "is it good?" but **"what does it take space from?"**

---

## 5. PERFORMANCE

- Animate **`transform` and `opacity` only** for anything scroll-linked. Never `top`, `left`, `width`, `height`, `margin`, or `background-position`.
- `will-change` applied **only during** an animation and removed after. Never left standing on many elements.
- Scroll handlers are passive and read layout **once per frame**. No layout thrashing — batch reads, then writes.
- One shared `requestAnimationFrame` loop for snow + birds. Nothing else uses rAF. It pauses when the Hero leaves the viewport (`IntersectionObserver`) and on `visibilitychange`.
- No continuous blur. No `backdrop-filter` in a scroll-linked element. No continuously-transforming full-viewport raster image.
- Every animation registers cleanup on unmount. No orphaned listeners, no duplicate listeners, no leaked observers, no leaked DOM nodes in the Writing stack.
- Budget: **60fps at 1440p on a 2021 MacBook Air.** If an effect cannot hold that, it is cut — regardless of how good it looks.

---

## 6. MOBILE

Mobile keeps its personality. It does not become a stacked generic portfolio.

**Simplify:** very long pins (Work III becomes a vertical sequence, not a horizontal pin); extreme overlap; pointer-specific behaviour (cursor drift is removed, not approximated); large horizontal travel (reduce to ≤ 60px).

**Keep:** the Hero and both its atmospheres (snow at ~60% density, flock unchanged); every plate LAY DOWN; the Writing stack (tap-driven, and it must feel as good as hover); the numerals; the asymmetry; **both painting transitions in full** — they are the identity and they are cheap.

Touch targets ≥ 44px. Hover-only affordances always have a tap equivalent.

---

## 7. REDUCED MOTION

`prefers-reduced-motion: reduce` removes motion, **never content**.

- Snow and birds: removed entirely.
- Scroll-linked transforms: resolved to their final composed state.
- Pinned scenes: become static compositions in document order, fully legible.
- The Writing stack: still swaps, instantly, with no travel — the stack still reads as a stack; previous sheets remain.
- Both painting transitions: rendered as their final state — the plate is simply there, at scale 1, on the correct ground colour. The join must still be seamless when static.
- Hover LIFT: shadow change only, no translation.
- **Nothing that only existed as an animation may vanish.** Hierarchy, content, composition and usability are all preserved.

---

## 8. MOTION ANTI-PATTERNS

- `opacity + translateY(20px)` as a universal reveal
- Identical entrance animations on adjacent sections
- Every heading animating the same way
- Scroll-jacking; smooth-scroll libraries that take the wheel; pins the user cannot escape
- Parallax on the Hero painting (or any painting)
- Custom cursors that replace the pointer
- Preloaders with percentage counters
- Marquees that never stop
- Continuous ambient motion on content elements (things that never settle)
- Animation that fires on every scroll pass rather than on first entry
- Effects that require the reader to wait before they can read
- `transition: all`
- Springs applied to mechanical motion (Work II is deliberately unsprung)
- Nested transforms fighting each other for the same property

---

## 9. THE FINAL TEST

Motion amplifies the illustrated travel-poster identity or it is cut.

> A technically elaborate effect that damages the identity is removed.
> A simple interaction executed beautifully is better than three clever ones.

Opus has authority to remove technically good work that harms the experience, and will use it.

---

**Signed off:** Opus 5, creative director.
