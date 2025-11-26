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
    { label: "Reino", value: fungus.Organismo?.Reino },
    { label: "Filo", value: fungus.Organismo?.Filo },
    { label: "Clase", value: fungus.Organismo?.Clase },
    { label: "Orden", value: fungus.Organismo?.Orden },
    { label: "Familia", value: fungus.Organismo?.Familia },
    { label: "Género", value: fungus.Organismo?.Genero },
    { label: "Especie", value: fungus.Organismo?.Especie },
  ];

  const IDENTIFICACION = [
    { label: "Método", value: fungus.Organismo?.Hongo?.MetodoIdentificacion },
    { label: "Código GenBank", value: fungus.Organismo?.Hongo?.CodigoAccesoGenBank },
    { label: "Responsable", value: fungus.Organismo?.Hongo?.IdentificadorResponsable },
  ];

  const COLECTA = [
    { label: "Código de Colecta", value: fungus.Colecta?.idHeredado },
    { label: "Fecha", value: fungus.Colecta?.Fecha },
    { label: "Ubicación Geográfica", value: fungus.Colecta?.Sitio?.Nombre },
    { label: "Colector", value: fungus.Colecta?.Colector },
    { label: "Observaciones", value: fungus.Colecta?.Sitio?.ReferenciasAdicionales },
  ];

  const AISLAMIENTO = [
    { label: "Medio de Cultivo", value: fungus.MedioCultivo },
    { label: "Fecha de Aislamiento", value: fungus.FechaAislamiento },
    { label: "Responsable", value: fungus.Colecta?.Colector }, // Asumiendo mismo responsable si no hay campo específico
    { label: "Condiciones", value: fungus.Colecta?.Temperatura ? `${fungus.Colecta.Temperatura} °C` : "N/A" },
  ];

  const MORFOLOGIA = [
    { label: "Descripción Macroscópica", value: fungus.Morfologias?.[0]?.Observaciones },
    { label: "Descripción Microscópica", value: "N/A" }, // No hay campo directo en el modelo actual
    { label: "Color", value: fungus.Morfologias?.[0]?.ColorAnverso },
    { label: "Textura", value: fungus.Morfologias?.[0]?.Forma },
    { label: "Notas", value: fungus.Comentarios },
  ];

  const MARCADORES = [
    { label: "Tipo", value: fungus.Organismo?.Hongo?.Marcadores?.[0]?.Tipo },
    { label: "Secuencia", value: fungus.Organismo?.Hongo?.Marcadores?.[0]?.Secuencia },
  ];

  const ALMACENAMIENTO = [
    { label: "Cantidad", value: fungus.CantidadExistencias },
    { label: "Ubicación", value: fungus.Colecta?.Sitio?.NombreAreaProtegida },
  ];

  const PLANTA = [
    { label: "Reino", value: fungus.Colecta?.Planta?.Reino },
    { label: "Filo", value: fungus.Colecta?.Planta?.Filo },
    { label: "Clase", value: fungus.Colecta?.Planta?.Clase },
    { label: "Orden", value: fungus.Colecta?.Planta?.Orden },
    { label: "Familia", value: fungus.Colecta?.Planta?.Familia },
    { label: "Género", value: fungus.Colecta?.Planta?.Genero },
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
        <div className="tabs-wrapper"> 
          <span className="scroll-indicator left-indicator"></span> {/* Indicador Izquierdo */}
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
          <span className="scroll-indicator right-indicator"></span> {/* Indicador Derecho */}
        </div>
        
        <div className="details-content">
          <button className="edit-back-button pill" onClick={() => navigate(-1)}>
            <span className="arrow">←</span>
            <span>Regresar</span>
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
