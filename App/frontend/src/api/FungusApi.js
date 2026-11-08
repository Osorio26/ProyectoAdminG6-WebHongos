const API_BASE_URL = "http://localhost:3000";

export async function getFungi() {
	const res = await fetch(`${API_BASE_URL}/hongos`);
	if (!res.ok) {
		throw new Error("Error fetching fungi list");
	}
	return res.json();
}

export async function getFungusByCode(code) {
	const res = await fetch(`${API_BASE_URL}/hongos/${code}`);
	if (!res.ok) {
		throw new Error("Error fetching fungus details");
	}
	return res.json();
}

export async function createFungus(fungus) {
	const res = await fetch(`${API_BASE_URL}/hongos`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(fungus),
	});

	if (!res.ok) {
		throw new Error("Error creating fungus");
	}

	return res.json();
}

export async function createColecta(data) {
	const res = await fetch(`${API_BASE_URL}/hongos/colecta`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error creating colecta");
	return res.json();
}

export async function createAislamiento(data) {
	const res = await fetch(`${API_BASE_URL}/hongos/aislamiento`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error creating aislamiento");
	return res.json();
}

export async function createHongo(data) {
	const res = await fetch(`${API_BASE_URL}/hongos/hongo`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error creating hongo");
	return res.json();
}

export async function createMorfologia(data) {
	const res = await fetch(`${API_BASE_URL}/hongos/morfologia`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error creating morfologia");
	return res.json();
}

export async function createEnsayo(data) {
	const res = await fetch(`${API_BASE_URL}/hongos/ensayo`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error creating ensayo");
	return res.json();
}

export async function deleteEnsayo(id) {
	const res = await fetch(`${API_BASE_URL}/hongos/ensayo/${id}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error("Error deleting ensayo");
	return res.json();
}

export async function deleteFungus(code) {
	const res = await fetch(`${API_BASE_URL}/hongos/${code}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error("Error deleting fungus");
	return res.json();
}

export async function updateFungus(code, updates) {
	const res = await fetch(`${API_BASE_URL}/hongos/${code}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updates),
	});

	if (!res.ok) {
		throw new Error("Error updating fungus");
	}

	return res.json();
}

export async function getColectas() {
	const res = await fetch(`${API_BASE_URL}/hongos/list/colectas`);
	if (!res.ok) throw new Error("Error fetching colectas");
	return res.json();
}

export async function getSitios() {
	const res = await fetch(`${API_BASE_URL}/hongos/list/sitios`);
	if (!res.ok) throw new Error("Error fetching sitios");
	return res.json();
}

export async function getHospederos() {
	const res = await fetch(`${API_BASE_URL}/hongos/list/hospederos`);
	if (!res.ok) throw new Error("Error fetching hospederos");
	return res.json();
}

export async function getAislamientos() {
	const res = await fetch(`${API_BASE_URL}/hongos/list/aislamientos`);
	if (!res.ok) throw new Error("Error fetching aislamientos");
	return res.json();
}

// Descarga un ZIP con un CSV por tabla (GET /hongos/export-csv-zip).
// El botón "Descargar CSV" ya no la usa: usa exportCombinedCSV() (más abajo).
export async function exportAllTablesToZip() {
	try {

		const res = await fetch(`${API_BASE_URL}/hongos/export-csv-zip`);

		if (!res.ok) {
			const errorData = await res.json().catch(() => null);
			throw new Error(errorData?.message || "Error exporting CSV ZIP");
		}

		const blob = await res.blob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `hongos_export_${new Date().toISOString().slice(0, 10)}.zip`;
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error exporting CSV ZIP:", error);
		alert("Error exporting CSV ZIP: " + error.message);
	}
}

// Descarga un solo CSV con una fila por aislamiento y todas las tablas unidas
// (GET /hongos/export-csv). Es la que usa el botón "Descargar CSV".
export async function exportCombinedCSV() {
	try {
		const res = await fetch(`${API_BASE_URL}/hongos/export-csv`);

		if (!res.ok) {
			const errorData = await res.json().catch(() => null);
			throw new Error(errorData?.message || "Error al exportar el CSV");
		}

		const blob = await res.blob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `cocmi_export_${new Date().toISOString().slice(0, 10)}.csv`;
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error al exportar el CSV:", error);
		alert("Error al exportar el CSV: " + error.message);
	}
}

