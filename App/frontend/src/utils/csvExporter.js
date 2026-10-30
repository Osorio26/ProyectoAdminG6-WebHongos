/**
 * Convierte datos de hongos a formato CSV
 * @param {Array} data - Array de objetos con datos de hongos
 * @param {string} filename - Nombre del archivo a descargar
 */
export function exportToCSV(data, filename = 'hongos_export.csv') {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Mapea los datos de hongos a formato plano para CSV
  const flattenedData = data.map(fungus => ({
    'Código': fungus.idHeredado,
    'Género': fungus.Organismo?.Genero || 'N/A',
    'Especie': fungus.Organismo?.Especie || 'N/A',
    'Colector': fungus.Colecta?.Colector || 'N/A',
    'Ubicación': fungus.Colecta?.Sitio?.Nombre || 'N/A',
    'Área Protegida': fungus.Colecta?.Sitio?.NombreAreaProtegida || 'N/A',
    'Fecha Colecta': fungus.Colecta?.Fecha 
      ? new Date(fungus.Colecta.Fecha).toLocaleDateString('es-ES') 
      : 'N/A',
    'Temperatura': fungus.Colecta?.Temperatura || 'N/A',
    'Reino': fungus.Organismo?.Reino || 'N/A',
    'Clase': fungus.Organismo?.Clase || 'N/A',
    'Orden': fungus.Organismo?.Orden || 'N/A',
    'Familia': fungus.Organismo?.Familia || 'N/A',
    'Cantidad': fungus.CantidadExistencias || 'N/A',
  }));

  // Convertir a CSV
  const csv = convertArrayToCSV(flattenedData);

  // Descargar archivo
  downloadCSV(csv, filename);
}

/**
 * Convierte array de objetos a formato CSV
 * @param {Array} data - Array de objetos
 * @returns {string} String en formato CSV
 */
function convertArrayToCSV(data) {
  if (!data || data.length === 0) return '';

  // Obtener encabezados
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  // Convertir filas
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escapar comillas y envolver en comillas si contiene comas
      if (value === null || value === undefined) {
        return '""';
      }
      const stringValue = String(value).replace(/"/g, '""');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue}"`;
      }
      return stringValue;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Descarga un archivo CSV
 * @param {string} csv - Contenido CSV
 * @param {string} filename - Nombre del archivo
 */
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta datos con un nombre dinámico que incluye fecha y página
 * @param {Array} data - Datos a exportar
 * @param {number} pageNumber - Número de página actual
 */
export function exportCurrentPageToCSV(data, pageNumber = 1) {
  const today = new Date().toISOString().split('T')[0];
  const filename = `hongos_pagina_${pageNumber}_${today}.csv`;
  exportToCSV(data, filename);
}
