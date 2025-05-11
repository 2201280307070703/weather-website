require('dotenv').config();
const axios = require("axios");

const API_KEY = process.env.WEATHER_API_KEY;

const URL = `http://api.weatherapi.com/v1/forecast.json`;

exports.getWeatherByCity = async (city, days) => {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: city,
        days: days
      }
    });

    return response.data;
  }
  catch (error) {
    throw Error('Invalid city provided!');
  }
}

exports.getWeatherByCoords = async (lat, lon, days) => {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: days
      }
    });

    return response.data;
  }
  catch (error) {
    throw Error('Invalid coordinates provided!');
  }
};

exports.getWeatherCurrentState = async (lat, lon) => {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`
      }
    });

    const weatherCondition = response.data.current.condition.text.toLowerCase();
    if (weatherCondition.includes("sun") || weatherCondition === "clear") {
      return "sunny";
    }
    else if (
      weatherCondition.includes("rain") ||
      weatherCondition.includes("drizzle") ||
      weatherCondition.includes("shower") ||
      weatherCondition.includes("thunder")
    ) {
      return "rainy";
    }
    else if (
      weatherCondition.includes("snow") ||
      weatherCondition.includes("sleet") ||
      weatherCondition.includes("blizzard") ||
      weatherCondition.includes("ice") ||
      weatherCondition.includes("freezing")
    ) {
      return "snowy";
    }
    else if (
      weatherCondition.includes("cloud") ||
      weatherCondition.includes("overcast") ||
      weatherCondition.includes("fog") ||
      weatherCondition.includes("mist")
    ) {
      return "cloudy";
    }
    else {
      return "default";
    }
  }
  catch (error) {
    throw Error('Invalid coordinates provided!');
  }
};