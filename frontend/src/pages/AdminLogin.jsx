import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      if (res.data.user.role !== 'admin') {
        setError('This account does not have admin access.');
        setLoading(false);
        return;
      }
      login(res.data.token, res.data.user);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-onyx px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <img src="/favicon.svg" alt="logo" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-white text-2xl font-display font-bold">Admin Login</h1>
          <p className="text-white/50 text-sm">Meer Brother's Salon</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-onyx-light border border-gold/30 rounded-2xl p-6 space-y-4">
          <ErrorMessage message={error} />
          <div>
            <label className="label !text-white/70">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label !text-white/70">Password</label>
            <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
