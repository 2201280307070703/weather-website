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