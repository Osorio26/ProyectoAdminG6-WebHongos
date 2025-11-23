import "./fileUploadModal.css";
import CategoryFileReader from "../categoryFileReader/categoryFileReader";

const FileUploadModal = ({onClose}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{"textAlign": "center"}}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-title">
          Archivo de Categorías
        </div>
        <CategoryFileReader onClose={onClose}/>
      </div>
    </div>
  );
};

export default FileUploadModal;