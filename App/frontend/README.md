# Frontend - COCMI

Este directorio contiene la interfaz de usuario de la aplicación, construida con React y Vite.

## 🛠️ Configuración Inicial

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Iniciar en Modo Desarrollo**:
    ```bash
    npm run dev
    ```
    Esto abrirá la aplicación en tu navegador (usualmente `http://localhost:5173`). Asegúrate de tener el backend corriendo en el puerto 3000.

## 📂 Estructura del Proyecto

*   `src/`
    *   `api/`: Funciones para comunicarse con el backend (`FungusApi.js`).
    *   `components/`: Componentes reutilizables (Modales, Headers, etc.).
        *   `ConfirmationModal/`: **(Nuevo)** Modal genérico para confirmaciones y alertas.
    *   `pages/`: Vistas principales de la aplicación.
        *   `EditFungus.jsx`: Página de edición (incluye lógica de eliminación).
        *   `FungusList.jsx`: Listado principal.
    *   `App.jsx`: Configuración de rutas.

## 📦 Dependencias Clave

*   **React Router DOM**: Para la navegación entre páginas.
*   **Vite**: Empaquetador y servidor de desarrollo.
*   **react-confirm-alert**: (Nota: Recientemente reemplazado por un modal personalizado `ConfirmationModal` para mejor consistencia visual).

## 🚀 Características Recientes

*   **Eliminación de Ensayos**: Ahora es posible borrar ensayos biológicos individuales desde la vista de edición.
*   **Eliminación de Registros**: Se agregó una "Zona de Peligro" en la edición para borrar permanentemente un aislamiento completo.
*   **Modales Personalizados**: Se reemplazaron las alertas nativas (`window.confirm`) por componentes modales estilizados.
