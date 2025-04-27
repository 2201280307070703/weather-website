import { useEffect, useState } from 'react';
import * as weatherService from "../../services/weatherService.js";

function Home() {
  const [daysTemperature, setDaysTemperature] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = weatherService.getWeatherForCoordinates(latitude, longitude, 5)
      .then(setDaysTemperature);
    },
    (error) => {
      console.error('Error getting location:', error);
    });
  }, []);

  return (
    daysTemperature.map(day => {
      return <p key={day.id}>{day.date} - {day.avgTemp}</p>
    })
  );
}

export default Home;
