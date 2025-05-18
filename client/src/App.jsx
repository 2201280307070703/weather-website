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
import NotFound from './components/notFound/NotFound';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Logout from './components/logout/Logout';
import VoiceCommand from './components/voiceCommand/VoiceCommand';

function App() {
  return (
    <LocationProvider>
      <AuthenticationProvider>
        <Header />
        <Routes>
          <Route path={Path.Home} element={<Home />} />
          <Route path={Path.Today} element={<Today />} />
          <Route path={Path.Hourly} element={<Hourly />} />
          <Route path={Path.ForFiveDays} element={<ThreeDays />} />
          <Route path={Path.Astro} element={<Astro />} />
          <Route path={Path.All} element={<NotFound />} />
          <Route path={Path.Login} element={<Login />} />
          <Route path={Path.Register} element={<Register />} />
          <Route path={Path.Logout} element={<Logout/>}/>
        </Routes>
        <Footer />
      </AuthenticationProvider>
    </LocationProvider>
  )
}

export default App
