/**
 * RecenzijaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getReviews: async function (req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const search = req.query.search;
            const yearFilterMin = req.query.yearMin;
            const yearFilterMax = req.query.yearMax;
            const rating = req.query.rating;
            const sortDirection = req.query.sort || 'desc';
            let zanrovi = req.query.zanrovi;
            let platforme = req.query.platforme;
            let izdavaci = req.query.izdavaci;

            let queryCriteria = {};
            if (rating) queryCriteria.ocjena = rating;

            const reviews = await Recenzija.find(queryCriteria).populate('recenzijaKorisnik').populate('recenzijaIgra').sort('id ' + sortDirection);

            const filteredReviews = reviews.filter(review => !review.obrisano);

            var gameIds = filteredReviews.map(review => review.recenzijaIgra.id);

            let sql = `SELECT i.* FROM igra i`;

            if (zanrovi && zanrovi.length > 0) {
                sql += ` INNER JOIN igra_has_zanr z ON i.id = z.igra_id AND z.zanr_id IN (${zanrovi})`;
            }

            if (platforme && platforme.length > 0) {
                sql += ` INNER JOIN igra_has_platforma p ON i.id = p.igra_id AND p.platforma_id IN (${platforme})`;
            }

            if (izdavaci && izdavaci.length > 0) {
                sql += ` INNER JOIN igra_has_izdavac iz ON i.id = iz.igra_id AND iz.izdavac_id IN (${izdavaci})`;
            }

            if (gameIds && gameIds.length > 0) {
                sql += ` WHERE i.id IN (${gameIds})`;
            }

            if (search) {
                sql += ` AND i.naziv LIKE '%${search.trim()}%'`;
            }

            if (yearFilterMin && yearFilterMax) {
                sql += ` AND EXTRACT(YEAR FROM i.datum_izlaska) BETWEEN ${yearFilterMin} AND ${yearFilterMax}`;
            }

            const rawResult = await sails.sendNativeQuery(sql);

            const count = rawResult.rows.length;
            const games = rawResult.rows;

            const anonReviews = filteredReviews.map(review => {
                let game = games.find(game => game.id === review.recenzijaIgra.id);
                if (game) {
                    const { recenzijaKorisnik, recenzijaIgra, ...recenzija } = review;
                    return {
                        ...recenzija,
                        korime: review.recenzijaKorisnik.korime,
                        igra: {
                            id: review.recenzijaIgra.id,
                            naziv: review.recenzijaIgra.naziv,
                            kratki_naziv: review.recenzijaIgra.kratki_naziv,
                            slika: review.recenzijaIgra.slika,
                        }
                    };
                } else return null;
            }).filter(review => review !== null);;

            const allReviews = anonReviews.slice((page - 1) * pageSize, page * pageSize);

            return res.ok({
                count: count,
                recenzije: allReviews,
            });
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

            if (user.zaduzenZanr.length == 0) {
                return res.status(404).json('Korisnik nema zadužene žanrove!');
            }

            const zaduzeniZanrovi = user.zaduzenZanr.map(zanr => zanr.id);

            const reviews = await Recenzija.find().populate('recenzijaKorisnik').populate('recenzijaIgra');

            var gameIds = reviews.map(review => review.recenzijaIgra.id);

            const game_genre = await Igra_zanr.find({ igra: gameIds, zanrovi: zaduzeniZanrovi }).populate('igra').populate('zanrovi');

            const anonReviews = reviews.map(review => {
                let game = game_genre.find(game_genre => game_genre.igra.id === review.recenzijaIgra.id);
                if (game) {
                    const { recenzijaKorisnik, recenzijaIgra, ...recenzija } = review;
                    return {
                        ...recenzija,
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
                const { recenzijaKorisnik, ...recenzija } = review;
                if (recenzija.obrisano)
                {
                    return {
                        id: recenzija.id,
                        ocjena: 0,
                        komentar: '[Obrisano]',
                        datum: recenzija.datum,
                        obrisano: recenzija.obrisano,
                        korime: '[Obrisano]'
                    }
                }
                return {
                    ...recenzija,
                    korime: recenzijaKorisnik.korime
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

            const korisnik = await Korisnik.findOne(korisnikId);
            if (korisnik.datum_istek_bloka && new Date(korisnik.datum_istek_bloka) > new Date()) {
                return res.status(403).json('Blokirani ste od dodavanja recenzija!');
            }

            const existingGame = await Igra.findOne({ id: igraId });
            if (new Date(existingGame.datum_izlaska) > new Date()) {
                return res.status(403).json('Igra još nije izašla!');
            }

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
                    return res.badRequest('Već ste recenzirali ovu igru!');
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

