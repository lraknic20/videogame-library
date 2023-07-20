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
};

