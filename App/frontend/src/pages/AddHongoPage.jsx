import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css"; // Mismos estilos
import CategoryDropdown from '../components/categoryDropdown/categoryDropdown'; 
import ReusableBackButton from "../components/ReusableBackButton";

const AddHongoPage = () => {
  const navigate = useNavigate();

  // Estado que incluye Taxonomía, Hongos y objeto anidado para Marcadores
  const [formData, setFormData] = useState({
    // 1. Vinculación y Taxonomía (Organismos)
    idRelacionado: "", // ID de la Colecta o Aislamiento
    
    // Taxonomía (Tipo fijo: Hongo)
    tipo: "Hongo",
    reino: "Fungi", 
    filo: "", 
    clase: "", 
    orden: "", 
    familia: "", 
    genero: "", 
    especie: "",
    
    // 2. Identificación (Hongos)
    metodoIdentificacion: "", 
    codigoAccesoGenBank: "", 
    responsableIdentificacion: "",
    
    // 3. Marcadores (Control y anidado)
    tieneMarcadores: false,
    marcador: {
        tipoMarcador: "", // Tipo VARCHAR(50) NOT NULL
        secuenciaTexto: "", // Secuencia TEXT
    }
  });

  const handleTipoMarcadorSelect = (selectedOption) => {
    setFormData(prevData => ({
      ...prevData,
      marcador: {
        ...prevData.marcador,
        tipoMarcador: selectedOption ? selectedOption.value : '',
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Manejo de campos anidados (Marcadores)
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: type === 'checkbox' ? checked : value,
            },
        }));
    } else {
        // Campos principales
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'tieneMarcadores' && !checked ? { marcador: { tipoMarcador: "", secuenciaTexto: "" } } : {}),
        }));
    }
  };

  // Función para actualizar datos si vienen del CategoryFileReader
  const handleExternalDataLoad = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idRelacionado) {
      alert("Es necesario vincular esta clasificación a un Código de Colecta o Aislamiento.");
      return;
    }

    if (!formData.genero) {
      alert("Al menos el Género es requerido para la clasificación.");
      return;
    }

    // Estructura de datos a enviar
    const dataToSend = {
        // Taxonomía (Organismos)
        tipo: formData.tipo,
        reino: formData.reino,
        filo: formData.filo,
        clase: formData.clase,
        orden: formData.orden,
        familia: formData.familia,
        genero: formData.genero,
        especie: formData.especie,
        
        // Identificación (Hongos)
        idRelacionado: formData.idRelacionado,
        metodoIdentificacion: formData.metodoIdentificacion,
        codigoAccesoGenBank: formData.codigoAccesoGenBank,
        responsableIdentificacion: formData.responsableIdentificacion,
        
        // Marcadores (si aplica)
        tieneMarcadores: formData.tieneMarcadores,
        ...(formData.tieneMarcadores ? { marcador: formData.marcador } : {}),
    };

    console.log("Enviando Clasificación Taxonómica:", dataToSend);

    try {
      // El backend deberá:
      // 1. Crear el registro en 'Organismos' para obtener el IdOrganismo (PK, FK en Hongos).
      // 2. Crear el registro en 'Hongos' usando el IdOrganismo.
      // 3. Si tiene Marcadores, crear el registro en 'Marcadores' usando el IdHongo (PK de Hongos).

      alert("Clasificación registrada exitosamente.");
      navigate("/inventario"); 
    } catch (error) {
      console.error(error);
      alert("Error al guardar la clasificación.");
    }
  };

  // --- Subcomponente Marcadores ---
  const MarcadoresForm = ({ formData, handleOptionSelect }) => (
    <div className="sub-form-section" style={{ border: '1px dashed #ef6c00', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
        <h4 style={{marginTop: '0'}}>Detalles del Marcador Genético</h4>

        <div className="form-group">
            <label>Tipo de Marcador</label>
            <CategoryDropdown
              categoryName="tipo de marcador"
              placeholder_text="Seleccione un tipo"
              handleOptionSelect={handleOptionSelect}
              value={
                formData.marcador.tipoMarcador 
                ? { value: formData.marcador.tipoMarcador, label: formData.marcador.tipoMarcador } 
                : null
              }
            />
        </div>
        
        <div className="form-group">
            <label>Secuencia Genética (TEXT)</label>
            <textarea
                name="marcador.secuenciaTexto"
                placeholder="Pegue la secuencia aquí."
                value={formData.marcador.secuenciaTexto}
                onChange={handleChange}
                rows="6"
            />
        </div>
    </div>
  );


  // Renderizado del componente principal
  return (
    <div className="addfungus-container">
      <div className="header-section">
        <div>
          <ReusableBackButton />
        </div>
        <h1>Clasificación e Identificación de Hongo</h1>
      </div>

      <form onSubmit={handleSubmit} className="fungus-form flow-container">
        
        {/* Contexto */}
        <div className="info-box" style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2f9b00' }}>
          Asigna un nombre científico y datos genéticos a una muestra existente.
        </div>

        <h2>1. Vinculación</h2>
        <div className="form-group">
          <label><strong>Vincular a (ID Colecta / Aislamiento)</strong></label>
          <input 
            type="text" 
            name="idRelacionado" 
            placeholder="Buscar código existente (Ej: COL-005, AIS-002)..." 
            value={formData.idRelacionado} 
            onChange={handleChange}
            required
          />
          <small style={{color: '#666', marginTop:'4px', display:'block'}}>
            Identificador de la muestra de campo o el aislamiento de laboratorio.
          </small>
        </div>

        <hr style={{margin: '25px 0', border: '0', borderTop: '1px solid #eee'}}/>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h2>2. Taxonomía (Hongo)</h2>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div className="form-group">
                <label>Filo (Phylum)</label>
                <input type="text" name="filo" placeholder="Ej: Basidiomycota" value={formData.filo} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Clase</label>
                <input type="text" name="clase" placeholder="Ej: Agaricomycetes" value={formData.clase} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Orden</label>
                <input type="text" name="orden" placeholder="Ej: Agaricales" value={formData.orden} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Familia</label>
                <input type="text" name="familia" placeholder="Ej: Pleurotaceae" value={formData.familia} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Género</label>
                <input type="text" name="genero" placeholder="Ej: Pleurotus" value={formData.genero} onChange={handleChange} required style={{fontWeight: 'bold'}}/>
            </div>
            <div className="form-group">
                <label>Especie (Epíteto específico)</label>
                <input 
                    type="text" 
                    name="especie" 
                    placeholder="Ej: ostreatus"
                    value={formData.especie} 
                    onChange={handleChange} 
                    style={{fontStyle: 'italic'}}
                />
            </div>
        </div>

        <hr style={{margin: '25px 0', border: '0', borderTop: '1px solid #eee'}}/>

        <h2>3. Identificación Molecular</h2>        
        <div className="form-group">
          <label>Método de Identificación</label>
          <input 
            type="text" 
            name="metodoIdentificacion" 
            placeholder="Ej: Secuenciación ITS, Morfología comparada..."
            value={formData.metodoIdentificacion} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Código GenBank / Accession No. (`CodigoAccesoGenBank`)</label>
          <input 
            type="text" 
            name="codigoAccesoGenBank" 
            placeholder="Ej: MK123456 (VARCHAR(30))"
            value={formData.codigoAccesoGenBank} 
            onChange={handleChange}
            style={{letterSpacing: '1px', fontFamily: 'monospace'}}
          />
        </div>

        <div className="form-group">
          <label>Responsable de Identificación (`IdentificadorResponsable`)</label>
          <input 
            type="text" 
            name="responsableIdentificacion" 
            placeholder="Nombre completo del responsable"
            value={formData.responsableIdentificacion} 
            onChange={handleChange}
          />
        </div>

        <hr style={{margin: '25px 0', border: '0', borderTop: '1px solid #eee'}}/>
        
        <h2>4. Secuencias Genéticas</h2>
        <div className="form-group" style={{ marginTop: '10px', marginBottom: '15px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tieneMarcadores"
                checked={formData.tieneMarcadores}
                onChange={handleChange}
              />
              <span className="custom-checkbox"></span>
                ¿Quiere agregar marcadores genéticos para este hongo?
            </label>
        </div>
        
        {formData.tieneMarcadores && (
          <MarcadoresForm 
            formData={formData} 
            handleOptionSelect={handleTipoMarcadorSelect} 
          />
        )}


        {/* Botón Submit */}
        <div className="button-container">
          <button type="submit" className="submit-button" style={{background: '#2f9b00'}}>
            Guardar Clasificación
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddHongoPage;