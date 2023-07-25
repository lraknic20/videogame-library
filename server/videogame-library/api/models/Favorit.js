/**
 * Favorit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'favorit',
  attributes: {
    favoritKorisnik:{
      model:'korisnik',
      columnName: 'korisnik_id',
    },
    favoritIgra: {
      model: 'igra',
      columnName: 'igra_id',
    }
  },
};