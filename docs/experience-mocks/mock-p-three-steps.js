(() => {
  // Mock F: organised like brittanychiang.com's Experience, set in the site's
  // own language. Heading in the left column (where "About." is), roles in the
  // right column under the bio. Each role: dates | role · employer, summary,
  // tags. Dates use the site's tracked label; role lines are Georgia roman and
  // go italic when hovered (Writing D46), sized by a hidden italic copy so
  // nothing reflows (D47). Others dim. Tags are hairline-ruled, square.
  // Tags are lifted only from each summary's own wording; CSESoc has none.
  // The résumé link is removed while Lance decides where it goes.
  const sec = document.querySelector('.crossing__experience');
  if (!sec || sec.dataset.mock) return 'already mocked or missing';
  const tags = {
    'Pool Safety': ['PostgreSQL', 'Docker', 'AWS', 'Lambda', 'SQS', 'Stripe', 'Xero', 'CI/CD'],
    'Armed Forces': ['VBA', 'JavaScript', 'Google Apps Script', 'Telegram'],
  };
  const entries = [...sec.querySelectorAll('.crossing__experience-entry')].map((li) => {
    const name = li.querySelector('.crossing__experience-role h4').textContent.trim();
    const [role, ...rest] = li.querySelector('.crossing__experience-role p').textContent.trim().split(' · ');
    const key = Object.keys(tags).find((k) => name.includes(k));
    return {
      name, role, note: rest.join(' · '),
      dates: li.querySelector('.crossing__experience-dates').textContent.trim(),
      summary: li.querySelector('.crossing__experience-summary').textContent.trim(),
      tags: key ? tags[key] : [],
    };
  });

  const css = `
  .xf { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(250px, .78fr) minmax(0, 1.22fr);
    column-gap: clamp(40px, 7vw, 100px); align-items: start; margin-top: clamp(24px, 3vw, 40px); }
  .xf__title { margin: 0; font-family: var(--serif); font-weight: 400; color: var(--ink);
    font-size: clamp(30px, 3vw, 40px); line-height: 1; letter-spacing: -.025em; }
  .xf__list { margin: 0; padding: 0; list-style: none; max-width: 740px; }
  .xf__item + .xf__item { margin-top: clamp(36px, 4vw, 48px); }
  .xf__card { display: grid; grid-template-columns: 172px minmax(0, 1fr); column-gap: 20px;
    transition: opacity .34s var(--ease-settle); }
  .xf__dates { margin: 0; padding-top: 6px; font-family: var(--sans); font-size: 11px; font-weight: 500; line-height: 1.5;
    letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); white-space: nowrap; font-variant-numeric: tabular-nums; }
  .xf__role { margin: 0; display: grid; font-family: var(--serif); font-weight: 400; color: var(--ink);
    font-size: clamp(18px, 1.55vw, 21px); line-height: 1.25; letter-spacing: -.005em; }
  .xf__role > span { grid-area: 1 / 1; }
  .xf__role .xf__sizer { font-style: italic; visibility: hidden; }
  .xf__dot { padding-inline: .3em; color: var(--ink-soft); }
  .xf__note { display: block; margin-top: 4px; font-family: var(--sans); font-size: 13px; line-height: 1.4; color: var(--ink-soft); }
  .xf__summary { margin: 10px 0 0; font-family: var(--sans); font-size: 15.5px; line-height: 1.6; color: var(--ink-soft); }
  .xf__tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0 0; padding: 0; list-style: none; }
  .xf__tags li { padding: 3px 9px 4px; border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
    color: var(--ink-soft); font-family: var(--sans); font-size: 12px; line-height: 1.4; }

  @media (hover: hover) and (min-width: 1024px) {
    .xf__list:hover .xf__card { opacity: .45; }
    .xf__list .xf__card:hover { opacity: 1; }
    .xf__card:hover .xf__shown { font-style: italic; }
  }
  @media (max-width: 900px) {
    .xf { grid-template-columns: minmax(0, 1fr); row-gap: 22px; }
  }
  @media (max-width: 600px) {
    .xf__card { grid-template-columns: minmax(0, 1fr); }
    .xf__dates { padding-top: 0; margin-bottom: 6px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .xf__card { transition: none; }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const line = (e) => `${e.role}<span class="xf__dot" aria-hidden="true">·</span><span class="vh">at </span>${e.name}`;
  const block = document.createElement('section');
  block.className = 'xf';
  block.dataset.mock = '1';
  block.setAttribute('aria-labelledby', 'experience-title');
  block.innerHTML = `
    <h3 id="experience-title" class="xf__title">Experience</h3>
    <ol class="xf__list">${entries.map((e) => `
      <li class="xf__item"><div class="xf__card">
        <p class="xf__dates" aria-label="${e.dates.replace('–', ' to ')}">${e.dates.replace('–', ' — ')}</p>
        <div>
          <h4 class="xf__role"><span class="xf__shown">${line(e)}</span><span class="xf__sizer" aria-hidden="true">${line(e)}</span></h4>
          ${e.note ? `<p class="xf__note">${e.note}</p>` : ''}
          <p class="xf__summary">${e.summary}</p>
          ${e.tags.length ? `<ul class="xf__tags" aria-label="Technologies used">${e.tags.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
        </div>
      </div></li>`).join('')}
    </ol>`;
  sec.replaceWith(block);
  return 'mocked F';
})();

(() => {
  // Layout M (after F): K + L + a pinned About. The left column becomes one
  // sidebar: "About." and the route, the interests stacked, then the degree
  // and the résumé link. It stays pinned while the bio and Experience scroll
  // in the right column, but only when the window is tall enough to show all
  // of it; on short screens it scrolls normally. Phones: one column in
  // reading order (title, bio, interests, Experience, education, résumé).
  const inner = document.querySelector('.crossing__inner');
  const identity = inner.querySelector('.crossing__identity');
  const bio = inner.querySelector('.crossing__bio');
  const dl = inner.querySelector('.crossing__interests');
  const xf = inner.querySelector('.xf');
  const side = document.createElement('div');
  side.className = 'xm__side';
  const main = document.createElement('div');
  main.className = 'xm__main';
  const edu = document.createElement('div');
  edu.className = 'xm__edu';
  edu.innerHTML = `
    <dl class="xm__deg">
      <dt>Education</dt>
      <dd><span class="xm__name">BSc Computer Science</span><span class="xm__where">UNSW · finishing December 2026</span></dd>
    </dl>
    <a class="xm__resume" href="/lance-rivera-resume.pdf">View full résumé <span class="xm__arrow" aria-hidden="true">→</span></a>`;
  side.append(identity, dl, edu);
  main.append(bio, xf);
  inner.prepend(side, main);
  dl.classList.add('xm__interests');

  const rule = 'color-mix(in srgb, var(--ink) 22%, transparent)';
  const style = document.createElement('style');
  style.textContent = `
  .crossing__inner { align-items: start !important; }
  .xm__side, .xm__main { min-width: 0; }
  .xf { display: block; margin-top: clamp(40px, 4.6vw, 64px); }
  .xf__title { margin-bottom: clamp(26px, 3vw, 36px); }

  .crossing__interests.xm__interests { display: block; padding: 0; border: 0; margin-top: clamp(36px, 4vw, 52px); max-width: 300px; }
  .crossing__interests.xm__interests > div,
  .crossing__interests.xm__interests > div:first-child { padding: 13px 0; border-left: 0; border-top: 1px solid ${rule}; }
  .crossing__interests.xm__interests > div:last-child { border-bottom: 1px solid ${rule}; }
  .crossing__interests.xm__interests dd { margin-top: 5px; font-size: 18px; }

  .xm__edu { margin-top: 28px; max-width: 300px; }
  .xm__deg { margin: 0; }
  .xm__deg dt { font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); }
  .xm__deg dd { margin: 6px 0 0; }
  .xm__name { display: block; font-family: var(--serif); font-size: 18px; line-height: 1.25; color: var(--ink); }
  .xm__where { display: block; margin-top: 3px; font-family: var(--sans); font-size: 13px; color: var(--ink-soft); }
  .xm__resume { display: inline-block; margin-top: 18px; font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); text-decoration: none; }
  .xm__arrow { display: inline-block; transition: transform .3s var(--ease-lift); }
  .xm__resume:hover .xm__arrow, .xm__resume:focus-visible .xm__arrow { transform: translateX(5px); }

  @media (min-width: 901px) and (min-height: 680px) {
    .xm__side { position: sticky; top: calc(var(--nav-h) + 8px); }
  }
  @media (max-width: 900px) {
    .xm__side, .xm__main { display: contents; }
    .crossing__identity { order: 1; }
    .crossing__bio { order: 2; }
    .crossing__interests.xm__interests { order: 3; margin-top: 0; max-width: none; }
    .xf { order: 4; margin-top: 8px; }
    .xm__edu { order: 5; margin-top: 8px; max-width: none; }
  }`;
  document.head.appendChild(style);
  return 'layout M';
})();

(() => {
  // Layout O (after F + M), per Impeccable's craft floor ("delete the label
  // and let the heading speak") and a typeset pass on About, which had ~10
  // tracked-caps items. Changes:
  //  - no visible "Experience" heading; the bio runs straight into the roles,
  //    whose dated role · employer lines say what they are. A visually hidden
  //    h3 keeps the section labelled for screen readers.
  //  - dates move from tracked caps to the 13px metadata role, in Lance's own
  //    form ("Mar 2026–present").
  //  - the résumé link is a plain underlined link, not tracked caps; its arrow
  //    eases with --ease-settle (the detector flags --ease-lift as bounce).
  document.querySelector('.xf__title').className = 'xf__title vh';
  const r = document.querySelector(".xm__resume");
  r.firstChild.replaceWith(Object.assign(document.createElement("span"), { className: "xo__label", textContent: "View full résumé" }), " ");
  document.querySelectorAll('.xf__dates').forEach((p) => { p.textContent = p.textContent.replace(' — ', '–'); });
  const style = document.createElement('style');
  style.textContent = `
  .xf { margin-top: clamp(52px, 6vw, 84px); }
  .xf__card { grid-template-columns: 148px minmax(0, 1fr); }
  .xf__dates { padding-top: 4px; font-size: 13px; font-weight: 400; letter-spacing: 0; text-transform: none; }
  .xm__resume { font-size: 14px; font-weight: 400; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .xo__label { text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--ink) 35%, transparent); text-underline-offset: 3px; }
  .xm__resume:hover .xo__label, .xm__resume:focus-visible .xo__label { text-decoration-color: currentColor; }
  .xm__arrow { transition: transform .34s var(--ease-settle); }
  @media (max-width: 900px) { .xf { margin-top: 20px; } }
  @media (max-width: 600px) { .xf__card { grid-template-columns: minmax(0, 1fr); } .xf__dates { padding-top: 0; } }`;
  document.head.appendChild(style);
  return 'layout O';
})();

(() => {
  // Layout P (after F + M + O): the About section's text collapses to three
  // steps plus the display title and one tracked label size, fixing the
  // too-close sizes on O (12/13/14/15.5/17/18px):
  //   13px    metadata: dates, "National Service", degree line, tags, résumé link
  //   17px    reading:  the site's .body (bio), role summaries, route line
  //   21px    titles:   role · employer lines, interests, the degree
  //   11.5px  labels:   ON FOOT … EDUCATION (one size, was 11 and 11.5)
  // Impeccable's static scan still reports flat-type-hierarchy: it can't
  // resolve "About."'s clamp() size, so it sees 13–21px only. Rendered,
  // the range is 11.5px to ~90–100px.
  const style = document.createElement('style');
  style.textContent = `
  .xf__summary { font-size: 17px; line-height: 1.6; }
  .xf__tags li { font-size: 13px; }
  .xm__resume { font-size: 13px; }
  .xf__role { font-size: 21px; }
  .crossing__interests.xm__interests dd { font-size: 21px; line-height: 1.25; }
  .xm__name { font-size: 21px; }
  .xm__deg dt { font-size: 11.5px; letter-spacing: .16em; }
  @media (max-width: 600px) { .xf__role, .crossing__interests.xm__interests dd, .xm__name { font-size: 20px; } }`;
  document.head.appendChild(style);
  return 'layout P';
})();
