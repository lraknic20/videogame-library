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
    datum_izlaska: { type: 'ref', columnType: 'datetime', },
    stranica: { type: 'string', allowNull: true, },
    metacritic: { type: 'number', allowNull: true, },
    minimalni_zahtjevi: { type: 'string', allowNull: true, },
    preporuceni_zahtjevi: { type: 'string', allowNull: true, },
    zanrovi: {
      collection: 'zanr',
      via: 'igra',
      through: 'igra_zanr',
      dominant: true
    },
    izdavaci: {
      collection: 'izdavac',
      via: 'igra',
      through: 'igra_izdavac',
      dominant: true
    },
    platforme: {
      collection: 'platforma',
      via: 'igra',
      through: 'igra_platforma',
      dominant: true
    },
    favoritKorisnik: {
      collection: 'korisnik',
      via: 'favoritIgra',
      through: 'favorit'
    },
    recenzijaKorisnik: {
      collection: 'korisnik',
      via: 'recenzijaIgra',
      through: 'recenzija'
    }
  },
};

