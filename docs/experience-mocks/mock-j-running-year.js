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
  // Layout J (after F): a running year. Under "Experience" in the left column,
  // a large Georgia numeral (old-style figures) shows the start year of the
  // role you're reading, with that employer beneath in italic. It's pinned
  // while the roles scroll and changes with a short settle. Desktop only.
  const xf = document.querySelector('.xf');
  const items = [...xf.querySelectorAll('.xf__item')];
  const data = items.map((li) => ({
    year: li.querySelector('.xf__dates').textContent.trim().match(/\d{4}/)[0],
    name: li.querySelector('.xf__shown').textContent.split('·').pop().replace(/^\s*at\s*/, '').trim(),
  }));
  const aside = document.createElement('div');
  aside.className = 'xj';
  xf.prepend(aside);
  aside.append(xf.querySelector('.xf__title'));
  const run = document.createElement('div');
  run.className = 'xj__run';
  run.setAttribute('aria-hidden', 'true');
  run.innerHTML = `<span class="xj__year"></span><span class="xj__name"></span>`;
  aside.append(run);
  const style = document.createElement('style');
  style.textContent = `
  .xj__run { display: none; }
  @media (min-width: 901px) {
    .xj { position: sticky; top: calc(var(--nav-h) + 16px); align-self: start; }
    .xj__run { display: block; margin-top: clamp(28px, 3vw, 40px); }
    .xj__year { display: block; font-family: var(--serif); font-weight: 400; color: var(--ink); font-size: clamp(64px, 7vw, 100px); line-height: .9; letter-spacing: -.035em; font-variant-numeric: oldstyle-nums; }
    .xj__name { display: block; margin-top: 14px; font-family: var(--serif); font-style: italic; font-size: 17px; color: var(--ink-soft); }
    .xj__run > span { transition: opacity .34s var(--ease-settle), transform .5s var(--ease-settle); }
    .xj__run.is-swapping > span { opacity: 0; transform: translateY(8px); }
    @media (prefers-reduced-motion: reduce) { .xj__run > span { transition: none; } }
  }`;
  document.head.appendChild(style);
  const y = run.querySelector('.xj__year');
  const n = run.querySelector('.xj__name');
  let cur = -1;
  const show = (i) => {
    if (i === cur) return;
    const first = cur < 0;
    cur = i;
    const set = () => { y.textContent = data[i].year; n.textContent = data[i].name; run.classList.remove('is-swapping'); };
    if (first) return set();
    run.classList.add('is-swapping');
    setTimeout(set, 220);
  };
  show(0);
  // the role you are reading: the last one whose top has passed 45% of the viewport
  const spy = () => { let k = 0; items.forEach((li, i) => { if (li.getBoundingClientRect().top < innerHeight * 0.45) k = i; }); show(k); };
  addEventListener("scroll", spy, { passive: true });
  items.forEach((li, i) => { li.addEventListener('mouseenter', () => show(i)); });
  return 'layout J';
})();
