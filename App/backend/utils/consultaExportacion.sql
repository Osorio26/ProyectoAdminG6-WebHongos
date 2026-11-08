-- =====================================================================
-- Exportación de un solo CSV: una fila por aislamiento
-- =====================================================================
-- La usa exportCombinedCSV() en utils/csvExporter.js (GET /hongos/export-csv).
--
-- Une en una tabla plana el aislamiento con la taxonomía de su hongo, su
-- colecta, la taxonomía del hospedero, el sitio y las coordenadas. Las
-- morfologías, los ensayos biológicos y los marcadores se agregan en una
-- sola celda cada uno, para que un aislamiento nunca ocupe más de una fila.
--
-- Notas sobre el formato:
--   * Los booleanos salen como 'Sí' / 'No' (en SQLite se guardan como 0/1).
--   * Prisma guarda los DateTime de SQLite como milisegundos desde 1970
--     (entero). FechaAislamiento y FechaSalida se convierten a AAAA-MM-DD.
--   * Colectas.Fecha es texto y se exporta tal como está guardada (hoy mezcla
--     AAAA-MM-DD y M/D/AAAA; ver RECOMENDACIONES 4.10).
--   * Si hay varias morfologías, ensayos o marcadores, van separados por " | ".
--   * Los Id internos (UUID) no se exportan: se usan los códigos heredados.
--
-- Al agregar columnas, usar el mismo estilo de alias: "Campo (Tabla)".
-- =====================================================================
SELECT
    -- Aislamiento
    a.IdHeredado              AS "IdHeredado (Aislamiento)",
    CASE a.AisladoDeHospedero WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "AisladoDeHospedero (Aislamiento)",
    a.ParteDeHospedero        AS "ParteDeHospedero (Aislamiento)",
    strftime('%Y-%m-%d', a.FechaAislamiento / 1000, 'unixepoch')
                              AS "FechaAislamiento (Aislamiento)",
    strftime('%Y-%m-%d', a.FechaSalida / 1000, 'unixepoch')
                              AS "FechaSalida (Aislamiento)",
    a.IdAnalisisMolecular     AS "IdAnalisisMolecular (Aislamiento)",
    a.MedioCultivo            AS "MedioCultivo (Aislamiento)",
    a.MetodoSiembra           AS "MetodoSiembra (Aislamiento)",
    a.Estado                  AS "Estado (Aislamiento)",
    a.Comentarios             AS "Comentarios (Aislamiento)",
    a.CantidadExistencias     AS "CantidadExistencias (Aislamiento)",
    CASE a.EstaEnColeccion WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "EstaEnColeccion (Aislamiento)",

    -- Taxonomía del hongo (Organismos)
    ho.Reino                  AS "Reino (Hongo)",
    ho.Filo                   AS "Filo (Hongo)",
    ho.Clase                  AS "Clase (Hongo)",
    ho.Orden                  AS "Orden (Hongo)",
    ho.Familia                AS "Familia (Hongo)",
    ho.Genero                 AS "Genero (Hongo)",
    ho.Especie                AS "Especie (Hongo)",

    -- Datos específicos del hongo (Hongos)
    h.MetodoIdentificacion    AS "MetodoIdentificacion (Hongo)",
    h.CodigoAccesoGenBank     AS "CodigoAccesoGenBank (Hongo)",
    h.IdentificadorResponsable AS "IdentificadorResponsable (Hongo)",

    -- Colecta
    c.IdHeredado              AS "CodColecta (Colecta)",
    c.Colector                AS "Colector (Colecta)",
    c.Fecha                   AS "FechaColecta (Colecta)",
    c.Temperatura             AS "Temperatura (Colecta)",
    c.Humedad                 AS "Humedad (Colecta)",
    c.pH                      AS "pH (Colecta)",

    -- Taxonomía del hospedero (Organismos)
    po.Reino                  AS "Reino (Hospedero)",
    po.Filo                   AS "Filo (Hospedero)",
    po.Clase                  AS "Clase (Hospedero)",
    po.Orden                  AS "Orden (Hospedero)",
    po.Familia                AS "Familia (Hospedero)",
    po.Genero                 AS "Genero (Hospedero)",
    po.Especie                AS "Especie (Hospedero)",

    -- Sitio y coordenadas
    s.Nombre                  AS "NombreSitio (Sitio)",
    CASE s.EsAreaProtegida WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "EsAreaProtegida (Sitio)",
    s.NombreAreaProtegida     AS "NombreAreaProtegida (Sitio)",
    s.ReferenciasAdicionales  AS "ReferenciasSitio (Sitio)",
    coord.Latitud             AS "Latitud (Coordenadas)",
    coord.Longitud            AS "Longitud (Coordenadas)",
    coord.Altitud             AS "Altitud (Coordenadas)",

    -- Morfologías: "Campo: valor; Campo: valor" (se omiten los campos vacíos)
    (SELECT GROUP_CONCAT(
                rtrim(
                    COALESCE('Forma: '            || m.Forma                || '; ', '') ||
                    COALESCE('Forma del borde: '  || m.FormaBorde           || '; ', '') ||
                    COALESCE('Color anverso: '    || m.ColorAnverso         || '; ', '') ||
                    COALESCE('Color reverso: '    || m.ColorReverso         || '; ', '') ||
                    COALESCE('Color del borde: '  || m.ColorBorde           || '; ', '') ||
                    COALESCE('Micelio aéreo: '    ||
                        CASE m.TieneMicelioAereo WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END || '; ', '') ||
                    COALESCE('Densidad micelio: ' || m.DensidadMicelioAereo || '; ', '') ||
                    COALESCE('Tipo de crecimiento: ' || m.TipoCrecimiento   || '; ', '') ||
                    COALESCE('Tipo de hifa: '     || m.TipoHifa             || '; ', '') ||
                    COALESCE('Secreciones: '      ||
                        CASE m.TieneSecreciones WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END || '; ', '') ||
                    COALESCE('Observaciones: '    || m.Observaciones        || '; ', ''),
                    '; '),
                ' | ')
       FROM Morfologias m
      WHERE m.IdAislamiento = a.Id)
                              AS "Morfologias (Aislamiento)",

    -- Ensayos biológicos: "Tipo: Resultado"
    (SELECT GROUP_CONCAT(e.Tipo || COALESCE(': ' || e.Resultado, ''), ' | ')
       FROM EnsayosBiologicos e
      WHERE e.IdAislamiento = a.Id)
                              AS "EnsayosBiologicos (Aislamiento)",

    -- Marcadores moleculares del hongo: "Tipo: Secuencia"
    (SELECT GROUP_CONCAT(mk.Tipo || COALESCE(': ' || mk.Secuencia, ''), ' | ')
       FROM Marcadores mk
      WHERE mk.IdHongo = a.IdOrganismo)
                              AS "Marcadores (Hongo)"

FROM Aislamientos AS a
-- La taxonomía se une directo por IdOrganismo (y no a través de Hongos) para
-- no perderla si un organismo no tiene fila en la tabla Hongos.
LEFT JOIN Organismos   AS ho    ON a.IdOrganismo   = ho.Id
LEFT JOIN Hongos       AS h     ON a.IdOrganismo   = h.Id
LEFT JOIN Colectas     AS c     ON a.IdColecta     = c.Id
LEFT JOIN Organismos   AS po    ON c.IdHospedero   = po.Id
LEFT JOIN Sitios       AS s     ON c.IdSitio       = s.Id
LEFT JOIN Coordenadas  AS coord ON c.IdCoordenadas = coord.Id
ORDER BY a.IdHeredado;
