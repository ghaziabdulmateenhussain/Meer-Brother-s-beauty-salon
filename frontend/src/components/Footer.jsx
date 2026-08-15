import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then((res) => setSettings(res.data.settings)).catch(() => {});
  }, []);

  const phone = settings?.phone || '03430945567';
  const email = settings?.email || 'ghaziabdulmateen786@gmail.com';
  const address = settings?.address || 'Near Post Office, Kunjah, District Gujrat, Pakistan';

  return (
    <footer className="bg-onyx text-white border-t border-gold/20 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/favicon.svg" alt="logo" className="w-9 h-9" />
            <span className="font-display font-bold text-lg">Meer Brother's Salon</span>
          </div>
          <p className="text-gold-light text-sm italic">"Your Beauty, Our Passion"</p>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-3 uppercase text-xs tracking-widest">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/staff" className="hover:text-gold">Our Staff</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/booking" className="hover:text-gold">Book Appointment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-3 uppercase text-xs tracking-widest">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{address}</li>
            <li>Phone: {phone}</li>
            <li>Email: {email}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-3 uppercase text-xs tracking-widest">Follow Us</h4>
          <div className="flex gap-3">
            {(settings?.socialLinks?.facebook) && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-onyx transition-colors">f</a>
            )}
            {(settings?.socialLinks?.instagram) && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-onyx transition-colors">ig</a>
            )}
            {!settings?.socialLinks?.facebook && !settings?.socialLinks?.instagram && (
              <p className="text-white/40 text-sm">Coming soon</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gold/10 text-center text-xs text-white/40 py-4">
        &copy; {new Date().getFullYear()} Meer Brother's Salon. All rights reserved.
      </div>
    </footer>
  );
}
