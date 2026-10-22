# DECISIONS.md
### Opus-approved choices, rejections, and immutable rules
Append-only log. Newest phase at the bottom. Nothing here is reopened without Opus.

> Do not inspect, read, copy from, or use any resume-frontend or previous resume-website project. The approved prototype, current brief, direction files, and Claude's new project folder are the only local design authorities.

---

## PHASE 1 — Opus, direction set

### D1 · Isolation
New project lives at `/Users/lance/Documents/Projects/lance-portfolio-claude`, a **sibling** of the existing work — deliberately outside the `resume_website` git repository so it cannot contaminate its git status or be confused for the existing prototype.

**Read-only reference:** `~/Downloads/lance_astra_handoff_bundle/`. Never written to.
**Forbidden, never opened:** `resume-frontend`, `resume-frontend-new`, `resume-frontend-vite`, `resume-website-v2`.

### D2 · The organising conceit — THE PLATE BOOK
The site is an illustrated plate book: paintings presented as numbered plates with printed captions, opened by a List of Plates.

**Why:** it gives a legitimate, non-kitsch reason for paper sheets, captions, Roman numerals and a typographic contents page, in an *editorial* register. It also explains why the illustrations are destinations rather than product screenshots.

**Rejected alternative:** the "travelling notebook" metaphor — already rejected by Lance for being too literal. All of its devices are banned: notebook paper, stitching, stamps, stickers, tape, torn edges, handwriting fonts, passports, boarding passes, dotted-route maps.

### D3 · The page does not start cream — it starts as snow in shadow
**Sampled fact:** the alpine painting's exact last pixel row is `#B3C0D8` — a cool blue-grey. The reference prototype's page ground was warm cream `#F1EFE6`.

That temperature jump, forced across 28vh, is the *cause* of the visible seam in the prototype's hero transition. Luminance blended; hue did not.

**Decision:** the ground immediately below the Hero is `#B3C0D8`, and warms to `--snow-lit #F0EAE0` over the following ~1.5 viewport heights. Snow in shadow is blue; snow in sun is cream. Both are true, and the page travels between them.

This is the single most important technical decision in the project and it is not negotiable.

### D4 · The Back Cover join is solved by scale, not by gradient
**Sampled fact:** the coastal plate's top row in the open-sky window (x 0.42–0.62) is `#2F8CE2`. Across the full width it averages `#4085B7` only because lemons occupy the top-left and bougainvillea the top-right. The brief's earlier estimates `#438DDD` / `#468FE0` are **too pale and too desaturated** — correctly flagged as untrustworthy, and now confirmed wrong.

**Decision:** the plate enters **scaled up (~1.28) and centred on its pure-sky region**, settling uniformly to 1.0. At the join, only pure sky is visible, so CSS `#2F8CE2` meets painted `#2F8CE2` and no seam can exist. The lemons and bougainvillea sweep in from the edges as it settles.

Uniform scale is not distortion. This replaces the prototype's stacked-gradient approach, which reads unmistakably as CSS rectangles.

### D5 · Hero — immutable
Composition preserved from the approved prototype. The painting is **static**: no parallax, no movement of mountain, village, cars, road or foreground snow, no animation of the painted clouds, no layer splitting, no region scaling, no duplication, no seams, no filters.

