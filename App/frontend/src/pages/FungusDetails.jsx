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
  "Asociación con el huésped",
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
    { label: "Código Heredado", value: fungus.idHeredado },
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
      <div className="details-header-area">
        <div className="header-row">
          <div className="header-left">
            <button 
              className="back-icon-button" 
              onClick={() => navigate(-1)}
              title="Regresar al inventario"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="header-info">
              <h1>{fungus.Organismo?.Especie || "Sin identificación"}</h1>
              <p className="subtitle">Detalles de la muestra: <strong>{fungus.idHeredado}</strong></p>
            </div>
          </div>

          <button
            className="header-edit-button"
            onClick={() => navigate(`/editar/${fungus.idHeredado}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Editar</span>
          </button>
        </div>
      </div>

      <div className="fungus-details-window">
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
        
        <div className="details-content">
          <div className="tab-content">
            <h2 className="section-title">{TABS[activeTab]}</h2>
            {SECTIONS[activeTab].map((item, i) => (
              <div className="detail-row" key={i}>
                <span className="label">{item.label}</span>
                <span className="value">{item.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FungusDetails;
