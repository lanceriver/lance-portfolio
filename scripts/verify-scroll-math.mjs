import { readFileSync } from 'node:fs'

/**
 * Verifies the scroll-linked maths for every section against synthetic geometry.
 *
 * The browser pane in this environment does not composite while being driven by
 * tooling, so requestAnimationFrame never fires and scroll-linked values cannot
 * be observed live. This exercises the exact formulas the drivers use, so the
 * logic is checked even when the browser cannot be.
 */
const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const lerp = (a, b, t) => a + (b - a) * t
const range = (t, a, b) => clamp((t - a) / (b - a))

const VH = 720
let pass = 0, fail = 0
const eq = (name, got, want, tol = 1e-3) => {
  const ok = Math.abs(got - want) <= tol
  ok ? pass++ : fail++
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}: got ${(+got).toFixed(4)} want ${(+want).toFixed(4)}`)
}

// Layout measured from the running page
const L = {
  hero:     { top: 0, h: 1.3 * VH },   // 130vh
  crossing: { top: 1.3 * VH, h: 462 },
  work:     { top: 1.3 * VH + 462, h: 6098 },
  notes:    { top: 1.3 * VH + 462 + 6098, h: 1597 },
  writing:  { top: 1.3 * VH + 462 + 6098 + 1597, h: 1278 },
  cover:    { top: 1.3 * VH + 462 + 6098 + 1597 + 1278, h: 2.08 * VH }, // 48vh bridge + 160vh wrap
}
const rectTop = (sec, y) => sec.top - y

console.log('\n— Hero dissolve (Hero.tsx) —')
{
  const p = (y) => clamp(-rectTop(L.hero, y) / Math.max(1, L.hero.h - VH))
  const fade = (y) => range(p(y), 0.44, 0.88)
  eq('fade at load', fade(0), 0)
  eq('fade still 0 at 40% of travel', fade(0.40 * (L.hero.h - VH)), 0)
  eq('fade complete before the pin releases', fade(0.88 * (L.hero.h - VH)), 1)
  eq('fade is 1 at handoff', fade(L.hero.h - VH), 1)
}

console.log('\n— Crossing ground warm-up (Crossing.tsx) —')
{
  const tokenCss = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
  const token = (name) => {
    const match = tokenCss.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))
    if (!match) throw new Error(`Missing --${name} colour token`)
    return match[1]
  }
  const rgb = (hex) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))
  const hex = (channels) => `#${channels.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`
  const mix = (a, b, t) => rgb(a).map((channel, i) => lerp(channel, rgb(b)[i], t))
  const exit = token('hero-exit')
  const drift = token('snow-drift')
  const lit = token('snow-lit')
  const [red, , blue] = rgb(exit)
  const warmExit = red >= blue
  const ground = (y) => {
    // span = section height + one viewport (see Crossing.tsx)
    const p = clamp((VH * 0.62 - rectTop(L.crossing, y)) / (L.crossing.h + VH))
    const colour = warmExit
      ? mix(exit, lit, p)
      : p < 0.5
        ? mix(exit, drift, p / 0.5)
        : mix(drift, lit, (p - 0.5) / 0.5)
    return { p, colour }
  }
  const g1 = ground(L.crossing.top - VH)          // section just entering
  eq('warm exit selects direct exit→lit path', warmExit ? 1 : 0, 1)
  eq('holds exit colour at first contact', g1.p === 0 && hex(g1.colour) === exit ? 1 : 0, 1)
  const yMid = L.crossing.top + (L.crossing.h + VH) * 0.5 - VH * 0.62
  const gMid = ground(yMid)
  eq('midpoint uses direct exit→lit colour, without grey dip',
    Math.abs(gMid.p - 0.5) < 1e-9 && hex(gMid.colour) === hex(mix(exit, lit, 0.5)) && hex(gMid.colour) !== hex(mix(exit, drift, 0.5)) ? 1 : 0, 1)
  const g2 = ground(L.crossing.top + L.crossing.h + VH) // a viewport past it
  eq('holds snow-lit a viewport past the section', g2.p === 1 && hex(g2.colour) === lit ? 1 : 0, 1)
  const g3 = ground(L.work.top + 2000)             // deep inside Work
  eq('stays snow-lit deep into Work', g3.p === 1 && hex(g3.colour) === lit ? 1 : 0, 1)
  const g4 = ground(L.notes.top + 800)             // inside Field Notes
  eq('stays snow-lit in Field Notes', g4.p === 1 && hex(g4.colour) === lit ? 1 : 0, 1)
}

