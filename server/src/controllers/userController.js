const router = require('express').Router();
const userService = require('../services/userService');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/register', async (req, res) => {
    const { email, password, alertsEnabled, city, minTemp, maxTemp } = req.body;

    try {
        const response = await userService.register(email, password, alertsEnabled, city, minTemp, maxTemp);

        res.cookie('auth', response.token, { httpOnly: true });
        res.json(response);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await userService.login(email, password);

        res.cookie('auth', response.token, { httpOnly: true });
        res.json(response);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('auth');
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const response = await userService.getUserInfo(userId);
        res.json(response);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
        const response = await userService.updateUserInfo(userId, updatedData);
        res.json(response);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;