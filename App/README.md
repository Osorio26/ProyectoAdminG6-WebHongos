<<<<<<< Updated upstream
# Página Web Gestión de Hongos
## Equipo:
=======
# COCMI - Sistema de Gestión de Inventario de Hongos

Este proyecto es una aplicación de escritorio desarrollada para la gestión del inventario de la colección de hongos (COCMI).

## 🛠️ Tecnologías Utilizadas

*   **Electron**: Framework para convertir la aplicación web en una aplicación de escritorio nativa.
*   **Frontend**: React + Vite.
*   **Backend**: Node.js + Express.
*   **Base de Datos**: SQLite (gestionada con Prisma ORM).
*   **Empaquetado**: electron-builder.

## 📂 Arquitectura de la Base de Datos (Importante)

A diferencia de una aplicación web tradicional, esta aplicación **no requiere instalar un servidor de base de datos externo** (como MySQL o PostgreSQL) ni usar Docker.

*   **Motor**: SQLite.
*   **Archivo de Datos**: La base de datos completa reside en un único archivo llamado `dev.db`.

### Ubicación de la Base de Datos

1.  **En Desarrollo**:
    *   El archivo se encuentra en: `App/backend/prisma/dev.db`.
2.  **En Producción (Ejecutable)**:
    *   Al instalar o ejecutar la aplicación, se crea automáticamente una carpeta llamada `database` **en el mismo directorio donde está el ejecutable (.exe)**.
    *   El archivo `dev.db` se guarda dentro de esa carpeta `database/`.
    *   **Portabilidad**: Para mover la aplicación y mantener los datos, debes copiar tanto el `.exe` como la carpeta `database`.

### Cómo ver/editar los datos manualmente
Para inspeccionar la base de datos fuera de la aplicación, recomendamos usar **DB Browser for SQLite** (gratuito). Simplemente abre el archivo `dev.db` con este programa.

## 🚀 Guía para Desarrolladores

### Prerrequisitos
*   Node.js (v18 o superior recomendado).
*   Git.

### Instalación de Dependencias

Ejecuta el siguiente comando en la carpeta raíz `App/` para instalar las dependencias del proyecto principal, frontend y backend:

```bash
cd App
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Ejecución en Modo Desarrollo

Para trabajar en el código, puedes correr el frontend y backend por separado, o usar el script de electron (aunque actualmente está optimizado para producción).

1.  **Backend**:
    ```bash
    cd App/backend
    npx prisma migrate dev  # Asegura que la DB esté sincronizada
    npm run dev             # O node server.js
    ```
2.  **Frontend**:
    ```bash
    cd App/frontend
    npm run dev
    ```

### 🔄 Cómo Modificar la Base de Datos (Schema)

Si necesitas agregar tablas, columnas o cambiar relaciones, sigue estos pasos:

1.  **Editar el Schema**:
    Abre el archivo `App/backend/prisma/schema.prisma` y realiza los cambios necesarios en los modelos.

2.  **Aplicar Cambios (Migración)**:
    Desde la terminal, en la carpeta `App/backend`, ejecuta:
    ```bash
    npx prisma migrate dev --name nombre_descriptivo_del_cambio
    ```
    *Ejemplo: `npx prisma migrate dev --name agregar_campo_imagen`*

    **¿Qué hace esto?**
    *   Actualiza el archivo local `dev.db` con la nueva estructura.
    *   Regenera el "Prisma Client" (la librería que usa el código para hablar con la BD).
    *   Crea un historial de migraciones en la carpeta `prisma/migrations`.

3.  **Reconstruir el Ejecutable**:
    Una vez que la base de datos local (`dev.db`) está actualizada, al correr `npm run dist`, esta nueva versión de la base de datos se empaquetará en el instalador.

    > **⚠️ Nota Importante para Actualizaciones**:
    > Si un usuario ya tiene instalada la aplicación, su carpeta `database/dev.db` **NO se sobrescribirá** automáticamente (para no borrar sus datos).
    > Si cambias la estructura de la base de datos, los usuarios existentes deberán:
    > *   Opción A: Borrar su carpeta `database` (perdiendo sus datos) para que la app genere la nueva versión.
    > *   Opción B: Usar herramientas manuales para migrar sus datos (avanzado).
    > *   *Recomendación*: Para este proyecto académico, asuman que un cambio de esquema requiere una reinstalación limpia (Opción A).

### Generación del Ejecutable (Build)

Para crear el instalador de Windows (`.exe`), usa el siguiente comando desde la carpeta `App/`:

```bash
npm run dist
```

Este comando realizará lo siguiente:
1.  Construirá el Frontend (Vite build).
2.  Instalará dependencias del Backend.
3.  Empaquetará todo usando Electron Builder.

**Salida**:
*   Los archivos generados estarán en la carpeta `App/dist/`.
*   **Instalador**: `COCMI_Inventario_Hongos_Setup_1.0.0.exe`.
*   **Versión Descomprimida**: Carpeta `win-unpacked`.

## ⚠️ Notas Importantes sobre el Código

*   **`electron/main.js`**: Es el punto de entrada. Se encarga de iniciar el proceso de Node.js del backend (`server.js`) como un subproceso y de gestionar la ventana de la aplicación. También contiene la lógica para copiar la base de datos `dev.db` a la carpeta del usuario si no existe.
*   **`backend/prisma/schema.prisma`**: Define la estructura de la base de datos. Si haces cambios aquí, debes ejecutar `npx prisma migrate dev` para aplicarlos.
*   **`frontend/vite.config.js`**: Configurado con `base: './'` para asegurar que las rutas funcionen correctamente dentro de Electron (sistema de archivos local).

## Equipo de Desarrollo
>>>>>>> Stashed changes
- Alejandro Solórzano
- Antony Picado
- Isaac Vargas
- Rachit Díaz
- Kenneth Osorio
