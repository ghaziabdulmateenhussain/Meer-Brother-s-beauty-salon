import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

const NEXT_ACTIONS = {
  PENDING: [{ status: 'APPROVED', label: 'Approve' }, { status: 'REJECTED', label: 'Reject' }, { status: 'CANCELLED', label: 'Cancel' }],
  APPROVED: [{ status: 'COMPLETED', label: 'Complete' }, { status: 'CANCELLED', label: 'Cancel' }],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(null); // { booking, action }

  function load() {
    setLoading(true);
    api
      .get('/admin/bookings', { params: { search: search || undefined, status: status || undefined } })
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, status]);

  async function applyAction() {
    try {
      await api.put(`/admin/bookings/${pending.booking._id}/status`, { status: pending.action });
      toast.success(`Booking ${pending.action.toLowerCase()}.`);
      setPending(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setPending(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <Search value={search} onChange={setSearch} placeholder="Search by name, ID, phone..." />
        <Filter value={status} onChange={setStatus} options={['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']} label="Status" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Booking ID', 'Customer', 'Service', 'Date/Time', 'Price', 'Status', 'Payment', 'Actions']}>
          {bookings.map((b) => (
            <tr key={b._id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 font-mono text-xs">{b.bookingId}</td>
              <td className="px-4 py-3">
                <p>{b.customerName}</p>
                <p className="text-xs text-onyx/50 dark:text-white/50">{b.customerPhone}</p>
              </td>
              <td className="px-4 py-3">{b.serviceName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{b.date} {b.time}</td>
              <td className="px-4 py-3">Rs. {b.finalPrice}</td>
              <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
              <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {NEXT_ACTIONS[b.status].map((a) => (
                    <button
                      key={a.status}
                      onClick={() => setPending({ booking: b, action: a.status })}
                      className="text-xs text-gold hover:underline whitespace-nowrap"
                    >
                      {a.label}
                    </button>
                  ))}
                  {NEXT_ACTIONS[b.status].length === 0 && <span className="text-xs text-onyx/30 dark:text-white/30">—</span>}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <ConfirmDialog
        open={!!pending}
        title={`${pending?.action} Booking`}
        message={`Mark booking ${pending?.booking?.bookingId} as ${pending?.action}?`}
        confirmLabel="Confirm"
        onConfirm={applyAction}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
