import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loyalty, setLoyalty] = useState({ points: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/bookings/my'), api.get('/loyalty/my')])
      .then(([b, l]) => {
        setBookings(b.data.bookings);
        setLoyalty(l.data.loyalty);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullscreen />;

  const upcoming = bookings.filter((b) => ['PENDING', 'APPROVED'].includes(b.status));
  const past = bookings.filter((b) => !['PENDING', 'APPROVED'].includes(b.status));

  return (
    <div className="section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-onyx/60 dark:text-white/60 text-sm">{user.email} &middot; {user.phone}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/profile" className="btn-outline !px-4 !py-2 text-sm">Edit Profile</Link>
          <Link to="/booking" className="btn-gold !px-4 !py-2 text-sm">New Booking</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gold">{bookings.length}</p>
          <p className="text-xs text-onyx/50 dark:text-white/50">Total Bookings</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gold">{upcoming.length}</p>
          <p className="text-xs text-onyx/50 dark:text-white/50">Upcoming</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gold">{bookings.filter((b) => b.status === 'COMPLETED').length}</p>
          <p className="text-xs text-onyx/50 dark:text-white/50">Completed</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gold">{loyalty.points}</p>
          <p className="text-xs text-onyx/50 dark:text-white/50">Loyalty Points</p>
        </div>
      </div>

      <h2 className="font-semibold text-lg mb-4">Upcoming Bookings</h2>
      {upcoming.length === 0 ? (
        <p className="text-onyx/50 dark:text-white/50 text-sm mb-10">No upcoming bookings.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {upcoming.map((b) => (
            <div key={b._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-medium">{b.serviceName}</p>
                <p className="text-xs text-onyx/50 dark:text-white/50">{b.bookingId} &middot; {b.date} at {b.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <StatusBadge status={b.paymentStatus} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent History</h2>
        <Link to="/booking-history" className="text-sm text-gold hover:underline">View All &rarr;</Link>
      </div>
      {past.length === 0 ? (
        <p className="text-onyx/50 dark:text-white/50 text-sm">No past bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {past.slice(0, 5).map((b) => (
            <div key={b._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-medium">{b.serviceName}</p>
                <p className="text-xs text-onyx/50 dark:text-white/50">{b.bookingId} &middot; {b.date} at {b.time}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
