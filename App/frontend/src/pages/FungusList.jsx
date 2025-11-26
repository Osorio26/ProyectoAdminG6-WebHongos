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
      <div className="fungus-window">

        <div className="fungus-header">
          <h1>Inventario de Hongos</h1>
          <button
            className="add-button"
            onClick={() => navigate("/add-menu")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Agregar</span>
          </button>
        </div>

        <p className="search-label">
          Buscar por código heredado, nombre, ubicación, familia, o cualquier atributo. (puedes separar varios términos con punto y coma ";")
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Ej: BD-2022523226; Agaricales; Cartago"
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
              <th>Especie</th>
              <th>Género</th>
              <th>Familia</th>
              <th>Ubicación</th>
              <th>Fecha Colecta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              !error &&
              fungi
                .filter((fungus) => {
                  if (!search.trim()) return true;

                  // Permitir múltiples términos separados por punto y coma
                  const terms = search
                    .split(";")
                    .map((t) => t.trim().toLowerCase())
                    .filter(Boolean);

                  if (terms.length === 0) return true;

                  const fieldsToSearch = [
                    fungus.idHeredado,
                    fungus.Organismo?.Especie,
                    fungus.CantidadExistencias,
                    fungus.Colecta?.Colector,
                    fungus.Colecta?.idHeredado,
                    fungus.Colecta?.Sitio?.Nombre,
                    fungus.Colecta?.Sitio?.NombreAreaProtegida,
                    fungus.Colecta?.Sitio?.ReferenciasAdicionales,
                    fungus.Organismo?.Genero,
                    fungus.Organismo?.Reino,
                    fungus.Colecta?.Temperatura,
                    fungus.Organismo?.Clase,
                    fungus.Organismo?.Orden,
                    fungus.Organismo?.Familia,
                    fungus.Colecta?.Fecha ? new Date(fungus.Colecta.Fecha).toLocaleDateString() : "",
                  ].map((v) => v?.toString().toLowerCase() || "");

                  return terms.every((term) =>
                    fieldsToSearch.some((field) =>
                      term.includes(" ") ? field === term : field.includes(term)
                    )
                  );
                })
                .map((fungus, idx) => (
                  <tr key={idx}>
                    <td className="code-cell"><strong>{fungus.idHeredado}</strong></td>
                    <td className="name-cell"><i>{fungus.Organismo?.Especie || "Sin identificación"}</i></td>
                    <td><i>{fungus.Organismo?.Genero}</i></td>
                    <td>{fungus.Organismo?.Familia}</td>
                    <td>{fungus.Colecta?.Sitio?.Nombre || "N/A"}</td>
                    <td>{fungus.Colecta?.Fecha ? new Date(fungus.Colecta.Fecha).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => navigate(`/detalle/${fungus.idHeredado}`)}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

export default FungusList;
