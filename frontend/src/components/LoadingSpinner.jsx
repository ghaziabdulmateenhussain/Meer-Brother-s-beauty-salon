import React from 'react';

export default function LoadingSpinner({ fullscreen = false, label = 'Loading...' }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      <p className="text-sm text-gold">{label}</p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-onyx">{spinner}</div>
    );
  }
  return <div className="flex items-center justify-center py-16">{spinner}</div>;
}
