import React from "react";
import "./AppModal.css";

export default function AppModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="appmodal-overlay">
      <div className="appmodal-window">
        {title && <h2 className="appmodal-title">{title}</h2>}
        <p className="appmodal-message">{message}</p>

        <div className="appmodal-buttons">
          <button className="modal-cancel" onClick={onCancel}>
            Cancelar
          </button>

          <button className="modal-confirm" onClick={onConfirm}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
