import { useEffect, useState, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './Hourly.css';

export default function Hourly() {
  const {location, loading} = useContext(LocationContext);
  const [weatherByHours, setWeatherByHours] = useState([]);
  const [error, setError] = useState(null);
  const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

  useEffect(() => {
    if (!loading) {
      weatherService.getWeatherHourly(location.latitude, location.longitude)
        .then(setWeatherByHours)
        .catch((error) => {
          setError(error);
          setInfoPopupVisibility(true);
        })
    }
  }, [loading, location.latitude, location.longitude])

  const handeOnClose = () => {
    setError(null);
    setInfoPopupVisibility(false);
  };

  if ((weatherByHours.length === 0 || loading) && !error) {
    return <Spinner />;
  }

  if (infoPopupVisibility) {
    return <InfoPopup message={error} onClose={handeOnClose} />
  }

  return (
    <div className='cardsContainer'>
      <div className='cards'>
        {weatherByHours.map((hour, index) => (
          <div className='hourCard' key={index}>
            <h3>{hour.time}</h3>
            <p><strong>🌡️ Температура:</strong> {hour.temp}°C</p>
            <p><strong>🤔 Усеща се като:</strong> {hour.feelsLike}°C</p>
            <p><strong>🌤️ Описание:</strong> {hour.state}</p>
            <p><strong>💨 Вятър:</strong> {hour.wind} km/h</p>
            <p><strong>☔ Шансове за валежи:</strong> {hour.rainChance}%</p>
            <p><strong>☀️ UV индекс:</strong> {hour.uvIndex}</p>
          </div>
        ))}
      </div>
    </div>
  );
};