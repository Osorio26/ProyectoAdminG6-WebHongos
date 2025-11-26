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

router.put("/:code", async (req, res) => {
	const { code } = req.params;
	const data = req.body;

	try {
		// 1. Buscar el registro existente para obtener IDs de relaciones
		const existing = await prisma.aislamientos.findFirst({
			where: { idHeredado: code },
			include: {
				Organismo: { include: { Hongo: { include: { Marcadores: true } } } },
				Colecta: { include: { Sitio: true, Planta: true } },
				Morfologias: true
			}
		});

		if (!existing) {
			return res.status(404).json({ message: "Fungus not found" });
		}

		// 2. Actualizar Organismo
		if (data.Organismo && existing.idOrganismo) {
			await prisma.organismos.update({
				where: { id: existing.idOrganismo },
				data: {
					Reino: data.Organismo.Reino,
					Filo: data.Organismo.Filo,
					Clase: data.Organismo.Clase,
					Orden: data.Organismo.Orden,
					Familia: data.Organismo.Familia,
					Genero: data.Organismo.Genero,
					Especie: data.Organismo.Especie,
				}
			});

			// Actualizar Hongo (si aplica)
			if (existing.Organismo.Tipo === 'Hongo' && data.Organismo.Hongo) {
				// Hongo comparte ID con Organismo
				const hongoExists = await prisma.hongos.findUnique({ where: { id: existing.idOrganismo } });
				if (hongoExists) {
					await prisma.hongos.update({
						where: { id: existing.idOrganismo },
						data: {
							MetodoIdentificacion: data.Organismo.Hongo.MetodoIdentificacion,
							CodigoAccesoGenBank: data.Organismo.Hongo.CodigoAccesoGenBank,
							IdentificadorResponsable: data.Organismo.Hongo.IdentificadorResponsable
						}
					});

					// Actualizar Marcadores (Simplificación: solo el primero)
					if (data.Organismo.Hongo.Marcadores && data.Organismo.Hongo.Marcadores.length > 0) {
						const m = data.Organismo.Hongo.Marcadores[0];
						if (existing.Organismo.Hongo.Marcadores && existing.Organismo.Hongo.Marcadores.length > 0) {
							await prisma.marcadores.update({
								where: { id: existing.Organismo.Hongo.Marcadores[0].id },
								data: {
									Tipo: m.Tipo,
									Secuencia: m.Secuencia
								}
							});
						}
					}
				}
			}
		}

		// 3. Actualizar Colecta
		if (data.Colecta && existing.idColecta) {
			await prisma.colectas.update({
				where: { id: existing.idColecta },
				data: {
					idHeredado: data.Colecta.idHeredado,
					Fecha: data.Colecta.Fecha ? new Date(data.Colecta.Fecha) : undefined,
					Colector: data.Colecta.Colector,
					Temperatura: data.Colecta.Temperatura,
				}
			});

			// Actualizar Sitio
			if (data.Colecta.Sitio && existing.Colecta.idSitio) {
				await prisma.sitios.update({
					where: { id: existing.Colecta.idSitio },
					data: {
						Nombre: data.Colecta.Sitio.Nombre,
						NombreAreaProtegida: data.Colecta.Sitio.NombreAreaProtegida,
						ReferenciasAdicionales: data.Colecta.Sitio.ReferenciasAdicionales
					}
				});
			}

			// Actualizar Planta Asociada
			if (data.Colecta.Planta && existing.Colecta.idPlanta) {
				await prisma.organismos.update({
					where: { id: existing.Colecta.idPlanta },
					data: {
						Reino: data.Colecta.Planta.Reino,
						Filo: data.Colecta.Planta.Filo,
						Clase: data.Colecta.Planta.Clase,
						Orden: data.Colecta.Planta.Orden,
						Familia: data.Colecta.Planta.Familia,
						Genero: data.Colecta.Planta.Genero,
						Especie: data.Colecta.Planta.Especie,
					}
				});
			}
		}

		// 4. Actualizar Aislamiento (Campos propios)
		await prisma.aislamientos.update({
			where: { id: existing.id },
			data: {
				MedioCultivo: data.MedioCultivo,
				FechaAislamiento: data.FechaAislamiento ? new Date(data.FechaAislamiento) : undefined,
				CantidadExistencias: data.CantidadExistencias ? parseInt(data.CantidadExistencias) : undefined,
				Comentarios: data.Comentarios
			}
		});

		// 5. Actualizar Morfología (Simplificación: solo la primera)
		if (data.Morfologias && data.Morfologias.length > 0) {
			const m = data.Morfologias[0];
			if (existing.Morfologias && existing.Morfologias.length > 0) {
				await prisma.morfologias.update({
					where: { id: existing.Morfologias[0].id },
					data: {
						Observaciones: m.Observaciones,
						ColorAnverso: m.ColorAnverso,
						Forma: m.Forma
					}
				});
			}
		}

		// Retornar el objeto actualizado
		const updatedFungus = await prisma.aislamientos.findFirst({
			where: { idHeredado: code },
			include: {
				Organismo: { include: { Hongo: { include: { Marcadores: true } } } },
				Colecta: { include: { Sitio: true, Planta: true } },
				Morfologias: true
			}
		});

		res.json(updatedFungus);

	} catch (err) {
		console.error("Error updating fungus in DB:", err);
		res.status(500).json({ message: "Error updating data in database" });
	}
});

export default router;

