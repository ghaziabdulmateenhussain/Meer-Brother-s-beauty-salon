import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No dedicated backend endpoint was requested for this form; we route
    // it straight to WhatsApp/email so it always reaches the salon.
    const text = `Name: ${form.name}%0AEmail: ${form.email}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/923430945567?text=${text}`, '_blank');
    setSent(true);
    toast.success('Opening WhatsApp to send your message...');
  }

  return (
    <div className="section">
      <div className="text-center mb-10">
        <p className="section-eyebrow">Get In Touch</p>
        <h1 className="section-title">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="card p-5">
            <p className="section-eyebrow">Address</p>
            <p className="text-onyx/70 dark:text-white/70">Near Post Office, Kunjah, District Gujrat, Pakistan</p>
          </div>
          <div className="card p-5">
            <p className="section-eyebrow">Phone</p>
            <a href="tel:03430945567" className="text-gold hover:underline">03430945567</a>
          </div>
          <div className="card p-5">
            <p className="section-eyebrow">Email</p>
            <a href="mailto:ghaziabdulmateen786@gmail.com" className="text-gold hover:underline">ghaziabdulmateen786@gmail.com</a>
          </div>
          <div className="flex gap-3">
            <a href="tel:03430945567" className="btn-outline flex-1 text-center">Call Us</a>
            <a href="https://wa.me/923430945567" target="_blank" rel="noopener noreferrer" className="btn-outline !border-[#25D366] !text-[#25D366] hover:!bg-[#25D366] hover:!text-white flex-1 text-center">WhatsApp</a>
            <a href="mailto:ghaziabdulmateen786@gmail.com" className="btn-outline flex-1 text-center">Email</a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {sent && <p className="text-sm text-gold">Thanks! We'll get back to you soon.</p>}
          <div>
            <label className="label">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={4} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" className="btn-gold w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
