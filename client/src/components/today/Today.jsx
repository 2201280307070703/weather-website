import { useEffect, useState, useContext } from 'react';
import {LocationContext} from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import './Today.css';
import Spinner from '../spinner/Spinner';

export default function Today() {
    const location = useContext(LocationContext);
    const [weather, setWeather] = useState({});

    useEffect(() => {
        weatherService.getTodaysWeatherInformation(location.latitude, location.longitude)
        .then(setWeather)
        .catch((error) => {
          console.error('Error fetching weather:', error);
        });
}, [location.latitude, location.longitude]);

if (Object.keys(weather).length === 0) {
    return <Spinner />;
}

return (
    <div className='items-container'>
        <div className='mainInfo'>
            <h3>{weather.location}, region {weather.region}, {weather.country}</h3>
            <div className='content'>
                <div className='temperature'>
                    <p>{weather.currentTemp}°C</p>
                    <img src={weather.currentWeatherConditionIcon} alt="weather icon" />
                </div>
                <p className='condition'>{weather.currentWeatherCondition}</p>
            </div>
        </div>

        <table className="weather-table">
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