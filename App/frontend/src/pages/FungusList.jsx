import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FungusList.css";
import { getFungi } from "../api/FungusApi";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const FungusList = () => {
  const navigate = useNavigate();
  const [fungi, setFungi] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 150;

  // ORDENAMIENTO
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

  // ---- FILTRADO ----
  const filteredFungi = fungi.filter((fungus) => {
    if (!search.trim()) return true;

    const terms = search
      .split(";")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

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
      fungus.Colecta?.Fecha
        ? new Date(fungus.Colecta.Fecha).toLocaleDateString()
        : "",
    ].map((v) => v?.toString().toLowerCase() || "");

    return terms.every((term) =>
      fieldsToSearch.some((field) =>
        term.includes(" ") ? field === term : field.includes(term)
      )
    );
  });

  // ---- ORDENAMIENTO ----
  const sortedFungi = React.useMemo(() => {
    let sortableItems = [...filteredFungi];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        // Helper to get nested properties safely
        const getNestedValue = (obj, path) => {
          return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
        };

        aValue = getNestedValue(a, sortConfig.key);
        bValue = getNestedValue(b, sortConfig.key);

        // Handle dates specifically if needed, or just string comparison
        if (sortConfig.key === 'Colecta.Fecha') {
            aValue = aValue ? new Date(aValue).getTime() : 0;
            bValue = bValue ? new Date(bValue).getTime() : 0;
        } else if (sortConfig.key === 'Identificacion') {
            // Custom sort for combined Genus + Species
            const getIdent = (obj) => (obj.Organismo?.Genero || '') + ' ' + (obj.Organismo?.Especie || '');
            aValue = getIdent(a).toLowerCase();
            bValue = getIdent(b).toLowerCase();
        } else {
             // Handle nulls/undefined
            aValue = aValue ? aValue.toString().toLowerCase() : "";
            bValue = bValue ? bValue.toString().toLowerCase() : "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredFungi, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // ---- PAGINACIÓN ----
  const totalPages = Math.ceil(sortedFungi.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedFungi.slice(indexOfFirst, indexOfLast);

  const changePage = (num) => setCurrentPage(num);

  // --- PAGINACIÓN INTELIGENTE (máx 7 botones visibles) ---
  const getVisiblePageRange = () => {
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      return { start: 1, end: totalPages };
    }

    let start = currentPage - Math.floor(maxButtons / 2);
    let end = currentPage + Math.floor(maxButtons / 2);

    if (start < 1) {
      start = 1;
      end = maxButtons;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxButtons + 1;
    }

    return { start, end };
  };

  const { start, end } = getVisiblePageRange();

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
            placeholder="Buscar por código, especie, ubicación... Ej: Fusarium; Cartago; BD-2023"
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset paginación al buscar
            }}
          />
        </div>

        {loading && <LoadingSpinner text="Cargando inventario..." />}
        {error && !loading && <p className="error-message">{error}</p>}

        <table className="fungus-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('idHeredado')} className={sortConfig.key === 'idHeredado' ? sortConfig.direction : ''}>
                Código {sortConfig.key === 'idHeredado' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('Identificacion')} className={sortConfig.key === 'Identificacion' ? sortConfig.direction : ''}>
                Identificación {sortConfig.key === 'Identificacion' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('Colecta.Colector')} className={sortConfig.key === 'Colecta.Colector' ? sortConfig.direction : ''}>
                Colector {sortConfig.key === 'Colecta.Colector' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('Colecta.Sitio.Nombre')} className={sortConfig.key === 'Colecta.Sitio.Nombre' ? sortConfig.direction : ''}>
                Ubicación {sortConfig.key === 'Colecta.Sitio.Nombre' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('Colecta.Fecha')} className={sortConfig.key === 'Colecta.Fecha' ? sortConfig.direction : ''}>
                Fecha Colecta {sortConfig.key === 'Colecta.Fecha' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((fungus, idx) => (
              <tr key={idx}>
                <td className="code-cell"><strong>{fungus.idHeredado}</strong></td>
                <td className="name-cell">
                  <i>{fungus.Organismo?.Genero} {fungus.Organismo?.Especie || "sp."}</i>
                </td>
                <td>{fungus.Colecta?.Colector || "N/A"}</td>
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

        {/* ---- CONTROLES DE PAGINACIÓN ---- */}
        <div className="pagination">
          {/* Primero */}
          <button disabled={currentPage === 1} onClick={() => changePage(1)}>
            «
          </button>

          {/* Anterior */}
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
            ‹
          </button>

          {/* Punto suspensivo izquierdo */}
          {start > 1 && <span className="dots">...</span>}

          {/* Botones visibles */}
          {Array.from({ length: end - start + 1 }, (_, i) => {
            const page = start + i;
            return (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            );
          })}

          {/* Punto suspensivo derecho */}
          {end < totalPages && <span className="dots">...</span>}

          {/* Siguiente */}
          <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
            ›
          </button>

          {/* Última */}
          <button disabled={currentPage === totalPages} onClick={() => changePage(totalPages)}>
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default FungusList;
