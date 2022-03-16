# PlantForMe - Veb aplikacija bazirana na mikroservisnoj arhitekturi
Autor: Jelena Stojanovic, SW-79-2018

## Opis problema
PlantForMe je veb aplikacija koja za cilj ima da omogući korisnicima da pronađu biljku za sebe koja im najviše odgovara, odnosno njihovim uslovima života. Aplikacija je namenjena za sve ljubitelje biljaka, jer pored napredne pretrage pruža mogućnost vođenja beleški o biljkama koje korisnik poseduje, poput dodavanja biljke u svoju kolekciju, označavanje datuma zalivanja, presađivanja, prihranjivanja itd. Biljke koje postoje u sistemu unose moderatori, prilikom čega definišu njen naziv, sliku, opis održavanja i parametre koji se kasnije koriste za naprednu pretragu. Korisnici mogu da daju svoje mišljenje o biljci i generalnu ocenu, što pomaže ostalim korisnicima u odlučivanju da li bi posedovali određenu biljku. Takođe, aplikacija sadrži i deo za forum gde korisnici mogu otvarati teme za diskusiju. Uloge koje postoje u sistemu su registrovani korisnici, moderatori i admin, a neke funkcije sistema mogu koristiti i neautentifikovani korisnici.

## Funkcionalnosti
### Funkcionalnosti neautentifikovanog korisnika

Neautentifikovani korisnik ima mogućnost da se registruje i prijavi na sistem. Prilikom registracije, unose se: korisničko ime, lozinka, puno ime, email. Pored osnovnih informacija o korisniku, u slučaju da se doda još jedan mikroservis, unose se i vrednosti koje opisuju uslove života u kojima korisnik živi: strana sveta ka kojoj je kuća/stan okrenut, da li ima dvorište, da li ima vremena da se posveti biljci, kakvi su uslovi života preko zime (centralno grejanje, hladna prostorija itd...). Ove informacije su bitne ukoliko se aplikacija proširi i uvede mikroservis za preporuku biljaka korisniku na osnovu informacija o korisniku.

Pored registracije i prijave, neautentifikovani korisnik može da pretražuje biljke po:
-	nazivu
-	kategoriji
-	količini svetla neophodnog biljci
-	količini zalivanja
-	brzini rasta
-	nežnosti biljke (prezimljava unutra ili može i napolju)
-	dužini života (jednogodišnje, dvogodišnje, višegodišnje)
-	visini
-	period cvetanja

Parametri uključuju jedni druge, pa korisnik može da kombinuje parametre za pretragu.

### Funkcionalnosti ulogovanog korisnika
Korisnici imaju uvid u svaku biljku koju je postavio moderator, odnosno mogu da vide opis i sve parametre koji je definišu. Na toj strani, mogu da ostave svoj komentar o toj biljci i da je ocene, što pomaže ostalim korisnicima koji bi možda želeli da je imaju. Registrovani korisnici pored pretrage mogu i da prave svoje kolekcije biljaka, dodaju nove biljke u kolekciju i definišu taskove za te biljke, tako što unose šta treba da se obavi i na koji datum. Takođe, mogu da otvaraju teme za diskusiju na forumu i komentarišu diskusije.
Svaki autentifikovan korisnik može da menja svoje podatke na profilu.

### Funkcionalnosti moderatora
Moderatori unose nove kategorije i biljke u sistem koje izlaze na stranici za pretragu, a mogu da ih menjaju i brišu. Imaju uvid u svoje biljke koje su postavili. 
Biljku definišu:
-	naziv
-	opis
-	kategorija
-	količina svetlosti neophodna
-	učestalost zalivanja
-	cvetanje
-	brzina rasta
-	nežnost
-	visina
-	dužina života
-	slika
-	datum kreiranja

### Funkcionalnosti admina
Admin može kreirati nove korisnike i moderatore. On takođe ima uvid u izveštaje o moderatorima i biljkama.

## Arhitektura sistema 
**API Gateway** – servis za grupisanje svih usluga dostupnih korisnicima. Tehnologija: Nginx

**User service** – GoLang mikroservis i MySQL baza podataka. Zadužen za registraciju, prijavu, autentifikaciju i autorizaciju i dodavanje novih korisnika

**Plant service** – GoLang mikroservis i MySQL baza podataka za CRUD operacije nad biljkama i za njihovu pretragu

**PlantCare service** – GoLang mikroservis i MySQL baza podataka za korisničko dodavanje svojih kolekcija i biljaka, kao i taskova za biljke

**Forum service** – GoLang mikroservis i MySQL baza podataka za upravljanje diskusijama na forumu

**Report service** – Pharo servis za izveštaje o moderatorima i biljkama

**Recommendation service** – GoLang mikroservis i Neo4j baza podataka za preporuku biljaka korisnicima na osnovu onih koje već poseduju

**React front-end aplikacija** – Monolitna react aplikacija koja komunicira sa api gateway-om
