import { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './ThreeDays.css';

export default function ThreeDays() {
    const {location, loading} = useContext(LocationContext);
    const [threeDaysWeather, setThreeDaysWeather] = useState([]);
    const [error, setError] = useState('');
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if (!loading) {
            weatherService.getWeatherForThreeDays(location.latitude, location.longitude)
                .then(setThreeDaysWeather)
                .catch((error) => {
                    setError(error);
                    setInfoPopupVisibility(true);
                })
        }
    }, [loading, location.latitude, location.longitude])

    const handeOnClose = () => {
        setError('');
        setInfoPopupVisibility(false);
    };

    if ((threeDaysWeather === null || threeDaysWeather.length === 0 || loading) && !error) {
        return <Spinner />
    }

    if (infoPopupVisibility) {
        return <InfoPopup message={error} onClose={handeOnClose} />
    }

    return (
        <div className='daysContainer'>
            <h2>Прогноза за следващите три дни</h2>
            <ul className='days'>
                {threeDaysWeather.map((day, index) => {
                    return (
                        <li className='day' key={index}>
                            <p>{new Date(day.date).toLocaleDateString('bg-BG', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                            </p>
                            <p>🌡️ Максимална: {day.maxTemp}°C / Минимална: {day.minTemp}°C</p>
                            <p>📊 Средна: {day.averageTemp}°C</p>
                            <p>🌧️ Дъжд: {day.chaceOfRain}%</p>
                            <p>❄️ Сняг: {day.chanceOfSnow}</p>
                            <p>🔆 UV: {day.uvIndex}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}