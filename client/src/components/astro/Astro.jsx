import { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './Astro.css';

export default function Astro() {
    const {location, loading}= useContext(LocationContext);
    const [astroInfo, setAstroInfo] = useState({});
    const [error, setError] = useState('');
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if(!loading){
            weatherService.getAstroData(location.latitude, location.longitude)
            .then(setAstroInfo)
            .catch((error) => {
                setError(error);
                setInfoPopupVisibility(true);
            });
        }
    }, [loading, location.latitude, location.longitude])

    const handeOnClose = () => {
        setError('');
        setInfoPopupVisibility(false);
    };

    if ((Object.keys(astroInfo).length === 0 || loading) && !error) {
        return <Spinner />;
    }
    
    if(infoPopupVisibility){
        return <InfoPopup message={error} onClose={handeOnClose}/>
    }

    return (
        <div className='astroContainer'>
            <div className='icon'>{astroInfo.is_sun_up ? "🌝" : "🌞"}</div>
            <div className='astroCard'>
                <h2>🌅 Sunrise to Moonlight</h2>
                <div className='astroGrid'>
                    <div className='astroItem'>
                        <span>🌄</span>
                        <p><strong>Sunrise:</strong> {astroInfo.sunrise}</p>
                    </div>
                    <div className='astroItem'>
                        <span>🌇</span>
                        <p><strong>Sunset:</strong> {astroInfo.sunset}</p>
                    </div>
                    <div className='astroItem'>
                        <span>🌙</span>
                        <p><strong>Moonrise:</strong> {astroInfo.moonrise}</p>
                    </div>
                    <div className='astroItem'>
                        <span>🌌</span>
                        <p><strong>Moonset:</strong> {astroInfo.moonset}</p>
                    </div>
                    <div className='astroItem'>
                        <span>🌓</span>
                        <p><strong>Phase:</strong> {astroInfo.moon_phase}</p>
                    </div>
                    <div className='astroItem'>
                        <span>💡</span>
                        <p><strong>Illumination:</strong> {astroInfo.moon_illumination}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}