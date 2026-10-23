
(() => {
  // Layout G (applied after mock F): Brittany Chiang's page structure. "About."
  // and the route stay pinned in the left column while the bio, interests and
  // Experience scroll past in the right column. Phones keep the single column.
  const style = document.createElement('style');
  style.textContent = `
  @media (min-width: 901px) {
    .crossing__inner { align-items: start !important; }
    .crossing__identity { grid-row: 1 / span 3; position: sticky; top: calc(var(--nav-h) + 12px); align-self: start; }
    .crossing__interests { grid-column: 2 !important; }
    .xf { grid-column: 2; display: block; margin-top: clamp(16px, 2.4vw, 32px); }
    .xf__title { margin-bottom: clamp(26px, 3vw, 36px); }
  }`;
  document.head.appendChild(style);
  return 'layout G';
})();
