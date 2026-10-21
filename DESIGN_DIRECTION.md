# DESIGN_DIRECTION.md
### The visual constitution — Lance Rivera portfolio, Claude interpretation
**Authority:** Opus 5 (creative director). This document is binding on every implementation agent.
**Status:** Approved, Phase 1.

---

## 0. SOURCE RESTRICTION (non-negotiable)

> Do not inspect, read, copy from, or use any resume-frontend or previous resume-website project. The approved prototype, current brief, direction files, and Claude's new project folder are the only local design authorities.

This includes `resume-frontend`, `resume-frontend-new`, `resume-frontend-vite`, `resume-website-v2`, and anything derived from them. If you encounter them, ignore them. Do not open them "to see what not to do."

**Authorised inputs only:**
1. The master brief.
2. `~/Downloads/lance_astra_handoff_bundle/lance_portfolio_combined_latest.html` (read-only reference).
3. `~/Downloads/lance_astra_handoff_bundle/snowy_alpine_village_getaway.png`.
4. The four illustrated plates extracted from the approved prototype (see §3).
5. These direction documents.

---

## 1. THE ONE-SENTENCE IDENTITY

> **An illustrated journey through my work and life — presented as a plate book, not a website.**

Everything below serves that sentence.

### The organising conceit: **THE PLATE BOOK**

Old illustrated travel books present their paintings as *plates*: a full-bleed painting tipped onto heavier paper, with a printed caption line beneath and a plate numeral in the margin. There is a **List of Plates** at the front. The register is **editorial and printed**, not crafty.

This gives us, legitimately and without kitsch:

- a reason for paper sheets with captions (they are plates, not "cards")
- a reason for oversized numerals (plate numbers)
- a reason for a typographic contents page (List of Plates)
- a reason why the illustrations are *destinations* rather than product screenshots
- an editorial voice that is quiet, confident and printed

**This is a plate book. It is NOT a notebook, scrapbook, journal, passport, or travelling notebook.**
The previous "travelling notebook" direction was rejected for being too literal. Do not resurrect any of its devices: no notebook paper, no stitched bindings, no stamps, no stickers, no tape, no torn edges, no handwriting fonts, no passport pages, no luggage tags, no boarding passes, no postmarks, no washi tape.

The artwork already communicates journey. **The interface must not narrate it.**

---

## 2. COLOUR SYSTEM (sampled from the actual paintings)

Every value below was sampled from the authorised artwork with Pillow. These are not estimates. **Do not invent new hues.** If you need a colour that isn't here, sample the plates rather than guessing.

### 2.1 The critical discovery

The alpine painting's **bottom edge is `#B3C0D8`** — a cool, blue-grey lavender. It is snow *in shadow*.
The page ground in the old prototype was warm cream `#F1EFE6`.

That hue jump — cool blue-grey → warm cream, forced across 28vh — is precisely why the prototype's hero-to-page transition has a visible seam. The eye catches the temperature shift even when the luminance blend is smooth.

**The rule that follows from this, and it governs the whole page:**

> The page does not begin as cream. The page begins as **snow in shadow (`#B3C0D8`)** — the painting's literal last row — and *warms* into lit snow over the following screen and a half.

Snow in shadow is blue. Snow in sun is cream. Both are true; the page travels from one to the other. This is physically honest to the painting and it makes the seam disappear.

### 2.2 Tokens

