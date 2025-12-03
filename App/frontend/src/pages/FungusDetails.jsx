import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FungusDetails.css";
import { getFungusByCode } from "../api/FungusApi";

// Tabs fijos, reordenados para mostrar datos más relevantes primero
const TABS = [
  "Taxonomía e Identificación",
  "Datos de Colecta",
  "Aislamiento y Cultivo",
  "Morfología",
  "Huésped / Planta",
  "Marcadores Moleculares",
  "Ensayos Biológicos",
  "Almacenamiento",
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

  // --------- SECCIONES ---------

  const IDENTIFICACION = [
    { label: "Método", value: fungus.Organismo?.Hongo?.MetodoIdentificacion },
    { label: "Código GenBank", value: fungus.Organismo?.Hongo?.CodigoAccesoGenBank },
    { label: "Responsable", value: fungus.Organismo?.Hongo?.IdentificadorResponsable },
  ];

  const TAXONOMIA = [
    { label: "Reino", value: fungus.Organismo?.Reino },
    { label: "Filo", value: fungus.Organismo?.Filo },
    { label: "Clase", value: fungus.Organismo?.Clase },
    { label: "Orden", value: fungus.Organismo?.Orden },
    { label: "Familia", value: fungus.Organismo?.Familia },
    { label: "Género", value: fungus.Organismo?.Genero },
    { label: "Especie", value: fungus.Organismo?.Especie },
  ];

  const COLECTA = [
    { label: "Código de Colecta", value: fungus.Colecta?.idHeredado },
    { label: "Fecha", value: fungus.Colecta?.Fecha },
    { label: "Colector", value: fungus.Colecta?.Colector },
    { label: "Temperatura (°C)", value: fungus.Colecta?.Temperatura },
    { label: "Humedad (%)", value: fungus.Colecta?.Humedad },
    { label: "pH", value: fungus.Colecta?.pH },

    // Sitio y ubicación
    { label: "Sitio", value: fungus.Colecta?.Sitio?.Nombre },
    { label: "Área Protegida", value: fungus.Colecta?.Sitio?.NombreAreaProtegida },
    { label: "Referencias Adicionales", value: fungus.Colecta?.Sitio?.ReferenciasAdicionales },

    // Coordenadas
    { label: "Latitud", value: fungus.Colecta?.Coordenadas?.Latitud },
    { label: "Longitud", value: fungus.Colecta?.Coordenadas?.Longitud },
    { label: "Altitud", value: fungus.Colecta?.Coordenadas?.Altitud },
    { label: "Tiene Coordenadas", value: fungus.Colecta?.TieneCoordenadas ? "Sí" : "No" },

    // Planta asociada (solo indicador)
    { label: "Contiene Planta", value: fungus.Colecta?.ContienePlanta ? "Sí" : "No" },
  ];

  const AISLAMIENTO = [
    { label: "Código Heredado", value: fungus.idHeredado },
    { label: "Aislado de Planta", value: fungus.AisladoDePlanta ? "Sí" : "No" },
    { label: "Parte de Planta", value: fungus.ParteDePlanta },
    { label: "Fecha de Aislamiento", value: fungus.FechaAislamiento },
    { label: "Fecha de Salida", value: fungus.FechaSalida },
    { label: "Medio de Cultivo", value: fungus.MedioCultivo },
    { label: "Método de Siembra", value: fungus.MetodoSiembra },
    { label: "Análisis Molecular", value: fungus.IdAnalisisMolecular },
    { label: "Estado", value: fungus.Estado },
    { label: "Comentarios", value: fungus.Comentarios },
    { label: "Cantidad Existencias", value: fungus.CantidadExistencias },
    { label: "Está en Colección", value: fungus.EstaEnColeccion ? "Sí" : "No" },
  ];

  const hasMorph =
    Array.isArray(fungus.Morfologias) && fungus.Morfologias.length > 0;

 const MORFOLOGIA = [
  { label: "Forma", value: fungus.Morfologias?.[0]?.Forma },
  { label: "Forma del Borde", value: fungus.Morfologias?.[0]?.FormaBorde },
  { label: "Color Anverso", value: fungus.Morfologias?.[0]?.ColorAnverso },
  { label: "Color Reverso", value: fungus.Morfologias?.[0]?.ColorReverso },
  { label: "Color del Borde", value: fungus.Morfologias?.[0]?.ColorBorde },
  {
    label: "Micelio Aéreo",
    value: fungus.Morfologias?.[0]?.TieneMicelioAereo ? "Sí" : "No",
  },
  {
    label: "Densidad Micelio Aéreo",
    value: fungus.Morfologias?.[0]?.DensidadMicelioAereo,
  },
  {
    label: "Tipo de Crecimiento",
    value: fungus.Morfologias?.[0]?.TipoCrecimiento,
  },
  { label: "Tipo de Hifa", value: fungus.Morfologias?.[0]?.TipoHifa },
  {
    label: "Tiene Secreciones",
    value: fungus.Morfologias?.[0]?.TieneSecreciones ? "Sí" : "No",
  },
  { label: "Observaciones", value: fungus.Morfologias?.[0]?.Observaciones },
];

  const MARCADORES = [
    { label: "Tipo", value: fungus.Organismo?.Hongo?.Marcadores?.[0]?.Tipo },
    {
      label: "Secuencia",
      value: fungus.Organismo?.Hongo?.Marcadores?.[0]?.Secuencia,
    },
  ];

  const ALMACENAMIENTO = [
    { label: "Cantidad", value: fungus.CantidadExistencias },
    { label: "Cantidad en Colección", value: fungus.CantidadExistencias },
    {
      label: "¿Está en Colección?",
      value: fungus.EstaEnColeccion ? "Sí" : "No",
    },
    { label: "Ubicación", value: fungus.Colecta?.Sitio?.NombreAreaProtegida },
  ];

  const PLANTA = [
    { label: "Reino", value: fungus.Colecta?.Planta?.Reino },
    { label: "Filo", value: fungus.Colecta?.Planta?.Filo },
    { label: "Clase", value: fungus.Colecta?.Planta?.Clase },
    { label: "Orden", value: fungus.Colecta?.Planta?.Orden },
    { label: "Familia", value: fungus.Colecta?.Planta?.Familia },
    { label: "Género", value: fungus.Colecta?.Planta?.Genero },
    { label: "Especie", value: fungus.Colecta?.Planta?.Especie },
    { label: "Parte de planta", value: fungus.ParteDePlanta },
    { label: "Aislado de Planta", value: fungus.AisladoDePlanta ? "Sí" : "No" },
    { label: "Observaciones Planta", value: fungus.Colecta?.Planta?.Observaciones },
  ];

  const ENSAYOS =
  fungus.EnsayosBiologicos?.length > 0
    ? fungus.EnsayosBiologicos.map((e) => [
        { label: "Tipo de Ensayo", value: e.Tipo },
        { label: "Resultado", value: e.Resultado },
      ])
    : [
        { label: "Tipo de Ensayo", value: null },
        { label: "Resultado", value: null },
      ];

  const SECTIONS = [
    [...TAXONOMIA, ...IDENTIFICACION],
    COLECTA,
    AISLAMIENTO,
    MORFOLOGIA,
    PLANTA,
    MARCADORES,
    ENSAYOS,
    ALMACENAMIENTO,
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="header-info">
              <h1>
                {fungus.Organismo?.Genero
                  ? `${fungus.Organismo.Genero} ${fungus.Organismo.Especie || "sp."}`
                  : fungus.Organismo?.Especie || "Sin identificación"}
              </h1>
              <p className="subtitle">
                Detalles de la muestra: <strong>{fungus.idHeredado}</strong>
              </p>
            </div>
          </div>

          <button
            className="header-edit-button"
            onClick={() => navigate(`/editar/${fungus.idHeredado}`)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
              className={`sidebar-button ${activeTab === index ? "active" : ""
                }`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="details-content">
          <div className="tab-content">
            <h2 className="section-title">{TABS[activeTab]}</h2>
            {SECTIONS[activeTab].flat().map((item, i) => (
              <div className="detail-row" key={i}>
                <span className="label">{item.label}</span>
                <span className="value">
                  {item.value !== undefined && item.value !== null && item.value !== ""
                    ? item.value
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FungusDetails;
