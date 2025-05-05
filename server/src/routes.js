const router = require("express").Router();

const userController = require("./controllers/userController");
const weatherController = require("./controllers/weatherController");

router.use('/user', userController);
router.use('/weather', weatherController);

module.exports = router;