const axios = require('axios');

const URL = `https://archive-api.open-meteo.com/v1/archive`;

exports.getWeatherByCoordinatesAndDate = async (latitude, longitude, date) => {
    try {
        const response = await axios.get(URL, {
            params: {
                latitude,
                longitude,
                start_date: date,
                end_date: date,
                daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,relative_humidity_2m_max,relative_humidity_2m_min,precipitation_sum,weathercode',
            }
        });

        const daily = response.data.daily;
        
        if (!daily) {
            throw new Error('Няма намерени данни за времето на тази дата.');
        }

        const result = {
            'time': daily.time[0],
            'avgTemp': daily.temperature_2m_mean[0],
            'avgHumidity': ((daily.relative_humidity_2m_max[0] + daily.relative_humidity_2m_min[0])/2),
            'rain': daily.precipitation_sum[0],
        };

        return result;
    }
    catch (error) {
        throw new Error(`Възникна грешка при вземането на исторически данни: ${error.message}`);
    }
};
