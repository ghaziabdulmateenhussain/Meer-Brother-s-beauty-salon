import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-display font-bold text-gold mb-4">404</h1>
      <p className="text-xl mb-6">This page doesn't exist.</p>
      <Link to="/" className="btn-gold">Back to Home</Link>
    </div>
  );
}
