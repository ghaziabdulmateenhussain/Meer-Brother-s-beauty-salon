import React from 'react';

const styles = {
  PENDING: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
  APPROVED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  COMPLETED: 'bg-green-500/15 text-green-400 border-green-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 border-red-500/30',
  CANCELLED: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  UNPAID: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  PAID: 'bg-green-500/15 text-green-400 border-green-500/30',
  FAILED: 'bg-red-500/15 text-red-400 border-red-500/30',
  REFUNDED: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}
