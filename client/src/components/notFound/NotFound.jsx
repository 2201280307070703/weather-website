import { Link } from 'react-router-dom';
import Path from '../../paths';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className='notFoundContainer'>
      <h1 className='notFoundTitle'>404</h1>
      <p className='notFoundMessage'>Страницата не е намерена😞</p>
      <Link to={Path.Home} className='notFoundLink'>Към началната страница</Link>
    </div>
  );
};