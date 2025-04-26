const router = require("express").Router();
const weatherService = require('../services/weatherService');

router.get('/info', async (req, res) => {
    const { city, lat, lon } = req.query;

    try{
        let response;

        if(city){
            response = await weatherService.getWeatherByCity(city);
        }

        if(lat && lon){
            response = await weatherService.getWeatherByCoords(lat, lon);
        }

        res.json(response);
    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

module.exports = router;