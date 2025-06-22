const router = require('express').Router();
const mongoose = require('mongoose');
const userService = require('../services/userService');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Грешка при регистриране: Имейлът и паролата са задължителни.' });
    }

    try {
        const response = await userService.register(email, password);

        res.cookie('auth', response.token, { httpOnly: true });
        res.json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Грешка при влизане: Имейлът и паролата са задължителни.' });
    }

    try {
        const response = await userService.login(email, password);

        res.cookie('auth', response.token, { httpOnly: true });
        res.json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('auth');
        res.json({ success: true });

    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'Невалиден потребителски идентификатор.' });
    }

    try {
        const response = await userService.getUserInfo(userId);
        res.json(response);

    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'Невалиден потребителски идентификатор.' });
    }

    if (updatedData.recommendationsEnabled && !updatedData.city) {
        return res.status(400).json({ msg: 'За да получите предложения за уикенда, моля изберете град.' });
    }

    if (updatedData.alertsEnabled && (!updatedData.city || !updatedData.maxTemp && !updatedData.minTemp)) {
        return res.status(400).json({ msg: 'За да получите предупреждения при критични температури, моля изберете град, минимална и максимална температура.' });
    }

    try {
        const response = await userService.updateUserInfo(userId, updatedData);
        res.json(response);

    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;