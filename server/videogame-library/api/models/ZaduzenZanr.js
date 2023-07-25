/**
 * ZaduzenZanr.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'zaduzen_zanr',
  attributes: {
    zaduzenKorisnik:{
      model:'korisnik',
      columnName: 'korisnik_id',
    },
    zaduzenZanr: {
      model: 'zanr',
      columnName: 'zanr_id',
    }
  },
};

