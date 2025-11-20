import { ChangeEvent, useState } from "react";
import Select from "react-select";
import CategoryDropdown from "../categoryDropdown/categoryDropdown";

const CategoryFileReader = () => {
  const [file, setFile] = useState(null);
  const [lines, setLines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});

  // Valores de texto de categoria
  const category_delimiter = '-----';
  const category_text_indicator_open = ('(');
  const category_text_indicator_close = (')');

  function handleFileChange(event) {
   
    if (event.target.files) {
      // debug: selected option
      console.log('Selected option:', selectedOption);

      const selectedFile = event.target.files?.[0]
      setFile(selectedFile)

      const reader = new FileReader();
      
      // Leer el contenido del archivo
      reader.onload = (e) => {
        const content = e.target.result;
        const allLines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        setLines(allLines);

        // Procesar lineas para categorias
        let tempCategories = [];
        let currentCategory = null;

        allLines.forEach(line => {
          if (line === category_delimiter) {

            // Si se encuentra un delimitador y hay una categoria en curso, se guarda y se limpia la variable
            if (currentCategory) {
              tempCategories.push(currentCategory);
              currentCategory = null;
            }
          } else if (line.startsWith(category_text_indicator_open) &&
              line.endsWith(category_text_indicator_close)) {

            // Si la linea es un titulo de categoria
            if (currentCategory) {
              tempCategories.push(currentCategory);
            }
            
            // Se crea una nueva categoria
            currentCategory = {
              title: line.slice(1, -1).trim(), // se asigna el titulo
              content: []
            };
          } else {
            // Si es una linea de contenido, la agregamos a la categoria actual
            if (currentCategory) {
              currentCategory.content.push(line); // se asigna cada linea como parte del arreglo de contenido
            }
          }
        });

        // Se agrega la ultima categoria (de existir))
        if (currentCategory) {
          tempCategories.push(currentCategory);
        }

        setCategories(tempCategories);

        // debug: mostrar categorias en la consola
        console.log('Parsed categories:', tempCategories);
      };
      reader.readAsText(selectedFile);
    }
  }

  function handleOptionSelect(option, index) {
    if (option) {
      setSelectedOption(previous_option => ({
        ...previous_option,
        [index]: option
      }));
    }
  }

  return (
  <div>
  <input 
    type="file" 
    accept=".txt"  
    onChange={handleFileChange}
    style={{ paddingBottom: "1rem" }}
  />

  {file && categories.length > 0 && (
    <div className="mb-4 text-sm">
      {categories.map((cat, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <CategoryDropdown 
            category_object={cat}
            placeholder_text="Seleccione una opcion." 
            handleOptionSelect={handleOptionSelect} 
            index={index} />
          {selectedOption[index] && (
            <p>Selected Option: "{selectedOption[index].label}"</p>
          )}
        </div>
      ))}

    </div>
    )}
  </div>
  );
};

export default CategoryFileReader;
