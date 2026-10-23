
(() => {
  // Layout N (after F + M): "Experience" drops from a 40px serif heading to
  // the site's own ruled label (.eyebrow.eyebrow--rule, as on "Selected
  // Work"), so "About." is the section's only display heading and Experience
  // reads as part of About, like Education in the sidebar.
  const h = document.querySelector('.xf__title');
  h.className = 'xf__title xn eyebrow eyebrow--rule';
  const style = document.createElement('style');
  style.textContent = `
  .xf__title.xn { font-family: var(--sans); font-weight: 500; font-size: 11.5px; line-height: 1.5; letter-spacing: .18em; color: var(--ink-soft); margin-bottom: clamp(22px, 2.6vw, 30px); }
  .xf { margin-top: clamp(44px, 5vw, 72px); }
  @media (max-width: 900px) { .xf { margin-top: 16px; } }`;
  document.head.appendChild(style);
  return 'layout N';
})();
