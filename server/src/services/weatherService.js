require('dotenv').config();
const axios = require("axios");

const API_KEY = process.env.WEATHER_API_KEY;

const URL = `http://api.weatherapi.com/v1/forecast.json`;

exports.getWeatherByCity = async (city, days) => {
    const response = await axios.get(URL, {
        params:{
            key: API_KEY,
            q: city,
            days: days
        }
    });

    return response.data;
}

exports.getWeatherByCoords = async (lat, lon, days) => {
    const response = await axios.get(URL, {
        params: {
            key: API_KEY,
            q: `${lat},${lon}`,
            days: days
        }
    });

    return response.data;
};