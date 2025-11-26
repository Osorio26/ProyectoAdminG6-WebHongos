import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import { createEnsayo } from "../api/FungusApi";

const TABS = ["Datos del Ensayo", "Vinculación"];

const AddEnsayoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Vinculación
    idAislamiento: "", // ID numérico o código

    // Ensayo
    tipoEnsayo: "",
    fechaEnsayo: new Date().toISOString().split("T")[0],
    resultadoEnsayo: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.idAislamiento) {
      alert("Debe vincular el ensayo a un aislamiento");
      return;
    }
    if (!formData.tipoEnsayo) {
      alert("El tipo de ensayo es obligatorio");
      return;
    }
    
    setLoading(true);
    try {
      await createEnsayo(formData);
      alert("Ensayo registrado exitosamente");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al registrar el ensayo");
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
              <h1>Nuevo Ensayo</h1>
              <p className="subtitle">Registrar prueba biológica</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Ensayo"}</span>
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
                <label>Tipo de Ensayo *</label>
                <input type="text" name="tipoEnsayo" value={formData.tipoEnsayo} onChange={handleChange} placeholder="Ej: Antagonismo, Crecimiento" />
              </div>
              <div className="form-group">
                <label>Fecha del Ensayo</label>
                <input type="date" name="fechaEnsayo" value={formData.fechaEnsayo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Resultados</label>
                <textarea name="resultadoEnsayo" value={formData.resultadoEnsayo} onChange={handleChange} rows="5" placeholder="Describa los resultados observados..." />
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <div className="form-group">
                <label>ID de Aislamiento *</label>
                <input type="text" name="idAislamiento" value={formData.idAislamiento} onChange={handleChange} placeholder="Ingrese el ID numérico del aislamiento" />
                <p className="hint-text">Debe ingresar el ID del aislamiento evaluado.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEnsayoPage;
