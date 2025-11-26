# Guía de Configuración del Proyecto (Setup Guide)

Esta guía detalla los pasos necesarios para levantar el proyecto en un entorno de desarrollo local.

## Prerrequisitos

Asegúrate de tener instalado lo siguiente:

1.  **Node.js** (Versión 18 o superior recomendada)
2.  **Docker Desktop** (o Docker Engine) corriendo.
3.  **Git**

---

## Paso 1: Configuración de la Base de Datos

El proyecto utiliza **MariaDB** como base de datos, gestionada a través de Docker, y **Prisma** como ORM.

1.  Navega a la carpeta del backend:
    ```bash
    cd App/backend
    ```

2.  Levanta el contenedor de la base de datos:
    ```bash
    docker-compose up -d
    ```
    *Esto descargará la imagen de MariaDB e iniciará el servicio en el puerto 3306.*

3.  Crea un archivo `.env` en la carpeta `App/backend` con el siguiente contenido (basado en la configuración de `docker-compose.yml`):

    ```env
    # App/backend/.env
    DATABASE_URL="mysql://user:password@localhost:3306/hongos_db"
    PORT=3000
    ```

4.  Instala las dependencias del backend:
    ```bash
    npm install
    ```

5.  Sincroniza la base de datos con el esquema de Prisma:
    ```bash
    npx prisma migrate dev
    ```
    *Esto creará las tablas necesarias en tu base de datos local.*

6.  (Opcional) Poblar la base de datos con datos de prueba:
    ```bash
    npx prisma db seed
    ```
    *Nota: Esto ejecutará `prisma/seed.js`, el cual carga los datos desde `data/hongos.json`.*

---

## Paso 2: Levantar el Backend

Una vez configurada la base de datos:

1.  Asegúrate de estar en `App/backend`.
2.  Inicia el servidor:
    ```bash
    npm start
    ```
    El servidor debería estar corriendo en `http://localhost:3000`.

---

## Paso 3: Levantar el Frontend

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
    El frontend debería estar disponible en `http://localhost:5173` (o el puerto que indique Vite).

---

## Solución de Problemas Comunes

*   **Error de conexión a la base de datos:** Asegúrate de que Docker esté corriendo y que el contenedor `db` esté activo (`docker ps`). Verifica que las credenciales en tu archivo `.env` coincidan con las de `docker-compose.yml`.
*   **Errores de Prisma:** Si modificas el archivo `schema.prisma`, recuerda ejecutar `npx prisma migrate dev` para aplicar los cambios y regenerar el cliente.
*   **Puertos ocupados:** Si el puerto 3306 (MySQL) o 3000 (Node) están ocupados, tendrás que detener los servicios que los usan o cambiar la configuración en `docker-compose.yml` y `.env`.
