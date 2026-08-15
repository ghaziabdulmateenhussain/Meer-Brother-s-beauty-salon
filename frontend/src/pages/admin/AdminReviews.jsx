import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import Table from '../../components/Table';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/reviews', { params: { all: 'true' } })
      .then((res) => setReviews(res.data.reviews))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleVisibility(r) {
    try {
      await api.put(`/reviews/${r._id}/visibility`, { visible: !r.visible });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/reviews/${toDelete._id}`);
      toast.success('Review deleted.');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDelete(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Customer', 'Rating', 'Comment', 'Date', 'Visibility', 'Actions']}>
          {reviews.map((r) => (
            <tr key={r._id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 font-medium">{r.customerName}</td>
              <td className="px-4 py-3 text-gold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
              <td className="px-4 py-3 max-w-xs truncate">{r.comment}</td>
              <td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleVisibility(r)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${r.visible ? 'bg-green-500/15 text-green-500 border-green-500/30' : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}
                >
                  {r.visible ? 'Visible' : 'Hidden'}
                </button>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => setToDelete(r)} className="text-xs text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-onyx/50 dark:text-white/50">No reviews yet.</td></tr>
          )}
        </Table>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete Review"
        message="Delete this review? This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
