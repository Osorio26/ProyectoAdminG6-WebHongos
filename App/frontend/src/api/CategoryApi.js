const API_BASE_URL = "http://localhost:3000";

export async function getCategory() {
	const res = await fetch(`${API_BASE_URL}/categorias`);
	if (!res.ok) {
		throw new Error("Error fetching fungi list");
	}
	return res.json();
}

export async function getCategoryByCode(title) {
	const res = await fetch(`${API_BASE_URL}/categorias/${encodeURIComponent(title)}`);
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

export async function getCategoryByName(name) {
	const res = await fetch(`${API_BASE_URL}/categorias`);
	if (!res.ok) {
		throw new Error("Error fetching categories");
	}
	const categories = await res.json();

	// Buscar por title
	let	category = categories.find(cat => (cat.title && cat.title.toLowerCase() === name.toLowerCase()));
    
	if (!category) {
		throw new Error(`Category "${name}" not found`);
	}
	return category;
}

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
			// Si ya existe, actualizar en lugar de crear (usar title como identificador)
			console.log(`Category exists (409), updating: ${category.title}`);
			try {
				const result = await updateCategory(category.title, category);
				console.log(`Successfully updated category ${category.title}`);
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

export async function updateCategory(title, updates) {
	const res = await fetch(`${API_BASE_URL}/categorias/${encodeURIComponent(title)}`, {
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
