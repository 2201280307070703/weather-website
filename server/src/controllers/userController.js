const router = require("express").Router();
const userService = require("../services/userService");

router.post('/register', async (req, res) => {
    const {email, password} = req.body;

    try{
        const token = await userService.register(email, password);

        res.cookie('auth', token, { httpOnly: true });
        res.json({successfully: true});

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try{
        const token = await userService.login(email, password);
        res.cookie('auth', token, { httpOnly: true });

        res.json({successfully: true});

    }catch(error){
        res.status(400).json({msg: error.message});
    }
});

module.exports = router;