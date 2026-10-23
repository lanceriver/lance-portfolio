(() => {
  // Preview only: Worn's still scene moves ahead of Airtable's aperture scene
  // (and its ruled index), and the big numerals swap so Worn reads as I.
  // The nav's contents index is not changed.
  const a = document.querySelector('#plate-i');
  const b = document.querySelector('#plate-ii');
  if (!a || !b || b.dataset.moved) return 'missing or already moved';
  a.before(b);
  b.dataset.moved = '1';
  const na = a.querySelector('.scene__num');
  const nb = b.querySelector('.scene__num');
  [na.textContent, nb.textContent] = [nb.textContent, na.textContent];
  return 'worn first';
})();

(() => {
  // Preview only (after preview-worn-first.js): Worn's Fig. 1 (the wardrobe)
  // trades places with the bullet points, so a screenshot sits beside the
  // intro in the scene's first view. Desktop: the bullets take Fig. 1's slot
  // in the row beside Fig. 2 and Fig. 3. Phones: the bullets stay under the
  // intro and the swipe row keeps only Fig. 2 and Fig. 3.
  const scene = document.querySelector('#plate-ii');
  const detail = scene.querySelector('.rest__detail');
  const ul = detail.querySelector('.scene__points');
  const row = scene.querySelector('.rest__screens');
  const fig1 = row.children[0];
  const slot = document.createElement('div');
  slot.className = 'rest__screen xw__points';
  slot.setAttribute('role', 'listitem');
  const phoneCopy = ul.cloneNode(true);
  phoneCopy.classList.add('xw__points-phone');
  slot.append(ul);
  row.prepend(slot);
  detail.append(fig1, phoneCopy);
  fig1.classList.add('xw__lead-fig');
  const style = document.createElement('style');
  style.textContent = `
  .rest__detail .xw__lead-fig { width: min(24vw, 340px); margin-top: 0; }
  .xw__points-phone { display: none; }
  .rest__screens .xw__points { width: min(26vw, 380px); align-self: start; padding-top: clamp(24px, 4vh, 48px); }
  .xw__points .scene__points { margin-top: 0; }
  @media (max-width: 900px) {
    .rest__screens .xw__points { display: none; }
    .xw__points-phone { display: block; margin-top: 16px; }
    .rest__detail .xw__lead-fig { width: min(62vw, 280px); margin-top: 28px; }
  }`;
  document.head.appendChild(style);
  return 'screen up';
})();
