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
    id: { type: 'number', autoIncrement: true, },
    ime: { type: 'string', required: true, },
    prezime: { type: 'string', required: true, },
    korime: { type: 'string', required: true, },
    email: { type: 'string', required: true, },
    lozinka: { type: 'string', required: true, },
    sol: { type: 'string', required: true, },
    datum_istek_bloka: { type: 'string', allowNull: true, },
    tip_korisnika_id: { model: 'TipKorisnika', required: true, },
    igra: {
      collection: 'igra',
      via: 'korisnik',
      through: 'favorit',
      dominant: true
    }
  },
};

