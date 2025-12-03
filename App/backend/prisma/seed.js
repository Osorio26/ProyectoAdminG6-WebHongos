import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const jsonPath = path.join(__dirname, '../data/hongos.json');
  console.log(`Reading JSON data from ${jsonPath}...`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error("JSON file not found!");
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const fungiData = JSON.parse(rawData);

  console.log(`Found ${fungiData.length} records to seed.`);

  // Clean existing data
  console.log('Cleaning existing data...');
  try {
    await prisma.ensayosBiologicos.deleteMany({});
    await prisma.morfologias.deleteMany({});
    await prisma.marcadores.deleteMany({});
    await prisma.aislamientos.deleteMany({});
    await prisma.colectas.deleteMany({});
    await prisma.hongos.deleteMany({});
    await prisma.organismos.deleteMany({});
    await prisma.sitios.deleteMany({});
    await prisma.coordenadas.deleteMany({});
  } catch (e) {
    console.warn("Error cleaning data:", e.message);
  }

  for (const item of fungiData) {
    try {
      // 1. Create Sitio
      const sitio = await prisma.sitios.create({
        data: {
          Nombre: item.exactSite || "Sitio Desconocido",
          NombreAreaProtegida: item.protectedArea || null,
          EsAreaProtegida: !!item.protectedArea,
          ReferenciasAdicionales: item.location || null
        }
      });

      // 2. Create Colecta
      const colecta = await prisma.colectas.create({
        data: {
          idHeredado: item.collectionNumber || `COL-${item.code}`,
          Colector: item.collector || "Desconocido",
          Temperatura: item.temperature ? parseFloat(item.temperature.replace(/[^\d.-]/g, '')) : null,
          TieneCoordenadas: false,
          ContieneHospedero: false,
          idSitio: sitio.id
        }
      });

      // 3. Create Organismo (Hongo)
      const organismo = await prisma.organismos.create({
        data: {
          Tipo: "Hongo",
          Reino: item.kingdom || "Fungi",
          Clase: item.class,
          Orden: item.order,
          Familia: item.family,
          Genero: item.genus,
          Especie: item.species
        }
      });

      // 4. Create Hongo details
      await prisma.hongos.create({
        data: {
          id: organismo.id,
          // Default values or empty for now
        }
      });

      // 5. Create Aislamiento
      await prisma.aislamientos.create({
        data: {
          idHeredado: item.code,
          idColecta: colecta.id,
          idOrganismo: organismo.id,
          AisladoDeHospedero: false,
          CantidadExistencias: 1, // Default
          Comentarios: `Cantidad original: ${item.quantity}`,
          EstaEnColeccion: true
        }
      });

      console.log(`Seeded: ${item.name} (${item.code})`);

    } catch (error) {
      console.error(`Error seeding item ${item.code}:`, error.message);
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
