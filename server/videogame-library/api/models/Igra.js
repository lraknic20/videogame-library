/**
 * Igra.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'igra',
  attributes: {
    naziv: { type: 'string', required: true, },
    kratki_naziv: { type: 'string', required: true, },
    opis: { type: 'string', required: true, },
    slika: { type: 'string', allowNull: true, },
    objavljeno: { type: 'boolean', allowNull: true, },
    datum_izlaska: { type: 'string', allowNull: true, },
    stranica: { type: 'string', allowNull: true, },
    metacritic: { type: 'string', allowNull: true, },
    minimalni_zahtjevi: { type: 'string', allowNull: true, },
    preporuceni_zahtjevi: { type: 'string', allowNull: true, },
    zanr: {
      collection: 'zanr',
      via: 'igra',
      dominant: true
    },
    izdavac: {
      model: 'izdavac',
      via: 'igra',
      dominant: true
    },
    platforma: {
      collection: 'platforma',
      via: 'igra',
      dominant: true
    }
  },
};

