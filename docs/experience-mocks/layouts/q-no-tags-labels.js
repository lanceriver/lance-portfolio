
(() => {
  // Layout Q (after F + M + O + P): Lance's cuts. The tech tags go, and the
  // interests lose their labels (ON FOOT / AT THE KEYS / OUT AND ABOUT),
  // which only restated each line. The interests become a plain ruled list.
  document.querySelectorAll('.xf__tags').forEach((ul) => ul.remove());
  const dl = document.querySelector('.crossing__interests');
  const ul = document.createElement('ul');
  ul.className = dl.className;
  ul.setAttribute('aria-label', dl.getAttribute('aria-label'));
  ul.innerHTML = [...dl.querySelectorAll('dd')].map((dd) => `<li>${dd.textContent.trim()}</li>`).join('');
  dl.replaceWith(ul);
  const style = document.createElement('style');
  style.textContent = `
  ul.crossing__interests.xm__interests { list-style: none; }
  ul.crossing__interests.xm__interests > li { padding: 11px 0 12px; border-top: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
    font-family: var(--serif); font-size: 21px; line-height: 1.25; color: var(--ink); }
  ul.crossing__interests.xm__interests > li:last-child { border-bottom: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); }
  @media (max-width: 600px) { ul.crossing__interests.xm__interests > li { font-size: 20px; } }`;
  document.head.appendChild(style);
  return 'layout Q';
})();
