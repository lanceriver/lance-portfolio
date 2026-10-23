(() => {
  // Mock A: the lead entry. Pool Safety as a feature, the others compact.
  // One figure per role sits in the margin. All of Lance's wording kept.
  const list = document.querySelector('.crossing__experience-list');
  if (!list || list.dataset.mock) return 'already mocked or missing';
  const entries = [...list.querySelectorAll('.crossing__experience-entry')].map((li) => ({
    dates: li.querySelector('.crossing__experience-dates').textContent.trim(),
    name: li.querySelector('.crossing__experience-role h4').textContent.trim(),
    role: li.querySelector('.crossing__experience-role p').textContent.trim(),
    summary: li.querySelector('.crossing__experience-summary').textContent.trim(),
  }));
  // the figure each entry's own sentence already states
  const figures = [
    { n: '470', unit: 'tests, roughly' },
    { n: '9,000+', unit: 'followers' },
    { n: '90%', unit: 'less processing time' },
  ];

  const css = `
  .xa { margin: 0; padding: 0; list-style: none; border-top: 1px solid rgba(27,42,51,.24); }
  .xa__row {
    display: grid; grid-template-columns: clamp(130px, 13vw, 190px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 44px); padding: 22px 0 24px;
    border-bottom: 1px solid rgba(27,42,51,.24);
  }
  .xa__fig { grid-column: 1; grid-row: 1 / span 3; align-self: start; padding-top: 6px; }
  .xa__n {
    display: block; font-family: var(--serif); font-weight: 400; color: var(--ink);
    font-size: clamp(30px, 2.6vw, 38px); line-height: 1; letter-spacing: -.02em;
    font-variant-numeric: oldstyle-nums;
  }
  .xa__unit { display: block; margin-top: 6px; font-family: var(--serif); font-style: italic; font-size: 15px; color: var(--ink-soft); }
  .xa__name { grid-column: 2; margin: 0; font-family: var(--serif); font-weight: 400; color: var(--ink);
    font-size: clamp(24px, 2.2vw, 30px); line-height: 1.1; letter-spacing: -.02em; }
  .xa__meta { grid-column: 2; margin: 6px 0 0; font-family: var(--sans); font-size: 13.5px; color: var(--ink-soft); }
  .xa__meta i { font-style: normal; opacity: .55; padding-inline: .45em; }
  .xa__summary { grid-column: 2; margin: 12px 0 0; max-width: 64ch; font-size: 16px; line-height: 1.6; color: var(--ink-soft); }

  /* the lead: the paid role gets the page */
  .xa__row--lead { padding: 30px 0 34px; }
  .xa__row--lead .xa__n { font-size: clamp(64px, 7vw, 104px); letter-spacing: -.04em; }
  .xa__row--lead .xa__unit { font-size: 17px; }
  .xa__row--lead .xa__name { font-size: clamp(46px, 5.2vw, 76px); line-height: .98; letter-spacing: -.035em; }
  .xa__row--lead .xa__meta { margin-top: 12px; font-size: 14px; }
  .xa__row--lead .xa__summary { margin-top: 20px; font-size: 18px; line-height: 1.62; color: var(--ink); max-width: 60ch; }

  @media (max-width: 560px) {
    .xa__row { grid-template-columns: minmax(0, 1fr); padding: 18px 0 20px; }
    .xa__fig { grid-column: 1; grid-row: auto; padding: 0 0 10px; display: flex; align-items: baseline; gap: 8px; }
    .xa__unit { margin: 0; }
    .xa__name, .xa__meta, .xa__summary { grid-column: 1; }
    .xa__row--lead .xa__n { font-size: 56px; }
    .xa__row--lead .xa__name { font-size: clamp(36px, 10vw, 44px); }
    .xa__row--lead .xa__summary { font-size: 17px; }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const ol = document.createElement('ol');
  ol.className = 'xa';
  ol.dataset.mock = '1';
  ol.innerHTML = entries.map((e, i) => `
    <li class="xa__row${i === 0 ? ' xa__row--lead' : ''}">
      <p class="xa__fig" aria-hidden="true"><span class="xa__n">${figures[i].n}</span><span class="xa__unit">${figures[i].unit}</span></p>
      <h4 class="xa__name">${e.name}</h4>
      <p class="xa__meta">${e.role}<i aria-hidden="true">·</i>${e.dates}</p>
      <p class="xa__summary">${e.summary}</p>
    </li>`).join('');
  list.replaceWith(ol);
  return 'mocked A';
})();
