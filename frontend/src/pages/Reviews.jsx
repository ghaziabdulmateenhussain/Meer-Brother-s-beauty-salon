import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  function loadReviews() {
    api.get('/reviews').then((res) => setReviews(res.data.reviews)).finally(() => setLoading(false));
  }

  useEffect(loadReviews, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', { rating, comment });
      setComment('');
      setRating(5);
      toast.success('Thank you for your review!');
      loadReviews();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section">
      <div className="text-center mb-10">
        <p className="section-eyebrow">Testimonials</p>
        <h1 className="section-title">Customer Reviews</h1>
      </div>

      <div className="max-w-xl mx-auto card p-6 mb-12">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={error} />
            <div>
              <label className="label">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} star`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= rating ? '#C9A227' : 'none'} stroke="#C9A227" strokeWidth="1.5">
                      <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Your Review</label>
              <textarea className="input-field" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="text-center text-sm text-onyx/60 dark:text-white/60">
            <Link to="/login" className="text-gold hover:underline">Login</Link> to leave a review.
          </p>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <p className="text-center text-onyx/50 dark:text-white/50">No reviews yet. Be the first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}
    </div>
  );
}
