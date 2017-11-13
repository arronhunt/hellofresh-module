const https = require('https');

const HOST = 'gw.hellofresh.com'
const BEARER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTMwNjM1OTAsImp0aSI6IjFhNjhkMjk1LTk5OGEtNGYxMy1hNzVlLTljYTU3N2FjMDY0YiIsImlhdCI6MTUxMDQzMzg0NywiaXNzIjoic2VuZiJ9.fB7kf4-p93lucuqfGX2BItuqQoYBxi_YwhN9jIyLi-4';

/**
 * Request HelloFresh Recipes
 * @hideconstructor
 */
class Recipes {
    /**
     * Retrieve details for a recepie with ID
     * @param {string} id - Retrieves details for recipe item with ID
     */
    static getById(id) {
        return query(`recipes/${id}`);
    }

    /**
     * List all the recipes available
     * @param {number} [page] - Page through the results 
     */
    static list(skip = 0) {
        return query('recipes', {skip});
    }

    /**
     * @todo Detail out all of the search criteria descriptions.
     * @typedef {Object} SearchCriteria
     * @property {string} author
     * @property {string} q - Search query
     * @property {string} product
     * @property {string} preset
     * @property {string} week
     * @property {string} allergen
     * @property {string} id
     * @property {string} ingredient
     * @property {string} cuisine
     * @property {string} tag
     * @property {string} diet
     * @property {string} wine
     * @property {string} level
     * @property {string} name
     */

    /**
     * Search through recipes with a given query
     * @param {SearchCriteria} criteria - Plain text search query
     * @param {number} [offset=0] - Set the page offset for the results
     * @param {number} [limit=10] - Number of results to return
     */
    static search(criteria = {}, offset = 0, limit = 10) {
        return query('recipes/search', {...criteria, offset, limit});
    }
};

/**
 * Request HelloFresh Menus
 * @hideconstructor
 */
class Menus {
    /**
     * List the menu for the current week
     */
    static current() {
        return query('menus');
    }

    /**
     * Retrieve details for a menu with ID
     * @param {string} id - Retrieves details for menu item with ID
     */
    static getById(id) {
        return query(`menus/${id}`);
    }

    /**
     * Retreive a weekly menu for a specific week and year
     * @param {number} year 
     * @param {number} week - Week number in a year, 0 - 52
     * @example
     * // returns results for the first week of 2017
     * Menus.week(2017, 0);
     */
    static week(year, week) {
        return query('menus', {week: `${year}-W${week}`});
    }
};

/**
 * Request HelloFresh Ingredients
 * @hideconstructor
 */
class Ingredients {
    /**
     * List all the ingredients available
     * @param {number} [page] - Page through the results 
     */
    static list(skip = 0) {
        return query('ingredients', {skip});
    }

    /**
     * Retrieve details for an ingredient by ID
     * @param {string} id - Retrieves details for ingredient with ID
     */
    static getById(id) {
        return query(`ingredients/${id}`);
    }
};

const keysToURLParams = (keys) => {
    let params_string = '';
    Object.keys(keys).forEach((key, index) => {
        params_string+=`${index ? '&' : '?'}${key}=${keys[key]}`;
    });
    return encodeURI(params_string);
}

const query = (route, query = {}) => {
    const params = { ...query, country: 'us', locale: 'en-US' };
    let urlParams = keysToURLParams(params);
    const path = `/api/${route}${urlParams}`;
    return httpGetAsync(path);
};

const httpGetAsync = async (path) => {
    return new Promise((resolve, reject) => {
        const request = https.request({
                host: HOST,
                path,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${BEARER}`
                }
            }, response => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            };
            let data = '';
            response.on('data', chunk => {data += chunk});
            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
        request.on('error', (error) => reject(error));
        request.end();
    });
};

module.exports = {
    Recipes,
    Ingredients,
    Menus
}