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

            await Zanr.createEach(zanrovi);

            return res.ok('Žanrovi su uspješno spremljeni.');
        } catch (err) {
            return res.serverError(err);
        }
    }
};