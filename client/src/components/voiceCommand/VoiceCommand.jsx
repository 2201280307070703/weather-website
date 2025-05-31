import { useState, useEffect } from 'react';
import InfoPopup from '../infoPopup/InfoPopup';
import './VoiceCommand.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceCommand({ onCommandRecognized }) {
    const [listening, setListening] = useState(false);
    const [command, setCommand] = useState(null);
    const [InfoMessage, setInfoMessage] = useState(null);
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        if (!SpeechRecognition) {
            setInfoMessage('Вашият браузър не поддържа гласово разпознаване');
            setInfoPopupVisibility(true);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'bg-BG';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setCommand(speechToText);

            if (onCommandRecognized) {
                onCommandRecognized(speechToText);
            }
        };

        recognition.onend = () => {
            setListening(false);
        };

        if (listening) {
            recognition.start();
        }

        return () => {
            recognition.stop();
        };
    }, [listening, onCommandRecognized]);

    const toggleListening = () => {
        setListening(!listening);
    };

    const handleOnClose = () => {
        setInfoMessage(null);
        setInfoPopupVisibility(false);
    };

    if (infoPopupVisibility) {
        return <InfoPopup message={InfoMessage} onClose={handleOnClose} />;
    }

    return (
        <div>
            <button className={`recordButton ${listening ? 'listen' : ''}`} onClick={toggleListening}>
                {listening ? 'Спри слушането' : 'Започни слушане'}
            </button>
        </div>
    );
}
