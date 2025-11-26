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

