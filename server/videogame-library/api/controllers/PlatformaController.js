/**
 * PlatformaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    savePlatforms: async function (req, res) {
        try {
            const platforme = req.body.platforme;

            await Platforma.createEach(platforme);

            return res.ok('Platforme su uspješno spremljene.');
        } catch (err) {
            return res.serverError(err);
        }
    },

    getPlatforms: async function (req, res) {
        try {
            const platforms = await Platforma.find();

            return res.ok(platforms);
        } catch (err) {
            return res.serverError(err);
        }
    }
};

