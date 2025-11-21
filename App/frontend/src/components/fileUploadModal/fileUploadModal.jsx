import "./fileUploadModal.css";
import FileUploadButton from "../fileUploadButton/fileUploadButton";

const FileUploadModal = ({ onClose, children }) => {


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h1> Archivo de Categorias</h1>
        <FileUploadButton />
        {children}
      </div>
    </div>
  );
};

export default FileUploadModal;