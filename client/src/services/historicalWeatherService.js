import axios from 'axios';

const URL = 'http://localhost:5000/historical';

export const getHistoricalWeather = async (lat, lon, date) => {
    try {
        const response = await axios.get(`${URL}/weatherStats`, {
            params: {
                lat,
                lon,
                date
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg;
    }
};