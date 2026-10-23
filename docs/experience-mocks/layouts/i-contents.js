
(() => {
  // Layout I (after F): a sticky contents list in the left column. The three
  // employers sit under "Experience"; the one you're reading turns italic and
  // full ink (Writing D46's signal), the others stay soft. Clicking jumps to
  // the role. Desktop only; phones keep F's single column.
  const xf = document.querySelector('.xf');
  const items = [...xf.querySelectorAll('.xf__item')];
  const aside = document.createElement('div');
  aside.className = 'xi';
  xf.prepend(aside);
  aside.append(xf.querySelector('.xf__title'));
  const nav = document.createElement('ol');
  nav.className = 'xi__nav';
  nav.setAttribute('aria-label', 'Roles');
  nav.innerHTML = items.map((li, i) => {
    li.id = `xrole-${i}`;
    const name = li.querySelector('.xf__shown').textContent.split('·').pop().replace(/^\s*at\s*/, '').trim();
    const year = li.querySelector('.xf__dates').textContent.trim().match(/\d{4}/)[0];
    return `<li><a href="#xrole-${i}"><span class="xi__year">${year}</span><span class="xi__name"><span class="xi__shown">${name}</span><span class="xi__sizer" aria-hidden="true">${name}</span></span></a></li>`;
  }).join('');
  aside.append(nav);
  const style = document.createElement('style');
  style.textContent = `
  .xi__nav { display: none; }
  @media (min-width: 901px) {
    .xi { position: sticky; top: calc(var(--nav-h) + 16px); align-self: start; }
    .xi__nav { display: block; margin: 34px 0 0; padding: 0; list-style: none; border-top: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); max-width: 300px; }
    .xi__nav li { border-bottom: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); }
    .xi__nav a { display: grid; grid-template-columns: 52px minmax(0, 1fr); align-items: baseline; padding: 12px 0; text-decoration: none; color: var(--ink-soft); transition: color .34s var(--ease-settle); }
    .xi__year { font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; font-variant-numeric: tabular-nums; }
    .xi__name { display: grid; font-family: var(--serif); font-size: 18px; line-height: 1.25; }
    .xi__name > span { grid-area: 1 / 1; }
    .xi__sizer { font-style: italic; visibility: hidden; }
    .xi__nav a.is-on, .xi__nav a:hover, .xi__nav a:focus-visible { color: var(--ink); }
    .xi__nav a.is-on .xi__shown { font-style: italic; }
  }`;
  document.head.appendChild(style);
  const links = [...nav.querySelectorAll('a')];
  const on = (i) => links.forEach((a, j) => { a.classList.toggle('is-on', i === j); a.toggleAttribute('aria-current', i === j); });
  on(0);
  // the role you are reading: the last one whose top has passed 45% of the viewport
  const spy = () => { let k = 0; items.forEach((li, i) => { if (li.getBoundingClientRect().top < innerHeight * 0.45) k = i; }); on(k); };
  addEventListener("scroll", spy, { passive: true });
  items.forEach((li, i) => { li.addEventListener('mouseenter', () => on(i)); });
  links.forEach((a, i) => a.addEventListener('click', (ev) => { ev.preventDefault(); items[i].scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); on(i); }));
  return 'layout I';
})();
