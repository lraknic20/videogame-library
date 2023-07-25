/**
 * ZaduzenZanrController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    updateGenresInCharge: async function (req, res) {
        const korisnikId = req.param('id');
        const zaduzeniZanroviId = req.body.zaduzeniZanroviId;

        const korisnik = await Korisnik.findOne({ id: korisnikId });
        if (!korisnik) {
            return res.status(404).json('Korisnik s tim ID-om ne postoji!');
        }

        if (korisnik.tip_korisnika_id !== 3) {
            return res.status(400).json('Korisnik nije moderator!');
        }

        const existingzanrovi = await Zanr.find({ id: zaduzeniZanroviId });
        if (existingzanrovi.length !== zaduzeniZanroviId.length) {
            return res.status(404).json('Zanr s tim ID-om ne postoji!');
        }

        const existingRelations = await ZaduzenZanr.find({ zaduzenKorisnik: korisnikId, zaduzenZanr: zaduzeniZanroviId });
        if (existingRelations.length > 0) {
            return res.status(400).json('Taj žanr je već zadužen za tog korisnika!');
        }

        await Korisnik.addToCollection(korisnikId, 'zaduzenZanr', zaduzeniZanroviId);

        return res.json('Korisniku su uspješno zaduženi žanrovi!');
    }
};

