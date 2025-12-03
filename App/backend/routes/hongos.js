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
						Hospedero: true,
						Coordenadas: true
					}
				},
				Morfologias: true,
				EnsayosBiologicos: true 
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

// ==========================================
// CREACIÓN DE REGISTROS (NUEVOS ENDPOINTS)
// ==========================================

// 1. Crear Colecta (con Sitio, Coordenadas, Hospedero opcional)
router.post("/colecta", async (req, res) => {
	try {
		const data = req.body;
		
		// Crear Coordenadas si existen
		let idCoordenadas = null;
		if (data.coordenadas && (data.coordenadas.latitud || data.coordenadas.longitud)) {
			const coords = await prisma.coordenadas.create({
				data: {
					Latitud: parseFloat(data.coordenadas.latitud),
					Longitud: parseFloat(data.coordenadas.longitud),
					Altitud: parseInt(data.coordenadas.altitud) || null
				}
			});
			idCoordenadas = coords.id;
		}

		// Crear Sitio si existe
		let idSitio = null;
		if (data.sitio && data.sitio.nombre) {
			const sitio = await prisma.sitios.create({
				data: {
					Nombre: data.sitio.nombre,
					EsAreaProtegida: data.sitio.esAreaProtegida,
					NombreAreaProtegida: data.sitio.nombreAreaProtegida,
					ReferenciasAdicionales: data.sitio.referenciasAdicionales
				}
			});
			idSitio = sitio.id;
		}

		// Crear Hospedero si existe
		let idHospedero = null;
		if (data.organismo && data.organismo.reino) { // Asumiendo que si hay reino, hay hospedero
			const hospedero = await prisma.organismos.create({
				data: {
					Tipo: "Hospedero",
					Reino: data.organismo.reino,
					Filo: data.organismo.filo,
					Clase: data.organismo.clase,
					Orden: data.organismo.orden,
					Familia: data.organismo.familia,
					Genero: data.organismo.genero,
					Especie: data.organismo.especie
				}
			});
			idHospedero = hospedero.id;
		}

		// Crear Colecta
		const colecta = await prisma.colectas.create({
			data: {
				idHeredado: data.codigoColecta,
				Colector: data.colector,
				Fecha: data.fechaColecta ? new Date(data.fechaColecta) : null,
				Temperatura: parseFloat(data.temperatura) || null,
				Humedad: parseFloat(data.humedad) || null,
				pH: parseFloat(data.ph) || null,
				TieneCoordenadas: !!idCoordenadas,
				idCoordenadas: idCoordenadas,
				idSitio: idSitio,
				ContieneHospedero: !!idHospedero,
				idHospedero: idHospedero
			}
		});

		res.status(201).json(colecta);
	} catch (error) {
		console.error("Error creating colecta:", error);
		res.status(500).json({ message: "Error creating colecta", error: error.message });
	}
});

