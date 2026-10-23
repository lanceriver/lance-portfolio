
(() => {
  // Layout P (after F + M + O): the About section's text collapses to three
  // steps plus the display title and one tracked label size, fixing the
  // too-close sizes on O (12/13/14/15.5/17/18px):
  //   13px    metadata: dates, "National Service", degree line, tags, résumé link
  //   17px    reading:  the site's .body (bio), role summaries, route line
  //   21px    titles:   role · employer lines, interests, the degree
  //   11.5px  labels:   ON FOOT … EDUCATION (one size, was 11 and 11.5)
  // Impeccable's static scan still reports flat-type-hierarchy: it can't
  // resolve "About."'s clamp() size, so it sees 13–21px only. Rendered,
  // the range is 11.5px to ~90–100px.
  const style = document.createElement('style');
  style.textContent = `
  .xf__summary { font-size: 17px; line-height: 1.6; }
  .xf__tags li { font-size: 13px; }
  .xm__resume { font-size: 13px; }
  .xf__role { font-size: 21px; }
  .crossing__interests.xm__interests dd { font-size: 21px; line-height: 1.25; }
  .xm__name { font-size: 21px; }
  .xm__deg dt { font-size: 11.5px; letter-spacing: .16em; }
  @media (max-width: 600px) { .xf__role, .crossing__interests.xm__interests dd, .xm__name { font-size: 20px; } }`;
  document.head.appendChild(style);
  return 'layout P';
})();
