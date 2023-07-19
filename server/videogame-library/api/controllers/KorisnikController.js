/**
 * KorisnikController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    findAll: async function (req, res) {
        try {
          const korisnici = await Korisnik.find();
          return res.json(korisnici);
        } catch (err) {
          return res.serverError(err);
        }
    },
    
    findOne: async function (req, res) {
        try {
          const korisnik = await Korisnik.findOne({ id: req.params.id });
          if (!korisnik) {
            return res.notFound('Korisnik nije pronađen');
          }
          return res.json(korisnik);
        } catch (err) {
          return res.serverError(err);
        }
    },

    
};

