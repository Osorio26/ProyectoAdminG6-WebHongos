import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddFungus.css";
import { createAislamiento } from "../api/FungusApi";

const TABS = ["Datos del Aislamiento", "Colecta Asociada"];

const AddAislamientoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

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
  });

  // Detectar si venimos de crear una colecta
  useEffect(() => {
    if (location.state?.prefilledColecta) {
      setFormData(prev => ({
        ...prev,
        idColectaExistente: location.state.prefilledColecta
      }));
      // Cambiar a la pestaña de colecta para mostrar que ya está seleccionada (opcional)
      // setActiveTab(1); 
      alert("Se ha pre-seleccionado la colecta recién creada (ID: " + location.state.prefilledColecta + "). Complete los datos del aislamiento.");
    }
  }, [location.state]);

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
      const payload = { ...formData };
      const response = await createAislamiento(payload);
      
      // Preguntar si desea continuar al siguiente paso
      const continuar = window.confirm(
        "Aislamiento creado exitosamente.\n\n¿Desea registrar los datos taxonómicos (Hongo) para este aislamiento ahora?"
      );

      if (continuar) {
        navigate("/add-hongo", { 
          state: { prefilledAislamiento: response.idHeredado } // Usamos idHeredado porque es lo que pide el form de Hongo
        });
      } else {
        navigate("/inventario");
      }

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
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} placeholder="Ej: Activo, Contaminado" />
              </div>
              <div className="form-group">
                <label>Comentarios</label>
                <textarea name="comentarios" value={formData.comentarios} onChange={handleChange} rows="3" />
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <p className="hint-text" style={{marginBottom: '20px'}}>
                Ingrese el ID o Código de una colecta ya registrada.
              </p>

              <div className="form-group">
                <label>ID o Código de Colecta Existente</label>
                <input 
                  type="text" 
                  name="idColectaExistente" 
                  value={formData.idColectaExistente} 
                  onChange={handleChange} 
                  placeholder="Ej: COL-2024-001 o ID numérico"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAislamientoPage;
