const router = require("express").Router();

const locationService = require("../services/locationService");

router.get('/coutry', async (req, res) => {
    const {lat, lon} = req.query;

    try{
        const response = await locationService.getCoutryByCoords(lat, lon);

        res.json(response);
    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

module.exports = router;