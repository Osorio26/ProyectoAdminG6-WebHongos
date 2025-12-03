import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCategory, updateCategory } from "../../api/CategoryApi";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import "react-toastify/dist/ReactToastify.css";
import "./categoryFileReader.css";

const CategoryFileReader = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

    const options = {
    title: 'Title',
    message: 'Message',
    buttons: [
      {
        label: 'Yes',
        onClick: () => alert('Click Yes')
      },
      {
        label: 'No',
        onClick: () => alert('Click No')
      }
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name"
  };



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategory();
      setCategories(data);
      if (selectedCategory) {
        // Update selected category if it exists in new data
        const updated = data.find(c => c.title === selectedCategory.title);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      toast.error("Error al cargar categorías.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim() || !selectedCategory) return;
    
    const updatedContent = [...selectedCategory.content, newItem.trim()];
    const updatedCategory = { ...selectedCategory, content: updatedContent };

    try {
      await updateCategory(selectedCategory.title, updatedCategory);
      setNewItem("");
      toast.success("Elemento agregado!");
      fetchCategories(); // Refresh all to be safe
    } catch (error) {
      toast.error("Error al agregar elemento.");
    }
  };

  const handleDeleteItem = async (itemToDelete) => {
  if (!selectedCategory) return;

  confirmAlert({
    title: 'Confirmar eliminación',
    message: `¿Eliminar "${itemToDelete}" de ${selectedCategory.title}?`,
    buttons: [
      {
        label: 'Sí',
        onClick: async () => {
          // Proceed with deletion
          const updatedContent = selectedCategory.content.filter(item => item !== itemToDelete);
          const updatedCategory = { ...selectedCategory, content: updatedContent };

          try {
            await updateCategory(selectedCategory.title, updatedCategory);
            toast.success("Elemento eliminado!");
            fetchCategories();
          } catch (error) {
            toast.error("Error al eliminar elemento.");
          }
        }
      },
      {
        label: 'No',
        onClick: () => {
          // Nothing happens
        }
      }
    ]
  });
  };

  const handleDeleteItems = async (itemToDelete) => {
    if (!selectedCategory) return;
    confirmAlert(options)
    if (!window.confirm(`¿Eliminar "${itemToDelete}" de ${selectedCategory.title}?`)) return;

    const updatedContent = selectedCategory.content.filter(item => item !== itemToDelete);
    const updatedCategory = { ...selectedCategory, content: updatedContent };

    try {
      await updateCategory(selectedCategory.title, updatedCategory);
      toast.success("Elemento eliminado!");
      fetchCategories();
    } catch (error) {
      toast.error("Error al eliminar elemento.");
    }
  };

  return (
    <div className="category-manager-container">
      <div className="category-sidebar">
        <h3>Categorías</h3>
        <ul className="category-list">
          {categories.map((cat) => (
            <li 
              key={cat.title} 
              className={selectedCategory?.title === cat.title ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="category-details">
        {selectedCategory ? (
          <>
            <div className="details-header">
              <h4>{selectedCategory.title}</h4>
              <span className="item-count">{selectedCategory.content.length} elementos</span>
            </div>
            
            <div className="add-item-row">
              <input 
                type="text" 
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ej: PDA, Agar Nutritivo..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <button onClick={handleAddItem} disabled={!newItem.trim()}>Agregar</button>
            </div>

            <ul className="items-list">
              {selectedCategory.content.map((item, idx) => (
                <li key={idx}>
                  <span>{item}</span>
                  <button 
                    className="btn-delete-item"
                    onClick={(e) => { e.stopPropagation(); handleDeleteItem(item); }}
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {selectedCategory.content.length === 0 && (
                <li className="empty-msg">No hay elementos en esta categoría...</li>
              )}
            </ul>
          </>
        ) : (
          <div className="no-selection">
            <p>Selecciona una categoría para editar sus opciones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFileReader;
