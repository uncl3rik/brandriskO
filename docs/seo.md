# SEO-struktur, första etappen

Implementerad 2026-09-09. Sökämnena är hypoteser utifrån tjänstens funktion, inte validerade sökvolymer.

## Sidor och ansvar

| Adress | Huvudsyfte |
| --- | --- |
| `/` | Kontrollera brandrisk och registrerad förbudsstatus för en punkt i Sverige. |
| `/eldningsforbud` | Förstå förbudsstatus och hitta det lokala beslutet. |
| `/brandrisknivaer` | Tolka tjänstens sammanvägda nivå och prognos. |
| `/om` | Förstå avsändare, datakällor och begränsningar. |
| `/plats/[slug]?…` | Dela en sökpunkt; fortsatt `noindex, follow`, utan canonical och utanför sitemap. |

Next.js använder adresser utan avslutande snedstreck för undersidor. De fyra indexerbara sidorna förrenderas. Startsidan skickar sitt beständiga informationsinnehåll som serverrenderade children till det interaktiva verktyget. Header och footer ligger i rotlayouten och visas även vid laddning och API-fel.

Sidmetadata skapas via `src/lib/seo.ts`. Varje indexerbar sida ska få egen canonical, titel, beskrivning och delningsmetadata. Ingen startsidescanonical ärvs från rotlayouten. Lägg endast avsedda indexerbara sidor i `src/app/sitemap.ts`. Blockera inte platsadresser i robots.txt: sökmotorer måste kunna läsa deras noindex.

## Innehåll och underhåll

Guiderna hänvisar till Myndigheten för civilt försvars sidor om Brandrisk Ute och eldningsförbud. Granskningsdatum avser källkontroll, inte liveuppgifternas aktualitet. Vid ändrade regler eller ändrat API ska texterna granskas på nytt. Ge aldrig ett generellt tillstånd att elda utifrån avsaknad av registrerat förbud.

Stockholm Vedspisars koppling, logotypvisning och länk har tagits bort ur sidhuvudet på användarens begäran. Bildfilen ligger kvar som oanvänd tillgång. Ingen affärskonvertering till butiken har införts.

## Kontrollerat lokalt

- `pnpm lint`, `pnpm build` och de 18 befintliga testerna med `node --experimental-strip-types --test tests/*.test.mjs`.
- Produktions-HTML: status 200, unik titel, en huvudrubrik och ett main-element, rätt canonical och fungerande interna sidlänkar.
- Informationsinnehåll finns i HTML utan JavaScript; platsadresser har noindex och saknar canonical.
- Sitemap innehåller endast de fyra avsedda sidorna; robots.txt anger sitemap.
- Startsida och artikelmall granskade i webbläsare, även vid 375 pixels bredd. Länk från guide tillbaka till verktyget fungerar.

## Nästa steg i produktion

- Publicera ändringarna genom projektets vanliga Vercel-flöde. Ingen publicering har utförts i denna etapp.
- Verifiera att HTTP och www leder till den valda huvuddomänen `https://brandrisk.info`, utan omdirigeringskedjor eller loopar. Vercels domäninställningar har inte ändrats.
- Kontrollera ortsökningens Redis/proxy-konfiguration enligt `geocoding-production.md` och att myndighetsdata kan hämtas.
- Kontrollera publicerad HTML, sitemap och robots.txt. Skicka sitemap till Search Console och inspektera sidorna där.
- Följ upp organiska sökfrågor och lyckade platskontroller; ingen analysleverantör eller spårning har lagts till.
- Lägg till verifierad kontaktväg till KEZAB när den finns. Hitta inte på e-postadress eller telefonnummer.
- Etapp två: integritetssida efter verifiering av driftleverantörers loggning och datahantering. Nuvarande positionslöfte behöver kontrolleras mot faktisk drift.
- Skapa inga ortssidor utan unikt, verifierat lokalt innehåll och en hållbar uppdateringsrutin.
