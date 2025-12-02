/*
  Warnings:

  - You are about to alter the column `Humedad` on the `Colectas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `Temperatura` on the `Colectas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `pH` on the `Colectas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `Latitud` on the `Coordenadas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `Longitud` on the `Coordenadas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aislamientos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idHeredado" TEXT NOT NULL,
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
    "idColecta" TEXT,
    "idOrganismo" TEXT,
    "idHongo" TEXT,
    CONSTRAINT "Aislamientos_idColecta_fkey" FOREIGN KEY ("idColecta") REFERENCES "Colectas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aislamientos_idOrganismo_fkey" FOREIGN KEY ("idOrganismo") REFERENCES "Organismos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aislamientos_idHongo_fkey" FOREIGN KEY ("idHongo") REFERENCES "Hongos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Aislamientos" ("AisladoDePlanta", "CantidadExistencias", "Comentarios", "EstaEnColeccion", "Estado", "FechaAislamiento", "FechaSalida", "IdAnalisisMolecular", "MedioCultivo", "MetodoSiembra", "ParteDePlanta", "id", "idColecta", "idHeredado", "idOrganismo") SELECT "AisladoDePlanta", "CantidadExistencias", "Comentarios", "EstaEnColeccion", "Estado", "FechaAislamiento", "FechaSalida", "IdAnalisisMolecular", "MedioCultivo", "MetodoSiembra", "ParteDePlanta", "id", "idColecta", "idHeredado", "idOrganismo" FROM "Aislamientos";
DROP TABLE "Aislamientos";
ALTER TABLE "new_Aislamientos" RENAME TO "Aislamientos";
CREATE UNIQUE INDEX "Aislamientos_idHeredado_key" ON "Aislamientos"("idHeredado");
CREATE TABLE "new_Colectas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idHeredado" TEXT,
    "Colector" TEXT,
    "Fecha" DATETIME,
    "Temperatura" REAL,
    "Humedad" REAL,
    "pH" REAL,
    "idSitio" TEXT,
    "TieneCoordenadas" BOOLEAN NOT NULL,
    "idCoordenadas" TEXT,
    "ContienePlanta" BOOLEAN NOT NULL,
    "idPlanta" TEXT,
    CONSTRAINT "Colectas_idSitio_fkey" FOREIGN KEY ("idSitio") REFERENCES "Sitios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_idCoordenadas_fkey" FOREIGN KEY ("idCoordenadas") REFERENCES "Coordenadas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_idPlanta_fkey" FOREIGN KEY ("idPlanta") REFERENCES "Organismos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Colectas" ("Colector", "ContienePlanta", "Fecha", "Humedad", "Temperatura", "TieneCoordenadas", "id", "idCoordenadas", "idHeredado", "idPlanta", "idSitio", "pH") SELECT "Colector", "ContienePlanta", "Fecha", "Humedad", "Temperatura", "TieneCoordenadas", "id", "idCoordenadas", "idHeredado", "idPlanta", "idSitio", "pH" FROM "Colectas";
DROP TABLE "Colectas";
ALTER TABLE "new_Colectas" RENAME TO "Colectas";
CREATE UNIQUE INDEX "Colectas_idHeredado_key" ON "Colectas"("idHeredado");
CREATE TABLE "new_Coordenadas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Latitud" REAL,
    "Longitud" REAL,
    "Altitud" INTEGER
);
INSERT INTO "new_Coordenadas" ("Altitud", "Latitud", "Longitud", "id") SELECT "Altitud", "Latitud", "Longitud", "id" FROM "Coordenadas";
DROP TABLE "Coordenadas";
ALTER TABLE "new_Coordenadas" RENAME TO "Coordenadas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