```
/* ——— GROUNDS ——— */
--snow-shadow    #B3C0D8   /* alpine painting, exact last row. Hero exit ground. */
--snow-drift     #D7DBE0   /* midpoint of the warm-up. Transitional only. */
--snow-lit       #F0EAE0   /* PRIMARY PAGE GROUND. Warm lit snow. */
--snow-warm      #F6F0E6   /* raised plates, paper stock */
--paper          #FBF6EC   /* plate stock — the sheet a painting is printed on */

/* ——— SKY ——— */
--cobalt         #0D7EE6   /* alpine zenith. The signature colour. Use sparingly & loudly. */
--azure          #2F8CE2   /* coastal sky, exact top row. Back-cover join colour. */
--azure-soft     #4087C3   /* coastal mid-sky */

/* ——— ALPINE / SLATE ——— */
--slate          #3E79AD   /* mid alpine blue */
--slate-deep     #2A5F86   /* Writing section ground */
--slate-ink      #28475B   /* deepest painted blue */

/* ——— INK ——— */
--ink            #1B2A33   /* primary text on light grounds */
--ink-warm       #3F362A   /* sampled warm near-black; use for plate captions */
--ink-soft       #5C6B73   /* secondary text. NEVER pure grey #666. */

/* ——— WARM ACCENTS ——— */
--parchment      #DED3C0
--stone          #D5C0A5
--ochre          #C79969
--ochre-deep     #9C7A50
--rust           #8C3F3E
--terracotta     #784D31

/* ——— GREENS (use rarely — they anchor, they don't decorate) ——— */
--pine           #2C382B
--olive          #656B59
```

### 2.3 Colour rules

- **Cobalt is the loudest thing on the site.** It appears in full strength only in the two paintings and, at most, one deliberate typographic moment. Never as a UI accent colour. Never on a button. Never on a hover state.
- **No pure white, no pure black, anywhere.** Not in text, not in backgrounds, not in borders. The lightest value is `--paper`; the darkest is `--ink`.
- **No pure grey.** Every neutral carries either the warm (parchment) or cool (snow-shadow) cast.
- **Rust and ochre are punctuation.** A rule, a numeral, an underline on hover. Never a fill behind a paragraph, never a badge.
- **Greens anchor, they do not decorate.** Pine may ground a caption or a small mark. Never a section background.
- Sections have grounds, not "themes". There are exactly four grounds on the page: snow-shadow (hero exit), snow-lit (most of the page), slate-deep (Writing), and painting (Hero + Back Cover).

---

## 3. THE FOUR PLATES

Four illustrations exist. There are no others. Treat them as precious and finite.

| # | File | Subject | Role |
|---|------|---------|------|
| I | `alpine-village.png` | Snowy alpine high street, cobalt sky, blue + red cars | **Hero. Immutable.** |
| II | `coastal-road.png` | Amalfi coast, lemons, bougainvillea, cream Fiat, sailboats | **Back Cover. Immutable.** |
| III | `lake-terrace.png` | Café terrace above a lake, striped awning, geraniums, peaks | Work / Field Notes |
| IV | `hill-path.png` | Walker in a red coat on a snowy village path, church spire | Work / Field Notes |

### 3.1 Image treatment law

- **Never distort.** No non-uniform scale, no skew, no perspective transform, no split into pseudo-layers, no duplicated regions, no seams.
- **Uniform scale and crop are permitted.** Scaling the whole plate, or animating a crop window over it, is not distortion. This is how we get motion out of a static painting.
- **Never filter.** No blur, no grayscale, no hue-rotate, no duotone, no CSS `filter` on a plate. Ever. The paintings are the identity; degrading them degrades the identity.
- **Never overlay a full-plate scrim by default.** A directional gradient for text legibility is permitted only where type actually sits, and only in the Hero (existing, approved) — nowhere else. See §6 for the Back Cover, which solves legibility by composition instead.
- **Keep them sharp.** Serve at appropriate resolution; do not upscale past native 1672×941.
- Plates III and IV may be **cropped hard** — a tall vertical slice, a wide letterbox band. Cropping is our main compositional tool. A crop is a decision; a full frame everywhere is not.

### 3.2 Relationship between illustration and interface

This is the most important paragraph in this document.

> **The interface is the paper the paintings are printed on.**

The interface is not decorated to look like the paintings. It does not borrow their motifs, draw its own mountains, or add CSS birds outside the Hero. It is a calm, warm, printed surface whose *colour and light* come from the paintings, and which occasionally opens a window onto one.

