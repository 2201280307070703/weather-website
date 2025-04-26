import { useEffect, useState } from 'react';

function GetUserCountry() {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=3d7d2144131c4551ab6ffcbfba689935`);
      const data = await response.json();

      if (data.results.length > 0) {
        const userCountry = data.results[0].components.country;
        setCountry(userCountry);
      } else {
        console.error('No results found');
      }
    }, (error) => {
      console.error('Error getting location', error);
    });
  }, []);

  return (
    <div>
      {country ? <h2>You're in {country}</h2> : <h2>Detecting country...</h2>}
    </div>
  );
}

export default GetUserCountry;
