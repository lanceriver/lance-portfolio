# Spec: fictional men's outfit-diary seed images for the Worn simulator

Work only inside this directory (`worn-seed/`). Don't touch any repo.

## 1. Generate 8 outfit photos with your built-in imagegen tool

Two images, each a clean 2×2 contact sheet of four equal portrait panels, no gutters or borders. The same fictional man in every panel (late twenties, short dark hair, slim build, consistent face). Candid outfit-diary photography: natural 35mm texture, warm desaturated neutral colours, realistic anatomy, full outfit visible head to shoes, **no brands, logos or text**. Settings in Sydney: apartment, cafe exterior, terrace street, harbour walk, gallery, park.

Outfits, in panel order (left-to-right, top-to-bottom):

Sheet A:
1. fit-01: plain white tee, charcoal tailored trousers, white leather court sneakers. Mirror selfie at home, morning light.
2. fit-02: sage-green short-sleeve camp-collar shirt, black straight jeans, black leather derby shoes. Cafe exterior.
3. fit-03: navy crew-neck knit, indigo jeans, brown suede chelsea boots. Terrace-house street.
4. fit-04: cream long-sleeve shirt, olive cargo trousers, white low sneakers. Park path.

Sheet B:
5. fit-05: heather-grey crewneck sweatshirt, black joggers, grey running shoes. Early-morning street.
6. fit-06: black knit polo, stone-coloured trousers, black loafers. Evening, restaurant doorway.
7. fit-07: brown quarter-zip knit, indigo baggy jeans, brown derby shoes. Gallery interior.
8. fit-08: light-blue short-sleeve shirt, charcoal shorts, white low sneakers. Harbour walk, bright day.

Save the sheets as `sheet-a.png` and `sheet-b.png`.

## 2. Split into seed photos

Use the Codex runtime Python with Pillow (`~/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`). Split each sheet into its four panels, trim any bleed so no neighbouring panel shows (check the edges), resize to fit within 900×1500 and save as `SeedPhotos/fit-01.jpg` … `fit-08.jpg` (quality 85).

## 3. Garment cutouts from the templates

Templates (grey photos with alpha) are in `/Users/lance/Documents/Projects/fits-app-workspace/fits-app-workspace/Resources/PhotoTemplates/` (read-only). Tint them with this luminance-multiply method:

```python
im = Image.open(p).convert("RGBA"); alpha = im.getchannel("A")
lum = ImageOps.autocontrast(im.convert("L"), cutoff=1)
channels = [lum.point([max(0, min(255, int(c * (0.55 + 0.75 * (v / 255))))) for v in range(256)]) for c in rgb]
tinted = Image.merge("RGBA", (*channels, alpha)); tinted.thumbnail((600, 600))
```

Save as `SeedCutouts/fit-NN_<top|bottom|shoes>.png`:

| fit | top | bottom | shoes |
|---|---|---|---|
| 01 | tee (240,238,232) | trousers (68,68,70) | courtSneaker (238,234,226) |
| 02 | campShirt (138,154,126) | jeans (40,40,42) | derby (36,34,32) |
| 03 | knit (44,52,78) | jeans (52,64,98) | chelsea (110,80,56) |
| 04 | shirt (232,222,200) | cargo (96,100,68) | sneakerLow (240,238,232) |
| 05 | sweatshirt (150,150,152) | joggers (40,40,42) | runner (140,142,146) |
| 06 | polo (36,36,38) | trousers (196,184,160) | loafer (40,38,36) |
| 07 | quarterZip (120,86,60) | baggyJeans (56,70,104) | derby (96,66,44) |
| 08 | shirt (160,186,214) | shorts (70,70,72) | sneakerLow (240,238,232) |

White and near-white garments must still read against a light background: if a tinted white template looks blown out, lower its highlights (e.g. cap the LUT at 0.97 of the colour) rather than changing the colour.

## 4. Contact sheet

Write `sheet.png`: the 8 seed photos in a row on top, the 24 cutouts beneath on a #EEE9E0 ground, so a human can check colours match the photos at a glance.

Report: the files written, and any panel where the outfit in the photo doesn't match its row in the table.
