import axios from 'axios';

const URL = 'http://localhost:5000/weather';

export const getCurrentWeatherState = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/current-weather-state`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
};

export const getTodaysWeatherInformation = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/today`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}

export const getWeatherHourly = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/hourly`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }

}

export const getWeatherForThreeDays = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/threeDays`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}

export const getAstroData = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/astro`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}

export const getMainWeatherInfoByCoordinates = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/mainInfo`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}

export const getMainWeatherInfoByCity = async (city) => {
    if (!city) {
        throw new Error('Липсва град.');
    }

    try {
        const response = await axios.get(`${URL}/mainInfo`, {
            params: {
                city: city
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}

export const getCurrentWeatherStatsByCoordinates = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/weatherStats`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}

export const getRecommendationsDependingOnWeather = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error('Липсват координати.');
    }

    try {
        const response = await axios.get(`${URL}/recommendations`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
}