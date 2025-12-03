import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import AppModal from "./AppModal";
import { createColecta } from "../api/FungusApi";

const TABS = ["Datos Generales", "Ubicación", "Huésped Asociado"];

const AddColectaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  /** 
  const [modalWarningOpen, setModalWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingNavigation, setPendingNavigation] = useState(null);
  */

  const [formData, setFormData] = useState({
    codigoColecta: "",
    fechaColecta: new Date().toISOString().split("T")[0],
    colector: "",
    temperatura: "",
    humedad: "",
    ph: "",
    
    // Ubicación
    coordenadas: { latitud: "", longitud: "", altitud: "" },
    sitio: { nombre: "", esAreaProtegida: false, nombreAreaProtegida: "", referenciasAdicionales: "" },
    
    // Planta
    organismo: { reino: "", filo: "", clase: "", orden: "", familia: "", genero: "", especie: "" }
  });

  // Helper para actualizar estado anidado
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
    if (!formData.codigoColecta) {
      alert("El código de colecta es obligatorio");
      return;
    }
    
    setLoading(true);
    try {
      const response = await createColecta(formData);

      setCreatedId(response.id); 
      setModalOpen(true);      

    } catch (error) {
      console.error(error);
      alert("Error al crear la colecta");
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
              <h1>Nueva Colecta</h1>
              <p className="subtitle">Registrar datos de campo</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Colecta"}</span>
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
                <label>Código de Colecta *</label>
                <input type="text" name="codigoColecta" value={formData.codigoColecta} onChange={handleChange} placeholder="Ej: COL-2024-001 (Código único de colecta)" />
              </div>
              <div className="form-group">
                <label>Fecha de Colecta</label>
                <input type="date" name="fechaColecta" value={formData.fechaColecta} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Colector Responsable</label>
                <input type="text" name="colector" value={formData.colector} onChange={handleChange} placeholder="Ej: Juan Pérez, María Rodríguez" />
              </div>
              <div className="form-group">
                <label>Temperatura (°C)</label>
                <input type="number" step="0.1" name="temperatura" value={formData.temperatura} onChange={handleChange} placeholder="Ej: 24.5 (°C)" />
              </div>
              <div className="form-group">
                <label>Humedad (%)</label>
                <input type="number" step="0.1" name="humedad" value={formData.humedad} onChange={handleChange} placeholder="Ej: 80 (%)" />
              </div>
              <div className="form-group">
                <label>pH</label>
                <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="Ej: 6.5" />
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <h3>Sitio</h3>
              <div className="form-group">
                <label>Nombre del Sitio</label>
                <input type="text" name="sitio.nombre" value={formData.sitio.nombre} onChange={handleChange} placeholder="Ej: Sendero Los Quetzales, Finca La Selva" />
              </div>
              <div className="form-group">
                <label className="checkbox-label-flex">
                  <input type="checkbox" name="sitio.esAreaProtegida" checked={formData.sitio.esAreaProtegida} onChange={handleChange} className="edit-checkbox" />
                  ¿Es Área Protegida?
                </label>
              </div>
              {formData.sitio.esAreaProtegida && (
                <div className="form-group">
                  <label>Nombre Área Protegida</label>
                  <input type="text" name="sitio.nombreAreaProtegida" value={formData.sitio.nombreAreaProtegida} onChange={handleChange} placeholder="Ej: Parque Nacional Tapantí"/>
                </div>
              )}
              <div className="form-group">
                <label>Referencias Adicionales</label>
                <textarea name="sitio.referenciasAdicionales" value={formData.sitio.referenciasAdicionales} onChange={handleChange} rows="3" placeholder="Ej: Bosque secundario, cerca del río, bajo sombra..." />
              </div>

              <h3>Coordenadas</h3>
              <div className="form-group">
                <label>Latitud</label>
                <input type="number" step="any" name="coordenadas.latitud" value={formData.coordenadas.latitud} onChange={handleChange} placeholder="Ej: 10.852340"/>
              </div>
              <div className="form-group">
                <label>Longitud</label>
                <input type="number" step="any" name="coordenadas.longitud" value={formData.coordenadas.longitud} onChange={handleChange} placeholder="Ej: -85.300125"/>
              </div>
              <div className="form-group">
                <label>Altitud (msnm)</label>
                <input type="number" name="coordenadas.altitud" value={formData.coordenadas.altitud} onChange={handleChange} placeholder="Ej: 1200 (msnm)"/>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="form-section">
              <p className="hint-text">Si la muestra fue colectada sobre un huésped, ingrese los datos aquí.</p>
              <div className="form-group">
                <label>Reino</label>
                <input type="text" name="organismo.reino" value={formData.organismo.reino} onChange={handleChange} placeholder="Ej: Plantae" />
              </div>
              <div className="form-group">
                <label>Filo</label>
                <input type="text" name="organismo.filo" value={formData.organismo.filo} onChange={handleChange} placeholder="Ej: Tracheophyta"/>
              </div>
              <div className="form-group">
                <label>Clase</label>
                <input type="text" name="organismo.clase" value={formData.organismo.clase} onChange={handleChange} placeholder="Ej: Magnoliopsida"/>
              </div>
              <div className="form-group">
                <label>Orden</label>
                <input type="text" name="organismo.orden" value={formData.organismo.orden} onChange={handleChange} placeholder="Ej: Fabales"/>
              </div>
              <div className="form-group">
                <label>Familia</label>
                <input type="text" name="organismo.familia" value={formData.organismo.familia} onChange={handleChange} placeholder="Ej: Fabaceae"/>
              </div>
              <div className="form-group">
                <label>Género</label>
                <input type="text" name="organismo.genero" value={formData.organismo.genero} onChange={handleChange} placeholder="Ej: Inga"/>
              </div>
              <div className="form-group">
                <label>Especie</label>
                <input type="text" name="organismo.especie" value={formData.organismo.especie} onChange={handleChange} placeholder="Ej: Inga edulis"/>
              </div>
            </div>
          )}
        </div>
      </div>
        <AppModal
            open={modalOpen}
            title="Colecta creada"
            message="La colecta se registró exitosamente. ¿Desea registrar un Aislamiento ahora?"
            onConfirm={() => {
              setModalOpen(false);

              const manualCode = formData.codigoColecta?.trim();

              if (manualCode) {
                // Usuario ya tenía código escrito → usar ese
                navigate("/add-aislamiento", {
                  state: { prefilledColecta: manualCode }
                });
              } else {
                // No había código → usar ID creado, pero advertir al usuario primero
                setWarningMessage(
                  `El código de la colecta generada es: ${createdId}.\n\n` +
                  `Por favor cópielo, ya que no podrá verse nuevamente en el futuro.`
                );
                setPendingNavigation(createdId);
                setModalWarningOpen(true);
              }
            }}
            onCancel={() => {
              setModalOpen(false);
              navigate("/inventario");
            }}
          />
    </div>
  );
};

export default AddColectaPage;
