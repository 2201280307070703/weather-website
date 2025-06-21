import { createContext, useState, useEffect } from 'react';

//coordinates for Sofia, Bulgaria
const DEFAULT_LOCATION = {
  latitude: 42.6977,
  longitude: 23.3219,
};

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ latitude, longitude });
            setLoading(false);
          },
          (error) => {
            setLocation(DEFAULT_LOCATION);
            setLoading(false);
          }
        );
      } else {
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading }}>
      {children}
    </LocationContext.Provider>
  );
};
