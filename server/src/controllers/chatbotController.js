const router = require('express').Router();
const chatbotService = require('../services/chatbotService');

router.post('/sent', async (req, res) => {
    const {message} = req.body;

    try {
        const response = await chatbotService.sendMessage(message);
        res.json(response);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;