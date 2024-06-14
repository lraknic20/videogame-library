/**
 * FavoritController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getFavourites: async function (req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const count = await Favorit.count();
            const sortDirection = req.query.sort || 'desc';

            const favoriti = await Favorit.find().populate('favoritIgra').sort('id '+sortDirection).skip((page - 1) * pageSize).limit(pageSize);
            const games = favoriti.map(favorit => favorit.favoritIgra);

            return res.ok({count, games});
        } catch (err) {
            return res.serverError(err);
        }
    },

    getFavouritesForUser: async function (req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const korisnikId = req.params.id;
            const count = await await Favorit.count({
                favoritKorisnik: korisnikId,
            });
            const sortDirection = req.query.sort || 'desc';

            const favoriti = await Favorit.find({
                favoritKorisnik: korisnikId,
            }).populate('favoritIgra').sort('id '+sortDirection).skip((page - 1) * pageSize).limit(pageSize);
            const games = favoriti.map(favorit => favorit.favoritIgra);

            return res.ok({count, games});
        } catch (err) {
            return res.serverError(err);
        }
    },

    getFavouriteForUser: async function (req, res) {
        try {
            const korisnikId = req.params.id;
            const gameId = req.params.gameId;

            const favoriti = await Favorit.find({
                favoritKorisnik: korisnikId,
                favoritIgra: gameId,
            });

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
                    const newFavorite = await Favorit.create({
                        favoritKorisnik: korisnikId,
                        favoritIgra: igraId,
                    }).fetch();

                    return res.status(200).json({
                        message: 'Igra je dodana u favorite!',
                        favorit: newFavorite,
                    });
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