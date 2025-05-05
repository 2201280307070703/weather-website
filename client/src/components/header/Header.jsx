import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {LocationContext} from '../../contexts/locationContext';
import AuthenticationContext from '../../contexts/authenticationContext';
import Path from '../../paths';
import './Header.css';
import * as weatherService from '../../services/weatherService';

export default function Header() {
  const location = useContext(LocationContext);
  const {isAuthenticated} = useContext(AuthenticationContext);
  const [weather, setWeather] = useState("");

  useEffect(() => {
    weatherService.getCurrentWeatherState(location.latitude, location.longitude)
    .then(setWeather)
    .catch((error) => {
      console.error('Error fetching weather:', error);
    });

  }, [location.latitude, location.longitude]);

  return (
<header className={weather}>
  <h1><NavLink to={Path.Home}>🌞SunnySide</NavLink></h1>
  <nav>
    <NavLink to={Path.Today} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Today</NavLink>
    <NavLink to={Path.Hourly} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Hourly</NavLink>
    <NavLink to={Path.ForFiveDays} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>For 5 days</NavLink>
    <NavLink to={Path.Astro} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Sun and moon</NavLink>
    {isAuthenticated ? (
      <NavLink to={Path.Logout} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Logout</NavLink>
    ) : (
      <>
        <NavLink to={Path.Login} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
        <NavLink to={Path.Register} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register</NavLink>
      </>
    )}
  </nav>
</header>
  );
}