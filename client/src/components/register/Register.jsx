import { useState, useContext } from 'react';
import AuthenticationContext from '../../contexts/authenticationContext';
import './Register.css';

export default function Register() {
    const { registerSubmitHandeler } = useContext(AuthenticationContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(currentState => ({
            ...currentState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await registerSubmitHandeler(formData);
        }
        catch (error) {
            setError(error.message ? error.message : error);
        }
    };

    return (
        <div className='registerFormContainer'>
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
                <div className='formGroup'>
                    <label htmlFor='confirmPassword'>Потвърдете паролата:</label>
                    <input type='password' id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <button type='submit'>Регистрация</button>
            </form>
        </div>
    );
}