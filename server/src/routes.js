const router = require('express').Router();

const userController = require('./controllers/userController');
const weatherController = require('./controllers/weatherController');
const historicalWeatherController = require('./controllers/historicalWeatherController');
const chatbotController = require('./controllers/chatbotController');

router.use('/user', userController);
router.use('/weather', weatherController);
router.use('/historical', historicalWeatherController);
router.use('/chatbot', chatbotController);

module.exports = router;