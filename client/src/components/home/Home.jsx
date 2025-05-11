import { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './Home.css';

export default function Home() {
  const { location, loading: locationLoading } = useContext(LocationContext);
  const [weatherInfo, setWeatherInfo] = useState({});
  const [error, setError] = useState('');
  const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        if (debouncedSearchValue) {
          const data = await weatherService.getMainWeatherInfoByCity(debouncedSearchValue);
          setWeatherInfo(data);
        } else if (!locationLoading && location.latitude && location.longitude) {
          const data = await weatherService.getMainWeatherInfoByCoordinates(location.latitude, location.longitude);
          setWeatherInfo(data);
        }
      } catch (error) {
        setError(error);
        setInfoPopupVisibility(true);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [debouncedSearchValue, locationLoading, location.latitude, location.longitude]);

  const handleOnClose = () => {
    setError('');
    setInfoPopupVisibility(false);
  };

  const handleOnSearch = (e) => {
    setSearchValue(e.target.value);
  };

  if ((Object.keys(weatherInfo).length === 0 || weatherLoading || locationLoading) && !error) {
    return <Spinner />;
  }

  if (infoPopupVisibility) {
    return <InfoPopup message={error} onClose={handleOnClose} />;
  }

  return (
    <div className='homeContainer'>
      <div className='searchBarContainer'>
        <input
          type='text'
          value={searchValue}
          onChange={handleOnSearch}
          placeholder='City...'
          className='searchInput'
        />
        <span className='searchIcon'>🔍</span>
      </div>

      <div className='info'>
        <div className='weatherCard'>
          <div className='weatherHeader'>
            <div>
              <h1>{weatherInfo.city}</h1>
              <p className='state'>{weatherInfo.state}</p>
            </div>
            <img className='weatherIcon' src={weatherInfo.stateIcon} alt='state image' />
          </div>

          <div className='tempMain'>
            <span className='temp'>{weatherInfo.temperature}°C</span>
            <span className='feels'>Feels like {weatherInfo.feelsLike}°C</span>
          </div>

          <div className='weatherInfo'>
            <div className='infoItem'>
              <span>💨 Wind</span>
              <strong>{weatherInfo.windKmH} km/h</strong>
            </div>
            <div className='infoItem'>
              <span>💧 Humidity</span>
              <strong>{weatherInfo.humidity}%</strong>
            </div>
            <div className='infoItem'>
              <span>🔆 UV Index</span>
              <strong>{weatherInfo.uvIndex}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
