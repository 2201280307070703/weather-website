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


router.get('/weatherStats', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon);

        const result = {
            'time': response.forecast.forecastday[0].date,
            'avgTemp': response.forecast.forecastday[0].day.avgtemp_c,
            'avgHumidity': response.forecast.forecastday[0].day.avghumidity,
            'rain': response.forecast.forecastday[0].day.totalprecip_mm,
        };

        res.json(result);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.get('/recommendations', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon);

        const maxTemp = response.forecast.forecastday[0].day.maxtemp_c;
        const minTemp = response.forecast.forecastday[0].day.mintemp_c;
        const willItRain = response.forecast.forecastday[0].day.daily_will_it_rain;
        const willItSnow = response.forecast.forecastday[0].day.daily_will_it_snow;
        const maxWind = response.forecast.forecastday[0].day.maxwind_kph;

        const result = {
            sports: '',
            clothing: '',
            mood: ''
        };

        // Sport
        if (willItRain || willItSnow || maxWind > 40) {
            result.sports = 'По-добре тренирай на закрито – времето е неподходящо.';
        } else if (maxTemp >= 18 && maxWind < 25) {
            result.sports = 'Идеално време за джогинг, колоездене или разходка.';
        } else if (maxTemp < 5) {
            result.sports = 'Много студено – спортът на закрито е по-подходящ.';
        } else {
            result.sports = 'Може да направиш лека активност навън.';
        }

        // Clothes
        if (maxTemp >= 25) {
            result.clothing = 'Облечи се леко – тениска и къси панталони.';
        } else if (minTemp < 5 || willItSnow) {
            result.clothing = 'Студено е – облечи се с яке, шапка и шал.';
        } else if (willItRain) {
            result.clothing = 'Вземи си дъждобран или чадър – възможни са валежи.';
        } else {
            result.clothing = 'Носи лека връхна дреха – времето е променливо.';
        }

        // Mood
        if (willItSnow) {
            result.mood = 'Може да е красиво навън – направи си топъл чай и се наслади на гледката.';
        } else if (willItRain) {
            result.mood = 'Дъждовен ден – идеален за филм, книга или уютна вечер у дома.';
        } else if (maxTemp >= 20) {
            result.mood = 'Слънчев ден – отличен за срещи, разходки и добро настроение!';
        } else {
            result.mood = 'Спокоен ден – направи нещо за себе си и релаксирай.';
        }

        res.json(result);
        
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;