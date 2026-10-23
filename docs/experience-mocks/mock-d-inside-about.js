(() => {
  // Mock D: Experience moves into the bio column and reads as its
  // continuation. Each role is one run-in paragraph with a hanging indent:
  // role (serif), employer (serif italic), dates (sans), then the summary
  // continues on the same line. Equal treatment, body-size type, no rules.
  const sec = document.querySelector('.crossing__experience');
  const bio = document.querySelector('.crossing__bio');
  if (!sec || !bio || sec.dataset.mock) return 'already mocked or missing';
  const entries = [...sec.querySelectorAll('.crossing__experience-entry')].map((li) => {
    const [role, ...rest] = li.querySelector('.crossing__experience-role p').textContent.trim().split(' · ');
    return {
      role,
      org: li.querySelector('.crossing__experience-role h4').textContent.trim(),
      dates: [...rest, li.querySelector(".crossing__experience-dates").textContent.trim()].join(" · "),
      summary: li.querySelector('.crossing__experience-summary').textContent.trim(),
    };
  });
  const resume = sec.querySelector('.crossing__resume-link').getAttribute('href');

  const css = `
  .xd { margin-top: clamp(30px, 3.4vw, 44px); max-width: 56ch; }
  .xd__title { margin: 0 0 16px; font-family: var(--serif); font-style: italic; font-weight: 400;
    font-size: 17px; line-height: 1.3; color: var(--ink-soft); }
  .xd__list { margin: 0; padding: 0; list-style: none; }
  .xd__entry { margin: 0; padding-left: 1.4em; text-indent: -1.4em;
    font-family: var(--sans); font-size: 15.5px; line-height: 1.6; color: var(--ink-soft);
    text-wrap: pretty; }
  .xd__entry + .xd__entry { margin-top: 18px; }
  .xd__role { font-family: var(--serif); font-size: 19px; line-height: 1; color: var(--ink); letter-spacing: -.005em; }
  .xd__org { font-family: var(--serif); font-style: italic; font-size: 17.5px; color: var(--ink); white-space: nowrap; }
  .xd__dates { font-size: 13px; color: var(--ink-soft); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .xd__sep { color: rgba(27,42,51,.35); padding-inline: .3em; }
  .xd__resume { display: inline-block; margin-top: 22px; color: var(--ink-soft); font-size: 13px;
    text-decoration: underline; text-decoration-color: rgba(27,42,51,.35); text-underline-offset: 3px; }
  .xd__resume:hover { color: var(--ink); text-decoration-color: currentColor; }
  .crossing__inner { align-items: start !important; }

  @media (max-width: 560px) {
    .xd__entry { font-size: 15px; padding-left: 1em; text-indent: -1em; }
    .xd__role { font-size: 18px; }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const block = document.createElement('section');
  block.className = 'xd';
  block.dataset.mock = '1';
  block.setAttribute('aria-labelledby', 'experience-title');
  block.innerHTML = `
    <h3 id="experience-title" class="xd__title">Experience</h3>
    <ol class="xd__list">${entries.map((e) => `
      <li class="xd__entry"><span class="xd__role">${e.role}</span>, <span class="xd__org">${e.org}</span><span class="xd__sep" aria-hidden="true">·</span><span class="xd__dates">${e.dates}.</span> ${e.summary}</li>`).join('')}
    </ol>
    <a class="xd__resume" href="${resume}">View résumé</a>`;
  bio.appendChild(block);
  sec.dataset.mock = '1';
  sec.remove();
  return 'mocked D';
})();
