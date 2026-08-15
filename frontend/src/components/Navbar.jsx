import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/staff', label: 'Staff' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold ${
      isActive ? 'text-gold' : 'text-onyx dark:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-onyx/90 backdrop-blur border-b border-gold/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Meer Brother's Salon logo" className="w-9 h-9" />
          <span className="font-display font-bold text-lg leading-tight text-onyx dark:text-white">
            Meer Brother's<span className="block text-xs text-gold tracking-widest -mt-1">SALON</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-gold">
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-outline !px-4 !py-2 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-outline !px-4 !py-2 text-sm">
              Login
            </Link>
          )}
          <Link to="/booking" className="btn-gold !px-4 !py-2 text-sm">
            Book Now
          </Link>
        </div>

        <button className="lg:hidden text-onyx dark:text-white" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-white dark:bg-onyx border-t border-gold/20 px-4 py-4 space-y-3">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={linkClass + ' block'}>
              {l.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-outline !px-4 !py-2 text-sm flex-1 text-center">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate('/');
                  }}
                  className="btn-outline !px-4 !py-2 text-sm flex-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline !px-4 !py-2 text-sm flex-1 text-center">
                Login
              </Link>
            )}
          </div>
          <Link to="/booking" onClick={() => setOpen(false)} className="btn-gold w-full text-center block">
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
