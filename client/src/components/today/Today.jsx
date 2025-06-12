import { useEffect, useState, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './Today.css';

export default function Today() {
    const {location, loading} = useContext(LocationContext);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if (!loading) {
            weatherService.getTodaysWeatherInformation(location.latitude, location.longitude)
                .then(setWeather)
                .catch(() => {
                    setError('Нещо се случи. Моля презаредете страницата!');
                    setInfoPopupVisibility(true);
                });
        }
    }, [loading, location.latitude, location.longitude]);

    const handeOnClose = () => {
        setError(null);
        setInfoPopupVisibility(false);
    };

    if ((!weather || loading) && !error) {
        return <Spinner />;
    }

    if (infoPopupVisibility) {
        return <InfoPopup message={error} onClose={handeOnClose} />
    }

    return (
        <div className='itemsContainer'>
            <div className='mainInfo'>
                <h3>{weather.location}</h3>
                <div className='content'>
                    <div className='temperature'>
                        <p>{weather.currentTemp}°C</p>
                        <img src={weather.currentWeatherConditionIcon} alt='weather icon' />
                    </div>
                    <p className='condition'>{weather.currentWeatherCondition}</p>
                </div>
            </div>

            <table className='weatherTable'>
                <thead>
                    <tr>
                        <th>Метрика</th>
                        <th>Стойност</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Максимална температура</td>
                        <td>{weather.maxTemp}°C</td>
                    </tr>
                    <tr>
                        <td>Минимална температура</td>
                        <td>{weather.minTemp}°C</td>
                    </tr>
                    <tr>
                        <td>Средна температура</td>
                        <td>{weather.avgTemp}°C</td>
                    </tr>
                    <tr>
                        <td>Шансове за валежи</td>
                        <td>{weather.chanceOfRain}%</td>
                    </tr>
                    <tr>
                        <td>Шансове за снеговалеж</td>
                        <td>{weather.chanceOfSnow}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};