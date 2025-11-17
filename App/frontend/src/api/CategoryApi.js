const API_BASE_URL = "http://localhost:3000";

export async function getCategory() {
	const res = await fetch(`${API_BASE_URL}/categorias`);
	if (!res.ok) {
		throw new Error("Error fetching fungi list");
	}
	return res.json();
}

export async function getCategoryByCode(code) {
	const res = await fetch(`${API_BASE_URL}/categorias/${code}`);
	if (!res.ok) {
		throw new Error("Error fetching category details!");
	}
	return res.json();
}

export async function getCategoryByTitle(title) {
	const res = await fetch(`${API_BASE_URL}/categorias`);
	if (!res.ok) {
		throw new Error("Error fetching categories");
	}
	const categories = await res.json();
	const category = categories.find(cat => cat.title.toLowerCase() === title.toLowerCase());
	if (!category) {
		throw new Error(`Category "${title}" not found`);
	}
	return category;
}

export async function getCategoryByName(nameOrCode) {
	const res = await fetch(`${API_BASE_URL}/categorias`);
	if (!res.ok) {
		throw new Error("Error fetching categories");
	}
	const categories = await res.json();
	// Buscar por code primero, luego por title
	let category = categories.find(cat => cat.code.toLowerCase() === nameOrCode.toLowerCase());
	if (!category) {
		category = categories.find(cat => cat.title.toLowerCase() === nameOrCode.toLowerCase());
	}
	if (!category) {
		throw new Error(`Category "${nameOrCode}" not found`);
	}
	return category;
}

// No estoy seguro de si voy a mantener esto
export async function createCategory(category) {
	const res = await fetch(`${API_BASE_URL}/categorias`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(category),
	});

	if (!res.ok) {
		if (res.status === 409) {
			// Si ya existe, actualizar en lugar de crear
			console.log(`Category exists (409), updating: ${category.code}`);
			try {
				const result = await updateCategory(category.code, category);
				console.log(`Successfully updated category ${category.code}`);
				return result;
			} catch (err) {
				console.error(`Error updating category on 409:`, err);
				throw err;
			}
		}
		throw new Error("Error creating category!");
	}

	return res.json();
}

export async function updateCategory(code, updates) {
	const res = await fetch(`${API_BASE_URL}/categorias/${code}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updates),
	});

	if (!res.ok) {
		throw new Error("Error updating category!");
	}

	return res.json();
}

// Optional verification helper — returns the file metadata from backend
export async function verifyFileUpdate() {
    const res = await fetch(`${API_BASE_URL}/categorias/verify/latest`);
    if (!res.ok) {
        throw new Error("Error verifying file update!");
    }
    return res.json();
}

