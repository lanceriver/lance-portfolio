(() => {
  // Mock only: rebuilds the Experience register as an unfolding employer index.
  // Reads the live entries so every word stays Lance's own.
  const list = document.querySelector('.crossing__experience-list');
  if (!list || list.dataset.mock) return 'already mocked or missing';
  const entries = [...list.querySelectorAll('.crossing__experience-entry')].map((li) => ({
    dates: li.querySelector('.crossing__experience-dates').textContent.trim(),
    name: li.querySelector('.crossing__experience-role h4').textContent.trim(),
    role: li.querySelector('.crossing__experience-role p').textContent.trim(),
    summary: li.querySelector('.crossing__experience-summary').textContent.trim(),
  }));

  const css = `
  .xi { margin: 0; padding: 0; list-style: none; border-top: 1px solid rgba(27,42,51,.24); }
  .xi__row { border-bottom: 1px solid rgba(27,42,51,.24); }
  .xi__head { margin: 0; font: inherit; }
  .xi__toggle {
    display: grid; width: 100%; text-align: left; cursor: pointer;
    grid-template-columns: clamp(64px, 7vw, 104px) minmax(0, 1fr) 44px;
    align-items: baseline; column-gap: clamp(12px, 2vw, 28px);
    padding: clamp(18px, 2.2vw, 26px) 0 clamp(16px, 2vw, 22px);
    color: var(--ink);
  }
  .xi__year {
    font-family: var(--serif); font-size: clamp(16px, 1.4vw, 19px); font-style: italic;
    color: var(--ink-soft); font-variant-numeric: oldstyle-nums;
  }
  .xi__name {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(38px, 5.4vw, 84px); line-height: .98; letter-spacing: -.035em;
    text-wrap: balance;
  }
  .xi__meta {
    grid-column: 2; margin-top: 10px;
    font-family: var(--sans); font-size: 13.5px; color: var(--ink-soft); letter-spacing: .01em;
  }
  .xi__meta i { font-style: normal; opacity: .55; padding-inline: .45em; }
  .xi__mark { grid-column: 3; grid-row: 1; justify-self: end; align-self: center; position: relative; width: 22px; height: 22px; }
  .xi__mark::before, .xi__mark::after {
    content: ""; position: absolute; left: 0; top: 50%; width: 22px; height: 1.5px; margin-top: -.75px;
    background: currentColor; transition: transform .5s cubic-bezier(.16, 1, .3, 1);
  }
  .xi__mark::after { transform: rotate(90deg); }
  .xi__row--open .xi__mark::after { transform: rotate(0deg); }
  @media (hover: hover) and (pointer: fine) {
    .xi__toggle:hover .xi__name { font-style: italic; }
  }
  .xi__panel {
    display: grid; grid-template-rows: 0fr;
    transition: grid-template-rows .55s cubic-bezier(.16, 1, .3, 1);
  }
  .xi__row--open .xi__panel { grid-template-rows: 1fr; }
  .xi__panel > div { overflow: hidden; min-height: 0; }
  .xi__summary {
    margin: 0 0 0 calc(clamp(64px, 7vw, 104px) + clamp(12px, 2vw, 28px));
    padding: 2px 0 clamp(22px, 2.6vw, 30px);
    max-width: 62ch; font-size: 16.5px; line-height: 1.6; color: var(--ink-soft);
    opacity: 0; transform: translateY(-6px);
    transition: opacity .4s ease-out, transform .55s cubic-bezier(.16, 1, .3, 1);
  }
  .xi__row--open .xi__summary { opacity: 1; transform: none; transition-delay: .08s; }
  @media (max-width: 560px) {
    .xi__toggle { grid-template-columns: minmax(0, 1fr) 44px; row-gap: 6px; padding: 18px 0 16px; }
    .xi__year { grid-column: 1; grid-row: 1; }
    .xi__name { grid-column: 1; grid-row: 2; font-size: clamp(34px, 10vw, 44px); }
    .xi__meta { grid-column: 1; grid-row: 3; margin-top: 4px; }
    .xi__mark { grid-column: 2; grid-row: 2; }
    .xi__summary { margin-left: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .xi__panel, .xi__summary, .xi__mark::after { transition: none; }
  }
  @media print { .xi__panel { grid-template-rows: 1fr; } .xi__summary { opacity: 1; transform: none; } }
  `;
  const style = document.createElement('style');
  style.id = 'xi-mock-style';
  style.textContent = css;
  document.head.appendChild(style);

  const startYear = (d) => (d.match(/\d{4}/) || [''])[0];
  const ol = document.createElement('ol');
  ol.className = 'xi';
  ol.dataset.mock = '1';
  ol.innerHTML = entries.map((e, i) => `
    <li class="xi__row${i === 0 ? ' xi__row--open' : ''}">
      <h4 class="xi__head">
        <button class="xi__toggle" aria-expanded="${i === 0}" aria-controls="xi-panel-${i}">
          <span class="xi__year">${startYear(e.dates)}</span>
          <span class="xi__name">${e.name}</span>
          <span class="xi__mark" aria-hidden="true"></span>
          <span class="xi__meta">${e.role}<i aria-hidden="true">·</i>${e.dates}</span>
        </button>
      </h4>
      <div class="xi__panel" id="xi-panel-${i}" role="region" aria-label="${e.name}">
        <div><p class="xi__summary">${e.summary}</p></div>
      </div>
    </li>`).join('');
  ol.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.xi__toggle');
    if (!btn) return;
    const row = btn.closest('.xi__row');
    const open = row.classList.toggle('xi__row--open');
    btn.setAttribute('aria-expanded', String(open));
  });
  list.replaceWith(ol);
  return 'mocked ' + entries.length + ' entries';
})();