Corollary, from June Digan: **the illustration forms the identity without being visible everywhere.** There are long stretches of this site with no painting on screen at all. Those stretches must still be unmistakably from this world — because of the ground colour, the type, the composition, and the printed logic. If a section only works because there is a painting in it, the section is not designed yet.

---

## 4. TYPOGRAPHY

### 4.1 The faces

| Role | Face | Notes |
|------|------|-------|
| Display | **Georgia** (`Georgia, "Times New Roman", serif`) | The approved prototype's face. Warm, bookish, and its italic at display scale is the identity. |
| Support | **Inter → system** (`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`) | Recedes. Resolves to the system UI face where Inter is not installed. |

**No webfont is loaded.** The prototype loads none, and these stacks are taken from it verbatim — so there is no network dependency, no FOUT, and no layout shift on first paint. Do not add a Google Fonts link.

Georgia has **regular and bold only** and no variable axes. Do not write `font-variation-settings`, and do not specify weights of 200/300 expecting a lighter cut — they render as regular. Weight 400 for display, 500 for meta.

### 4.2 The hierarchy

```
DISPLAY ITALIC   Georgia italic, 400
                 clamp(80px, 10vw, 150px), line-height .79, tracking -0.07em
                 → Hero name, section titles, the one or two takeover moments.

DISPLAY ROMAN    Georgia, 400
                 clamp(70px, 9vw, 132px), line-height .84, tracking -0.06em
                 → Section titles, back-cover title.

PROJECT NAME     Georgia, 400
                 clamp(46px, 6vw, 90px), line-height .92, tracking -0.05em
                 → Work scene titles. Deliberately smaller than a section
                   heading: Georgia is wide, and at heading scale "Fieldguide"
                   overflows its column.

SUBHEAD          Georgia, 400
                 clamp(26px, 2.6vw, 42px), line-height 1.08
                 → Article titles, pull quotes.

BODY             sans stack, 400, 17px, line-height 1.58, tracking 0
                 max-width 34ch. Colour --ink-soft.

META / EYEBROW   sans stack, 500, 11–12px
                 letter-spacing .16–.18em, UPPERCASE
                 → "SOFTWARE ENGINEER · SYDNEY", "PLATE III", section labels.

CAPTION          Georgia, 400, 15–17px, colour --ink-warm
                 → Plate captions. Always sentence case. Always beneath the plate.

NUMERAL          Georgia italic, 400
                 → Plate numerals. See §4.4.
```

### 4.3 Typographic rules

- **The italic is the voice.** Roman is for information; italic is for identity. Never italicise a whole paragraph. Never set a numeral or a date in italic except plate numerals.
- **Dramatic scale differences are mandatory.** If a section's largest and smallest type differ by less than 6×, the section is under-designed.
- **Asymmetry.** Nothing is centred except by explicit decision. Headings do not sit in the middle of a 12-column grid by default.
- **Type is composition, not labelling.** A section title may be cropped by the viewport edge, may run behind a plate, may break across a line in a way that a CMS would never choose.
- **Line breaks are authored.** Use explicit `<br>` in display type. Do not let display headings reflow arbitrarily.
- **Banned:** letter-spaced lowercase body text; all-caps paragraphs; centred body copy; text shadows; gradient text fills; outlined/stroked display text; anything that looks like a "hero headline with a gradient word".

### 4.4 Plate numerals

Every plate carries a numeral. Set in Fraunces italic, weight 200, at a size between 140px and 260px, in `--ink` at **4–7% opacity** over light grounds (or `--paper` at 8% over dark). They sit in the margin, are frequently cropped by the section edge, and are **never** centred behind content like a watermark.

Numerals are Roman: **I, II, III, IV**. Not "01". The plate book sets them in Roman; a CMS sets them in Arabic. We are a plate book.

---

