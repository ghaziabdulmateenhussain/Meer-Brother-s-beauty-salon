import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function CustomerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [profileError, setProfileError] = useState('');
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileError('');
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated.');
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="section max-w-lg">
      <h1 className="section-title mb-8">My Profile</h1>

      <form onSubmit={saveProfile} className="card p-6 space-y-4 mb-8">
        <h2 className="font-semibold">Account Details</h2>
        <ErrorMessage message={profileError} />
        <div>
          <label className="label">Full Name</label>
          <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input-field opacity-60 cursor-not-allowed" value={user.email} disabled />
          <p className="text-xs text-onyx/40 dark:text-white/40 mt-1">Email is your login ID and can't be changed here.</p>
        </div>
        <div>
          <label className="label">Phone</label>
          <input required className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="card p-6 space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <ErrorMessage message={passwordError} />
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            required
            className="input-field"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
        </div>
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input-field"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input-field"
            value={passwords.confirmNewPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
          />
        </div>
        <button type="submit" disabled={changingPassword} className="btn-gold disabled:opacity-60">
          {changingPassword ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
