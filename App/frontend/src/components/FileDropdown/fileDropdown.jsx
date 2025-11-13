import { ChangeEvent, useState } from "react";
import Select from "react-select";

const FileDropdown = (prompt) => {
  const [file, setFile] = useState(null);
  const [lines, setLines] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  function handleFileChange(event) {
    if (event.target.files) {
      const selectedFile = event.target.files?.[0]
      setFile(selectedFile)

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result

        const fileLines = content.split(/\r?\n/);
        setLines(fileLines);
      };
      reader.readAsText(selectedFile);
    }
  }

  function handleOptionSelect(option) {
    if (option) {
      setSelectedOption(option.value)
    }
  }
    
  return (
    <div>
        <input type="file" 
        accept=".txt"  
        onChange={handleFileChange}
        style={{ paddingBottom: "1rem" }}/>  {/*Solo acepta archivos .txt*/}
        
        {file && (
          <div className="mb-4 text-sm">
            {/* (ESTO ES PARA VER EL CONTENIDO DEL ARCHIVO, PRUEBA <h3>File Content (Line by Line)</h3>
            <ul>
              {lines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
            <h3>File Dropdown Menu</h3> */}
            <Select
              options={lines.map(x => ({ value: x, label: x }))}
              placeholder={prompt.text}
              menuPlacement="auto"
              menuMaxHeight={100}
              onChange={handleOptionSelect}
            />

            {selectedOption && (
                <p>Selected Option: "{selectedOption}"</p>
              )
            }
          </div>
        )}
    </div>
  );
};

export default FileDropdown;
