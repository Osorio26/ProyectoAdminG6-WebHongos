# Guía de Configuración del Proyecto (Setup Guide)

Esta guía detalla los pasos necesarios para levantar el proyecto en un entorno de desarrollo local.

## Prerrequisitos

Asegúrate de tener instalado lo siguiente:

1.  **Node.js** (Versión 18 o superior recomendada)
2.  **Git**
3.  **Prisma** (Se instalará automáticamente con `npm install`).

*Nota: No se requiere Docker ni instalar MariaDB/MySQL, ya que el proyecto usa SQLite.*

---

## Paso 1: Configuración del Backend y Base de Datos

1.  Navega a la carpeta del backend:
    ```bash
    cd App/backend
    ```

2.  Crea un archivo `.env` en la carpeta `App/backend` con el siguiente contenido:

    ```env
    # App/backend/.env
    DATABASE_URL="file:./dev.db"
    PORT=3000
    ```

3.  Instala las dependencias:
    ```bash
    npm install
    ```

4.  Configura la base de datos (Migración y Seed):
    ```bash
    # Esto crea el archivo dev.db y aplica el esquema
    npx prisma migrate dev --name init

    # (Opcional) Si necesitas resetear y cargar los datos de prueba/backup:
    npx prisma db seed
    ```

5.  Inicia el servidor backend:
    ```bash
    npm run dev
    ```
    El servidor debería estar corriendo en `http://localhost:3000`.

---

## Paso 2: Levantar el Frontend

1.  Abre una nueva terminal y navega a la carpeta del frontend:
    ```bash
    cd App/frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    El frontend debería estar disponible en `http://localhost:5173`.

---

## Solución de Problemas Comunes

*   **Error P3015 (Migration not found):** Si te sale un error de que falta un archivo de migración, borra la carpeta de esa migración específica dentro de `prisma/migrations` y vuelve a correr `npx prisma migrate dev`.
*   **Base de datos bloqueada:** SQLite es un archivo local. Si tienes el `DB Browser for SQLite` abierto con el archivo `dev.db` en modo escritura, es posible que Prisma no pueda escribir. Cierra el visor o asegúrate de haber guardado los cambios.
*   **Cambios en el Schema:** Si modificas `schema.prisma`, ejecuta `npx prisma migrate dev` para aplicar los cambios y regenerar el cliente.
