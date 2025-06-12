import { Routes, Route } from 'react-router-dom';

import { LocationProvider } from './contexts/locationContext';
import { AuthenticationProvider } from './contexts/authenticationContext';
import Path from './paths';

import Home from './components/home/Home';
import Today from './components/today/Today';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Hourly from './components/hourly/Hourly';
import ThreeDays from './components/threeDays/ThreeDays';
import Astro from './components/astro/Astro';
import HistoricalWeather from './components/historicalWeather/HistoricalWeather';
import UserInfo from './components/userInfo/UserInfo';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Logout from './components/logout/Logout';
import NotFound from './components/notFound/NotFound';
import Recommendations from './components/recommendations/Recommendations';

function App() {
  return (
    <LocationProvider>
      <AuthenticationProvider>
        <Header />
        <div className="mainContainer">
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
          <div className="cloud cloud3"></div>
          <div className='content'>
            <Routes>
              <Route path={Path.Home} element={<Home />} />
              <Route path={Path.Today} element={<Today />} />
              <Route path={Path.Hourly} element={<Hourly />} />
              <Route path={Path.ForFiveDays} element={<ThreeDays />} />
              <Route path={Path.Astro} element={<Astro />} />
              <Route path={Path.TodayVSLastYear} element={<HistoricalWeather />} />
              <Route path={Path.UserInfo} element={<UserInfo />} />
              <Route path={Path.Recommendations} element={<Recommendations />} />
              <Route path={Path.Login} element={<Login />} />
              <Route path={Path.Register} element={<Register />} />
              <Route path={Path.Logout} element={<Logout />} />
              <Route path={Path.All} element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </AuthenticationProvider>
    </LocationProvider>
  )
};

export default App
