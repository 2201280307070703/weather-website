import { useState } from 'react';
import * as chatbotService from '../../services/chatbotService';
import './Chatbot.css';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! Ask me something.' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages((msgs) => [...msgs, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const answer = await chatbotService.sentChat(userMsg.text);
            const botMsg = { sender: 'bot', text: answer };
            setMessages((msgs) => [...msgs, botMsg]);
        } catch (err) {
            setMessages((msgs) => [
                ...msgs,
                { sender: 'bot', text: 'Sorry. Something went wrong.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className='chatbotContainer'>
            <div className='chatbotMessages'>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                    >
                        {msg.text}
                    </div>
                ))}
                {loading && <div>Typing...</div>}
            </div>

            <input
                type='text'
                className='chatbotInput'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Say something...'
                disabled={loading}
            />
        </div>
    );
};
