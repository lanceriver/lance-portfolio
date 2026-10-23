
(() => {
  // Layout L (after F): a sticky sidebar under "Experience" with the one fact
  // the roles don't carry, the degree (from the résumé), and a home for the
  // résumé link. Pinned while the roles scroll; on phones it sits under the
  // heading. The arrow nudges on hover like Writing's "Read →".
  const xf = document.querySelector('.xf');
  const aside = document.createElement('div');
  aside.className = 'xl';
  xf.prepend(aside);
  aside.append(xf.querySelector('.xf__title'));
  const block = document.createElement('div');
  block.className = 'xl__side';
  block.innerHTML = `
    <dl class="xl__edu">
      <dt>Education</dt>
      <dd><span class="xl__deg">BSc Computer Science</span><span class="xl__where">UNSW · finishing December 2026</span></dd>
    </dl>
    <a class="xl__resume" href="/lance-rivera-resume.pdf">View full résumé <span class="xl__arrow" aria-hidden="true">→</span></a>`;
  aside.append(block);
  const style = document.createElement('style');
  style.textContent = `
  .xl__side { margin-top: 26px; max-width: 300px; }
  .xl__edu { margin: 0; padding: 14px 0 16px; border-top: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--ink) 22%, transparent); }
  .xl__edu dt { font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); }
  .xl__edu dd { margin: 8px 0 0; }
  .xl__deg { display: block; font-family: var(--serif); font-size: 19px; line-height: 1.25; color: var(--ink); }
  .xl__where { display: block; margin-top: 4px; font-family: var(--sans); font-size: 13px; color: var(--ink-soft); }
  .xl__resume { display: inline-block; margin-top: 18px; font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); text-decoration: none; }
  .xl__arrow { display: inline-block; transition: transform .3s var(--ease-lift); }
  .xl__resume:hover .xl__arrow, .xl__resume:focus-visible .xl__arrow { transform: translateX(5px); }
  @media (min-width: 901px) {
    .xl { position: sticky; top: calc(var(--nav-h) + 16px); align-self: start; }
    .xl__side { margin-top: clamp(30px, 3.4vw, 44px); }
  }`;
  document.head.appendChild(style);
  return 'layout L';
})();
