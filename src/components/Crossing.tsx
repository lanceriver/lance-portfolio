import { useEffect, useRef } from 'react'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, mixHex } from '../lib/math'
import './crossing.css'

/**
 * The Crossing — rest, immediately after the Hero's spectacle.
 *
 * It used to carry the List of Plates as well, which cost about a screen and a
 * half before a reader reached a project. That list is summoned from the nav
 * now (see `PlateIndex`), and this section keeps only the two jobs nothing else
 * can do:
 *
 *  (a) the ground warms  hero-exit → snow-lit  across the
 *      section. It is the slowest thing on the site: imperceptible while it
 *      happens, obvious in retrospect. DECISIONS D3.
 *  (b) it anchors About: a brief introduction, interests, and a ruled record
 *      of experience in the same plate-book voice.
 *
 * The biography stays brief; the ruled experience register gives the About
 * section its practical context without changing its plate-book voice.
 */
export function Crossing() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const exitColor = useRef('')

  useEffect(() => {
    exitColor.current = getComputedStyle(document.documentElement)
      .getPropertyValue('--hero-exit').trim()
  }, [])

  /**
   * With motion reduced the scroll driver never runs, so the ground would stay
   * at its hero-exit value for the whole page. Resolve it to the settled warm
   * value instead; the Crossing paints its own static exit→lit gradient so the
   * join and warm-up both survive without animation.
   */
  useEffect(() => {
    if (!reduced) return
    const root = document.documentElement
    root.style.setProperty('--page-ground', '#f0eae0')
    return () => { root.style.removeProperty('--page-ground') }
  }, [reduced])

  useScrollDriver(() => {
    const el = ref.current
    if (!el || !exitColor.current) return
    // Spread the warm-up over the section PLUS a viewport. The section is
    // short now, and D3 wants this to be the slowest thing on the site —
    // imperceptible while it happens. Tying it to the section height alone
    // would make the colour shift visible.
    const span = el.offsetHeight + innerHeight
    const p = clamp((innerHeight * 0.62 - el.getBoundingClientRect().top) / span)
    const hex = exitColor.current
    const red = Number.parseInt(hex.slice(1, 3), 16)
    const blue = Number.parseInt(hex.slice(5, 7), 16)
    // A cool grey midpoint would make two warm grounds dip; the sampled cream
    // exit therefore goes straight to snow-lit. Cool plates keep the old path.
    const ground = red >= blue
      ? mixHex(hex, '#f0eae0', p)
      : p < 0.5
        ? mixHex(hex, '#d7dbe0', p / 0.5)
        : mixHex('#d7dbe0', '#f0eae0', (p - 0.5) / 0.5)
    return () => document.documentElement.style.setProperty('--page-ground', ground)
  }, !reduced)

  return (
    <section className="crossing" ref={ref} id="about" data-tone="dark" data-ground="page">
      <div className="shell crossing__inner">
        <div className="crossing__identity">
          <h2 className="display-r crossing__title">About.</h2>
          <p className="crossing__route">Singapore <span aria-hidden="true">→</span><span className="vh">to</span> Sydney</p>
        </div>
        <div className="crossing__bio">
          <p className="body">I’m a final-year computer science student at UNSW in Sydney, finishing in December 2026, and a Junior Systems Engineer at Pool Safety Solutions.</p>
          <p className="body">My eye for aesthetics carries into the software I build, especially Worn’s design language.</p>
        </div>
        <dl className="crossing__interests" aria-label="A few things I enjoy">
          <div>
            <dt>On foot</dt>
            <dd>Going for walks.</dd>
          </div>
          <div>
            <dt>At the keys</dt>
            <dd>Learning to play piano.</dd>
          </div>
          <div>
            <dt>Out and about</dt>
            <dd>Cafés and places with character.</dd>
          </div>
        </dl>
        <section className="crossing__experience" aria-labelledby="experience-title">
          <div className="crossing__experience-heading">
            <h3 id="experience-title" className="crossing__experience-title">Experience</h3>
            <a className="crossing__resume-link" href="/lance-rivera-resume.pdf">View résumé</a>
          </div>
          <ol className="crossing__experience-list">
            <li className="crossing__experience-entry">
              <p className="crossing__experience-dates">Mar 2026–present</p>
              <div className="crossing__experience-role">
                <h4>Pool Safety Solutions</h4>
                <p>Junior Systems Engineer</p>
              </div>
              <p className="crossing__experience-summary">Productionised a franchise prototype across NSW, Queensland and Victoria, including a multi-tenant PostgreSQL platform with row-level security. Built Docker services on AWS Lightsail, ECR, S3 and CloudFront, plus a Lambda/SQS pipeline syncing GoHighLevel. Integrated Stripe and Xero through APIs and webhooks, with roughly 470 tests and staged CI/CD supporting releases.</p>
            </li>
            <li className="crossing__experience-entry">
              <p className="crossing__experience-dates">Mar–Dec 2025</p>
              <div className="crossing__experience-role">
                <h4>UNSW CSESoc</h4>
                <p>Marketing Subcommittee</p>
              </div>
              <p className="crossing__experience-summary">Created content for an audience of 9,000+ followers, with 50,000+ cumulative views.</p>
            </li>
            <li className="crossing__experience-entry">
              <p className="crossing__experience-dates">Nov 2022–Nov 2024</p>
              <div className="crossing__experience-role">
                <h4>Singapore Armed Forces</h4>
                <p>Administrative Assistant · National Service</p>
              </div>
              <p className="crossing__experience-summary">Coordinated a VBA automation that reduced processing time by 90%, and built a Telegram bot using JavaScript and Google Apps Script.</p>
            </li>
          </ol>
        </section>
      </div>
    </section>
  )
}
