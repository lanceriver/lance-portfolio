(() => {
  // Mock E: Experience as its own beat after About, organised along the
  // Singapore → Sydney route that sits under the About title. Two place
  // columns read left to right in time; entries use D's run-in grammar.
  // "Sydney" for Pool Safety is unconfirmed (résumé says NSW, QLD, VIC).
  const sec = document.querySelector('.crossing__experience');
  if (!sec || sec.dataset.mock) return 'already mocked or missing';
  const entries = [...sec.querySelectorAll('.crossing__experience-entry')].map((li) => {
    const [role, ...rest] = li.querySelector('.crossing__experience-role p').textContent.trim().split(' · ');
    const name = li.querySelector('.crossing__experience-role h4').textContent.trim();
    return {
      name,
      role,
      org: name,
      dates: [...rest, li.querySelector(".crossing__experience-dates").textContent.trim()].join(" · "),
      summary: li.querySelector('.crossing__experience-summary').textContent.trim(),
    };
  });
  const by = (n) => entries.find((e) => e.name.includes(n));
  const places = [
    { place: 'Singapore', span: '2022–2024', items: [by('Armed Forces')] },
    { place: 'Sydney', span: '2025–', items: [by('CSESoc'), by('Pool Safety')] },
  ];
  const resume = sec.querySelector('.crossing__resume-link').getAttribute('href');

  const css = `
  .xe { grid-column: 1 / -1; margin-top: clamp(28px, 3.4vw, 48px); }
  .xe__head { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; }
  .xe__title { margin: 0; font-family: var(--serif); font-weight: 400; color: var(--ink);
    font-size: clamp(30px, 3vw, 40px); line-height: 1; letter-spacing: -.025em; }
  .xe__resume { color: var(--ink-soft); font-size: 13px; text-decoration: underline;
    text-decoration-color: rgba(27,42,51,.35); text-underline-offset: 3px; }
  .xe__resume:hover { color: var(--ink); text-decoration-color: currentColor; }
  .xe__route { display: grid; grid-template-columns: minmax(0, .8fr) auto minmax(0, 1.2fr);
    column-gap: clamp(20px, 3vw, 44px); margin-top: clamp(26px, 3vw, 40px); }
  .xe__arrow { padding-top: 1px; font-family: var(--serif); font-size: 17px; line-height: 1.3; color: var(--ink-soft); }
  .xe__place { margin: 0 0 18px; padding-bottom: 10px; border-bottom: 1px solid rgba(27,42,51,.18);
    display: flex; align-items: baseline; gap: .6em; }
  .xe__place h4 { margin: 0; font-family: var(--serif); font-style: italic; font-weight: 400;
    font-size: 17px; line-height: 1.3; color: var(--ink); }
  .xe__place span { font-size: 12.5px; color: var(--ink-soft); font-variant-numeric: tabular-nums; }
  .xe__list { margin: 0; padding: 0; list-style: none; }
  .xe__entry { margin: 0; max-width: 60ch; padding-left: 1.4em; text-indent: -1.4em;
    font-family: var(--sans); font-size: 15.5px; line-height: 1.6; color: var(--ink-soft); text-wrap: pretty; }
  .xe__entry + .xe__entry { margin-top: 20px; }
  .xe__role { font-family: var(--serif); font-size: 19px; line-height: 1; color: var(--ink); letter-spacing: -.005em; }
  .xe__org { font-family: var(--serif); font-style: italic; font-size: 17.5px; color: var(--ink); white-space: nowrap; }
  .xe__dates { font-size: 13px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .xe__sep { color: rgba(27,42,51,.35); padding-inline: .3em; }

  @media (max-width: 760px) {
    .xe__route { grid-template-columns: minmax(0, 1fr); row-gap: 30px; }
    .xe__arrow { display: none; }
    .xe__entry { font-size: 15px; padding-left: 1em; text-indent: -1em; }
    .xe__role { font-size: 18px; }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const entry = (e) => `
    <li class="xe__entry"><span class="xe__role">${e.role}</span>, <span class="xe__org">${e.org}</span><span class="xe__sep" aria-hidden="true">·</span><span class="xe__dates">${e.dates}.</span> ${e.summary}</li>`;
  const col = (p) => `
    <div class="xe__col">
      <div class="xe__place"><h4>${p.place}</h4><span>${p.span}</span></div>
      <ol class="xe__list">${p.items.map(entry).join('')}</ol>
    </div>`;

  const block = document.createElement('section');
  block.className = 'xe';
  block.dataset.mock = '1';
  block.setAttribute('aria-labelledby', 'experience-title');
  block.innerHTML = `
    <div class="xe__head">
      <h3 id="experience-title" class="xe__title">Experience</h3>
      <a class="xe__resume" href="${resume}">View résumé</a>
    </div>
    <div class="xe__route">
      ${col(places[0])}
      <span class="xe__arrow" aria-hidden="true">→</span>
      ${col(places[1])}
    </div>`;
  sec.replaceWith(block);
  return 'mocked E';
})();
