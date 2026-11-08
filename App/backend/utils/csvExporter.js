import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import prisma from '../prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine CSV directory based on DATABASE_URL if available, otherwise default to local prisma folder
let CSV_DIR;
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
  // Remove 'file:' prefix. Handle potential 'file://' or just 'file:'
  let dbPath = process.env.DATABASE_URL.replace(/^file:\/\//, '').replace(/^file:/, '');
  
  // On Windows, if it starts with /C:/, remove the leading /
  if (process.platform === 'win32' && dbPath.startsWith('/') && dbPath.includes(':')) {
      dbPath = dbPath.substring(1);
  }
  
  // If it's a relative path like ./dev.db, resolve it relative to CWD (which might be backend root)
  if (!path.isAbsolute(dbPath)) {
     // In dev, CWD is usually App/backend. In prod, it might be different, but let's assume standard resolution
     dbPath = path.resolve(process.cwd(), dbPath);
  }

  const dbDir = path.dirname(dbPath);
  CSV_DIR = path.join(dbDir, 'csv');
} else {
  // Fallback
  CSV_DIR = path.join(__dirname, '..', 'prisma', 'csv');
}

console.log(`CSV Export Directory: ${CSV_DIR}`);

const models = [
  'Sitios',
  'Coordenadas',
  'Organismos',
  'Hongos',
  'Colectas',
  'Aislamientos',
  'EnsayosBiologicos',
  'Morfologias',
  'Marcadores'
];

function convertToCSV(data) {
  if (!data || data.length === 0) {
    return '';
  }
  // Get all unique keys from all objects to ensure columns align even if some objects miss keys
  const allKeys = new Set();
  data.forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));
  const header = Array.from(allKeys);
  
  const csvHeader = header.join(',');

  const rows = data.map(row => {
    return header.map(fieldName => {
      const value = row[fieldName];
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if necessary
        const stringValue = value.replace(/"/g, '""');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
          return `"${stringValue}"`;
        }
        return stringValue;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }).join(',');
  });
  
  return [csvHeader, ...rows].join('\n');
}

export async function exportAllTablesToCSV() {
  try {
    if (!fs.existsSync(CSV_DIR)) {
      fs.mkdirSync(CSV_DIR, { recursive: true });
    }

    console.log('Starting CSV export...');

    for (const modelName of models) {
      // Prisma client model names are usually lowercase or camelCase in the client instance
      // e.g. prisma.sitios, prisma.coordenadas
      const clientModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
      
      if (!prisma[clientModelName]) {
        console.warn(`Model ${clientModelName} not found in prisma client.`);
        continue;
      }

      const data = await prisma[clientModelName].findMany();
      const csvContent = convertToCSV(data);
      
      const filePath = path.join(CSV_DIR, `${modelName}.csv`);
      fs.writeFileSync(filePath, csvContent, 'utf8');
      console.log(`Exported ${modelName}.csv`);
    }

    console.log('CSV export completed successfully.');
  } catch (error) {
    console.error('Error exporting CSVs:', error);
  }
}

/**
 * Exportación por tablas (GET /hongos/export-csv-zip): un ZIP con un CSV por
 * tabla, con las columnas tal como están en la base (Id UUID, llaves foráneas,
 * booleanos true/false, fechas ISO), sin unir las tablas entre sí.
 *
 * El botón "Descargar CSV" ya no la usa: usa exportCombinedCSV() (más abajo).
 * Se conserva mientras se coordina con el equipo que la creó si se elimina.
 */
export async function exportAllTablesToZip(res) {
  try {

    const archive = archiver('zip', { zlib: { level: 9 } });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="hongos_export.zip"');

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    for (const modelName of models) {
      const clientModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);

      if (!prisma[clientModelName]) {
        console.warn(`Model ${clientModelName} not found in prisma client.`);
        continue;
      }

      const data = await prisma[clientModelName].findMany();
      const csvContent = convertToCSV(data);
      archive.append(csvContent, { name: `${modelName}.csv` });
    }

    await archive.finalize();
  } catch (error) {
    console.error('Error exporting CSV ZIP:', error);
    res.status(500).json({ message: 'Error exporting CSV ZIP', error: error.message });
  }
}

// Consulta de la exportación combinada (un solo CSV). Vive en un archivo .sql
// aparte para poder leerla y probarla directamente en un cliente SQLite.
const COMBINED_EXPORT_SQL_PATH = path.join(__dirname, 'consultaExportacion.sql');

/**
 * Exportación combinada (GET /hongos/export-csv): un solo archivo CSV con una
 * fila por aislamiento. Es la que usa el botón "Descargar CSV".
 *
 * Diferencias con exportAllTablesToZip():
 *   - Un solo .csv en vez de un ZIP con un CSV por tabla.
 *   - Las tablas vienen unidas: cada fila trae el aislamiento con la taxonomía
 *     de su hongo, su colecta, el hospedero, el sitio y las coordenadas.
 *   - Morfologías, ensayos biológicos y marcadores se agregan en una sola celda
 *     cada uno (separados por " | "), así que no se duplican filas.
 *   - No incluye los Id internos (UUID) ni las llaves foráneas: usa los códigos
 *     heredados (IdHeredado) de aislamientos y colectas.
 *   - Booleanos como "Sí"/"No" y fechas de aislamiento como AAAA-MM-DD.
 *   - Empieza con BOM UTF-8 para que Excel muestre bien las tildes.
 *
 * Las columnas y su formato se definen en utils/consultaExportacion.sql.
 */
export async function exportCombinedCSV(res) {
  try {
    const sql = fs.readFileSync(COMBINED_EXPORT_SQL_PATH, 'utf8');
    const rows = await prisma.$queryRawUnsafe(sql);

    // Prisma 5 devuelve los enteros de SQLite como BigInt en las consultas
    // crudas; se pasan a Number para poder escribirlos en el CSV.
    const data = rows.map(row => {
      const clean = {};
      for (const [key, value] of Object.entries(row)) {
        clean[key] = typeof value === 'bigint' ? Number(value) : value;
      }
      return clean;
    });

    const csvContent = '\uFEFF' + convertToCSV(data);
    const fecha = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="cocmi_export_${fecha}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error al exportar el CSV combinado:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al exportar el CSV', error: error.message });
    }
  }
}
