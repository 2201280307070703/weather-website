const router = require("express").Router();
const authenticationService = require("../services/authenticationService");

router.post('/register', async (req, res) => {
    const {email, password} = req.body;

    try{
        const token = await authenticationService.register(email, password);

        res.cookie('auth', token, { httpOnly: true });
        res.json({successfully: true});

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try{
        const token = await authenticationService.login(email, password);
        res.cookie('auth', token, { httpOnly: true });

        res.json({successfully: true});

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

module.exports = router;