import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const RELEASE_YEAR = 2025;
    const CURRENT_YEAR = new Date().getFullYear();

    return(
        <footer>
            <p>🌤️ SunnySide © {RELEASE_YEAR}{ CURRENT_YEAR != RELEASE_YEAR && ` - ${CURRENT_YEAR}`}</p>
            <div className='links'>
                <Link to='https://github.com/2201280307070703/weather-website'><i className='fab fa-github'></i></Link>
                <Link to='https://www.facebook.com/profile.php?id=100006418607104&locale=bg_BG'><i className='fab fa-facebook'></i></Link>
                <a href='mailto:yanita37@abv.bg'> <i className='fas fa-envelope'></i> </a>
            </div>
        </footer>
    );
}