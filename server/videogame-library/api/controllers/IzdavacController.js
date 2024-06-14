/**
 * IzdavacController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getPublishers: async function (req, res) {
        try {
            const publishers = await Izdavac.find();

            return res.ok(publishers);
        } catch (err) {
            return res.serverError(err);
        }
    }
};

