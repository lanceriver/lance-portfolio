"""
Prepares a photograph for the Field Notes desk.

    python3 scripts/ingest-photo.py <image...> --name=tianmen-road

Needs Pillow (plus pillow-heif for .HEIC straight off a phone):
    python3 -m pip install pillow pillow-heif

Does four things, all of which are easy to forget once and painful to notice
later:

  1. BAKES THE ROTATION IN. A phone photo records its orientation as an EXIF
     tag rather than as pixels. Browsers honour that tag, but a re-encode that
     drops metadata leaves the tag behind and the pixels unturned, so the
     picture is upright locally and on its side in production.
  2. STRIPS METADATA — which for travel photographs means GPS. A holiday album
     published with coordinates attached tells strangers where you were, and in
     the case of photographs taken at home, where you live. Nothing is carried
     across but the image itself.
  3. Writes the three widths the site already uses, matching the plate naming:
     <name>.webp (full), <name>-1200.webp, <name>-800.webp.
  4. Reports the palette, so the swatch strip can be re-derived.
"""
import sys, pathlib
from PIL import Image, ImageOps

try:
    import pillow_heif; pillow_heif.register_heif_opener()
except ImportError:
    pass

FULL, SIZES = 1672, (1200, 800)
OUT = pathlib.Path('public/plates')

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = {a.split('=')[0]: a.split('=')[-1] for a in sys.argv[1:] if a.startswith('--')}
if not args:
    sys.exit(__doc__)

for src in args:
    p = pathlib.Path(src)
    name = opt.get('--name') if len(args) == 1 and '--name' in opt else p.stem.lower().replace(' ', '-').replace('_', '-')
    im = Image.open(p)

    exif = im.getexif()
    had_gps = 0x8825 in exif
    orient = exif.get(0x0112, 1)
    im = ImageOps.exif_transpose(im).convert('RGB')   # rotation becomes pixels

    OUT.mkdir(parents=True, exist_ok=True)
    written = []
    for w, suffix in [(FULL, ''), *[(s, f'-{s}') for s in SIZES]]:
        c = im.copy()
        if c.width > w:
            c.thumbnail((w, 10 ** 6), Image.LANCZOS)
        f = OUT / f'{name}{suffix}.webp'
        c.save(f, 'WEBP', quality=82, method=6)       # no exif= : metadata dropped
        written.append((f, c.size, f.stat().st_size))

    print(f'\n{p.name}  ->  {name}')
    print(f'  orientation tag {orient}' + ('  (rotation baked in)' if orient != 1 else '  (already upright)'))
    print('  GPS ' + ('FOUND and stripped' if had_gps else 'not present'))
    for f, (w, h), b in written:
        print(f'  {f.name:<34} {w}x{h:<6} {b/1024:6.0f} KB')
    print(f'\n  palette:  python3 scripts/sample-palette.py {OUT}/{name}-1200.webp')
