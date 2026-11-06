# Väder vid vald plats

## Utekoll, november 2026

Vädret är huvudvyn året runt, med vind (medelvind, riktning och byvind), temperatur och relativ luftfuktighet som tre huvudvärden. Kompasspilen pekar mot vindens ursprung, inte dess rörelseriktning. Vid vindstilla eller saknad vind visas ingen riktningspil. `wind_from_direction` och `wind_speed_of_gust` hämtas från SMHI och ogiltiga/saknade värden blir aldrig noll.

Brandrisk med giltig nivå visas alltid oavsett kalendermånad. Utan nivå visas ett kort saknas-besked och myndighetens beskrivning kan fällas ut. Prognosen visar väder utan upprepade tomma riskkort när alla risknivåer saknas. Eldningsförbudet visas alltid, även när brandriskprognosen saknas.

Resultatet börjar med en kompakt väderöversikt: temperatur, molnighet, vind och nederbörd. Luftfuktighet, modellens ålder, prognospunkt och källinformation finns i en utfällbar del. Molnsymbolen beskriver enbart molnighet, inte nederbördstyp.

Den gemensamma femdagarsvyn matchar väder och brandrisk på svenskt kalenderdatum. Vädret är det framtida prognossteg som ligger närmast lokal kl. 12, med faktisk tid utskriven. Det är inte en dygnssammanfattning eller dygnets högsta temperatur. Saknad riskprognos och saknade vädervärden markeras separat.

API-anropet hämtar nu hela tidsserien för `air_temperature`, `relative_humidity`, `wind_speed`, `cloud_area_fraction` och `precipitation_amount_mean`. Nederbörd visas i mm för intervallet `intervalParametersStartTime`–`time`, aldrig som dygnssumma. Ogiltiga eller saknade intervall ger saknat värde. Datumgrupperingen använder Europe/Stockholm även vid dygnsgränser och vintertid.

## Ursprunglig implementation

Platsresultatet visar temperatur, relativ luftfuktighet och vind från SMHI SNOW1gv1. Det är en punktprognos, inte ett kommunmedelvärde. Stockholmsguiden hänvisar till platsvalet utan en förvald väderprognos för centrum.

`POST /api/weather` validerar koordinater och avrundar dem till två decimaler före hämtning från SMHI. Hämtningen cachas i tio minuter och har åtta sekunders timeout. Inga API-nycklar behövs. Väder hämtas separat i klienten så att ett väderfel inte hindrar visning av brandrisk och förbudsstatus.

Normaliseringen väljer närmaste kommande prognostid inom tre timmar och avvisar prognoser skapade för mer än tolv timmar sedan. Saknade värden visas som saknade, aldrig som noll. Prognostid, källtid, prognospunkt och källa visas i kortet. Vädret ersätter inte brandriskprognos eller myndighetsbeslut.

Källa och dokumentation: https://opendata.smhi.se/metfcst/snow1gv1/
Användningsvillkor: https://www.smhi.se/data/om-smhis-data/villkor-for-anvandning

Verifierat 2026-09-20: lint, produktionsbygge och samtliga 21 tester passerar. Lokal API-kontroll mot SMHI ger giltiga värden; felaktiga koordinater ger 400. Platsresultatet har kontrollerats i webbläsare med riktig prognosdata. Ingen publicering har utförts.
