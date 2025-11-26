import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/hongos.json');

async function main() {
  console.log('Start seeding...');

  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const hongosData = JSON.parse(raw);

    for (const item of hongosData) {
      // 1. Crear Sitio
      const sitio = await prisma.sitios.create({
        data: {
          Nombre: item.location,
          EsAreaProtegida: !!item.protectedArea,
          NombreAreaProtegida: item.protectedArea || null,
          ReferenciasAdicionales: item.exactSite || null,
        },
      });

      // 2. Crear Organismo (Hongo)
      // Nota: El JSON tiene info taxonómica que mapeamos a Organismos
      const organismo = await prisma.organismos.create({
        data: {
          Tipo: 'Hongo',
          Reino: item.kingdom,
          Filo: null, // No está en el JSON
          Clase: item.class,
          Orden: item.order,
          Familia: item.family,
          Genero: item.genus,
          Especie: item.species,
        },
      });

      // 3. Crear entrada en tabla Hongos (vinculada al Organismo)
      await prisma.hongos.create({
        data: {
          id: organismo.id,
          MetodoIdentificacion: 'Observación directa', // Valor por defecto
          CodigoAccesoGenBank: null,
          IdentificadorResponsable: item.collector,
        },
      });

      // 4. Crear Colecta
      // Parsear temperatura "16 C" -> 16.0
      const temp = item.temperature ? parseFloat(item.temperature.replace(' C', '')) : null;

      const colecta = await prisma.colectas.create({
        data: {
          idHeredado: item.collectionNumber, // Usamos collectionNumber como idHeredado de colecta
          Colector: item.collector,
          Fecha: new Date(), // Fecha actual por defecto
          Temperatura: temp,
          Humedad: null,
          pH: null,
          idSitio: sitio.id,
          TieneCoordenadas: false,
          ContienePlanta: false,
          // No vinculamos idPlanta porque este organismo es un Hongo, no la planta hospedera
        },
      });

      // 5. Crear Aislamiento
      // Usamos el 'code' principal del JSON como idHeredado del aislamiento
      await prisma.aislamientos.create({
        data: {
          idHeredado: item.code,
          AisladoDePlanta: false,
          FechaAislamiento: new Date(),
          Estado: 'Activo',
          CantidadExistencias: item.quantity ? parseInt(item.quantity) : 1,
          EstaEnColeccion: true,
          idColecta: colecta.id,
          idOrganismo: organismo.id, // Vinculamos el organismo
        },
      });

      console.log(`Created entry for ${item.name} (Code: ${item.code})`);
    }

    console.log('Seeding finished.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
