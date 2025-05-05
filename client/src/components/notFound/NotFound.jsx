import React from 'react';
import { Link } from 'react-router-dom';
import Path from '../../paths';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! Page not found😞</p>
      <Link to={Path.Home} className="not-found-link">Go back to Home</Link>
    </div>
  );
}