import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditFungus.css";
import { getFungusByCode, updateFungus, getColectas } from "../api/FungusApi";

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

const EditFungus = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Listas para dropdowns
  const [colectas, setColectas] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [fungusData, colectasData] = await Promise.all([
          getFungusByCode(code),
          getColectas()
        ]);
        setFormData(fungusData);
        setColectas(colectasData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  // Helper para actualizar estado anidado
  const updateNestedState = (obj, path, value) => {
    const newObj = JSON.parse(JSON.stringify(obj));
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => updateNestedState(prev, name, value));
  };

  const handleSelectChange = (e, fieldKey) => {
    const value = e.target.value;
    
    // Actualizar el valor (FK)
    setFormData(prev => ({ ...prev, [fieldKey]: value }));

    // Lógica específica para actualizar la vista previa si cambiamos la Colecta
    if (fieldKey === 'idColecta') {
      const selectedColecta = colectas.find(c => c.id === parseInt(value));
      if (selectedColecta) {
        setFormData(prev => ({
          ...prev,
          Colecta: { ...prev.Colecta, ...selectedColecta }
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateFungus(code, formData);
      navigate(`/detalle/${code}`);
    } catch (error) {
      console.error("Error updating fungus:", error);
      alert("Error al guardar los cambios");
    }
  };

  const getNestedValue = (obj, path) => {
    if (!obj) return "";
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = obj;
    for (const key of keys) {
      if (current === undefined || current === null) return "";
      current = current[key];
    }
    return current;
  };

  if (loading) return <p>Cargando...</p>;

  // CONFIGURACIÓN DE CAMPOS
  const TAXONOMIA = [
    { label: "Reino", key: "Organismo.Reino" },
    { label: "Filo", key: "Organismo.Filo" },
    { label: "Clase", key: "Organismo.Clase" },
    { label: "Orden", key: "Organismo.Orden" },
    { label: "Familia", key: "Organismo.Familia" },
    { label: "Género", key: "Organismo.Genero" },
    { label: "Especie", key: "Organismo.Especie" },
  ];

  const IDENTIFICACION = [
    { label: "Método", key: "Organismo.Hongo.MetodoIdentificacion" },
    { label: "Código GenBank", key: "Organismo.Hongo.CodigoAccesoGenBank" },
    { label: "Responsable", key: "Organismo.Hongo.IdentificadorResponsable" },
  ];

  const COLECTA = [
    { 
      label: "Código de Colecta (Vincular)", 
      key: "idColecta", 
      type: "select", 
      options: colectas,
      optionLabel: (c) => `${c.idHeredado} - ${c.Colector} (${c.Fecha ? c.Fecha.split('T')[0] : 'S/F'})`,
      optionValue: "id"
    },
    // Campos informativos (se actualizan al cambiar el select)
    { label: "Fecha (YYYY-MM-DD)", key: "Colecta.Fecha", readOnly: true },
    { label: "Colector", key: "Colecta.Colector", readOnly: true },
    // Campos editables de la colecta (si se quiere editar la colecta en sí)
    // Nota: Editar estos campos modificará la colecta para TODOS los aislamientos vinculados
    { label: "Ubicación Geográfica", key: "Colecta.Sitio.Nombre" },
    { label: "Observaciones Sitio", key: "Colecta.Sitio.ReferenciasAdicionales" },
  ];

  const AISLAMIENTO = [
    { label: "Medio de Cultivo", key: "MedioCultivo" },
    { label: "Fecha de Aislamiento", key: "FechaAislamiento" },
    { label: "Responsable (Colector)", key: "Colecta.Colector", readOnly: true },
    { label: "Condiciones (Temp)", key: "Colecta.Temperatura" },
  ];

  const MORFOLOGIA = [
    { label: "Descripción Macroscópica", key: "Morfologias[0].Observaciones" },
    { label: "Color Anverso", key: "Morfologias[0].ColorAnverso" },
    { label: "Forma/Textura", key: "Morfologias[0].Forma" },
    { label: "Notas Generales", key: "Comentarios" },
  ];

  const MARCADORES = [
    { label: "Tipo Marcador", key: "Organismo.Hongo.Marcadores[0].Tipo" },
    { label: "Secuencia", key: "Organismo.Hongo.Marcadores[0].Secuencia" },
  ];

  const ALMACENAMIENTO = [
    { label: "Cantidad Existencias", key: "CantidadExistencias" },
    { label: "Área Protegida", key: "Colecta.Sitio.NombreAreaProtegida" },
  ];

  const PLANTA = [
    { label: "Reino Planta", key: "Colecta.Planta.Reino" },
    { label: "Filo Planta", key: "Colecta.Planta.Filo" },
    { label: "Clase Planta", key: "Colecta.Planta.Clase" },
    { label: "Orden Planta", key: "Colecta.Planta.Orden" },
    { label: "Familia Planta", key: "Colecta.Planta.Familia" },
    { label: "Género Planta", key: "Colecta.Planta.Genero" },
    { label: "Especie Planta", key: "Colecta.Planta.Especie" },
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
                  {item.type === "select" ? (
                    <select
                      name={item.key}
                      value={formData[item.key] || ""}
                      className="edit-input-field"
                      onChange={(e) => handleSelectChange(e, item.key)}
                    >
                      <option value="">Seleccionar...</option>
                      {item.options && item.options.map(opt => (
                        <option key={opt[item.optionValue]} value={opt[item.optionValue]}>
                          {item.optionLabel(opt)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={item.key}
                      value={getNestedValue(formData, item.key) || ""}
                      placeholder={item.readOnly ? "Solo lectura" : "Campo vacío"}
                      className={`edit-input-field ${item.readOnly ? 'readonly' : ''}`}
                      onChange={handleChange}
                      readOnly={item.readOnly}
                    />
                  )}
                  
                  {!item.readOnly && (
                    <span className="edit-icon" title="Campo editable">
                      &#x270F; 
                    </span>
                  )}
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
