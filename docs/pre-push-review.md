# Kontroll inför push, 2026-09-20

Granskat: samtliga lokala ändringar för SEO, grillningsinnehåll, Stockholmsguiden, väder och nya logotypen.

## Logotyp

Användarens PNG används i sidhuvudet, som favicon (16, 32, 48 och 256 px), vanlig ikon, Apple-ikon, manifestikoner (192 och 512 px) och delningsbild (1200 × 630 px). Bildens vita bakgrund och proportioner är bevarade. Nytt filnamn för sidhuvudet och versionsparameter för delningsbild/manifestikoner minskar risken att gamla bilder ligger kvar i cache. Den tidigare, oanvända företagslogotypen har tagits bort.

## Genomförda kontroller

- ESLint och alla 21 tester passerar.
- Produktionsbygget passerar, inklusive TypeScript och förrendering.
- Alla fem indexerbara sidor ger HTTP 200, en huvudrubrik, korrekt canonical och den nya delningsbilden.
- Platsadresser har noindex och saknar canonical. Sitemap innehåller endast de fem avsedda sidorna.
- Samtliga ikoner, logotyp, delningsbild, manifest och robots.txt ger HTTP 200.
- Status- och väder-API fungerar med riktiga myndighetsdata; ogiltiga koordinater ger 400.
- Ortssökning efter Stockholm fungerar i webbläsaren och leder till ett resultat med väder. Byte av plats och navigering till Stockholmsguiden fungerar.
- Sidhuvud och startsida granskade på dator och vid 375 px bredd. Väderkort och resultat granskade på mobil utan horisontellt sidöverflöde.
- Länkarna i förbudskortet separerades för att inte flyta ihop.
- Lokala myndighetskällor kontrollerade. Ingen kommunövergripande livestatus eller sökvolym påstås i Stockholmsguiden.

## Drift och begränsningar

Ingen push eller publicering utförd. Vercels miljövariabler, domänomdirigeringar och produktionsflöden måste verifieras efter publicering. Myndighetens API kan lämna en äldre beslutslänk; Stockholmsguiden länkar även till myndigheternas löpande informationssidor. Lokala avrådanden har ingen separat status i API-resultatet, vilket guiden förklarar.
