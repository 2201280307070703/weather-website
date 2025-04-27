const router = require("express").Router();
const weatherService = require('../services/weatherService');

router.get('/info', async (req, res) => {
    const { city, lat, lon, days} = req.query;

    try{
        let response;

        if(city){
            response = await weatherService.getWeatherByCity(city, days);
        }

        if(lat && lon){
            response = await weatherService.getWeatherByCoords(lat, lon, days);
        }

        //I'm using the free api version, which is why I'm loading more data than necessary into memory
        const forecastDays = response.forecast.forecastday;

        const result = forecastDays.map(day => {
            return { id: day.date_epoch, date: day.date, avgTemp: day.day.avgtemp_c };
        });
        
        res.json(result); 

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

module.exports = router;