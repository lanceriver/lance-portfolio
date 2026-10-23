# Experience section mocks (2026-10-23 to 10-24)

**Outcome:** mock R shipped (PR21, DECISIONS D62, live on lanceriver.com 2026-10-24). Everything before it was rejected or superseded; the files are kept so later rounds don't repeat them.

## Round 1: A, B, C (all rejected)
Lance reviewed these three text-only directions in Chrome and was not happy with any of them.

| File | Direction |
|---|---|
| `rejected-a-lead-entry.js` | **A, lead entry.** Pool Safety set as a feature (76px serif name, darker 18px paragraph) with one margin figure per role: 470 *tests, roughly* · 9,000+ *followers* · 90% *less processing time*. CSESoc and SAF compact below. All visible. |
| `rejected-b-unfolding-index.js` | **B, unfolding index.** Start year in the margin (Georgia italic), employer name at ~78px, role and dates always visible, hairline +/− toggle. Rows unfold independently with a grid-rows reveal and an expo ease-out; the name goes italic on hover, echoing Writing D46. Pool Safety starts open. |
| `rejected-c-prose-margin-notes.js` | **C, prose and margin notes.** Experience as one display-serif paragraph (draft copy) with the employers underlined in rust; notes hang in the margin beside each phrase, and hovering a name lights its note. Notes stack under the prose on phones. |
| `mock-d-inside-about.js` | **D, inside About (REJECTED 2026-10-23, "terrible").** Run-in entries in the bio column: role (serif), employer (italic), dates, then the summary on the same line. |
| `mock-e-by-place.js` | **E, by place (REJECTED 2026-10-23, "terrible").** Own section, two columns Singapore 2022–2024 → Sydney 2025–, same run-in grammar as D. |
| `mock-f-chiang-cards.js` | **F, organised like brittanychiang.com (Lance asked for this; he likes the layout).** Heading in the left column, roles in the right: dates (site label style) | Georgia role · employer, summary, hairline square tags lifted from each summary. Desktop hover: title goes italic (D46, sized per D47), others dim. First pass used Inter titles and a shadowed card; Lance said the font looked off, so it now follows the site. Résumé link removed while Lance decides where it goes. |

## How they were shown
Each script rebuilds `.crossing__experience-list` on the PR21 preview (`http://127.0.0.1:5197`, branch `codex/portfolio-refinements`) by reading the live entries, so Lance's wording is unchanged. No source was touched.

`show-switcher.cjs` opens a Playwright-driven Google Chrome window with a switcher pinned bottom-right, plus a "Current" tab for the live register:
`node show-switcher.cjs "D · Inside About=mock-d-inside-about.js" "E · By place=mock-e-by-place.js"`. It uses the Playwright path in the script and needs the preview running.

Constraints Lance set: text only, with no visuals, diagrams or fake screenshots. Keep his Pool Safety wording; he declined a rewrite into short claims. Worn Fig. 2 stays.

## Round 3 (2026-10-23): F's layout, filling the empty left column
Lance liked F's layout once it used the site's type, but not the empty left column under "Experience". `layouts/*.js` are snippets applied after F; `mock-g-*.js` and `mock-h-*.js` are F plus a snippet (regenerate with `cat mock-f-chiang-cards.js layouts/<x>.js > mock-<x>.js` after editing F).
- **G, sticky About:** Brittany Chiang's page structure. "About." and the route stay pinned in the left column; bio, interests and Experience scroll in the right column.
- **H, dates left:** the heading sits above the list; each role's dates move into the left column on the "About." edge, and the role content stays in the right column.
- **I, contents:** a sticky list of the three employers (start year + Georgia name) under the heading; the role you're reading goes italic and full ink, and clicking jumps to it.
- **J, running year:** a pinned Georgia old-style numeral (same size as "About.") showing the start year of the role you're reading, with the employer in italic beneath; it swaps with a short settle.
- **K, interests left:** the interests leave their full-width strip and stack in the left column beside the roles; "Experience" moves to the right column.
- **L, education + résumé:** a sticky sidebar with the degree (BSc Computer Science, UNSW, finishing Dec 2026) and the "View full résumé →" link.
- **M, K + L pinned (Lance's idea):** the whole left column is one sidebar (About. + route, interests stacked, degree, résumé link), pinned while the bio and Experience scroll on the right. Pins only when the window is ≥680px tall; phones read title → bio → interests → Experience → education → résumé.
- **N, M with a label heading:** "Experience" drops from 40px Georgia to the site's `.eyebrow.eyebrow--rule` (as on "Selected Work"), so "About." is the only display heading and Experience reads as part of About.
- **O, M without the label (Impeccable pass):** Lance flagged the ruled label as an AI tell; Impeccable's craft floor bans eyebrows. No visible "Experience" heading (hidden h3 for screen readers), so the bio runs into the roles; dates move from tracked caps to 13px metadata ("Mar 2026–present"); résumé link becomes a plain underlined link; arrow eases with --ease-settle.
- **P, O on three type steps:** 13px metadata · 17px reading (the site's `.body`) · 21px titles, plus 11.5px labels and the display title. Rendered sizes verified: 11.5 / 13 / 17 / 21 / ~90px. Impeccable's static scan still flags flat-type-hierarchy because it can't resolve "About."'s clamp() size (URL mode needs puppeteer, not installed).
- **Q, P minus tags and interest labels (Lance's cuts):** tech tags removed; the interests lose ON FOOT / AT THE KEYS / OUT AND ABOUT and become a plain ruled list at 21px. EDUCATION is now the only caps label.
- **R, Q with an "Interests" label:** one label set exactly like EDUCATION, so the sidebar reads as two parallel groups; the list is labelled by it for screen readers.

## Shipped
**R** (F + layouts m, o, p, q, r) was built into PR21 as `Crossing.tsx` / `crossing.css` and recorded as D62.

## Worn first (2026-10-24)
- `preview-worn-first.js`: moves Worn's still scene ahead of the Airtable aperture and swaps the numerals. Lance approved; shipped in PR21 as D63.
- `preview-worn-screen-up.js` (+ the combined `preview-worn-first-screen-up.js`): Worn's Fig. 1 beside the intro, bullets in the screenshot row. Rejected.
