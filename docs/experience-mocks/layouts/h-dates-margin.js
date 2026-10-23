
(() => {
  // Layout H (applied after mock F): the heading sits above the list, and each
  // role's dates move into the left column, on the same edge as "About.".
  // The role, summary and tags stay in the right column under the bio.
  const style = document.createElement('style');
  style.textContent = `
  @media (min-width: 901px) {
    .xf { display: block; }
    .xf__title { margin-bottom: clamp(26px, 3vw, 36px); }
    .xf__list { max-width: none; }
    .xf__card { grid-template-columns: minmax(250px, .78fr) minmax(0, 1.22fr); column-gap: clamp(40px, 7vw, 100px); }
    .xf__card > div { max-width: 740px; }
    .xf__summary { max-width: 68ch; }
  }`;
  document.head.appendChild(style);
  return 'layout H';
})();
