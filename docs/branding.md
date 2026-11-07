# Logotyp och ikoner, 2026-11-07

Grafiken kommer från användarens `brandrisk-logo-filer.zip`. Originalen i SVG och PNG finns i `public/`, inklusive vita varianter för mörka bakgrunder.

- Sidhuvudet använder `public/brandrisk-logo.svg`, med symbol och ordmärke i originalets proportioner.
- `src/app/favicon.ico` och `src/app/icon.png` kommer från paketets favicon respektive `favicon-32.png`.
- `src/app/apple-icon.png` och `public/apple-touch-icon.png` använder paketets Apple-ikon.
- Manifestets `public/icon-512.png` använder appikonen från paketet. `public/icon-192.png` är en nedskalad version.
- `public/og.png` är en delningsbild på 1200 × 630 pixlar med den nya SVG-logotypen på webbplatsens cremefärgade bakgrund.

Next.js genererar ikonernas metadata från filerna i `src/app/`. Manifestikoner och delningsbilder använder versionsparametern `v=4` för att förnya cachelagrade bilder. Den tidigare logotypfilen har tagits bort.
