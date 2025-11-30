import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddFungus.css";
import AppModal from "./AppModal";
import { createHongo } from "../api/FungusApi";
import { getAislamientos } from "../api/FungusApi";

const TABS = ["Taxonomía", "Identificación", "Marcadores", "Vinculación"];

const AddHongoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [AislamientosOption, setAislamientosOptions] = useState([]);
  const [prefillModalOpen, setPrefillModalOpen] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdId, setCreatedId] = useState(null);



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
        const data = await getAislamientos(); // [{ idHeredado: "AIS-2024-001" }, ...]
        const options = data.map(c => ({ value: c.idHeredado, label: c.idHeredado }));
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
      idAislamientoExistente: selectedOption?.value || "" // Si escribe manualmente, se actualiza en handleChange
    }));
  };


  const updateNestedState = (obj, path, value) => {
    const newObj = JSON.parse(JSON.stringify(obj));
    const keys = path.split('.');
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name.includes('.')) {
      setFormData(prev => updateNestedState(prev, name, val));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
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
      await createHongo(formData);
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
            <div className="form-section">
              <p className="hint-text" style={{ marginBottom: '20px' }}>
                Ingresa el ID o Código de un aislamiento ya registrado (si no existe, debes crearlo primero y luego regresar aquí).
              </p>

              <div className="form-group">
                <label>ID o Código de Aislamiento Existente</label>
                <input
                  list="aislamientos-list"
                  type="text"
                  name="idAislamiento"
                  value={formData.idAislamiento}
                  onChange={handleChange}
                  placeholder="Ej: COL-2024-001 o ID numérico"
                />

                <datalist id="aislamientos-list">
                  {AislamientosOption.map((c, index) => (
                    <option key={index} value={c.value} />
                  ))}
                </datalist>
              </div>
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
