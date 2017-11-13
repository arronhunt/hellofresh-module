const https = require('https');
const config = require('../config');

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
                host: config.HOST,
                path,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${config.BEARER}`
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
    keysToURLParams,
    query,
    httpGetAsync
}