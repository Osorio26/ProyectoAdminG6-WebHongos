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

