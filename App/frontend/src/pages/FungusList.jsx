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
        }else{
          setFungi(DUMMY_FUNGUS);
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
            Agregar
          </button>
        </div>

        <p className="search-label">
          Buscar por nombre, clase, ubicación, familia, o cualquier atributo. (puedes separar varios términos con punto y coma ";")
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Ej: Pleurotus ostreatus; Agaricomycetes; Alajuela; Agaricaceae"
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
              <th>Nombre</th>
              <th>Género</th>
              <th>Reino</th>
              <th>Clase</th>
              <th>Especie</th>
              <th>Familia</th>
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
                    fungus.Organismo?.Especie,
                    fungus.Organismo?.Orden,
                    fungus.Organismo?.Familia,
                  ].map((v) => v?.toString().toLowerCase() || "");

                  return terms.every((term) =>
                    fieldsToSearch.some((field) =>
                      term.includes(" ") ? field === term : field.includes(term)
                    )
                  );
                })
                .map((fungus, idx) => (
                  <tr key={idx}>
                    <td className="name-cell">{fungus.Organismo?.Especie || "Sin identificación"}</td>
                    <td>{fungus.Organismo?.Genero}</td>
                    <td>{fungus.Organismo?.Reino}</td>
                    <td>{fungus.Organismo?.Clase}</td>
                    <td>{fungus.Organismo?.Especie}</td>
                    <td>{fungus.Organismo?.Familia}</td>
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
