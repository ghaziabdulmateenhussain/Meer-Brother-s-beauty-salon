import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import GalleryGrid from '../components/GalleryGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Filter from '../components/Filter';

const CATEGORIES = ['Haircuts', 'Beard', 'Makeup', 'Bridal', 'Hair Styling', 'Beauty', 'Before/After'];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/gallery').then((res) => setItems(res.data.gallery)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => (category ? items.filter((i) => i.category === category) : items), [items, category]);

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div className="section">
      <div className="text-center mb-8">
        <p className="section-eyebrow">Our Work</p>
        <h1 className="section-title">Gallery</h1>
      </div>
      <div className="flex justify-center mb-10">
        <Filter value={category} onChange={setCategory} options={CATEGORIES} label="Categories" />
      </div>
      <GalleryGrid items={filtered} />
    </div>
  );
}
