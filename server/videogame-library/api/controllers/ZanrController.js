/**
 * ZanrController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    saveGenres: async function (req, res) {
        try {
            const zanrovi = req.body.zanrovi;

            let duplicates = 0;

            for (const zanr of zanrovi) {
                const existingGenre = await Zanr.findOne({ id: zanr.id });
    
                if (!existingGenre) {
                    await Zanr.create(zanr);
                } else {
                    duplicates++;
                }
            }

            if (duplicates > 0) {
                return res.ok('Žanrovi uspješno spremljeni, a ' + duplicates + ' žanrova su preskočeni.');
            } else {
                return res.ok('Žanrovi su uspješno spremljeni.');
            }
        } catch (err) {
            return res.serverError(err);
        }
    },

    getGenres: async function (req, res) {
        try {
            const genres = await Zanr.find();

            return res.ok(genres);
        } catch (err) {
            return res.serverError(err);
        }
    },

    updateGenre: async function (req, res) {
        try {
            const genreId = req.params.genreId;
            const updatedGenreData = req.body;
    
            const existingGenre = await Zanr.findOne({ id: genreId });
    
            if (!existingGenre) {
                return res.notFound('Žanr nije pronađen.');
            }
    
            await Zanr.updateOne({ id: genreId }).set(updatedGenreData)
    
            return res.ok('Žanr je uspješno ažuriran.');
        } catch (err) {
            return res.serverError(err);
        }
    }
};