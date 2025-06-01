import axios from 'axios';

const URL = 'http://localhost:5000/chatbot/sent';

export const sentChat = async (message) => {
    try {
        const response = await axios.post(`${URL}`, {message});
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg;
    }
};