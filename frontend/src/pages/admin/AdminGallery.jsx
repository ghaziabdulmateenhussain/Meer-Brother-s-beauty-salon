import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Filter from '../../components/Filter';
import LoadingSpinner from '../../components/LoadingSpinner';

const CATEGORIES = ['Haircuts', 'Beard', 'Makeup', 'Bridal', 'Hair Styling', 'Beauty', 'Before/After'];
const EMPTY = { title: '', image: '', category: 'Haircuts', description: '', active: true };

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/gallery', { params: { all: 'true', category: category || undefined } })
      .then((res) => setItems(res.data.gallery))
      .finally(() => setLoading(false));
  }

  useEffect(load, [category]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(g) {
    setEditing(g);
    setForm({ title: g.title, image: g.image, category: g.category, description: g.description || '', active: g.active });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/gallery/${editing._id}`, form);
        toast.success('Gallery item updated.');
      } else {
        await api.post('/gallery', form);
        toast.success('Gallery item added.');
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
      await api.delete(`/gallery/${toDelete._id}`);
      toast.success('Gallery item deleted.');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDelete(null);
    }
  }

  async function toggleActive(g) {
    try {
      await api.put(`/gallery/${g._id}`, { active: !g.active });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2.5 text-sm">Add Image</button>
      </div>

      <div className="mb-4">
        <Filter value={category} onChange={setCategory} options={CATEGORIES} label="Category" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <p className="text-onyx/50 dark:text-white/50">No gallery items yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((g) => (
            <div key={g._id} className="card overflow-hidden">
              <div className="aspect-square bg-gold/10">
                {g.image && <img src={g.image} alt={g.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{g.title}</p>
                <p className="text-xs text-onyx/50 dark:text-white/50">{g.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => toggleActive(g)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${g.active ? 'bg-green-500/15 text-green-500 border-green-500/30' : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}
                  >
                    {g.active ? 'Active' : 'Inactive'}
                  </button>
                  <div>
                    <button onClick={() => openEdit(g)} className="text-xs text-gold hover:underline mr-2">Edit</button>
                    <button onClick={() => setToDelete(g)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Image' : 'Add Image'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input required className="input-field" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <textarea rows={2} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Image'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete Image"
        message={`Delete "${toDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
