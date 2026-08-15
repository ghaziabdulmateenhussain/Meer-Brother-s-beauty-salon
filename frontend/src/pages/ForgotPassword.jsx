import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Forgot Password</h1>
      <p className="text-center text-onyx/60 dark:text-white/60 mb-8">We'll email you a reset link</p>
      <div className="card p-6">
        {sent ? (
          <p className="text-center text-sm">
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Please check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={error} />
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <p className="text-center text-sm text-onyx/60 dark:text-white/60 mt-4">
          <Link to="/login" className="text-gold hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
