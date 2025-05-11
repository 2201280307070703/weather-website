import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LocationContext } from '../../contexts/locationContext';
import AuthenticationContext from '../../contexts/authenticationContext';
import Path from '../../paths';
import * as weatherService from '../../services/weatherService';
import InfoPopup from '../infoPopup/InfoPopup';
import './Header.css';

export default function Header() {
  const {location, loading } = useContext(LocationContext);
  const { isAuthenticated } = useContext(AuthenticationContext);
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');
  const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

  useEffect(() => {
    if (!loading) {
      weatherService.getCurrentWeatherState(location.latitude, location.longitude)
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

  if (infoPopupVisibility) {
    return <InfoPopup message={error} onClose={handeOnClose} />
  }

  return (
    <header className={(weather ? weather : 'default')}>
      <h1><NavLink to={Path.Home}>🌞SunnySide</NavLink></h1>
      <nav>
        <NavLink to={Path.Today} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Today</NavLink>
        <NavLink to={Path.Hourly} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Hourly</NavLink>
        <NavLink to={Path.ForFiveDays} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>For 3 days</NavLink>
        <NavLink to={Path.Astro} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Astro</NavLink>
        {isAuthenticated ? (
          <NavLink to={Path.Logout} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Logout</NavLink>
        ) : (
          <>
            <NavLink to={Path.Login} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Login</NavLink>
            <NavLink to={Path.Register} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}