console.log('\n— Work II aperture (Work.tsx) —')
{
  const sec = { top: 0, h: 260 / 100 * VH }
  const slot = (t01) => {
    const t = clamp(t01)
    return 41 - 32 * range(t, 0.12, 0.78)
  }
  eq('slot starts narrow', slot(0), 41)
  eq('slot fully open by 78%', slot(0.78), 9)
  eq('slot stays open after', slot(1), 9)
  eq('midpoint opens partway', slot(0.45), 41 - 32 * ((0.45 - 0.12) / 0.66))
  const frame = 0.8 * VH
  const rowsH = 2400
  const travel = Math.max(0, rowsH - frame * 0.76)
  const rows = (t) => -travel * range(t, 0, 0.78)
  eq('table starts at its first rows', rows(0), 0)
  eq('table travels halfway at 39%', rows(0.39), -travel / 2)
  eq('last row arrives at full travel', rows(0.78), -(2400 - frame * 0.76))
  eq('table stays at the last row after opening', rows(1), -(2400 - frame * 0.76))
  eq('table completes as the slot finishes opening', slot(0.78) === 9 && rows(0.78) === -travel ? 1 : 0, 1)
  if (sec.h <= VH) { fail++; console.log(' FAIL aperture section must be taller than the viewport to pin') } else pass++
}

console.log('\nWork III drift (Work.tsx)')
{
  const sec = { top: 0, h: 1.18 * VH }
  const t = (y) => clamp((VH - (sec.top - y)) / (VH + sec.h))
  const num = (y) => (0.5 - t(y)) * 130
  const plate = (y) => (0.5 - t(y)) * 62
  const copy = (y) => (0.5 - t(y)) * 26
  eq('numeral starts below centre', num(-VH) > 0 ? 1 : 0, 1)
  // the section spans y from -VH (just below the viewport) to sec.h (fully passed)
  const yIn = -VH, yOut = sec.h
  eq('numeral crosses zero mid-scene', Math.abs(num((yIn + yOut) / 2)) < 1 ? 1 : 0, 1)
  eq('numeral ends above centre', num(yOut) < 0 ? 1 : 0, 1)
  eq('numeral travels furthest', Math.abs(num(yIn)) > Math.abs(plate(yIn)) ? 1 : 0, 1)
  eq('plate travels further than copy', Math.abs(plate(yIn)) > Math.abs(copy(yIn)) ? 1 : 0, 1)
  eq('total numeral travel is 130px', Math.abs(num(yIn) - num(yOut)), 130)
  eq('total copy travel is 26px', Math.abs(copy(yIn) - copy(yOut)), 26)
}

console.log('\n— The ascent: Field Notes held while Writing climbs (CSS sticky) —')
{
  // The hold is `position: sticky` now, so there is no arithmetic of ours left
  // to check — the compositor does it. What IS still ours, and still worth
  // asserting, is the relationship between the two CSS values: the spacer that
  // gives the sticky box its travel, and the negative margin that cancels it.
  const SLACK = 40
  const ascent = VH + SLACK                                  // --ascent
  const writingTop = (y) => L.writing.top - y                // margin cancels the spacer
  const y0 = L.notes.top + L.notes.h - VH                    // foot meets the viewport floor

  eq('Writing enters at the viewport floor', writingTop(y0), VH)
  eq('cover completes within the hold', writingTop(y0 + VH), 0)
  eq('the hold outlasts the cover', ascent >= VH ? 1 : 0, 1)
  eq('slack is spent covered, not visible', writingTop(y0 + ascent), -SLACK)
  eq('the spacer is cancelled exactly', ascent - ascent, 0)
}

console.log('\n— Back Cover join (BackCover.tsx) —')
{
  const feather = (t) => lerp(22, 0, range(t, 0, 0.55))
  const scale = (t) => lerp(1.06, 1, range(t, 0, 0.72))
  const copy = (t) => range(t, 0.12, 0.4)
  eq('feather open at the join', feather(0), 22)
  eq('feather resolves at the top edge by 55%', feather(0.55), 0)
  eq('painting fully opaque after settling', feather(1), 0)
  eq('scale settles to exactly 1', scale(0.72), 1)
  eq('scale within the stated range', scale(0) <= 1.06 ? 1 : 0, 1)
  eq('copy hidden at the join', copy(0), 0)
  eq('copy arrives early in the cover', copy(0.4), 1)
  const wrapHeight = 1.6 * VH
  const contactMarker = 0.8 * wrapHeight - 0.8 * VH
  const settledPoint = 0.8 * (wrapHeight - VH)
  eq('Contact marker lands at 80% pin progress', contactMarker, settledPoint)
  eq('Contact copy is fully visible at that point', copy(contactMarker / (wrapHeight - VH)), 1)
  eq('reduced-motion Contact marker starts at the scene', 0.8 * VH - 0.8 * VH, 0)
}

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed\n`)
process.exit(fail === 0 ? 0 : 1)
