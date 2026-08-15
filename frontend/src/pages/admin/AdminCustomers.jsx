import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Search from '../../components/Search';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  function load() {
    setLoading(true);
    api.get('/admin/customers', { params: { search: search || undefined } })
      .then((res) => setCustomers(res.data.customers))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  function viewBookings(customer) {
    setSelected(customer);
    setBookingsLoading(true);
    api.get(`/admin/customers/${customer._id}/bookings`)
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setBookingsLoading(false));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="mb-4">
        <Search value={search} onChange={setSearch} placeholder="Search by name, email, phone..." />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Name', 'Email', 'Phone', 'Bookings', 'Joined', 'Actions']}>
          {customers.map((c) => (
            <tr key={c._id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3">{c.email}</td>
              <td className="px-4 py-3">{c.phone}</td>
              <td className="px-4 py-3">{c.bookingCount}</td>
              <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button onClick={() => viewBookings(c)} className="text-xs text-gold hover:underline">View Bookings</button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-onyx/50 dark:text-white/50">No customers found.</td></tr>
          )}
        </Table>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`${selected?.name}'s Bookings`}>
        {bookingsLoading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <p className="text-sm text-onyx/50 dark:text-white/50">No bookings yet.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bookings.map((b) => (
              <div key={b._id} className="border border-gold/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{b.serviceName}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-xs text-onyx/50 dark:text-white/50 mt-1">{b.date} at {b.time} &middot; Rs. {b.finalPrice}</p>
                <p className="text-xs font-mono text-onyx/40 dark:text-white/40 mt-1">{b.bookingId}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
