# Transparent logotyp, 2026-09-24

Den vita bakgrunden har tagits bort med det inbyggda imagegen-verktyget. Huvudfil: `public/brandrisk-logo-v3.png`. Den ersätter v2. Alpha har bevarats i PNG-ikoner och favicon. Delningsbilden använder frilagd logotyp på sidans cremefärgade bakgrund.

Uppdaterade varianter: `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico`, `public/icon-192.png`, `public/icon-512.png`, `public/og.png`. Referenser och versionsparametrar är uppdaterade. Produktionsbygget passerar och sidhuvudet är visuellt kontrollerat i webbläsaren.

Prompt till inbyggda imagegen:

> Use case: background-extraction. Edit target: attached Brandrisk logo. Remove ONLY the white background, including the white negative space between colored arcs and pin and inside the pin around the flame. Output a PNG with genuine transparent alpha, no checkerboard baked in. Preserve the original logo exactly: same dark charcoal location pin, flame contours and red orange yellow cream gradients, green yellow orange red arc shapes, positions and proportions. Keep the pale cream center of flame opaque. No redesign, no text, no added shadow or glow. Preserve square canvas and existing padding.