## 5. COMPOSITION & LAYOUT PHILOSOPHY

### 5.1 The grid

A 12-column grid at `min(1440px, 100% - 2 * clamp(20px, 4vw, 72px))`, with a genuinely wide gutter. **The grid is a reference, not a cage.** Full-bleed elements are expected. Elements that break the grid on one side while respecting it on the other are the house style.

### 5.2 Negative space

Generous to the point of feeling expensive. Specific commitments:

- Section top padding never below `clamp(120px, 14vh, 200px)`.
- At least one full "empty" viewport-height moment per major transition.
- No section may fill more than ~70% of its own vertical extent with content. The remaining 30% is the design.
- **A quiet section is not an unfinished section.** Do not fill space because it is empty.

### 5.3 Asymmetry

- Two-column layouts must never be 50/50 or a mirrored flip of the previous section. If Work scene A is image-left/copy-right, scene B is *not* copy-left/image-right. That mechanical alternation is the single biggest failure of the reference prototype and it is explicitly forbidden (§7).
- Preferred ratios: 62/38, 71/29, 78/22. Never 50/50.
- Vertical alignment should vary: some blocks hang from the top, some sit on a baseline, some are optically centred.

### 5.4 The plate sheet

The recurring physical object. Specification:

```
background: var(--paper)
padding: 14px 14px 0            /* the caption sits below the image, in the sheet */
caption block: 18px 14px 20px
box-shadow: 0 2px 4px rgba(27,42,51,.04),
            0 18px 44px -12px rgba(27,42,51,.14)
border-radius: 0                /* PRINTED PAPER IS NOT ROUNDED */
```

- **Zero border radius. Everywhere on this site.** No rounded rectangles. Not on plates, not on inputs, not on the nav, not on hover states. This is one of the strongest anti-generic decisions available and it is absolute.
- Resting rotation between -3° and +3°, never 0° for a plate in a collage, always 0° for a plate in a formal Work scene (Work scenes are *tipped-in* plates: square to the page).
- Shadow is soft, large, low-opacity and **warm-neutral** — never a hard drop shadow, never black.

---

## 6. SECTION-BY-SECTION VISUAL LAW

### 6.1 HERO — preserved, refined

**Composition is approved and near-immutable.** Full-bleed alpine plate, minimal nav, small `LR`, huge italic serif name bottom-left, restrained supporting line, scroll cue.

Content, exactly:
```
SOFTWARE ENGINEER · SYDNEY
Lance
Rivera
I build thoughtful digital experiences.
Scroll to explore ↓
```

Refinements permitted:
- The name arrives by a **per-line mask reveal from below** with a small over-slant that settles (see MOTION_DIRECTION §3.1). Not a fade-up.
- The eyebrow rule draws itself from 0 to 38px.
- Existing left-side legibility gradient retained.

**Hard constraints (from the brief, restated as law):**
- The painting itself is **static**. No parallax, no scale, no drift on the plate. Nothing in the painting moves: not the mountain, the village, the cars, the road, the foreground snow, or the painted clouds.
- No image splitting, layering, region-scaling, duplication or seams.
- Approved atmosphere, and only this: **snowfall** and **one simple bird flock**. Nothing else may be added to the sky or the scene. No CSS sun, no lens flare, no smoke from chimneys, no falling leaves, no extra vehicles.
- **The flock flies in the painting's space, not on top of it.** It is masked by
  the village's own silhouette — derived from the plate's pixels, not traced —
  so birds pass in front of the mountains and behind the roofs, the conifers and
  the spire. This does not breach the static-artwork rule: the painting is still
  one image, drawn once, untransformed; only the birds are constrained. Snowfall
  is not masked, because snow does fall in front of buildings. DECISIONS D43.
- **No CTA pills.** Generic CTA buttons were tested and rejected. The Hero has no button.
- The initial view must be completely clean. The snow transition appears **only** on scroll, never on load.

