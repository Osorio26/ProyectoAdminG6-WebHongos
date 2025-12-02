-- CreateTable
CREATE TABLE "Sitios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Nombre" TEXT,
    "EsAreaProtegida" BOOLEAN,
    "NombreAreaProtegida" TEXT,
    "ReferenciasAdicionales" TEXT
);

-- CreateTable
CREATE TABLE "Coordenadas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Latitud" DECIMAL,
    "Longitud" DECIMAL,
    "Altitud" INTEGER
);

-- CreateTable
CREATE TABLE "Organismos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Tipo" TEXT NOT NULL,
    "Reino" TEXT,
    "Filo" TEXT,
    "Clase" TEXT,
    "Orden" TEXT,
    "Familia" TEXT,
    "Genero" TEXT,
    "Especie" TEXT
);

-- CreateTable
CREATE TABLE "Hongos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "MetodoIdentificacion" TEXT,
    "CodigoAccesoGenBank" TEXT,
    "IdentificadorResponsable" TEXT,
    CONSTRAINT "Hongos_id_fkey" FOREIGN KEY ("id") REFERENCES "Organismos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Colectas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idHeredado" TEXT,
    "Colector" TEXT,
    "Fecha" DATETIME,
    "Temperatura" DECIMAL,
    "Humedad" DECIMAL,
    "pH" DECIMAL,
    "idSitio" TEXT,
    "TieneCoordenadas" BOOLEAN NOT NULL,
    "idCoordenadas" TEXT,
    "ContienePlanta" BOOLEAN NOT NULL,
    "idPlanta" TEXT,
    CONSTRAINT "Colectas_idSitio_fkey" FOREIGN KEY ("idSitio") REFERENCES "Sitios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_idCoordenadas_fkey" FOREIGN KEY ("idCoordenadas") REFERENCES "Coordenadas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Colectas_idPlanta_fkey" FOREIGN KEY ("idPlanta") REFERENCES "Organismos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aislamientos" (
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
    CONSTRAINT "Aislamientos_idColecta_fkey" FOREIGN KEY ("idColecta") REFERENCES "Colectas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aislamientos_idOrganismo_fkey" FOREIGN KEY ("idOrganismo") REFERENCES "Organismos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsayosBiologicos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idAislamiento" TEXT NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Resultado" TEXT,
    CONSTRAINT "EnsayosBiologicos_idAislamiento_fkey" FOREIGN KEY ("idAislamiento") REFERENCES "Aislamientos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Morfologias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idAislamiento" TEXT NOT NULL,
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
    CONSTRAINT "Morfologias_idAislamiento_fkey" FOREIGN KEY ("idAislamiento") REFERENCES "Aislamientos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Marcadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idHongo" TEXT NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Secuencia" TEXT,
    CONSTRAINT "Marcadores_idHongo_fkey" FOREIGN KEY ("idHongo") REFERENCES "Hongos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Colectas_idHeredado_key" ON "Colectas"("idHeredado");

-- CreateIndex
CREATE UNIQUE INDEX "Aislamientos_idHeredado_key" ON "Aislamientos"("idHeredado");
