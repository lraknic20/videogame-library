/**
 * ZaduzenZanrController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    updateGenresInCharge: async function (req, res) {
        const korisnikId = req.param('id');
        const zaduzeniZanroviId = req.body.zaduzeniZanroviId;
      
        const korisnik = await Korisnik.findOne({ id: korisnikId });
        if (!korisnik) {
          return res.status(404).json('Korisnik s tim ID-om ne postoji!');
        }
      
        if (korisnik.tip_korisnika_id !== 3) {
          return res.status(400).json('Korisnik nije moderator!');
        }
      
        const existingzanrovi = await Zanr.find({ id: zaduzeniZanroviId });
        if (existingzanrovi.length !== zaduzeniZanroviId.length) {
          return res.status(404).json('Jedan od žanrova ne postoji!');
        }
      
        const existingRelations = await ZaduzenZanr.find({ zaduzenKorisnik: korisnikId });
        const existingRelationsIds = existingRelations.map((relation) => relation.zaduzenZanr);
      
        const genresToAdd = zaduzeniZanroviId.filter((id) => !existingRelationsIds.includes(id));
        const genresToRemove = existingRelationsIds.filter((id) => !zaduzeniZanroviId.includes(id));
      
        if (genresToRemove.length > 0) {
          await Korisnik.removeFromCollection(korisnikId, 'zaduzenZanr').members(genresToRemove);
        }
      
        if (genresToAdd.length > 0) {
          await Korisnik.addToCollection(korisnikId, 'zaduzenZanr', genresToAdd);
        }
      
        return res.json('Korisniku su uspješno zaduženi žanrovi!');
      }
};

