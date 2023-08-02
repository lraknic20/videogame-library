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

            let duplicates = 0;

            for (const platforma of platforme) {
                const existingPlatform = await Platforma.findOne({ id: platforma.id });
    
                if (!existingPlatform) {
                    await Platforma.create(platforma);
                } else {
                    duplicates++;
                }
            }

            if (duplicates > 0) {
                return res.ok('Platforme su uspješno spremljene, a ' + duplicates + ' platforma su preskočene.');
            } else {
                return res.ok('Platforme su uspješno spremljene.');
            }
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

