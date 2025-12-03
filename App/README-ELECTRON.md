# How to Build and Run the Executable

This project is configured to be packaged as a Windows executable using Electron.

## Prerequisites

- Node.js installed.
- Dependencies installed in `App`, `App/frontend`, and `App/backend`.

## Building the Executable

1.  Open a terminal in the `App` directory.
2.  **Important:** Install dependencies first (only needed once):

    ```bash
    npm install
    ```

3.  Run the following command to build the frontend, install backend dependencies, and package the application:

    ```bash
    /F /IM node.exe
    ```

    ```bash
    npm run dist
    ```

    This will create an installer in the `App/dist` folder (e.g., `ProyectoAdminG6 Setup 1.0.0.exe`).

    If you just want the unpacked executable (faster for testing):

    ```bash
    npm run pack
    ```

    This will create the executable in `App/dist/win-unpacked/ProyectoAdminG6.exe`.

## How it Works

- **Electron**: Wraps the application in a desktop window.
- **Frontend**: Built with Vite (`npm run build-frontend`) and served by Electron.
- **Backend**: The `backend` folder is copied into the application resources. Electron starts the backend server (`server.js`) as a background process when the app launches.

## Troubleshooting

- **Database**: The backend expects a database connection. Ensure your database is running or configured correctly. If using SQLite, the file will be created in the backend folder. If using MySQL/MariaDB (as per setup), ensure the database is accessible.
- **Ports**: The backend tries to listen on port 3000.
