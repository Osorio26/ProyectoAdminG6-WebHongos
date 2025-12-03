import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";

const AddFungusMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="add-fungus-container">
      {/* HEADER */}
      <div className="details-header-area">
        <div className="header-row">
          <div className="header-left">
            <button className="back-icon-button" onClick={() => navigate(-1)} title="Volver">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19L5 12L12 5"/></svg>
            </button>
            <div className="header-info">
              <h1>Gestión de Hongos</h1>
              <p className="subtitle">Selecciona el tipo de registro que deseas crear</p>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-sections">
        
        {/* FASE 1: CAMPO */}
        <div className="menu-section">
          <h2>1. Fase de Campo</h2>
          <div className="menu-grid">
            <button className="menu-item" onClick={() => navigate("/add-colecta")}>
              <h3 className="menu-item-title">Nueva Colecta</h3>
              <p className="menu-item-description">Registrar datos de campo, ubicación y hospedero asociado.</p>
            </button>
          </div>
        </div>

        {/* FASE 2: LABORATORIO */}
        <div className="menu-section">
          <h2>2. Fase de Laboratorio</h2>
          <p className="section-hint">Requiere haber registrado una Colecta previamente.</p>
          <div className="menu-grid">
            <button className="menu-item" onClick={() => navigate("/add-aislamiento")}>
              <h3 className="menu-item-title">Nuevo Aislamiento</h3>
              <p className="menu-item-description">Registrar aislamiento en medio de cultivo a partir de una colecta.</p>
            </button>
          </div>
        </div>

        {/* FASE 3: ANÁLISIS */}
        <div className="menu-section">
          <h2>3. Fase de Análisis e Identificación</h2>
          <p className="section-hint">Requiere haber registrado un Aislamiento previamente.</p>
          <div className="menu-grid">
            <button className="menu-item" onClick={() => navigate("/add-hongo")}>
              <h3 className="menu-item-title">Registrar Hongo</h3>
              <p className="menu-item-description">Clasificación taxonómica e identificación molecular.</p>
            </button>
            <button className="menu-item" onClick={() => navigate("/add-morfologia")}>
              <h3 className="menu-item-title">Agregar Morfología</h3>
              <p className="menu-item-description">Descripción macro y microscópica.</p>
            </button>
            <button className="menu-item" onClick={() => navigate("/add-ensayo")}>
              <h3 className="menu-item-title">Ensayo Biológico</h3>
              <p className="menu-item-description">Resultados de pruebas de actividad biológica.</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddFungusMenu;
