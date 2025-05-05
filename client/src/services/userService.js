import axios from 'axios';

const URL = 'http://localhost:5000/user';

export const login = async (email, password) => {
    const response = await axios.post(`${URL}/login`, {email, password})

    return response.data;
};

export const register = async (email, password, confirmPassword) => {
    if(password !== confirmPassword){
        throw Error('The password and confirm password do not match!');
    }

    const response = await axios.post(`${URL}/register`, {email, password});
    
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(`${URL}/logout`);

    return response.data;
};