/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  'KorisnikController': {
    '*': 'isAuthenticated',
    'findAll': ['isAuthenticated', 'isAdmin'],
    'findOne': ['isAuthenticated', 'isCorrectUser'],
    'updateUser': ['isAuthenticated', 'isCorrectUser'],
    'updateUserType': ['isAuthenticated', 'isAdmin'],
    'updateUserTimeout': ['isAuthenticated', 'isModerator'],
  },

  'ZaduzenZanrController': {
    'updateGenresInCharge': ['isAuthenticated', 'isAdmin'],
  },

  'TipKorisnikaController': {
    '*': ['isAuthenticated', 'isAdmin']
  },

  'ZanrController': {
    'saveGenres': ['isAuthenticated', 'isAdmin'],
    'updateGenre': ['isAuthenticated', 'isAdmin']
  },

  'PlatformaController': {
    'savePlatforms': ['isAuthenticated', 'isAdmin']
  },

  'IgraController': {
    'saveGame': 'isAuthenticated'
  },

  'FavoritController': {
    '*': 'isAuthenticated',
    'getFavourites': ['isAuthenticated', 'isAdmin'],
    'getFavouritesForUser': ['isAuthenticated', 'isCorrectUser'],
    'getFavouriteForUser': ['isAuthenticated', 'isCorrectUser']
  },

  'RecenzijaController': {
    'saveReview': 'isAuthenticated',
    'getReviewsForModerator': ['isAuthenticated', 'isModerator'],
    'markAsDeltedReview': ['isAuthenticated', 'isModerator'],
    'deleteReview': ['isAuthenticated', 'isAdmin'],
  },

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

};
