import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../prismaClient.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/hongos.json");

router.get("/", async (req, res) => {
	try {
		// Intentar obtener datos de la base de datos
		const aislamientos = await prisma.aislamientos.findMany({
			include: {
				Organismo: true,
				Colecta: {
					include: {
						Sitio: true
					}
				}
			}
		});
		res.json(aislamientos);
	} catch (dbError) {
		console.error("Error fetching from DB:", dbError);
		res.status(500).json({ message: "Database error" });
		/*
		// FALLBACK JSON DESACTIVADO
		console.warn("Fallo al conectar con la BD, usando fallback JSON:", dbError.message);
		try {
			const raw = fs.readFileSync(dataPath, "utf-8");
			const data = JSON.parse(raw);
			
			// Transformar JSON plano a estructura anidada para que el frontend funcione igual
			const transformedData = data.map(item => ({
				// ... (código omitido)
			}));

			res.json(transformedData);
		} catch (err) {
			console.error("Error reading hongos.json", err);
			res.status(500).json({ message: "Error reading data" });
		}
		*/
	}
});

router.get("/:code", async (req, res) => {
	try {
		// Intentar buscar en BD
		const aislamiento = await prisma.aislamientos.findFirst({
			where: { idHeredado: req.params.code },
			include: {
				Organismo: {
					include: {
						Hongo: {
							include: {
								Marcadores: true
							}
						}
					}
				},
				Colecta: {
					include: {
						Sitio: true,
						Planta: true
					}
				},
				Morfologias: true
			}
		});

		if (aislamiento) {
			return res.json(aislamiento);
		} else {
			return res.status(404).json({ message: "Fungus not found in database" });
		}

	} catch (dbError) {
		console.error("Error fetching from DB:", dbError);
		res.status(500).json({ message: "Database error" });
		/* 
		// FALLBACK JSON DESACTIVADO
		console.warn("Fallo al buscar en BD o no encontrado, usando fallback JSON:", dbError.message);
		try {
			const raw = fs.readFileSync(dataPath, "utf-8");
			const data = JSON.parse(raw);
			// ... (código omitido)
		} catch (err) {
			console.error("Error reading hongos.json", err);
			res.status(500).json({ message: "Error reading data" });
		}
		*/
	}
});

router.post("/", (req, res) => {
	try {
		const raw = fs.readFileSync(dataPath, "utf-8");
		const data = JSON.parse(raw);

		const newFungus = req.body;
		if (!newFungus || !newFungus.code) {
			return res.status(400).json({ message: "'code' is required" });
		}

		const exists = data.some((item) => item.code === newFungus.code);
		if (exists) {
			return res.status(409).json({ message: "Fungus with this code already exists" });
		}

		data.push(newFungus);
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");

		res.status(201).json(newFungus);
	} catch (err) {
		console.error("Error writing hongos.json", err);
		res.status(500).json({ message: "Error saving data" });
	}
});

router.put("/:code", (req, res) => {
	try {
		const raw = fs.readFileSync(dataPath, "utf-8");
		const data = JSON.parse(raw);
		const index = data.findIndex((item) => item.code === req.params.code);

		if (index === -1) {
			return res.status(404).json({ message: "Fungus not found" });
		}

		const updated = { ...data[index], ...req.body, code: data[index].code };
		data[index] = updated;
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");

		res.json(updated);
	} catch (err) {
		console.error("Error updating hongos.json", err);
		res.status(500).json({ message: "Error updating data" });
	}
});

export default router;

