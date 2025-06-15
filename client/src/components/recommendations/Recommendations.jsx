import { useEffect, useState, useContext } from 'react';
import { LocationContext } from '../../contexts/locationContext';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './Recommendations.css';

export default function Recommendations() {
    const { location, loading } = useContext(LocationContext);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState(null);
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if (!loading) {
            weatherService.getRecommendationsDependingOnWeather(location.latitude, location.longitude)
                .then(setRecommendations)
                .catch(() => {
                    setError('Нещо се случи. Моля презаредете страницата!');
                    setInfoPopupVisibility(true);
                });
        }
    }, [loading, location.latitude, location.longitude]);

    const handeOnClose = () => {
        setError(null);
        setInfoPopupVisibility(false);
    };

    if ((!recommendations || loading) && !error) {
        return <Spinner />;
    }

    if (infoPopupVisibility) {
        return <InfoPopup message={error} onClose={handeOnClose} />
    }
    
    return (
        <div className='recommendationsContainer'>
            <h2 className='title'>{recommendations.mood.title},</h2>
            <h3 className='subtitle'>затова имаме следните предложения за теб:</h3>
            <div className='recommendations'>
                <div className='recommendation'>
                    <h2>Облекло 👇</h2>
                    <h3>{recommendations.clothes.title}</h3>
                    {recommendations.clothes.suggestions.map((cloth, index) => (
                        <p key={index}> 👉 {cloth}</p>
                    ))}
                </div>
                <div className='recommendation'>
                    <h2>Спорт 👇</h2>
                    <h3>{recommendations.sports.title}</h3>
                    {recommendations.sports.suggestions.map((sport, index) => (
                        <p key={index}> 👉 {sport}</p>
                    ))}
                </div>
                <div className='recommendation'>
                    <h2>Развлечения 👇</h2>
                    <h3>{recommendations.activities.title}</h3>
                    {recommendations.activities.suggestions.map((activity, index) => (
                        <p key={index}> 👉 {activity}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};