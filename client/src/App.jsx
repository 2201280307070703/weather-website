import { Routes, Route } from 'react-router-dom';

import { LocationProvider } from './contexts/locationContext';
import Path from './paths';

import Home from './components/home/Home';
import Today from './components/today/Today';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Hourly from './components/hourly/Hourly';

function App() {
  return (
    <LocationProvider>
      <Header />
      <Routes>
        <Route path={Path.Home} element={<Home />} />
        <Route path={Path.Today} element={<Today />} />
        <Route path={Path.Hourly} element={<Hourly />} />
      </Routes>
      <Footer/>
    </LocationProvider>
  )
}

export default App
