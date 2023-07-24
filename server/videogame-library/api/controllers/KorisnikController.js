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

  updateUser: async function (req, res) {
    try {
      const korisnikId = req.params.id;
      const updatedKorisnik = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        email: req.body.email,
        korisnicko_ime: req.body.korisnicko_ime,
        lozinka: req.body.lozinka
      };
      const updated = await Korisnik.updateOne({ id: korisnikId }).set(updatedKorisnik);
      if (!updated) {
        return res.notFound('Korisnik nije pronađen!');
      }
      return res.ok('Korisnik je ažuriran!');
    } catch (err) {
      return res.serverError(err);
    }
  },
};

