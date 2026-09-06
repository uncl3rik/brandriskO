# Aktivera befintliga Nominatim på Vercel

Kodstödet kräver en ansluten Redis REST-databas; enbart publicering räcker inte.
Nominatim är fortsatt geokodningstjänsten. Redis lagrar söksvar och samordnar anrop.

1. Anslut en Upstash Redis-databas till Vercel-projektet (kontrollera villkor och pris innan skapande).
2. Sätt `UPSTASH_REDIS_REST_URL` och `UPSTASH_REDIS_REST_TOKEN` som servermiljövariabler, alternativt integrationens `KV_REST_API_URL` och `KV_REST_API_TOKEN`. Lägg aldrig nycklar i chatten, Git eller NEXT_PUBLIC-variabler.
3. Alla produktions-/previewinstallationer som använder offentliga Nominatim måste använda samma databas. Låt `GEOCODING_BASE_URL` vara tom för att behålla Nominatim.
4. Publicera om. Kontrollera `/api/geocode?q=75320`, `/api/geocode?q=Uppsala` och `/api/geocode?q=Uppsala%20kommun` på live-domänen. Vänta några sekunder mellan olika sökningar.
5. Kontrollera att upprepad sökning ger ett cachat svar, och att samtidiga olika sökningar kan ge HTTP 429 med Retry-After i stället för extra externa anrop.

Cache: 24 timmar. Lås: gemensamt atomärt SET NX, hålls genom anropet och ytterligare 1,1 sekunder. Vid avbruten serverprocess löper låset ut efter 30 sekunder. Vid fel i Redis görs ingen osamordnad reservförfrågan. GPS använder inte söktjänsten. Ingen automatisk omsökning eller autocomplete är aktiverad.

Söksträngarnas cachenycklar hashats, men söksvaren innehåller orter/postnummer. Redis-tillgång ska begränsas till servern. Befintlig minnescache är bara ett extra lager, inte den globala begränsningen.

Källor: https://operations.osmfoundation.org/policies/nominatim/ och https://upstash.com/docs/redis/features/restapi
