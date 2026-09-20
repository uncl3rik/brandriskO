# Väder vid vald plats

Platsresultatet visar temperatur, relativ luftfuktighet och vind från SMHI SNOW1gv1. Det är en punktprognos, inte ett kommunmedelvärde. Stockholmsguiden hänvisar till platsvalet utan en förvald väderprognos för centrum.

`POST /api/weather` validerar koordinater och avrundar dem till två decimaler före hämtning från SMHI. Hämtningen cachas i tio minuter och har åtta sekunders timeout. Inga API-nycklar behövs. Väder hämtas separat i klienten så att ett väderfel inte hindrar visning av brandrisk och förbudsstatus.

Normaliseringen väljer närmaste kommande prognostid inom tre timmar och avvisar prognoser skapade för mer än tolv timmar sedan. Saknade värden visas som saknade, aldrig som noll. Prognostid, källtid, prognospunkt och källa visas i kortet. Vädret ersätter inte brandriskprognos eller myndighetsbeslut.

Källa och dokumentation: https://opendata.smhi.se/metfcst/snow1gv1/
Användningsvillkor: https://www.smhi.se/data/om-smhis-data/villkor-for-anvandning

Verifierat 2026-09-20: lint, produktionsbygge och samtliga 21 tester passerar. Lokal API-kontroll mot SMHI ger giltiga värden; felaktiga koordinater ger 400. Platsresultatet har kontrollerats i webbläsare med riktig prognosdata. Ingen publicering har utförts.
