import axios from 'axios';

const URL = 'http://localhost:5000/user';

export const register = async (email, password, confirmPassword, alertsEnabled, city, minTemp, maxTemp) => {
    if (password !== confirmPassword) {
        throw Error('The password and confirm password do not match!');
    }

    try {
        const response = await axios.post(`${URL}/register`, { email, password, alertsEnabled, city, minTemp, maxTemp });

        return response.data;
    }
    catch (error) {
        throw error.response.data.msg;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${URL}/login`, { email, password })

        return response.data;
    }
    catch (error) {
        throw error.response.data.msg;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${URL}/logout`);

        return response.data;
    }
    catch (error) {
        throw error.response.data.msg;
    }
};

export const getUserInfo = async (userId, token) => {
    try {
        const response = await axios.get(`${URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    }
    catch (error) {
        throw error.response.data.msg;
    }
};

export const updateUserInfo = async (userId, token, updatedData) => {
    try {
        const response = await axios.put(`${URL}/${userId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw error.response?.data?.msg;
    }
};