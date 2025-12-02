import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In development, load Vite server. In production, load built index.html
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, the frontend build is expected to be in ../frontend/dist
    // When packaged, __dirname is inside app.asar/electron
    // We need to go up to find frontend/dist
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

function startBackend() {
  let scriptPath;
  const userDataPath = app.getPath('userData');

  if (app.isPackaged) {
    // In production, backend is copied to resources/backend
    scriptPath = path.join(process.resourcesPath, 'backend', 'server.js');
  } else {
    // In development
    scriptPath = path.join(__dirname, '../backend/server.js');
  }

  console.log('Starting backend from:', scriptPath);

  backendProcess = fork(scriptPath, [], {
    env: {
      ...process.env,
      PORT: 3000,
      DATABASE_URL: process.env.DATABASE_URL, // Ensure DB URL is passed if needed, or rely on .env in backend folder
    },
    stdio: 'inherit'
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
