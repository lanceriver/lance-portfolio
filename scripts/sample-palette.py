"""
Lifts a palette out of an image, so the site's colour rule can be obeyed rather
than asserted.

    python3 scripts/sample-palette.py <image> [more images...] [--count 7]
                                     [--strip out.png]

Needs Pillow:  python3 -m pip install pillow

DESIGN_DIRECTION §2 says every colour on this site was sampled from a painting
and that hues must be sampled, never invented. That was done by eye. This does
it by measurement, which matters now that the Field Notes prints are becoming
Lance's own photographs: the swatch strip on the desk should be the real colours
of the real places, and it should be re-derivable when the photographs change.

Selection is by coverage with a perceptual-distance floor, so the strip gets the
colours the image is actually made of without returning seven versions of the
same blue. Each result is also matched against the site's existing tokens, which
answers the more useful question: do these photographs already live in the same
world as the paintings, or are they pulling somewhere new? DECISIONS D49.
"""
import sys
from PIL import Image

# the site's tokens, for the "do these agree with the paintings?" column
PROPER = {
    'cobalt': 'Cobalt', 'azure': 'Azure', 'azure-soft': 'Azure, soft',
    'slate': 'Slate', 'slate-deep': 'Slate, deep', 'slate-ink': 'Slate ink',
    'snow-shadow': 'Snow shadow', 'snow-drift': 'Snow drift',
    'snow-lit': 'Snow, lit', 'snow-warm': 'Snow, warm', 'paper': 'Paper',
    'ink': 'Ink', 'ink-warm': 'Ink, warm', 'ink-soft': 'Ink, soft',
    'parchment': 'Parchment', 'stone': 'Stone', 'ochre': 'Ochre',
    'gold': 'Gold', 'ochre-deep': 'Ochre, deep', 'rust': 'Rust',
    'terracotta': 'Terracotta', 'pine': 'Pine', 'olive': 'Olive',
}

TOKENS = {
    'cobalt': '#0d7ee6', 'azure': '#2f8ce2', 'azure-soft': '#4087c3',
    'slate': '#3e79ad', 'slate-deep': '#2a5f86', 'slate-ink': '#28475b',
    'snow-shadow': '#b3c0d8', 'snow-drift': '#d7dbe0', 'snow-lit': '#f0eae0',
    'snow-warm': '#f6f0e6', 'paper': '#fbf6ec',
    'ink': '#1b2a33', 'ink-warm': '#3f362a', 'ink-soft': '#5c6b73',
    'parchment': '#ded3c0', 'stone': '#d5c0a5', 'ochre': '#c79969',
    'gold': '#dcae4d', 'ochre-deep': '#9c7a50', 'rust': '#8c3f3e',
    'terracotta': '#784d31', 'pine': '#2c382b', 'olive': '#656b59',
}

def to_lab(rgb):
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (lin(v) for v in rgb)
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = (0.2126 * r + 0.7152 * g + 0.0722 * b)
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    def f(t):
        return t ** (1 / 3) if t > 0.008856 else t / 0.128419 + 0.137931
    fx, fy, fz = f(x), f(y), f(z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))

