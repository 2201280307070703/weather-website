require('dotenv').config();
const axios = require("axios");

const API_KEY = process.env.OPENCAGEDATA_API_KEY;

const URL = `https://api.opencagedata.com/geocode/v1/json`;

exports.getCoutryByCoords = async (lat, lon) => {
    const response = await axios.get(URL, {
        params:{
            key: API_KEY,
            q: `${lat},${lon}`
        }
    })

    return response.data.results[0].components.country;
};