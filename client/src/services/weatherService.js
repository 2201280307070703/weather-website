import axios from 'axios';

const URL = 'http://localhost:5000/weather';

export const getWeatherForCoordinates = async (lat, lon, days) => {
    const response = await axios.get(`${URL}/info`, {
        params:{
            lat: lat,
            lon: lon,
            days: days
        }
    });

    return response.data;
};

export const getCurrentWeatherState = async (lat, lon) => {
    const response = await axios.get(`${URL}/current-weather-state`, {
        params:{
            lat: lat,
            lon: lon
        }
    });

    return response.data;
};

export const getTodaysWeatherInformation = async (lat, lon) => {
    const response = await axios.get(`${URL}/today`, {
        params:{
            lat: lat,
            lon: lon
        }
    });
    
    return response.data;
}

export const getWeatherHourly = async (lat, lon) => {
    const response = await axios.get(`${URL}/hourly`, {
        params:{
            lat: lat,
            lon: lon
        }
    });

    return response.data;
}