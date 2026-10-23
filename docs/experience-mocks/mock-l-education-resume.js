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
  // Layout L (after F): a sticky sidebar under "Experience" with the one fact
  // the roles don't carry, the degree (from the résumé), and a home for the
  // résumé link. Pinned while the roles scroll; on phones it sits under the
  // heading. The arrow nudges on hover like Writing's "Read →".
  const xf = document.querySelector('.xf');
  const aside = document.createElement('div');
  aside.className = 'xl';
  xf.prepend(aside);
  aside.append(xf.querySelector('.xf__title'));
  const block = document.createElement('div');
  block.className = 'xl__side';
  block.innerHTML = `
    <dl class="xl__edu">
      <dt>Education</dt>
      <dd><span class="xl__deg">BSc Computer Science</span><span class="xl__where">UNSW · finishing December 2026</span></dd>
    </dl>
    <a class="xl__resume" href="/lance-rivera-resume.pdf">View full résumé <span class="xl__arrow" aria-hidden="true">→</span></a>`;
  aside.append(block);
  const style = document.createElement('style');
  style.textContent = `
  .xl__side { margin-top: 26px; max-width: 300px; }
  .xl__edu { margin: 0; padding: 14px 0 16px; border-top: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); }
  .xl__edu dt { font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); }
  .xl__edu dd { margin: 8px 0 0; }
  .xl__deg { display: block; font-family: var(--serif); font-size: 19px; line-height: 1.25; color: var(--ink); }
  .xl__where { display: block; margin-top: 4px; font-family: var(--sans); font-size: 13px; color: var(--ink-soft); }
  .xl__resume { display: inline-block; margin-top: 18px; font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); text-decoration: none; }
  .xl__arrow { display: inline-block; transition: transform .3s var(--ease-lift); }
  .xl__resume:hover .xl__arrow, .xl__resume:focus-visible .xl__arrow { transform: translateX(5px); }
  @media (min-width: 901px) {
    .xl { position: sticky; top: calc(var(--nav-h) + 16px); align-self: start; }
    .xl__side { margin-top: clamp(30px, 3.4vw, 44px); }
  }`;
  document.head.appendChild(style);
  return 'layout L';
})();
