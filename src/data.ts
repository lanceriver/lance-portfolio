/**
 * Content.
 *
 * Worn is the only real project. Everything else is demo copy and is written to
 * read as demo copy. No employers, clients, awards, metrics, user counts,
 * revenue, performance claims, job titles or honours are invented anywhere in
 * this file. DESIGN_DIRECTION §6.3, DECISIONS D14.
 */

export type Plate = {
  numeral: string
  name: string
  tagline: string
  blurb: string
  discipline: string
  src: string
  srcSmall: string
  alt: string
  plateLabel: string
  caption: string
  real?: boolean
}

export const projects: Plate[] = [
  {
    numeral: 'I',
    name: 'Worn',
    tagline: 'your fit diary',
    blurb:
      'A personal outfit diary — for remembering what you wore, where you went, and how a fit actually felt. It keeps the record you would never keep by hand.',
    discipline: 'Product + engineering',
    src: '/plates/coastal-road.webp',
    srcSmall: '/plates/coastal-road-1200.webp',
    alt: 'A painted coast road above a harbour, lemons and bougainvillea framing the view.',
    plateLabel: 'Plate I',
    caption: 'The coast road, late morning',
    real: true,
  },
  {
    numeral: 'II',
    name: 'Tableline',
    tagline: 'data without the drag',
    blurb:
      'A spreadsheet-shaped workspace for datasets that have outgrown a spreadsheet. Demo project for this prototype.',
    discipline: 'Software engineering',
    src: '/plates/lake-terrace.webp',
    srcSmall: '/plates/lake-terrace-1200.webp',
    alt: 'A painted café terrace above a lake, striped awning, geraniums, snow peaks beyond.',
    plateLabel: 'Plate II',
    caption: 'The terrace, before the afternoon',
  },
  {
    numeral: 'III',
    name: 'Fieldguide',
    tagline: 'visual research notes',
    blurb:
      'A compact place to collect references, fragments and half-formed interface ideas without it turning into a dashboard. Demo project.',
    discipline: 'Interface systems',
    src: '/plates/hill-path.webp',
    srcSmall: '/plates/hill-path-1200.webp',
    alt: 'A painted snowy village path, a walker in a red coat, a church spire and a frozen lake.',
    plateLabel: 'Plate III',
    caption: 'The path down to the village',
  },
  {
    numeral: 'IV',
    name: 'Daybook',
    tagline: 'small notes, kept well',
    blurb:
      'A light daily log for observations, links and experiments, in one calm place. Demo project.',
    discipline: 'Small software',
    src: '/plates/alpine-village.webp',
    srcSmall: '/plates/alpine-village-1200.webp',
    alt: 'A painted alpine high street under a cobalt sky, snow underfoot, mountains behind.',
    plateLabel: 'Plate IV',
    caption: 'The high street, mid-winter',
  },
]

/** A block of article body copy. Deliberately not HTML: the renderer sets each
 *  kind with its own typography, and nothing in `data.ts` can inject markup. */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'quote'; text: string }

export type Article = {
  /** URL segment. Hand-authored and short — these are permanent once shared. */
  slug: string
  date: string
  /** ISO date, for <time> and for ordering. */
  iso: string
  title: string
  standfirst: string
  src: string
  alt: string
  /** Caption for the plate at the head of the post. */
  caption: string
  /** Minutes, rounded. Written down rather than computed so it cannot drift
   *  from the real reading time once these become real posts. */
  minutes: number
  body: Block[]
}

