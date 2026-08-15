import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/services/${id}`)
      .then((res) => setService(res.data.service))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullscreen />;
  if (notFound || !service) {
    return (
      <div className="section text-center">
        <p className="text-onyx/60 dark:text-white/60">Service not found.</p>
        <Link to="/services" className="text-gold hover:underline">Back to services</Link>
      </div>
    );
  }

  return (
    <div className="section max-w-3xl">
      <div className="card overflow-hidden">
        <div className="h-64 bg-gold/10">
          {service.image ? (
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold/50 text-5xl font-display">MB</div>
          )}
        </div>
        <div className="p-8">
          <span className="section-eyebrow">{service.category}</span>
          <h1 className="text-3xl font-bold mb-3">{service.name}</h1>
          <p className="text-onyx/70 dark:text-white/70 mb-6 leading-relaxed">{service.description}</p>
          <div className="flex items-center gap-6 mb-8">
            <div>
              <p className="text-xs text-onyx/50 dark:text-white/50 uppercase tracking-widest">Price</p>
              <p className="text-2xl font-bold text-gold">Rs. {service.price}</p>
            </div>
            <div>
              <p className="text-xs text-onyx/50 dark:text-white/50 uppercase tracking-widest">Duration</p>
              <p className="text-2xl font-bold">{service.duration} min</p>
            </div>
          </div>
          <Link to="/booking" state={{ serviceId: service._id }} className="btn-gold">Book This Service</Link>
        </div>
      </div>
    </div>
  );
}
