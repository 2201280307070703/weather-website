import { useEffect, useState, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './Today.css';

export default function Today() {
    const {location, loading} = useContext(LocationContext);
    const [weather, setWeather] = useState({});
    const [error, setError] = useState('');
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if (!loading) {
            weatherService.getTodaysWeatherInformation(location.latitude, location.longitude)
                .then(setWeather)
                .catch((error) => {
                    setError(error);
                    setInfoPopupVisibility(true);
                });
        }
    }, [loading, location.latitude, location.longitude]);

    const handeOnClose = () => {
        setError('');
        setInfoPopupVisibility(false);
    };

    if ((Object.keys(weather).length === 0 || loading) && !error) {
        return <Spinner />;
    }

    if (infoPopupVisibility) {
        return <InfoPopup message={error} onClose={handeOnClose} />
    }

    return (
        <div className='itemsContainer'>
            <div className='mainInfo'>
                <h3>{weather.location}, region {weather.region}, {weather.country}</h3>
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
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Maximum temperature</td>
                        <td>{weather.maxTemp}°C</td>
                    </tr>
                    <tr>
                        <td>Minimum temperature</td>
                        <td>{weather.minTemp}°C</td>
                    </tr>
                    <tr>
                        <td>Average temperature</td>
                        <td>{weather.avgTemp}°C</td>
                    </tr>
                    <tr>
                        <td>Chance of rain</td>
                        <td>{weather.chanceOfRain}%</td>
                    </tr>
                    <tr>
                        <td>Chance of snow</td>
                        <td>{weather.chanceOfSnow}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}