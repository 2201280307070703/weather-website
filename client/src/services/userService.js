import axios from 'axios';

const URL = 'http://localhost:5000/user';

export const register = async (email, password, confirmPassword) => {
    if (!email || !password) {
        throw new Error('Грешка при регистриране: Имейлът и паролата са задължителни.');
    }

    if (password !== confirmPassword) {
        throw new Error('Грешка при регистриране: Паролите не съвпадат.');
    }

    try {
        const response = await axios.post(`${URL}/register`, { email, password });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при регистриране.');
    }
};

export const login = async (email, password) => {
    if (!email || !password) {
        throw new Error('Грешка при влизане: Имейлът и паролата са задължителни.');
    }

    try {
        const response = await axios.post(`${URL}/login`, { email, password })
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при влизане.');
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${URL}/logout`);
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при разлогване.');
    }
};

export const getUserInfo = async (userId, token) => {
    if (!userId) {
        throw new Error('Потребителския идентификатор е задължителен.');
    }

    if (!token) {
        throw new Error('Липсва токен за достъп.');
    }

    try {
        const response = await axios.get(`${URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при извличането на данните.');
    }
};

export const updateUserInfo = async (userId, token, updatedData) => {
    if (!userId) {
        throw new Error('Потребителския идентификатор е задължителен.');
    }

    if (!token) {
        throw new Error('Липсва токен за достъп.');
    }

    try {
        const response = await axios.put(`${URL}/${userId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.msg || 'Възникна грешка при редакция на данните.');
    }
};