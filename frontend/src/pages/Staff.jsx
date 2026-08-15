import React, { useEffect, useState } from 'react';
import api from '../services/api';
import StaffCard from '../components/StaffCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff').then((res) => setStaff(res.data.staff)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div className="section">
      <div className="text-center mb-10">
        <p className="section-eyebrow">Meet The Team</p>
        <h1 className="section-title">Our Staff</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {staff.map((m) => <StaffCard key={m._id} member={m} />)}
      </div>
    </div>
  );
}
