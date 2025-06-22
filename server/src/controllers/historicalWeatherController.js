const router = require('express').Router();
const historicalWeatherService = require('../services/historicalWeatherService');

router.get('/weatherStats', async (req, res) => {
    const { lat, lon, date } = req.query;

    if (!lat || !lon || !date) {
        return res.status(400).json({ msg: 'Липсват координати и/или дата.' });
    }
    
    try {
        const response = await historicalWeatherService.getWeatherByCoordinatesAndDate(lat, lon, date);

        res.json(response);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
