/*
  Warnings:

  - The primary key for the `Aislamientos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `idColecta` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `idHeredado` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `idHongo` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `idOrganismo` on the `Aislamientos` table. All the data in the column will be lost.
  - The primary key for the `Colectas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Colectas` table. All the data in the column will be lost.
  - You are about to drop the column `idCoordenadas` on the `Colectas` table. All the data in the column will be lost.
  - You are about to drop the column `idHeredado` on the `Colectas` table. All the data in the column will be lost.
  - You are about to drop the column `idPlanta` on the `Colectas` table. All the data in the column will be lost.
  - You are about to drop the column `idSitio` on the `Colectas` table. All the data in the column will be lost.
  - The primary key for the `Coordenadas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Coordenadas` table. All the data in the column will be lost.
  - The primary key for the `EnsayosBiologicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EnsayosBiologicos` table. All the data in the column will be lost.
  - You are about to drop the column `idAislamiento` on the `EnsayosBiologicos` table. All the data in the column will be lost.
  - The primary key for the `Hongos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Hongos` table. All the data in the column will be lost.
  - The primary key for the `Marcadores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Marcadores` table. All the data in the column will be lost.
  - You are about to drop the column `idHongo` on the `Marcadores` table. All the data in the column will be lost.
  - The primary key for the `Morfologias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Morfologias` table. All the data in the column will be lost.
  - You are about to drop the column `idAislamiento` on the `Morfologias` table. All the data in the column will be lost.
  - The primary key for the `Organismos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Organismos` table. All the data in the column will be lost.
  - The primary key for the `Sitios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Sitios` table. All the data in the column will be lost.
  - The required column `Id` was added to the `Aislamientos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `IdHeredado` to the `Aislamientos` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `Colectas` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `Coordenadas` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `EnsayosBiologicos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `IdAislamiento` to the `EnsayosBiologicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Hongos` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `Marcadores` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `IdHongo` to the `Marcadores` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `Morfologias` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `IdAislamiento` to the `Morfologias` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `Organismos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `Sitios` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aislamientos" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "IdHeredado" TEXT NOT NULL,
    "AisladoDePlanta" BOOLEAN NOT NULL,
    "ParteDePlanta" TEXT,
    "FechaAislamiento" DATETIME,
    "FechaSalida" DATETIME,
    "IdAnalisisMolecular" TEXT,
    "MedioCultivo" TEXT,
    "MetodoSiembra" TEXT,
    "Estado" TEXT,
    "Comentarios" TEXT,
    "CantidadExistencias" INTEGER,
    "EstaEnColeccion" BOOLEAN NOT NULL DEFAULT false,
    "IdColecta" TEXT,
    "IdOrganismo" TEXT,
    "IdHongo" TEXT,
    CONSTRAINT "Aislamientos_IdColecta_fkey" FOREIGN KEY ("IdColecta") REFERENCES "Colectas" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aislamientos_IdOrganismo_fkey" FOREIGN KEY ("IdOrganismo") REFERENCES "Organismos" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aislamientos_IdHongo_fkey" FOREIGN KEY ("IdHongo") REFERENCES "Hongos" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Aislamientos" ("AisladoDePlanta", "CantidadExistencias", "Comentarios", "EstaEnColeccion", "Estado", "FechaAislamiento", "FechaSalida", "IdAnalisisMolecular", "MedioCultivo", "MetodoSiembra", "ParteDePlanta") SELECT "AisladoDePlanta", "CantidadExistencias", "Comentarios", "EstaEnColeccion", "Estado", "FechaAislamiento", "FechaSalida", "IdAnalisisMolecular", "MedioCultivo", "MetodoSiembra", "ParteDePlanta" FROM "Aislamientos";
DROP TABLE "Aislamientos";
ALTER TABLE "new_Aislamientos" RENAME TO "Aislamientos";
CREATE UNIQUE INDEX "Aislamientos_IdHeredado_key" ON "Aislamientos"("IdHeredado");
CREATE TABLE "new_Colectas" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "IdHeredado" TEXT,
    "Colector" TEXT,
    "Fecha" TEXT,
    "Temperatura" REAL,
    "Humedad" REAL,
    "pH" REAL,
    "IdSitio" TEXT,
    "TieneCoordenadas" BOOLEAN NOT NULL,
    "IdCoordenadas" TEXT,
    "ContienePlanta" BOOLEAN NOT NULL,
    "IdPlanta" TEXT,
    CONSTRAINT "Colectas_IdSitio_fkey" FOREIGN KEY ("IdSitio") REFERENCES "Sitios" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_IdCoordenadas_fkey" FOREIGN KEY ("IdCoordenadas") REFERENCES "Coordenadas" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_IdPlanta_fkey" FOREIGN KEY ("IdPlanta") REFERENCES "Organismos" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Colectas" ("Colector", "ContienePlanta", "Fecha", "Humedad", "Temperatura", "TieneCoordenadas", "pH") SELECT "Colector", "ContienePlanta", "Fecha", "Humedad", "Temperatura", "TieneCoordenadas", "pH" FROM "Colectas";
DROP TABLE "Colectas";
ALTER TABLE "new_Colectas" RENAME TO "Colectas";
CREATE UNIQUE INDEX "Colectas_IdHeredado_key" ON "Colectas"("IdHeredado");
CREATE TABLE "new_Coordenadas" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Latitud" REAL,
    "Longitud" REAL,
    "Altitud" INTEGER
);
INSERT INTO "new_Coordenadas" ("Altitud", "Latitud", "Longitud") SELECT "Altitud", "Latitud", "Longitud" FROM "Coordenadas";
DROP TABLE "Coordenadas";
ALTER TABLE "new_Coordenadas" RENAME TO "Coordenadas";
CREATE TABLE "new_EnsayosBiologicos" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "IdAislamiento" TEXT NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Resultado" TEXT,
    CONSTRAINT "EnsayosBiologicos_IdAislamiento_fkey" FOREIGN KEY ("IdAislamiento") REFERENCES "Aislamientos" ("Id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EnsayosBiologicos" ("Resultado", "Tipo") SELECT "Resultado", "Tipo" FROM "EnsayosBiologicos";
DROP TABLE "EnsayosBiologicos";
ALTER TABLE "new_EnsayosBiologicos" RENAME TO "EnsayosBiologicos";
CREATE TABLE "new_Hongos" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "MetodoIdentificacion" TEXT,
    "CodigoAccesoGenBank" TEXT,
    "IdentificadorResponsable" TEXT,
    CONSTRAINT "Hongos_Id_fkey" FOREIGN KEY ("Id") REFERENCES "Organismos" ("Id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hongos" ("CodigoAccesoGenBank", "IdentificadorResponsable", "MetodoIdentificacion") SELECT "CodigoAccesoGenBank", "IdentificadorResponsable", "MetodoIdentificacion" FROM "Hongos";
DROP TABLE "Hongos";
ALTER TABLE "new_Hongos" RENAME TO "Hongos";
CREATE TABLE "new_Marcadores" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "IdHongo" TEXT NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Secuencia" TEXT,
    CONSTRAINT "Marcadores_IdHongo_fkey" FOREIGN KEY ("IdHongo") REFERENCES "Hongos" ("Id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Marcadores" ("Secuencia", "Tipo") SELECT "Secuencia", "Tipo" FROM "Marcadores";
DROP TABLE "Marcadores";
ALTER TABLE "new_Marcadores" RENAME TO "Marcadores";
CREATE TABLE "new_Morfologias" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "IdAislamiento" TEXT NOT NULL,
    "Forma" TEXT,
    "FormaBorde" TEXT,
    "ColorAnverso" TEXT,
    "ColorReverso" TEXT,
    "ColorBorde" TEXT,
    "TieneMicelioAereo" BOOLEAN,
    "DensidadMicelioAereo" TEXT,
    "TipoCrecimiento" TEXT,
    "TipoHifa" TEXT,
    "TieneSecreciones" BOOLEAN,
    "Observaciones" TEXT,
    CONSTRAINT "Morfologias_IdAislamiento_fkey" FOREIGN KEY ("IdAislamiento") REFERENCES "Aislamientos" ("Id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Morfologias" ("ColorAnverso", "ColorBorde", "ColorReverso", "DensidadMicelioAereo", "Forma", "FormaBorde", "Observaciones", "TieneMicelioAereo", "TieneSecreciones", "TipoCrecimiento", "TipoHifa") SELECT "ColorAnverso", "ColorBorde", "ColorReverso", "DensidadMicelioAereo", "Forma", "FormaBorde", "Observaciones", "TieneMicelioAereo", "TieneSecreciones", "TipoCrecimiento", "TipoHifa" FROM "Morfologias";
DROP TABLE "Morfologias";
ALTER TABLE "new_Morfologias" RENAME TO "Morfologias";
CREATE TABLE "new_Organismos" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Tipo" TEXT NOT NULL,
    "Reino" TEXT,
    "Filo" TEXT,
    "Clase" TEXT,
    "Orden" TEXT,
    "Familia" TEXT,
    "Genero" TEXT,
    "Especie" TEXT
);
INSERT INTO "new_Organismos" ("Clase", "Especie", "Familia", "Filo", "Genero", "Orden", "Reino", "Tipo") SELECT "Clase", "Especie", "Familia", "Filo", "Genero", "Orden", "Reino", "Tipo" FROM "Organismos";
DROP TABLE "Organismos";
ALTER TABLE "new_Organismos" RENAME TO "Organismos";
CREATE TABLE "new_Sitios" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Nombre" TEXT,
    "EsAreaProtegida" BOOLEAN,
    "NombreAreaProtegida" TEXT,
    "ReferenciasAdicionales" TEXT
);
INSERT INTO "new_Sitios" ("EsAreaProtegida", "Nombre", "NombreAreaProtegida", "ReferenciasAdicionales") SELECT "EsAreaProtegida", "Nombre", "NombreAreaProtegida", "ReferenciasAdicionales" FROM "Sitios";
DROP TABLE "Sitios";
ALTER TABLE "new_Sitios" RENAME TO "Sitios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
