const fetch = require('node-fetch');
const base64 = require('base-64');
require('dotenv/config');

const create_data = async (base_url, data) => {

    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;

    const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}${base_url}`;

    const options = {
        "method": "POST",
        "body": `${JSON.stringify(data)}`,
        //"body": `${data}`,
        "headers": "{ Content-Type: application/json }",
    }

    //console.log(options)

    const response = await fetch(api_url, {
        options, headers: {
            'Authorization': 'Basic ' + base64.encode(`${username}:${password}`)
            }
        })
        .then(res => {
            res.json();
            console.log(res.status);
            console.log(res.statusText);
        })
        .catch(err => {
            console.error({
                "message": "Error occured " + base_url,
                error: err
            });
        });
    
    console.log(response);
    return response;  
};


const get_data = async (base_url) => {

    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;

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



module.exports = {create_data, get_data};