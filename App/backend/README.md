# Backend - COCMI

Este directorio contiene la lógica del servidor, la API REST y la gestión de la base de datos SQLite.

## 🛠️ Configuración Inicial

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Base de Datos (Prisma)**:
    El proyecto utiliza Prisma con SQLite. El archivo de base de datos se encuentra en `prisma/dev.db`.

    Para sincronizar el esquema y generar el cliente:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

3.  **Iniciar Servidor**:
    ```bash
    npm start
    ```
    El servidor correrá en `http://localhost:3000`.

## 📂 Estructura

*   `server.js`: Punto de entrada de la aplicación Express.
*   `routes/`: Definición de las rutas de la API (ej. `hongos.js`).
*   `prisma/`:
    *   `schema.prisma`: Definición del esquema de la base de datos.
    *   `dev.db`: Archivo de base de datos SQLite.
*   `data/`: Archivos JSON de respaldo o iniciales.

## 🔌 API Endpoints Principales

### Hongos (`/hongos`)

*   `GET /hongos`: Obtener todos los aislamientos.
*   `GET /hongos/:code`: Obtener detalles de un aislamiento específico.
*   `PUT /hongos/:code`: Actualizar un aislamiento completo.
*   `DELETE /hongos/:code`: **(Nuevo)** Eliminar un aislamiento y sus datos relacionados.

### Creación de Datos

*   `POST /hongos/colecta`: Crear nueva colecta.
*   `POST /hongos/aislamiento`: Crear nuevo aislamiento.
*   `POST /hongos/hongo`: Registrar datos taxonómicos del hongo.
*   `POST /hongos/morfologia`: Agregar datos morfológicos.
*   `POST /hongos/ensayo`: Agregar ensayo biológico.

### Eliminación Específica

*   `DELETE /hongos/ensayo/:id`: **(Nuevo)** Eliminar un ensayo biológico específico.

## ⚠️ Notas de Desarrollo

*   Si modificas `prisma/schema.prisma`, recuerda ejecutar `npx prisma migrate dev` o `npx prisma db push` para aplicar los cambios a la base de datos.
