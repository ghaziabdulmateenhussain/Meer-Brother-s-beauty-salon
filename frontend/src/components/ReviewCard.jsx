import React from 'react';

export default function ReviewCard({ review }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= review.rating ? '#C9A227' : 'none'} stroke="#C9A227" strokeWidth="1.5">
            <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-onyx/80 dark:text-white/80 mb-4 italic">"{review.comment}"</p>
      <p className="font-semibold text-sm">{review.customerName}</p>
      <p className="text-xs text-onyx/40 dark:text-white/40">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
