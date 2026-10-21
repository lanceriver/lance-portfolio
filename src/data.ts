/**
 * Content.
 *
 * All content is real, sourced from Lance's résumé. Nothing is invented.
 */

export type Plate = {
  numeral: string
  name: string
  tagline: string
  blurb: string
  discipline: string
  /** The painted plate. Worn has none: its screens are the picture. */
  src?: string
  srcSmall?: string
  alt?: string
  plateLabel?: string
  caption?: string
  points?: string[]
  href?: string
  repo?: string
  status?: string
  /** App screens, shown as figures beneath the plate. Real captures, cropped
      below the status bar; `src` is the 480w file, `src2x` the 960w. */
  screens?: Screen[]
}

export type Screen = { src: string; src2x: string; alt: string; caption: string }

export const projects: Plate[] = [
  {
    numeral: 'I',
    name: 'Pool Safety Solutions',
    tagline: 'a franchise network, in production',
    discipline: 'Junior Systems Engineer · 2026 to now',
    blurb: 'I took a franchise-management prototype and made it production software for a network operating across NSW, QLD and VIC.',
    points: [
      'Multi-tenant PostgreSQL with row-level security, so each franchise only ever sees its own data.',
      'Docker on AWS (Lightsail, ECR, S3, CloudFront) with separate staging and production, plus a Lambda and SQS pipeline that syncs GoHighLevel into Postgres.',
      'Stripe, Xero and GoHighLevel integrations, and about 470 automated tests gating every release through staging.',
    ],
    status: 'Internal system. No public link.',
    src: '/plates/coastal-road.webp',
    srcSmall: '/plates/coastal-road-1200.webp',
    alt: 'A painted coast road above a harbour, lemons and bougainvillea framing the view.',
    plateLabel: 'Plate I',
    caption: 'The coast road, late morning',
  },
  {
    numeral: 'II',
    name: 'Airtable Clone',
    tagline: 'a million rows, still quick',
    discipline: 'Next.js · TypeScript · tRPC · Prisma · PostgreSQL',
    blurb: 'Editable tables, views, filters and sorting. Pagination, memoisation and virtualisation keep a table responsive past a million rows.',
    href: 'https://airtable-clone-lyra.vercel.app/',
    repo: 'https://github.com/lanceriver/airtable-clone-lyra',
    src: '/plates/lake-terrace.webp',
    srcSmall: '/plates/lake-terrace-1200.webp',
    alt: 'A painted café terrace above a lake, striped awning, geraniums, snow peaks beyond.',
    plateLabel: 'Plate II',
    caption: 'The terrace, before the afternoon',
  },
  {
    numeral: 'III',
    name: 'Worn',
    tagline: 'your fit diary',
    discipline: 'Product + engineering',
    blurb: 'A personal outfit diary — for remembering what you wore, where you went, and how a fit actually felt. It keeps the record you would never keep by hand.',
    points: [
      'Garments are cut out of your own fit photos on the phone, with Vision instance masks and Core ML, so the wardrobe builds itself from what you actually wore.',
      'A rule-based outfit builder suggests new combinations of your own clothes from the occasion, the live weather, colour pairing and what you wore recently. No AI stylist.',
      'Cost-per-wear and worn-once stats come from the wear record, because every piece links back to the fits it appeared in.',
    ],
    status: 'In progress',
    screens: [
      {
        src: '/worn/wardrobe-480.webp',
        src2x: '/worn/wardrobe-960.webp',
        alt: 'Worn’s wardrobe screen: outerwear and tops hanging on rails — a black jacket, a brown parka, a camel overcoat, a white tee and a striped camp shirt.',
        caption: 'The wardrobe',
      },
      {
        src: '/worn/tonight-480.webp',
        src2x: '/worn/tonight-960.webp',
        alt: 'Worn’s outfit builder, built for tonight at 16°: a grey Harrington jacket, white camp shirt, black Derby shoes and dark jeans, with loved and another buttons.',
        caption: 'Built for tonight',
      },
      {
        src: '/worn/numbers-480.webp',
        src2x: '/worn/numbers-960.webp',
        alt: 'Worn’s numbers screen, “bought, worn, forgotten”: four pieces each worn only once, from 72 pieces and 37 fits.',
        caption: 'The numbers',
      },
    ],
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
    "slug": "two-years-of-national-service",
    "date": "May 2025",
    "iso": "2025-05-09",
    "title": "What I learned from two years of National Service",
    "standfirst": "Luck you cannot control, the difference between being good and being liked, and why staying in the middle was the whole strategy.",
    "src": "/plates/alpine-village-1200.webp",
    "alt": "A painted alpine high street in winter under a deep blue sky.",
    "caption": "The high street, mid-winter",
    "minutes": 6,
    "body": [
      {
        "t": "p",
        "text": "It's been exactly 523 days since my first post on this site, back when I was still donning the green uniform of the SAF. I like how I told myself this would be a good idea, an outlet for me to focus my energy on while going through the daily monotony of life in the army. Unfortunately, like too many of us can attest to, I never followed up. It's really easy to say \"Oh, I'll make this a habit\" but actually following through is a whole other ballgame. So anyways, what's new in my life? I'm back in Sydney, back in uni doing my CS degree, grinding for internships. It's been about 6 months since I finished NS, and the freedom of being a civilian again has its pros and cons. I've had a lot of time to reflect on the 2 years, a time that honestly feels like a lifetime away now. So here's my 2 cents on the whole experience."
      },
      {
        "t": "h2",
        "text": "It's All About Luck"
      },
      {
        "t": "p",
        "text": "Like many things in life, your NS experience is largely based on factors out of your control. This starts with the medical grade or \"PES\" grade they give you at the check-up before service. It may seem pretty structured but their grading system is known to have a few cracks. I've known people to have various health issues such as asthma, severe myopia, get a \"PES A\" grading, which allows them to be assigned to any combat vocation, while those with a history of past injuries (maybe they broke their arm in Year 3) get a \"PES C\" grading, allowing them to be assigned to \"easier\" vocations. How your grade gets assigned exactly is a mystery, so that's the first aspect of luck. You'll see a pattern emerge throughout your service, from the buddies you're assigned to the actual job you'll be doing for the 2 years. One guy might be out in the jungle on a 5 day outfield mission, while his best mate who enlisted with him is watching Netflix in an air-conditioned office. You might be assigned guard duty to stay in camp on a public holiday while all your buddies go home and enjoy a long weekend. Maybe that day the food at the cookhouse was way less edible than usual. The point I'm making is that as a \"loyal servant\" to the government for two years you don't have a lot of agency in these matters, so your 2 years are out of your control, unless you act on it. If you don't like your situation, you'll have to \"create your own luck\". A quick read of the NS subreddit will show you what I mean by this. I was very lucky to have very reasonable superiors who made my environment similar to that of a corporate one you might find in the civilian world, but getting to this point required me to create my own luck."
      },
      {
        "t": "h2",
        "text": "Don't Stand Out If You Don't Need To"
      },
      {
        "t": "p",
        "text": "I had an interaction with this uncle at VivoCity mall the day before I enlisted which really imprinted in me. He was running an eyeglass shop which I was visiting to get new glasses for enlistment - I didn't want to ruin my nice glasses with all the running and getting dirty I knew we were going to do. When I mentioned I was going into NS we had a nice long chat about the whole thing, a recurring conversation that I had with various taxi drivers throughout the 2 years. Since I just got back from 6 years in Australia I was scared and uncertain of what to expect, which I shared with him. He seemed like he was in his 60s, so I kind of expected him to rattle off the same boomer schtick \"Man up lah\", \"Back in my time ah, we didn't even have this\", \"This generation everything so easy ah why need to complain\". Instead he gave me this absolute gem:"
      },
      {
        "t": "quote",
        "text": "Boy, if you don't want to go OCS or SCS, stay in the middle. Don't be a wayang king, but also don't be a blur cock."
      },
      {
        "t": "p",
        "text": "For those of us not versed in Singlish, let me explain. A wayang king is someone who sucks up to his superiors, a know-it-all who tries to appear more impressive than he actually is. A blur cock is the opposite, a person so incompetent he drags down everyone around him. OCS and SCS are officer and sergeant training schools for those who want to become commanders. As an aside, the film Ah Boys to Men does an excellent job of portraying these characters, as well as NS life in basic training. But those words really stuck out to me. I had no interest in \"honour\" or \"glory\" or any kind of leadership role as a commander. From what my friends who already went in were telling me, it was extra work for not so extra pay. As far as I was concerned, I was here to do my 2 years and go back to Australia. So I went into basic training with his advice in my mind, and sure enough, I saw plenty of wayang kings and blur cocks. The biggest wayang king was in Section 3, and man did everyone hate him. He was constantly asking the sergeants if they needed help, feigning laughter at their jokes when it really wasn't that funny! - berating us in front of them for small infractions like not tucking in your shirt, which I doubt they would've noticed if he didn't point it out. There's a difference between following rules and just wanting to f--k over your buddies. He was clearly pretty good at the whole soldiering thing, and wow did he make everyone know it! If someone even dared to ask him a question, like how to apply camo properly, all we'd hear was \"Didn't Sergeant XXX teach you this already? You go ask him lah!\" Like does it really hurt to take a few minutes of your time and help a brother out? Then there was the blur cock. This guy was in my section, and wow did he make life interesting. For one - he was allergic to personal hygiene. We were supposed to change bedsheets every 2 weeks, and this brother changed it twice in the 4 months we were all together. After PT (Physical Training) or any activity where we had to get dirty and muddy, isn't it logical or simply hygienic to wash up before going on your bed? This brother did none of that, just lay down in bed muddy uniform be damned. Safe to say that the room stank! Of course, we tried to help out. We wanted to make him realise and teach him, maybe he just had no concept of it. But that's where we all got annoyed: He didn't want to listen. We tried to tell him nicely, but nothing ever got through to him. It didn't stay at hygiene, he was constantly late, which made the sergeants furious at us. His bearings (uniform standards) were always below par, and his marching was constantly out of time. All of this caused us to be punished frequently, with pushups, runs around the block, among others. We weren't mad at him for being blur, most of us recruits were - but the lack of accountability on his part is what did him in. So I guess that's where cock comes in for blur cock. As for me, I stayed out of trouble. I did stick out a little because of my background coming from Australia and all that, but for the most part I did what I had to do."
      },
      {
        "t": "h2",
        "text": "Being Good Is Not Enough"
      },
      {
        "t": "p",
        "text": "At the end of basic training every company votes for a Company Best, an award given to the soldier who displayed the most leadership and competent skills, a lock to be sent to OCS to become an officer. The guy who won was from my section, and he was basically who the wayang king wanted to be. Except, instead of berating he advised, he looked out for all of us in the section and the platoon. He was a natural with rifle handling and outfield training, which the other guy was too, but it's not enough to be good - you have to be liked too."
      }
    ]
  },
  {
    "slug": "a-little-bit-about-me",
    "date": "December 2023",
    "iso": "2023-12-03",
    "title": "A little bit about me",
    "standfirst": "The first post on the blog — why I started it, life in the army, how I got into programming, and what I thought was coming next.",
    "src": "/plates/lake-terrace-1200.webp",
    "alt": "A painted café terrace looking out across a lake to the mountains.",
    "caption": "A terrace above the lake",
    "minutes": 5,
    "body": [
      {
        "t": "p",
        "text": "As the first article on the blog I felt it was only right to talk a little bit about myself and why I've chosen to make this blog. I've always been intrigued by the notion of having your own personal blog where you can post your own thoughts, (mostly) unfiltered. And given my current circumstances, it was almost a no-brainer with the amount of free time I have."
      },
      {
        "t": "h2",
        "text": "Life in the army"
      },
      {
        "t": "p",
        "text": "I was called back in November 2022, before I could complete my first year of my Software Engineering degree at UNSW in Sydney. To be frank with you, I was very annoyed at the prospects of having my studies delayed by 2 years for something that I felt served absolutely no purpose. Why would Singapore ever go to war with anyone? Given that the punishment for not turning up was prison time, I grudgingly came back to serve."
      },
      {
        "t": "p",
        "text": "My first few months in Basic Military Training (BMT) were quite the eyeopener, learning to share a bunk with 12 other guys from all different walks of life. It was reassuring that some of them were in the same situation as me - coming back from overseas just to serve. The whole experience was entirely new to me, and the definite highlight (wrong word - most memorable?) was going on a 5D4N outfield in the dense jungles. Firing the SAR21 rifle at the range and throwing a live grenade were some other moments that I'll always take with me. After 4 months of training, we passed out as Privates and were sent to various training schools around Singapore to be trained in our new vocation."
      },
      {
        "t": "p",
        "text": "I was to be trained as an Automotive Technician specialising in armoured tracked vehicles such as the Hunter AFV. This was another entirely different environment with a very hands-on skillset, and let me be the first to tell you that I'm the complete opposite of that. We learned how to troubleshoot and identify parts on the vehicle, and really learn the inner workings of it. After about 3 months of this we passed out and were sent to Sungei Gedong camp, which was possibly the worst place to be if you were a soldier in the SAF. Singapore is always rightfully praised for how convenient everything is - but this camp was literally in the only part of Singapore still covered in jungle and plantations."
      },
      {
        "t": "p",
        "text": "As fate would have it, when we got there the new unit mentioned that they were looking for people interested to be in their new social media trial. Naturally, I raised my hand. Soon after, they appointed me the new media clerk and I was to ditch my technician coveralls for the No.4 uniform to be worn in the office, which is where I am today. I have about 11 months left as of this article being published, and then I'm off back to Sydney!"
      },
      {
        "t": "h2",
        "text": "Cut to the chase - what is the blog about?"
      },
      {
        "t": "p",
        "text": "Simply put, it's for me to jot down all my honest thoughts as I continue to learn the ins and outs of the developer world, and something I can refer to in the future if I ever forget how to center a div or invalidate a Cloudfront distribution."
      },
      {
        "t": "p",
        "text": "I got my start in programming when I was in Year 9 in high school, when they made us take a module which was an introduction to Python. I was instantly drawn to the problem-solving aspect, as I found myself spending hours every week on the weekly problem sets, such as writing a substitution cypher or drawing a turtle. The satisfaction I got from running the tests and showing that it passed are something that I can't get enough of."
      },
      {
        "t": "p",
        "text": "I decided that I wanted to make it as a career. With the encouragement of my dad - a software engineer himself - I enrolled at UNSW for a Bachelor's in Software Engineering (SENG). My first SENG course was COMP1511, a formal introduction to programming, similar to my Year 9 course. It was here where I was introduced to C, which for me, after only having experience in Python was a completely different playing field. What were all these curly braces for? Why is a semi-colon needed for each line? What the hell's a malloc? I'm not gonna sit here and pretend that I'm some C wizard, but it was very useful to learn what was going on closer to the hardware. Also, linked lists are cool."
      },
      {
        "t": "p",
        "text": "COMP1521 was all about systems, and it was here where I got a taste of Assembly - very interesting topic, but one that I'm not sure I will come back to any time soon."
      },
      {
        "t": "p",
        "text": "Funnily enough, the most fun I had so far was not from any uni class. During my time in the army my dad introduced me to something called the Cloud Resume Challenge. The premise was to deploy a static website with your resume on it, hosted on AWS and using various AWS services to make use of serverless architecture. Going through this challenge helped me add many tools to my toolbox - for front-end it was learning HTML, CSS and Javascript, and for the back-end using Python, AWS Lambda and DynamoDB. It also taught me the importance of writing quality tests, and design principles to look out for when desigining the aesthetics of your website UI (responsiveness), as well as CI/CD (my personal favourite)."
      },
      {
        "t": "p",
        "text": "This entire challenge was probably the most significant project I have done, so it deserves its own article (probably the next one - so keep your eyes peeled!)"
      },
      {
        "t": "h2",
        "text": "Future Plans"
      },
      {
        "t": "p",
        "text": "With this challenge under my belt, I'm quite drawn to the area of full-stack development. I like the idea of knowing both front-end and back-end, even though as of now I do enjoy back-end a little bit more. I'm looking to create a dynamic website and play around with them, and having a taste of the \"serverful\" approach rather than serverless to see which one I like better. Serverless is definitely a cool concept but I felt that it has some drawbacks which I will elaborate on in the next article."
      },
      {
        "t": "p",
        "text": "So that's a little bit about me, and I hope you got some insight into myself as a person and why I've decided to enter the developer world. Hope you'll stick around. See you in the next one!"
      }
    ]
  }
]



/**
 * The Field Notes swatch strip. Derived, not chosen: run
 *
 *     python3 scripts/sample-palette.py <image...> --count=7
 *
 * over whatever the prints on the desk currently are, and paste the result.
 * This list DESCRIBES the pictures; it never constrains which pictures may go
 * on the desk. Re-derive it whenever they change. D49.
 */
export const swatches = [
  { hex: '#F7E8D5', name: 'Snow, lit' },
  { hex: '#93B1D5', name: 'Snow shadow' },
  { hex: '#CE9B5B', name: 'Ochre' },
  { hex: '#0979E5', name: 'Cobalt' },
  { hex: '#2D70AF', name: 'Slate' },
  { hex: '#8F3C20', name: 'Umber' },
  { hex: '#5C3E25', name: 'Terracotta' },
]

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Notes', href: '#notes' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
]

export const contactLinks = [
  { label: 'GitHub', href: 'https://github.com/lanceriver', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lance-rivera', external: true },
  { label: 'Résumé', href: '/lance-rivera-resume.pdf', download: 'Lance-Rivera-Resume.pdf' },
]

export const email = 'lanceriver@gmail.com'
