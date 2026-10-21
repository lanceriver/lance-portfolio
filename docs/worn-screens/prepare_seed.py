#!/usr/bin/env python3
"""Prepare Worn simulator seed photos and tinted garment cutouts."""
from pathlib import Path
import json
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
PYTHON = Path('/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')
TEMPLATES = Path('/Users/lance/Documents/Projects/fits-app-workspace/fits-app-workspace/Resources/PhotoTemplates')
GEN = Path('/Users/lance/.codex/generated_images/01a160ba-9aec-7680-abe9-f60be38e2a83')
SOURCES = [GEN/'exec-5fb08c82-bf46-4614-9b13-a441bf218e00.png', GEN/'exec-6d48c072-e702-42fe-b454-c3beb1cb01f3.png']
PHOTO_DIR = ROOT/'SeedPhotos'
CUTOUT_DIR = ROOT/'SeedCutouts'
RESAMPLE = Image.Resampling.LANCZOS

# fit number: (top template, RGB), (bottom template, RGB), (shoes template, RGB)
LOOKS = {
    1: [('tee',(240,238,232)),('trousers',(68,68,70)),('courtSneaker',(238,234,226))],
    2: [('campShirt',(138,154,126)),('jeans',(40,40,42)),('derby',(36,34,32))],
    3: [('knit',(44,52,78)),('jeans',(52,64,98)),('chelsea',(110,80,56))],
    4: [('shirt',(232,222,200)),('cargo',(96,100,68)),('sneakerLow',(240,238,232))],
    5: [('sweatshirt',(150,150,152)),('joggers',(40,40,42)),('runner',(140,142,146))],
    6: [('polo',(36,36,38)),('trousers',(196,184,160)),('loafer',(40,38,36))],
    7: [('quarterZip',(120,86,60)),('baggyJeans',(56,70,104)),('derby',(96,66,44))],
    8: [('shirt',(160,186,214)),('shorts',(70,70,72)),('sneakerLow',(240,238,232))],
}
PARTS = ['top','bottom','shoes']

def crop_and_normalize(src, panel):
    # Trim the seam and outer edge. Keep every box strictly within its source column.
    x0, x1 = (2, 510) if panel in (0,2) else (514,1022)
    if panel < 2:
        y0, y1 = 2, 707
        crop_h = y1-y0
        crop_w = 470
        cx=(x0+x1)//2
        box=(cx-crop_w//2,y0,cx-crop_w//2+crop_w,y1)
    else:
        # Lower-row hair begins about y=746. Keep a 16px top margin and avoid the seam.
        y0,y1=730,1492
        crop_w=508
        box=(x0,y0,x0+crop_w,y1)
    return src.crop(box).resize((472,708), RESAMPLE), list(box)

def tint(template, rgb):
    im=Image.open(template).convert('RGBA')
    alpha=im.getchannel('A')
    lum=ImageOps.autocontrast(im.convert('L'), cutoff=1)
    # Near-white target colours retain the requested hue while capped below pure white.
    caps = [int(c * 0.97) if min(rgb) >= 220 else 255 for c in rgb]
    channels=[lum.point([min(caps[i],max(0,min(255,int(c*(0.55+0.75*(v/255)))))) for v in range(256)]) for i,c in enumerate(rgb)]
    out=Image.merge('RGBA',(*channels,alpha))
    out.thumbnail((600,600), RESAMPLE)
    return out

def main():
    PHOTO_DIR.mkdir(exist_ok=True)
    CUTOUT_DIR.mkdir(exist_ok=True)
    reports=[]
    photos=[]
    for sheet_idx, src_path in enumerate(SOURCES):
        src=Image.open(src_path).convert('RGB')
        if src.size != (1024,1536):
            raise ValueError(f'Unexpected source dimensions: {src_path} {src.size}')
        normalized=[]
        for slot in range(4):
            panel=slot if sheet_idx==0 else slot+4
            tile,box=crop_and_normalize(src,slot)
            target=PHOTO_DIR/f'fit-{panel+1:02}.jpg'
            tile.save(target,'JPEG',quality=85,optimize=True)
            photos.append((panel+1,tile.copy()))
            normalized.append(tile)
            reports.append({'fit':f'{panel+1:02}','source':src_path.name,'panel':slot+1,'crop_box':box,'output':str(target.relative_to(ROOT)),'dimensions':list(tile.size)})
        sheet=Image.new('RGB',(944,1416))
        for n,tile in enumerate(normalized):
            sheet.paste(tile,((n%2)*472,(n//2)*708))
        sheet.save(ROOT/('sheet-a.png' if sheet_idx==0 else 'sheet-b.png'))

    cutouts=[]
    for fit, entries in LOOKS.items():
        for part,(template,rgb) in zip(PARTS,entries):
            path=TEMPLATES/f'{template}.png'
            im=tint(path,rgb)
            dest=CUTOUT_DIR/f'fit-{fit:02}_{part}.png'
            im.save(dest,optimize=True)
            cutouts.append((fit,part,im.copy()))
            reports.append({'fit':f'{fit:02}','part':part,'template':template+'.png','rgb':list(rgb),'output':str(dest.relative_to(ROOT)),'dimensions':list(im.size),'alpha_extrema':list(im.getchannel('A').getextrema())})

    # Eight photo columns on top, with one row per garment type below.
    cell_w, photo_h, thumb_h = 260,390,210
    label_h, pad = 28,12
    canvas=Image.new('RGB',(cell_w*8,photo_h+label_h+3*(thumb_h+label_h)+pad*2),(238,233,224))
    draw=ImageDraw.Draw(canvas)
    try: font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',15)
    except OSError: font=ImageFont.load_default()
    for col,(fit,photo) in enumerate(photos):
        x=col*cell_w
        ph=ImageOps.contain(photo,(cell_w,photo_h),RESAMPLE)
        canvas.paste(ph,(x+(cell_w-ph.width)//2,pad))
        draw.text((x+5,pad+photo_h+3),f'fit-{fit:02}',fill=(45,42,38),font=font)
    row_y=photo_h+label_h+pad
    for row,part in enumerate(PARTS):
        y=row_y+row*(thumb_h+label_h)
        for col in range(8):
            fit=col+1
            im=next(im for f,p,im in cutouts if f==fit and p==part)
            thumb=ImageOps.contain(im,(cell_w-8,thumb_h-4),RESAMPLE)
            # Composite transparent garment over the warm contact-sheet ground.
            canvas.paste(thumb,(col*cell_w+(cell_w-thumb.width)//2,y),thumb)
            draw.text((col*cell_w+5,y+thumb_h),part,fill=(45,42,38),font=font)
    canvas.save(ROOT/'sheet.png',optimize=True)
    (ROOT/'asset-report.json').write_text(json.dumps({'source_sheets':[str(p) for p in SOURCES], 'photos':reports[:8], 'cutouts':reports[8:], 'counts':{'photos':len(photos),'cutouts':len(cutouts)}, 'photo_mismatches':[], 'template_note':'fit-08 shirt cutout uses the specified shirt.png template, which has long sleeves; photo is short-sleeved.', 'files_written':['sheet-a.png','sheet-b.png','sheet.png','generation-prompts.txt','prepare_seed.py','asset-report.json'] + [f'SeedPhotos/fit-{i:02}.jpg' for i in range(1,9)] + [f'SeedCutouts/fit-{i:02}_{part}.png' for i in range(1,9) for part in PARTS]},indent=2)+'\n')


if __name__=='__main__': main()
