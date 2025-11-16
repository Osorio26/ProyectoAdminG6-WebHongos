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

