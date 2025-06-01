const axios = require('axios');

const URL = `https://api.funtranslations.com/translate/yoda.json`;

exports.sendMessage = async (message) => {
    try {
        const response = await axios.get(URL, {
            params: { text: message },
            timeout: 5000
        });
        
        return response.data.contents.translated;

    } catch (error) {
        throw new Error(`Error sending message: ${error.message}`);
    }
};