### 6.2 THE CROSSING (new) — hero exit + List of Plates

Two jobs, one continuous movement.

**(a) The dissolve.** The foreground snow becomes the page. Because the painting's last row is `#B3C0D8`, the page directly beneath the Hero is `#B3C0D8`. The dissolve is long and hueless — the eye crosses no temperature boundary. Over the following ~1.5 viewport heights the ground warms `--snow-shadow → --snow-drift → --snow-lit`. The user should not be able to name the moment they left the painting.

Forbidden: fading to black; any navy; a white gradient on initial load; a hard horizontal transition block; a visible gradient rectangle.

**(b) A single breath.** One short statement of who this is — the About anchor — and nothing else. The section is deliberately brief; the reader should reach the first plate quickly.

**The List of Plates is summoned, not scrolled past.** It lives in a full-screen overlay opened from `Work` in the nav: four lines, Roman numerals, names, taglines, disciplines — the plate book's contents page — and clicking a line jumps to that plate. As an inline section it cost about a screen and a half before a reader saw a single project, and it could not be returned to. As an overlay it costs nothing, is available from anywhere in the page, and gains the thing the inline version never had. DECISIONS D34.

### 6.3 SELECTED WORK — four scenes, four logics

Governed by one principle:

> **EACH PROJECT MUST HAVE ROOM TO BREATHE.**

and one prohibition:

> **The four scenes may not share a layout logic.** Not "image left / copy right" then its mirror. Four different compositional ideas.

Directed shape (Sonnet explores the choreography, Opus fixes the logic):

| Plate | Project | Compositional logic | Hierarchy |
|-------|---------|---------------------|-----------|
| **I** | Worn | The plate **arrives** and dominates — near-full-bleed, caption block hung below-left. Copy is a caption, not a column. | Image |
| **II** | Tableline | The plate is a **narrow vertical aperture that widens** as you scroll. The title lives *behind* it and is revealed as the aperture opens. | Type |
| **III** | Fieldguide | A **horizontal moment**: the scene pins and content travels sideways — crops of one plate passing like a train window. | Sequence |
| **IV** | Daybook | **Quiet.** A small plate, enormous negative space, an enormous numeral. Deliberate rest before Field Notes. | Space |

Every scene, regardless of logic, must deliver: a legible project name, one clear line of what it is, a visible and obvious way to open it, and a numeral.

Copy discipline: **Worn is the only real project** ("your fit diary"). Everything else is demo copy and must read as such. Invent no employers, clients, awards, metrics, users, revenue, performance figures, titles or honours.

### 6.4 FIELD NOTES — an art-directed editorial surface

Physical visual fragments arranged with deliberate imperfection: a cropped plate, a photograph, a type specimen, a quote, a hand-made thing.

**Hard rule, from the brief:** **NO atmospheric haze over this section.** No fog, no washed overlay, no large blur, no cloudy transparency across the section. A previous version did this and it looked bad. This is absolute.

- Ground is `--snow-lit`, not a separate beige. The prototype's `#f1eadc` read muddy. **No beige for the sake of beige.**
- Composition is asymmetric and genuinely spatial: objects overlap intentionally, pass *behind* the section title, and sit at varied depths.
- Not masonry. Not a dashboard. Not a card grid. If it can be described as "a grid of cards", it has failed.
- **This section is the exception to the site's negative-space rule.** Everywhere else, space is the design. Here the surface should read as a *full desk* — eleven objects, densely packed, overlapping, with the quiet living in the narrow gutters between them rather than in open regions. Measured target: **≥ 90% occupancy** on a 10×10 grid over the surface. A large void anywhere reads as an unfinished layout, not as rest.
- Objects are tactile: hover straightens and lifts; click expands from the object's own position (FLIP), not from the screen centre.

### 6.5 WRITING — Notes from the Margins

Structure is approved: a prominent sticky plate stack on one side, an article list on the other. Ground is `--slate-deep`.

