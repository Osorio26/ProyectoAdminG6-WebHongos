import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css"; // Estilos
import ReusableBackButton from "../components/ReusableBackButton";

const CoordenadasForm = ({ formData, handleChange }) => (
    <div className="sub-form-section" style={{ border: '1px dashed #4caf50', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
        <h4 style={{marginTop: '0'}}>Datos de Coordenadas</h4>
        <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Latitud</label>
                <input type="number" step="any" name="coordenadas.latitud" placeholder="Ej: 9.928069" value={formData.coordenadas.latitud} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Longitud</label>
                <input type="number" step="any" name="coordenadas.longitud" placeholder="Ej: -84.090726" value={formData.coordenadas.longitud} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Altitud (metros)</label>
                <input type="number" name="coordenadas.altitud" placeholder="Ej: 1100" value={formData.coordenadas.altitud} onChange={handleChange}/>
            </div>
        </div>
    </div>
);

const SitioForm = ({ formData, handleChange }) => (
    <div className="sub-form-section" style={{ border: '1px dashed #795548', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
        <h4 style={{marginTop: '0'}}>Detalles del Sitio de Colecta</h4>
        <div className="form-group">
            <label>Nombre del Sitio</label>
            <input type="text" name="sitio.nombre" placeholder="Ej: Sendero del Árbol Gigante" value={formData.sitio.nombre} onChange={handleChange}/>
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sitio.esAreaProtegida"
                checked={formData.sitio.esAreaProtegida}
                onChange={handleChange}
              />
            <span className="custom-checkbox"></span>
              ¿Es Área Protegida?
          </label>
        </div>

        {formData.sitio.esAreaProtegida && (
            <div className="form-group">
                <label>Nombre del Área Protegida</label>
                <input type="text" name="sitio.nombreAreaProtegida" placeholder="Ej: Parque Nacional" value={formData.sitio.nombreAreaProtegida} onChange={handleChange}/>
            </div>
        )}
        <div className="form-group">
            <label>Referencias Adicionales del Sitio</label>
            <textarea name="sitio.referenciasAdicionales" placeholder="Instrucciones para llegar, detalles geográficos relevantes, etc." value={formData.sitio.referenciasAdicionales} onChange={handleChange} rows="2"/>
        </div>
    </div>
);

const OrganismoForm = ({ formData, handleChange }) => (
    <div className="sub-form-section" style={{ border: '1px dashed #42a5f5', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
        <h4 style={{marginTop: '0'}}>Datos de Clasificación del Organismo (Planta)</h4>
        
        <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Reino</label>
                <input type="text" name="organismo.reino" placeholder="Ej: Plantae" value={formData.organismo.reino} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Filo</label>
                <input type="text" name="organismo.filo" placeholder="Ej: Magnoliophyta" value={formData.organismo.filo} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Clase</label>
                <input type="text" name="organismo.clase" placeholder="Ej: Magnoliopsida" value={formData.organismo.clase} onChange={handleChange}/>
            </div>
        </div>
        
        <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Orden</label>
                <input type="text" name="organismo.orden" placeholder="Ej: Fagales" value={formData.organismo.orden} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Familia</label>
                <input type="text" name="organismo.familia" placeholder="Ej: Fagaceae" value={formData.organismo.familia} onChange={handleChange}/>
            </div>
        </div>
        
        <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Género</label>
                <input type="text" name="organismo.genero" placeholder="Ej: Quercus" value={formData.organismo.genero} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Especie</label>
                <input type="text" name="organismo.especie" placeholder="Ej: Quercus robur" value={formData.organismo.especie} onChange={handleChange}/>
            </div>
        </div>
    </div>
);

const AddColectaPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Colectas Fields
    idHeredado: "", 
    colector: "",
    fecha: new Date().toISOString().split('T')[0],
    temperatura: "",
    humedad: "",
    ph: "",
    observacionesTexto: "", 

    // Booleans para control de subformularios
    tieneCoordenadas: false, 
    registrarSitio: true, 
    contienePlanta: false, // Controla subformulario de Organismo

    // Coordenadas Fields (anidado)
    coordenadas: {
      latitud: "",
      longitud: "",
      altitud: "",
    },

    // Sitios Fields (anidado)
    sitio: {
      nombre: "",
      esAreaProtegida: false,
      nombreAreaProtegida: "",
      referenciasAdicionales: "",
    },
    
    // Organismos Fields (anidado - Asumimos Tipo="Planta")
    organismo: {
        tipo: "Planta", // Tipo quemado
        reino: "", 
        filo: "", 
        clase: "", 
        orden: "", 
        familia: "", 
        genero: "", 
        especie: "",
    }
  });

  // Función handleChange (se mantiene igual, ya maneja la anidación correctamente)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Función para manejar campos anidados (Sitio, Coordenadas, Organismo)
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
            // Opcional: Resetear datos anidados al desactivar el toggle (buena práctica)
            ...(name === 'tieneCoordenadas' && !checked ? { coordenadas: { latitud: "", longitud: "", altitud: "" } } : {}),
            ...(name === 'registrarSitio' && !checked ? { sitio: { nombre: "", esAreaProtegida: false, nombreAreaProtegida: "", referenciasAdicionales: "" } } : {}),
            // Resetear organismo si se desactiva
            ...(name === 'contienePlanta' && !checked ? { organismo: { tipo: "Planta", reino: "", filo: "", clase: "", orden: "", familia: "", genero: "", especie: "" } } : {}),
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      idHeredado: formData.idHeredado,
      colector: formData.colector,
      fecha: formData.fecha,
      temperatura: formData.temperatura ? parseFloat(formData.temperatura) : null,
      humedad: formData.humedad ? parseFloat(formData.humedad) : null,
      ph: formData.ph ? parseFloat(formData.ph) : null,
      observacionesTexto: formData.observacionesTexto,
      
      tieneCoordenadas: formData.tieneCoordenadas,
      ...(formData.tieneCoordenadas ? { coordenadas: formData.coordenadas } : {}),

      registrarSitio: formData.registrarSitio,
      ...(formData.registrarSitio ? { sitio: formData.sitio } : {}),
      
      contienePlanta: formData.contienePlanta,
      ...(formData.contienePlanta ? { organismo: formData.organismo } : {}),
    };

    console.log("Enviando Datos de Campo:", dataToSend);

    try {
      // await api.post('/colectas', dataToSend);
      alert("Colecta de campo registrada correctamente.");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la colecta.");
    }
  };
 
  return (
    <div className="addfungus-container">
      <div className="header-section">
        <div>
          <ReusableBackButton />
        </div>
        <h1>Registro Detallado de Colecta</h1>
      </div>

      <form onSubmit={handleSubmit} className="fungus-form flow-container">

        {/* Contexto */}
        <div className="info-box" style={{ backgroundColor: '#f9fbe7', borderLeft: '4px solid #2f9b00' }}>
          Ingrese los datos de campo registrados para la muestra.
        </div>
        
        {/* --- 1. Identificación y Logística --- */}
        <h2>1. Identificación y Logística</h2>
        <div className="form-group">
          <label><strong>Código de Colecta (ID Único)</strong></label>
          <input
            type="text"
            name="idHeredado"
            placeholder="Ej: COL-2024-Amazonas-05"
            value={formData.idHeredado}
            onChange={handleChange}
          />
        </div>

        <div className="row-group" style={{display: 'flex', gap: '15px'}}>
            <div className="form-group" style={{flex: 1}}>
                <label>Colector</label>
                <input type="text" name="colector" placeholder="Nombre del responsable" value={formData.colector} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{flex: 1}}>
                <label>Fecha de Colecta</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange}/>
            </div>
        </div>
        
        <hr style={{margin: '20px 0', border: 'none', borderBottom: '1px solid #ccc'}}/>

        {/* --- 2. Condiciones Ambientales --- */}
        <h2>2. Condiciones Ambientales</h2>
        <div className="row-group" style={{display: 'flex', gap: '15px'}}>
            <div className="form-group" style={{flex: 1}}>
                <label>Temperatura (°C)</label>
                <input type="number" step="0.01" name="temperatura" placeholder="Ej: 25.50" value={formData.temperatura} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{flex: 1}}>
                <label>Humedad (%)</label>
                <input type="number" step="0.01" name="humedad" placeholder="Ej: 80.50" value={formData.humedad} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{flex: 1}}>
                <label>pH</label>
                <input type="number" step="0.01" name="ph" placeholder="Ej: 6.85" value={formData.ph} onChange={handleChange}/>
            </div>
        </div>
        
        <hr style={{margin: '20px 0', border: 'none', borderBottom: '1px solid #ccc'}}/>

        {/* --- 3. Localización y Taxonomía --- */}
        <h2>3. Localización y Taxonomía</h2>
        
        {/* Toggle Sitio */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="checkbox-label">
            <input
              type="checkbox"
              name="registrarSitio"
              checked={formData.registrarSitio}
              onChange={handleChange}
            />
            <span className="custom-checkbox"></span>
              ¿Deseas registrar el sitio de colecta?
          </label>
        </div>

        {/* Formulario de Sitio */}
        <div className={`expandable-section ${formData.registrarSitio ? "show" : ""}`}>
          <SitioForm formData={formData} handleChange={handleChange} />
        </div>

        {/* Toggle Coordenadas */}
        <div className="form-group" style={{ marginTop: '20px', marginBottom: '15px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tieneCoordenadas"
                checked={formData.tieneCoordenadas}
                onChange={handleChange}
              />
              <span className="custom-checkbox"></span>
                ¿Tienes las coordenadas GPS de la colecta?
          </label>
        </div>

        {/* Formulario de Coordenadas */}
        <div className={`expandable-section ${formData.tieneCoordenadas ? "show" : ""}`}>
          <CoordenadasForm formData={formData} handleChange={handleChange} />
        </div>

        {/* Toggle Organismo/Planta */}
        <div className="form-group" style={{ marginTop: '20px'}}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="contienePlanta"
                checked={formData.contienePlanta}
                onChange={handleChange}
              />
              <span className="custom-checkbox"></span>
                ¿Colecta referencia una planta? (Hospedero o sustrato)
          </label>
        </div>
        
        {/* Formulario de Organismo */}
        <div className={`expandable-section ${formData.contienePlanta ? "show" : ""}`}>
          <OrganismoForm formData={formData} handleChange={handleChange} />
        </div>  
        
        <hr style={{margin: '20px 0', border: 'none', borderBottom: '1px solid #ccc'}}/>
        <h2>4. Observaciones</h2>
        <div className="form-group">
          <label>Observaciones de Campo</label>
          <textarea
            name="observacionesTexto"
            placeholder="Detalles sobre el sustrato, comportamiento en el sitio, notas adicionales."
            value={formData.observacionesTexto}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* Botón Submit */}
        <div className="button-container">
          <button type="submit" className="submit-button" style={{background: '#2f9b00'}}>
            Guardar Colecta
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddColectaPage;