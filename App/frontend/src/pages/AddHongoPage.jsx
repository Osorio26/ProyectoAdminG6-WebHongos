import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddFungus.css";
import AppModal from "./AppModal";
import { createHongo } from "../api/FungusApi";
import CategoryDropdown from "../components/categoryDropdown/categoryDropdown";
import { getAislamientos } from "../api/FungusApi";

const TABS = ["Taxonomía", "Identificación", "Marcadores", "Vinculación"];

const AddHongoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [prefillModalOpen, setPrefillModalOpen] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState("");

  const [formData, setFormData] = useState({
    // Vinculación
    idAislamiento: "", // ID numérico o código

    // Taxonomía (Organismo)
    reino: "",
    filo: "",
    clase: "",
    orden: "",
    familia: "",
    genero: "",
    especie: "",

    // Identificación (Hongo)
    metodoIdentificacion: "",
    codigoAccesoGenBank: "",
    responsableIdentificacion: "",

    // Marcadores
    tieneMarcadores: false,
    marcador: {
      tipoMarcador: "",
      secuenciaTexto: ""
    }
  });

  // Detectar si venimos de crear un aislamiento
  useEffect(() => {
    if (location.state?.prefilledAislamiento) {
      const id = location.state.prefilledAislamiento;

      setFormData(prev => ({
        ...prev,
        idAislamiento: id
      }));

      setPrefillMessage(
        `Se ha cargado automáticamente el código de la colecta recién creada (ID: ${id}).`
      );

      setPrefillModalOpen(true);
    }
  }, [location.state]);


  useEffect(() => {
    const fetchAislamientos = async () => {
      try {
        const data = await getAislamientos(); // [{ idHeredado: "AIS-2024-001", MedioCultivo: "PDA", ... }, ...]
        const options = data
          .filter(c => !c.idHongo)
          .map(c => ({ 
            value: c.idHeredado, 
            label: c.idHeredado 
          }));
        setAislamientosOptions(options);
      } catch (error) {
        console.error("Error al obtener Aislamientos:", error);
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
    const val = type === 'checkbox' ? checked : value;

    if (name.startsWith("marcador.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        marcador: {
          ...prev.marcador,
          [key]: val
        }
      }));
      return; 
    }

    // Normal
    setFormData(prev => ({ ...prev, [name]: val }));
  };


  const handleSubmit = async () => {
    if (!formData.idAislamiento) {
      alert("Debe vincular el hongo a un aislamiento");
      return;
    }
    if (!formData.genero) {
      alert("El género es obligatorio");
      return;
    }
    
    setLoading(true);
    try {
      // Mapear idAislamiento a idRelacionado para el backend
      const payload = {
        ...formData,
        idRelacionado: formData.idAislamiento
      };
      await createHongo(payload);
      alert("Hongo registrado exitosamente");
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Error al registrar el hongo");
    } finally {
      setLoading(false);
    }
  };

  const handleTipoMarcadorSelect = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      marcador: {
        ...prev.marcador,
        tipoMarcador: selectedOption?.value || ""
      }
    }));
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
              <h1>Nuevo Hongo</h1>
              <p className="subtitle">Registrar identificación taxonómica</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Hongo"}</span>
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

          {activeTab === 0 && (
            <div className="form-section">
              <div className="form-group">
                <label>Reino</label>
                <input type="text" name="reino" value={formData.reino} onChange={handleChange} placeholder="Ej: Fungi"/>
              </div>
              <div className="form-group">
                <label>Filo</label>
                <input type="text" name="filo" value={formData.filo} onChange={handleChange} placeholder="Ej: Basidiomycota"/>
              </div>
              <div className="form-group">
                <label>Clase</label>
                <input type="text" name="clase" value={formData.clase} onChange={handleChange} placeholder="Ej: Agaricomycetes"/>
              </div>
              <div className="form-group">
                <label>Orden</label>
                <input type="text" name="orden" value={formData.orden} onChange={handleChange} placeholder="Ej: Agaricales"/>
              </div>
              <div className="form-group">
                <label>Familia</label>
                <input type="text" name="familia" value={formData.familia} onChange={handleChange} placeholder="Ej: Agaricaceae"/>
              </div>
              <div className="form-group">
                <label>Género *</label>
                <input type="text" name="genero" value={formData.genero} onChange={handleChange} placeholder="Ej: Agaricus"/>
              </div>
              <div className="form-group">
                <label>Especie</label>
                <input type="text" name="especie" value={formData.especie} onChange={handleChange} placeholder="Ej: Agaricus campestris"/>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <div className="form-group">
                <label>Método de Identificación</label>
                <input type="text" name="metodoIdentificacion" value={formData.metodoIdentificacion} onChange={handleChange} placeholder="Ej: Morfológico, Molecular" />
              </div>
              <div className="form-group">
                <label>Código Acceso GenBank</label>
                <input type="text" name="codigoAccesoGenBank" value={formData.codigoAccesoGenBank} onChange={handleChange} placeholder="Ej: OR123456"/>
              </div>
              <div className="form-group">
                <label>Responsable Identificación</label>
                <input type="text" name="responsableIdentificacion" value={formData.responsableIdentificacion} onChange={handleChange} placeholder="Ej: Nombre Apellido"/>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="form-section">
              <div className="form-group">
                <label>
                  <input type="checkbox" name="tieneMarcadores" checked={formData.tieneMarcadores} onChange={handleChange} />
                  {' '}¿Tiene Marcadores Moleculares?
                </label>
              </div>
              
              {formData.tieneMarcadores && (
                <div className="nested-form">
                  <div className="form-group">
                    <label>Tipo de Marcador</label>
                    <CategoryDropdown
                      categoryName="tipo de marcador"
                      placeholder_text="Selecciona una opción..."
                      handleOptionSelect={handleTipoMarcadorSelect}
                    />
                  </div>
                  <div className="form-group">
                    <label>Secuencia (Texto)</label>
                    <textarea name="marcador.secuenciaTexto" value={formData.marcador.secuenciaTexto} onChange={handleChange} rows="4" placeholder="Ej: Escriba aquí la secuencia del marcador"/>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 3 && (
            <div className="form-group">
              <label>Seleccionar Aislamiento Existente</label>

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Escribe o selecciona un aislamiento..."
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
      <AppModal
        open={prefillModalOpen}
        title="Aislamiento precargada"
        message={prefillMessage}
        onConfirm={() => setPrefillModalOpen(false)}
        onCancel={() => setPrefillModalOpen(false)}
      />

    </div>
  );
};

export default AddHongoPage;