// 2. Crear Aislamiento (Vinculado a Colecta existente o nueva)
router.post("/aislamiento", async (req, res) => {
	try {
		const data = req.body;
		let idColecta = data.idColectaExistente || data.idColecta;

		// Si es nueva colecta, crearla primero (lógica simplificada, idealmente reutilizar función)
		if (data.isNewColecta) {
			// ... Repetir lógica de creación de colecta o llamar a servicio interno ...
			// Por brevedad, asumimos que el frontend llama a /colecta primero o implementamos aquí:
			
			// (Implementación inline rápida para nueva colecta)
			let idCoordenadas = null;
			if (data.coordenadas && (data.coordenadas.latitud || data.coordenadas.longitud)) {
				const coords = await prisma.coordenadas.create({
					data: {
						Latitud: parseFloat(data.coordenadas.latitud),
						Longitud: parseFloat(data.coordenadas.longitud),
						Altitud: parseInt(data.coordenadas.altitud) || null
					}
				});
				idCoordenadas = coords.id;
			}
			let idSitio = null;
			if (data.sitio && data.sitio.nombre) {
				const sitio = await prisma.sitios.create({
					data: {
						Nombre: data.sitio.nombre,
						EsAreaProtegida: data.sitio.esAreaProtegida,
						NombreAreaProtegida: data.sitio.nombreAreaProtegida,
						ReferenciasAdicionales: data.sitio.referenciasAdicionales
					}
				});
				idSitio = sitio.id;
			}
			let idHospedero = null;
			if (data.organismo && data.organismo.reino) {
				const hospedero = await prisma.organismos.create({
					data: {
						Tipo: "Hospedero",
						Reino: data.organismo.reino,
						Filo: data.organismo.filo,
						Clase: data.organismo.clase,
						Orden: data.organismo.orden,
						Familia: data.organismo.familia,
						Genero: data.organismo.genero,
						Especie: data.organismo.especie
					}
				});
				idHospedero = hospedero.id;
			}

			const nuevaColecta = await prisma.colectas.create({
				data: {
					idHeredado: data.codigoColecta,
					Colector: data.colector,
					Fecha: data.fechaColecta ? new Date(data.fechaColecta) : null,
					idSitio, idCoordenadas, idHospedero,
					TieneCoordenadas: !!idCoordenadas,
					ContieneHospedero: !!idHospedero
				}
			});
			idColecta = nuevaColecta.id;
		}

		// Crear Aislamiento
		const aislamiento = await prisma.aislamientos.create({
			data: {
				idHeredado: data.idHeredado,
				AisladoDeHospedero: data.aisladoDeHospedero,
				ParteDeHospedero: data.parteDeHospedero,
				FechaAislamiento: data.fechaAislamiento ? new Date(data.fechaAislamiento) : null,
				FechaSalida: data.fechaSalida ? new Date(data.fechaSalida) : null,
				IdAnalisisMolecular: data.idAnalisisMolecular,
				MedioCultivo: data.medioCultivo,
				MetodoSiembra: data.metodoSiembra,
				Estado: data.estado,
				Comentarios: data.comentarios,
				CantidadExistencias: parseInt(data.cantidadExistencias) || 0,
				EstaEnColeccion: data.enColeccion,
				idColecta: idColecta
			}
		});

		res.status(201).json(aislamiento);
	} catch (error) {
		console.error("Error creating aislamiento:", error);
		res.status(500).json({ message: "Error creating aislamiento", error: error.message });
	}
});

// 3. Registrar Hongo (Organismo + Hongo + Marcadores)
router.post("/hongo", async (req, res) => {
	try {
		const data = req.body;

		// Crear Organismo
		const organismo = await prisma.organismos.create({
			data: {
				Tipo: "Hongo",
				Reino: data.reino,
				Filo: data.filo,
				Clase: data.clase,
				Orden: data.orden,
				Familia: data.familia,
				Genero: data.genero,
				Especie: data.especie
			}
		});

		// Crear Hongo
		await prisma.hongos.create({
			data: {
				id: organismo.id, // Comparten ID
				MetodoIdentificacion: data.metodoIdentificacion,
				CodigoAccesoGenBank: data.codigoAccesoGenBank,
				IdentificadorResponsable: data.responsableIdentificacion
			}
		});

		// Crear Marcador si existe
		if (data.tieneMarcadores && data.marcador?.tipoMarcador) {
			await prisma.marcadores.create({
				data: {
					idHongo: organismo.id,
					Tipo: data.marcador.tipoMarcador,
					Secuencia: data.marcador.secuenciaTexto
				}
			});
		}

		// 🔥 Vincular al Aislamiento usando idHeredado
		if (data.idRelacionado) {
			const aislamiento = await prisma.aislamientos.findFirst({
				where: { idHeredado: data.idRelacionado }
			});

			if (aislamiento) {
				await prisma.aislamientos.update({
					where: { id: aislamiento.id },
					data: { 
						idOrganismo: organismo.id
					} 
				});
			} else {
				console.warn(`No se encontró un aislamiento con idHeredado ${data.idRelacionado}`);
			}
		}

		res.status(201).json({
			message: "Hongo registrado y vínculo creado correctamente",
			idOrganismo: organismo.id
		});

	} catch (error) {
		console.error("Error creating hongo:", error);
		res.status(500).json({
			message: "Error creating hongo",
			error: error.message
		});
	}
});

// 4. Agregar Morfología
router.post("/morfologia", async (req, res) => {
	try {
		const data = req.body;
		
		// Buscar aislamiento por idHeredado
		const aislamiento = await prisma.aislamientos.findFirst({
			where: { idHeredado: data.idRelacionado }
		});

		if (!aislamiento) {
			return res.status(404).json({ message: "Aislamiento no encontrado" });
		}

		const morfologia = await prisma.morfologias.create({
			data: {
				idAislamiento: aislamiento.id,
				Forma: data.forma,
				FormaBorde: data.formaBorde,
				ColorAnverso: data.colorAnverso,
				ColorReverso: data.colorReverso,
				ColorBorde: data.colorBorde,
				TieneMicelioAereo: data.tieneMicelioAereo,
				DensidadMicelioAereo: data.densidadMicelioAereo,
				TipoCrecimiento: data.tipoCrecimiento,
				TipoHifa: data.tipoHifa,
				TieneSecreciones: data.tieneSecreciones,
				Observaciones: data.observaciones
			}
		});

		res.status(201).json(morfologia);
	} catch (error) {
		console.error("Error creating morfologia:", error);
		res.status(500).json({ message: "Error creating morfologia", error: error.message });
	}
});

// 5. Agregar Ensayo Biológico
router.post("/ensayo", async (req, res) => {
	try {
		const data = req.body;

		const aislamiento = await prisma.aislamientos.findFirst({
			where: { idHeredado: data.idRelacionado }
		});

		if (!aislamiento) {
			return res.status(404).json({ message: "Aislamiento no encontrado" });
		}

		const ensayo = await prisma.ensayosBiologicos.create({
			data: {
				idAislamiento: aislamiento.id,
				Tipo: data.tipoEnsayo,
				Resultado: data.resultadoEnsayo
			}
		});

		res.status(201).json(ensayo);
	} catch (error) {
		console.error("Error creating ensayo:", error);
		res.status(500).json({ message: "Error creating ensayo", error: error.message });
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
				Colecta: { include: { Sitio: true, Hospedero: true } },
				Morfologias: true
			}
		});

		if (!existing) {
			return res.status(404).json({ message: "Fungus not found" });
		}

		// 2. Actualizar Organismo (Hongo asociado al Aislamiento)
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
						// Si ya existe un marcador, actualizarlo
						if (existing.Organismo.Hongo.Marcadores && existing.Organismo.Hongo.Marcadores.length > 0) {
							await prisma.marcadores.update({
								where: { id: existing.Organismo.Hongo.Marcadores[0].id },
								data: {
									Tipo: m.Tipo,
									Secuencia: m.Secuencia
								}
							});
						} else {
							// Si no existe, crearlo
							await prisma.marcadores.create({
								data: {
									idHongo: existing.idOrganismo,
									Tipo: m.Tipo,
									Secuencia: m.Secuencia
								}
							});
						}
					}
				}
			}
		}

		// 2.1 Actualizar Organismo (Hospedero de la Colecta)
		// NOTA: Antes actualizábamos el Organismo del Aislamiento (Hongo). Ahora actualizamos el Hospedero de la Colecta si existe.
		if (data.Colecta && data.Colecta.Hospedero && existing.Colecta && existing.Colecta.idHospedero) {
			await prisma.organismos.update({
				where: { id: existing.Colecta.idHospedero },
				data: {
					Reino: data.Colecta.Hospedero.Reino,
					Filo: data.Colecta.Hospedero.Filo,
					Clase: data.Colecta.Hospedero.Clase,
					Orden: data.Colecta.Hospedero.Orden,
					Familia: data.Colecta.Hospedero.Familia,
					Genero: data.Colecta.Hospedero.Genero,
					Especie: data.Colecta.Hospedero.Especie,
				}
			});
		}

		// 3. Actualizar Colecta
		if (data.Colecta && existing.idColecta) {
			await prisma.colectas.update({
				where: { id: existing.idColecta },
				data: {
					idHeredado: data.Colecta.idHeredado,
					Fecha: data.Colecta.Fecha ? new Date(data.Colecta.Fecha) : undefined,
					Colector: data.Colecta.Colector,
					Temperatura: data.Colecta.Temperatura ? parseFloat(data.Colecta.Temperatura) : null,
					Humedad: data.Colecta.Humedad ? parseFloat(data.Colecta.Humedad) : null,
					pH: data.Colecta.pH ? parseFloat(data.Colecta.pH) : null,
				}
			});

			// Actualizar Sitio
			if (data.Colecta.Sitio && existing.Colecta.idSitio) {
				await prisma.sitios.update({
					where: { id: existing.Colecta.idSitio },
					data: {
						Nombre: data.Colecta.Sitio.Nombre,
						NombreAreaProtegida: data.Colecta.Sitio.NombreAreaProtegida,
						EsAreaProtegida: data.Colecta.Sitio.EsAreaProtegida,
						ReferenciasAdicionales: data.Colecta.Sitio.ReferenciasAdicionales
					}
				});
			}

			// Actualizar Hospedero Asociada
			if (data.Colecta.Hospedero && existing.Colecta.idHospedero) {
				await prisma.organismos.update({
					where: { id: existing.Colecta.idHospedero },
					data: {
						Reino: data.Colecta.Hospedero.Reino,
						Filo: data.Colecta.Hospedero.Filo,
						Clase: data.Colecta.Hospedero.Clase,
						Orden: data.Colecta.Hospedero.Orden,
						Familia: data.Colecta.Hospedero.Familia,
						Genero: data.Colecta.Hospedero.Genero,
						Especie: data.Colecta.Hospedero.Especie,
					}
				});
			}
		}

		// 4. Actualizar Aislamiento (Campos propios y Relaciones)
		await prisma.aislamientos.update({
			where: { id: existing.id },
			data: {
				MedioCultivo: data.MedioCultivo,
				MetodoSiembra: data.MetodoSiembra,
				Estado: data.Estado,
				ParteDeHospedero: data.ParteDeHospedero,
				FechaAislamiento: data.FechaAislamiento ? new Date(data.FechaAislamiento) : undefined,
				FechaSalida: data.FechaSalida ? new Date(data.FechaSalida) : undefined,
				CantidadExistencias: data.CantidadExistencias ? parseInt(data.CantidadExistencias) : undefined,
				Comentarios: data.Comentarios,
				EstaEnColeccion: data.EstaEnColeccion,
				// Permitir cambiar la Colecta asociada si se envía un ID
				idColecta: data.idColecta ? data.idColecta : undefined
			}
		});

		// 5. Actualizar Morfología (Simplificación: solo la primera)
		if (data.Morfologias && data.Morfologias.length > 0) {
			const m = data.Morfologias[0];
			if (existing.Morfologias && existing.Morfologias.length > 0) {
				await prisma.morfologias.update({
					where: { id: existing.Morfologias[0].id },
					data: {
						Forma: m.Forma,
						FormaBorde: m.FormaBorde,
						ColorAnverso: m.ColorAnverso,
						ColorReverso: m.ColorReverso,
						ColorBorde: m.ColorBorde,
						TieneMicelioAereo: m.TieneMicelioAereo,
						DensidadMicelioAereo: m.DensidadMicelioAereo,
						TipoCrecimiento: m.TipoCrecimiento,
						TipoHifa: m.TipoHifa,
						TieneSecreciones: m.TieneSecreciones,
						Observaciones: m.Observaciones
					}
				});
			} else {
				// Si no existe, crearla
				await prisma.morfologias.create({
					data: {
						idAislamiento: existing.id,
						Forma: m.Forma,
						FormaBorde: m.FormaBorde,
						ColorAnverso: m.ColorAnverso,
						ColorReverso: m.ColorReverso,
						ColorBorde: m.ColorBorde,
						TieneMicelioAereo: m.TieneMicelioAereo,
						DensidadMicelioAereo: m.DensidadMicelioAereo,
						TipoCrecimiento: m.TipoCrecimiento,
						TipoHifa: m.TipoHifa,
						TieneSecreciones: m.TieneSecreciones,
						Observaciones: m.Observaciones
					}
				});
			}
		}

		// Retornar el objeto actualizado
		const updatedFungus = await prisma.aislamientos.findFirst({
			where: { idHeredado: code },
			include: {
				Organismo: { include: { Hongo: { include: { Marcadores: true } } } },
				Colecta: { include: { Sitio: true, Hospedero: true } },
				Morfologias: true
			}
		});

		res.json(updatedFungus);

	} catch (err) {
		console.error("Error updating fungus in DB:", err);
		res.status(500).json({ message: "Error updating data in database" });
	}
});

