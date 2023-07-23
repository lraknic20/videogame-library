/**
 * FavoritController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    saveFavourite: async function (req, res) {
        try {
            const korisnikId = req.body.korisnik;
            const igraId = req.body.igra;

            const existingGame = await Igra.findOne({ id: igraId });
            if (existingGame) {
                const favExists = await Favorit.findOne({
                    korisnik: korisnikId,
                    igra: igraId,
                });
    
                if (!favExists) {
                    await Favorit.create({
                        korisnik: korisnikId,
                        igra: igraId,
                    });
    
                    return res.ok('Igra je dodana u favorite!');
                } else {
                    return res.badRequest('Igra već postoji u favoritima!');
                }
            } else {
                return res.status(404).json('Igra nije pronađena!');
            }
        } catch (err) {
            return res.serverError(err);
        }
    }
};