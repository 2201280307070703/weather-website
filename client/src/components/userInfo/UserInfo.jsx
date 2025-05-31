import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext } from '../../contexts/authenticationContext';
import * as userService from '../../services/userService';
import Path from '../../paths';
import Spinner from '../spinner/Spinner';
import './UserInfo.css';

export default function UserInfo() {
    const navigate = useNavigate();
    const { userId, token, isAuthenticated } = useContext(AuthenticationContext);
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            return navigate(Path.Login);
        }

        userService.getUserInfo(userId, token)
            .then(setUserInfo)
            .catch(() => navigate(Path.Login));
    }, [userId, isAuthenticated, token, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setUserInfo(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            await userService.updateUserInfo(userId, token, userInfo);
            setMessage('✅ Данните са запазени успешно.');
        }
        catch (error) {
            setMessage('❌ Грешка при запазване на данните.');
        }
        finally {
            setLoading(false);
        };
    }

    if (!userInfo || loading) {
        return <Spinner />;
    }

    return (
        <div className="userInfoContainer">
            <h2>Данни на потребителя - преглед и промяна</h2>
            <form className="userInfoForm" onSubmit={handleSubmit}>
                {message && <p className="formMessage">{message}</p>}
                <div className="formGroup">
                    <label htmlFor="email">Имейл:</label>
                    <input type="email" id="email" name="email" value={userInfo.email} onChange={handleChange} required />
                </div>

                <div className="formGroup">
                    <label htmlFor="password">Парола:</label>
                    <input type="password" id="password" name="password" value={userInfo.password || ''} onChange={handleChange} required />
                </div>

                <div className="ckeckboxGroup">
                    <label htmlFor="alertsEnabled">Желая нотификации:</label>
                    <input type="checkbox" id="alertsEnabled" name="alertsEnabled" checked={userInfo.alertsEnabled} onChange={handleChange} />
                </div>
                {
                    userInfo.alertsEnabled &&
                    <>
                        <div className="formGroup">
                            <label htmlFor="city">Град:</label>
                            <input type="text" id="city" name="city" value={userInfo.city} onChange={handleChange} />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="minTemp">Минимална температура:</label>
                            <input type="number" id="minTemp" name="minTemp" value={userInfo.minTemp} onChange={handleChange} />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="maxTemp">Максимална температура:</label>
                            <input type="number" id="maxTemp" name="maxTemp" value={userInfo.maxTemp} onChange={handleChange} />
                        </div>
                    </>
                }
                <button type="submit">Запази</button>
            </form>
        </div>
    );
}