**The join above it is a ridgeline.** Field Notes' snow-lit ground and this
section's slate meet along a hand-drawn alpine silhouette, not a straight edge —
the painted range from the Hero returning as a flat two-colour graphic. Facets
and hard breaks in slope, never a soft wave: a soft wave here reads as a torn
paper edge (§7). The relief is confined to the middle of the span and runs out
onto a valley floor at both margins, because the fixed nav's ink sits over those
margins and a summit under it puts dark ink on dark ground. The landform never
moves; a band of snow-lit crest travels it as the join crosses the viewport.
DECISIONS D41.

The interaction is decided and is **not** open to reinterpretation: hovering or tapping an article flies a **new physical plate onto the stack**. Never a crossfade. Full spec in MOTION_DIRECTION §3.5.

**A post is a page, not an overlay.** `/writing/<slug>/`, pre-rendered to its own
HTML file. The section's standfirst promises it — this is the one part of the
book that leaves the one-page world — and the overlay idiom is spent elsewhere on
momentary things. The post page is a reading page: snow-lit ground, the plate on
stock rather than bleeding, a real measure (66ch, not the site's 34ch note
column), pull quotes hanging back to the shell edge out of the indented column,
and almost no motion. DECISIONS D44.

Visual requirements: the stack must have real margin (the prototype clipped it against the shell edge); previous sheets stay visible at the stack's edges so the pile reads as a pile; bounded to 3 sheets; the active row is typographically distinct (roman → italic), not merely brighter.

### 6.6 BACK COVER — the reverse of the Hero

Conceptually: `FLAT PAGE → SKY COLOUR → ACTUAL SKY → FULL COASTAL PLATE`.

**The join, solved.** The coastal painting's top row, sampled in the open-sky window, is `#2F8CE2`. Its full-width top row averages `#4085B7` only because lemons occupy the top-left and bougainvillea the top-right.

Therefore the plate is revealed **scaled up and centred on the pure sky**, settling to full frame as it enters. At the moment of the join, only pure sky is on screen: CSS `#2F8CE2` meets painted `#2F8CE2` and the seam does not exist. As it settles, the lemons and bougainvillea sweep in from the edges. Uniform scale — not distortion.

Forbidden: visible gradient rectangles; hard image crops; an obvious bridge section; any horizontal seam; the prototype's stacked-gradient approach.

**Composition must differ from the Hero, not repeat it.** The Hero sets type bottom-left over dark buildings behind a scrim. The Back Cover sets type **left of centre, over the open sea**, in `--paper` — the sea is a large calm field of `#3B8AD1`, which carries cream type at full legibility with **no scrim at all**. That contrast — scrimmed vs. unscrimmed, bottom vs. centre — is what makes the two paintings rhyme instead of repeat.

Content: a closing line, `hello@lancerivera.dev`, and three links (GitHub, LinkedIn, Résumé). Nothing else.

**No fake sailboat.** No CSS-generated environmental objects on top of any illustration, ever. The painting already has five sailboats.

### 6.7 NAVIGATION

`LR` · Work · About · Notes · Writing · Contact

- Fixed, minimal, sits on a hairline. Adapts between light and dark grounds.
- **Never a floating pill.** No rounded container, no background blob, no border, no glass.
- Over the Hero and Back Cover: `--paper`, hairline at 26% opacity.
- Over light grounds: `--ink`, hairline at 14%.
- Over Writing (slate): `--paper` again.
- The `LR` is Fraunces italic. It is the only brandmark. No logo, no monogram badge, no avatar.
- Active-section indication, if any, is a hairline under the word — not a pill, dot, or colour fill.
- On a phone (≤720px) the row becomes one word, `Contents`, opening the List of Plates with the chapters beneath, and the nav tucks away while scrolling down. DECISIONS D53.

---

## 7. ANTI-PATTERNS — automatic rejection

Anything on this list is rejected on sight, regardless of execution quality.

