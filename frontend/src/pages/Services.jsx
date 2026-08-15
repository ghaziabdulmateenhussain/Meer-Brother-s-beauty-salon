import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Filter from '../components/Filter';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data.services)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (category ? services.filter((s) => s.category === category) : services),
    [services, category]
  );

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div className="section">
      <div className="text-center mb-8">
        <p className="section-eyebrow">Our Menu</p>
        <h1 className="section-title">Services</h1>
        <p className="text-onyx/60 dark:text-white/60">Professional barber and beauty services for everyone.</p>
      </div>

      <div className="flex justify-center mb-10">
        <Filter value={category} onChange={setCategory} options={['Barber', 'Beauty']} label="Categories" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-onyx/50 dark:text-white/50 py-10">No services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => <ServiceCard key={s._id} service={s} />)}
        </div>
      )}
    </div>
  );
}
