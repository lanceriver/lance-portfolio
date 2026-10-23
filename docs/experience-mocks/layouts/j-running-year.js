
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
