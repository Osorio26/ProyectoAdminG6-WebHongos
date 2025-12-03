import React from "react";
import "./AppModal.css";

export default function AppModal({ open, title, message, onConfirm, onCancel, hideCancel, cancelLabel = "Cancelar", confirmLabel = "Continuar" }) {
  if (!open) return null;

  return (
    <div className="appmodal-overlay">
      <div className="appmodal-window">
        {title && <h2 className="appmodal-title">{title}</h2>}
        <p className="appmodal-message">{message}</p>

        <div className="appmodal-buttons">
          {!hideCancel && (
            <button className="modal-cancel" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}

          <button className="modal-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
