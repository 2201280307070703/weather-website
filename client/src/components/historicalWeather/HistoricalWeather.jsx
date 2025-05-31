import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import { LocationContext } from '../../contexts/locationContext';
import * as historicalWeatherService from '../../services/historicalWeatherService';
import * as weatherService from '../../services/weatherService';
import Spinner from '../spinner/Spinner';
import InfoPopup from '../infoPopup/InfoPopup';
import './HistoricalWeather.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function getSameDateLastYearStr() {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    return lastYear.toISOString().slice(0, 10);
}

export default function HistoricalComparisonChart() {
    const { location, loading } = useContext(LocationContext);
    const [currentData, setCurrentData] = useState(null);
    const [lastYearData, setLastYearData] = useState(null);
    const [error, setError] = useState(null);
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if (!loading) {
            const lastYearDate = getSameDateLastYearStr();

            Promise.all([
                weatherService.getCurrentWeatherStatsByCoordinates(location.latitude, location.longitude),
                historicalWeatherService.getHistoricalWeather(location.latitude, location.longitude, lastYearDate)
            ])
                .then(([thisYear, lastYear]) => {
                    setCurrentData(thisYear);
                    setLastYearData(lastYear);
                })
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

    if ((!currentData || !lastYearData || loading) && !error) {
        return <Spinner />;
    }

    if (infoPopupVisibility) {
        return <InfoPopup message={error} onClose={handeOnClose} />
    }

    const data = {
        labels: ['Температура (°C)', 'Влажност (%)', 'Валежи (mm)'],
        datasets: [
            {
                label: `Тази година (${currentData.time})`,
                data: [currentData.avgTemp, currentData.avgHumidity, currentData.rain],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
            {
                label: `Миналата година (${lastYearData.time})`,
                data: [lastYearData.avgTemp, lastYearData.avgHumidity, lastYearData.rain],
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
            }
        ]
    };

    const options = {
        responsive: true,
        indexAxis: 'x',
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    return (
        <div className='chartContainer'>
            <h2>Как се е променило времето на днешната дата спрямо миналата година</h2>
            <Bar data={data} options={options} height={400} />
        </div>
    );
};
