import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditFungus.css";
import {
  getFungusByCode,
  updateFungus,
  getColectas,
} from "../api/FungusApi";

const TABS = [
  "Clasificación Taxonómica",
  "Identificación",
  "Colecta",
  "Aislamiento",
  "Morfología",
  "Marcadores Moleculares",
  "Almacenamiento",
  "Asociación con Planta",
  "Ensayos Biológicos",
];

const EditFungus = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [colectas, setColectas] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const fungus = await getFungusByCode(code);
        const colectasList = await getColectas();
        const catRes = await fetch("http://localhost:3000/categories");
        const catData = await catRes.json();

        setFormData(fungus);
        setColectas(colectasList);
        setCategories(
          Object.fromEntries(catData.map((c) => [c.title.toLowerCase(), c.content]))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  const updateNested = (obj, path, value) => {
    const output = structuredClone(obj);
    const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let current = output;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (current[k] === undefined) current[k] = {};
      current = current[k];
    }
    current[keys[keys.length - 1]] = value;
    return output;
  };

  const getNested = (obj, path) => {
    if (!obj) return "";
    const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let v = obj;
    for (const k of keys) {
      if (v === undefined || v === null) return "";
      v = v[k];
    }
    // Formatear fechas para input type="date"
    if (path.includes("Fecha") && typeof v === "string" && v.includes("T")) {
      return v.split("T")[0];
    }
    return v ?? "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => updateNested(prev, name, val));
  };

  const handleSelectChange = (e, key) => {
    const value = e.target.value;
    // Convertir "true"/"false" strings a booleanos si es necesario
    let finalValue = value;
    if (value === "true") finalValue = true;
    if (value === "false") finalValue = false;
    
    setFormData((prev) => updateNested(prev, key, finalValue));

    if (key === "idColecta") {
      const selected = colectas.find((c) => c.id === parseInt(value));
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          Colecta: { ...prev.Colecta, ...selected },
        }));
      }
    }
  };

  const addNewEnsayo = () => {
    setFormData((prev) => ({
      ...prev,
      EnsayosBiologicos: [
        ...(prev.EnsayosBiologicos || []),
        { Tipo: "", Resultado: "", _isNew: true },
      ],
    }));
  };

  const addNewMorfologia = () => {
    if (formData.Morfologias?.length > 0) return;
    setFormData((prev) => ({
      ...prev,
      Morfologias: [
        {
          Forma: "",
          FormaBorde: "",
          ColorAnverso: "",
          ColorReverso: "",
          ColorBorde: "",
          TieneMicelioAereo: "",
          DensidadMicelioAereo: "",
          TipoCrecimiento: "",
          TipoHifa: "",
          TieneSecreciones: "",
          Observaciones: "",
          _isNew: true,
        },
      ],
    }));
  };

  const handleSave = async () => {
    try {
      await updateFungus(code, formData);

      if (formData.EnsayosBiologicos) {
        for (const ensayo of formData.EnsayosBiologicos) {
          if (ensayo._isNew) {
            await fetch("http://localhost:3000/hongos/ensayo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idRelacionado: formData.idHeredado,
                tipoEnsayo: ensayo.Tipo,
                resultadoEnsayo: ensayo.Resultado,
              }),
            });
          }
        }
      }

      if (formData.Morfologias?.[0]?._isNew) {
        const m = formData.Morfologias[0];
        await fetch("http://localhost:3000/hongos/morfologia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idRelacionado: formData.idHeredado,
            forma: m.Forma,
            formaBorde: m.FormaBorde,
            colorAnverso: m.ColorAnverso,
            colorReverso: m.ColorReverso,
            colorBorde: m.ColorBorde,
            tieneMicelioAereo: m.TieneMicelioAereo,
            densidadMicelioAereo: m.DensidadMicelioAereo,
            tipoCrecimiento: m.TipoCrecimiento,
            tipoHifa: m.TipoHifa,
            tieneSecreciones: m.TieneSecreciones,
            observaciones: m.Observaciones,
          }),
        });
      }

      navigate(`/detalle/${code}`);
    } catch {
      alert("Error al guardar");
    }
  };

  if (loading) return <p>Cargando...</p>;

  const SECTION_CONFIG = {
    TAXONOMIA: [
      { label: "Reino", key: "Organismo.Reino" },
      { label: "Filo", key: "Organismo.Filo" },
      { label: "Clase", key: "Organismo.Clase" },
      { label: "Orden", key: "Organismo.Orden" },
      { label: "Familia", key: "Organismo.Familia" },
      { label: "Género", key: "Organismo.Genero" },
      { label: "Especie", key: "Organismo.Especie" },
    ],
    IDENT: [
      { label: "Método", key: "Organismo.Hongo.MetodoIdentificacion" },
      { label: "Código GenBank", key: "Organismo.Hongo.CodigoAccesoGenBank" },
      { label: "Responsable", key: "Organismo.Hongo.IdentificadorResponsable" },
    ],
    COLECTA: [
      {
        label: "Código de Colecta",
        key: "idColecta",
        type: "select",
        options: colectas,
        optionLabel: (c) =>
          `${c.idHeredado} - ${c.Colector} (${c.Fecha?.split("T")[0]})`,
        optionValue: "id",
      },
      { label: "Fecha", key: "Colecta.Fecha", type: "date" },
      { label: "Colector", key: "Colecta.Colector" },
      { label: "Temperatura (°C)", key: "Colecta.Temperatura", type: "number" },
      { label: "Humedad (%)", key: "Colecta.Humedad", type: "number" },
      { label: "pH", key: "Colecta.pH", type: "number" },
      { label: "Sitio", key: "Colecta.Sitio.Nombre" },
      { label: "Área Protegida", key: "Colecta.Sitio.NombreAreaProtegida" },
      { 
        label: "¿Es Área Protegida?", 
        key: "Colecta.Sitio.EsAreaProtegida", 
        type: "checkbox" 
      },
      { label: "Observaciones Sitio", key: "Colecta.Sitio.ReferenciasAdicionales" },
    ],
    AISLAM: [
      {
        label: "Medio de Cultivo",
        key: "MedioCultivo",
        type: "select",
        options: categories["medio de cultivo"] || [],
        optionLabel: (v) => v,
        optionValue: null,
      },
      {
        label: "Método Siembra",
        key: "MetodoSiembra",
        type: "select",
        options: categories["método de siembra"] || [],
        optionLabel: (v) => v,
        optionValue: null,
      },
      { label: "Fecha Aislamiento", key: "FechaAislamiento", type: "date" },
      { label: "Fecha Salida", key: "FechaSalida", type: "date" },
      { label: "Parte de Planta", key: "ParteDePlanta" },
      { label: "Estado", key: "Estado" },
      { label: "Comentarios", key: "Comentarios" },
      { label: "¿Aislado de Planta?", key: "AisladoDePlanta", type: "checkbox" },
      { label: "¿En Colección?", key: "EstaEnColeccion", type: "checkbox" },
    ],
    MORFO: [
      {
        label: "Forma",
        key: "Morfologias[0].Forma",
        type: "select",
        options: categories["forma"] || [],
        optionLabel: (v) => v,
        optionValue: null,
      },
      {
        label: "Forma Borde",
        key: "Morfologias[0].FormaBorde",
        type: "select",
        options: categories["forma del borde"] || [],
        optionLabel: (v) => v,
        optionValue: null,
      },
      { label: "Color Anverso", key: "Morfologias[0].ColorAnverso" },
      { label: "Color Reverso", key: "Morfologias[0].ColorReverso" },
      {
        label: "Color Borde",
        key: "Morfologias[0].ColorBorde",
        type: "select",
        options: categories["color de borde"] || [],
        optionLabel: (v) => v,
        optionValue: null,
      },
      { label: "Tipo Crecimiento", key: "Morfologias[0].TipoCrecimiento" },
      { label: "Tipo Hifa", key: "Morfologias[0].TipoHifa" },
      { label: "Densidad Micelio", key: "Morfologias[0].DensidadMicelioAereo" },
      { label: "¿Tiene Micelio Aéreo?", key: "Morfologias[0].TieneMicelioAereo", type: "checkbox" },
      { label: "¿Tiene Secreciones?", key: "Morfologias[0].TieneSecreciones", type: "checkbox" },
      { label: "Observaciones", key: "Morfologias[0].Observaciones" },
    ],
    MARC: [
      {
        label: "Tipo Marcador",
        key: "Organismo.Hongo.Marcadores[0].Tipo",
        type: "select",
        options: categories["tipo de marcador"] || [],
      },
      { label: "Secuencia", key: "Organismo.Hongo.Marcadores[0].Secuencia" },
    ],
    ALMAC: [
      { label: "Cantidad Existencias", key: "CantidadExistencias" },
      { label: "Área Protegida", key: "Colecta.Sitio.NombreAreaProtegida" },
    ],
    PLANTA: [
      { label: "Reino Planta", key: "Colecta.Planta.Reino" },
      { label: "Familia Planta", key: "Colecta.Planta.Familia" },
      { label: "Género Planta", key: "Colecta.Planta.Genero" },
      { label: "Especie Planta", key: "Colecta.Planta.Especie" },
    ],
    ENSAYOS: [],
  };

  return (
    <div className="edit-fungus-container">
      <div className="details-header-area">
        <div className="header-row">
          <div className="header-left">
            <button className="back-icon-button" onClick={() => navigate(-1)} title="Cancelar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19L5 12L12 5"/></svg>
            </button>
            <div className="header-info">
              <h1>Editar: {formData.Organismo?.Especie}</h1>
              <p className="subtitle">
                Mostrando muestra <strong>{formData.idHeredado}</strong>
              </p>
            </div>
          </div>

          <button className="header-save-button" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="edit-fungus-window">
        <div className="sidebar-nav">
          <h3 className="sidebar-title">Secciones</h3>
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`sidebar-button ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="details-content">
          <h2 className="section-title">{TABS[activeTab]}</h2>

          <div className="edit-tab-content">
            {activeTab === 8 && (
              <>
                {formData.EnsayosBiologicos?.map((ens, idx) => (
                  <div key={idx} className="edit-row">
                    <span className="edit-label">Tipo Ensayo</span>
                    <div className="edit-input-wrapper">
                      <select
                        name={`EnsayosBiologicos[${idx}].Tipo`}
                        className="edit-input-field"
                        value={ens.Tipo}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione</option>
                        {(categories["tipo de ensayo"] || []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="edit-label">Resultado</span>
                    <div className="edit-input-wrapper">
                      <input
                        name={`EnsayosBiologicos[${idx}].Resultado`}
                        value={ens.Resultado}
                        className="edit-input-field"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}

                <button className="add-button" onClick={addNewEnsayo}>
                  Agregar Ensayo
                </button>
              </>
            )}

            {activeTab !== 8 &&
              (
                Object.values(SECTION_CONFIG)[activeTab]
              ).map((item, i) => (
                <div className="edit-row" key={i}>
                  <span className="edit-label">{item.label}</span>

                  <div className="edit-input-wrapper">
                    {item.type === "select" ? (
                      <select
                        name={item.key}
                        className="edit-input-field"
                        value={getNested(formData, item.key)}
                        onChange={(e) => {
                          if (item.optionValue === null)
                            handleChange(e);
                          else handleSelectChange(e, item.key);
                        }}
                      >
                        <option value="">Seleccione</option>
                        {item.options.map((opt) =>
                          item.optionValue
                            ? (
                              <option key={opt[item.optionValue]} value={opt[item.optionValue]}>
                                {item.optionLabel(opt)}
                              </option>
                            )
                            : (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            )
                        )}
                      </select>
                    ) : item.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={!!getNested(formData, item.key)}
                        onChange={handleChange}
                        className="edit-checkbox"
                      />
                    ) : (
                      <input
                        type={item.type || "text"}
                        name={item.key}
                        className="edit-input-field"
                        value={getNested(formData, item.key)}
                        onChange={handleChange}
                        readOnly={item.readOnly}
                      />
                    )}
                  </div>
                </div>
              ))}

            {activeTab === 4 && (
              <button className="add-button" onClick={addNewMorfologia}>
                Agregar Morfología
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFungus;
