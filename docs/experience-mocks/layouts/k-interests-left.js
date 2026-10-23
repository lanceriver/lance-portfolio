
(() => {
  // Layout K (after F): life beside work. The interests leave their full-width
  // strip and stack in the left column, level with the roles; "Experience"
  // moves to the right column above them. Same words, no new copy.
  const xf = document.querySelector('.xf');
  const dl = document.querySelector('.crossing__interests');
  const right = document.createElement('div');
  xf.append(right);
  right.append(xf.querySelector('.xf__title'), xf.querySelector('.xf__list'));
  xf.prepend(dl);
  dl.classList.add('xk');
  const style = document.createElement('style');
  style.textContent = `
  @media (min-width: 901px) {
    .xf { margin-top: clamp(36px, 4vw, 56px); }
    .xf__title { margin-bottom: clamp(26px, 3vw, 36px); }
    .crossing__interests.xk { grid-column: auto; display: block; padding: 0; border: 0; max-width: 300px; margin-top: 6px; }
    .crossing__interests.xk > div,
    .crossing__interests.xk > div:first-child { padding: 16px 0; border-left: 0; border-top: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); }
    .crossing__interests.xk > div:last-child { border-bottom: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); }
    .crossing__interests.xk dd { margin-top: 6px; }
  }`;
  document.head.appendChild(style);
  return 'layout K';
})();
