import axios from 'axios';

const URL = 'http://localhost:5000/weather';

export const getCurrentWeatherState = async (lat, lon) => {
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
        throw error.response.data.msg;
    }
};

export const getTodaysWeatherInformation = async (lat, lon) => {
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
        throw error.response.data.msg;
    }
}

export const getWeatherHourly = async (lat, lon) => {
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
        throw error.response.data.msg;
    }

}

export const getWeatherForThreeDays = async (lat, lon) => {
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
        throw error.response.data.msg;
    }
}

export const getAstroData = async (lat, lon) => {
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
        throw error.response.data.msg;
    }
}

export const getMainWeatherInfoByCoordinates = async (lat, lon) => {
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
        throw error.response.data.msg;
    }
}

export const getMainWeatherInfoByCity = async (city) => {
    try {
        const response = await axios.get(`${URL}/mainInfo`, {
            params: {
                city: city
            }
        });
        return response.data;
    }
    catch (error) {
        throw error.response.data.msg;
    }
}

export const getCurrentWeatherStatsByCoordinates = async (lat, lon) => {
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
        throw error.response.data.msg;
    }
}

export const getRecommendationsDependingOnWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`${URL}/recommendations`, {
            params: {
                lat: lat,
                lon: lon
            }
        });
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        throw error.response.data.msg;
    }
}