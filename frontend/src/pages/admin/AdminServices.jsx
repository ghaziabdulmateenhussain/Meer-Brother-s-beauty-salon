import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import LoadingSpinner from '../../components/LoadingSpinner';

const EMPTY = { name: '', description: '', price: '', duration: '', category: 'Barber', image: '', active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/services', { params: { all: 'true' } })
      .then((res) => setServices(res.data.services))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = services.filter((s) => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || s.category === category;
    return matchesSearch && matchesCategory;
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(s) {
    setEditing(s);
    setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, image: s.image || '', active: s.active });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), duration: Number(form.duration) };
      if (editing) {
        await api.put(`/services/${editing._id}`, payload);
        toast.success('Service updated.');
      } else {
        await api.post('/services', payload);
        toast.success('Service created.');
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
      await api.delete(`/services/${toDelete._id}`);
      toast.success('Service deleted.');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDelete(null);
    }
  }

  async function toggleActive(s) {
    try {
      await api.put(`/services/${s._id}`, { active: !s.active });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Services</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2.5 text-sm">Add Service</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Search value={search} onChange={setSearch} placeholder="Search services..." />
        <Filter value={category} onChange={setCategory} options={['Barber', 'Beauty']} label="Category" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Name', 'Category', 'Price', 'Duration', 'Status', 'Actions']}>
          {filtered.map((s) => (
            <tr key={s._id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-onyx/50 dark:text-white/50 line-clamp-1 max-w-xs">{s.description}</p>
              </td>
              <td className="px-4 py-3">{s.category}</td>
              <td className="px-4 py-3">Rs. {s.price}</td>
              <td className="px-4 py-3">{s.duration} min</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleActive(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${s.active ? 'bg-green-500/15 text-green-500 border-green-500/30' : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}
                >
                  {s.active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button onClick={() => openEdit(s)} className="text-xs text-gold hover:underline mr-3">Edit</button>
                <button onClick={() => setToDelete(s)} className="text-xs text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-onyx/50 dark:text-white/50">No services found.</td></tr>
          )}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required rows={2} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (Rs.)</label>
              <input required type="number" min="0" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="label">Duration (min)</label>
              <input required type="number" min="5" className="input-field" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="Barber">Barber</option>
              <option value="Beauty">Beauty</option>
            </select>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input-field" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Service'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete Service"
        message={`Delete "${toDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
