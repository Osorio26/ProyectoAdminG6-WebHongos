import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import ReusableExitButtom from "../components/ReusableExitButtom";

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
      description: "Registrar un aislamiento.",
      path: "/add-aislamiento",
    },
    {
      title: "Registrar Hongo",
      description: "Clasificación taxonómica e identificación.",
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
    <div className="addfungus-container">

      <div className="header-section" style={{ justifyContent: "center" }}>
       <div>
          <ReusableExitButtom/>
        </div>
        <h1 className="menu-title">Gestión de Hongos</h1>
      </div>

      <p className="menu-subtitle">
        Selecciona el tipo de registro que deseas crear o actualizar.
      </p>

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
