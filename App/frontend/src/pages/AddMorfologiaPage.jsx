import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import CategoryDropdown from '../components/categoryDropdown/categoryDropdown';
import ReusableBackButton from "../components/ReusableBackButton";

const MorfologiaForm = ({ morfologiaData, handleChange, handleSelectChange }) => (
    <div className="sub-form-section" style={{ border: '1px dashed #7cb342', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
        <h4 style={{marginTop: '0'}}>Detalles de Morfología</h4>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>

          <div className="form-group">
            <label><strong>ID del Aislamiento a Ensayar</strong></label>
            <input 
              type="text" 
              name="idRelacionado" 
              placeholder="Ej: AIS-2024-001" 
              value={morfologiaData.idRelacionado} 
              onChange={handleChange}
              required
            />
          </div>
            
            <div className="form-group">
                <label>Forma</label>
                <input type="text" name="forma" placeholder="Ej: Circular, irregular, etc" value={morfologiaData.forma} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Forma del Borde</label>
                  <input type="text" name="formaBorde" placeholder="Ej: Ondulado" value={morfologiaData.formaBorde} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Color Anverso</label>
                <input type="text" name="colorAnverso" placeholder="Ej: Blanco cremoso" value={morfologiaData.colorAnverso} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>Color Reverso</label>
                <input type="text" name="colorReverso" placeholder="Ej: Amarillo pálido" value={morfologiaData.colorReverso} onChange={handleChange}/>
            </div>
            
            <div className="form-group">
                <label>Color del Borde</label>
                <input type="text" name="colorBorde" placeholder="Ej: Rojo tenue" value={morfologiaData.colorBorde} onChange={handleChange}/>
            </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px'}}>
            <div className="form-group">
                <label>Tipo de Crecimiento</label>
                <select name="tipoCrecimiento" value={morfologiaData.tipoCrecimiento} onChange={handleChange}>
                    <option value="Filamentoso">Filamentoso</option>
                    <option value="Levaduriforme">Levaduriforme</option>
                    <option value="Levaduriforme-filamentoso">Levaduriforme-filamentoso</option>
                </select>
            </div>
            <div className="form-group">
                <label>Tipo de Hifa</label>
                <input type="text" name="tipoHifa" placeholder="Ej: Hialina, Septada" value={morfologiaData.tipoHifa} onChange={handleChange}/>
            </div>
        </div>
        
        <div className="row-group" style={{display: 'flex', gap: '25px', marginTop: '15px', marginBottom: '15px', padding: '10px', borderTop: '1px dotted #ccc'}}>
             <label className="checkbox-label">
              <input
                type="checkbox"
                name="tieneMicelioAereo"
                checked={morfologiaData.tieneMicelioAereo}
                onChange={handleChange}
              />
              <span className="custom-checkbox"></span>
                ¿Tiene micelio aéreo?
            </label>
            { morfologiaData.tieneMicelioAereo && (
              <span style={{alignSelf: 'center', fontStyle: 'italic', color: '#555'}}>
                <div className="form-group">
                <label>Densidad Micelio Aéreo</label>
                <input type="text" name="densidadMicelioAereo" placeholder="Ej: Densa, Escasa" value={morfologiaData.densidadMicelioAereo} onChange={handleChange}/>
            </div>
              </span>
            )}
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tieneSecreciones"
                checked={morfologiaData.tieneSecreciones}
                onChange={handleChange}
              />
              <span className="custom-checkbox"></span>
                ¿Tiene secreciones?
            </label>
        </div>
        
        <div className="form-group">
            <label>Observaciones Morfológicas</label>
            <textarea name="observaciones" placeholder="Detalles de coloración, textura, pigmentos o reacciones." value={morfologiaData.observaciones} onChange={handleChange} rows="2"/>
        </div>

    </div>
);

const AddMorfologiaPage = () => {
  const navigate = useNavigate();

  const [morfologiaData, setMorfologiaData] = useState({
        forma: "",
        formaBorde: "",
        colorAnverso: "",
        colorReverso: "",
        colorBorde: "",
        tieneMicelioAereo: false,
        densidadMicelioAereo: "",
        tipoCrecimiento: "Filamentoso", 
        tipoHifa: "",
        tieneSecreciones: false,
        observaciones: "",
  });

  // Maneja los selectores basados en CategoryDropdown
  const handleSelectChange = (field) => (selectedOption) => {
    setMorfologiaData(prevData => ({
      ...prevData,
      [field]: selectedOption ? selectedOption.value : '',
    }));
  };
  
  // Maneja los inputs de texto, textarea y checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setMorfologiaData(prevData => ({ 
      ...prevData, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
        morfologia: morfologiaData,
    };
    
    console.log("Enviando Datos de Morfología:", dataToSend);

    try {
      // Lógica de envío simplificada (simular API)
      // await api.post('/morfologias/registro', dataToSend.morfologia);

      alert("Morfología registrada exitosamente.");
      navigate("/inventario"); 
    } catch (error) {
      console.error(error);
      alert("Error al guardar la morfología.");
    }
  };

  // Renderizado del componente principal
  return (
    <div className="addfungus-container">
      <div className="header-section">
        <div>
          <ReusableBackButton />
        </div>
          <h1>Registro de Morfología</h1>
        </div>

      <form onSubmit={handleSubmit} className="fungus-form flow-container">
        
        <div className="info-box" style={{ backgroundColor: '#e0f7fa', borderLeft: '4px solid #2f9b00' }}>
          Completa todos los campos para el registro de la Morfología Colonial.
        </div>
        
        <MorfologiaForm 
          morfologiaData={morfologiaData} 
          handleChange={handleChange} 
          handleSelectChange={handleSelectChange} 
        />

        
        {/* Botón Submit */}
        <div className="button-container" style={{marginTop: '30px'}}>
          <button type="submit" className="submit-button" style={{background: '#2f9b00'}}>
            Guardar Morfología
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddMorfologiaPage;