const router = require("express").Router();

const userController = require("./controllers/userController");
const weatherController = require("./controllers/weatherController");
const locationController = require("./controllers/locationController");

router.use('/users', userController);
router.use('/weather', weatherController);
router.use('/location', locationController);

module.exports = router;