Exactly two atmospheres, both approved and **not open to reinvention**: **snowfall** and **one simple bird flock** (child's-drawing shallow "m", cream, flat, small, high, straight horizontal flight, continuous flapping, no gliding, no boids, no arcs, reset only after the whole flock exits).

**No CTA pills** — tested and rejected. The Hero has no button. Initial view is completely clean; the snow transition appears only on scroll.

### D6 · Work — four scenes, four logics
The reference prototype's Work section alternates image-left/copy-right ×4. Verified in-browser. This mechanical mirroring is its principal weakness and is **forbidden**.

Approved logics, one per plate — **spectacle → precision → travel → rest**:

| I Worn | arrival — the plate lays down large; copy is a caption, not a column |
| II Tableline | aperture — a vertical crop widens, uncovering the title behind it |
| III Fieldguide | horizontal — the scene pins and content travels sideways |
| IV Daybook | rest — small plate, enormous space, enormous numeral |

The choreography within each is open to Sonnet exploration; the logics are fixed.

### D7 · The List of Plates and the numeral handoff
A typographic contents page sits between the Hero and Work — a quiet moment after spectacle. As the reader scrolls, each line departs but **its Roman numeral stays and hands off to that project's scene**, implemented as a genuine shared position.

This is the site's spatial spine and its clearest original idea. Roman numerals (I–IV), never "01" — a plate book sets Roman; a CMS sets Arabic.

### D8 · Typography
**Fraunces** (variable, italic, `opsz`/`wght`/`SOFT`) for display; **Archivo** (variable, `wdth`) for support.
`WONK` ≤ 0.3 at display scale, 0 elsewhere — charming in small doses, a costume above that.
Preserves the approved "huge italic editorial serif" idea while replacing the Georgia system fallback with a real editorial face.
**Inter is not the display face** (per Lance's standing feedback on the stock dev-portfolio look).

### D9 · Zero border radius, site-wide
Absolute. Printed paper is not rounded. Applies to plates, nav, inputs, focus rings, hover states, everything. One of the highest-leverage anti-generic decisions available.

### D10 · Back Cover composition differs from the Hero
The Hero sets type bottom-left over dark buildings behind a scrim. The Back Cover sets type **left-of-centre over the open sea** (`#3B8AD1`, a large calm field) in cream, **with no scrim at all**.

**Why:** the prototype gives both paintings the same treatment, so they repeat instead of rhyme — and its contact copy is genuinely hard to read against the bright coast. Scrimmed vs. unscrimmed, bottom vs. centre, is what makes them a matched pair rather than a duplicate.

**No fake sailboat** — tested and rejected. No CSS-generated environmental object over any illustration, ever.

### D11 · Field Notes
Ground is `--snow-lit`, not a separate beige — the prototype's `#f1eadc` reads muddy, and "beige for the sake of beige" is banned.
**No atmospheric haze. Absolute.** No fog, washed overlay, large blur, or cloudy transparency over the section.
Six objects, six genuinely different entrances, hand-authored irregular timing. Not masonry, not a dashboard, not a card grid.

### D12 · Writing
Structure kept (sticky plate stack + article list) — it is the strongest interaction in the prototype and Lance likes it. Verified working in-browser: bounded to 3 sheets, physical arrival.

**Improvements approved:** entrance direction mapped **per row** rather than by a parity counter, so each row reproduces its own gesture; existing sheets **nudge on impact**; the stack gets real margin (the prototype clips it against the shell edge); the active row goes roman → italic behind a mask rather than merely brightening.

**Never a crossfade.**

### D13 · Stack
**Vite + React + TypeScript + `motion` (Motion for React v11+).**
Transform/opacity only for scroll-linked work; `clip-path`/`inset()` for apertures; CSS `position: sticky` for pins (never JS scroll hijacking); one shared rAF loop for snow + birds and nothing else.

### D14 · Content honesty
**Worn** is the only real project ("your fit diary"). Tableline, Fieldguide and Daybook are demo copy and must read as such.
Safe identity copy only: Lance Rivera / Software Engineer / Sydney.
**No invented** employers, clients, awards, revenue, user counts, performance claims, job titles or academic honours.

---

## IMMUTABLE RULES — checked at final QA

1. The alpine painting never moves, never distorts, never filters, never splits.
2. Snowfall and the bird flock are the only Hero atmospheres. The flock's approved behaviour is not reinvented.
3. No CTA pills. No floating pill nav.
4. No border radius anywhere.
5. No haze over Field Notes.
6. No fake sailboat; no CSS objects over any illustration.
7. The Writing stack never crossfades and never exceeds 3 sheets.
8. Both painting joins are seamless — no gradient rectangle, no hard crop, no horizontal seam.
9. `prefers-reduced-motion` removes motion, never content.
10. Nothing outside `/Users/lance/Documents/Projects/lance-portfolio-claude` is modified.
11. No `resume-frontend*` / `resume-website*` file is ever read, copied or referenced.

---

## PHASE 2 — blocked, and a decision revised

### D15 · Sonnet delegation blocked by usage limits (2026-09-11)
Both Phase-2 Sonnet agents (Work exploration, wild-card) were terminated by the API before producing output:
`session limit · resets 2:30am (Australia/Sydney)` (HTTP 429, `claude-sonnet-5`).

**Decision:** Opus proceeds with implementation directly rather than blocking. Delegation is retried for later phases (QA in particular, where Haiku may still be available). This deviates from the model-efficiency rule only because the cheaper model is unavailable, and the deviation is recorded here so a future session does not re-derive it.

**Consequence for Phase 2:** the Work section's two-concept exploration did not happen. Opus resolves the Work choreography directly from the logics already fixed in D6, which were specific enough to implement without an exploration round.

### D16 · REVISION of D4 — the Back Cover join uses scale, never opacity
D4 originally proposed the coastal plate materialising by **opacity crossfade** over a matched ground, plus a scale settle.

**Tested it. The opacity component is wrong and is withdrawn.** At partial opacity over the azure ground the painting reads as a blue-washed, veiled version of itself — visually identical to the "haze over the artwork" look that was already rejected, and a violation of our own image-treatment law (partial opacity over a coloured ground *is* a filter).

**Revised mechanism — the plate is at `opacity: 1` at all times:**

1. The bridge above the plate is a single smooth gradient ending on **exactly `#2F8CE2`** — the plate's own sampled top row. One easing, no intermediate stops, no second overlay. (The reference prototype used `#438DDD` — too pale — stacked *three* stops, and laid a 90° dark gradient over the top. That is why it banded.)
2. The plate scales `1.14 → 1.0` with **`transform-origin: center top`.** This is the key: with a top origin, the image's row 0 stays pinned to the frame's top edge at every scale, so the join colour is *mathematically* `#2F8CE2` throughout the settle. A centre origin would pull lighter sky (`#61A7E1` at y≈0.13) up to the join and break the match.
3. Grain over the join zone only.

The plate is never faded, never filtered, never distorted. The settle is a genuine cinematic move that cannot break the seam.

### D18 · SUPERSEDES D16 — the Back Cover join is a feathered top edge
D16's scale-based join was tested and **fails on an empirical fact about the artwork**: the coastal plate has **no full-width band of pure sky at any height.** The lemon branch reaches its top-left and the bougainvillea its top-right. Any hard horizontal join is therefore visible by construction, at any scale.

Also tested and rejected along the way:
- **Uniform opacity crossfade** — veils the whole painting; reads as the rejected haze (this was D16's own finding).
- **Magnified sky** (`scale 2.2`, `origin center top`) — at 2.2× the frame still shows mountains and the hillside town; isolating the pure-sky band would need ≈8× upscale. Dead.
- **Sampled flat `#2F8CE2` meeting the plate's top row** — the join line is plainly visible because that row contains lemons and bougainvillea, not sky.

**The approved mechanism — a feathered top edge over flat sampled sky:**

1. The page ground above the plate is flat **`#2F8CE2`** — the plate's own sampled sky. One colour, no gradient stack, no dark overlay.
2. The plate is at **`opacity: 1`** and carries a `mask-image` feather on its **top edge only**:
   `linear-gradient(to bottom, transparent 0, rgba(0,0,0,.35) 12vh, #000 22vh)`
3. Feather depth is **scroll-linked, 22vh → 0**, resolving to nothing as the plate's top edge leaves the viewport. The settled painting is never veiled.
4. A gentle uniform settle, **scale 1.06 → 1.00** (inside the stated scale range), plus grain over the join zone.

**Why it works, verified in browser:** where the plate's top edge is sky, feathered sky over identical sky is invisible. Where it is lemons or bougainvillea, the feather reads as *sunlight and atmosphere on the branch* rather than as transparency — the artwork gains depth instead of losing integrity. No band, no rectangle, no seam.

### D17 · CONFIRMED — the hero dissolve (D3) works
Built and inspected. The painted street dissolves into flat `#B3C0D8` with **no visible band at any point in the fade.** Matching hue across the join is confirmed as the fix.

**One refinement directed:** the mid-fade zone currently veils the cars and street for too long, which edges toward fog. The opacity ramp should stay lower for longer and resolve to solid faster in the final quarter — more painting stays readable, and the veiled band is shorter.

---

## PHASE 5 — Haiku QA, and two Opus overrides

### D19 · QA outcome
Haiku ran the mechanical pass: **0 critical, 0 major, 2 minor.** All 22 checks otherwise clean — source restriction, dead code, CSS conflicts, event/observer/timer cleanup, asset paths, anchors, border-radius, reduced-motion coverage, file scope, console, horizontal overflow at 1440/1024/768/375, text clipping, Writing-stack bounds, and every immutable rule.

Independently spot-checked rather than taken at face value: the "no unused CSS" claim holds (the only apparent hits are SVG namespace URLs inside data-URIs and the dynamically composed `nav--${tone}` classes), and the stack-bound result matches Opus's own measurement.

### D20 · OVERRIDE — the Writing stack images stay `alt=""`
Haiku changed the stack images from `alt=""` to real alt text and marked it fixed. **Reverted.**

The pile sits inside `<div className="stack" aria-hidden="true">`, so the alt text is unreachable by definition — the "fix" was inert. More importantly the stack is a *decorative duplicate*: the article list beside it already carries every title and standfirst. Announcing three painting descriptions that repeat the list is noise, not information. `aria-hidden` + `alt=""` is the correct pattern here, and the code now carries a comment saying so, so a later pass does not "fix" it again.

### D21 · ACCEPTED — the flock's two creams are now tokens
Haiku flagged the bird tail stroke `#eadfce` as a hard-coded colour outside the token set. The two-cream treatment is deliberate — the tail must read as a separate stroke from the wings — but the rule in `DESIGN_DIRECTION.md` §2.3 was nonetheless being broken. Both values are now tokens (`--bird-mark`, `--bird-tail`), which makes the rule true rather than approximately true.

### D22 · Reduced motion had a real palette bug, now fixed
With motion reduced the Crossing's scroll driver never runs, so `--page-ground` stayed at its cool starting value for the entire page — Work and Field Notes would have sat on cold lavender instead of warm snow. The Crossing now paints a static `snow-shadow → snow-drift → snow-lit` gradient and resolves the ground on mount, so both the hero join and the warm-up survive with no animation. This is exactly the failure mode the brief warns about: reduced motion must remove motion, never content or composition.

### D23 · The scroll maths is unit-tested
`npm run verify` (`scripts/verify-scroll-math.mjs`) exercises the exact formulas every driver uses against the real measured page geometry — 23 assertions covering the hero dissolve, the ground warm-up, the aperture slot, the rail travel and the back-cover join. It exists because the browser in this environment cannot observe scroll-linked values at all (see the gotchas in `NEXT_ACTIONS.md`), and it should be re-run after any change to a driver.

---

## PHASE 3 (late) — Opus reviews the salvaged explorations

The two Phase-2 Sonnet agents were killed by a usage limit, but both had written partial output before dying. Found at the end of the build and reviewed properly rather than left unopened.

### D24 · REJECT — the wildcard "tissue guard"
`explorations/wildcard/index.html` — a glassine leaf printed with the plate's caption, covering the painting until scroll lifts it away. The concept is on-brand and the opening typography is good.

**Rejected on three grounds:**
1. **It desaturates the artwork.** The plate sits under a warm veil at roughly a quarter strength for a whole scroll beat. That is the thing `DESIGN_DIRECTION.md` §3.1 forbids outright — the paintings are the identity, and a full-plate scrim by default degrades it. In practice it reads as the rejected haze.
2. **The reveal is a wipe, not a lift.** A real glassine leaf hinges and peels; this slides a hard vertical edge across. The physicality that justified the idea never arrives.
3. **It competes.** The page already has three physical-paper moments — Work I's plate laying down, Field Notes' objects landing, and the Writing stack. A fourth flattens the rhythm. `MOTION_DIRECTION.md` §4: the question is not "is it good?" but "what does it take space from?" — and the answer is Work I, the section's designated spectacle. It also restates Work II's aperture (a vertical edge crossing a plate) less well, because there the *type* participates.

### D25 · REJECT — Work Concept A
`explorations/work-concept-a/index.html`, "Four Plates, Four Pauses". Its section opening is redundant — an eyebrow reading `SELECTED WORK` above a heading reading `Selected Work`, with no supporting line. Its strongest idea, a triptych splitting the Fieldguide plate across three panels, is a static restatement of the travelling rail already built for Work III, so it adds no new idea.

### D26 · ADOPT — the two-line plate caption
The one thing worth keeping from either exploration. The plate number set in condensed caps above an italic descriptor, instead of a single italic line with a middot:

```
PLATE I
The coast road, late morning
```

This is how an illustrated travel book actually sets a plate caption, and it reads better at the sheet's foot. Adopted for the full Work plates (`PlateCaption` in `Work.tsx`, `.plate-cap` in `base.css`). Field Notes captions stay single-line — they are notes, not plates.

---

## PHASE 8 — Lance's review, first round

Three observations from a real browser, all acted on.

### D27 · Field Notes — the standfirst was drawing over the type specimen
The section head sits at `z-index: 10` so that objects pass *behind* the title. That is right for the display title and wrong for the body copy: the standfirst was overlapping the ochre `Aa / Rivera` card.

**Fixed** by narrowing the head's second column, capping the standfirst at 30ch, and dropping the specimen to `top: 11%`. There is now 179px of clearance. The *title*-over-print overlap is deliberate and was restored afterwards — the display type still clips the first plate; only the body copy was ever the accident.

### D28 · Field Notes — the left half was bare
Opus had reasoned that one large quiet region bottom-left was correct composition. **Lance disagreed on sight, and he is right** — at full size it reads as an unfinished layout rather than as rest.

**Two objects added**, in the same register, with their own entrance vectors and hand-authored delays:
- **`detail`** — a narrow crop of the coastal plate's harbour, lower-left. A third painting fragment, so the left half carries imagery too.
- **`colophon`** — a slate-ink card, bottom-left: *"Set in Fraunces and Archivo. The plates are painted, not photographed — every colour on this site was lifted out of one of them."* True, on-concept, and its dark value anchors the corner while quietly foreshadowing the slate Writing section that follows.

The surface grew to 132vh / 1320px to hold eight objects without crowding. `DESIGN_DIRECTION.md` §6.4 and `MOTION_DIRECTION.md` §3.4 updated from six to eight.

### D29 · The Back Cover's abrupt two-tone step — cause found and removed
Lance saw a hard horizontal edge between two blues above the coastal plate.

**Cause: Opus's own nav scrim.** `.cover__scene::before` laid `rgba(8,26,44,.30)` over the top 22vh of the scene for nav legibility. The bridge above it carried no such scrim, so the two met as a flat 30% step — `#2F8CE2` against roughly `#236AAB`. The feathered join itself was never the problem; the fix for a different problem created this one.

**Fixed:**
1. The scrim is gone. Nav legibility over a painting now comes from the type — `.nav--light` carries a text-shadow — which cannot introduce an edge anywhere.
2. The grain layer was ending dead at its own height; it now carries a mask and fades out.
3. The bridge lengthened 76vh → 96vh with two extra stops, so the slate→azure move is gentler on its own terms.

**Lesson worth keeping:** a legibility fix applied to a *section* will collide with any transition crossing that section's boundary. Fix legibility on the element that needs it.

### D30 · Field Notes is dense, not sparse — the section's own rule
Lance, on a second look: still too sparse, pack it in. Correct, and it forces a rule worth writing down.

**Field Notes is the one section that inverts the site's negative-space law.** Everywhere else, space is the design. Here the surface has to read as a *full desk* — things overlapping things — and the quiet belongs in the narrow gutters, not in open regions. An open region on a desk reads as an unfinished layout.

**Now eleven objects** on a surface shortened to 108vh / 1075px:
- added **`band`** — a wide panoramic letterbox crop of the alpine plate. Also the only object with a landscape-strip silhouette, which breaks up an otherwise rectangular set.
- added **`glyph`** — a small stone card carrying a single oversized italic ampersand.
- added **`slip`** — a caption slip in the plate-book voice: *"Kept because the blue was right."* Lands last, at 1.04s.

**Measured, not eyeballed:** a 10×10 occupancy grid over the surface. Before: 86/100 cells filled, with a dead bottom row and an empty bottom-right corner. After rebalancing the bottom band and shortening the surface: **94/100**, no horizontal overflow, and the remaining gaps are corner slivers.

Keep the grid check when touching this section — the eye is a poor judge of density at a scaled preview, and it misled Opus twice here.

### D31 · The nav hairline does not cross a painting
Lance: the white line under the nav over the hero has to go.

The hairline is an editorial device — a rule under a masthead, sitting on paper. That reading only holds on a printed ground. Over a full-bleed plate it stops being a rule and becomes a line drawn across someone's artwork, which is the same class of error as a scrim over a plate.

**Implemented as a property of the section, not of the nav's tone.** Tone alone was the wrong key: it marks cream-on-dark, which covers the Hero and Back Cover (paintings) *and* Writing (a solid slate ground, where a cream rule is perfectly legitimate). Sections carrying a plate now declare `data-rule="off"`, and the nav reads it alongside `data-tone`.

Result: no rule over the Hero or the Back Cover; the ink rule stays over the snow page, and the cream rule stays over Writing.

### D32 · The aperture's two title copies were resolving against different boxes
Lance: the Tableline text is not aligned.

A real bug, and a subtle one. The scene draws the title twice — once in ink on the page, once in cream inside the slot over the plate — and the illusion only works if the two register to the pixel.

The slot was `position: absolute; inset: 12% 0`, so the lit copy's `top: 57%` resolved against a box 76% of the aperture's height, while the ink copy's `top: 57%` resolved against the full height. The two never lined up; the gap was ~1.7% of the scene height plus whatever the clip contributed.

**Fixed** by giving the slot `inset: 0` — an identical box to `.aperture` — and moving the vertical inset into the clip-path: `clip-path: inset(12% calc(var(--slot) * 1%))`. Same visual crop, but both copies now resolve against the same containing block. Measured after: `dx: 0, dy: 0`.

**Rule for anything built this way:** two elements that must register exactly have to share a containing block. Do not position them inside boxes that differ by an inset, however small.

### D33 · The Field Notes title clears the first print
The deliberate title-clips-the-plate overlap (restored in D27) was still too much. Dropped the whole surface rather than moving one object, so the packed grid is unaffected: `margin-top` from `clamp(-44px, -3.5vh, -24px)` to `clamp(18px, 2.6vh, 36px)`.

Measured after: title clears the print by 29px, body copy clears the specimen by 105px, and occupancy holds at **94/100** — the density from D30 survives the change.

### D34 · The List of Plates is summoned, not scrolled past
Lance: not sure we need this — I want people to see the projects and the motion immediately; could it be an overlay you click to jump to a project?

**Researched the patterns first.** Three are established for this problem: a persistent sticky index rail in the margin ([Bryce Jones](https://www.awwwards.com/inspiration/sticky-column-scroll-bryce-jones-portfolio), [Appello](https://www.awwwards.com/inspiration/sticky-scroll-navigation-appello)); a full-screen overlay summoned from a trigger, which [is the pattern for sites with a handful of destinations and a visual narrative](https://www.onething.design/post/top-website-navigation-design-patterns); and the inline index we had.

**The sticky rail is wrong for this site.** It is a permanent piece of UI chrome on a page whose whole thesis is that the interface is the paper the paintings are printed on. It would be the first thing on the site that looks like an app.

**The overlay is right, and it fits the conceit better than the inline version did.** A plate book's contents page is something you *turn to*, not something you wade through. Implemented as `PlateIndex`, opened from **`Work`** in the nav — no sixth nav item, and the index is more use at that spot than a jump to a section heading would be. Each row jumps to its plate; the Work scenes carry `id="plate-i"` … `plate-iv`.

**The Crossing survives, much shorter.** It could not be deleted: it owns the ground warm-up that makes the hero dissolve work (D3), and it is the About anchor. It now carries one statement and nothing else — 1076px → 462px.

**Measured:** screens of scroll before the first project, **3.73 → 2.68**. The hero also came down 178vh → 158vh; the dissolve still completes at 88% of its travel, well before the pin releases.

**One consequence worth noting:** with the section that short, tying the ground warm-up to its own height would have made the colour shift visible, against D3's intent. The warm-up now spans the section *plus a viewport*, so it stays the slowest thing on the site while the section itself stays brief.

**A real robustness fix fell out of testing it.** The jump first deferred through `requestAnimationFrame`, and the overlay's scroll lock was still in place when it fired — so the page never moved. It now releases the lock explicitly and defers with `setTimeout`, because rAF is throttled to a standstill in a hidden or backgrounded tab and would strand the reader on a closing overlay that went nowhere.

Accessibility: `role="dialog"`, `aria-modal`, focus moved in and trapped, Escape closes, focus restored to the trigger, background scroll locked while open.

### D35 · Work IV was static, not quiet — fixed
Lance: Daybook is completely static with no motion, why?

**Working exactly as designed, and the design was wrong.** D6 made scene IV the *rest* beat — spectacle → precision → travel → rest — and I implemented that as a single one-shot entrance spring and nothing else. The other three scenes run on continuous scroll-linked motion for as long as you are inside them. Scene IV therefore read as a page that had stopped, not one holding its breath, and the entrance was subtle enough (y 40, 1.6°, scale .97) that you could scroll straight past without seeing it fire at all.

**Quiet is not the same as dead.** The rest beat should be the slowest thing in the section, not the absence of motion.

**Now:** the numeral, the plate and the copy each drift vertically at a different rate for the whole time the scene is in view — 130px, 62px and 26px of total travel respectively, the numeral slowest and furthest. Nothing overshoots, nothing is sprung, nothing competes; the differential rates are what make it read as depth rather than as a parallax effect. The scene also gained `min-height: 118vh` to give the drift room, which suits this beat anyway.

The drift sits on a wrapper and the LAY DOWN arrival stays on the sheet, so the two transforms never fight for the same property — the same separation used for the cursor drift in Field Notes.

Six assertions added to `npm run verify` covering the travel distances and their ordering. One of them failed first time and **the test was wrong, not the code** — it parameterised the scroll range from the section's top rather than from a viewport below it.

### D36 · SUPERSEDES D8 — the typefaces are the prototype's
Lance: use the fonts from the approved prototype.

D8 had chosen **Fraunces + Archivo**, reasoning that Georgia was a system fallback rather than a chosen face. That reasoning was mine, not the brief's, and it changed something Lance had already signed off. His call stands.

**Read from the prototype, not from memory:** it declares exactly two stacks and loads **no webfont at all** —
- `Georgia, "Times New Roman", serif` for everything display
- `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for support, which resolves to the system UI face wherever Inter is not installed.

Both adopted verbatim. The Google Fonts link is gone — no network dependency, no FOUT, no first-paint layout shift.

**What the swap dragged with it:**
- All 36 `font-variation-settings` declarations removed. Georgia has no axes; they were inert.
- Weights 200/300 normalised to 400. Georgia has regular and bold only, so those were silently rendering as regular anyway.
- The display scale retuned to the prototype's own Georgia proportions: hero `clamp(80px,10vw,150px)/.79` at `-.07em`, section headings `clamp(70px,9vw,132px)/.84` at `-.06em`.
- **Project names given their own smaller scale**, `clamp(46px,6vw,90px)/.92` — the prototype does this too. Georgia is wider than the face the layout was first drawn in, and at section-heading size "Fieldguide" overflowed the rail head by 86px and "Daybook" its column by 33px. The rail head also widened `31ch → 34ch`.
- Three pieces of copy named the old fonts — the type specimen, the ampersand card and the colophon. All now name Georgia. A type specimen that lies about its own face is worse than no specimen.

**Verified:** a sweep over every leaf text node across the whole page reports **0 text overflows** and no horizontal page overflow, at 1280 and 1032 wide. Console clean.

### D37 · The masthead frames the page, not the content column
Lance: the LR is in a weird spot, get it closer to the left.

The nav was constrained to `--shell` — `min(1440px, …)`, centred. On a viewport wider than 1440 that stranded `LR` at `(vw − 1440) / 2` from the edge: 280px on a 2000px screen, floating in the middle of nowhere.

**Fixed:** the nav spans the page at `calc(100% - 2 * clamp(20px, 4vw, 72px))`. Below 1440 it lands on exactly the same margin as the content (verified: both at 51px on a 1280 viewport). Above it, the masthead keeps hugging the edge while the content stays in its centred column — which is how a masthead is supposed to behave.

### D38 · Legibility belongs to the type, not to a scrim over the painting
Lance: the darkening is too much and detracts from the image — reduce it but keep the headline readable.

He is right, and it is the third time this lesson has come up on this project (the back-cover scrim in D29, the nav hairline in D31). **Dimming the artwork to prop up the type is the lazy solution every time.** The paintings are the identity; the type should carry its own legibility.

**The scrim came down by roughly a third** — core `.76 → .50`, and it falls off faster (clear by 79% instead of 82%). The top pass for the nav went `.30 → .15`.

**The type took over, graded by size — this is the part that matters:**
- **Display** (`.hero__copy`): a wide soft bloom, `0 2px 28px` at .55 plus a tight `0 1px 4px`. Large letterforms need separation from the ground, not an outline.
- **Lede** (~21px): in between — `0 1px 3px` at .7 plus `0 0 18px` at .5.
- **Meta** (11.5px caps, scroll cue): a genuine dense outline — `0 1px 2px` at .95, `0 0 7px` at .88, `0 0 22px` at .55.

A 28px bloom does nothing for 11px caps, and an outline that dense on a 150px headline would look like a sticker. Same problem, three different answers.

**Verified at 1:1** (the pane renders at 62% otherwise, which is useless for judging 11px text): every piece of hero copy is legible, and the left-hand façades have their colour back.

### D39 · The name responds to the pointer, letter by letter
Lance pointed at [zainabkabira.com](https://zainabkabira.com) — he likes the way "Designer who Codes" changes colour and pops on hover — and asked for it on his name in a complementary colour.

**Read the reference rather than guessing at it.** Its mechanism is three things:
```css
.h-letter        { display:inline-block; transform-origin:50% 100%;
                   transition: transform .4s cubic-bezier(.34,1.56,.64,1), color .25s; }
.h-line:hover .h-letter { will-change: transform; }
.h-letter:hover  { transform: translateY(-.16em) rotate(-7deg); color:#F4D24A; }
```
The two ideas worth taking are **the baseline pivot** (`transform-origin: 50% 100%`, so a letter tips rather than slides) and **a back-out curve** for the pop. Taken. The rest is ours — the brief says use references for their level of craft, not to clone them.

**What we did differently, and why:**

- **Rotation direction.** The reference rotates −7° on upright type. Ours is Georgia *italic*, already leaning ~12°, so a negative rotation reads as the letter **standing up as it lifts**. That is deliberate: it is the same "lift and straighten" gesture the plates use on hover in Field Notes, so one idea about being touched runs through the whole site.
- **Neighbour falloff.** The two adjacent letters follow at roughly a third of the distance and a blended colour. Without it a word reads as a row of independent buttons; with it, it reads as one physical object. CSS-only — `+` for the next letter and `:has(+ .hero__letter:hover)` for the previous one.
- **The colour is `#DCAE4D`**, the brighter of the two ochres in the brief's approved palette and the natural complement to the cobalt sky. Not sampled from a reference; it was already ours.
- **Our own easing.** `--ease-lift`, `cubic-bezier(.34, 1.32, .48, 1)` — the house hover curve, slightly gentler than the reference's 1.56.

**Applied to the name only.** It is the signature moment; putting it on every heading would spend it.

**Accessibility:** the visible letters are `aria-hidden`, with the real "Lance Rivera" in a visually-hidden span so nothing is announced character by character. Pointer-fine only. Under reduced motion the colour still responds and nothing moves. `will-change` is scoped to a hovered line, never left standing on eleven elements.

**One bug caught in the process:** the visually-hidden span was first placed *before* the two lines, which shifted the `:nth-child` indices the IMPRESS entrance animations key off — "Rivera" silently stopped animating and stayed hidden below its mask. It now sits last. Position-dependent selectors and inserted markup are a bad pair.

**Verified live** with a real cursor: hovered letter resolves to exactly `rgb(220,174,77)`, both neighbours to the blended tint, every other letter untouched.

## D40 — the hover lift gets headroom by moving the mask, not by removing it
*2026-09-11 · Opus*

Lance: "the L, R and i are cutoff at their top positions when hovering over them."

Real bug. `display-i` sets `line-height: .79`, well under Georgia's 1.136 content
height, so each `.line`'s box top sits only ~6.6px above the cap line at 128px.
The IMPRESS mask is `overflow: hidden` on that box. A letter lifting `.15em`
(22.2px) therefore lost about 15px of its head — which is exactly the three
tallest glyphs in the name: L, R, and the dot of the i.

**Rejected: clip only the bottom edge.** `clip-path: inset(-50% -6% 0 -6%)`
looked like the elegant answer — the entrance only ever needs the bottom masked.
It fixed the clipping and broke something worse. With the top open, each line's
hover targets sit ~22px *above* their glyph boxes (the negative half-leading),
so line two's targets reach up over the bottom of line one: hovering the foot of
the "L" lifted the "R". Measured with a real cursor, not inferred —
`elementFromPoint` gave contradictory answers in the tooling browser and was not
trustworthy here.

**Kept: `overflow: hidden`, box raised, content unmoved.** `padding-top: .26em`
with `margin-top: -.26em` lifts the clip edge 33px while the composition stays
pixel-identical (eyebrow bottom 273.2, lede top 542.8, letter boxes 291.2 and
400.0 — all unchanged before and after). The headroom makes line two's box
overlap line one's glyphs, so line one takes `position: relative; z-index: 1`.

Verified with a real cursor at 1280×720: hit boundary falls at css y 392–400,
exactly the gap between the two letter boxes — 387 → "L", 395 → neither,
408 → "R". Lifted letters clear the mask by 10–13px of box, ~17–20px of ink.

The general lesson, third time on this site: `overflow: hidden` is never only a
visual mask. It bounds hit testing too, and here that was the half of its job
worth keeping.

## D41 — Field Notes → Writing joins along a ridgeline
*2026-09-11 · Opus*

Lance sent a screen recording of zainabkabira.com and asked for its
section-to-section colour transition, specifically for *Things worth coming
back to* → *Notes from the margins*.

**What the reference actually does.** Its cream contact section and its green
testimonial section meet along a soft, hand-drawn hill silhouette rather than a
straight line, and the lower field occludes the cards of the section above it.
At the page foot the same device returns as black soil with a thin cream
highlight along its crest and illustrated flowers growing up across it. The idea
worth taking is the *organic silhouette join*, not the garden.

**Why it belongs here.** This was already the worst cut on the page: snow-lit
`#F0EAE0` meets `--slate-deep #2A5F86` on a straight horizontal edge with
nothing in between. Both painting joins had been solved from pixel data
(D3/D17, D18); this one had never been solved at all.

**The adaptation.** A ridgeline, not a hill. Three reasons it is not a copy:

- A soft organic wave here would read as a **torn paper edge** — an explicit
  anti-pattern (DESIGN_DIRECTION §7, Metaphor). Facets and hard breaks in slope
  read as rock. The shape had to change to survive our own rules.
- The page opens on a *painted* alpine range. Bringing it back near the end as a
  flat two-colour graphic makes the two read as one object seen twice —
  DESIGN_DIRECTION §8.2 — where a rolling hill would have been an import.
- The reference's join is inert; ours moves. The **landform is still** (a
  mountain that drifts is a mountain nobody believes) and instead a band of
  snow-lit crest travels the ridge as the join crosses the viewport, driven off
  the shared scroll driver. That is the page's own logic: from D3 onward, the
  thing that moves on this site is the light.

The crest began as a 3px hairline and was invisible; at 11px it reads as snow
lying on the ridge instead of an outline drawn around a shape. It is stroked and
then clipped to the mass so only the inside half survives.

**The shape is constrained by the nav, and this is the interesting part.** The
nav is fixed and takes its tone from the section *box* beneath it, so it holds
dark ink for the whole crossing until the flat slate base finally arrives. The
first profile put a broad summit directly under the links: **127px of scroll
with dark ink on dark slate**, measured. Confining the relief to x 120–1000 and
running the range out onto a valley floor at both edges — which is the Hero's
geography anyway — brought it to 64px.

**That exposed a pre-existing bug.** 64px was still too much, and the reason was
not the ridge: the nav probes at `y = 8` while its ink sits at `y ≈ 49–61`, so
the tone flipped ~50px of scroll *after* the new section had already arrived
behind the type. Every join on the page had this. Probing at the ink's own
height instead takes the ridge crossing to **24px** — better than the 53px the
straight cut it replaced was already costing.

Measured after the change: lowest Field Notes object clears the highest peak by
113px; no object is occluded; the SVG base overlaps the section by 1px so no
subpixel hairline can open; `npm run verify` 30/30.

Reduced motion parks the light across the main peak and nothing moves.

## D42 — the ascent: Field Notes is covered, not scrolled past
*2026-09-11 · Opus*

Lance, on the ridge as first built: *"i want the page to stop here, and then the
mountain thingy goes up the screen and covers those photos such that it
transitions to the next section, this matches the behaviour of the screen
recording. why didnt u replicate this behaviour?"*

He is right, and the failure is recorded plainly because it is the instructive
part: I **did** see the occlusion in the reference — it is written down in my own
first pass ("the cards get occluded by the cream") — and then set it aside as
scope creep, on the grounds that moving Field Notes' objects would disturb a
composition that had been measured to a 90% occupancy target. That reasoning
protected the wrong thing. The occlusion was not decoration on top of the join;
it **was** the join. Stepping the reference video frame by frame settles it: over
0.9s the testimonial cards do not move a pixel while the cream field climbs and
cuts them mid-sentence. The section is held and covered. I built the silhouette
and skipped the mechanism, which left a decorated border.

**What it does now.** Field Notes stops when its foot reaches the bottom of the
viewport and holds for one viewport plus 40px, while the Writing section — ridge
first — climbs the full height of the screen and covers it. Measured against the
real page at 1280×800: the foot sits at y=800 for the whole 840px hold (one
value, not a range), the ridge crest travels 654 → −186, and the release happens
at −40, behind a section that is already solid, so nothing can be seen to snap.

**Why it is a transform and not `position: sticky`.** Sticky is the obvious tool
and would have been one line. It is also the one thing this environment cannot
verify: the pane does not recompute sticky offsets while being driven, and the
evidence was actively misleading — the Hero's existing sticky reported correct
pinning while a synthetic control built beside it, and every variation of the
real markup, reported none. Three plausible causes were investigated and
discarded (`overflow: clip` on the body, boxes taller than the scrollport,
padding vs. height on the containing block) before the pattern — that *nothing*
newly inserted ever sticks — showed the instrument was at fault, not the markup.

So the hold uses the scroll driver the rest of the site already runs on. That is
not a workaround for its own sake: it makes the behaviour arithmetic, and
arithmetic can be proved in Node without a browser. `npm run verify` now carries
twelve assertions for the ascent — the foot holds 1:1, the cover completes
before the release, the slack is spent covered, and the released section only
ever leaves upward. 42 assertions total, all passing.

The cost is honest: with JavaScript off there is no hold, and the join degrades
to the plain ridge. Reduced motion takes that same path deliberately — a reader
who asked for less motion should not have a section pinned under them.

**Consequence for the lightbox.** Transforming the section makes it a stacking
context, which would have trapped the expanded-plate overlay inside it and let
the rising slate paint straight over it. The overlay now renders outside
`.notes`, in the wrapper. That bug would not have appeared until someone
expanded a plate at exactly the wrong scroll position.

## D43 — the flock passes behind the village
*2026-09-11 · Opus*

Lance: *"the birds should disappear behind the house lol right now theyre flying
over them which isnt realistic."*

Correct, and it was never considered — the flock was built as a layer over the
whole plate because the plate is one flat image.

**Does this break D5?** D5 forbids layer splitting, parallax and seams on the
Hero painting. This does none of them: the painting is still a single static
image, drawn once, untransformed. What changes is only *where the birds are
permitted to be drawn*. The constraint protects the artwork from being taken
apart; masking something else against its silhouette leaves it intact.

**The mask is derived from the painting, not traced.** Same method as the colour
system (D2): read the pixels rather than guess. Sky and snow are background —
a distant bird may fly in front of either. Everything else is built fabric.

The rule that matters is the second one. A first pass took the topmost non-sky
pixel per column and produced a horizon that spiked into the mountain face,
because dark rock reads exactly like a dark roof; birds would have flickered in
and out across the peaks. Keeping only fabric **8-connected to the left or right
edge of the frame** fixes it: the village fills both margins from roofline to
street, while the rock is an island in the snow and reaches no edge. Connecting
to the *bottom* edge — the obvious choice — does not work, because the ground
plane is snow, which is background.

The result reads correctly at both ends: birds pass in front of the mountains,
as a distant bird does, and behind the roofs, the conifers and the church spire,
as a distant bird also does.

**One trap worth recording.** The first mask was written as greyscale and masked
nothing — CSS `mask-image` defaults to `mask-mode: match-source`, so it reads
the *alpha* channel, and a greyscale PNG has none and is uniformly opaque. The
coverage is carried in alpha instead. It fails silently and looks exactly like a
mask that was never applied.

`cover / center` matches `.hero__plate`, so the two crop identically at every
aspect ratio. 17 KB. `scripts/make-skyline-mask.py` regenerates it byte for byte
if the plate is ever re-exported. Snowfall is deliberately unmasked — snow does
fall in front of buildings.

### D43a — snow on a roof belongs to the roof

Lance, on the first version: *"the birds should dissappear at the white part of
the house (the snow) right now they only disappear when they reach the brown
wood bit."*

The same collision one level down: snow lying on a roof is pixel-identical to
snow lying on a mountain, so the rule that protects the peaks was cutting the
horizon at the wood beneath each cap. Colour cannot separate the two — but what
sits *underneath* can. From the top of the built fabric the column climbs: if it
reaches open sky within a roof's depth, that snow was a cap and the horizon
moves to the top of it; if it does not, the column is looking at a mountain face
standing behind the village and the horizon stays put. It takes the whole cap or
none of it, because a truncated climb would cut into the peaks — the exact thing
the connectivity rule exists to prevent.

Two bugs in that, worth recording because the first hid the second:

1. The depth guard was written `(top - y) <= CAP` while the climb *decreases*
   `top`, so the term was always negative and the guard never bit.
2. More interesting: the climb tested against the same loose "blue" predicate
   the ground classes use, which is deliberately wide enough to swallow snow in
   blue shadow. The underside of a roof's cap is precisely that colour —
   `(154,183,228)` — so every climb stopped on its first pixel and nothing moved.
   Sky is the only blue in this painting with almost no red in it: every flavour
   of snow keeps `r` above 145, open sky sits below 110. The climb uses that.

Verified per column against the plate: on all four sampled columns of the
right-hand building the mask now cuts within 0px of where open sky ends, and the
mountain columns are correctly left alone (the climb exceeds a roof's depth and
declines to extend).

## D44 — Writing posts are routes, pre-rendered one file each
*2026-09-11 · Opus*

Lance asked whether a post should be a full page or a modal, then chose
pre-rendered files over an SPA fallback for deployment.

**Route, and the deciding argument was already on the page.** The Writing
section's own standfirst reads *"The only part of this book that leaves the
one-page world."* A modal makes that line untrue, and it is a line doing
structural work — it is what earns Writing its status as the one section with an
exit. Beyond that: the overlay idiom is already spent twice here, on the Field
Notes lightbox and the List of Plates, and both are momentary — look, dismiss.
A long read in the same container flattens a distinction that is working.
A post nobody can link to is also not much of a post.

**No router dependency.** Two URL shapes, `/` and `/writing/<slug>/`, so about
forty lines over the History API. This project runs on three runtime
dependencies; adding a router for two routes would have been out of character.

**Pre-rendered, not an SPA fallback.** Link-preview crawlers — Slack, iMessage,
LinkedIn — do not run JavaScript. Under a fallback rewrite they fetch a post URL,
receive the home page's shell, and every piece shared shows the same title and
description. `scripts/prerender.mjs` emits `dist/writing/<slug>/index.html` with
its own title, description, canonical and og tags. The body is still the empty
root div — this is not server rendering — so the app boots and routes exactly as
before, but a crawler reads the right head and every static host serves it with
no configuration. `SITE_URL` at build time makes the canonical and og:image
absolute. The script transpiles `src/data.ts` through esbuild and imports it, so
the metadata cannot drift from a copy.

**Rows stay links, and the stack survives.** A row is a real `<a>` so cmd-click,
middle-click and crawlers all work. But on a touch device tapping is also the
only way to fly a plate onto the pile, and the pile is the best thing on the
page — so with a fine pointer hover loads the plate and the click opens the
post, while with a coarse one the first tap loads and the second opens. The
"Read" affordance is tied to the active row rather than to hover, because
without a pointer the active row is the one a second tap will open.

**The scroll-restoration bug, which is the part worth remembering.** Returning
from a post dropped the reader thousands of pixels from where they left. The
cause was not the restore, it was the *capture*: reading `scrollY` in a layout
effect on the route change reads it after React has committed the new tree, by
which point the old page is unmounted, the document has collapsed — measured,
15764px to 2460px — and the browser has already clamped the scroll to fit.
A reader 12177px down was recorded at 1560. The offset has to be stamped onto
the history entry at navigation time, before anything unmounts. It belongs there
anyway: it is a property of the entry, and it survives further navigation and a
reload. Restoring then takes a retry loop that recomputes its target each
attempt, because a freshly mounted page is briefly too short to scroll to and a
target measured off a half-built layout is as wrong as a clamped scroll.
Verified: 12177 → 0 → 12177, drift 0.

**What was cut.** I had argued for the route partly on the grounds that the
stack plate could fly into the post's hero image via `layoutId`, the same
shared-element device the Field Notes lightbox already uses. It is not in this
build. Across a full route swap the source element's measured rect and the
scroll reset land in the same frame, and getting that wrong looks broken rather
than absent — and this session cannot watch an animation run to find out. The
post has its own quiet entrance instead, and the shared element is recorded in
NEXT_ACTIONS for someone with a browser that composites.

Motion on the post is deliberately near-absent: the plate lifts, the head
arrives, the body never animates. MOTION_DIRECTION §8 forbids effects that make
a reader wait, and an article is nothing but reading.

All four article bodies are demo copy. They set type honestly — measure, pull
quotes, subheads — and invent no clients, employers, metrics or credentials.

## D45 — one Link, after shipping two
*2026-09-11 · Opus*

Lance, on being told the duplication existed rather than seeing it fixed:
*"you need to follow software engineering principles like DRY, YAGNI etc."*

Fair. D44 shipped the same eight lines twice — the modifier-key test,
`preventDefault`, `navigate` — once inside `Post.tsx` and again as `onRowClick`
in `Writing.tsx`. I then identified it correctly while arguing against adding
`react-router` for it, and left it in place. Naming a defect is not the same as
removing one, and the argument for hand-rolling forty lines only holds if those
forty lines are actually kept clean.

`components/Link.tsx` is now the single implementation. Four call sites use it.
The one genuine variation — an article row whose click has a second job on a
touch device — is a `shouldNavigate` predicate rather than a second component,
and it has exactly one caller, which is what keeps it on the right side of
YAGNI: it exists to delete a duplicate, not to anticipate one.

Verified across all three branches after the change: plain click opens the post
and restores scroll on return (12177 → 0 → 12177, drift 0.5px); a modifier
click is left entirely to the browser; and with a coarse pointer the first tap
activates the row without navigating while the second opens it.

Bundle unchanged at 98.6 kB gzipped — for reference, `react-router-dom` 7.18.3
measured at **+14.7 kB gzipped** on this build, which is what made the fifteen
lines here worth writing instead.

## D46 — the ochre rule goes, and the post gets a reading measure
*2026-09-11 · Opus*

Lance: *"i dont like the orange line below the blog titles, also in the blog page
itself — the body text only takes up half the page?"*

**The rule.** Two things had accumulated on one state. MOTION_DIRECTION §3.5
specified roman → italic *and* a drawn hairline, written before the row became a
link; D44 then added "Read →" to the active row because a touch device needs a
visible second-tap target. Three markers for one piece of information. The
italic is the change of voice and "Read" is the call to action; the rule was the
one carrying nothing the others weren't. Spec updated rather than quietly
contradicted.

**The measure — and the complaint was right for a reason I had wrong.** Measured
at 1440: the column was 735px carrying **87-89 characters a line**, in 1325px of
page. So the text was not too narrow, it was too *long*-lined and too small, and
the page around it was too wide. Both were mine.

`66ch` looked like a safe number and is not: `ch` is the width of a zero, which
in Georgia is far wider than the average letter, so `66ch` bought 89 characters.
53ch now measures at **75**, inside the 60-75 band. Body size went 18 → 21px.

The page itself now uses a narrower shell — `min(1040px, …)` rather than the
book's 1440 — because a reading page is not a scene. The column is 65% of its
page instead of 55% of a much wider one, and the right margin reads as a margin
rather than as a layout that ran out.

**Same `ch` trap, second time.** The pull quote specified `34ch` and rendered at
355px, because the display size sat on the paragraph inside it while the width
sat on the blockquote — so `ch` resolved against an inherited 17px. This is D19
again in a different component. The size now lives on the element that measures
itself: 569px, 34-43 characters a line. Rule worth keeping: **if a width is in
`ch`, check which font-size that element is actually running at.**

## D47 — the article row stops resizing under the cursor
*2026-09-11 · Opus*

Lance: *"for this particular entry, hovering over it wraps the thing onto a new
line?"*

Real, and reproduced before anything was changed. Georgia's italic runs 11–21px
wider than its roman for these four titles, so at some column widths the roman
fits on one line and the italic does not. The active row goes roman → italic, so
hovering grew the title a line and shoved the rest of the list down — content
moving under the pointer that is pointing at it. Measured at a 560px viewport:
the first title, 28px tall at rest, 56px on hover.

Finding it took a sweep rather than a guess. It does not reproduce at most
widths — 860, 1000, 1150, 1300, 1450, 1540, 1600, 1750 are all clean — because
the failure needs the available width to fall in a ~10px band between the two
measurements. Lance's screenshot showed full-width rules and no plate beside
them, which placed him in the single-column layout, and the band there is
V ∈ [584, 594) for the first title and [556, 563) for the second.

**The fix is to stop the box depending on the style.** A copy of the title, set
in the italic and hidden, is stacked in the same grid cell as the real text, so
the cell is always as tall as the hovered state — in both states, at every
width, and for any string. It is content-independent, which matters here because
the titles are explicitly placeholder and will all change.

**A second problem the fix created.** Reserving only what each title needs left
one row carrying a blank line while its neighbours had none, which reads as a
spacing bug rather than as reserved space. A `min-height` of two lines makes
every title block the same height. That one is rhythm, not correctness — the two
rules are doing different jobs and the comments say so.

Verified across 560 / 588 / 900 / 1300 / 1440: zero height change on every row
in both states, and at 1440 all four title blocks measure 81px.

## D49 — the palette is derived, not chosen
*2026-09-14 · Opus*

Lance is replacing the demo prints with photographs from his own travels, and
asked what else would personalise the desk. The first answer was the object
already sitting there: the swatch strip says *"Sampled from the plates"* and
*"Every colour on this site was lifted from a painting."* That was true, and it
was done by eye. Once the prints are his photographs it has to be true again,
and by then nobody will remember which seven colours were picked or why.

`scripts/sample-palette.py` derives them. Quantise, then select by coverage with
a perceptual-distance floor in Lab, so the strip gets the colours the image is
made of rather than seven versions of the same blue. Two things make the output
worth reading rather than just correct:

- **Share is re-attributed.** Every quantiser bucket is assigned to its nearest
  pick, so the percentage reported is the proportion of the image a swatch
  actually speaks for. The raw bucket count answers a question nobody asked —
  it read 2-4% per swatch when the honest figures are 4-25%.
- **Names come from the site's own vocabulary.** Where a sampled colour is
  within ΔE 14 of an existing token it is called by that token's name; only a
  genuinely new colour gets a generated description. The first pass generated
  three swatches called "Mid Azure", which is no use as a label.

Run against the alpine plate it returns snow-lit, snow shadow, ochre, cobalt,
slate, umber, terracotta — the hand-authored list, rediscovered. So D2's claim
now has a measurement behind it instead of a memory.

The last column reports the nearest existing token, which is informative and
nothing more.

**Correction, same day.** I wrote here that agreement with the painted palette
was "the question to ask of every photograph that goes on the desk", and then
started applying it — reading a photograph Lance liked and advising against it
on the grounds that its greens and greys did not match the paintings. He stopped
that: *"why does it matter whether the pics match the colours, the point is that
i want it to have my favourite pictures from my trips."*

He is right, and the error is worth recording because it is a specific way to be
wrong: I built a measuring tool and then let it start making decisions. The
swatch strip is **derived**. It describes whatever is on the desk; it does not
get a vote on what goes there. Field Notes is the personal section, the pictures
are the point, and the only thing that follows from a change of pictures is that
the strip is re-run.

The site's own tokens are unaffected — those are chosen, they are used for type,
rules, the ridge and the slate ground, and no photograph touches them.

Two bugs of mine, both caught by reading the output rather than the code: a
format string that passed a tuple where three integers were wanted, and tone
buckets taken from HSV *value* instead of Lab lightness — by which measure a
saturated cobalt is "pale", which is both wrong and useless on a swatch.

`swatches` moved to `data.ts` with the rest of the content, so replacing it when
the photographs arrive is a one-file edit.

## D50 — the ascent goes back to `position: sticky`
*2026-09-16 · Opus*

Lance: *"the page is glitching and jerking back and forth even when i scroll
slowly."* Then, after a round of optimisation: *"its still jerky."*

The second message is the important one, because the first sent me the wrong way.

**What I did first, and why it was not enough.** Reading the scroll loop turned
up three real defects and I fixed all of them: the driver's own comment claimed
reads and writes were batched and they were not, so eight callbacks each
measured and then drew in sequence and the browser was forced to lay the page
out again up to eight times a frame — with `elementsFromPoint` running fifth,
after four writes. Field Notes was transformed every frame with no compositor
layer, because I had removed `will-change` reasoning that a permanent layer for
a section that size was too much texture to hold, which was true and still the
wrong conclusion. And the ascent stored full precision while applying
`toFixed(1)`, so its "unchanged, skip" test never fired and it rewrote the
transform every frame while sitting perfectly still.

All three were worth fixing. None of them was the cause.

**The actual cause is the approach.** Scrolling is handled on the compositor
thread. A transform computed from the scroll position is applied on the main
thread, a frame later. So the held section lags the page by one frame and
jitters against everything around it — on every scroll, at every speed, no
matter how cheap the callback is. Making the work smaller cannot fix a
synchronisation problem; it only makes a late frame slightly less late.

`position: sticky` is resolved by the compositor and has nothing to lag.

**Which is what D42 chose against, for a reason that has now expired.** The
transform was picked because sticky could not be verified in the tooling
browser, which does not recompute sticky offsets while being driven — every
reading of it, including a synthetic control built next to the real thing, was
indistinguishable from broken. D42's own note said to revisit it if a real
browser proved otherwise. A real browser has now proved otherwise, twice, in
the form of Lance scrolling the page.

The travel comes from a spacer inside the wrapper rather than padding on it,
because a sticky box may be shifted only as far as its containing block allows
and that is the CONTENT box — the detail that made the first sticky attempt look
like it had failed on its own terms.

Measured after: spacer 940px at a 900px viewport, Writing's margin `-940px`
cancelling it exactly, Writing still sitting at Field Notes' foot, so layout and
document height are unchanged. The FieldNotes driver is deleted, which also
takes one callback out of the scroll loop.

Whether it is smooth is still Lance's call — this environment cannot run the
thing it is being asked to judge, which is the entire reason this took three
attempts.

**Two more of mine, worth naming.** The token that carries the ascent distance
silently failed to apply: I asserted on every other edit in that change and not
that one, so the replacement matched nothing and said nothing. Assert on every
edit, not most of them.

And then I shipped a version that did not pin at all. *"you got rid of the whole
animation bro."*

`bottom: 0` is the obvious way to say "hold when the foot reaches the floor",
and it does nothing for a box taller than the viewport — a sticky box is never
shifted by a bottom inset in that case. Field Notes is ~1900px against a ~780px
viewport. Expressed as `top: viewportHeight - ownHeight` it holds perfectly:
measured, the foot sits at the viewport floor for all 821px of the ascent while
the ridge climbs 663 → -158, then releases.

The failure is not that I got the inset wrong; it is what I checked before
committing. I verified that the section computed as `position: sticky`, that the
spacer supplied 940px of travel, that Writing's negative margin cancelled it to
the pixel, and that the document had not grown — every precondition, all green,
and not once did I ask whether the foot actually stayed where it was supposed
to. Preconditions are not the behaviour. The one assertion worth making was the
one the reader would notice.

## D51 — The placeholder prints become real photographs

Two of the desk's four prints were crops of the site's own paintings, standing in
until Lance had travel photographs to put there: `hill-path` captioned "A
different cover", and `coastal-road` captioned "Detail — the harbour". He said
at the time that they would be replaced with photographs from his trips.

Two arrived — Xi'an (17 May 2026) and Furong Ancient Town after dark (22 May
2026), same trip as the Zhangjiajie print already on the desk. The Furong
caption first shipped as the province, "Hunan", because guessing a town name
under someone's own photograph is not a guess worth making; Lance named it. They take those
two slots rather than being added beside them. The desk was already carrying
twelve objects and a density re-tune was outstanding; fourteen would have made
that worse, and the plate crops were the placeholders by Lance's own account.

The `band` stays painted. It is the one print that ties the desk back to the
hero's alpine street, and a desk of nothing but photographs loses the argument
the colophon is making about the paintings.

Slots renamed with the contents — `obj--path` → `obj--night`, `obj--detail` →
`obj--army` — because a class called `path` pointing at a night townscape is the
kind of drift nobody notices until it misleads someone. The `detail` crop was
retuned from `22% 72%` (framing a harbour wall) to `38% 42%`, which holds the
massed ranks and leaves a little pit wall for context.

The colophon needed a word changed. "The plates are painted, not photographed"
was true of a desk with one photograph on it and reads as a contradiction on a
desk with three. It is now "The plates are painted; the photographs are mine."
The colour claim is untouched and still exact: every token is sampled from the
four paintings, and the photographs contribute none.

**Known and accepted:** at rest the colophon covers the Xi'an caption almost
entirely (182 of 192px). This is the pile behaving as designed — hovering the
print lifts it and the caption is readable, which is the same bargain the
Zhangjiajie print already makes with the quote card. The photograph itself is
never covered, only its date. Two objects want the same 200×60 patch of desk and
there is no free space to move either into; that is the density pass that has
been outstanding since the twelfth object, not a defect of this change.


## D52: Real content replaces demo content

The Work section now presents three real projects: Pool Safety Solutions, Airtable Clone, and Worn. The horizontal rail scene has been removed. Writing contains two real posts, with their source prose retained. Contact links point to Lance's real email, GitHub, LinkedIn, and résumé. The résumé PDF has its phone number removed by redaction. The colophon no longer claims the plates are painted; it makes no claim about how they were made.

The Work section employer project description stays at résumé level. It includes no code, screenshots, client names, or security-incident wording.

## D53 — The phone gets a contents page, not a hamburger

Lance, on his phone: he could pinch out and scroll the page sideways, only `Work`
showed in the nav, and his name sat too low. One cause behind the first two, and
two smaller ones behind the rest.

**The sideways scroll.** Field Notes objects and the first Writing sheet sit at
their entrance offsets until they arrive — up to 168px — so at first layout the
type specimen and the stack's top sheet hung 110–130px past the right edge of a
390px screen. iOS Safari sizes the page to whatever is on it at first layout, so
the page became ~510px wide, and the fixed nav stretched with it, which is what
pushed `Writing` and `Contact` off screen. `overflow-x: clip` on `body` did not
stop it: Safari still lets a reader pinch out to the content. Fixed at both
ends: entrance travel on a phone is clamped to the 60px MOTION_DIRECTION §2
always allowed, and `.notes` and `.writing` clip horizontally below 900px.
`clip`, not `hidden`, so neither becomes a scroll container and both sticky
holds are untouched. Measured: 390px wide at first layout and at every 300px
of scroll, down from 501.

**The nav.** Five words do not fit beside `LR` at 390px, and two of them had
simply been hidden. Below 720px the row gives way to a menu mark, which opens the List of Plates overlay with the rest of the book beneath it: the
chapters (About, Notes, Writing, Contact), then the address and links. The mark is a
hamburger drawn as two hairlines — the eyebrow's rule, the lower one shorter
and hung right — so it is the pattern a reader recognises in the site's own
line. It was briefly the word `Contents`; Lance preferred the icon, and it is
announced as "Menu". It reuses D34's overlay rather than adding a drawer, so the
phone's menu is the book's own front matter. Desktop is unchanged: `Work` still
opens the plates alone.

The nav also tucks away while a phone reader scrolls down and returns the moment
they scroll up. Without a ground behind it (§6.7 rules out pill, glass and blob,
and D38 rules out a scrim) its ink sat on top of every heading it passed. Tucking
removes the collision instead of covering it. It never tucks while it holds
keyboard focus (`:focus-visible`, not `:focus-within`, or the button that
closed the Contents page would hold it down for good).

**The hero on a phone.** `100vh` on iOS Safari is the screen with the toolbars
collapsed, so with them showing the hero's foot — and the name anchored to it —
sat under the toolbar. The hero is `100svh` below 900px, the copy anchors at
`21svh` from the foot instead of `12vh`, and the name scales to `min(27vw, 128px)`
so it fills the measure instead of half of it. The scrim's core follows it up.
This moves §6.1's "bottom-left" up to the lower-middle on phones only.

**The back cover on a phone.** It crops to the middle of the plate — village,
beach, boats — and the open sea the copy was composed over is not in frame. The
copy moves up into the sky, and its small lines take the Hero eyebrow's tight
halo rather than a scrim.

**Touch targets.** Everything tappable on a phone is now at least 44px
(MOTION_DIRECTION §6), grown invisibly around the word where the word itself is
small, so nothing moves.

## D54 — Worn shows the app, and loses its plate

Worn was the most interesting project on the page and the only one with nothing
to look at: a painting, two sentences and "In progress". It now shows three real
screens from Lance's phone — the wardrobe, the outfit builder's "built for
tonight", and the numbers — and three points on what it does.

**No plate.** The first pass kept Plate III and set the screens beneath it at
236px. Lance found them too small and the painting redundant, and he is right:
Worn is the one project with a product to show, so the product is the picture.
§1 still holds for the other two scenes, where the paintings are destinations.
The `hill-path` plate files stay in `public/plates/` for later use; nothing
references them.

**Figures.** A plate book prints its photographs as numbered figures on the
same stock, so the screens are `Fig. 1–3` with a plate-cap caption, on the paper
sheet, square to the page like every Work plate (§5: a collage tilts, a Work
scene does not).

**Composition.** The copy is a band, not a tower: introduction left, the three
points and status right, bottom-aligned. Beneath it the figures run from the
copy's margin to the shell's edge at up to 340px, staggered. On desktop they
keep their staggered entrance and drift at three depths with the numeral and
copy. On a phone the copy stacks and the figures become a row you swipe, bled
to the screen edges, each snapping to the margin with the next one showing at
the edge. Every figure is visible and stationary from the first layout; the
row scrolls, and the page does not widen.

**The images.** Cropped below the iOS status bar, the app's own tab bar kept.
WebP at 480w and 960w, 20–66KB each, lazy loaded. The lookbook screen was left
out on purpose: it is a mirror photo of Lance in his room, and that is his call
to publish, not a default.

**The points** are written from the app's own spec, and are careful about one
thing: they say the garments are cut out *on the phone*, not that nothing ever
leaves it, because the opt-in cloud restore can send a cutout to the backend.

## D55 — Safari's toolbars take the root ground

Lance, on iOS Safari: the address bar and bottom toolbar stayed blue down the
whole cream page. Safari 26 ignores `theme-color`. Per the developers who have
reverse-engineered it (nothing from Apple), it tints both bars from fixed or
sticky elements at the viewport edges that carry a background colour — read
even at `opacity: 0` — and otherwise from the root (`html`/`body`) background.
`html` had none; only `body` was cream, so Safari fell back to sampling the
top of the page at load, which is the hero's blue sky.

**First attempt, reverted.** Two 3px fixed strips at the edges, coloured by
section. They did not drive the tint — community reports put the working
height nearer 11–12px — and they showed as visible bands. Lance: "ugly".
Anything thin and fixed at the edge is either too small to count or big
enough to see; the approach was wrong, not the numbers.

**What stands.** `html` carries the page ground explicitly — the same value as
`body`, so nothing on screen changes; only the overscroll and the bars see it.
And no fixed or sticky box has a ground of its own: the hero's cobalt lives on
`.hero__plate` (it only ever showed before the image loads), the back cover's
azure on `.cover` beneath its sticky scene. At rest the page has no coloured
fixed or sticky element at all; the contents page and the lightbox are mounted
only while open, and tinting the bars to match them is right.

**Cream everywhere, guaranteed.** Lance chose one colour for the bars, the
page's cream, over the hero sky and the slate Writing section included. A
root ground alone leaves Safari free to sample the top of the page at load.
So two fixed bands, 12px, at the top and bottom edges, carry `--snow-lit` at
`opacity: 0`: Safari is reported to read a fixed element's background even
when it is invisible, and nothing else can see them. They sit in
`index.html`, outside React, so the post pages carry them too. Measured: the
page renders the same with them and without (a maximum difference of 1/255
on a few pixels, from compositing), and hit-testing passes straight through.
If a future Safari stops reading invisible elements, the root ground is
still cream underneath.

## D56 — Field Notes is a personal photo pile

The twelve travel photographs are the desk's main content; the desk grew
taller to hold a second band of prints. At Lance's direction,
the painted band, swatches, type specimens, ampersand and caption slip have been
removed; the colophon and turntable remain. This supersedes D51's choice to keep
the painted band as an anchor.

The desktop arranges the photographs in a centered, overlapping field, with
the colophon and turntable close together below. Each print remains mostly
visible and opens in the existing lightbox; pointer entry and keyboard focus
raise the selected print to the top. Phones use a compact overlapping flow with
the colophon and turntable clear beneath it, so every image stays reachable.
The turntable label keeps one of Lance's photographs when Spotify is connected;
Spotify artwork appears as a short shelf of records beside the turntable: the
one playing now nearest the player with a plain disc half out of its jacket,
and up to four earlier albums trailing to the left. Hovering or focusing one
lifts it clear and shows its title and artist; covers are never cropped,
rotated or animated in place. The colophon moved to the top-right corner to
make room. Its live status comes from a public, read-only endpoint, and
unavailable status is shown honestly without inventing a track.

## D57 — The Airtable Clone shows its table, and loses its plate

Plate II's tagline is "a million rows, still quick", and the scene showed a
painted café terrace. It now shows the app's own table, and the slot is still
the idea.

**Through the slot.** The aperture no longer opens on a painting. It opens on
the People table at its last rows, 999,982 to 1,000,050, which slide upward as
the slot widens and arrive at row 1,000,050 exactly as the slot finishes
opening (both are bound to t 0 → 0.78, linear). The row numbers in the gutter
make the claim. The table sits at 80% of the frame, inside the 82% open slot,
so the gutter is never clipped. On a phone and with reduced motion it rests at
its last rows.

**On plate stock, not a screenshot.** A first pass inverted the table to a
dark ink negative so the cream title would flip across it. Lance found it too
dark and out of step with a page of warm plates. The table is now toned to the
plate stock: white → `--paper`, text → a warm grey, with a tone curve that keeps
the hairline grid (ffmpeg: `format=gray, curves=all='0/0 0.85/0.70 1/1'`, then
mapped from #8a7f72 to #fbf6ec). The title inside the slot flips from ink to
`--rust`, which reads like a printed stamp and sits with the ochre tagline.

**The ruled index.** Beneath the scene, three details on hairline rules, like
a spec sheet: 01 Views, 02 Filter (Score above 9,900: 9,879 of 1,000,050 rows),
03 Sort. Numbered, not figures: Worn's screens are figures that drift, and this
scene does not move except through the slot. True colour, cropped tight to
the UI, 840w and 1680w WebP, lazy loaded.

**The data.** Every row is fake. The captures come from a local copy of the
app with 1,000,050 faker contacts in a base called Contacts, signed in with a
local test session. Nothing was captured from the production app or from
Lance's own bases. The `lake-terrace` plate files stay in `public/plates/`.

## D58 — The nav gets out of the way, and the page clears its own contrast

A critique found the masthead colliding at nearly every section join on
desktop: "LR" over the Pool Safety paragraph, the links through Worn's
figures and the post titles. It also went cream on cream for a few hundred
pixels after the hero dissolved.

**Tucked at every width.** The phone's behaviour is now everyone's: the nav
slides away while the reader scrolls down and returns the moment they scroll
up, never while a keyboard user is in it. It still has no ground. A scrim or
bar would be a container, and §-nav says never a container.

**The hero reports its own tone.** The nav already takes its ink from the
`data-tone` under it. The hero's section stays under the nav after its
painting has dissolved into the cream ground, so it now flips its own
`data-tone` to dark once the dissolve passes 0.45.

**Contrast.** The focus ring was ochre on cream, 2.14:1. It is now rust on
paper and paper on the paintings and slate. Writing's dates and standfirsts
were 3.1:1 and 3.5:1 on the slate; they are now past 4.5:1. There is a skip
link, the Field Notes lightbox is a real dialog (focus in, held, restored),
the desk is tabbed in the order it reads on desktop, and links that open a
new tab say so.
