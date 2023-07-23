/**
 * IgraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    saveGame: async function (req, res) {
        try {
            const igra = req.body.igra;
            const zanrovi = req.body.zanr;
            const izdavaci = req.body.izdavac;
            const platforme = req.body.platforma;

            const existingGame = await Igra.findOne({ id: igra.id });
            if (existingGame) {
                return res.badRequest('Ova igra je već dodana!');
            }

            const newGame = await Igra.create({
                id: igra.id,
                naziv: igra.naziv,
                kratki_naziv: igra.kratki_naziv,
                opis: igra.opis,
                slika: igra.slika,
                objavljeno: igra.objavljeno,
                datum_izlaska: igra.datum_izlaska,
                stranica: igra.stranica,
                metacritic: igra.metacritic,
                minimalni_zahtjevi: igra.minimalni_zahtjevi,
                preporuceni_zahtjevi: igra.preporuceni_zahtjevi,
            }).fetch();

            if (izdavaci) {
                for (const izdavac of izdavaci) {
                    const existingIzdavac = await Izdavac.findOne({ id: izdavac.id });
                    if (existingIzdavac) {
                        await Igra.addToCollection(newGame.id, 'izdavac', existingIzdavac.id);
                    } else {
                        const newIzdavac = await Izdavac.create({
                            id: izdavac.id,
                            naziv: izdavac.naziv,
                            kratki_naziv: izdavac.kratki_naziv,
                            broj_igara: izdavac.broj_igara,
                        }).fetch();
                        await Igra.addToCollection(newGame.id, 'izdavac', newIzdavac.id);
                    }
                }
            }

            if (zanrovi) {
                await Igra.addToCollection(newGame.id, 'zanr', zanrovi);
            }

            if (platforme) {
                await Igra.addToCollection(newGame.id, 'platforma', platforme);
            }

            return res.ok();
        } catch (err) {
            return res.serverError(err);
        }
    },
};