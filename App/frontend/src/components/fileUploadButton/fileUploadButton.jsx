import "./fileUploadButton.css";

const FileUploadButton = ({ handleChange, label = "Subir archivo" }) => {

  return (
    <div style={{ paddingBottom: "1rem" }}>
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