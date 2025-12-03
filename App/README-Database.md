# Gestión de Base de Datos (SQLite)

Este proyecto utiliza **SQLite** como motor de base de datos. A diferencia de versiones anteriores (que usaban Docker/MariaDB), ahora la base de datos es un archivo local, lo que simplifica el desarrollo y la distribución.

**¡No necesitas Docker para correr el backend!**

## 📂 Ubicación del Archivo
El archivo de base de datos se encuentra en:
`App/backend/prisma/dev.db`

## 🛠️ Comandos Comunes

### 1. Iniciar el Backend (Desarrollo)
El backend es un servidor Node.js estándar. Solo necesitas correrlo en una terminal:

```bash
cd App/backend
npm start
```
*El servidor iniciará en http://localhost:3000 y se conectará automáticamente al archivo `dev.db`.*

### 2. Ver/Editar Datos (Interfaz Gráfica)
Prisma incluye una herramienta visual para explorar la base de datos sin necesidad de instalar programas extra:

```bash
cd App/backend
npx prisma studio
```
Esto abrirá una pestaña en tu navegador donde puedes ver y editar los registros manualmente.

### 3. Aplicar Cambios al Schema (Migración)
Si modificas el archivo `schema.prisma` (agregas tablas o columnas):

```bash
npx prisma migrate dev --name nombre_del_cambio
```

### 4. Resetear Base de Datos
Si quieres borrar todo y empezar de cero (útil si hay errores de inconsistencia durante el desarrollo):

```bash
npx prisma migrate reset
```

### 5. Poblar con Datos de Prueba (Seed)
Para cargar los datos iniciales a la base de datos SQLite usando el script de seed configurado:

```bash
npx prisma db seed
```

## ❓ Preguntas Frecuentes

**¿Por qué cambiamos a SQLite?**
Al usar SQLite, la base de datos es "portable" (es solo un archivo). Esto facilita enormemente la creación del ejecutable de escritorio (`.exe`), ya que no necesitamos pedirle al usuario final que instale un servidor de base de datos complejo.

**¿Cómo desarrollo sin Docker?**
Simplemente corre `npm start` en la carpeta `backend` y `npm run dev` en la carpeta `frontend`. Ambos procesos correrán en tu máquina local y se comunicarán entre sí.