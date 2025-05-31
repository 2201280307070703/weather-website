const router = require('express').Router();
const historicalWeatherService = require('../services/historicalWeatherService');

router.get('/weatherStats', async (req, res) => {
    const { lat, lon, date} = req.query;

    try {
        const response = await historicalWeatherService.getWeatherByCoordinatesAndDate(lat, lon, date);
        
        res.json(response);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;
