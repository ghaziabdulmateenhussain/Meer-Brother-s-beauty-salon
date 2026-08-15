import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Welcome Back</h1>
      <p className="text-center text-onyx/60 dark:text-white/60 mb-8">Login to manage your bookings</p>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <ErrorMessage message={error} />
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gold hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-sm text-onyx/60 dark:text-white/60">
          Don't have an account? <Link to="/register" className="text-gold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
