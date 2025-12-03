import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from '../components/categoryDropdown/categoryDropdown';
import "./AddFungus.css";
import { createEnsayo } from "../api/FungusApi";
import { getAislamientos } from "../api/FungusApi";

const TABS = ["Datos del Ensayo", "Vinculación"];

const AddEnsayoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [AislamientosOptions, setAislamientosOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");


  const [formData, setFormData] = useState({
    // Vinculación
    idAislamiento: "",

    // Ensayo
    tipoEnsayo: "",
    fechaEnsayo: new Date().toISOString().split("T")[0],
    resultadoEnsayo: ""
  });

  useEffect(() => {
      const fetchAislamientos = async () => {
        try {
          const data = await getAislamientos();
          const options = data
            .filter(c => !c.idHongo) // Solo mostrar aislamientos SIN hongo asociado
            .map(c => ({ 
              value: c.idHeredado, 
              label: c.idHeredado 
            }));
          setAislamientosOptions(options);
        } catch (error) {
          console.error("Error al obtener aislamientos:", error);
        }
      };
      fetchAislamientos();
    }, []);
  
      const handleAislamientoSelect = (selectedOption) => {
        setFormData(prev => ({
          ...prev,
          idAislamiento: selectedOption?.value || "" // Si escribe manualmente, se actualiza en handleChange
        }));
      };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.idAislamiento) {
      alert("Debe vincular el ensayo a un aislamiento");
      return;
    }
    if (!formData.tipoEnsayo) {
      alert("El tipo de ensayo es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        idRelacionado: formData.idAislamiento
      };
      await createEnsayo(payload);
      alert("Ensayo registrado exitosamente");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al registrar el ensayo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-fungus-container">
      {/* HEADER */}
      <div className="details-header-area">
        <div className="header-row">
          <div className="header-left">
            <button className="back-icon-button" onClick={() => navigate(-1)} title="Cancelar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19L5 12L12 5"/></svg>
            </button>
            <div className="header-info">
              <h1>Nuevo Ensayo</h1>
              <p className="subtitle">Registrar prueba biológica</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Ensayo"}</span>
          </button>
        </div>
      </div>

      <div className="add-fungus-window">
        {/* SIDEBAR */}
        <div className="sidebar-nav">
          <h3 className="sidebar-title">Secciones</h3>
          {TABS.map((tab, index) => (
            <button
              key={index}
              className={`sidebar-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="form-content">
          <h2 className="section-title">{TABS[activeTab]}</h2>

          {/* DATOS DEL ENSAYO */}
          {activeTab === 0 && (
            <div className="form-section">
              <div className="form-group">
                <label>Tipo de Ensayo *</label>
                <input
                  type="text"
                  name="tipoEnsayo"
                  value={formData.tipoEnsayo}
                  onChange={handleChange}
                  placeholder="Ej: Antagonismo, Patogenicidad, etc."
                />
              </div>

              <div className="form-group">
                <label>Fecha del Ensayo</label>
                <input
                  type="date"
                  name="fechaEnsayo"
                  value={formData.fechaEnsayo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Resultados</label>
                <textarea
                  name="resultadoEnsayo"
                  value={formData.resultadoEnsayo}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Ej: Inhibición del 50% frente a Fusarium oxysporum..."
                />
              </div>
            </div>
          )}

          {/* VINCULACIÓN */}
          {activeTab === 1 && (
            <div className="form-group">
              <label>Seleccionar Aislamiento Existente</label>

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Buscar por código de aislamiento (Ej: AIS-2024-001)..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #aaa",
                    backgroundColor: "#fafafa",
                    fontSize: "0.95rem",
                  }}
                />

                {searchValue.length > 0 && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      background: "white",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      maxHeight: "180px",
                      overflowY: "auto",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      padding: 0,
                      margin: 0,
                      listStyle: "none"
                    }}
                  >
                    {AislamientosOptions
                      .filter(opt =>
                        opt.label.toLowerCase().includes(searchValue.toLowerCase())
                      )
                      .map((opt, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setSearchValue(opt.label);
                            handleChange({
                              target: { name: "idAislamiento", value: opt.value }
                            });
                          }}
                          style={{
                            padding: "10px 14px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee"
                          }}
                        >
                          {opt.label}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <p className="hint-text">
                Debe seleccionar el aislamiento al que pertenece esta morfología.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEnsayoPage;
