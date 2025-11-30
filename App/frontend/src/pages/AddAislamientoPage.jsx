import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddFungus.css";
import AppModal from "./AppModal";
import CategoryDropdown from '../components/categoryDropdown/categoryDropdown';
import { createAislamiento } from "../api/FungusApi";
import { getColectas } from "../api/FungusApi"; 

const TABS = ["Datos del Aislamiento", "Colecta Asociada"];

const AddAislamientoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [colectasOptions, setColectasOptions] = useState([]);
  const [modalInfoMessage, setModalInfoMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const [formData, setFormData] = useState({
    // Aislamiento
    idHeredado: "",
    aisladoDePlanta: false,
    parteDePlanta: "",
    fechaAislamiento: new Date().toISOString().split("T")[0],
    fechaSalida: "",
    tipoCrecimiento: "",
    medioCultivo: "",
    metodoSiembra: "",
    estado: "",
    comentarios: "",
    enColeccion: true,
    enColeccion: false,
    cantidadExistencias: 1,

    // Colecta
    idColectaExistente: "", // ID numérico si se conoce, o código
  });

  // Detectar si venimos de crear una colecta
  useEffect(() => {
    if (location.state?.prefilledColecta) {
      setFormData(prev => ({
        ...prev,
        idColectaExistente: location.state.prefilledColecta
      }));
      setModalInfoMessage(
        `Se ha preseleccionado la colecta recién creada (ID: ${location.state.prefilledColecta}). Complete los datos del aislamiento.`
      );
      setModalInfoOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchColectas = async () => {
      try {
        const data = await getColectas(); // [{ idHeredado: "COL-2024-001" }, ...]
        const options = data.map(c => ({ value: c.idHeredado, label: c.idHeredado }));
        setColectasOptions(options);
      } catch (error) {
        console.error("Error al obtener colectas:", error);
      }
    };
    fetchColectas();
  }, []);

    const handleColectaSelect = (selectedOption) => {
      setFormData(prev => ({
        ...prev,
        idColectaExistente: selectedOption?.value || "" // Si escribe manualmente, se actualiza en handleChange
      }));
    };

  const handleCrecimientoSelect = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      tipoCrecimiento: selectedOption?.value || ""
    }));
  };

  const handleMedioCultivoSelect = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      medioCultivo: selectedOption?.value || ""
    }));
  };

  const handleMetodoSiembraSelect = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      metodoSiembra: selectedOption?.value || ""
    }));
  };

  const handleEstadoSelect = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      estado: selectedOption?.value || ""
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
  if (!formData.idHeredado) {
    alert("El código de aislamiento es obligatorio");
    return;
  }
  
  setLoading(true);
    try {
      const { idColectaExistente, ...restOfFormData } = formData;
    
      const payload = {
          ...restOfFormData,
          idColecta: idColectaExistente 
      };
      
      const response = await createAislamiento(payload);
      
      setCreatedId(response.id); 
      setModalOpen(true);

    } catch (error) {
      console.error("Error al crear el aislamiento:", error); // Usar un mensaje más informativo en console.error
      alert("Error al crear el aislamiento. Revise la consola para detalles o verifique que el ID de Colecta exista.");
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
              <h1>Nuevo Aislamiento</h1>
              <p className="subtitle">Registrar aislamiento en laboratorio</p>
            </div>
          </div>
          <button className="header-save-button" onClick={handleSubmit} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>{loading ? "Guardando..." : "Guardar Aislamiento"}</span>
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
                <label>Código de Aislamiento *</label>
                <input type="text" name="idHeredado" value={formData.idHeredado} onChange={handleChange} placeholder="Ej: AIS-2024-001" />
              </div>
              <div className="form-group">
                <label>Fecha de Aislamiento</label>
                <input type="date" name="fechaAislamiento" value={formData.fechaAislamiento} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" name="aisladoDePlanta" checked={formData.aisladoDePlanta} onChange={handleChange} />
                  {' '}¿Aislado de huésped?
                </label>
              </div>
              {formData.aisladoDePlanta && (
                <div className="form-group">
                  <label>Parte del huésped</label>
                  <input type="text" name="parteDePlanta" value={formData.parteDePlanta} onChange={handleChange} placeholder="Ej: Hoja, Raíz" />
                </div>
              )}
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="enColeccion"
                    checked={formData.enColeccion}
                    onChange={handleChange}
                  />{" "}
                  ¿Está en colección?
                </label>
              </div>

              {formData.enColeccion && (
                <div className="form-group">
                  <label>Cantidad de Existencias *</label>
                  <input
                    type="number"
                    name="cantidadExistencias"
                    min="1"
                    value={formData.cantidadExistencias}
                    onChange={(e) => {
                      const value = Math.max(1, Number(e.target.value));
                      setFormData(prev => ({ ...prev, cantidadExistencias: value }));
                    }}
                    placeholder="Ej: 1, 2, 5"
                  />
                </div>
              )}
              <div className="form-group">
                <label>Tipo de Crecimiento</label>
                <CategoryDropdown
                  categoryName="tipo de crecimiento"
                  placeholder_text="Selecciona una opción..."
                  handleOptionSelect={handleCrecimientoSelect}
                />
              </div>
              <div className="form-group">
                <label>Medio de Cultivo</label>
                <CategoryDropdown
                  categoryName="medio de cultivo"
                  placeholder_text="Selecciona una opción..."
                  handleOptionSelect={handleMedioCultivoSelect}
                />
              </div>
              <div className="form-group">
                <label>Método de Siembra</label>
                <CategoryDropdown
                  categoryName="método de siembra"
                  placeholder_text="Selecciona una opción..."
                  handleOptionSelect={handleMetodoSiembraSelect}
                />
              </div>
              <div className="form-group">
              <label>Estado</label>
                <CategoryDropdown
                  categoryName="estado"
                  placeholder_text="Selecciona una opción..."
                  handleOptionSelect={handleEstadoSelect}
                />
              </div>
              <div className="form-group">
                <label>Comentarios</label>
                <textarea name="comentarios" value={formData.comentarios} onChange={handleChange} rows="3" placeholder="Ej: Crecimiento inicial blanco algodonoso..." />
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section">
              <p className="hint-text" style={{ marginBottom: '20px' }}>
                Ingrese el ID o Código de una colecta ya registrada (si no existe, debes crearla primero y luego regresar aquí).
              </p>

              <div className="form-group">
                <label>ID o Código de Colecta Existente</label>
                <input
                  list="colectas-list"
                  type="text"
                  name="idColectaExistente"
                  value={formData.idColectaExistente}
                  onChange={handleChange}
                  placeholder="Ej: COL-2024-001 o ID numérico"
                />
                <datalist id="colectas-list">
                  {colectasOptions.map((c, index) => (
                    <option key={index} value={c.value} />
                  ))}
                </datalist>
              </div>
            </div>
          )}
        </div>
      </div>

      <AppModal
          open={modalOpen}
          title="Aislamiento creado"
          message="El aislamiento se registró exitosamente. ¿Desea registrar el hongo para este aislamiento ahora?"
          onConfirm={() => {
            setModalOpen(false);

            const finalId = formData.idHeredado || createdId;

            navigate("/add-hongo", {
              state: { prefilledAislamiento: finalId }
            });
          }}
          onCancel={() => {
            setModalOpen(false);
            navigate("/inventario");
          }}
        />

      <AppModal
        open={modalInfoOpen}
        title="Colecta seleccionada"
        message={modalInfoMessage}
        onConfirm={() => setModalInfoOpen(false)}  
        hideCancel={true}                          
      />
    </div>
  );
};

export default AddAislamientoPage;
