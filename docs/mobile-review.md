# Mobil- och funktionskontroll 2026-10-09

## Kontrollerat

- Startsida, eldningsförbud, Stockholm, brandrisknivåer och om-sida kontrollerade i webbläsaren vid 320×568, 390×844, 430×932 och 844×390. Ingen horisontell sidöverströmning eller trasiga bilder i dessa 20 kontroller.
- Resultatsidan kontrollerad i samma storlekar. Prognosråd kan öppnas och läsas utan sidledsskroll.
- Ortssökning Stockholm och postnummer 761 51 fungerar. Sökning via Enter, platsbyte och omladdning av delad plats fungerar. Brandrisk och SMHI-väder visas. En sökning utan träff visar ett begripligt fel och sökformuläret kan användas igen.
- Positionshämtning återgår till sökformuläret med felmeddelande efter sin tidsgräns. Hämtningen kan avbrytas. Ingen privat position eller platsbehörighet har delats/godkänts i kontrollen.
- Inga varningar eller fel i webbläsarkonsolen under de verifierade sökflödena.
- Den publicerade sidans geocode-, status- och väder-API svarar med riktiga data för Stockholm.

## Förbättringar

- Större tryckytor och mer lättläst liten text på mobil.
- Platsrubriker, längre texter och kort kan brytas utan att trycka ut layouten.
- Femdagarsprognosen visas som vertikala rader på mobil.
- Ortsfältet visar sökknapp på mobilens tangentbord och stänger av automatisk versal och stavningskontroll.
- Klientens tidsgränser använder AbortController i stället för AbortSignal.any/timeout, för bättre kompatibilitet med äldre mobilwebbläsare. Väderhämtningen avslutas när komponenten lämnas och sena svar ignoreras.

## Bygge och tester

Lint och alla 23 automatiska tester passerar. Produktionsbygge med `next build --webpack` passerar inklusive TypeScript och förgenererade sidor. Standardbygget med Turbopack fick ett internt processfel vid CSS-kompileringen i denna Windowsmiljö. Projektets bygginställningar har inte ändrats; ordinarie Turbopack-bygge är alltså inte verifierat i denna kontroll.

Webbläsartesterna kördes mot det färska produktionsbygget på 127.0.0.1:3108. Den redan öppna förhandsvisningen på port 3100 visade äldre innehåll.

## Begränsningar

Kontrollen använder datorns webbläsare med mobilstorlekar, inte fysiska iPhone-/Android-enheter. Faktisk GPS, Safari, telefonens behörigheter och tangentbord behöver därför provas på telefon. Inget löfte om att samtliga enheter fungerar görs.

Myndighetens data för Stockholm innehåller en länk till en äldre artikel från 2021. Den visas som källänk men bör inte användas som bevis för ett aktuellt lokalt beslut. Källänkens aktualitet behöver följas upp med dataleverantören.

## Avslutande designkontroll

Samtliga fem sidor granskades visuellt i datorvy (1366×900). Mobilens resultatkort, utfällda prognosråd och ankarlänken till grillning granskades igen. Stockholm-guidens knapp leder tillbaka till det fungerande platsverktyget. Typografi, kort, knappar och sidfot bedöms vara sammanhållna i de kontrollerade vyerna. Inga ytterligare layoutändringar behövdes efter mobilförbättringarna.

Användaren har godkänt att dessa ändringar committas och pushas efter kontrollen. Git-resultatet redovisas i chatten.
