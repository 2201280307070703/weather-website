import { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import './FiveDays.css';
import Spinner from '../spinner/Spinner';

export default function FiveDays() {
    const location = useContext(LocationContext);
    const [fiveDaysWeather, setFiveDaysWeather] = useState([]);

    useEffect(() => {
        weatherService.getWeatherForFiveDays(location.latitude, location.longitude)
        .then(setFiveDaysWeather)
        .catch((error) => {
            console.error('Error fetching weather:', error);
        })
    }, [location.latitude, location.longitude])

    if(fiveDaysWeather === null || fiveDaysWeather.length === 0){
        return <Spinner />
    }
    return (
        <div className="days-container">
            <h2>FIVE DAYS WEATHER FORECAST</h2>
            <ul className="days">
                {fiveDaysWeather.map((day, index) => {
                    return (
                        <li className="day" key={index}>
                            <p>{new Date(day.date).toLocaleDateString("bg-BG", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                            </p>
                            <p>🌡️ Max: {day.maxTemp}°C / Min: {day.minTemp}°C</p>
                            <p>📊 Average: {day.averageTemp}°C</p>
                            <p>🌧️ Rain: {day.chaceOfRain}%</p>
                            <p>❄️ Snow: {day.chanceOfSnow}</p>
                            <p>🔆 UV: {day.uvIndex}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}