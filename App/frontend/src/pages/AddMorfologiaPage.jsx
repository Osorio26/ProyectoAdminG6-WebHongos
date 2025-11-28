import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import { createMorfologia } from "../api/FungusApi";

const TABS = ["Características Generales", "Características Microscópicas", "Vinculación"];

const AddMorfologiaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Vinculación
    idAislamiento: "", // ID numérico o código

    // Morfología
    forma: "",
    formaBorde: "",
    colorAnverso: "",
    colorReverso: "",
    colorBorde: "",
    tipoCrecimiento: "Filamentoso",
    tipoHifa: "",
    tieneMicelioAereo: false,
    densidadMicelioAereo: "",
    tieneSecreciones: false,
    observaciones: ""
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
      alert("Debe vincular la morfología a un aislamiento");
      return;
    }
    
    setLoading(true);
    try {
      await createMorfologia(formData);
      alert("Morfología registrada exitosamente");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al registrar la morfología");
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
              <h1>Nueva Morfología</h1>
              <p className="subtitle">Registrar características morfológicas</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Morfología"}</span>
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
                <label>Forma</label>
                <input type="text" name="forma" value={formData.forma} onChange={handleChange} placeholder="Ej: Circular, Irregular" />
              </div>
              <div className="form-group">
                <label>Forma del Borde</label>
                <input type="text" name="formaBorde" value={formData.formaBorde} onChange={handleChange} placeholder="Ej: Ondulado, Liso" />
              </div>
              <div className="form-group">
                <label>Color Anverso</label>
                <input type="text" name="colorAnverso" value={formData.colorAnverso} onChange={handleChange} placeholder="Ej: Blanco" />
              </div>
              <div className="form-group">
                <label>Color Reverso</label>
                <input type="text" name="colorReverso" value={formData.colorReverso} onChange={handleChange} placeholder="Ej: Amarillo" />
              </div>
              <div className="form-group">
                <label>Color del Borde</label>
                <input type="text" name="colorBorde" value={formData.colorBorde} onChange={handleChange} placeholder="Ej: Rojo" />
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <div className="form-group">
                <label>Tipo de Crecimiento</label>
                <select name="tipoCrecimiento" value={formData.tipoCrecimiento} onChange={handleChange}>
                  <option value="Filamentoso">Filamentoso</option>
                  <option value="Levaduriforme">Levaduriforme</option>
                  <option value="Levaduriforme-filamentoso">Levaduriforme-filamentoso</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo de Hifa</label>
                <input type="text" name="tipoHifa" value={formData.tipoHifa} onChange={handleChange} placeholder="Ej: Hialina, Septada" />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" name="tieneMicelioAereo" checked={formData.tieneMicelioAereo} onChange={handleChange} />
                  {' '}¿Tiene Micelio Aéreo?
                </label>
              </div>
              {formData.tieneMicelioAereo && (
                <div className="form-group">
                  <label>Densidad Micelio Aéreo</label>
                  <input type="text" name="densidadMicelioAereo" value={formData.densidadMicelioAereo} onChange={handleChange} placeholder="Ej: Densa, Escasa" />
                </div>
              )}
              <div className="form-group">
                <label>
                  <input type="checkbox" name="tieneSecreciones" checked={formData.tieneSecreciones} onChange={handleChange} />
                  {' '}¿Tiene Secreciones?
                </label>
              </div>
              <div className="form-group">
                <label>Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" placeholder="Ej: Escriba aquí las observaciones correspondientes"/>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="form-section">
              <div className="form-group">
                <label>ID de Aislamiento *</label>
                <input type="text" name="idAislamiento" value={formData.idAislamiento} onChange={handleChange} placeholder="Ingrese el ID numérico del aislamiento" />
                <p className="hint-text">Debe ingresar el ID del aislamiento al que pertenece esta morfología.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMorfologiaPage;
