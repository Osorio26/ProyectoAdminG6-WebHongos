import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditFungus.css";
import { getFungusByCode, updateFungus } from "../api/FungusApi";

// ... TABS, EditFungus component, useEffect, handleSave, TABS, SECTIONS definitions remain the same ...

const TABS = [
  "Clasificación Taxonómica",
  "Identificación",
  "Colecta",
  "Aislamiento",
  "Morfología",
  "Marcadores Moleculares",
  "Almacenamiento",
  "Asociación con Planta",
];
// ... (omito las constantes como TAXONOMIA, IDENTIFICACION, etc., por brevedad) ...

const EditFungus = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getFungusByCode(code);
      setFormData(data);
      setLoading(false);
    })();
  }, [code]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await updateFungus(code, formData);
    navigate(`/detalle/${code}`);
  };

  if (loading) return <p>Cargando...</p>;

  const TAXONOMIA = [
    { label: "Reino", key: "kingdom" },
    { label: "Filo", key: "phylum" },
    { label: "Clase", key: "class" },
    { label: "Orden", key: "order" },
    { label: "Familia", key: "family" },
    { label: "Género", key: "genus" },
    { label: "Especie", key: "species" },
  ];

  const IDENTIFICACION = [
    { label: "Método", key: "metodoIdentificacion" },
    { label: "Código GenBank", key: "codigoGenBank" },
    { label: "Responsable", key: "responsable" },
  ];

  const COLECTA = [
    { label: "Código de Colecta", key: "collectionNumber" },
    { label: "Fecha", key: "fechaColecta" },
    { label: "Ubicación Geográfica", key: "location" },
    { label: "Colector", key: "collector" },
    { label: "Observaciones", key: "exactSite" },
  ];

  const AISLAMIENTO = [
    { label: "Medio de Cultivo", key: "medioCultivo" },
    { label: "Fecha de Aislamiento", key: "fechaAislamiento" },
    { label: "Responsable", key: "responsableAislamiento" },
    { label: "Condiciones", key: "temperature" },
  ];

  const MORFOLOGIA = [
    { label: "Descripción Macroscópica", key: "descripcionMacro" },
    { label: "Descripción Microscópica", key: "descripcionMicro" },
    { label: "Color", key: "color" },
    { label: "Textura", key: "textura" },
    { label: "Notas", key: "notasMorfologia" },
  ];

  const MARCADORES = [
    { label: "Tipo", key: "marcadorTipo" },
    { label: "Secuencia", key: "secuencia" },
  ];

  const ALMACENAMIENTO = [
    { label: "Cantidad", key: "quantity" },
    { label: "Ubicación", key: "protectedArea" },
  ];

  const PLANTA = [
    { label: "Reino", key: "planta_reino" },
    { label: "Filo", key: "planta_filo" },
    { label: "Clase", key: "planta_clase" },
    { label: "Orden", key: "planta_orden" },
    { label: "Familia", key: "planta_familia" },
    { label: "Género", key: "planta_genero" },
    { label: "Especie", key: "planta_especie" },
    { label: "Observaciones", key: "planta_observaciones" },
  ];

  const SECTIONS = [
    TAXONOMIA,
    IDENTIFICACION,
    COLECTA,
    AISLAMIENTO,
    MORFOLOGIA,
    MARCADORES,
    ALMACENAMIENTO,
    PLANTA,
  ];

  return (
    <div className="edit-fungus-container">
      {/* === HEADER AREA === */}
      <div className="details-header-area">
        <div className="header-row">
          <div className="header-left">
            <button 
              className="back-icon-button" 
              onClick={() => navigate(-1)}
              title="Cancelar edición"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="header-info">
              <h1>Editar: {formData.Organismo?.Especie || "Sin identificación"}</h1>
              <p className="subtitle">Editando muestra: <strong>{formData.idHeredado}</strong></p>
            </div>
          </div>

          <button className="header-save-button" onClick={handleSave}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V20C20 20.5523 19.5523 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      <div className="edit-fungus-window">
        
        {/* === SIDEBAR NAVIGATION === */}
        <div className="sidebar-nav">
          <h3 className="sidebar-title">Secciones</h3>
          {TABS.map((tab, index) => (
            <button
              key={index}
              className={`sidebar-button ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === CONTENIDO EDITABLE === */}
        <div className="details-content">
          <h2 className="section-title">{TABS[activeTab]}</h2>
          <div className="edit-tab-content">
            {SECTIONS[activeTab].map((item, i) => (
              <div className="edit-row" key={i}>
                <span className="edit-label">{item.label}</span>
                
                <div className="edit-input-wrapper">
                  <input
                    type="text"
                    name={item.key}
                    value={formData[item.key] || ""}
                    placeholder={formData[item.key] || "Campo vacío"}
                    className="edit-input-field"
                    onChange={handleChange}
                  />
                  <span className="edit-icon" title="Campo editable">
                    &#x270F; 
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFungus;