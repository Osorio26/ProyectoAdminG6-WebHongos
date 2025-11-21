import "./fileUploadButton.css";

const FileUploadButton = ({ handleChange, label = "Subir archivo" }) => {

  return (
    <div className="file-upload-container">
      <input
        id="fileInput"
        type="file"
        accept=".txt"
        onChange={handleChange}
        className="file-input-hidden"
      />

      <label htmlFor="fileInput" className="file-upload-button">
        {label}
      </label>
    </div>
  );
};

export default FileUploadButton;