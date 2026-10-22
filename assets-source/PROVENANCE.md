# Asset provenance

The original four plates originate from the **authorised handoff bundle**:
`~/Downloads/lance_astra_handoff_bundle/`

| File | Origin |
|------|--------|
| `alpine-village.png` | `snowy_alpine_village_getaway.png` — the approved hero artwork, copied verbatim |
| `coastal-road.png`   | extracted from `lance_portfolio_combined_latest.html` (embedded base64) |
| `lake-terrace.png`   | extracted from `lance_portfolio_combined_latest.html` (embedded base64) |
| `hill-path.png`      | extracted from `lance_portfolio_combined_latest.html` (embedded base64) |
| `zhangjiajie-pillars.png` | AI-generated (OpenAI image model) by Lance from his own Zhangjiajie photograph, 2026-10-21; hero plate |
| `zhangjiajie-pillars-4k.png` | AI upscale (3840x2160) of zhangjiajie-pillars.png by Lance, 2026-10-21; source of the 2x hero export |
| `mountain-road` (WebP exports) | Lance's `IMG_7332.JPG`; winding mountain road in mist on Tianmen Mountain, photographed 24 May 2026; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `coastal-train` (WebP exports) | Lance's `IMG_4312.JPG`; green train on the Busan coast, photographed 16 September 2025; metadata stripped by `scripts/ingest-photo.py` |
| `torii-corridor` (WebP exports) | Lance's `DSC_0791.JPG`; torii corridor at Fushimi Inari, Kyoto, photographed 19 February 2024; metadata stripped by `scripts/ingest-photo.py` |
| `bamboo-canopy` (WebP exports) | Lance's `IMG_8359.JPG`; bamboo canopy, Arashiyama, Kyoto, photographed 20 February 2024; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `kinkakuji` (WebP exports) | Lance's `IMG_8441.JPG`; Kinkaku-ji pavilion, Kyoto, photographed 20 February 2024; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `gamcheon` (WebP exports) | Lance's `IMG_0165.JPG`; Gamcheon Culture Village, Busan, photographed 17 September 2025; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `starfield-library` (WebP exports) | Lance's `IMG_4013.JPG`; Starfield Library, Seoul, photographed 13 September 2025; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `seoul-market` (WebP exports) | Lance's `IMG_4127.JPG`; market food stall, Seoul, photographed 14 September 2025; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `shanghai-bakery` (WebP exports) | Lance's `IMG_7501.JPG`; bakery counter, Shanghai, photographed 25 May 2026; orientation baked in and metadata stripped by `scripts/ingest-photo.py` |
| `public/spotify-logo.svg` | Official `Full_Logo_Black_RGB.svg`, copied unmodified from Spotify's [2024 full-logo asset archive](https://developer.spotify.com/images/guidelines/design/2024-spotify-full-logo.zip) |

The four original plate PNGs and `zhangjiajie-pillars.png` are 1672 x 941. The
separate `zhangjiajie-pillars-4k.png` upscale is 3840 x 2160. Travel photo
exports retain each original's orientation and aspect ratio. Do not upscale
past native resolution or apply CSS filters.

**No asset in this project came from any `resume-frontend*` or previous resume-website project.**
The original four plates came from the approved prototype bundle; the Zhangjiajie
hero image was generated from Lance's own photograph as recorded above. The
Field Notes travel photographs are Lance's originals; those originals remain in
his Photos library and are not committed here.