router.delete("/:code", async (req, res) => {
	const { code } = req.params;
	try {
		const aislamiento = await prisma.aislamientos.findUnique({
			where: { idHeredado: code }
		});

		if (!aislamiento) {
			return res.status(404).json({ message: "Fungus not found" });
		}

		// Delete Aislamiento (Cascades to Morfologias, Ensayos)
		await prisma.aislamientos.delete({
			where: { id: aislamiento.id }
		});

		// Clean up Organismo if it was specific to this isolation
		if (aislamiento.idOrganismo) {
			const others = await prisma.aislamientos.count({
				where: { idOrganismo: aislamiento.idOrganismo }
			});
			if (others === 0) {
				try {
					// Delete Hongo first (if exists)
					await prisma.hongos.delete({ where: { id: aislamiento.idOrganismo } }).catch(() => {});
					// Delete Organismo
					await prisma.organismos.delete({ where: { id: aislamiento.idOrganismo } }).catch(() => {});
				} catch (e) {
					console.warn("Could not cleanup organism", e);
				}
			}
		}

		res.json({ message: "Fungus deleted successfully" });
	} catch (error) {
		console.error("Error deleting fungus:", error);
		res.status(500).json({ message: "Error deleting fungus" });
	}
});

// ==========================================
// LISTAS PARA DROPDOWNS (HELPER ENDPOINTS)
// ==========================================

