import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import { createAislamiento } from "../api/FungusApi";

const TABS = ["Datos del Aislamiento", "Colecta Asociada"];

const AddAislamientoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isNewColecta, setIsNewColecta] = useState(false);

  const [formData, setFormData] = useState({
    // Aislamiento
    idHeredado: "",
    aisladoDePlanta: false,
    parteDePlanta: "",
    fechaAislamiento: new Date().toISOString().split("T")[0],
    fechaSalida: "",
    tipoCrecimiento: "",
    medioCultivo: "",
    metodoSiembra: "",
    estado: "",
    comentarios: "",
    enColeccion: true,

    // Colecta
    idColectaExistente: "", // ID numérico si se conoce, o código
    
    // Nueva Colecta (si isNewColecta es true)
    codigoColecta: "",
    fechaColecta: new Date().toISOString().split("T")[0],
    colector: "",
    
    // Ubicación (Nueva Colecta)
    coordenadas: { latitud: "", longitud: "", altitud: "" },
    sitio: { nombre: "", esAreaProtegida: false, nombreAreaProtegida: "", referenciasAdicionales: "" },
    
    // Planta (Nueva Colecta)
    organismo: { reino: "", filo: "", clase: "", orden: "", familia: "", genero: "", especie: "" }
  });

  const updateNestedState = (obj, path, value) => {
    const newObj = JSON.parse(JSON.stringify(obj));
    const keys = path.split('.');
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name.includes('.')) {
      setFormData(prev => updateNestedState(prev, name, val));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.idHeredado) {
      alert("El código de aislamiento es obligatorio");
      return;
    }
    
    setLoading(true);
    try {
      const payload = { ...formData, isNewColecta };
      await createAislamiento(payload);
      alert("Aislamiento creado exitosamente");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al crear el aislamiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-fungus-container">
      {/* HEADER */}
      <div className="details-header-area">
        <div className="header-row">
          <div className="header-left">
            <button className="back-icon-button" onClick={() => navigate(-1)} title="Cancelar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19L5 12L12 5"/></svg>
            </button>
            <div className="header-info">
              <h1>Nuevo Aislamiento</h1>
              <p className="subtitle">Registrar aislamiento en laboratorio</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Aislamiento"}</span>
          </button>
        </div>
      </div>

      <div className="add-fungus-window">
        {/* SIDEBAR */}
        <div className="sidebar-nav">
          <h3 className="sidebar-title">Secciones</h3>
          {TABS.map((tab, index) => (
            <button
              key={index}
              className={`sidebar-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="form-content">
          <h2 className="section-title">{TABS[activeTab]}</h2>

          {activeTab === 0 && (
            <div className="form-section">
              <div className="form-group">
                <label>Código de Aislamiento *</label>
                <input type="text" name="idHeredado" value={formData.idHeredado} onChange={handleChange} placeholder="Ej: AIS-2024-001" />
              </div>
              <div className="form-group">
                <label>Fecha de Aislamiento</label>
                <input type="date" name="fechaAislamiento" value={formData.fechaAislamiento} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" name="aisladoDePlanta" checked={formData.aisladoDePlanta} onChange={handleChange} />
                  {' '}¿Aislado de Planta?
                </label>
              </div>
              {formData.aisladoDePlanta && (
                <div className="form-group">
                  <label>Parte de la Planta</label>
                  <input type="text" name="parteDePlanta" value={formData.parteDePlanta} onChange={handleChange} placeholder="Ej: Hoja, Raíz" />
                </div>
              )}
              <div className="form-group">
                <label>Medio de Cultivo</label>
                <input type="text" name="medioCultivo" value={formData.medioCultivo} onChange={handleChange} placeholder="Ej: PDA" />
              </div>
              <div className="form-group">
                <label>Método de Siembra</label>
                <input type="text" name="metodoSiembra" value={formData.metodoSiembra} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} placeholder="Ej: Activo, Guardado" />
              </div>
              <div className="form-group">
                <label>Comentarios</label>
                <textarea name="comentarios" value={formData.comentarios} onChange={handleChange} rows="3" />
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <div className="form-group">
                <label className="toggle-label">
                  <input type="checkbox" checked={isNewColecta} onChange={(e) => setIsNewColecta(e.target.checked)} />
                  {' '}Crear Nueva Colecta
                </label>
              </div>

              {!isNewColecta ? (
                <div className="form-group">
                  <label>ID de Colecta Existente</label>
                  <input type="text" name="idColectaExistente" value={formData.idColectaExistente} onChange={handleChange} placeholder="Ingrese el ID numérico de la colecta" />
                  <p className="hint-text">Debe ingresar el ID de la colecta previamente registrada.</p>
                </div>
              ) : (
                <div className="nested-form">
                  <h3>Datos de la Nueva Colecta</h3>
                  <div className="form-group">
                    <label>Código de Colecta</label>
                    <input type="text" name="codigoColecta" value={formData.codigoColecta} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Fecha</label>
                    <input type="date" name="fechaColecta" value={formData.fechaColecta} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Colector</label>
                    <input type="text" name="colector" value={formData.colector} onChange={handleChange} />
                  </div>
                  
                  <h4>Sitio</h4>
                  <div className="form-group">
                    <label>Nombre Sitio</label>
                    <input type="text" name="sitio.nombre" value={formData.sitio.nombre} onChange={handleChange} />
                  </div>
                  
                  <h4>Coordenadas</h4>
                  <div className="form-group">
                    <label>Latitud</label>
                    <input type="number" name="coordenadas.latitud" value={formData.coordenadas.latitud} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Longitud</label>
                    <input type="number" name="coordenadas.longitud" value={formData.coordenadas.longitud} onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAislamientoPage;
