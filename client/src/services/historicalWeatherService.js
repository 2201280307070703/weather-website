import axios from 'axios';

const URL = 'http://localhost:5000/historical';

export const getHistoricalWeather = async (lat, lon, date) => {

    if (!lat || !lon || !date) {
        throw new Error('Липсват координати и/или дата.');
    }

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
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
};