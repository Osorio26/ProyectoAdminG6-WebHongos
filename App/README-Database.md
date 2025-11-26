## Configuración de Base de Datos (Docker)

Para facilitar el desarrollo, utilizamos una base de datos MariaDB en un contenedor Docker. Esto permite tener un entorno aislado y fácil de replicar.

### Requisitos previos
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Comandos para gestionar la base de datos

1.  **Iniciar la base de datos:**
    Abra una terminal en la carpeta `App/backend` y ejecute:
    ```bash
    docker compose up -d
    ```
    Esto descargará la imagen de MariaDB (si no la tiene) e iniciará el servidor de base de datos en el puerto 3306.

2.  **Detener la base de datos:**
    ```bash
    docker compose stop
    ```

3.  **Crear las tablas (Migración inicial):**
    Si es la primera vez que inicia la base de datos (o si la borró), necesita crear las tablas definidas en el esquema de Prisma:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Poblar la base de datos:**
    Para insertar los datos iniciales de prueba (Sitios, Organismos, Colectas, etc.), utilice el comando estándar de Prisma:

    ```bash
    npx prisma db seed
    ```
    *(Esto ejecutará el script `prisma/seed.js` que carga los datos desde `data/hongos.json`).*

### Solución de problemas
- Si la aplicación no puede conectarse a la base de datos, asegúrate de que el contenedor esté corriendo con `docker ps`.
- Si la base de datos falla, la aplicación usará automáticamente los archivos JSON locales como respaldo.

## Integración con Base de Datos del Otro Grupo (Entrega Docker/SQL)

Si el otro equipo entrega la base de datos para ejecutarla localmente (Docker) o un archivo SQL, sigue estos pasos:

### Escenario A: Entregan un archivo SQL (`.sql`)
Si nos pasan un "dump" o respaldo de la base de datos:

1.  **Asegúrate de que tu contenedor esté corriendo:**
    ```bash
    docker compose up -d
    ```

2.  **Importar el archivo SQL:**
    Copia el archivo `.sql` a la carpeta `App/backend` y ejecuta:

    **En Bash / CMD:**
    ```bash
    docker exec -i backend-db-1 mariadb -u root -prootpassword hongos_db < archivo_del_otro_grupo.sql
    ```

    **En PowerShell:**
    ```powershell
    Get-Content archivo_del_otro_grupo.sql | docker exec -i backend-db-1 mariadb -u root -prootpassword hongos_db
    ```
    *(Nota: `backend-db-1` es el nombre del contenedor, verifica con `docker ps` si es diferente).*

### Escenario B: Entregan su propio Docker Compose
Si nos pasan una carpeta con su propio `docker-compose.yml`:

1.  **Detén nuestra base de datos actual:**
    ```bash
    docker compose down
    ```

2.  **Levanta el entorno de ellos:**
    Sigue las instrucciones que ellos provean (usualmente `docker compose up -d` en su carpeta).

### Pasos Comunes (Para ambos escenarios)

1.  **Actualizar credenciales (.env):**
    Si ellos cambiaron el nombre de la BD, usuario o contraseña, actualiza `App/backend/.env`:
    ```env
    DATABASE_URL="mysql://NUEVO_USUARIO:NUEVA_PASS@localhost:3306/NUEVA_DB"
    ```

2.  **Sincronizar Prisma con la nueva estructura:**
    Es muy probable que su base de datos tenga tablas o columnas diferentes. Para actualizar nuestro código:

    *   **Traer la nueva estructura (Introspección):**
        ```bash
        npx prisma db pull
        ```
        Esto actualizará automáticamente el archivo `schema.prisma` con las tablas reales que ellos crearon.

    *   **Generar el cliente:**
        ```bash
        npx prisma generate
        ```

    *   **Verificar errores:**
        Revisa si el código del backend (`routes/hongos.js`, etc.) tiene errores de compilación debido a cambios en los nombres de las tablas o columnas.