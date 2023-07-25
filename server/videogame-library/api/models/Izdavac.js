/**
 * Izdavac.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'izdavac',
  attributes: {
    naziv: { type: 'string', required: true, },
    kratki_naziv: { type: 'string', required: true, },
    broj_igara: { type: 'number', },
    igra: {
      collection: 'igra',
      via: 'izdavac',
      through: 'igra_izdavac',
    }
  },
};

