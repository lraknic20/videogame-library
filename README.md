# Videogame library

## Opis web aplikacije
Tema web aplikacije je biblioteka videoigara u kojoj je moguće pretraživati videoigre,
filtrirati po žanru, platformi i izdavaču te favorizirati i recenzirati igre. Web aplikacija je
osmišljena tako da igrači videoigra mogu samostalno istraživati nove igre, pregledavati svoje
favorite ili favorite ostalih korisnika te vidjeti mišljenja drugih igrača kroz recenzije. Za izradu
ovog rada korišten je RAWG API koji sadrži više od 500 000 igara. Postoje četiri tipa
korisnika, a to su neprijavljeni korisnik, prijavljeni korisnik, administrator i moderator.

Neprijavljeni korisnik može pregledavati početnu stranicu na kojoj se nalaze igre koje
uskoro izlaze, stranicu istraži na kojoj se mogu pretraživati i filtrirati sve igre, stranicu
izdavači i stranicu najbolje ocijenjene igre. Na svakoj stranici na kojoj je prikazana igra ili
izdavač, moguće je pritisnuti na njihov naziv i vidjeti detaljnije informacije. Na stranici o
detaljima igre moguće je vidjeti recenzije za tu igru, ali nije moguće dodati recenziju. Također
može pristupiti stranicama za registraciju i prijavu.

Prijavljeni korisnik uz sve to može pristupati stranici favoriti na kojoj može vidjeti svoje
favorite ili favorite svih korisnika, stranici recenzije igara na kojoj može vidjeti sve recenzije i
stranicu profil na kojoj može vidjeti i uređivati svoje informacije. Na stranici o detaljima igre
prijavljeni korisnik može dodati recenziju i favorizirati igru.

Administrator ima sve funkcionalnosti kao i prijavljeni korisnik, a uz to ima stranicu
admin na kojoj može uređivati tip korisnika, određivati zadužene žanrove za moderatora,
unijeti nove žanrove ili platforme, promijeniti naziv žanrova i pregledavati statistiku.

Moderator ima sve funkcionalnosti kao i prijavljeni korisnik, a uz to ima stranicu
moderator na kojoj su prikazane sve recenzije te ima mogućnost da obriše recenziju i blokira
korisnika na određeno vrijeme.

## Dijagram arhitekture
<img src="https://github.com/lraknic20/videogame-library/blob/442d3a28026a79acc6011ad5ac10ed045089acb5/Slike/Dijagram%20arhitekture.png" width="800">

## ERA model
<img src="https://github.com/lraknic20/videogame-library/blob/442d3a28026a79acc6011ad5ac10ed045089acb5/Slike/ERA%20model.png" width="800">

## Snimka ekrana
<img src="https://github.com/lraknic20/videogame-library/blob/442d3a28026a79acc6011ad5ac10ed045089acb5/Slike/Snimka%20ekrana.png" width="800">
