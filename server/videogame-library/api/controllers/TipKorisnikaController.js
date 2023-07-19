/**
 * TipKorisnikaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    find: async function (req, res) {
        try {
          const korisnici = await TipKorisnika.find();
          return res.json(korisnici);
        } catch (err) {
          return res.serverError(err);
        }
    },

    findWithUsers: async function (req, res) {
      try {
        const korisnici = await TipKorisnika.find().populate('korisnici');
        return res.json(korisnici);
      } catch (err) {
        return res.serverError(err);
      }
  },
};

