import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';

const EMPTY = { code: '', type: 'percentage', value: '', expiryDate: '', usageLimit: '', active: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/coupons')
      .then((res) => setCoupons(res.data.coupons))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : '',
      usageLimit: c.usageLimit,
      active: c.active,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, value: Number(form.value), usageLimit: Number(form.usageLimit) };
      if (editing) {
        await api.put(`/coupons/${editing._id}`, payload);
        toast.success('Coupon updated.');
      } else {
        await api.post('/coupons', payload);
        toast.success('Coupon created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/coupons/${toDelete._id}`);
      toast.success('Coupon deleted.');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDelete(null);
    }
  }

  async function toggleActive(c) {
    try {
      await api.put(`/coupons/${c._id}`, { active: !c.active });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2.5 text-sm">Add Coupon</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Code', 'Type', 'Value', 'Expiry', 'Usage', 'Status', 'Actions']}>
          {coupons.map((c) => {
            const expired = new Date(c.expiryDate) < new Date();
            return (
              <tr key={c._id} className="border-b border-gold/10 last:border-0">
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3 capitalize">{c.type}</td>
                <td className="px-4 py-3">{c.type === 'percentage' ? `${c.value}%` : `Rs. ${c.value}`}</td>
                <td className="px-4 py-3">
                  {new Date(c.expiryDate).toLocaleDateString()}
                  {expired && <span className="text-red-500 text-xs ml-1">(expired)</span>}
                </td>
                <td className="px-4 py-3">{c.usedCount} / {c.usageLimit}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${c.active ? 'bg-green-500/15 text-green-500 border-green-500/30' : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}
                  >
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button onClick={() => openEdit(c)} className="text-xs text-gold hover:underline mr-3">Edit</button>
                  <button onClick={() => setToDelete(c)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            );
          })}
          {coupons.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-onyx/50 dark:text-white/50">No coupons yet.</td></tr>
          )}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Coupon' : 'Add Coupon'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Code</label>
            <input required className="input-field uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="label">Value</label>
              <input required type="number" min="0" className="input-field" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Expiry Date</label>
              <input required type="date" className="input-field" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Usage Limit</label>
              <input required type="number" min="1" className="input-field" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Coupon'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete Coupon"
        message={`Delete coupon "${toDelete?.code}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
