/**
 * Korisnik.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'korisnik',
  attributes: {
    ime: { type: 'string', required: true, },
    prezime: { type: 'string', required: true, },
    korime: { type: 'string', required: true, },
    email: { type: 'string', required: true, },
    lozinka: { type: 'string', required: true, },
    sol: { type: 'string', required: true, },
    datum_istek_bloka: { type: 'ref', columnType: 'datetime' },
    tip_korisnika_id: { model: 'TipKorisnika', required: true, },
    favoritIgra: {
      collection: 'igra',
      via: 'favoritKorisnik',
      through: 'favorit',
      dominant: true
    },
    recenzijaIgra: {
      collection: 'igra',
      via: 'recenzijaKorisnik',
      through: 'recenzija',
      dominant: true
    }
  },
  isBlocked: async function (korisnikId) {
    const korisnik = await Korisnik.findOne({ id: korisnikId });

    const datum_istek_bloka = new Date(korisnik.datum_istek_bloka).toLocaleString("hr-HR");
    const localTime = new Date().toLocaleString('hr-HR', { timeZone: 'Europe/Zagreb' });

    if (datum_istek_bloka > localTime) {
      return {
        status: true,
        message: 'Blokirani ste do ' + datum_istek_bloka
      };
    }
    else {
      return false;
    }
  }
};

