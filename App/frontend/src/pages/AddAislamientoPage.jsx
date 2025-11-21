import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import CategoryDropdown from '../components/categoryDropdown/categoryDropdown'; 
import ReusableBackButton from "../components/ReusableBackButton";

const CoordenadasForm = ({ formData, handleChange }) => (
    <div className="sub-form-section" style={{ border: '1px dashed #4caf50', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
        <h4 style={{marginTop: '0'}}>Datos de Coordenadas</h4>
        <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Latitud</label>
                <input type="number" step="any" name="coordenadas.latitud" placeholder="Ej: 9.928069" value={formData.coordenadas.latitud} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Longitud</label>
                <input type="number" step="any" name="coordenadas.longitud" placeholder="Ej: -84.090726" value={formData.coordenadas.longitud} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Altitud (metros)</label>
                <input type="number" name="coordenadas.altitud" placeholder="Ej: 1100" value={formData.coordenadas.altitud} onChange={handleChange}/>
            </div>
        </div>
    </div>
  );

  const SitioForm = ({ formData, handleChange }) => (
      <div className="sub-form-section" style={{ border: '1px dashed #795548', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
          <h4 style={{marginTop: '0'}}>Detalles del Sitio de Colecta</h4>
          <div className="form-group">
              <label>Nombre del Sitio</label>
              <input type="text" name="sitio.nombre" placeholder="Ej: Sendero del Árbol Gigante" value={formData.sitio.nombre} onChange={handleChange}/>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sitio.esAreaProtegida"
                  checked={formData.sitio.esAreaProtegida}
                  onChange={handleChange}
                />
              <span className="custom-checkbox"></span>
                ¿Es Área Protegida?
            </label>
          </div>

          {formData.sitio.esAreaProtegida && (
              <div className="form-group">
                  <label>Nombre del Área Protegida</label>
                  <input type="text" name="sitio.nombreAreaProtegida" placeholder="Ej: Parque Nacional" value={formData.sitio.nombreAreaProtegida} onChange={handleChange}/>
              </div>
          )}
          <div className="form-group">
              <label>Referencias Adicionales del Sitio</label>
              <textarea name="sitio.referenciasAdicionales" placeholder="Instrucciones para llegar, detalles geográficos relevantes, etc." value={formData.sitio.referenciasAdicionales} onChange={handleChange} rows="2"/>
          </div>
      </div>
  );

  const OrganismoForm = ({ formData, handleChange }) => (
      <div className="sub-form-section" style={{ border: '1px dashed #42a5f5', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
          <h4 style={{marginTop: '0'}}>Datos de Clasificación del Organismo (Planta)</h4>
          
          <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Reino</label>
                  <input type="text" name="organismo.reino" placeholder="Ej: Plantae" value={formData.organismo.reino} onChange={handleChange}/>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Filo</label>
                  <input type="text" name="organismo.filo" placeholder="Ej: Magnoliophyta" value={formData.organismo.filo} onChange={handleChange}/>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Clase</label>
                  <input type="text" name="organismo.clase" placeholder="Ej: Magnoliopsida" value={formData.organismo.clase} onChange={handleChange}/>
              </div>
          </div>
          
          <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Orden</label>
                  <input type="text" name="organismo.orden" placeholder="Ej: Fagales" value={formData.organismo.orden} onChange={handleChange}/>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Familia</label>
                  <input type="text" name="organismo.familia" placeholder="Ej: Fagaceae" value={formData.organismo.familia} onChange={handleChange}/>
              </div>
          </div>
          
          <div className="row-group" style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Género</label>
                  <input type="text" name="organismo.genero" placeholder="Ej: Quercus" value={formData.organismo.genero} onChange={handleChange}/>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                  <label>Especie</label>
                  <input type="text" name="organismo.especie" placeholder="Ej: Quercus robur" value={formData.organismo.especie} onChange={handleChange}/>
              </div>
          </div>
      </div>
  );

const AddAislamientoPage = () => {

  const navigate = useNavigate();

  const [isNewColecta, setIsNewColecta] = useState(false);

  const [formData, setFormData] = useState({
  /* ===== AISLAMIENTO ===== */
  idHeredado: "",
  aisladoDePlanta: false,
  parteDePlanta: "",
  fechaAislamiento: new Date().toISOString().split("T")[0],
  fechaSalida: "",
  idAnalisisMolecular: "",
  tipoCrecimiento: "",
  medioCultivo: "", 
  metodoSiembra: "", 
  estado: "", 
  comentarios: "",
  enColeccion: true,

  /* ===== VÍNCULO DE COLECTA ===== */
  idColectaExistente: "",

  /* ===== NUEVA COLECTA ===== */
  codigoColecta: "",
  fechaColecta: new Date().toISOString().split("T")[0],
  ubicacionColecta: "",
  colector: "",
  observacionesColecta: "",

  /* === OBJETOS ANIDADOS REQUERIDOS POR LOS SUBFORMULARIOS === */
  coordenadas: {
    latitud: "",
    longitud: "",
    altitud: "",
  },

  sitio: {
    nombre: "",
    esAreaProtegida: false,
    nombreAreaProtegida: "",
    referenciasAdicionales: "",
  },

  organismo: {
    reino: "",
    filo: "",
    clase: "",
    orden: "",
    familia: "",
    genero: "",
    especie: "",
  }
});

  const handleDropdownSelect = (name) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTipoCrecimientoSelect = handleDropdownSelect("tipoCrecimiento");
  const handleMedioCultivoSelect = handleDropdownSelect("medioCultivo");
  const handleMetodoSiembraSelect = handleDropdownSelect("metodoSiembra");
  const handleEstadoSelect = handleDropdownSelect("estado");

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  // caso especial del toggle de nueva colecta
  if (name === "isNewColecta") {
    setIsNewColecta(checked);
    return;
  }

  // Soporte para "objeto.campo"
  if (name.includes(".")) {
    const [parent, child] = name.split(".");

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: type === "checkbox" ? checked : value,
      }
    }));
  } 
  else {
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías incluir validaciones antes de enviar
    console.log("Datos a enviar:", formData);
    alert("Formulario enviado.");
    // navigate("/inventario"); // Descomentar al implementar el envío real
  };

  // Función auxiliar para crear el objeto de valor de React-Select
  const getDropdownValue = (fieldName) => {
    const value = formData[fieldName];
    return value ? { value: value, label: value } : null;
  };

  return (
    <div className="addfungus-container">
      <div className="header-section">
        <div>
          <ReusableBackButton />
        </div>  
        <h1>Registro de Aislamiento</h1>
      </div>

      <form onSubmit={handleSubmit} className="fungus-form flow-container">

        <div className="info-box" style={{ backgroundColor: '#e0f7fa', borderLeft: '4px solid #2f9b00' }}>
          Completa todos los campos para el registro de un aislamiento.
        </div>

        <h2>Datos del Aislamiento</h2>

        <div className="form-group">
          <label>ID Heredado</label>
          <input type="text" placeholder="Ej: A-001" name="idHeredado" value={formData.idHeredado} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="aisladoDePlanta"
                  checked={formData.aisladoDePlanta}
                  onChange={handleChange}
                />
                <span className="custom-checkbox"></span>
                ¿Aislado de Planta?
              </label>
          </div>
        </div>

      <div className={`expandable-section ${formData.aisladoDePlanta ? "show" : ""}`}>
        <div className="form-group">
          <label>Parte de la Planta</label>
          <input
            type="text"
            name="parteDePlanta"
            placeholder="Ej: Raíz, Hoja, Tallo"
            value={formData.parteDePlanta}
            onChange={handleChange}
          />
        </div>
      </div>

        <div className="form-group">
          <label>Fecha de Aislamiento</label>
          <input type="date" name="fechaAislamiento" value={formData.fechaAislamiento} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Fecha de Salida</label>
          <input type="date" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>ID Análisis Molecular</label>
          <input type="text" name="idAnalisisMolecular" placeholder="Ej: AM-045" value={formData.idAnalisisMolecular} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Tipo de Crecimiento</label>
          <CategoryDropdown
            categoryName="tipo de crecimiento" 
            placeholder_text="Seleccione Filamentoso, Levaduriforme, etc."
            handleOptionSelect={handleTipoCrecimientoSelect} 
            value={getDropdownValue("tipoCrecimiento")} 
          />
        </div>

        <div className="form-group">
          <label>Medio de Cultivo</label>
          <CategoryDropdown
            categoryName="medio de cultivo" 
            placeholder_text="Ej: PDA, MEA, Sabouraud"
            handleOptionSelect={handleMedioCultivoSelect} 
            value={getDropdownValue("medioCultivo")} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Método de Siembra</label>
          <CategoryDropdown
            categoryName="método de siembra"
            placeholder_text="Ej: Por estría, dilución"
            handleOptionSelect={handleMetodoSiembraSelect}
            value={getDropdownValue("metodoSiembra")} 
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <CategoryDropdown
            categoryName="estado"
            placeholder_text="Ej: Vivo, Inactivo, Contaminado"
            handleOptionSelect={handleEstadoSelect} 
            value={getDropdownValue("estado")} 
          />
        </div>

        <div className="form-group">
          <label>Comentarios</label>
          <textarea name="comentarios" rows="3" placeholder="Añade observaciones relevantes sobre el aislamiento..." value={formData.comentarios} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
         <label className="checkbox-label">
            <input
              type="checkbox"
              name="enColeccion"
              checked={formData.enColeccion}
              onChange={handleChange}
            />
            <span className="custom-checkbox"></span>
              ¿Esta muestra se encuentra en la colección para esta muestra?
          </label>
        </div>
        <hr />

        <h2>Vínculo de Muestra Original</h2>
        {!isNewColecta ? (
          <>
            <div className="form-group">
              <label>Id de Colecta Existente</label>
              <input type="text" name="idColectaExistente" value={formData.idColectaExistente} onChange={handleChange} />
            </div>
          </>
        ) : (
          <>
    <h2>Nueva Colecta</h2>

    {/* Datos generales */}
    <h4>Datos Generales</h4>
    <div className="form-group">
      <label>Código de Colecta</label>
      <input
        type="text"
        name="codigoColecta"
        placeholder="COL-2024-Amazonas-05"
        value={formData.codigoColecta}
        onChange={handleChange}
        required
      />
    </div>

    <div className="row-group" style={{display: 'flex', gap: '15px'}}>
            <div className="form-group" style={{flex: 1}}>
                <label>Colector</label>
                <input type="text" name="colector" placeholder="Nombre del responsable" value={formData.colector} onChange={handleChange}/>
            </div>
            <div className="form-group" style={{flex: 1}}>
                <label>Fecha de Colecta</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange}/>
            </div>
    </div>

    {/* Coordenadas: usa el subform definido arriba */}
    <CoordenadasForm formData={formData} handleChange={handleChange} />

    {/* Sitio: usa el subform definido arriba */}
    <SitioForm formData={formData} handleChange={handleChange} />

    {/* Planta hospedera toggle + subform */}
    <div className="form-group checkbox-group" style={{ marginTop: 10 }}>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="contienePlanta"
          checked={!!(formData.organismo && (formData.organismo.familia || formData.organismo.genero || formData.organismo.especie || formData.organismo.estadoFenologico || formData.organismo.parteAfectada || formData.organismo.observaciones))}
          onChange={(e) => {
            if (typeof handleChange === "function") {
              const fakeEvent = { target: { name: "contienePlanta", type: "checkbox", checked: e.target.checked } };
              handleChange(fakeEvent);
            }
            if (!e.target.checked) {
              setFormData((prev) => ({
                ...prev,
                organismo: {
                  familia: "",
                  genero: "",
                  especie: "",
                  estadoFenologico: "",
                  parteAfectada: "",
                  observaciones: "",
                },
              }));
            }
          }}
        />
        <span className="custom-checkbox"></span>
        ¿Contiene planta hospedera?
      </label>
    </div>

  {formData.organismo && (
    <div
      className={`expandable-section ${
            formData.contienePlanta ||
            formData.organismo.familia ||
            formData.organismo.genero ||
            formData.organismo.especie
              ? "show"
              : ""
            }`}
          >
        <OrganismoForm formData={formData} handleChange={handleChange} />
        </div>
      )}
    </>
   )}

    <div className="form-group checkbox-row">
         <label className="checkbox-label">
            <input
              type="checkbox"
              name="isNewColecta"
              checked={isNewColecta} // Usar el estado local `isNewColecta`
              onChange={handleChange}
            />
            <span className="custom-checkbox"></span>
              ¿Necesitas crear una nueva colecta? Si no es así, vincula una existente.
          </label>
        </div>

        <div className="button-container">
          <button className="submit-button" type="submit">
            Guardar Registro
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default AddAislamientoPage;