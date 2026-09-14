import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <AlertTriangle size={32} />
        </div>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Batal
          </button>

          <button className="btn-danger" onClick={onConfirm}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

