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
