const router = require("express").Router();

const authenticationController = require("./controllers/authenticationController");

router.use(authenticationController);

module.exports = router;