const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sqlFilePath = path.join(__dirname, '../data/cocmi_backup_v2.sql');

function parseValues(valuesStr) {
  const values = [];
  let currentVal = '';
  let inQuote = false;
  
  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    
    if (char === "'" && (i === 0 || valuesStr[i-1] !== '\\')) {
      inQuote = !inQuote;
      continue; 
    }
    
    if (char === ',' && !inQuote) {
      values.push(cleanValue(currentVal));
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  values.push(cleanValue(currentVal));
  return values;
}

function cleanValue(val) {
  val = val.trim();
  if (val === 'NULL') return null;
  if (val.startsWith("'") && val.endsWith("'")) {
    return val.substring(1, val.length - 1).replace(/\\'/g, "'");
  }
  if (!isNaN(val) && val !== '') return Number(val);
  return val;
}

async function main() {
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  const extractData = (tableName) => {
    const regex = new RegExp(`INSERT INTO \`${tableName}\` VALUES\\s*([\\s\\S]*?);`, 'g');
    let match;
    const rows = [];
    
    while ((match = regex.exec(sqlContent)) !== null) {
      const valuesBlock = match[1];
      
      let depth = 0;
      let start = 0;
      let inQuote = false;
      
      for (let i = 0; i < valuesBlock.length; i++) {
        const char = valuesBlock[i];
        if (char === "'" && (i === 0 || valuesBlock[i-1] !== '\\')) {
          inQuote = !inQuote;
        }
        
        if (!inQuote) {
          if (char === '(') {
            if (depth === 0) start = i + 1;
            depth++;
          } else if (char === ')') {
            depth--;
            if (depth === 0) {
              const rowStr = valuesBlock.substring(start, i);
              rows.push(parseValues(rowStr));
            }
          }
        }
      }
    }
    return rows;
  };

  console.log('Parsing SQL...');
  
  const sitiosData = extractData('Sitios');
  const coordenadasData = extractData('Coordenadas');
  const organismosData = extractData('Organismos');
  const hongosData = extractData('Hongos');
  const colectasData = extractData('Colectas');
  const aislamientosData = extractData('Aislamientos');
  const ensayosData = extractData('EnsayosBiologicos');
  const morfologiasData = extractData('Morfologias');
  const marcadoresData = extractData('Marcadores');

  console.log(`Found:
    ${sitiosData.length} Sitios
    ${coordenadasData.length} Coordenadas
    ${organismosData.length} Organismos
    ${hongosData.length} Hongos
    ${colectasData.length} Colectas
    ${aislamientosData.length} Aislamientos
    ${ensayosData.length} Ensayos
    ${morfologiasData.length} Morfologias
    ${marcadoresData.length} Marcadores
  `);

  console.log('Cleaning database...');
  try {
    await prisma.marcadores.deleteMany();
    await prisma.morfologias.deleteMany();
    await prisma.ensayosBiologicos.deleteMany();
    await prisma.aislamientos.deleteMany();
    await prisma.colectas.deleteMany();
    await prisma.hongos.deleteMany();
    await prisma.organismos.deleteMany();
    await prisma.coordenadas.deleteMany();
    await prisma.sitios.deleteMany();
  } catch (e) {
    console.log('Error cleaning database (might be empty):', e.message);
  }

  console.log('Inserting Sitios...');
  for (const row of sitiosData) {
    await prisma.sitios.create({
      data: {
        id: row[0],
        Nombre: row[1],
        EsAreaProtegida: row[2] === 1,
        NombreAreaProtegida: row[3],
        ReferenciasAdicionales: row[4]
      }
    });
  }

  console.log('Inserting Coordenadas...');
  for (const row of coordenadasData) {
    await prisma.coordenadas.create({
      data: {
        id: row[0],
        Latitud: row[1],
        Longitud: row[2],
        Altitud: row[3]
      }
    });
  }

  console.log('Inserting Organismos...');
  for (const row of organismosData) {
    await prisma.organismos.create({
      data: {
        id: row[0],
        Tipo: row[1],
        Reino: row[2],
        Filo: row[3],
        Clase: row[4],
        Orden: row[5],
        Familia: row[6],
        Genero: row[7],
        Especie: row[8]
      }
    });
  }

  console.log('Inserting Hongos...');
  for (const row of hongosData) {
    await prisma.hongos.create({
      data: {
        id: row[0],
        MetodoIdentificacion: row[1],
        CodigoAccesoGenBank: row[2],
        IdentificadorResponsable: row[3]
      }
    });
  }

  console.log('Inserting Colectas...');
  for (const row of colectasData) {
    await prisma.colectas.create({
      data: {
        id: row[0],
        idHeredado: row[1],
        Colector: row[2],
        Fecha: row[3],
        Temperatura: row[4],
        Humedad: row[5],
        pH: row[6],
        idSitio: row[7],
        TieneCoordenadas: row[8] === 1,
        idCoordenadas: row[9],
        ContieneHospedero: row[10] === 1,
        idHospedero: row[11]
      }
    });
  }

  console.log('Inserting Aislamientos...');
  for (const row of aislamientosData) {
    const fechaAislamiento = row[4] ? new Date(row[4]).toISOString() : null;
    const fechaSalida = row[5] ? new Date(row[5]).toISOString() : null;

    await prisma.aislamientos.create({
      data: {
        id: row[0],
        idHeredado: row[1],
        AisladoDeHospedero: row[2] === 1,
        ParteDeHospedero: row[3],
        FechaAislamiento: fechaAislamiento,
        FechaSalida: fechaSalida,
        IdAnalisisMolecular: row[6],
        MedioCultivo: row[7],
        MetodoSiembra: row[8],
        Estado: row[9],
        Comentarios: row[10],
        CantidadExistencias: row[11],
        EstaEnColeccion: row[12] === 1,
        idColecta: row[13],
        idOrganismo: row[14]
      }
    });
  }

  console.log('Inserting EnsayosBiologicos...');
  for (const row of ensayosData) {
    await prisma.ensayosBiologicos.create({
      data: {
        id: row[0],
        idAislamiento: row[1],
        Tipo: row[2],
        Resultado: row[3]
      }
    });
  }

  console.log('Inserting Morfologias...');
  for (const row of morfologiasData) {
    await prisma.morfologias.create({
      data: {
        id: row[0],
        idAislamiento: row[1],
        Forma: row[2],
        FormaBorde: row[3],
        ColorAnverso: row[4],
        ColorReverso: row[5],
        ColorBorde: row[6],
        TieneMicelioAereo: row[7] === 1,
        DensidadMicelioAereo: row[8],
        TipoCrecimiento: row[9],
        TipoHifa: row[10],
        TieneSecreciones: row[11] === 1,
        Observaciones: row[12]
      }
    });
  }

  console.log('Inserting Marcadores...');
  for (const row of marcadoresData) {
    await prisma.marcadores.create({
      data: {
        id: row[0],
        idHongo: row[1],
        Tipo: row[2],
        Secuencia: row[3]
      }
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
