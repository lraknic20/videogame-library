/**
 * RecenzijaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    saveReview: async function (req, res) {
        try {
            const korisnikId = req.body.korisnik;
            const igraId = req.body.igra;
            const ocjena = req.body.ocjena;
            const komentar = req.body.komentar;

            const existingGame = await Igra.findOne({ id: igraId });
            if (existingGame) {
                const reviewExists = await Recenzija.findOne({
                    recenzijaKorisnik: korisnikId,
                    recenzijaIgra: igraId,
                });

                if (!reviewExists) {
                    await Recenzija.create({
                        recenzijaKorisnik: korisnikId,
                        recenzijaIgra: igraId,
                        ocjena: ocjena,
                        komentar: komentar,
                        datum: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    });
                    return res.ok('Recenzija je dodana!');
                } else {
                    return res.badRequest('Recenzija već postoji!');
                }
            } else {
                return res.status(404).json('Igra nije pronađena!');
            }
        } catch (err) {
            return res.serverError(err);
        }
    }
};