**Structure & shape**
- Any `border-radius` above 0 on any element
- Card grids; masonry; dashboards; "feature grids"
- Floating pill navigation; sticky CTA bars
- Glassmorphism; `backdrop-filter` blur as decoration
- Badges, chips, tags, pills of any kind
- Borders used to separate content (use space; a hairline rule is permitted, a box is not)

**Colour & surface**
- Dark navy + cyan accent
- Pure white, pure black, pure grey
- Beige for its own sake
- Gradient buttons; gradient text; glows; neon
- Any CSS `filter` applied to a plate

**Type**
- Generic sans heading + grey paragraph + rounded card (the SaaS triad)
- A webfont added for its own sake, or any `font-variation-settings` (Georgia has no axes)
- Typewriter/monospace as a personality font
- Gradient or outlined display text

**Metaphor**
- Notebook paper, stitched bindings, spiral rings
- Stamps, postmarks, stickers, washi tape, torn edges, paperclips
- Passport pages, boarding passes, luggage tags, maps with dotted routes
- Handwriting fonts
- Any literal "journey" narration in the UI

**Spectacle**
- WebGL with no purpose
- Custom cursors that replace the pointer
- Preloader percentage counters
- Scroll-jacking that removes the user's control
- Marquees that never stop
- Fantasy, anime, glossy 3D, game UI
- Decorative AI-looking clutter of any kind

---

## 8. WHAT "GOOD" LOOKS LIKE HERE

If a reviewer scrolls this site, they should be able to say:

1. *"Someone chose every one of these positions."*
2. *"The paintings and the page are the same object."*
3. *"It goes quiet on purpose."*
4. *"I have not seen this Work section before."*
5. *"I can't find where the painting stops and the page starts."*

And they must **not** be able to say:

1. *"This is a portfolio template with a nice picture at the top."*
2. *"Every section animates the same way."*
3. *"This is a scrapbook."*

---

## 9. RESPONSIVE & ACCESSIBILITY LAW

- **Mobile keeps its personality.** Simplify long pins, extreme overlap, pointer-only behaviour and large horizontal travel. Do not degrade to a generic stack of full-width cards. Mobile keeps: the Hero and its atmosphere, the plate sheet, the italic display scale (proportionally), the numerals, the asymmetry, the Writing stack, and both painting transitions.
- **`prefers-reduced-motion`** removes motion, never content. Every element reaches its final composed state. Snow and birds are removed. Pinned scenes become static compositions in document order. Nothing that only existed as an animation may disappear.
- Contrast: body text ≥ 4.5:1 against its ground; display type ≥ 3:1. Text over a plate is only permitted where the underlying region is measurably calm (Hero scrim, Back Cover sea).
- Every interactive element is reachable and operable by keyboard, with a visible focus ring in `--ochre` (2px, offset 3px, square).
- Plates carry real `alt` text describing the painting.
- Motion driven by hover must also work on tap.

---

## 10. TECHNICAL DIRECTION

- **Vite + React + TypeScript.**
- **`motion`** (Motion for React, v11+) for declarative animation, scroll-linked transforms and springs.
- Transform and opacity only for anything scroll-linked. No animating layout properties.
- `IntersectionObserver` for enter/exit gating. A single shared `requestAnimationFrame` loop for snow and birds — justified, and the only rAF on the page.
- `clip-path` / `inset()` for apertures and masks. `position: sticky` for pins — never JS-driven scroll hijacking.
- Plates: served at native resolution, `loading="eager"` for Hero and the first Work plate, `lazy` beyond. No upscaling. No filters.
- Performance budget: 60fps on a 2021 MacBook Air at 1440p. No continuous blur. No continuously-transforming full-viewport raster.

---

**Signed off:** Opus 5, creative director.
Changes to this document require Opus approval. Sonnet may not redefine visual identity after approval; local engineering decisions remain Sonnet's.
