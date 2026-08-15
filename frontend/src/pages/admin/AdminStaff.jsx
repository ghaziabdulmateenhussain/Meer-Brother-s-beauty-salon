import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../services/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';

const EMPTY = { name: '', photo: '', position: '', specialty: '', experience: '', bio: '', active: true };

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/staff', { params: { all: 'true' } })
      .then((res) => setStaff(res.data.staff))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(s) {
    setEditing(s);
    setForm({ name: s.name, photo: s.photo || '', position: s.position, specialty: s.specialty, experience: s.experience, bio: s.bio, active: s.active });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/staff/${editing._id}`, form);
        toast.success('Staff member updated.');
      } else {
        await api.post('/staff', form);
        toast.success('Staff member added.');
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
      await api.delete(`/staff/${toDelete._id}`);
      toast.success('Staff member deleted.');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDelete(null);
    }
  }

  async function toggleActive(s) {
    try {
      await api.put(`/staff/${s._id}`, { active: !s.active });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Staff</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2.5 text-sm">Add Staff</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table columns={['Name', 'Position', 'Specialty', 'Experience', 'Status', 'Actions']}>
          {staff.map((s) => (
            <tr key={s._id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3">{s.position}</td>
              <td className="px-4 py-3">{s.specialty}</td>
              <td className="px-4 py-3">{s.experience}</td>
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
          {staff.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-onyx/50 dark:text-white/50">No staff members yet.</td></tr>
          )}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Staff Member' : 'Add Staff Member'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Photo URL</label>
            <input className="input-field" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="label">Position</label>
            <input required className="input-field" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Senior Barber" />
          </div>
          <div>
            <label className="label">Specialty</label>
            <input required className="input-field" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Beard styling" />
          </div>
          <div>
            <label className="label">Experience</label>
            <input required className="input-field" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="8 years" />
          </div>
          <div>
            <label className="label">Biography</label>
            <textarea required rows={3} className="input-field" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Staff Member'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete Staff Member"
        message={`Remove "${toDelete?.name}" from staff? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
