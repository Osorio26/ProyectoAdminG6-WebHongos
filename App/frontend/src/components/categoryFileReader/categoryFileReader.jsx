import { ChangeEvent, useState } from "react";
import { createCategory } from "../../api/CategoryApi";

import FileUploadButton from "../fileUploadButton/fileUploadButton";
import CategoryDropdown from "../categoryDropdown/categoryDropdown";

const CategoryFileReader = () => {
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fileLoadCounter, setFileLoadCounter] = useState(0);

  // Valores de texto de categoria
  const category_delimiter = '-----';
  const category_text_indicator_open = ('(');
  const category_text_indicator_close = (')');

  // Titulo del archivo
  const expected_file_title = "categorias_hongos.txt";

  function handleFileChange(event) {
   
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      
      // Leer el contenido del archivo
      reader.onload = (e) => {
        const content = e.target.result;
        const allLines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (selectedFile.name !== expected_file_title) {
          alert(`El archivo seleccionado no es el correcto. Por favor seleccione uno de título "${expected_file_title}".`);
          return;
        }
        
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

        // Se agrega la ultima categoria (de existir)
        if (currentCategory) {
          tempCategories.push(currentCategory);
        }

        setCategories(tempCategories);

        // Se reseta la opcion seleccionada al cargar el archivo
        setSelectedOption(null);

        // Guardar todas las categorías y esperar a que terminen
        Promise.all(tempCategories.map(cat => saveCategory(cat)))
          .then(() => {
            // El dropdown se remonta para reflejar los nuevos datos
            setFileLoadCounter(prev => prev + 1);

            // Se reinicia el input del archivo para que seleccionar el mismo archivo de nuevo ejectute onChange
            if (event && event.target) event.target.value = "";
            console.log('All categories saved successfully');
          })
          .catch(err => {
            console.error('Error saving categories:', err);
          });

+         alert("Archivo leído y categorías guardadas correctamente!");
      };
      reader.readAsText(selectedFile);
    }
  }

  function handleOptionSelect(option) {
    if (option) {
      setSelectedOption(option);
    }
  }

  const saveCategory = async (categoryData) => {
    try {
      // Mapear datos mínimos al modelo del backend
      const newCategory = {
        title: categoryData.title,
        content: categoryData.content
      };

      console.log('Saving category:', newCategory);
      const response = await createCategory(newCategory);
      console.log(`Categoría "${categoryData.title}" guardada/actualizada correctamente:`, response);
      return response;
    } catch (error) {
      console.error(`Error saving category "${categoryData.title}":`, error);
      throw error;
    }
  };

  return (
    <div>
      <FileUploadButton
        handleChange={handleFileChange}
        label="Subir archivo"
      />

      {file && categories.length > 0 && (
        <div className="mb-4 text-sm">
              <CategoryDropdown
                key={fileLoadCounter}
                categoryName={"medio del cultivo"}
                placeholder_text="Seleccione una opcion." 
                handleOptionSelect={handleOptionSelect} 
              />
              {selectedOption && (
                <p>Selected Option: "{selectedOption.label}"</p>
              )}
            </div>
          )
    }
  </div>
  );
};

export default CategoryFileReader;
