import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const items = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/staff', label: 'Staff' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/loyalty', label: 'Loyalty' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-gold text-onyx' : 'text-white/70 hover:bg-white/5 hover:text-gold'
    }`;

  return (
    <div className="min-h-screen flex bg-white dark:bg-onyx">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-onyx text-gold flex items-center justify-center border border-gold/40"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-onyx border-r border-gold/20 flex flex-col z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gold/20 flex items-center gap-2">
          <img src="/favicon.svg" alt="logo" className="w-9 h-9" />
          <div>
            <p className="text-white font-display font-semibold text-sm leading-tight">Meer Brother's</p>
            <p className="text-gold text-xs">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={linkClass} onClick={() => setOpen(false)}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gold/20 space-y-2">
          <p className="text-white/50 text-xs px-2">{user?.name}</p>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-gold"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-end gap-3 p-4 border-b border-gold/10">
          <ThemeToggle />
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
