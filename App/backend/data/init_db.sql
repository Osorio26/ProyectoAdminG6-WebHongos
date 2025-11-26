-- SQL Script to populate the database with initial data
-- Based on the schema defined in prisma/schema.prisma

-- 0. Limpiar tablas (Orden inverso para respetar Foreign Keys)
DELETE FROM EnsayosBiologicos;
DELETE FROM Morfologias;
DELETE FROM Aislamientos;
DELETE FROM Marcadores;
DELETE FROM Hongos;
DELETE FROM Colectas;
DELETE FROM Organismos;
DELETE FROM Sitios;
DELETE FROM Coordenadas;

-- 1. Sitios
INSERT INTO Sitios (id, Nombre, EsAreaProtegida, NombreAreaProtegida, ReferenciasAdicionales) VALUES
('uuid-sitio-1', 'Cartago, Oreamuno', 1, 'Parque Nacional Tapantí', 'Sendero principal del parque'),
('uuid-sitio-2', 'San José, Escazú', 1, 'Reserva privada Escazú', 'Bosque nuboso de la reserva'),
('uuid-sitio-3', 'Heredia, Barva', 1, 'Parque Nacional Braulio Carrillo', 'Tronco caído cerca del río'),
('uuid-sitio-4', 'Guanacaste, Liberia', 1, 'Parque Nacional Rincón de la Vieja', 'Bosque húmedo en la ladera norte');

-- 2. Organismos
INSERT INTO Organismos (id, Tipo, Reino, Filo, Clase, Orden, Familia, Genero, Especie) VALUES
('uuid-org-1', 'Hongo', 'Fungi', NULL, 'Agaricomycetes', 'Agaricales', 'Omphalotaceae', 'Lentinula', 'Lentinula edodes'),
('uuid-org-2', 'Hongo', 'Fungi', NULL, 'Agaricomycetes', 'Russulales', 'Hericiaceae', 'Hericium', 'Hericium erinaceus'),
('uuid-org-3', 'Hongo', 'Fungi', NULL, 'Agaricomycetes', 'Polyporales', 'Ganodermataceae', 'Ganoderma', 'Ganoderma lucidum'),
('uuid-org-4', 'Hongo', 'Fungi', NULL, 'Agaricomycetes', 'Hymenochaetales', 'Hymenochaetaceae', 'Inonotus', 'Inonotus obliquus');

-- 3. Hongos (Extension of Organismos)
INSERT INTO Hongos (id, MetodoIdentificacion, CodigoAccesoGenBank, IdentificadorResponsable) VALUES
('uuid-org-1', 'Observación directa', NULL, 'Shiitake Farmer'),
('uuid-org-2', 'Observación directa', NULL, 'Lion''s Mane Researcher'),
('uuid-org-3', 'Observación directa', NULL, 'Reishi Collector'),
('uuid-org-4', 'Observación directa', NULL, 'Chaga Specialist');

-- 4. Colectas
INSERT INTO Colectas (id, idHeredado, Colector, Fecha, Temperatura, Humedad, pH, idSitio, TieneCoordenadas, idCoordenadas, ContienePlanta, idPlanta) VALUES
('uuid-colecta-1', 'BD-2001', 'Shiitake Farmer', CURDATE(), 16.0, NULL, NULL, 'uuid-sitio-1', 0, NULL, 0, NULL),
('uuid-colecta-2', 'AA-3102', 'Lion''s Mane Researcher', CURDATE(), 13.0, NULL, NULL, 'uuid-sitio-2', 0, NULL, 0, NULL),
('uuid-colecta-3', 'GC-9981', 'Reishi Collector', CURDATE(), 18.0, NULL, NULL, 'uuid-sitio-3', 0, NULL, 0, NULL),
('uuid-colecta-4', 'BR-5720', 'Chaga Specialist', CURDATE(), 20.0, NULL, NULL, 'uuid-sitio-4', 0, NULL, 0, NULL);

-- 5. Aislamientos
INSERT INTO Aislamientos (id, idHeredado, AisladoDePlanta, ParteDePlanta, FechaAislamiento, FechaSalida, IdAnalisisMolecular, MedioCultivo, MetodoSiembra, Estado, Comentarios, CantidadExistencias, EstaEnColeccion, idColecta, idOrganismo) VALUES
('uuid-aislamiento-1', 'BD-2022523226', 0, NULL, CURDATE(), NULL, NULL, NULL, NULL, 'Activo', NULL, 200, 1, 'uuid-colecta-1', 'uuid-org-1'),
('uuid-aislamiento-2', 'AA-2022510286', 0, NULL, CURDATE(), NULL, NULL, NULL, NULL, 'Activo', NULL, 100, 1, 'uuid-colecta-2', 'uuid-org-2'),
('uuid-aislamiento-3', 'GC-2022510225', 0, NULL, CURDATE(), NULL, NULL, NULL, NULL, 'Activo', NULL, 50, 1, 'uuid-colecta-3', 'uuid-org-3'),
('uuid-aislamiento-4', 'BR-202258293', 0, NULL, CURDATE(), NULL, NULL, NULL, NULL, 'Activo', NULL, 75, 1, 'uuid-colecta-4', 'uuid-org-4');
