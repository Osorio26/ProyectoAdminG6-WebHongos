import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddFungus.css";
import { getFungusByCode, updateFungus } from "../api/FungusApi";

const EditFungus = () => {
	const { code } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		quantity: "",
		collector: "",
		collectionNumber: "",
		location: "",
		protectedArea: "",
		exactSite: "",
		genus: "",
		kingdom: "",
		temperature: "",
		class: "",
		species: "",
		order: "",
		family: "",
	});

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const data = await getFungusByCode(code);
				if (isMounted) {
					setFormData({
						name: data.name || "",
						quantity: data.quantity || "",
						collector: data.collector || "",
						collectionNumber: data.collectionNumber || "",
						location: data.location || "",
						protectedArea: data.protectedArea || "",
						exactSite: data.exactSite || "",
						genus: data.genus || "",
						kingdom: data.kingdom || "",
						temperature: data.temperature || "",
						class: data.class || "",
						species: data.species || "",
						order: data.order || "",
						family: data.family || "",
					});
				}
			} catch (error) {
				console.error(error);
				if (isMounted) {
					setError("No se pudo cargar la muestra para edición");
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateFungus(code, formData);
			navigate("/inventario");
		} catch (error) {
			console.error(error);
			alert("Ocurrió un error al actualizar el hongo");
		}
	};

	if (loading) {
		return <p className="fungus-details-loading">Cargando muestra para edición...</p>;
	}

	if (error) {
		return <p className="fungus-details-error">{error}</p>;
	}

	return (
		<div className="addfungus-container">
			<div className="header-section">
				<button type="button" className="back-button" onClick={() => navigate(-1)}>
					← Volver
				</button>
				<h1>Editar Hongo</h1>
			</div>

			<form onSubmit={handleSubmit} className="fungus-form">
				<h2>Información principal</h2>
				<div className="form-group">
					<label>Código (solo lectura)</label>
					<input type="text" value={code} disabled />
				</div>
				<div className="form-group">
					<label>Nombre</label>
					<input type="text" name="name" value={formData.name} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Cantidad</label>
					<input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Colector</label>
					<input type="text" name="collector" value={formData.collector} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Número de Colecta</label>
					<input
						type="text"
						name="collectionNumber"
						value={formData.collectionNumber}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label>Ubicación</label>
					<input type="text" name="location" value={formData.location} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Área Protegida</label>
					<input
						type="text"
						name="protectedArea"
						value={formData.protectedArea}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label>Sitio Exacto</label>
					<input type="text" name="exactSite" value={formData.exactSite} onChange={handleChange} />
				</div>

				<h2>Clasificación</h2>
				<div className="form-group">
					<label>Reino</label>
					<input type="text" name="kingdom" value={formData.kingdom} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Clase</label>
					<input type="text" name="class" value={formData.class} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Orden</label>
					<input type="text" name="order" value={formData.order} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Familia</label>
					<input type="text" name="family" value={formData.family} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Género</label>
					<input type="text" name="genus" value={formData.genus} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Especie</label>
					<input type="text" name="species" value={formData.species} onChange={handleChange} />
				</div>

				<h2>Otros datos</h2>
				<div className="form-group">
					<label>Temperatura</label>
					<input
						type="text"
						name="temperature"
						value={formData.temperature}
						onChange={handleChange}
					/>
				</div>

				<div className="button-container">
					<button type="button" onClick={() => navigate(-1)}>
						Cancelar
					</button>
					<button type="submit" className="submit-button">
						Guardar Cambios
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditFungus;

