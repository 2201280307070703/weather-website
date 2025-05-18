const router = require('express').Router();

const userController = require('./controllers/userController');
const weatherController = require('./controllers/weatherController');
const notificationController = require('./controllers/notificationController');

router.use('/user', userController);
router.use('/weather', weatherController);
router.use('/notification', notificationController);

module.exports = router;