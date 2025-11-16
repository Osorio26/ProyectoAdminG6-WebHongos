import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFungus.css";
import FileDropdown from "../components/FileDropdown/fileDropdown";
import { createFungus } from "../api/FungusApi";

const AddFungus = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo: "Hongo",
    // Clasificación
    reino: "",
    filo: "",
    clase: "",
    orden: "",
    familia: "",
    genero: "",
    especie: "",
    // Identificación
    metodoIdentificacion: "",
    codigoGenBank: "",
    responsable: "",
    // Colecta
    codigoColecta: "",
    fechaColecta: "",
    ubicacionColecta: "",
    colector: "",
    observacionesColecta: "",
    // Aislamiento
    medioCultivo: "",
    fechaAislamiento: "",
    responsableAislamiento: "",
    condiciones: "",
    // Morfología
    descripcionMacro: "",
    descripcionMicro: "",
    color: "",
    textura: "",
    notasMorfologia: "",
    // Marcadores
    marcadorTipo: "",
    secuencia: "",
    // Almacenamiento
    cantidad: "",
    ubicacion: "",
    // Asociación planta
    tienePlanta: false,
    planta: {
      reino: "Plantae",
      filo: "",
      clase: "",
      orden: "",
      familia: "",
      genero: "",
      especie: "",
      observaciones: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("planta.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        planta: { ...formData.planta, [field]: value },
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mapear datos mínimos al modelo del backend
      const newFungus = {
        code: formData.codigoColecta || `GEN-${Date.now()}`,
        name: formData.especie || "Hongo sin especie",
        quantity: formData.cantidad || "0",
        collector: formData.colector,
        collectionNumber: formData.codigoColecta,
        location: formData.ubicacionColecta,
        protectedArea: formData.ubicacion,
        exactSite: formData.observacionesColecta,
        genus: formData.genero,
        kingdom: formData.reino || "Fungi",
        temperature: formData.condiciones,
        class: formData.clase,
        species: formData.especie,
        order: formData.orden,
        family: formData.familia,
      };

      await createFungus(newFungus);
      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el hongo");
    }
  };

  return (
    <div className="addfungus-container">
      <div className="header-section">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1>Agregar Nuevo Hongo</h1>
      </div>

      <form onSubmit={handleSubmit} className="fungus-form">
        <div className="step-indicator">Paso {step} de 9</div>

        {/* === 1. Clasificación === */}
        {step === 1 && (
          <>
            <h2>Clasificación Taxonómica</h2>
            {["reino", "filo", "clase", "orden", "familia", "genero", "especie"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type="text" name={field} value={formData[field]} onChange={handleChange} />
              </div>
            ))}
            <div className="button-container">
              <button className="submit-button" type="button" onClick={nextStep}>Siguiente</button>
            </div>
            {/*Prueba dropdown de archivo */}
            <FileDropdown text="Select an option..."/>
          </>
        )}

        {/* === 2. Identificación === */}
        {step === 2 && (
          <>
            <h2>Identificación</h2>
            <div className="form-group">
              <label>Método</label>
              <input type="text" name="metodoIdentificacion" value={formData.metodoIdentificacion} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Código GenBank</label>
              <input type="text" name="codigoGenBank" value={formData.codigoGenBank} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Responsable</label>
              <input type="text" name="responsable" value={formData.responsable} onChange={handleChange}/>
            </div>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 3. Colecta === */}
        {step === 3 && (
          <>
            <h2>Colecta</h2>
            <div className="form-group">
              <label>Código de Colecta</label>
              <input type="text" name="codigoColecta" value={formData.codigoColecta} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" name="fechaColecta" value={formData.fechaColecta} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Ubicación Geográfica</label>
              <input type="text" name="ubicacionColecta" value={formData.ubicacionColecta} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Colector</label>
              <input type="text" name="colector" value={formData.colector} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea name="observacionesColecta" value={formData.observacionesColecta} onChange={handleChange} rows="3"/>
            </div>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 4. Aislamiento === */}
        {step === 4 && (
          <>
            <h2>Aislamiento</h2>
            <div className="form-group">
              <label>Medio de Cultivo</label>
              <input type="text" name="medioCultivo" value={formData.medioCultivo} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Fecha de Aislamiento</label>
              <input type="date" name="fechaAislamiento" value={formData.fechaAislamiento} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Responsable</label>
              <input type="text" name="responsableAislamiento" value={formData.responsableAislamiento} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Condiciones</label>
              <input type="text" name="condiciones" value={formData.condiciones} onChange={handleChange}/>
            </div>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 5. Morfología === */}
        {step === 5 && (
          <>
            <h2>Morfología</h2>
            <div className="form-group">
              <label>Descripción Macroscópica</label>
              <textarea name="descripcionMacro" value={formData.descripcionMacro} onChange={handleChange} rows="3"/>
            </div>
            <div className="form-group">
              <label>Descripción Microscópica</label>
              <textarea name="descripcionMicro" value={formData.descripcionMicro} onChange={handleChange} rows="3"/>
            </div>
            <div className="form-group">
              <label>Color</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Textura</label>
              <input type="text" name="textura" value={formData.textura} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Notas</label>
              <textarea name="notasMorfologia" value={formData.notasMorfologia} onChange={handleChange} rows="3"/>
            </div>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 6. Marcadores === */}
        {step === 6 && (
          <>
            <h2>Marcadores Moleculares</h2>
            <div className="form-group">
              <label>Tipo</label>
              <input type="text" name="marcadorTipo" value={formData.marcadorTipo} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Secuencia</label>
              <textarea name="secuencia" value={formData.secuencia} onChange={handleChange} rows="3"/>
            </div>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 7. Almacenamiento === */}
        {step === 7 && (
          <>
            <h2>Almacenamiento</h2>
            <div className="form-group">
              <label>Cantidad</label>
              <input type="text" name="cantidad" value={formData.cantidad} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Ubicación</label>
              <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange}/>
            </div>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 8. Asociación con Planta === */}
        {step === 8 && (
          <>
            <h2>Asociación con Planta</h2>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="tienePlanta" checked={formData.tienePlanta} onChange={handleChange}/>
                {" "}¿Asociado a una planta?
              </label>
            </div>

            {formData.tienePlanta && (
              <div className="planta-subform">
                {["reino","filo","clase","orden","familia","genero","especie"].map((field)=>(
                  <div className="form-group" key={field}>
                    <label>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                    <input type="text" name={`planta.${field}`} value={formData.planta[field]} onChange={handleChange}/>
                  </div>
                ))}
                <div className="form-group">
                  <label>Observaciones</label>
                  <textarea name="planta.observaciones" value={formData.planta.observaciones} onChange={handleChange} rows="3"/>
                </div>
              </div>
            )}

            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="button" className="submit-button" onClick={nextStep}>Siguiente</button>
            </div>
          </>
        )}

        {/* === 9. Confirmación === */}
        {step === 9 && (
          <>
            <h2>Confirmar y Guardar</h2>
            <pre className="preview-box">{JSON.stringify(formData, null, 2)}</pre>
            <div className="button-container">
              <button type="button" onClick={prevStep}>Anterior</button>
              <button type="submit" className="submit-button">Guardar Registro</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddFungus;
