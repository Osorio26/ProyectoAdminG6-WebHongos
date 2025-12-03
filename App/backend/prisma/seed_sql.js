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
      // Don't add the quote itself to the value if we want clean strings
      // But for now let's keep it simple and clean up later
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
  if (!isNaN(val)) return Number(val);
  return val;
}

function parseInsertStatement(line) {
  // This assumes one INSERT per line or block, but the dump has multiple values per INSERT
  // The dump format is: INSERT INTO `Table` VALUES (row1), (row2), ...;
  // We need to extract the content between VALUES and ;
}

async function main() {
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Helper to extract data for a table
  const extractData = (tableName) => {
    const regex = new RegExp(`INSERT INTO \`${tableName}\` VALUES\\s*([\\s\\S]*?);`, 'g');
    let match;
    const rows = [];
    
    while ((match = regex.exec(sqlContent)) !== null) {
      const valuesBlock = match[1];
      // Split by ),( or ),\n(
      // We need a smarter split that respects quotes
      let currentRow = '';
      let inQuote = false;
      
      for (let i = 0; i < valuesBlock.length; i++) {
        const char = valuesBlock[i];
        if (char === "'" && (i === 0 || valuesBlock[i-1] !== '\\')) {
          inQuote = !inQuote;
        }
        
        if (char === ',' && !inQuote && valuesBlock[i+1] === '(' && (valuesBlock[i-1] === ')' || valuesBlock[i-1] === '\n' || valuesBlock[i-1] === '\r')) {
             // This is a separator between rows? No, the separator is `),` or `),\n`
             // Actually, we are looking for `),` or `),\n` or `),\r\n` followed by `(`
        }
      }
      
      // Simpler approach: 
      // 1. Remove leading `(` and trailing `)`
      // 2. Split by `),\n(` or `),(` is risky.
      // Let's iterate and find the boundaries of (...)
      
      let depth = 0;
      let start = 0;
      inQuote = false;
      
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

  // --- Insertions ---

  console.log('Cleaning database...');
  // Delete in reverse order of dependencies
  await prisma.marcadores.deleteMany();
  await prisma.morfologias.deleteMany();
  await prisma.ensayosBiologicos.deleteMany();
  await prisma.aislamientos.deleteMany();
  await prisma.colectas.deleteMany();
  await prisma.hongos.deleteMany();
  await prisma.organismos.deleteMany();
  await prisma.coordenadas.deleteMany();
  await prisma.sitios.deleteMany();

  console.log('Inserting Sitios...');
  for (const row of sitiosData) {
    // `Id`, `Nombre`, `EsAreaProtegida`, `NombreAreaProtegida`, `ReferenciasAdicionales`
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
    // `Id`, `Latitud`, `Longitud`, `Altitud`
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
    // `Id`, `Tipo`, `Reino`, `Filo`, `Clase`, `Orden`, `Familia`, `Genero`, `Especie`
    await prisma.organismos.create({
      data: {
        id: row[0],
        Tipo: row[1], // 'Planta' or 'Hongo'
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
    // `Id`, `MetodoIdentificacion`, `CodigoAccesoGenBank`, `IdentificadorResponsable`
    // Id is FK to Organismos
    await prisma.hongos.create({
      data: {
        id: row[0], // This ID must exist in Organismos
        MetodoIdentificacion: row[1],
        CodigoAccesoGenBank: row[2],
        IdentificadorResponsable: row[3]
      }
    });
  }

  console.log('Inserting Colectas...');
  for (const row of colectasData) {
    // `Id`, `IdHeredado`, `Colector`, `Fecha`, `Temperatura`, `Humedad`, `pH`, `IdSitio`, `TieneCoordenadas`, `IdCoordenadas`, `ContienePlanta`, `IdPlanta`
    await prisma.colectas.create({
      data: {
        id: row[0],
        idHeredado: row[1],
        Colector: row[2],
        Fecha: row[3], // String in Prisma, Date in SQL. Keep as string 'YYYY-MM-DD'
        Temperatura: row[4],
        Humedad: row[5],
        pH: row[6],
        idSitio: row[7],
        TieneCoordenadas: row[8] === 1,
        idCoordenadas: row[9],
        ContieneHospedero: row[10] === 1, // ContienePlanta -> ContieneHospedero
        idHospedero: row[11] // IdPlanta -> idHospedero
      }
    });
  }

  console.log('Inserting Aislamientos...');
  for (const row of aislamientosData) {
    // `Id`, `IdHeredado`, `AisladoDePlanta`, `ParteDePlanta`, `FechaAislamiento`, `FechaSalida`, `IdAnalisisMolecular`, `MedioCultivo`, `MetodoSiembra`, `Estado`, `Comentarios`, `CantidadExistencias`, `EstaEnColeccion`, `IdColecta`, `IdHongo`
    
    // Convert dates to ISO-8601 DateTime strings if they are not null
    const fechaAislamiento = row[4] ? new Date(row[4]).toISOString() : null;
    const fechaSalida = row[5] ? new Date(row[5]).toISOString() : null;

    await prisma.aislamientos.create({
      data: {
        id: row[0],
        idHeredado: row[1],
        AisladoDeHospedero: row[2] === 1, // AisladoDePlanta -> AisladoDeHospedero
        ParteDeHospedero: row[3], // ParteDePlanta -> ParteDeHospedero
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
        idOrganismo: row[14] // IdHongo -> idOrganismo
      }
    });
  }

  console.log('Inserting EnsayosBiologicos...');
  for (const row of ensayosData) {
    // `Id`, `IdAislamiento`, `Tipo`, `Resultado`
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
    // `Id`, `IdAislamiento`, `Forma`, `FormaBorde`, `ColorAnverso`, `ColorReverso`, `ColorBorde`, `TieneMicelioAereo`, `DensidadMicelioAereo`, `TipoCrecimiento`, `TipoHifa`, `TieneSecreciones`, `Observaciones`
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
    // `Id`, `IdHongo`, `Tipo`, `Secuencia`
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
