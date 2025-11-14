import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FungusList.css";
import { getFungi } from "../api/FungusApi";

const FungusList = () => {
  const navigate = useNavigate();
  const [fungi, setFungi] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getFungi();
        if (isMounted) {
          setFungi(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
          setError("No se pudo cargar el inventario de hongos");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
          placeholder="Buscar por código, nombre o género"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Cargando inventario...</p>}
      {error && !loading && <p className="error-message">{error}</p>}

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
          {!loading &&
            !error &&
            fungi
              .filter((fungus) => {
                if (!search.trim()) return true;
                const term = search.toLowerCase();
                return (
                  fungus.code?.toLowerCase().includes(term) ||
                  fungus.name?.toLowerCase().includes(term) ||
                  fungus.genus?.toLowerCase().includes(term)
                );
              })
              .map((fungus, idx) => (
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
