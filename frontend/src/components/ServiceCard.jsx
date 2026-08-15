import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <div className="card overflow-hidden group">
      <div className="h-48 overflow-hidden bg-gold/10">
        {service.image ? (
          <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/50 text-4xl font-display">MB</div>
        )}
      </div>
      <div className="p-5">
        <span className="section-eyebrow">{service.category}</span>
        <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
        <p className="text-sm text-onyx/60 dark:text-white/60 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gold font-bold text-lg">Rs. {service.price}</span>
            <span className="text-xs text-onyx/50 dark:text-white/50 ml-2">{service.duration} min</span>
          </div>
          <Link to={`/services/${service._id}`} className="text-sm font-medium text-gold hover:underline">
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
