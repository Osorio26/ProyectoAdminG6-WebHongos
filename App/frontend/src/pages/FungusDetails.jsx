import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FungusDetails.css";
import { getFungusByCode } from "../api/FungusApi";

const FungusDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [fungus, setFungus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getFungusByCode(code);
        if (isMounted) {
          setFungus(data);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setError("No se pudieron cargar los detalles de la muestra");
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
  }, [code]);

  if (loading) {
    return <p className="fungus-details-loading">Cargando detalles de la muestra...</p>;
  }

  if (error) {
    return <p className="fungus-details-error">{error}</p>;
  }

  if (!fungus) {
    return <p className="fungus-details-error">Muestra no encontrada.</p>;
  }

  return (
    <div className="fungus-details-container">
      <h1>Detalles de Muestra</h1>
      <p className="subtitle">
        Información detallada sobre la muestra seleccionada
      </p>

      <section className="section">
        <h2>Información General</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Número de la Colecta</span>
            <span>{fungus.collectionNumber}</span>
          </div>
          <div className="detail-item">
            <span className="label">Nombre del Colector</span>
            <span>{fungus.collector}</span>
          </div>
          <div className="detail-item">
            <span className="label">Cantidad</span>
            <span>{fungus.quantity}</span>
          </div>
          <div className="detail-item">
            <span className="label">Sitio de la Recolección</span>
            <span>{fungus.location}</span>
          </div>
          <div className="detail-item">
            <span className="label">Código</span>
            <span>{fungus.code}</span>
          </div>
          <div className="detail-item">
            <span className="label">Área protegida</span>
            <span>{fungus.protectedArea}</span>
          </div>
          <div className="detail-item">
            <span className="label">Género</span>
            <span>{fungus.genus}</span>
          </div>
          <div className="detail-item">
            <span className="label">Sitio Exacto</span>
            <span>{fungus.exactSite}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Datos adicionales</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Reino</span>
            <span>{fungus.kingdom}</span>
          </div>
          <div className="detail-item">
            <span className="label">Temperatura</span>
            <span>{fungus.temperature}</span>
          </div>
          <div className="detail-item">
            <span className="label">Clase</span>
            <span>{fungus.class}</span>
          </div>
          <div className="detail-item">
            <span className="label">Especie</span>
            <span>{fungus.species}</span>
          </div>
          <div className="detail-item">
            <span className="label">Orden</span>
            <span>{fungus.order}</span>
          </div>
          <div className="detail-item">
            <span className="label">Familia</span>
            <span>{fungus.family}</span>
          </div>
        </div>
      </section>

      <div className="button-container">
        <button
          className="edit-button"
          onClick={() => navigate(`/editar/${fungus.code}`)}
        >
          Editar Muestra
        </button>
      </div>
    </div>
  );
};

export default FungusDetails;