def dE(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def describe(rgb, lab):
    r, g, b = rgb
    mx, mn = max(rgb), min(rgb)
    sat = 0 if mx == 0 else (mx - mn) / mx
    # tone comes from Lab lightness, not HSV value: by value a saturated cobalt
    # reads as "pale", which is both wrong and useless on a swatch label
    L = lab[0]
    # At the extremes hue is noise: a near-black pixel returned "burnt ochre"
    # off a hue angle computed from three values within 3 of each other.
    if L < 12:  return 'near-black'
    if L > 96:  return 'near-white'
    tone = 'deep' if L < 40 else ('pale' if L > 78 else 'mid')
    if sat < .13:
        return f'{tone} neutral'
    if mx == r:   h = (g - b) / (mx - mn) % 6
    elif mx == g: h = (b - r) / (mx - mn) + 2
    else:         h = (r - g) / (mx - mn) + 4
    deg = h * 60
    names = [(15,'red'),(38,'orange'),(52,'ochre'),(68,'yellow'),(100,'olive'),
             (160,'green'),(200,'teal'),(240,'azure'),(270,'indigo'),
             (300,'violet'),(345,'magenta'),(360,'red')]
    hue = next(n for lim, n in names if deg < lim)
    # a dark orange is not an orange in any useful sense
    if tone == 'deep' and hue in ('red', 'orange', 'ochre'):
        return 'umber' if deg < 30 else 'burnt ochre'
    return f'{tone} {hue}'

def sample(paths, count):
    px = []
    for p in paths:
        im = Image.open(p).convert('RGB')
        im.thumbnail((240, 240), Image.LANCZOS)
        raw = im.tobytes()                      # getdata() is deprecated in Pillow 14
        px.extend(tuple(raw[i:i + 3]) for i in range(0, len(raw), 3))
    src = Image.new('RGB', (len(px), 1)); src.putdata(px)
    q = src.quantize(colors=48, method=Image.MEDIANCUT)
    pal = q.getpalette()
    total = sum(n for n, _ in q.getcolors(1 << 16))
    cands = sorted(q.getcolors(1 << 16), reverse=True)

    picked = []
    for floor in (26, 20, 15, 10, 5):          # relax until the strip is full
        for n, i in cands:
            rgb = tuple(pal[i * 3:i * 3 + 3])
            lab = to_lab(rgb)
            if all(dE(lab, p[2]) >= floor for p in picked):
                picked.append((n / total, rgb, lab))
            if len(picked) == count:
                break
        if len(picked) == count:
            break
    # Re-attribute every bucket to its nearest pick, so the share reported is
    # the proportion of the image each swatch actually speaks for. A raw bucket
    # count answers a question nobody asked.
    share = [0.0] * len(picked)
    for n, i in cands:
        lab = to_lab(tuple(pal[i * 3:i * 3 + 3]))
        k = min(range(len(picked)), key=lambda j: dE(lab, picked[j][2]))
        share[k] += n / total
    picked = [(share[j], picked[j][1], picked[j][2]) for j in range(len(picked))]
    return sorted(picked, key=lambda p: -p[2][0])   # lightest first

def nearest_token(lab):
    best = min(TOKENS.items(), key=lambda kv: dE(lab, to_lab(
        tuple(int(kv[1][i:i + 2], 16) for i in (1, 3, 5)))))
    return best[0], dE(lab, to_lab(tuple(int(best[1][i:i + 2], 16) for i in (1, 3, 5))))

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = {a.split('=')[0]: a.split('=')[-1] for a in sys.argv[1:] if a.startswith('--')}
count = int(opt.get('--count', 7))
if not args:
    sys.exit(__doc__)

out = sample(args, count)
print(f'\n  {"hex":9}{"share":>7}  {"reads as":<16}nearest existing token')
print('  ' + '─' * 62)
for share, rgb, lab in out:
    hexs = '#%02X%02X%02X' % rgb
    tok, d = nearest_token(lab)
    agree = 'same colour' if d < 6 else ('close' if d < 14 else 'new to the palette')
    print(f'  {hexs:9}{share*100:6.1f}%  {describe(rgb, lab):<16}--{tok} ({agree})')

print('\n  paste into src/data.ts:\n')
print('export const swatches = [')
seen = {}
for _, rgb, lab in out:
    tok, d = nearest_token(lab)
    # if it IS that colour, call it by the name the site already uses; only
    # invent a description when the photograph found something genuinely new
    name = PROPER[tok] if d < 14 else describe(rgb, lab).title()
    seen[name] = seen.get(name, 0) + 1
    if seen[name] > 1:
        name = f'{name} {seen[name]}'
    print("  { hex: '#%02X%02X%02X', name: '%s' }," % (*rgb, name))
print(']')

if '--strip' in opt:
    w, h = 120, 180
    img = Image.new('RGB', (w * len(out), h))
    for i, (_, rgb, _) in enumerate(out):
        img.paste(Image.new('RGB', (w, h), rgb), (i * w, 0))
    img.save(opt['--strip']); print(f"\n  strip written to {opt['--strip']}")
