import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { createCategory } from "../../api/CategoryApi";
import upload_file_image from "../../assets/upload_file_image.png";
import FileFormatModal from "../fileFormatInfomodal/fileFormatModal.jsx";
import "./categoryFileReader.css";

const CategoryFileReader = ({ onClose }) => {
  const category_title_open = "("; 
  const category_title_close = ")"; 
  const expected_file_title = "categorias_hongos.txt"; 
  const category_delimiter = "-----";

  const inputRef = useRef(null);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const processFile = (file) => {
    if (!file) return;

    if (file.name !== expected_file_title) {
      alert(`El archivo debe llamarse "${expected_file_title}".`);
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;

      const allLines = content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      let categories = [];
      let current = null;

      allLines.forEach((line) => {
        if (line === category_delimiter) {
          if (current) {
            categories.push(current);
            current = null;
          }
        } else if (line.startsWith(category_title_open) && line.endsWith(category_title_close)) {
          if (current) categories.push(current);
          current = { title: line.slice(1, -1), content: [] };
        } else if (current) {
          current.content.push(line);
        }
      });

      if (current) categories.push(current);

      // guardar los cambios detectados al backend
      for (const cat of categories) {
        await createCategory(cat);
      }

      alert("Archivo leído y categorías guardadas correctamente!");


      // Cerrar el modal después de procesar el archivo
      if (onClose) onClose();
    };

    reader.readAsText(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    processFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    e.target.value = "";
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-4">

      <div {...getRootProps()} className="dropzone">
        
        <input
          {...getInputProps({ refKey: "ref" })}
          ref={inputRef}
          onChange={handleFileChange}
        />

        {isDragActive ? (
          <p>Suelte el archivo aquí...</p>
        ) : (
          <div className="file-browser-container">
            <div className="file-image-container" onClick={openFileDialog}>
              <img
                src={upload_file_image}
                alt="file-image"
                className="file-image"
              />
            </div>

            <p style={{ margin: 0, fontSize: 14, paddingBottom: "1rem" }}>
              Presione la imagen para seleccionar un archivo o arrástrelo aquí
            </p>
          </div>
        )}
      </div>

      {!isDragActive && (
        <button
          className="open-second-modal-button mt-8"
          onClick={() => setShowSecondModal(true)}
        >
          Ayuda
        </button>
      )}

      {showSecondModal && (
        <FileFormatModal onClose={() => setShowSecondModal(false)} />
      )}
    </div>
  );
};

export default CategoryFileReader;
