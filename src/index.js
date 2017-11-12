const https = require('https');

const HOST = 'gw.hellofresh.com'
const BEARER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTMwNjM1OTAsImp0aSI6IjFhNjhkMjk1LTk5OGEtNGYxMy1hNzVlLTljYTU3N2FjMDY0YiIsImlhdCI6MTUxMDQzMzg0NywiaXNzIjoic2VuZiJ9.fB7kf4-p93lucuqfGX2BItuqQoYBxi_YwhN9jIyLi-4';

class Recipes {
    static list(skip = 0) {
        return query('recipes', {skip});
    }

    static getById(id) {
        return query(`recipes/${id}`);
    }
}

class Menus {
    static current() {
        return query('menus');
    }

    static getById(id) {
        return query(`menus/${id}`);
    }

    static week(year, week) {
        return query('menus', {week: `${year}-W${week}`});
    }
}

class Ingredients {
    static list(skip = 0) {
        return query('ingredients', {skip});
    }

    static getById(id) {
        return query(`ingredients/${id}`);
    }
}

const query = (route, params = {}) => {
    const url_params = { ...params, country: 'us', locale: 'en-US' };
    let params_string = '';
    Object.keys(url_params).forEach((key, index) => {
        params_string+=`${index ? '&' : '?'}${key}=${url_params[key]}`;
    });
    const path = `/api/${route}${params_string}`
    return httpGetAsync(path);
}

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
}

module.exports = {
    Recipes,
    Menus,
    Ingredients
};