import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toCancel, setToCancel] = useState(null);

  function load() {
    api.get('/bookings/my').then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function confirmCancel() {
    try {
      await api.put(`/bookings/${toCancel._id}/cancel`);
      toast.success('Booking cancelled.');
      setToCancel(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToCancel(null);
    }
  }

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div className="section">
      <h1 className="section-title mb-8">Booking History</h1>
      {bookings.length === 0 ? (
        <p className="text-onyx/50 dark:text-white/50">You have no bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{b.serviceName}</p>
                <p className="text-xs text-onyx/50 dark:text-white/50">{b.bookingId} &middot; {b.date} at {b.time} &middot; Rs. {b.finalPrice}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <StatusBadge status={b.paymentStatus} />
                {['PENDING', 'APPROVED'].includes(b.status) && (
                  <button onClick={() => setToCancel(b)} className="text-xs text-red-400 hover:underline">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toCancel}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking ${toCancel?.bookingId}?`}
        confirmLabel="Yes, Cancel"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}
