/**
 * RawgController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const base_url = 'https://api.rawg.io/api/';

async function getData(resource, parameters) {
    let url = base_url + resource + '?key=' + sails.config.rawg_api_key;
    for(let p in parameters)
        url += '&' + p + "=" + parameters[p];
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

module.exports = {
    async getDevelopers(req, res) {
        try {
            const page = req.query.page;
            const pageSize  = req.query.pageSize;
            
            const parameters = {
                page: page,
                page_size: pageSize
            }

            const data = await getData("developers", parameters)    

            if (data.detail === "Invalid page."){
                return res.badRequest(data);
            }

            return res.ok(data);
        } catch (error) {
            return res.serverError(error);
        }
    },

    async getBestGames(req, res) {
        try {
            const page = req.query.page;
            const pageSize  = req.query.pageSize;
            const genres = req.query.genres;
            
            const parameters = {
                page: page,
                page_size: pageSize,
                metacritic: '90,100',
                ordering: '-added',
                ...(genres && { genres }),
            }

            const data = await getData("games", parameters)    

            if (data.detail === "Invalid page."){
                return res.badRequest(data);
            }

            return res.ok(data);
        } catch (error) {
            return res.serverError(error);
        }
    },

    async getPopularGames(req, res) {
        try {
            const page = req.query.page;
            const pageSize  = req.query.pageSize;
            const currentDate = new Date().toISOString().slice(0, 10);
           
            const parameters = {
                page: page,
                page_size: pageSize,
                ordering: '-added',
                dates: currentDate,
            }

            const data = await getData("games", parameters)    

            if (data.detail === "Invalid page."){
                return res.badRequest(data);
            }

            return res.ok(data);
        } catch (error) {
            return res.serverError(error);
        }
    },

    async getUpcomingGames(req, res) {
        try {
            const page = req.query.page;
            const pageSize  = req.query.pageSize;
            const currentDate = new Date().toISOString().slice(0, 10);
            const futureDate = req.query.futureDate;
            
            const parameters = {
                page: page,
                page_size: pageSize,
                ordering: '-added',
                dates: currentDate + ',' + futureDate,
            }

            const data = await getData("games", parameters)    

            if (data.detail === "Invalid page."){
                return res.badRequest(data);
            }

            return res.ok(data);
        } catch (error) {
            return res.serverError(error);
        }
    },

    async getGames(req, res) {
        try {
            const page = req.query.page;
            const pageSize  = req.query.pageSize;
            const genres = req.query.genres;
            const platforms = req.query.platforms;
            const publishers = req.query.publishers;
            const minDate = req.query.minDate;
            const maxDate = req.query.maxDate;
            const search = req.query.search;

            const parameters = {
                page: page,
                page_size: pageSize,
                ordering: '-added',
                ...(genres && { genres }),
                ...(platforms && { platforms }),
                ...(publishers && { publishers }),
                ...(minDate && maxDate && { dates: `${minDate},${maxDate}` }),
                ...(search && { search }),
            }

            const data = await getData("games", parameters)    

            if (data.detail === "Invalid page."){
                return res.badRequest(data);
            }

            return res.ok(data);
        } catch (error) {
            return res.serverError(error);
        }
    },
};

