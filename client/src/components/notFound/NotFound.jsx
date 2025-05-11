import React from 'react';
import { Link } from 'react-router-dom';
import Path from '../../paths';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className='notFoundContainer'>
      <h1 className='notFoundTitle'>404</h1>
      <p className='notFoundMessage'>Oops! Page not found😞</p>
      <Link to={Path.Home} className='notFoundLink'>Go back to Home</Link>
    </div>
  );
}