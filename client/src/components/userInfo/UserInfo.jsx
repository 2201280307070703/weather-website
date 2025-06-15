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

        if (userInfo.recommendationsEnabled && !userInfo.city.trim()) {
            setMessage('❌ Моля въведете за кой град искате да получавате предложения за забавления през уикендите.');
            return setLoading(false);
        }

        if (userInfo.alertsEnabled && (!userInfo.city.trim() || !userInfo.minTemp || !userInfo.maxTemp)) {
            setMessage('❌ Моля въведете за кой град искате да получавате нотификации и в какъв температурен диапазон.');
            return setLoading(false);
        }

        try {
            await userService.updateUserInfo(userId, token, userInfo);
            setMessage('✅ Данните са запазени успешно.');
        } catch (error) {
            setMessage(`❌ ${error}`);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo || loading) {
        return <Spinner />;
    }

    return (
        <div className='userInfoContainer'>
            <h2>Данни на потребителя - преглед и промяна</h2>
            <form className='userInfoForm' onSubmit={handleSubmit}>
                {message && <p className='formMessage'>{message}</p>}
                <div className='formGroup'>
                    <label htmlFor='email'>Имейл:</label>
                    <input type='email' id='email' name='email' value={userInfo.email} onChange={handleChange} required />
                </div>
                <div className='formGroup'>
                    <label htmlFor='password'>Парола:</label>
                    <input type='password' id='password' name='password' value={userInfo.password || ''} onChange={handleChange} required />
                </div>
                <div className='ckeckboxGroup'>
                    <label htmlFor='alertsEnabled'>Желая нотификации за опасни температури:</label>
                    <input type='checkbox' id='alertsEnabled' name='alertsEnabled' checked={userInfo.alertsEnabled} onChange={handleChange} />
                </div>
                <div className='ckeckboxGroup'>
                    <label htmlFor='recommendationsEnabled'>Желая препоръки за уикендите:</label>
                    <input type='checkbox' id='recommendationsEnabled' name='recommendationsEnabled' checked={userInfo.recommendationsEnabled} onChange={handleChange} />
                </div>
                {
                    (userInfo.alertsEnabled || userInfo.recommendationsEnabled) &&
                    <div className='formGroup'>
                        <label htmlFor='city'>Град:</label>
                        <input type='text' id='city' name='city' value={userInfo.city} onChange={handleChange} />
                    </div>
                }
                {
                    userInfo.alertsEnabled &&
                    <>
                        <div className='formGroup'>
                            <label htmlFor='minTemp'>Минимална температура:</label>
                            <input type='number' id='minTemp' name='minTemp' value={userInfo.minTemp} onChange={handleChange} />
                        </div>
                        <div className='formGroup'>
                            <label htmlFor='maxTemp'>Максимална температура:</label>
                            <input type='number' id='maxTemp' name='maxTemp' value={userInfo.maxTemp} onChange={handleChange} />
                        </div>
                    </>
                }
                <button type='submit'>Запази</button>
            </form>
        </div>
    );
}
