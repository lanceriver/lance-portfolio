
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
