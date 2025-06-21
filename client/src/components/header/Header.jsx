import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LocationContext } from '../../contexts/locationContext';
import AuthenticationContext from '../../contexts/authenticationContext';
import Path from '../../paths';
import * as weatherService from '../../services/weatherService';
import './Header.css';

export default function Header() {
  const { location, loading } = useContext(LocationContext);
  const { isAuthenticated, email } = useContext(AuthenticationContext);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!loading) {
      weatherService.getCurrentWeatherState(location.latitude, location.longitude)
        .then(setWeather)
        .catch((error) => {
          console.log(`Header error: ${error}`);
        });
    }
  }, [loading, location.latitude, location.longitude]);

  return (
    <header className={(weather ? weather : 'default')}>
      <h1><NavLink to={Path.Home}>🌞SunnySide</NavLink></h1>
      <nav>
        <div className='pages'>
          <NavLink to={Path.Today} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Днес</NavLink>
          <NavLink to={Path.Hourly} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Почасово</NavLink>
          <NavLink to={Path.ForFiveDays} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>За 3 дни</NavLink>
          <NavLink to={Path.Astro} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Небесни светила</NavLink>
          <NavLink to={Path.TodayVSLastYear} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Днес vs миналата година</NavLink>
          <NavLink to={Path.Recommendations} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Препоръки</NavLink>
        </div>
        <div className='auth'>
          {isAuthenticated ? (
            <>
              <NavLink to={Path.Logout} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Изход</NavLink>
              <NavLink to={Path.UserInfo}  className='email'>| {email.split('@')[0]}</NavLink>
            </>
          ) : (
            <>
              <NavLink to={Path.Login} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Влизане</NavLink>
              <NavLink to={Path.Register} className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}>Регистрация</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};