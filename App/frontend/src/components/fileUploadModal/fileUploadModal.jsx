import "./fileUploadModal.css";
import React, { useState } from "react";
import Modal from "../modal/modal";
import CategoryFileReader from "../categoryFileReader/categoryFileReader";
import upload_file_image from "../../assets/upload_file_image.png";

const FileUploadModal = ({ onClose}) => {
  const [showSecondModal, setShowSecondModal] = useState(false);
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-title">
          Archivo de Categorias
        </div>
        <div className="file-image-container">
          <img src={upload_file_image} alt="file-image" className="file-image" />
        </div>
        <CategoryFileReader />

        <button className="open-second-modal-button" onClick={() => setShowSecondModal(true)}>
          Ayuda
        </button>
      </div>

      {showSecondModal && (
        <Modal onClose={() => setShowSecondModal(false)} />
      )}
    </div>

    
  );
};

export default FileUploadModal;