import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";

const AddFungusMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Nueva Colecta",
      description: "Registrar solamente datos de campo/colecta.",
      path: "/add-colecta",
    },
    {
      title: "Nuevo Aislamiento",
      description: "Registrar un aislamiento a partir de una colecta existente o nueva.",
      path: "/add-aislamiento",
    },
    {
      title: "Registrar Hongo",
      description: "Clasificación taxonómica e identificación de un aislamiento.",
      path: "/add-hongo",
    },
    {
      title: "Agregar Morfología",
      description: "Añadir descripción macro y microscópica a un aislamiento.",
      path: "/add-morfologia",
    },
    {
      title: "Ensayo Biológico",
      description: "Registrar resultados de ensayos biológicos.",
      path: "/add-ensayo",
    },
  ];

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

      {/* MENU GRID */}
      <div className="menu-grid">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className="menu-item"
            onClick={() => navigate(item.path)}
          >
            <h3 className="menu-item-title">{item.title}</h3>
            <p className="menu-item-description">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddFungusMenu;
