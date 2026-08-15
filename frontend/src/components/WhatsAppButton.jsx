import React, { useEffect, useState } from 'react';
import api from '../services/api';

const FALLBACK_NUMBER = '923430945567'; // international format, no + or leading 0

// Converts a local Pakistani number (03430945567) or an already-international
// one into the wa.me international format with no leading zero or plus sign.
function toWhatsAppFormat(raw) {
  if (!raw) return FALLBACK_NUMBER;
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  return digits || FALLBACK_NUMBER;
}

export default function WhatsAppButton({ text = "Hi! I'd like to know more about your services." }) {
  const [number, setNumber] = useState(FALLBACK_NUMBER);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => setNumber(toWhatsAppFormat(res.data.settings?.whatsapp)))
      .catch(() => {});
  }, []);

  const href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.2h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.76 14.1c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.11.31.02.5-.09.19-.14.31-.27.47-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.44.19.5.3.06.11.06.63-.18 1.31z"/>
      </svg>
    </a>
  );
}
