# Brandrisk.info

En fokuserad svensk webbapp som visar aktuell brandrisk, registrerat eldningsförbud och sexdygnsprognos för en vald plats. Appen lagrar inte användarens position och har ingen databas.

## Arkitektur

- Next.js App Router med TypeScript och Tailwind CSS.
- Webbläsarens Geolocation API används först efter ett aktivt knapptryck.
- `/api/status` rundar koordinater till tre decimaler, hämtar och normaliserar myndighetsdata samt cachar externa svar i 10 minuter.
- `/api/geocode` söker svenska platser via OpenStreetMap Nominatim och cachar svar i 24 timmar.
- `/plats/[slug]` ger sökta platser delbara och indexerbara URL:er utan att bygga ett stort SEO-register.

## Datakällor

- Brandrisk Ute API från Myndigheten för civilt försvar: `CurrentRisk`, `FireProhibition`, `RiskDailyForecast` och `RiskLevels`.
- OpenStreetMap Nominatim för svensk orts- och postnummersökning samt namn på GPS-positioner.

## Köra lokalt

Krav: Node.js 20.9 eller senare och pnpm.

```bash
pnpm install
pnpm dev
```

Öppna `http://localhost:3000`.

Produktionskontroll:

```bash
pnpm lint
pnpm build
pnpm start
```

## Miljövariabler

Inga miljövariabler krävs i V1. De offentliga API:erna anropas endast från servern.

## Driftsätta på Vercel

1. Lägg projektet i ett GitHub-, GitLab- eller Bitbucket-repository.
2. Välj **Add New → Project** i Vercel och importera repositoryt.
3. Behåll ramverksvalet **Next.js** och standardvärdena för build/output.
4. Lägg inte till några miljövariabler.
5. Klicka **Deploy**.
6. Lägg till domänen `brandrisk.info` under **Project Settings → Domains** om den ska användas.

Alternativt med Vercel CLI:

```bash
pnpm dlx vercel
pnpm dlx vercel --prod
```

## Begränsningar

Brandrisk är en modellbaserad prognos som kan variera lokalt. Eldningsförbud bygger på registrerade beslut och måste vid osäkerhet verifieras hos ansvarig kommun eller länsstyrelse. Prognosdata kan saknas utanför brandsäsong. Nominatim är en kostnadsfri MVP-tjänst med användningsbegränsningar; vid stor trafik bör en avtalad geokodningstjänst användas.
