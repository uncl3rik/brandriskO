# Funktionskontroll 2026-09-24

## Verifierat i produktion

- HTTP leder till HTTPS och huvuddomänen är `https://www.brandrisk.info/`. Ingen Permissions-Policy som blockerar geolocation skickas i HTTP-svaret.
- Startsidan och samtliga fyra guider ger 200. Sitemap är tillgänglig.
- Ortssökning (Stockholm) och postnummersökning (761 51) ger resultat. Två snabba anrop kan ge 429 enligt söktjänstens befintliga begränsning; nytt försök fungerar.
- Brandrisk- och väder-API ger 200 för testpunkter. Ogiltiga koordinater avvisas med 400.

## Lokala förbättringar

- Osäker HTTP visar konkret hjälp för platsåtkomst.
- Nekad behörighet, positionsfel och timeout har separata instruktioner.
- Platsinhämtning har en yttersta väntetid på 30 sekunder och kan avbrytas.
- Sena svar från avbrutna positions- och sökförfrågningar ignoreras; timers städas när komponenten lämnas.
- Vid en cachad väderprognos som inte längre är giltig försöker servern hämta färska data direkt. Detta undviker fel för första besökaren efter inaktivitet när ny data finns.
- Lint, TypeScript, produktionsbygge och 21 befintliga tester passerar. Avbrytning följt av postnummersökning kontrollerad i webbläsare.

## Begränsningar och uppföljning

Fysisk mobil-GPS och telefonens behörigheter kan inte verifieras från den här datorn. Användarens adress, webbläsare och exakta feltext har efterfrågats; telefonens felorsak är inte fastställd. Testet har inte godkänt eller skickat användarens privata position.

SEO-uppföljning: canonical och sitemap använder domänen utan www, medan Vercel omdirigerar till www. Dessa bör samordnas i en separat ändring. Detta blockerar inte platsåtkomst.

Källa för webbläsarens krav på säker anslutning och tillstånd: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

Förbättringarna är inte pushade eller publicerade.
