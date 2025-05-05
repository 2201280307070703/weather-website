import {useState, useContext} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthenticationContext from '../../contexts/authenticationContext';
import Path from '../../paths';
import './Register.css';

export default function Register() {
    const navigate = useNavigate();

    const { registerSubmitHandeler } = useContext(AuthenticationContext);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(currentState => ({
            ...currentState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try{
            await registerSubmitHandeler(formData);
        }
        catch(error){
            setError(error.response ? error.response.data.msg : error.message);
        }
    };

    return (
        <div className='registerFormContainer'>
            <form onSubmit={handleSubmit} className='formContainer'>
                <p className='errorMessage'>{error}</p>
                <div className='formGroup'>
                    <label htmlFor='email'>Email:</label>
                    <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
                </div>
                <div className='formGroup'>
                    <label htmlFor='password'>Password:</label>
                    <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
                </div>
                <div className='formGroup'>
                    <label htmlFor='confirmPassword'>Confirm Password:</label>
                    <input type='password' id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}