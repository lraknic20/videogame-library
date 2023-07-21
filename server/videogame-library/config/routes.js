/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'GET /korisnici': 'KorisnikController.findAll',
  'GET /korisnik/:id': 'KorisnikController.findOne',
  'GET /tip_korisnika': 'TipKorisnikaController.find',
  'GET /tip_korisnika_s_korisnicima': 'TipKorisnikaController.findWithUsers',
  'POST /register': 'AuthController.register',
  'POST /login': 'AuthController.login',

  'GET /izdavaci': 'RawgController.getDevelopers',
  'GET /best_games': 'RawgController.getBestGames',
  'GET /popular_games': 'RawgController.getPopularGames',
  'GET /upcoming_games': 'RawgController.getUpcomingGames',
  'GET /games': 'RawgController.getGames',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};