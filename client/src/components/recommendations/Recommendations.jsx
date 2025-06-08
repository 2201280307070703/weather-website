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
            console.log(location);
            weatherService.getRecommendationsDependingOnWeather(location.latitude, location.longitude)
                .then(setRecommendations)
                .catch((error) => {
                    setError(error);
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
            <div className="recommendationsWrapper">
                <h2 className="sectionTitle">Препоръки за деня</h2>

                <div className="recommendationSection">
                    <h3 className="sectionHeading">🏃 Спорт</h3>
                    <p className="sectionText">{recommendations.sports}</p>
                </div>

                <div className="recommendationSection">
                    <h3 className="sectionHeading">👕 Облекло</h3>
                    <p className="sectionText">{recommendations.clothing}</p>
                </div>

                <div className="recommendationSection">
                    <h3 className="sectionHeading">🌞 Настроение</h3>
                    <p className="sectionText">{recommendations.mood}</p>
                </div>
            </div>
        </div>
    );
};