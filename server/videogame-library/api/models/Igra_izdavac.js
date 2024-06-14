/**
 * Igra_izdavac.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'igra_has_izdavac',
  attributes: {
    igra:{
      model:'igra',
      columnName: 'igra_id'
    },
    izdavaci: {
      model: 'izdavac',
      columnName: 'izdavac_id'
    }
  },
};