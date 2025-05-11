import axios from 'axios';

const URL = 'http://localhost:5000/user';

export const register = async (email, password, confirmPassword) => {
    if(password !== confirmPassword){
        throw Error('The password and confirm password do not match!');
    }

    try{
        const response = await axios.post(`${URL}/register`, {email, password});
    
        return response.data;
    }
    catch(error){
        throw error.response.data.msg;
    }
};

export const login = async (email, password) => {
    try{
        const response = await axios.post(`${URL}/login`, {email, password})

        return response.data;
    }
    catch(error){
        throw error.response.data.msg;
    }
};

export const logout = async () => {
    try{
        const response = await axios.post(`${URL}/logout`);

        return response.data;
    }
    catch(error){
        throw error.response.data.msg;
    }
};