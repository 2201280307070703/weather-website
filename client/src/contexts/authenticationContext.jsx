import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import usePersistentState from '../hooks/usePersistentState';
import * as userService from '../services/userService';
import Path from '../paths';

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({
    children
}) => {
    const navigate = useNavigate();

    const[auth, setAuth] = usePersistentState('auth', {});

    const loginSubmitHandler = async (values) => {
        try{
            const result = await userService.login(values.email, values.password);

            setAuth(result);
            localStorage.setItem('accessToken', result.token);
    
            navigate(Path.Home);
        }
        catch(error){
            throw error;
        }
    };

    const registerSubmitHandeler = async (values) => {
        try{
            const result = await userService.register(values.email, values.password, values.confirmPassword);

            setAuth(result);
            localStorage.setItem('accessToken', result.token);
    
            navigate(Path.UserInfo);
        }
        catch(error){
            throw error;
        }
    };

    const logoutHandler = async () => {
        try{
            var response = await userService.logout();

            if(response){
                setAuth({});
                localStorage.removeItem('accessToken');
            }

            navigate(Path.Home);
        }
        catch(error){
            throw error;
        }
    };

    const values = {
        loginSubmitHandler,
        registerSubmitHandeler,
        logoutHandler,
        email: auth.email,
        userId: auth.userId,
        token: auth.token,
        isAuthenticated: !!auth.token
    };

    return(
        <AuthenticationContext.Provider value={values}>
            {children}
        </AuthenticationContext.Provider>
    )
};

export default AuthenticationContext;