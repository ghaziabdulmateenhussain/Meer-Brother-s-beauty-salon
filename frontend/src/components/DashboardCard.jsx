import React from 'react';

export default function DashboardCard({ label, value, accent = false }) {
  return (
    <div className={`card p-5 ${accent ? 'border-gold' : ''}`}>
      <p className="text-xs uppercase tracking-widest text-onyx/50 dark:text-white/50 mb-2">{label}</p>
      <p className="text-2xl font-bold text-gold">{value}</p>
    </div>
  );
}
