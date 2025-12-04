import fs from 'fs';
import path from 'path';
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
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
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
