import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then((res) => {
      const s = res.data.settings;
      setForm({
        businessName: s.businessName || '',
        tagline: s.tagline || '',
        email: s.email || '',
        phone: s.phone || '',
        whatsapp: s.whatsapp || '',
        address: s.address || '',
        openingHours: DAYS.reduce((acc, d) => ({ ...acc, [d]: s.openingHours?.[d] || '' }), {}),
        socialLinks: {
          facebook: s.socialLinks?.facebook || '',
          instagram: s.socialLinks?.instagram || '',
          tiktok: s.socialLinks?.tiktok || '',
        },
      });
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings updated.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Business Settings</h1>
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Business Name</label>
            <input className="input-field" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input className="input-field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div>
            <label className="label">Admin Email</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">WhatsApp Number</label>
            <input className="input-field" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <textarea rows={2} className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div>
          <p className="label mb-2">Opening Hours</p>
          <div className="space-y-2">
            {DAYS.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-24 text-sm text-onyx/60 dark:text-white/60">{d}</span>
                <input
                  className="input-field flex-1"
                  value={form.openingHours[d]}
                  onChange={(e) => setForm({ ...form, openingHours: { ...form.openingHours, [d]: e.target.value } })}
                  placeholder="10:00 AM - 8:00 PM"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="label mb-2">Social Media Links (optional)</p>
          <div className="space-y-2">
            <input className="input-field" placeholder="Facebook URL" value={form.socialLinks.facebook} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} />
            <input className="input-field" placeholder="Instagram URL" value={form.socialLinks.instagram} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
            <input className="input-field" placeholder="TikTok URL" value={form.socialLinks.tiktok} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, tiktok: e.target.value } })} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
