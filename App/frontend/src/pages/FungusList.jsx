import React from "react";
import { useNavigate } from "react-router-dom";
import "./FungusList.css";

const FungusList = () => {
  const navigate = useNavigate();

  const fungi = [
    { code: "GC-2022510226", name: "Pleurotus ostreatus", quantity: "150 lbs" },
    { code: "BD-2022523226", name: "Lentinula edodes", quantity: "200 lbs" },
    { code: "AA-2022510286", name: "Hericium erinaceus", quantity: "100 lbs" },
    { code: "GC-2022510225", name: "Ganoderma lucidum", quantity: "50 lbs" },
    { code: "BR-202258293", name: "Inonotus obliquus", quantity: "75 lbs" },
  ];

  return (
    <div className="fungus-container">
      <div className="fungus-header">
        <h1>Inventario de Hongos</h1>
        <button
          className="add-button"
          onClick={() => navigate("/agregar")}
        >
          Agregar
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por tipo o nombre"
          className="search-input"
        />
      </div>

      <table className="fungus-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fungi.map((fungus, idx) => (
            <tr key={idx}>
              <td>{fungus.code}</td>
              <td className="name-cell">{fungus.name}</td>
              <td>{fungus.quantity}</td>
              <td>
                 <button
                  className="details-button"
                  onClick={() => navigate(`/detalle/${fungus.code}`)}
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FungusList;
