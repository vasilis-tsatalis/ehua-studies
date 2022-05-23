const fetch = require('node-fetch');
const base64 = require('base-64');
require('dotenv/config');

const get_data = async (base_url) => {

    const username = process.env.API_USER;
    const password = process.env.API_PASS;

    const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}${base_url}`;

    const options = {
        "method": 'GET'
    }

    const response = await fetch(api_url, {
        options, headers: {
            'Authorization': 'Basic ' + base64.encode(`${username}:${password}`)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.error({
                "message": "Error occured " + base_url,
                error: err
            });
        });
    
    //console.log(response);
    return response;  
};


module.exports = get_data;