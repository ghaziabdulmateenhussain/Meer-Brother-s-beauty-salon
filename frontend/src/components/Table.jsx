import React from 'react';

export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold/20 text-left text-onyx/50 dark:text-white/50 uppercase text-xs tracking-wider">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-medium whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
