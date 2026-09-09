# Favourite Beers cover images

Drop a logo/photo in here, slugified (lowercase, spaces and punctuation
replaced with `-`). The lookup checks the **beer name** first, then falls
back to the **brewery** name:

- Beer name match: `Shine` → `shine.jpg`
- Brewery match (used when no beer-specific image exists): `Moor Beer Company`
  → `moor-beer-company.jpg`

A brewery image is reused across every beer from that brewery that doesn't
have its own image — a photo of each individual beer isn't realistic to
source for most of the list, but a brewery logo usually is. Add
beer-specific images as and when you have them.

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.

Any beer/brewery without a matching file falls back to the initials
placeholder, so this can be filled in gradually — no need to source all of
them at once.
