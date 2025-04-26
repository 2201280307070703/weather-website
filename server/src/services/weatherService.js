require('dotenv').config();
const axios = require("axios");

const API_KEY = process.env.WEATHER_API_KEY;

const URL = `http://api.weatherapi.com/v1/current.json`;

exports.getWeatherByCity = async (city) => {
    const response = await axios.get(URL, {
        params:{
            key: API_KEY,
            q: city
        }
    });

    return response.data;
}

exports.getWeatherByCoords = async (lat, lon) => {
    const response = await axios.get(url, {
        params:{
            key: API_KEY,
            q: `${lat},${lon}`
        }
    });

    return response.data;
};