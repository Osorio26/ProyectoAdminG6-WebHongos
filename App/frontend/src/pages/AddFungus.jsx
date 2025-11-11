import React, { useState } from "react";
import "./AddFungus.css";

const AddFungus = () => {
  const [formData, setFormData] = useState({
    tipo: "",
    nombre: "",
    cantidad: "",
    ubicacion: "",
    codigo: "",
    familia: "",
    genero: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Muestra agregada:\n" + JSON.stringify(formData, null, 2));
    setFormData({
      tipo: "",
      nombre: "",
      cantidad: "",
      ubicacion: "",
      codigo: "",
      familia: "",
      genero: "",
    });
  };

  return (
    <div className="addfungus-container">
      <h1>Agregar Nueva Muestra</h1>
      <form onSubmit={handleSubmit} className="fungus-form">
        <div className="form-group">
          <label>Tipo</label>
          <input
            type="text"
            name="tipo"
            placeholder="ej. Agaricus"
            value={formData.tipo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="ej. Agaricus bisporus"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="text"
            name="cantidad"
            placeholder="ej. 100"
            value={formData.cantidad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            placeholder="ej. Shelf A, Section 1"
            value={formData.ubicacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Código</label>
          <input
            type="text"
            name="codigo"
            placeholder="ej. AB123"
            value={formData.codigo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Familia</label>
          <input
            type="text"
            name="familia"
            placeholder="ej. Agaricaceae"
            value={formData.familia}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Género</label>
          <input
            type="text"
            name="genero"
            placeholder="ej. Agaricus"
            value={formData.genero}
            onChange={handleChange}
          />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">
            Agregar Muestra
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFungus;
