import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const sqlPath = path.join(__dirname, '../data/cocmi_backup_v2.sql');
  console.log(`Reading SQL dump from ${sqlPath}...`);
  
  if (!fs.existsSync(sqlPath)) {
    console.error("SQL file not found!");
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

  // Split by semicolon at the end of lines to separate statements
  const statements = sqlContent.split(/;\s*[\r\n]+/);

  console.log(`Found ${statements.length} potential statements.`);

  // Clean existing data
  console.log('Cleaning existing data...');
  try {
    // Order matters for foreign keys
    await prisma.$executeRawUnsafe(`DELETE FROM EnsayosBiologicos;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Morfologias;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Marcadores;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Aislamientos;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Colectas;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Hongos;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Organismos;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Sitios;`);
    await prisma.$executeRawUnsafe(`DELETE FROM Coordenadas;`);
  } catch (e) {
    console.warn("Error cleaning data (tables might not exist or other error):", e.message);
  }

  // Disable foreign keys to allow out-of-order insertion
  try {
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
    console.log("Foreign keys disabled.");
  } catch (e) {
    console.warn("Could not disable foreign keys:", e.message);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    let trimmed = statement.trim();
    if (trimmed.toUpperCase().startsWith('INSERT INTO')) {
      // Fix for Aislamientos table mismatch (15 values in dump vs 16 columns in DB)
      // The dump is missing 'IdOrganismo', so we explicitly list the other 15 columns.
      if (trimmed.startsWith('INSERT INTO `Aislamientos` VALUES')) {
        trimmed = trimmed.replace(
          'INSERT INTO `Aislamientos` VALUES', 
          'INSERT INTO `Aislamientos` (Id, IdHeredado, AisladoDePlanta, ParteDePlanta, FechaAislamiento, FechaSalida, IdAnalisisMolecular, MedioCultivo, MetodoSiembra, Estado, Comentarios, CantidadExistencias, EstaEnColeccion, IdColecta, IdHongo) VALUES'
        );
      }

      try {
        // Execute the raw INSERT statement
        await prisma.$executeRawUnsafe(trimmed);
        successCount++;
        if (successCount % 100 === 0) process.stdout.write('.');
      } catch (e) {
        errorCount++;
        // Only log unique errors to avoid spamming
        if (errorCount < 10) {
            console.error(`\nFailed to execute statement starting with: ${trimmed.substring(0, 50)}...`);
            console.error(`Error: ${e.message}`);
        }
      }
    }
  }

  console.log(`\nSeeding completed.`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  try {
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
    console.log("Foreign keys enabled.");
  } catch (e) {
    console.warn("Could not enable foreign keys:", e.message);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
