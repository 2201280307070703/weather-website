import { useEffect, useState, useContext } from "react";
import {LocationContext} from "../../contexts/locationContext";
import * as weatherService from "../../services/weatherService";
import "./Hourly.css";

export default function Hourly(){
    const location = useContext(LocationContext);
    const [weatherByHours, setWeatherByHours] = useState([]);

    useEffect(() =>{
        weatherService.getWeatherHourly(location.latitude, location.longitude)
        .then(setWeatherByHours)
        .catch((error) => {
            console.error('Error fetching weather:', error);
        })
    }, [location.latitude, location.longitude])

    return (
        <div className="hourly-forecast-cards">
          {weatherByHours.map((hour, index) => (
            <div className="hour-card" key={index}>
              <h3>{hour.time}</h3>
              <p><strong>🌡️ Temp:</strong> {hour.temp}°C</p>
              <p><strong>🤔 Feels Like:</strong> {hour.feelsLike}°C</p>
              <p><strong>🌤️ Description:</strong> {hour.state}</p>
              <p><strong>💨 Wind:</strong> {hour.wind} km/h</p>
              <p><strong>☔ Rain Chance:</strong> {hour.rainChance}%</p>
              <p><strong>☀️ UV Index:</strong> {hour.uvIndex}</p>
            </div>
          ))}
        </div>
      );
}