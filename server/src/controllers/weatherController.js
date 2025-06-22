const router = require('express').Router();
const weatherService = require('../services/weatherService');

router.get('/today', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon, 1);

        const result = {
            'location': response.location.name,
            'currentTemp': response.current.temp_c,
            'currentWeatherCondition': response.current.condition.text,
            'currentWeatherConditionIcon': response.current.condition.icon,
            'maxTemp': response.forecast.forecastday[0].day.maxtemp_c,
            'minTemp': response.forecast.forecastday[0].day.mintemp_c,
            'avgTemp': response.forecast.forecastday[0].day.avgtemp_c,
            'chanceOfRain': response.forecast.forecastday[0].day.daily_chance_of_rain,
            'chanceOfSnow': response.forecast.forecastday[0].day.daily_will_it_snow,
        };

        res.json(result);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get('/current-weather-state', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

    try {
        const response = await weatherService.getWeatherCurrentState(lat, lon);

        res.json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get('/hourly', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

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
        res.status(500).json({ msg: error.message });
    }
});


router.get('/threeDays', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

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
        res.status(500).json({ msg: error.message });
    }
});

router.get('/astro', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon);

        const result = response.forecast.forecastday[0].astro;

        res.json(result);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get('/mainInfo', async (req, res) => {
    const { lat, lon, city } = req.query;

    if (!((lat && lon) || city)) {
        return res.status(400).json({ msg: 'Липсват координати или град.' });
    }

    try {
        let response;

        if (lat, lon) {
            response = await weatherService.getWeatherByCoords(lat, lon);
        }

        if (city) {
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
        res.status(500).json({ msg: error.message });
    }
});


router.get('/weatherStats', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

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
        res.status(500).json({ msg: error.message });
    }
});

router.get('/recommendations', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ msg: 'Липсват координати.' });
    }

    try {
        const response = await weatherService.getWeatherByCoords(lat, lon);

        const maxTemp = response.forecast.forecastday[0].day.maxtemp_c;
        const minTemp = response.forecast.forecastday[0].day.mintemp_c;
        const willItRain = response.forecast.forecastday[0].day.daily_will_it_rain;
        const willItSnow = response.forecast.forecastday[0].day.daily_will_it_snow;
        const maxWind = response.forecast.forecastday[0].day.maxwind_kph;

        const result = {
            sports: {
                title: '',
                suggestions: []
            },
            clothes: {
                title: '',
                suggestions: []
            },
            mood: {
                title: ''
            },
            activities: {
                title: '',
                suggestions: []
            }
        };

        // sports
        if (willItRain || willItSnow || maxWind > 35) {
            result.sports.title = 'Неблагоприятни условия за спорт на открито.';
            result.sports.suggestions = [
                'Тренирай у дома с йога или кардио',
                'Посети близък фитнес',
                'Раздвижи се с упражнения за мобилност'
            ];
        } else if (maxTemp >= 18 && maxWind < 25) {
            result.sports.title = 'Чудесно време за активност навън.';
            result.sports.suggestions = [
                'Излез за джогинг или разходка',
                'Карай колело в парка',
                'Играй футбол или волейбол на открито'
            ];
        } else {
            result.sports.title = 'Възможни са кратки занимания навън.';
            result.sports.suggestions = [
                'Направи разходка в квартала',
                'Раздвижи се с 15-минутна тренировка',
                'Изпробвай нещо ново у дома (йога, пилатес)'
            ];
        }

        // clothes
        if (maxTemp >= 25) {
            result.clothes.title = 'Горещ ден – облечи се леко.';
            result.clothes.suggestions = [
                'Тениска и къси панталони',
                'Леки сандали или маратонки',
                'Шапка и слънчеви очила'
            ];
        } else if (minTemp < 5 || willItSnow) {
            result.clothes.title = 'Студено и/или снежно – облечи се топло.';
            result.clothes.suggestions = [
                'Зимно яке, шал и шапка',
                'Топли обувки',
                'Ръкавици и термобельо'
            ];
        } else if (willItRain) {
            result.clothes.title = 'Дъждовно време – подготви се.';
            result.clothes.suggestions = [
                'Дъждобран или яке с качулка',
                'Чадър',
                'Непромокаеми обувки'
            ];
        } else {
            result.clothes.title = 'Умерено време – подходящо за леки дрехи.';
            result.clothes.suggestions = [
                'Лека връхна дреха',
                'Удобни обувки',
                'Дънки или спортен панталон'
            ];
        }

        // activities
        if (willItRain || willItSnow || maxWind > 35) {
            result.activities.title = 'Времето не е подходящо за далечни пътувания.';
            result.activities.suggestions = [
                'Посети местно кафене или книжарница',
                'Остани у дома и направи нещо креативно',
                'Разгледай виртуални турове или изложби'
            ];
        } else if (maxTemp >= 18 && maxWind < 20) {
            result.activities.title = 'Страхотно време за излизане.';
            result.activities.suggestions = [
                'Отиди на пикник в парка',
                'Посети природна забележителност',
                'Разходи се до близък град'
            ];
        } else {
            result.activities.title = 'Кратки разходки в града са чудесна идея.';
            result.activities.suggestions = [
                'Разходи се в центъра с кафе в ръка',
                'Посети изложба или местен пазар',
                'Направи си ден за себе си в града'
            ];
        }

        // mood
        if (willItRain) {
            result.mood.title = 'Дъждовното време може да те кара да се чувстваш малко подтиснато';
        } else if (willItSnow) {
            result.mood.title = 'Снежният ден носи спокойствие и уют';
        } else if (maxTemp >= 20) {
            result.mood.title = 'Слънцето може би те кара да си в отлично настроение';
        } else {
            result.mood.title = 'Времето е спокойно – идеално за релакс';
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;