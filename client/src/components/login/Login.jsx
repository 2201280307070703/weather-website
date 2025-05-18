import {useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import AuthenticationContext from '../../contexts/authenticationContext';
import Path from '../../paths';
import './Login.css';

export default function Login() {
    const { loginSubmitHandler } = useContext(AuthenticationContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(currentState => ({
            ...currentState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await loginSubmitHandler(formData)
        } catch (error) {
            setError(error || 'Login error!');
        };
    };

    return (
        <div className='loginFormContainer'>
            <form onSubmit={handleSubmit} className='formContainer'>
                <p className='errorMessage'>{error}</p>
                <div className='formGroup'>
                    <label htmlFor='email'>Имейл:</label>
                    <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
                </div>
                <div className='formGroup'>
                    <label htmlFor='password'>Парола:</label>
                    <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
                </div>
                <button type='submit'>Влез</button>
                <Link className='registerLink' to={Path.Register}>Все още нямате профил? Натиснете тук.</Link>
            </form>
        </div>
    );
}