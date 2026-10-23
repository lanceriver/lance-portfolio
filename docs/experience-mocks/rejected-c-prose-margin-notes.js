(() => {
  // Mock C: Experience as a paragraph with margin notes.
  // The prose is DRAFT copy for the mock, built only from facts already on the
  // page; the notes use Lance's existing wording.
  const list = document.querySelector('.crossing__experience-list');
  if (!list || list.dataset.mock) return 'already mocked or missing';
  const notes = [
    { dates: 'Mar 2026–present', text: 'A multi-tenant PostgreSQL platform with row-level security. Docker services on AWS Lightsail, ECR, S3 and CloudFront, plus a Lambda/SQS pipeline syncing GoHighLevel. Stripe and Xero through APIs and webhooks, with roughly 470 tests and staged CI/CD supporting releases.' },
    { dates: 'Mar–Dec 2025', text: 'Created content for an audience of 9,000+ followers, with 50,000+ cumulative views.' },
    { dates: 'Nov 2022–Nov 2024', text: 'Coordinated a VBA automation that reduced processing time by 90%, and built a Telegram bot using JavaScript and Google Apps Script.' },
  ];
  const m = (i, t) => `<mark class="xc__m" data-n="${i}">${t}</mark>`;
  const prose = `Since March 2026 I’ve been a Junior Systems Engineer at ${m(0, 'Pool Safety Solutions')}, productionising a franchise prototype across NSW, Queensland and Victoria. Before that, I created content with ${m(1, 'UNSW CSESoc')}’s marketing subcommittee, and spent two years of National Service as an administrative assistant in the ${m(2, 'Singapore Armed Forces')}.`;

  const css = `
  .xc { position: relative; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    column-gap: clamp(32px, 5vw, 72px); padding: 26px 0 30px; border-top: 1px solid rgba(27,42,51,.24); border-bottom: 1px solid rgba(27,42,51,.24); }
  .xc__prose { margin: 0; font-family: var(--serif); font-weight: 400; color: var(--ink);
    font-size: clamp(25px, 2.5vw, 35px); line-height: 1.34; letter-spacing: -.012em; text-wrap: pretty; }
  .xc__m { background: none; color: inherit; cursor: default;
    text-decoration: underline; text-decoration-thickness: 1px; text-decoration-color: var(--rust);
    text-underline-offset: .2em; transition: color .3s ease-out; }
  .xc__m:hover, .xc__m.is-lit { color: var(--rust); }
  .xc__notes { position: relative; margin: 0; padding: 0; list-style: none; }
  .xc__note { position: absolute; left: 0; right: 0; padding-left: 16px; border-left: 1px solid rgba(27,42,51,.22);
    transition: border-color .3s ease-out; }
  .xc__note.is-lit { border-left-color: var(--rust); }
  .xc__name { display: block; font-family: var(--serif); font-style: italic; font-size: 17px; color: var(--ink); }
  .xc__dates { display: block; margin-top: 2px; font-family: var(--sans); font-size: 12.5px; color: var(--ink-soft); font-variant-numeric: tabular-nums; }
  .xc__text { margin: 8px 0 0; font-family: var(--sans); font-size: 14.5px; line-height: 1.55; color: var(--ink-soft); }
  @media (max-width: 900px) {
    .xc { grid-template-columns: minmax(0, 1fr); row-gap: 24px; }
    .xc__note { position: static; margin-top: 18px; }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const names = ['Pool Safety Solutions', 'UNSW CSESoc', 'Singapore Armed Forces'];
  const wrap = document.createElement('div');
  wrap.className = 'xc';
  wrap.dataset.mock = '1';
  wrap.innerHTML = `<p class="xc__prose">${prose}</p>
    <ol class="xc__notes">${notes.map((n, i) => `
      <li class="xc__note" data-n="${i}"><span class="xc__name">${names[i]}</span><span class="xc__dates">${n.dates}</span><p class="xc__text">${n.text}</p></li>`).join('')}</ol>`;
  list.replaceWith(wrap);

  // Hang each note beside the line its phrase sits on; push down to avoid overlap.
  const place = () => {
    const notesEl = wrap.querySelector('.xc__notes');
    if (matchMedia('(max-width: 900px)').matches) { notesEl.style.height = ''; return; }
    const base = notesEl.getBoundingClientRect().top;
    let floor = 0;
    wrap.querySelectorAll('.xc__note').forEach((note) => {
      const mark = wrap.querySelector(`.xc__m[data-n="${note.dataset.n}"]`);
      const want = mark.getBoundingClientRect().top - base;
      const top = Math.max(want, floor);
      note.style.top = top + 'px';
      floor = top + note.offsetHeight + 20;
    });
    notesEl.style.height = floor + 'px';
  };
  place();
  addEventListener('resize', place);
  document.fonts?.ready.then(place);

  // A phrase and its note light together.
  wrap.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-n]');
    wrap.querySelectorAll('.is-lit').forEach((el) => el.classList.remove('is-lit'));
    if (t) wrap.querySelectorAll(`[data-n="${t.dataset.n}"]`).forEach((el) => el.classList.add('is-lit'));
  });
  return 'mocked C';
})();
