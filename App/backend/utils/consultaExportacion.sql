-- =====================================================================
-- Exportación de un solo CSV: una fila por aislamiento
-- =====================================================================
-- La usa exportCombinedCSV() en utils/csvExporter.js (GET /hongos/export-csv).
--
-- Une en una tabla plana el aislamiento con la taxonomía de su hongo, su
-- colecta, la taxonomía del hospedero, el sitio, las coordenadas, su
-- morfología y su ensayo biológico.
--
-- Nombres de columna: "Campo (Tabla)", con el nombre EXACTO del campo y de la
-- tabla en la base de datos, para que se pueda rastrear de dónde viene cada
-- dato. La tabla Organismos se une dos veces (el hongo del aislamiento y el
-- hospedero de la colecta), así que sus columnas llevan además el papel:
-- "Reino (Organismos - hongo)" / "Reino (Organismos - hospedero)".
--
-- Cómo se unen las tablas (todas con LEFT JOIN, para no perder aislamientos
-- a los que les falte algún dato):
--   Aislamientos.IdOrganismo   -> Organismos.Id (hongo) y Hongos.Id
--   Aislamientos.IdColecta     -> Colectas.Id
--   Colectas.IdHospedero       -> Organismos.Id (hospedero)
--   Colectas.IdSitio           -> Sitios.Id
--   Colectas.IdCoordenadas     -> Coordenadas.Id
--   Morfologias.IdAislamiento  -> Aislamientos.Id
--   EnsayosBiologicos.IdAislamiento -> Aislamientos.Id
--   Marcadores.IdHongo         -> Hongos.Id
--
-- Notas sobre el formato:
--   * Los booleanos salen como 'Sí' / 'No' (en SQLite se guardan como 0/1).
--   * Prisma guarda los DateTime de SQLite como milisegundos desde 1970
--     (entero). FechaAislamiento y FechaSalida se convierten a AAAA-MM-DD.
--   * Colectas.Fecha es texto y se exporta tal como está guardada (hoy mezcla
--     AAAA-MM-DD y M/D/AAAA; ver RECOMENDACIONES 4.10).
--   * Los Id internos (UUID) y las llaves foráneas no se exportan: los Id solo
--     sirven para unir las tablas. Se identifican las filas con los códigos
--     heredados (IdHeredado) de aislamientos y colectas.
--   * Morfologías y ensayos van en columnas propias. Hoy ningún aislamiento
--     tiene más de una morfología ni más de un ensayo, así que sigue habiendo
--     una fila por aislamiento. Si algún día uno tuviera dos, aparecería en dos
--     filas (repitiendo los demás datos) en vez de perder información.
--   * Marcadores sí puede tener varios por hongo y un hongo tiene muchos
--     aislamientos, así que se agrega en una sola celda ("Tipo: Secuencia",
--     varios separados por " | ") para no multiplicar filas. Hoy está vacía.
-- =====================================================================
SELECT
    -- Aislamientos
    a.IdHeredado              AS "IdHeredado (Aislamientos)",
    CASE a.AisladoDeHospedero WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "AisladoDeHospedero (Aislamientos)",
    a.ParteDeHospedero        AS "ParteDeHospedero (Aislamientos)",
    strftime('%Y-%m-%d', a.FechaAislamiento / 1000, 'unixepoch')
                              AS "FechaAislamiento (Aislamientos)",
    strftime('%Y-%m-%d', a.FechaSalida / 1000, 'unixepoch')
                              AS "FechaSalida (Aislamientos)",
    a.IdAnalisisMolecular     AS "IdAnalisisMolecular (Aislamientos)",
    a.MedioCultivo            AS "MedioCultivo (Aislamientos)",
    a.MetodoSiembra           AS "MetodoSiembra (Aislamientos)",
    a.Estado                  AS "Estado (Aislamientos)",
    a.Comentarios             AS "Comentarios (Aislamientos)",
    a.CantidadExistencias     AS "CantidadExistencias (Aislamientos)",
    CASE a.EstaEnColeccion WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "EstaEnColeccion (Aislamientos)",

    -- Organismos: el hongo del aislamiento (Organismos.Tipo = 'Hongo')
    ho.Reino                  AS "Reino (Organismos - hongo)",
    ho.Filo                   AS "Filo (Organismos - hongo)",
    ho.Clase                  AS "Clase (Organismos - hongo)",
    ho.Orden                  AS "Orden (Organismos - hongo)",
    ho.Familia                AS "Familia (Organismos - hongo)",
    ho.Genero                 AS "Genero (Organismos - hongo)",
    ho.Especie                AS "Especie (Organismos - hongo)",

    -- Hongos (extiende a Organismos con el mismo Id)
    h.MetodoIdentificacion    AS "MetodoIdentificacion (Hongos)",
    h.CodigoAccesoGenBank     AS "CodigoAccesoGenBank (Hongos)",
    h.IdentificadorResponsable AS "IdentificadorResponsable (Hongos)",

    -- Colectas
    c.IdHeredado              AS "IdHeredado (Colectas)",
    c.Colector                AS "Colector (Colectas)",
    c.Fecha                   AS "Fecha (Colectas)",
    c.Temperatura             AS "Temperatura (Colectas)",
    c.Humedad                 AS "Humedad (Colectas)",
    c.pH                      AS "pH (Colectas)",
    CASE c.TieneCoordenadas WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "TieneCoordenadas (Colectas)",
    CASE c.ContieneHospedero WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "ContieneHospedero (Colectas)",

    -- Organismos: el hospedero de la colecta (Organismos.Tipo = 'Hospedero')
    po.Reino                  AS "Reino (Organismos - hospedero)",
    po.Filo                   AS "Filo (Organismos - hospedero)",
    po.Clase                  AS "Clase (Organismos - hospedero)",
    po.Orden                  AS "Orden (Organismos - hospedero)",
    po.Familia                AS "Familia (Organismos - hospedero)",
    po.Genero                 AS "Genero (Organismos - hospedero)",
    po.Especie                AS "Especie (Organismos - hospedero)",

    -- Sitios
    s.Nombre                  AS "Nombre (Sitios)",
    CASE s.EsAreaProtegida WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "EsAreaProtegida (Sitios)",
    s.NombreAreaProtegida     AS "NombreAreaProtegida (Sitios)",
    s.ReferenciasAdicionales  AS "ReferenciasAdicionales (Sitios)",

    -- Coordenadas
    coord.Latitud             AS "Latitud (Coordenadas)",
    coord.Longitud            AS "Longitud (Coordenadas)",
    coord.Altitud             AS "Altitud (Coordenadas)",

    -- Morfologias
    m.Forma                   AS "Forma (Morfologias)",
    m.FormaBorde              AS "FormaBorde (Morfologias)",
    m.ColorAnverso            AS "ColorAnverso (Morfologias)",
    m.ColorReverso            AS "ColorReverso (Morfologias)",
    m.ColorBorde              AS "ColorBorde (Morfologias)",
    CASE m.TieneMicelioAereo WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "TieneMicelioAereo (Morfologias)",
    m.DensidadMicelioAereo    AS "DensidadMicelioAereo (Morfologias)",
    m.TipoCrecimiento         AS "TipoCrecimiento (Morfologias)",
    m.TipoHifa                AS "TipoHifa (Morfologias)",
    CASE m.TieneSecreciones WHEN 1 THEN 'Sí' WHEN 0 THEN 'No' END
                              AS "TieneSecreciones (Morfologias)",
    m.Observaciones           AS "Observaciones (Morfologias)",

    -- EnsayosBiologicos
    e.Tipo                    AS "Tipo (EnsayosBiologicos)",
    e.Resultado               AS "Resultado (EnsayosBiologicos)",

    -- Marcadores del hongo, en una sola celda: "Tipo: Secuencia" (ver notas)
    (SELECT GROUP_CONCAT(mk.Tipo || COALESCE(': ' || mk.Secuencia, ''), ' | ')
       FROM Marcadores mk
      WHERE mk.IdHongo = a.IdOrganismo)
                              AS "Tipo: Secuencia (Marcadores)"

FROM Aislamientos AS a
-- La taxonomía se une directo por IdOrganismo (y no a través de Hongos) para
-- no perderla si un organismo no tiene fila en la tabla Hongos.
LEFT JOIN Organismos        AS ho    ON a.IdOrganismo   = ho.Id
LEFT JOIN Hongos            AS h     ON a.IdOrganismo   = h.Id
LEFT JOIN Colectas          AS c     ON a.IdColecta     = c.Id
LEFT JOIN Organismos        AS po    ON c.IdHospedero   = po.Id
LEFT JOIN Sitios            AS s     ON c.IdSitio       = s.Id
LEFT JOIN Coordenadas       AS coord ON c.IdCoordenadas = coord.Id
LEFT JOIN Morfologias       AS m     ON m.IdAislamiento = a.Id
LEFT JOIN EnsayosBiologicos AS e     ON e.IdAislamiento = a.Id
ORDER BY a.IdHeredado;
