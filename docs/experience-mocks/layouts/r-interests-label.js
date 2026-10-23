
(() => {
  // Layout R (after Q): the interests get one label, "Interests", set exactly
  // like EDUCATION below it so the sidebar reads as two parallel groups.
  const ul = document.querySelector('ul.crossing__interests');
  const label = document.createElement('p');
  label.id = 'interests-label';
  label.className = 'xr__label';
  label.textContent = 'Interests';
  ul.before(label);
  ul.removeAttribute('aria-label');
  ul.setAttribute('aria-labelledby', 'interests-label');
  const style = document.createElement('style');
  style.textContent = `
  .xr__label { margin: clamp(36px, 4vw, 52px) 0 10px; font-family: var(--sans); font-size: 11.5px; font-weight: 500;
    letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); }
  ul.crossing__interests.xm__interests { margin-top: 0; }
  @media (max-width: 900px) { .xr__label { order: 3; margin: 6px 0 -16px; } }`;
  document.head.appendChild(style);
  return 'layout R';
})();