router.get("/list/colectas", async (req, res) => {
	try {
		const colectas = await prisma.colectas.findMany({
			select: { id: true, idHeredado: true, Colector: true, Fecha: true }
		});
		res.json(colectas);
	} catch (error) {
		res.status(500).json({ message: "Error fetching colectas" });
	}
});

router.get("/list/sitios", async (req, res) => {
	try {
		const sitios = await prisma.sitios.findMany({
			select: { id: true, Nombre: true, NombreAreaProtegida: true }
		});
		res.json(sitios);
	} catch (error) {
		res.status(500).json({ message: "Error fetching sitios" });
	}
});

router.get("/list/hospederos", async (req, res) => {
	try {
		const hospederos = await prisma.organismos.findMany({
			where: { Tipo: "Hospedero" },
			select: { id: true, Genero: true, Especie: true, Familia: true }
		});
		res.json(hospederos);
	} catch (error) {
		res.status(500).json({ message: "Error fetching hospederos" });
	}
});

router.get("/list/aislamientos", async (req, res) => {
	try {
		const aislamientos = await prisma.aislamientos.findMany({
			select: { id: true, idHeredado: true, MedioCultivo: true, FechaAislamiento: true, idOrganismo: true }
		});
		res.json(aislamientos);
	} catch (error) {
		res.status(500).json({ message: "Error fetching aislamientos" });
	}
});

export default router;

