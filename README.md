# Brandrisk.info

En fokuserad svensk webbapp som visar aktuell brandrisk, registrerat eldningsförbud och sexdygnsprognos för en vald plats. Appen lagrar inte användarens position och har ingen databas.

## Arkitektur

- Next.js App Router med TypeScript och Tailwind CSS.
- Webbläsarens Geolocation API används först efter ett aktivt knapptryck.
- `/api/status` tar emot position via POST. Förbud kontrolleras med exakta koordinater utan cache. Riskkoordinater rundas till tre decimaler och risksvar cachas i högst 10 minuter per serverprocess.
- `/api/geocode` söker svenska platser via OpenStreetMap Nominatim och cachar svar i 24 timmar.
- `/plats/[slug]?name=…&lat=…&lon=…` låser delade länkar till vald sökträff. Dessa sidor är inte indexerbara. GPS-position skrivs inte till adressfältet.

## Datakällor

- Brandrisk Ute API från Myndigheten för civilt försvar: `CurrentRisk`, `FireProhibition`, `RiskDailyForecast` och `RiskLevels`.
- OpenStreetMap Nominatim-kompatibel tjänst för svensk orts- och postnummersökning. Flera träffar kräver ett aktivt val. GPS-positioner skickas inte till geokodningstjänsten.

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

**Uppdatering:** Befintliga Nominatim kan nu användas på Vercel med delad Redis-cache och gemensamt anropslås. Anslut `UPSTASH_REDIS_REST_URL` och `UPSTASH_REDIS_REST_TOKEN` (eller `KV_REST_API_URL` / `KV_REST_API_TOKEN`) enligt [driftguiden](docs/geocoding-production.md). Då behövs ingen alternativ `GEOCODING_BASE_URL`. Utan Redis eller konfigurerad proxy kvarstår driftspärren.

Lokalt krävs inga miljövariabler. På Vercel krävs `GEOCODING_BASE_URL` till en Nominatim-kompatibel leverantör eller gemensam proxy som upprätthåller tjänstens användningsvillkor. Utan detta är ortsökningen avstängd på Vercel; GPS och redan koordinatsatta platslänkar fungerar fortfarande. Se `.env.example`. Ingen ny leverantör eller betaltjänst har anslutits.

Den lokala begränsningen (ett anrop per 1,1 sekunder) gäller per serverprocess och ersätter inte en global kvot. Offentliga Nominatim tillåter högst ett anrop per sekund för hela appen: https://operations.osmfoundation.org/policies/nominatim/

## Driftsätta på Vercel

1. Lägg projektet i ett GitHub-, GitLab- eller Bitbucket-repository.
2. Välj **Add New → Project** i Vercel och importera repositoryt.
3. Behåll ramverksvalet **Next.js** och standardvärdena för build/output.
4. Konfigurera `GEOCODING_BASE_URL` enligt ovan innan publicering.
5. Klicka **Deploy**.
6. Lägg till domänen `brandrisk.info` under **Project Settings → Domains** om den ska användas.

Alternativt med Vercel CLI:

```bash
pnpm dlx vercel
pnpm dlx vercel --prod
```

## Begränsningar

Brandrisk är en modellbaserad prognos som kan variera lokalt. Eldningsförbud bygger på registrerade beslut och måste vid osäkerhet verifieras hos ansvarig kommun eller länsstyrelse. Prognosdata kan saknas utanför brandsäsong. Nominatim är en kostnadsfri MVP-tjänst med användningsbegränsningar; vid stor trafik bör en avtalad geokodningstjänst användas.

Riskindex visas som sammanvägd nivå, inte som FWI-klass. Okända förbudstexter ger okänd status. API:s tidsangivelser saknar tidszon och visas därför som källtext. Resultat uppdateras efter fem minuter när fliken är synlig. Kontrolltiden är inte samma sak som prognosens utfärdandetid.

Normaliseringstester (Node 22.18 eller senare): `node --experimental-strip-types --test tests/risk-normalization.test.mjs`.
