import { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import './Astro.css';
import Spinner from '../spinner/Spinner';

export default function Astro() {
    const location = useContext(LocationContext);
    const [astroInfo, setAstroInfo] = useState({});

    useEffect(() => {
        weatherService.getAstroData(location.latitude, location.longitude)
            .then(setAstroInfo)
            .catch((error) => {
                console.error('Error fetching weather:', error);
            });
    }, [location.latitude, location.longitude])

    if (Object.keys(astroInfo).length === 0) {
        return <Spinner />;
    }

    return (
        <div className="astro-container">
            <div className="icon">{astroInfo.is_sun_up ? "🌞" : "🌝"}</div>
            <div className="astro-card">
                <h2>🌅 Sunrise to Moonlight</h2>
                <div className="astro-grid">
                    <div className="astro-item">
                        <span>🌄</span>
                        <p><strong>Sunrise:</strong> {astroInfo.sunrise}</p>
                    </div>
                    <div className="astro-item">
                        <span>🌇</span>
                        <p><strong>Sunset:</strong> {astroInfo.sunset}</p>
                    </div>
                    <div className="astro-item">
                        <span>🌙</span>
                        <p><strong>Moonrise:</strong> {astroInfo.moonrise}</p>
                    </div>
                    <div className="astro-item">
                        <span>🌌</span>
                        <p><strong>Moonset:</strong> {astroInfo.moonset}</p>
                    </div>
                    <div className="astro-item">
                        <span>🌓</span>
                        <p><strong>Phase:</strong> {astroInfo.moon_phase}</p>
                    </div>
                    <div className="astro-item">
                        <span>💡</span>
                        <p><strong>Illumination:</strong> {astroInfo.moon_illumination}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}