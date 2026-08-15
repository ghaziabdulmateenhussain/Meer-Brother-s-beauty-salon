import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-onyx/70 dark:text-white/70 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn-outline !px-4 !py-2 text-sm">Cancel</button>
        <button
          onClick={onConfirm}
          className={`!px-4 !py-2 text-sm rounded-full font-semibold transition-colors ${
            danger ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-gold'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
