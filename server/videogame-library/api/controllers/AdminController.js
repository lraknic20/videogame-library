/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getStatisticForFavorites: async function (req, res) {
        try {
            const favoriti = await Favorit.find().populate('favoritIgra');

            const gameIds = favoriti.map(favorit => favorit.favoritIgra.id);

            const igre_zanrovi = await Igra_zanr.find({ igra: gameIds }).populate('zanrovi');

            const genreCount = igre_zanrovi.reduce((acc, igra_zanr) => {
                const genre = igra_zanr.zanrovi.naziv;
                if (acc[genre]) {
                    acc[genre]++;
                } else {
                    acc[genre] = 1;
                }
                return acc;
            }, {});

            return res.json(genreCount);
        } catch (err) {
            return res.serverError(err);
        }
    },

    getStatisticForReviews: async function (req, res) {
        try {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);

            const recenzije = await Recenzija.find({
                datum: { '>=': lastYear }
            }).populate('recenzijaIgra');

            const mjeseci = [
                'siječanj',
                'veljača',
                'ožujak',
                'travanj',
                'svibanj',
                'lipanj',
                'srpanj',
                'kolovoz',
                'rujan',
                'listopad',
                'studeni',
                'prosinac'
            ];

            const currentMonthIndex = new Date().getMonth();

            let lastYearMonths = mjeseci.slice(currentMonthIndex + 1).concat(mjeseci.slice(0, currentMonthIndex + 1));

            let reviewsByMonth = lastYearMonths.reduce((acc, mjesec) => {
                acc[mjesec] = 0;
                return acc;
            }, {});

            recenzije.forEach((recenzija) => {
                const monthIndex = new Date(recenzija.datum).getMonth();
                const monthName = mjeseci[monthIndex];
                reviewsByMonth[monthName]++;
            });

            return res.json(reviewsByMonth);
        } catch (err) {
            return res.serverError(err);
        }
    }
};

