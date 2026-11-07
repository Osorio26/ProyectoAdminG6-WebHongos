/*
  Warnings:

  - You are about to drop the column `AisladoDePlanta` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `IdHongo` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `ParteDePlanta` on the `Aislamientos` table. All the data in the column will be lost.
  - You are about to drop the column `ContienePlanta` on the `Colectas` table. All the data in the column will be lost.
  - You are about to drop the column `IdPlanta` on the `Colectas` table. All the data in the column will be lost.
  - Added the required column `AisladoDeHospedero` to the `Aislamientos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ContieneHospedero` to the `Colectas` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aislamientos" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "IdHeredado" TEXT NOT NULL,
    "AisladoDeHospedero" BOOLEAN NOT NULL,
    "ParteDeHospedero" TEXT,
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
    CONSTRAINT "Aislamientos_IdColecta_fkey" FOREIGN KEY ("IdColecta") REFERENCES "Colectas" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aislamientos_IdOrganismo_fkey" FOREIGN KEY ("IdOrganismo") REFERENCES "Organismos" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Aislamientos" ("CantidadExistencias", "Comentarios", "EstaEnColeccion", "Estado", "FechaAislamiento", "FechaSalida", "Id", "IdAnalisisMolecular", "IdColecta", "IdHeredado", "IdOrganismo", "MedioCultivo", "MetodoSiembra") SELECT "CantidadExistencias", "Comentarios", "EstaEnColeccion", "Estado", "FechaAislamiento", "FechaSalida", "Id", "IdAnalisisMolecular", "IdColecta", "IdHeredado", "IdOrganismo", "MedioCultivo", "MetodoSiembra" FROM "Aislamientos";
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
    "ContieneHospedero" BOOLEAN NOT NULL,
    "IdHospedero" TEXT,
    CONSTRAINT "Colectas_IdSitio_fkey" FOREIGN KEY ("IdSitio") REFERENCES "Sitios" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_IdCoordenadas_fkey" FOREIGN KEY ("IdCoordenadas") REFERENCES "Coordenadas" ("Id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_IdHospedero_fkey" FOREIGN KEY ("IdHospedero") REFERENCES "Organismos" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Colectas" ("Colector", "Fecha", "Humedad", "Id", "IdCoordenadas", "IdHeredado", "IdSitio", "Temperatura", "TieneCoordenadas", "pH") SELECT "Colector", "Fecha", "Humedad", "Id", "IdCoordenadas", "IdHeredado", "IdSitio", "Temperatura", "TieneCoordenadas", "pH" FROM "Colectas";
DROP TABLE "Colectas";
ALTER TABLE "new_Colectas" RENAME TO "Colectas";
CREATE UNIQUE INDEX "Colectas_IdHeredado_key" ON "Colectas"("IdHeredado");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
