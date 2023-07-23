/**
 * Igra_platforma.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'igra_has_platforma',
  attributes: {
    igra:{
      model:'igra',
      columnName: 'igra_id'
    },
    platforma: {
      model: 'platforma',
      columnName: 'platforma_id'
    }
  },
};