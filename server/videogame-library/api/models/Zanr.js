/**
 * Zanr.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'zanr',
  attributes: {
    naziv: { type: 'string', required: true, },
    broj_igara: { type: 'number', },
    igra: {
      collection: 'igra',
      via: 'zanrovi',
      through: 'igra_zanr',
    },
    zaduzenKorisnik: {
      collection: 'korisnik',
      via: 'zaduzenZanr',
      through: 'zaduzenZanr'
    }
  },
};

