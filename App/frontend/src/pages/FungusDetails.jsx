import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FungusDetails.css";
import { getFungusByCode } from "../api/FungusApi";

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

const FungusDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [fungus, setFungus] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getFungusByCode(code);
        setFungus(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los detalles de la muestra");
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  if (loading) return <p className="fungus-details-loading">Cargando...</p>;
  if (error) return <p className="fungus-details-error">{error}</p>;
  if (!fungus) return <p>No encontrado.</p>;

  // SECCIONES (igual que antes)
  const TAXONOMIA = [
    { label: "Reino", value: fungus.kingdom },
    { label: "Filo", value: fungus.phylum || fungus.filo },
    { label: "Clase", value: fungus.class },
    { label: "Orden", value: fungus.order },
    { label: "Familia", value: fungus.family },
    { label: "Género", value: fungus.genus },
    { label: "Especie", value: fungus.species },
  ];

  const IDENTIFICACION = [
    { label: "Método", value: fungus.metodoIdentificacion },
    { label: "Código GenBank", value: fungus.codigoGenBank },
    { label: "Responsable", value: fungus.responsable },
  ];

  const COLECTA = [
    { label: "Código de Colecta", value: fungus.collectionNumber },
    { label: "Fecha", value: fungus.fechaColecta },
    { label: "Ubicación Geográfica", value: fungus.location },
    { label: "Colector", value: fungus.collector },
    { label: "Observaciones", value: fungus.exactSite },
  ];

  const AISLAMIENTO = [
    { label: "Medio de Cultivo", value: fungus.medioCultivo },
    { label: "Fecha de Aislamiento", value: fungus.fechaAislamiento },
    { label: "Responsable", value: fungus.responsableAislamiento },
    { label: "Condiciones", value: fungus.temperature },
  ];

  const MORFOLOGIA = [
    { label: "Descripción Macroscópica", value: fungus.descripcionMacro },
    { label: "Descripción Microscópica", value: fungus.descripcionMicro },
    { label: "Color", value: fungus.color },
    { label: "Textura", value: fungus.textura },
    { label: "Notas", value: fungus.notasMorfologia },
  ];

  const MARCADORES = [
    { label: "Tipo", value: fungus.marcadorTipo },
    { label: "Secuencia", value: fungus.secuencia },
  ];

  const ALMACENAMIENTO = [
    { label: "Cantidad", value: fungus.quantity },
    { label: "Ubicación", value: fungus.protectedArea },
  ];

  const PLANTA = [
    { label: "Reino", value: fungus.planta?.reino },
    { label: "Filo", value: fungus.planta?.filo },
    { label: "Clase", value: fungus.planta?.clase },
    { label: "Orden", value: fungus.planta?.orden },
    { label: "Familia", value: fungus.planta?.familia },
    { label: "Género", value: fungus.planta?.genero },
    { label: "Especie", value: fungus.planta?.especie },
    { label: "Observaciones", value: fungus.planta?.observaciones },
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
    <div className="fungus-details-container">
      <div className="fungus-details-window">
        <div className="tabs-container">
          {TABS.map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="details-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Regresar
          </button>

          <h1>{fungus.name}</h1>
          <p className="subtitle">Detalles de la muestra</p>

          <div className="tab-content">
            {SECTIONS[activeTab].map((item, i) => (
              <div className="detail-row" key={i}>
                <span className="label">{item.label}</span>
                <span className="value">{item.value || "—"}</span>
              </div>
            ))}
          </div>

          <div className="button-container">
            <button
              className="edit-button"
              onClick={() => navigate(`/editar/${fungus.code}`)}
            >
              Editar Muestra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FungusDetails;
