import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css"; 
import CategoryDropdown from '../components/categoryDropdown/categoryDropdown';
import ReusableBackButton from "../components/ReusableBackButton";

const AddColectaPage = () => {
  const navigate = useNavigate();

  // Estado exclusivo para Ensayo Biológico
  const [formData, setFormData] = useState({
    idRelacionado: "", 
    tipoEnsayo: "",
    fechaEnsayo: new Date().toISOString().split('T')[0],
    resultadoEnsayo: "",
  });
  const handleTipoEnsayoSelect = (selectedOption) => {
    // selectedOption es: { value: '...', label: '...' } o null
    const newValue = selectedOption ? selectedOption.value : '';
    setFormData(prevData => ({
      ...prevData,
      tipoEnsayo: newValue, // Guarda solo el valor (la cadena)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idRelacionado) {
      alert("Debes especificar el ID del aislamiento evaluado.");
      return;
    }

    console.log("Enviando Datos de Ensayo:", formData);

    try {
      // AQUÍ: Petición al backend
      // await api.post('/ensayos', formData);

      alert("Ensayo biológico registrado correctamente.");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el ensayo.");
    }
  };

  return (
    <div className="addfungus-container">
      <div className="header-section">
        <div>
          <ReusableBackButton />
        </div>
        <h1>Ensayo Biológico</h1>
      </div>

      <form onSubmit={handleSubmit} className="fungus-form flow-container">
        
        {/* Contexto */}
        <div className="info-box" style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #2f9b00' }}>
          Registro de pruebas de bioactividad o crecimiento.
        </div>

        <div className="form-group">
          <label><strong>ID del Aislamiento a Ensayar</strong></label>
          <input 
            type="text" 
            name="idRelacionado" 
            placeholder="Ej: AIS-2024-001" 
            value={formData.idRelacionado} 
            onChange={handleChange}
            required
          />
        </div>

        <hr style={{margin: '20px 0', border: '0', borderTop: '1px solid #eee'}}/>
       
        <h2>Datos del Experimento</h2>        
        <div className="form-group">
          <label>Tipo de Ensayo</label>
            <CategoryDropdown
              // La categoría solicitada
              categoryName="tipo de ensayo" 
              placeholder_text="Seleccione el tipo de ensayo biológico"
              handleOptionSelect={handleTipoEnsayoSelect} 
              // Prop para controlar el valor seleccionado
              value={
                formData.tipoEnsayo 
                ? { value: formData.tipoEnsayo, label: formData.tipoEnsayo } 
                : null
              }
            />
        </div>

        <h2>Resultados y Observaciones</h2>
        <div className="form-group">
          <label>Descripción de Resultados</label>
          <textarea 
            name="resultadoEnsayo" 
            placeholder="Describe lo observado: porcentaje de inhibición, halo de crecimiento, cambio de color, etc."
            value={formData.resultadoEnsayo} 
            onChange={handleChange} 
            rows="5"
          />
        </div>

        {/* Botón Submit */}
        <div className="button-container">
          <button type="submit" className="submit-button" style={{background: '#2f9b00'}}>
            Registrar Ensayo
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddColectaPage;