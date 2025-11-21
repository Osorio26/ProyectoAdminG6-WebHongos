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
      <div className="edit-fungus-window">
        
        {/* === PESTAÑAS === */}
        <div className="edit-tabs-container">
          {TABS.map((tab, index) => (
            <button
              key={index}
              className={`edit-tab-button ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

       <button className="edit-back-button pill" onClick={() => navigate(-1)}>
          <span className="arrow">←</span>
          <span>Regresar</span>
        </button>


        <h1 className="edit-title">Editar: {formData.name}</h1>
        <p className="edit-subtitle">Modifica los datos de esta muestra</p>

        {/* === CONTENIDO EDITABLE === */}
        <div className="edit-tab-content">
          {SECTIONS[activeTab].map((item, i) => (
            <div className="edit-row" key={i}>
              <span className="edit-label">{item.label}</span>
              
              {/* === CAMBIO CLAVE: Nuevo contenedor para el input y el icono === */}
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

        <div className="edit-button-container">
          <button className="save-button" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFungus;