/**
 * Igra_zanr.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'default',
  tableName: 'igra_has_zanr',
  attributes: {
    igra:{
      model:'igra',
      columnName: 'igra_id'
    },
    zanrovi: {
      model: 'zanr',
      columnName: 'zanr_id'
    }
  },
};