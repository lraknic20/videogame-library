/**
 * TipKorisnika.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'tip_korisnika',
  attributes: {
    naziv: { type: 'string', required: true, },
    opis: { type: 'string', },
    korisnici: { collection: 'Korisnik', via: "tip_korisnika_id" },
  },
};

