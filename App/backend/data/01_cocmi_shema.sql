-- ===================================================================
-- Esquema COCMI (MariaDB)
-- ===================================================================
-- Ajustes generales
SET NAMES utf8mb4;
SET sql_mode = 'STRICT_ALL_TABLES';

-- Crea la base de datos (opcional)
-- CREATE DATABASE IF NOT EXISTS cocmi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cocmi;

-- ===================================================================
-- TABLAS BASE
-- ===================================================================

-- 1) Sitios
CREATE TABLE IF NOT EXISTS Sitios (
  Id              CHAR(36) NOT NULL DEFAULT (UUID()),
  Nombre          VARCHAR(100),
  EsAreaProtegida TINYINT(1),
  NombreAreaProtegida VARCHAR(100),
  ReferenciasAdicionales TEXT,
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Coordenadas
CREATE TABLE IF NOT EXISTS Coordenadas (
  Id              CHAR(36) NOT NULL DEFAULT (UUID()),
  Latitud         DECIMAL(9,6),
  Longitud        DECIMAL(9,6),
  Altitud         INT,
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Organismos (genérico para Planta u Hongo)
CREATE TABLE IF NOT EXISTS Organismos (
  Id       CHAR(36) NOT NULL DEFAULT (UUID()),
  Tipo     ENUM('Hospedero','Hongo') NOT NULL,
  Reino    VARCHAR(50),
  Filo     VARCHAR(50),
  Clase    VARCHAR(50),
  Orden    VARCHAR(50),
  Familia  VARCHAR(50),
  Genero   VARCHAR(50),
  Especie  VARCHAR(50),
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) Hongos (subtipo de Organismos: comparte la PK como FK)
CREATE TABLE IF NOT EXISTS Hongos (
  Id                          CHAR(36) NOT NULL, -- PK y FK a Organismos(Id)
  MetodoIdentificacion        TEXT,
  CodigoAccesoGenBank         VARCHAR(30),
  IdentificadorResponsable    VARCHAR(100),
  PRIMARY KEY (Id),
  CONSTRAINT fk_hongos_organismos
    FOREIGN KEY (Id) REFERENCES Organismos(Id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================================
-- COLECTAS Y AISLAMIENTOS
-- ===================================================================

-- 5) Colectas
CREATE TABLE IF NOT EXISTS Colectas (
  Id                 CHAR(36) NOT NULL DEFAULT (UUID()),
  IdHeredado         VARCHAR(100),
  Colector           VARCHAR(100),
  Fecha              DATE,
  Temperatura        DECIMAL(5,2),
  Humedad            DECIMAL(5,2),
  pH                 DECIMAL(4,2),
  IdSitio            CHAR(36),
  TieneCoordenadas   TINYINT(1) NOT NULL,
  IdCoordenadas      CHAR(36),
  ContieneHospedero     TINYINT(1) NOT NULL,
  IdHospedero           CHAR(36),
  PRIMARY KEY (Id),
  UNIQUE KEY uq_colectas_idHeredado (IdHeredado),
  KEY idx_colectas_sitio (IdSitio),
  KEY idx_colectas_coord (IdCoordenadas),
  KEY idx_colectas_hospederos (IdHospedero),
  CONSTRAINT fk_colectas_sitio
    FOREIGN KEY (IdSitio) REFERENCES Sitios(Id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_colectas_coord
    FOREIGN KEY (IdCoordenadas) REFERENCES Coordenadas(Id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_colectas_hospederos
    FOREIGN KEY (IdHospedero) REFERENCES Organismos(Id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) Aislamientos
CREATE TABLE IF NOT EXISTS Aislamientos (
  Id                      CHAR(36) NOT NULL DEFAULT (UUID()),
  IdHeredado              VARCHAR(100) NOT NULL,
  AisladoDeHospedero      TINYINT(1) NOT NULL,
  ParteDeHospedero        VARCHAR(50),
  FechaAislamiento        DATE,
  FechaSalida             DATE,
  IdAnalisisMolecular     VARCHAR(100),
  MedioCultivo            VARCHAR(100),
  MetodoSiembra           VARCHAR(100),
  Estado                  VARCHAR(50),
  Comentarios             TEXT,
  CantidadExistencias     INT DEFAULT 1,
  EstaEnColeccion         TINYINT(1) NOT NULL DEFAULT(0),
  IdColecta               CHAR(36),
  PRIMARY KEY (Id),
  UNIQUE KEY uq_aislamientos_IdHeredado (IdHeredado),
  KEY idx_aislamientos_colecta (IdColecta),
  CONSTRAINT fk_aislamientos_colecta
    FOREIGN KEY (IdColecta) REFERENCES Colectas(Id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================================
-- ANEXOS DE AISLAMIENTOS
-- ===================================================================

-- 7) EnsayosBiologicos (por Aislamiento)
CREATE TABLE IF NOT EXISTS EnsayosBiologicos (
  Id             CHAR(36) NOT NULL DEFAULT (UUID()),
  IdAislamiento  CHAR(36) NOT NULL,
  Tipo           TEXT NOT NULL,
  Resultado      TEXT,
  PRIMARY KEY (Id),
  KEY idx_ensayos_aislamiento (IdAislamiento),
  CONSTRAINT fk_ensayos_aislamiento
    FOREIGN KEY (IdAislamiento) REFERENCES Aislamientos(Id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8) Morfologias (por Aislamiento)
CREATE TABLE IF NOT EXISTS Morfologias (
  Id                    CHAR(36) NOT NULL DEFAULT (UUID()),
  IdAislamiento         CHAR(36) NOT NULL,
  Forma                 VARCHAR(50),
  FormaBorde            VARCHAR(50),
  ColorAnverso          VARCHAR(50),
  ColorReverso          VARCHAR(50),
  ColorBorde            VARCHAR(50),
  TieneMicelioAereo     TINYINT(1),
  DensidadMicelioAereo  VARCHAR(50),
  TipoCrecimiento       VARCHAR(50),
  TipoHifa              VARCHAR(50),
  TieneSecreciones      TINYINT(1),
  Observaciones         TEXT,
  PRIMARY KEY (Id),
  KEY idx_morf_aislamiento (IdAislamiento),
  CONSTRAINT fk_morf_aislamiento
    FOREIGN KEY (IdAislamiento) REFERENCES Aislamientos(Id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================================
-- MARCADORES MOLECULARES (por Hongo)
-- ===================================================================

-- 9) Marcadores
CREATE TABLE IF NOT EXISTS Marcadores (
  Id         CHAR(36) NOT NULL DEFAULT (UUID()),
  IdHongo    CHAR(36) NOT NULL,
  Tipo       VARCHAR(50) NOT NULL,
  Secuencia  TEXT,
  PRIMARY KEY (Id),
  KEY idx_marcadores_hongo (IdHongo),
  CONSTRAINT fk_marcadores_hongo
    FOREIGN KEY (IdHongo) REFERENCES Hongos(Id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================================
-- NOTAS:
-- - Para los campos booleanos se usa TINYINT(1).
-- - Los ENUM sustituyen los CHECK del diagrama para garantizar valores válidos.
-- - Las PKs usan UUIDs; si prefieres INT AUTO_INCREMENT, cambia el tipo y elimina DEFAULT(UUID()).
-- - Las relaciones siguen el diagrama: Morfologías/Ensayos → Aislamientos → Colectas → Sitios/Coordenadas,
--   y Marcadores → Hongos → Organismos (subtipo).
-- ===================================================================