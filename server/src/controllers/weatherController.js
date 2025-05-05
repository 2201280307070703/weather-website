const router = require("express").Router();
const weatherService = require('../services/weatherService');

router.get('/today', async (req, res) => {
    const { city, lat, lon} = req.query;

    try{
        let response;

        if(city){
            response = await weatherService.getWeatherByCity(city, 1);
        }

        if(lat && lon){
            response = await weatherService.getWeatherByCoords(lat, lon, 1);
        }

        const result = {
            'location' : response.location.name,
            'region' : response.location.region,
            'country' : response.location.country,
            'currentTemp' : response.current.temp_c,
            'currentWeatherCondition' : response.current.condition.text,
            'currentWeatherConditionIcon': response.current.condition.icon,
            'maxTemp' : response.forecast.forecastday[0].day.maxtemp_c,
            'minTemp' : response.forecast.forecastday[0].day.mintemp_c,
            'avgTemp' : response.forecast.forecastday[0].day.avgtemp_c,
            'chanceOfRain' : response.forecast.forecastday[0].day.daily_chance_of_rain,
            'chanceOfSnow' : response.forecast.forecastday[0].day.daily_will_it_snow,
        };

        res.send(result);

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

router.get('/current-weather-state', async (req, res) => {
    const {lat, lon} = req.query;

    try{
        const response = await weatherService.getWeatherCurrentState(lat, lon);
        res.json(response); 

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

router.get('/hourly', async (req, res) => {
    const {lat, lon} = req.query;

    try{
        const response = await weatherService.getWeatherByCoords(lat, lon);
        
        const result = response.forecast.forecastday[0].hour.map(hour => {
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

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

router.get('/fiveDays', async (req, res) => {
    const {lat, lon} = req.query;

    try{
        const response = await weatherService.getWeatherByCoords(lat, lon, 5);

        const result = response.forecast.forecastday.map((day) => {
            return{
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

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

router.get('/astro', async (req, res) => {
    const {lat, lon} = req.query;

    try{
        const response = await weatherService.getWeatherByCoords(lat, lon);

        const result = response.forecast.forecastday[0].astro;
        res.json(result);

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

module.exports = router;