/**
 * RecenzijaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getReviews: async function (req, res) {
        try {
            const reviews = await Recenzija.find().populate('recenzijaKorisnik').populate('recenzijaIgra');

            const anonReviews = reviews.map(review => {
                return {
                    ...review,
                    recenzijaKorisnik: review.recenzijaKorisnik.korime
                };
            });

            return res.ok(anonReviews);
        } catch (err) {
            return res.serverError(err);
        }
    },

    getReviewsForModerator: async function (req, res) {
        try {
            const userId = req.params.id;

            const user = await Korisnik.findOne({ id: userId }).populate('zaduzenZanr');

            if (!user) {
                return res.status(404).json('Korisnik nije pronađen!');
            }
            if (user.tip_korisnika_id !== 3) {
                return res.status(403).json('Korisnik nije moderator!');
            }

            if(user.zaduzenZanr.length == 0) {
                return res.status(404).json('Korisnik nema zadužene žanrove!');
            }

            const zaduzeniZanrovi = user.zaduzenZanr.map(zanr => zanr.id);

            const reviews = await Recenzija.find().populate('recenzijaKorisnik').populate('recenzijaIgra');

            var gameIds = reviews.map(review => review.recenzijaIgra.id);

            const game_genre = await Igra_zanr.find({ igra: gameIds, zanr: zaduzeniZanrovi }).populate('igra').populate('zanr');

            const anonReviews = reviews.map(review => {
                let game = game_genre.find(game_genre => game_genre.igra.id === review.recenzijaIgra.id);
                if (game) {
                    const { recenzijaKorisnik, recenzijaIgra, ...reviewWithoutKorisnikIgra } = review;
                    return {
                        ...reviewWithoutKorisnikIgra,
                        igra: {
                            id: review.recenzijaIgra.id,
                            naziv: review.recenzijaIgra.naziv,
                            kratki_naziv: review.recenzijaIgra.kratki_naziv,
                            slika: review.recenzijaIgra.slika,
                        },
                        korime: review.recenzijaKorisnik.korime,
                        korisnikId: review.recenzijaKorisnik.id,
                        datum_istek_bloka: review.recenzijaKorisnik.datum_istek_bloka,
                    };
                }
            }).filter(Boolean).sort((a, b) => (a.obrisano === b.obrisano ? 0 : a.obrisano ? 1 : -1));

            return res.ok(anonReviews);
        } catch (err) {
            return res.serverError(err);
        }
    },

    getReviewsForGame: async function (req, res) {
        try {
            const igraId = req.params.gameId;

            const reviews = await Recenzija.find({ recenzijaIgra: igraId }).populate('recenzijaKorisnik');

            const anonReviews = reviews.map(review => {
                const { recenzijaKorisnik, ...reviewWithoutKorisnik } = review;
                return {
                    ...reviewWithoutKorisnik,
                    korime: recenzijaKorisnik.korime,
                    korisnikId: recenzijaKorisnik.id
                };
            });

            return res.ok(anonReviews);
        } catch (err) {
            return res.serverError(err);
        }
    },

    saveReview: async function (req, res) {
        try {
            const korisnikId = req.body.korisnik;
            const igraId = req.body.igra;
            const ocjena = req.body.ocjena;
            const komentar = req.body.komentar;

            const blocked = await Korisnik.isBlocked(korisnikId);
            if (blocked.status) {
                return res.status(403).json(blocked.message);
            }

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
    },

    markAsDeltedReview: async function (req, res) {
        try {
            const recenzijaId = req.params.id;

            const reviewExists = await Recenzija.findOne({ id: recenzijaId });

            if (reviewExists) {
                if (reviewExists.obrisano == 1) {
                    return res.badRequest('Recenzija je već označena kao obrisana!');
                }
                const updatedReview = {
                    obrisano: true
                }
                await Recenzija.updateOne({ id: recenzijaId }).set(updatedReview);

                return res.ok('Recenzija je označena kao obrisana!');
            } else {
                return res.badRequest('Recenzija ne postoji!');
            }
        } catch (err) {
            return res.serverError(err);
        }
    },

    deleteReview: async function (req, res) {
        try {
            const recenzijaId = req.params.id;

            const reviewExists = await Recenzija.findOne({ id: recenzijaId });

            if (reviewExists) {
                await Recenzija.destroy({ id: recenzijaId });

                return res.ok('Recenzija je uklonjena!');
            } else {
                return res.badRequest('Recenzija ne postoji!');
            }
        } catch (err) {
            return res.serverError(err);
        }
    }
};

