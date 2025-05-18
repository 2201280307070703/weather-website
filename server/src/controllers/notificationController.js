const router = require('express').Router();
const notificationService = require('../services/notificationService');

router.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    try{
        await notificationService.sentEmail(to, subject, text);

        res.json({'success': true});
    }
    catch(error){
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;