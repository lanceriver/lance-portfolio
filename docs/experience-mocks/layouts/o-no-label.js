
(() => {
  // Layout O (after F + M), per Impeccable's craft floor ("delete the label
  // and let the heading speak") and a typeset pass on About, which had ~10
  // tracked-caps items. Changes:
  //  - no visible "Experience" heading; the bio runs straight into the roles,
  //    whose dated role · employer lines say what they are. A visually hidden
  //    h3 keeps the section labelled for screen readers.
  //  - dates move from tracked caps to the 13px metadata role, in Lance's own
  //    form ("Mar 2026–present").
  //  - the résumé link is a plain underlined link, not tracked caps; its arrow
  //    eases with --ease-settle (the detector flags --ease-lift as bounce).
  document.querySelector('.xf__title').className = 'xf__title vh';
  const r = document.querySelector(".xm__resume");
  r.firstChild.replaceWith(Object.assign(document.createElement("span"), { className: "xo__label", textContent: "View full résumé" }), " ");
  document.querySelectorAll('.xf__dates').forEach((p) => { p.textContent = p.textContent.replace(' — ', '–'); });
  const style = document.createElement('style');
  style.textContent = `
  .xf { margin-top: clamp(52px, 6vw, 84px); }
  .xf__card { grid-template-columns: 148px minmax(0, 1fr); }
  .xf__dates { padding-top: 4px; font-size: 13px; font-weight: 400; letter-spacing: 0; text-transform: none; }
  .xm__resume { font-size: 14px; font-weight: 400; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .xo__label { text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--ink) 35%, transparent); text-underline-offset: 3px; }
  .xm__resume:hover .xo__label, .xm__resume:focus-visible .xo__label { text-decoration-color: currentColor; }
  .xm__arrow { transition: transform .34s var(--ease-settle); }
  @media (max-width: 900px) { .xf { margin-top: 20px; } }
  @media (max-width: 600px) { .xf__card { grid-template-columns: minmax(0, 1fr); } .xf__dates { padding-top: 0; } }`;
  document.head.appendChild(style);
  return 'layout O';
})();
