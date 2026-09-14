"""
Derives the Hero's skyline occlusion mask from the painting's own pixels.

    python3 scripts/make-skyline-mask.py --preview /tmp/check.png   # inspect
    python3 scripts/make-skyline-mask.py public/plates/alpine-skyline-mask.png

Needs Pillow. The output masks `.birds` so the flock passes in front of the
mountains and behind the village; nothing about the painting itself changes.
Re-run only if the plate is ever re-exported. DECISIONS D43.

Two rules do the work:

  1. Sky and snow are background — a distant bird may legitimately fly in front
     of either. Everything else is built fabric.
  2. Of that fabric, keep only what is 8-connected to the left or right edge of
     the frame. The village fills both margins from roofline to street; the dark
     rock on the mountain face is an island in the snow and reaches no edge, so
     it drops out. Without this the horizon spikes up into the peaks and birds
     flicker in and out across them.

The mask is written with the coverage in the ALPHA channel, not as greyscale:
CSS `mask-image` defaults to `mask-mode: match-source`, so a greyscale PNG has
no alpha, is fully opaque, and masks nothing at all.
"""
from PIL import Image, ImageDraw, ImageFilter
from collections import deque
import sys
im=Image.open('public/plates/alpine-village.webp').convert('RGB'); W,H=im.size
px=im.load()

def is_bg_sky(r,g,b):
    """Blue: open sky, and snow lying in blue shadow. Used for the ground classes."""
    return b > r + 40 and b > 140

def is_open_sky(r,g,b):
    """
    Sky proper — the only thing that can sit above a roof's snow cap.

    `is_bg_sky` is deliberately loose enough to swallow snow in blue shadow,
    which is right for the mountains and fatal here: the underside of a roof's
    cap is exactly that colour (154,183,228), so the climb below would stop on
    the first shadowed pixel and leave the horizon down at the wood. Sky is the
    only blue in this painting with almost no red in it — every flavour of snow
    keeps r above 145, open sky sits below 110.
    """
    return b > r + 40 and r < 120

def is_bg(r,g,b):
    if is_bg_sky(r,g,b): return True                # sky, and snow in blue shadow
    mx,mn=max(r,g,b),min(r,g,b)
    sat=(mx-mn)/mx if mx else 0
    if 0.299*r+0.587*g+0.114*b > 150 and sat < 0.30: return True   # snow, cloud
    return False

fg=bytearray(W*H)
for y in range(H):
    for x in range(W):
        if not is_bg(*px[x,y]): fg[y*W+x]=1

# Keep only built fabric: everything 8-connected to the left or right edge of the
# frame. The village fills both margins top to bottom; the dark rock on the
# mountain face is an island in the snow and never reaches an edge.
seen=bytearray(W*H); q=deque()
for y in range(H):
    for x in (0, W-1):
        i=y*W+x
        if fg[i] and not seen[i]: seen[i]=1; q.append((x,y))
while q:
    x,y=q.popleft()
    for dx in (-1,0,1):
        for dy in (-1,0,1):
            nx,ny=x+dx,y+dy
            if 0<=nx<W and 0<=ny<H:
                j=ny*W+nx
                if fg[j] and not seen[j]: seen[j]=1; q.append((nx,ny))

RUN=4
horizon=[]
for x in range(W):
    hit=H
    for y in range(H):
        if seen[y*W+x] and all(seen[min(y+k,H-1)*W+x] for k in range(RUN)):
            hit=y; break
    horizon.append(hit)

# Snow lying ON a roof belongs to the roof. It is pixel-identical to snow lying
# on a mountain, so colour cannot separate them — but what sits underneath can.
# Walk up from the top of the fabric: if sky is reached within a roof's depth,
# that snow was a cap and the horizon moves to the top of it. If it is not, the
# column is looking at a mountain face standing behind the village, and the
# horizon stays where it was. A truncated climb would cut into the peaks, which
# is the thing the connectivity rule above exists to prevent — so this either
# takes the whole cap or none of it. Measured caps here run 34-48px. D43.
CAP=90
for x in range(W):
    y=horizon[x]
    if y>=H: continue
    top=y
    while top>0 and (y-top)<=CAP and not is_open_sky(*px[x,top-1]):
        top-=1
    if top>0 and (y-top)<=CAP:      # reached open sky, and it was cap-shaped
        horizon[x]=top

if '--preview' in sys.argv:
    prev=im.copy(); d=ImageDraw.Draw(prev)
    d.line([(x,min(horizon[x],H-1)) for x in range(W)], fill=(255,0,255), width=3)
    prev.resize((W//2,H//2)).save(f'{sys.argv[-1]}')
    print('preview written; columns with no occluder:', sum(1 for v in horizon if v>=H))
else:
    m=Image.new('L',(W,H),0)
    md=ImageDraw.Draw(m)
    for x in range(W):
        if horizon[x]>0: md.line([(x,0),(x,horizon[x]-1)], fill=255)
    m=m.filter(ImageFilter.GaussianBlur(1.2))
    m=m.resize((W//2,H//2), Image.LANCZOS)      # a 1px feather survives this fine
    Image.merge('RGBA',(Image.new('L',m.size,255),)*3+(m,)).save(sys.argv[-1], optimize=True)
    print('mask written', m.size)
