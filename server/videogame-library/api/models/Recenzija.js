/**
 * Recenzija.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'recenzija',
  attributes: {
    ocjena: { type: 'number', required: true, },
    komentar: { type: 'string', required: true, },
    datum: { type: 'ref', columnType: 'datetime', },
    obrisano: { type: 'boolean', },
    recenzijaKorisnik: {
      model:'korisnik',
      columnName: 'korisnik_id',
    },
    recenzijaIgra: {
      model:'igra',
      columnName: 'igra_id',
    }
  },
};