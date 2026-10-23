# Experience section mocks (2026-10-23): all three REJECTED

Lance reviewed these three text-only directions in Chrome and was not happy with any of them. They are kept so the next round doesn't repeat them.

| File | Direction |
|---|---|
| `rejected-a-lead-entry.js` | **A, lead entry.** Pool Safety set as a feature (76px serif name, darker 18px paragraph) with one margin figure per role: 470 *tests, roughly* · 9,000+ *followers* · 90% *less processing time*. CSESoc and SAF compact below. All visible. |
| `rejected-b-unfolding-index.js` | **B, unfolding index.** Start year in the margin (Georgia italic), employer name at ~78px, role and dates always visible, hairline +/− toggle. Rows unfold independently with a grid-rows reveal and an expo ease-out; the name goes italic on hover, echoing Writing D46. Pool Safety starts open. |
| `rejected-c-prose-margin-notes.js` | **C, prose and margin notes.** Experience as one display-serif paragraph (draft copy) with the employers underlined in rust; notes hang in the margin beside each phrase, and hovering a name lights its note. Notes stack under the prose on phones. |

## How they were shown
Each script rebuilds `.crossing__experience-list` on the PR21 preview (`http://127.0.0.1:5197`, branch `codex/portfolio-refinements`) by reading the live entries, so Lance's wording is unchanged. No source was touched.

`show-switcher.cjs` opens a Playwright-driven Google Chrome window with an A/B/C switcher pinned bottom-right:
`node show-switcher.cjs <a.js> <b.js> <c.js>`. It uses the Playwright path in the script and needs the preview running.

Constraints Lance set: text only, with no visuals, diagrams or fake screenshots. Keep his Pool Safety wording; he declined a rewrite into short claims. Worn Fig. 2 stays.
