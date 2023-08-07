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
	'GET /korisnici/:id': 'KorisnikController.findOne',
	'PUT /korisnici/:id': 'KorisnikController.updateUser',
	'PUT /korisnici/:id/tipKorisnika': 'KorisnikController.updateUserType',
	'PUT /korisnici/:id/datumIstekBloka': 'KorisnikController.updateUserTimeout',

	'POST /korisnici/:id/zaduzenZanr': 'ZaduzenZanrController.addGenresInCharge',
	'DELETE /korisnici/:id/zaduzenZanr': 'ZaduzenZanrController.deleteGenresInCharge',
	'PUT /korisnici/:id/zaduzenZanr': 'ZaduzenZanrController.updateGenresInCharge',

	'GET /tip_korisnika': 'TipKorisnikaController.find',
	'GET /tip_korisnika_s_korisnicima': 'TipKorisnikaController.findWithUsers',

	'GET /statistika/favoriti': 'AdminController.getStatisticForFavorites',
	'GET /statistika/recenzije': 'AdminController.getStatisticForReviews',

	'POST /registracija': 'AuthController.register',
	'POST /prijava': 'AuthController.login',

	'GET /rawg/izdavaci': 'RawgController.getPublishers',
	'GET /rawg/izdavaci/:id': 'RawgController.getPublisher',
	'GET /rawg/najbolje_igre': 'RawgController.getBestGames',
	'GET /rawg/popularne_igre': 'RawgController.getPopularGames',
	'GET /rawg/nadolazece_igre': 'RawgController.getUpcomingGames',
	'GET /rawg/igre': 'RawgController.getGames',
	'GET /rawg/igre/:id': 'RawgController.getGame',
	'GET /rawg/zanrovi': 'RawgController.getGenres',
	'GET /rawg/platforme': 'RawgController.getPlatforms',

	'GET /zanrovi': 'ZanrController.getGenres',
	'POST /zanrovi': 'ZanrController.saveGenres',
	'PUT /zanrovi/:genreId': 'ZanrController.updateGenre',
	'GET /platforme': 'PlatformaController.getPlatforms',
	'POST /platforme': 'PlatformaController.savePlatforms',
	'GET /izdavaci': 'IzdavacController.getPublishers',
	'GET /igre': 'IgraController.getGames',
	'GET /igre/:gameId': 'IgraController.getGame',
	'POST /igre': 'IgraController.saveGame',
	'GET /favoriti': 'FavoritController.getFavourites',
	'GET /favoriti/:id': 'FavoritController.getFavouritesForUser',
	'GET /favoriti/:id/igra/:gameId': 'FavoritController.getFavouriteForUser',
	'POST /favoriti': 'FavoritController.saveFavourite',
	'DELETE /favoriti/:id': 'FavoritController.deleteFavourite',
	'GET /recenzije': 'RecenzijaController.getReviews',
	'GET /recenzije/:gameId': 'RecenzijaController.getReviewsForGame',
	'GET /recenzije/moderator/:id': 'RecenzijaController.getReviewsForModerator',
	'POST /recenzije': 'RecenzijaController.saveReview',
	'PUT /recenzije/:id': 'RecenzijaController.markAsDeltedReview',
	'DELETE /recenzije/:id': 'RecenzijaController.deleteReview',


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
