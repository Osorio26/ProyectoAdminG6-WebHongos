-- CreateTable
CREATE TABLE `Sitios` (
    `id` CHAR(36) NOT NULL,
    `Nombre` VARCHAR(100) NULL,
    `EsAreaProtegida` BOOLEAN NULL,
    `NombreAreaProtegida` VARCHAR(100) NULL,
    `ReferenciasAdicionales` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coordenadas` (
    `id` CHAR(36) NOT NULL,
    `Latitud` DECIMAL(9, 6) NULL,
    `Longitud` DECIMAL(9, 6) NULL,
    `Altitud` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organismos` (
    `id` CHAR(36) NOT NULL,
    `Tipo` ENUM('Planta', 'Hongo') NOT NULL,
    `Reino` VARCHAR(50) NULL,
    `Filo` VARCHAR(50) NULL,
    `Clase` VARCHAR(50) NULL,
    `Orden` VARCHAR(50) NULL,
    `Familia` VARCHAR(50) NULL,
    `Genero` VARCHAR(50) NULL,
    `Especie` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hongos` (
    `id` CHAR(36) NOT NULL,
    `MetodoIdentificacion` TEXT NULL,
    `CodigoAccesoGenBank` VARCHAR(30) NULL,
    `IdentificadorResponsable` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Colectas` (
    `id` CHAR(36) NOT NULL,
    `idHeredado` VARCHAR(100) NULL,
    `Colector` VARCHAR(100) NULL,
    `Fecha` DATE NULL,
    `Temperatura` DECIMAL(5, 2) NULL,
    `Humedad` DECIMAL(5, 2) NULL,
    `pH` DECIMAL(4, 2) NULL,
    `idSitio` CHAR(36) NULL,
    `TieneCoordenadas` BOOLEAN NOT NULL,
    `idCoordenadas` CHAR(36) NULL,
    `ContienePlanta` BOOLEAN NOT NULL,
    `idPlanta` CHAR(36) NULL,

    UNIQUE INDEX `Colectas_idHeredado_key`(`idHeredado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aislamientos` (
    `id` CHAR(36) NOT NULL,
    `idHeredado` VARCHAR(100) NOT NULL,
    `AisladoDePlanta` BOOLEAN NOT NULL,
    `ParteDePlanta` VARCHAR(50) NULL,
    `FechaAislamiento` DATE NULL,
    `FechaSalida` DATE NULL,
    `IdAnalisisMolecular` VARCHAR(100) NULL,
    `MedioCultivo` VARCHAR(100) NULL,
    `MetodoSiembra` VARCHAR(100) NULL,
    `Estado` VARCHAR(50) NULL,
    `Comentarios` TEXT NULL,
    `CantidadExistencias` INTEGER NULL,
    `EstaEnColeccion` BOOLEAN NOT NULL DEFAULT false,
    `idColecta` CHAR(36) NULL,

    UNIQUE INDEX `Aislamientos_idHeredado_key`(`idHeredado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnsayosBiologicos` (
    `id` CHAR(36) NOT NULL,
    `idAislamiento` CHAR(36) NOT NULL,
    `Tipo` VARCHAR(50) NOT NULL,
    `Resultado` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Morfologias` (
    `id` CHAR(36) NOT NULL,
    `idAislamiento` CHAR(36) NOT NULL,
    `Forma` VARCHAR(50) NULL,
    `FormaBorde` VARCHAR(50) NULL,
    `ColorAnverso` VARCHAR(50) NULL,
    `ColorReverso` VARCHAR(50) NULL,
    `ColorBorde` VARCHAR(50) NULL,
    `TieneMicelioAereo` BOOLEAN NULL,
    `DensidadMicelioAereo` VARCHAR(50) NULL,
    `TipoCrecimiento` VARCHAR(50) NULL,
    `TipoHifa` VARCHAR(50) NULL,
    `TieneSecreciones` BOOLEAN NULL,
    `Observaciones` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marcadores` (
    `id` CHAR(36) NOT NULL,
    `idHongo` CHAR(36) NOT NULL,
    `Tipo` VARCHAR(50) NOT NULL,
    `Secuencia` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hongos` ADD CONSTRAINT `Hongos_id_fkey` FOREIGN KEY (`id`) REFERENCES `Organismos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Colectas` ADD CONSTRAINT `Colectas_idSitio_fkey` FOREIGN KEY (`idSitio`) REFERENCES `Sitios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Colectas` ADD CONSTRAINT `Colectas_idCoordenadas_fkey` FOREIGN KEY (`idCoordenadas`) REFERENCES `Coordenadas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Colectas` ADD CONSTRAINT `Colectas_idPlanta_fkey` FOREIGN KEY (`idPlanta`) REFERENCES `Organismos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aislamientos` ADD CONSTRAINT `Aislamientos_idColecta_fkey` FOREIGN KEY (`idColecta`) REFERENCES `Colectas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnsayosBiologicos` ADD CONSTRAINT `EnsayosBiologicos_idAislamiento_fkey` FOREIGN KEY (`idAislamiento`) REFERENCES `Aislamientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Morfologias` ADD CONSTRAINT `Morfologias_idAislamiento_fkey` FOREIGN KEY (`idAislamiento`) REFERENCES `Aislamientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Marcadores` ADD CONSTRAINT `Marcadores_idHongo_fkey` FOREIGN KEY (`idHongo`) REFERENCES `Hongos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
