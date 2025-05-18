const router = require('express').Router();
const weatherService = require('../services/weatherService');

router.get('/today', async (req, res) => {
    const {lat, lon } = req.query;

    try {

        const response = await weatherService.getWeatherByCoords(lat, lon, 1);

        const result = {
            'location': response.location.name,
            'region': response.location.region,
            'country': response.location.country,
            'currentTemp': response.current.temp_c,
            'currentWeatherCondition': response.current.condition.text,
            'currentWeatherConditionIcon': response.current.condition.icon,
            'maxTemp': response.forecast.forecastday[0].day.maxtemp_c,
            'minTemp': response.forecast.forecastday[0].day.mintemp_c,
            'avgTemp': response.forecast.forecastday[0].day.avgtemp_c,
            'chanceOfRain': response.forecast.forecastday[0].day.daily_chance_of_rain,
            'chanceOfSnow': response.forecast.forecastday[0].day.daily_will_it_snow,
        };

        res.send(result);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.get('/current-weather-state', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await weatherService.getWeatherCurrentState(lat, lon);

        res.json(response);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.get('/hourly', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon);
        
        const now = new Date();
        now.setMinutes(0, 0, 0);

        const result = response.forecast.forecastday[0].hour
            .filter(hour => new Date(hour.time) >= now)
            .map(hour => {
                const date = new Date(hour.time);
                return {
                    time: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date),
                    temp: hour.temp_c,
                    feelsLike: hour.feelslike_c,
                    state: hour.condition.text,
                    wind: hour.wind_mph,
                    rainChance: hour.chance_of_rain,
                    uvIndex: hour.uv
                };
            });

        res.json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});


router.get('/threeDays', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon, 3);

        const result = response.forecast.forecastday.map((day) => {
            return {
                date: day.date,
                maxTemp: day.day.maxtemp_c,
                minTemp: day.day.mintemp_c,
                averageTemp: day.day.avgtemp_c,
                chaceOfRain: day.day.daily_chance_of_rain,
                chanceOfSnow: day.day.daily_chance_of_snow,
                state: day.day.condition.text,
                uvIndex: day.day.uv
            };
        });

        res.json(result);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.get('/astro', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon);

        const result = response.forecast.forecastday[0].astro;

        res.json(result);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.get('/mainInfo', async (req, res) => {
    const { lat, lon, city } = req.query;

    try {
        let response;

        if(lat, lon){
            response = await weatherService.getWeatherByCoords(lat, lon);
        }
        
        if(city){
            response = await weatherService.getWeatherByCity(city);
        }
        
        const result = {
            'city': response.location.name,
            'state': response.current.condition.text,
            'stateIcon': response.current.condition.icon,
            'temperature': response.current.temp_c,
            'feelsLike': response.current.feelslike_c,
            'windKmH': response.current.wind_kph,
            'humidity': response.current.humidity,
            'uvIndex': response.current.uv
        }

        res.json(result);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;