# Images - Mother's Day UK static site

Place image assets here. Use WebP with srcset sizes: 480, 665, 830, 960, 1440, 1920.

## Required files

- **favicon.ico**, **favicon.svg** – already present
- **icon-192.png**, **icon-512.png** – for PWA/manifest (generate from favicon-original if needed)
- **hero-uk-480.webp**, **hero-uk-960.webp**, **hero-uk-1920.webp** – home hero
- **london-480.webp**, **london-960.webp**, **london-1920.webp** – London city hero (and same pattern for manchester, edinburgh, etc.)
- **plan-placeholder-960.webp** – placeholder for plan cards
- **og-mothers-day-uk.jpg** – Open Graph image (JPG/PNG for social)

## Generate sizes with sharp

```powershell
$sizes = @(480, 665, 830, 960, 1440, 1920)
foreach ($size in $sizes) {
  npx sharp-cli -i images-backup/hero-uk.webp -o images/hero-uk-$size.webp resize $size -q 80
}
```

Keep originals in `images-backup/` (gitignored).
