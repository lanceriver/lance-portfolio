# Travel originals

Export here from Photos: **File → Export → Export Unmodified Original…**
Full resolution, EXIF intact — `scripts/ingest-photo.py` needs the orientation
tag to bake the rotation into pixels, and strips GPS on the way out.

Then:

    python3 scripts/ingest-photo.py assets-source/travel/*.heic
    python3 scripts/sample-palette.py public/plates/<name>-1200.webp --count=7

**These originals are deliberately not committed.** They already live in the
Photos library, which is the real archive; duplicating them into git would add
tens of megabytes of binary that nothing can diff and nobody would ever restore
from here. The derived `public/plates/*.webp` are committed, because those are
what the site serves and what the palette was measured from.
