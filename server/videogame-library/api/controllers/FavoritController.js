/**
 * FavoritController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getFavourites: async function (req, res) {
        try {
            const favoriti = await Favorit.find().populate('favoritIgra');

            return res.ok(favoriti);
        } catch (err) {
            return res.serverError(err);
        }
    },

    getFavouritesForUser: async function (req, res) {
        try {
            const korisnikId = req.params.userId;

            const favoriti = await Favorit.find({
                favoritKorisnik: korisnikId,
            }).populate('favoritIgra');

            return res.ok(favoriti);
        } catch (err) {
            return res.serverError(err);
        }
    },
    
    saveFavourite: async function (req, res) {
        try {
            const korisnikId = req.body.korisnik;
            const igraId = req.body.igra;

            const existingGame = await Igra.findOne({ id: igraId });
            if (existingGame) {
                const favExists = await Favorit.findOne({
                    favoritKorisnik: korisnikId,
                    favoritIgra: igraId,
                });

                if (!favExists) {
                    await Favorit.create({
                        favoritKorisnik: korisnikId,
                        favoritIgra: igraId,
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
    },

    deleteFavourite: async function (req, res) {
        try {
            const favoritId = req.params.id;

            const favExists = await Favorit.findOne({ id: favoritId });

            if (favExists) {
                await Favorit.destroy({ id: favoritId });

                return res.ok('Igra je uklonjena iz favorita!');
            } else {
                return res.badRequest('Igra ne postoji u favoritima!');
            }

        } catch (err) {
            return res.serverError(err);
        }
    }
};