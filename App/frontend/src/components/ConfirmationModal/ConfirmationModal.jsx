import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  isDanger = false,
  type = "confirm" // "confirm" or "alert"
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-backdrop" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={e => e.stopPropagation()}>
        <div className="confirmation-modal-header">
          <h3 className="confirmation-modal-title">{title}</h3>
          <button className="confirmation-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="confirmation-modal-body">
          {message}
        </div>

        <div className="confirmation-modal-footer">
          {type === "confirm" && (
            <button className="confirmation-btn confirmation-btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          
          <button 
            className={`confirmation-btn ${isDanger ? 'confirmation-btn-danger' : 'confirmation-btn-confirm'}`}
            onClick={() => {
              if (onConfirm) onConfirm();
              if (type === "alert") onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
