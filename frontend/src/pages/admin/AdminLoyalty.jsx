import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Table from '../../components/Table';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminLoyalty() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/loyalty')
      .then((res) => setRecords(res.data.records))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Loyalty Points</h1>
      <p className="text-sm text-onyx/50 dark:text-white/50 mb-6">
        Customers earn 10 points automatically for every completed booking. All calculations happen on the backend.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Customer', 'Email', 'Phone', 'Points', 'Last Activity']}>
          {records.map((r) => (
            <tr key={r._id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 font-medium">{r.customer?.name || 'Deleted user'}</td>
              <td className="px-4 py-3">{r.customer?.email}</td>
              <td className="px-4 py-3">{r.customer?.phone}</td>
              <td className="px-4 py-3 text-gold font-bold">{r.points}</td>
              <td className="px-4 py-3">
                {r.transactions?.length > 0
                  ? new Date(r.transactions[r.transactions.length - 1].date || r.updatedAt).toLocaleDateString()
                  : '—'}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-onyx/50 dark:text-white/50">No loyalty records yet.</td></tr>
          )}
        </Table>
      )}
    </div>
  );
}
