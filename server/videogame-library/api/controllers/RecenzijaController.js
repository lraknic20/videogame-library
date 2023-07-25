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
                if(reviewExists.obrisano == 1) {
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