export const articles: Article[] = [
  {
    slug: 'portfolio-that-feels-like-somewhere',
    date: 'September 2026',
    iso: '2026-09-04',
    title: 'Designing a portfolio that feels like somewhere',
    standfirst: 'Demo article — on atmosphere, motion, and visual continuity between sections.',
    src: '/plates/hill-path-1200.webp',
    alt: 'A painted snowy village path leading down towards a frozen lake.',
    caption: 'The path down to the lake',
    minutes: 6,
    body: [
      { t: 'p', text: 'Most portfolios are a list of things that happened. They are organised the way a CV is organised, because a CV is what they grew out of, and they read the way a filing cabinet reads. Nothing is wrong with any single page of them. They are simply nowhere.' },
      { t: 'p', text: 'The alternative is not more decoration. It is to decide that the site is a place, and then to be consistent about the rules of that place — where the light comes from, what the ground is made of, what happens at the edges.' },
      { t: 'h2', text: 'The ground is the argument' },
      { t: 'p', text: 'A page has a ground whether or not anyone chose it. Most of the time nobody did, and it is white, and every section floats on it unrelated to every other. Choosing the ground — and then moving it, slowly, across the length of the page — does more for continuity than any transition.' },
      { t: 'p', text: 'Here the ground starts as the exact colour of the last row of pixels in the opening painting, and warms over the following screen and a half. It is imperceptible while it happens and obvious in retrospect, which is the correct ratio for anything structural.' },
      { t: 'quote', text: 'If you can see the transition, it is doing too much. If you can see where it stopped, it did too little.' },
      { t: 'h2', text: 'Motion is a claim about physics' },
      { t: 'p', text: 'Every animation asserts something about what things are made of. A crossfade says the two states were never objects at all. A card that slides in from the left says there is more page over there. Most interfaces make these claims accidentally and then contradict them a section later.' },
      { t: 'p', text: 'It is worth writing the claims down before building anything, in the same way a house style is written down: four verbs, a fixed set of easings, and a rule that adjacent sections may never enter the same way. The constraint is what produces the variety, not the other way round.' },
      { t: 'h2', text: 'Where it stops' },
      { t: 'p', text: 'The hardest discipline is deciding which parts stay still. A painting that drifts on scroll is a painting nobody trusts; a section that never rests is a section nobody reads. Stillness has to be allocated as deliberately as movement, and it has to be defended when the temptation to add one more thing arrives — which it does, every time, near the end.' },
    ],
  },
  {
    slug: 'interface-out-of-the-way',
    date: 'August 2026',
    iso: '2026-08-12',
    title: 'When the interface should get out of the way',
    standfirst: 'Demo article — on letting imagery and structure carry the weight.',
    src: '/plates/coastal-road-1200.webp',
    alt: 'A painted coast road curving above a harbour.',
    caption: 'The coast road, late afternoon',
    minutes: 4,
    body: [
      { t: 'p', text: 'There is a reflex, when a page looks empty, to add controls. A filter bar. A set of tabs. A card with a border around it so the content knows where it lives. Each one is defensible on its own and the sum of them is a dashboard nobody asked for.' },
      { t: 'h2', text: 'Borders are an admission' },
      { t: 'p', text: 'A box drawn around content is usually a confession that the spacing was not decided. Space separates things perfectly well when the intervals are chosen rather than defaulted. A hairline rule is a typographic mark and earns its place; a rectangle is furniture.' },
      { t: 'p', text: 'The test is simple enough to apply honestly: remove the border and look again. If the layout collapses, the problem was never the border.' },
      { t: 'quote', text: 'Restraint is not the absence of decisions. It is the residue of a great many of them.' },
      { t: 'h2', text: 'What carries the weight instead' },
      { t: 'p', text: 'Scale, interval, and one strong image will carry a page further than any amount of chrome. When the imagery is genuinely good, the job of the interface is to frame it and then stop talking — which is much harder than it sounds, because stopping produces no visible work.' },
    ],
  },
  {
    slug: 'small-software-carefully-made',
    date: 'July 2026',
    iso: '2026-07-21',
    title: 'Small software, carefully made',
    standfirst: 'Demo article — on restraint, scope, and the engineering decisions behind it.',
    src: '/plates/lake-terrace-1200.webp',
    alt: 'A painted café terrace looking out across a lake to the mountains.',
    caption: 'A terrace above the lake',
    minutes: 5,
    body: [
      { t: 'p', text: 'Small software is not unambitious software. It is software that has decided what it is not going to do, and has written that down somewhere it cannot be quietly forgotten.' },
      { t: 'h2', text: 'Dependencies are a position' },
      { t: 'p', text: 'Every dependency is a bet that someone else will care about your problem for as long as you do. Sometimes that bet is obviously correct. Often it is taken without being noticed at all — a router for two routes, a state library for one flag, a date library for one format string.' },
      { t: 'p', text: 'The honest version of the question is not \u201cis this library good?\u201d but \u201cwhat is the smallest thing that solves this, and can I read all of it?\u201d' },
      { t: 'h2', text: 'Verification you can actually run' },
      { t: 'p', text: 'Interfaces that depend on scroll position and animation frames are notoriously hard to test, so most of the time nobody does. But the arithmetic underneath them is ordinary arithmetic, and arithmetic can be pulled out into functions and checked in a plain script with no browser at all.' },
      { t: 'quote', text: 'If the logic can only be confirmed by looking at it, it will eventually be wrong and nobody will notice.' },
      { t: 'p', text: 'What is left after that is genuinely visual, and genuinely needs eyes. That is a much smaller set of things, and it is worth having it be small, because it is the part that does not scale.' },
    ],
  },
  {
    slug: 'drawing-before-building',
    date: 'June 2026',
    iso: '2026-06-09',
    title: 'Notes on drawing before building',
    standfirst: 'Demo article — on sketching an interface before any of it is real.',
    src: '/plates/alpine-village-1200.webp',
    alt: 'A painted alpine high street in winter under a deep blue sky.',
    caption: 'The high street, mid-winter',
    minutes: 4,
    body: [
      { t: 'p', text: 'Drawing an interface before building it is not about producing a picture to implement. It is about finding out what you actually think, quickly, while changing your mind is still free.' },
      { t: 'h2', text: 'The cost of finding out late' },
      { t: 'p', text: 'A bad idea costs a minute on paper, an afternoon in a design tool, and a week in code — by which point it has acquired tests, edge cases, and at least one person prepared to defend it. The order in which you discover things determines how expensive being wrong is.' },
      { t: 'quote', text: 'Sketching is not the first step of building. It is a separate activity that happens to reduce how much building you do.' },
      { t: 'h2', text: 'Draw the hard part' },
      { t: 'p', text: 'The instinct is to draw the parts that are pleasant to draw. The useful move is the opposite: go straight at the transition you are unsure about, the state you are hoping will not come up, the screen where the content is three times longer than the example.' },
      { t: 'p', text: 'If it survives being drawn badly, it will probably survive being built.' },
    ],
  },
]


export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Notes', href: '#notes' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
]
