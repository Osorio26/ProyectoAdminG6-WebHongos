import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function logToFile(message) {
  const logPath = path.join(app.getPath('userData'), 'app.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
}

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
  let dbUrl;
  let categoriesPath;

  if (app.isPackaged) {
    // In production, backend is copied to resources/backend
    scriptPath = path.join(process.resourcesPath, 'backend', 'server.js');

    // Define DB location: Next to the executable in a 'database' folder
    const exeDir = path.dirname(app.getPath('exe'));
    const dbDir = path.join(exeDir, 'database');
    const dbName = 'dev.db';
    const dbDest = path.join(dbDir, dbName);

    // Ensure database folder exists
    if (!fs.existsSync(dbDir)) {
      try {
        fs.mkdirSync(dbDir, { recursive: true });
      } catch (err) {
        logToFile(`Failed to create database directory: ${err}`);
      }
    }

    // Copy DB from resources (seed) if it doesn't exist in the destination
    const dbSource = path.join(process.resourcesPath, 'backend', 'prisma', dbName);
    
    if (!fs.existsSync(dbDest)) {
      try {
        logToFile(`Copying database from ${dbSource} to ${dbDest}`);
        fs.copyFileSync(dbSource, dbDest);
      } catch (err) {
        logToFile(`Failed to copy database: ${err}`);
        console.error('Failed to copy database:', err);
      }
    }
    
    dbUrl = `file:${dbDest}`;

    // Define Categories location: Next to the executable in a 'data' folder
    const dataDir = path.join(exeDir, 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        logToFile(`Failed to create data directory: ${err}`);
      }
    }

    categoriesPath = path.join(dataDir, 'categories.json');
    const categoriesSource = path.join(process.resourcesPath, 'backend', 'data', 'categories.json');

    if (!fs.existsSync(categoriesPath)) {
      try {
        if (fs.existsSync(categoriesSource)) {
          fs.copyFileSync(categoriesSource, categoriesPath);
          logToFile(`Copied categories.json to ${categoriesPath}`);
        } else {
          fs.writeFileSync(categoriesPath, '[]');
          logToFile(`Created empty categories.json at ${categoriesPath}`);
        }
      } catch (err) {
        logToFile(`Failed to setup categories.json: ${err}`);
      }
    }

  } else {
    // In development
    scriptPath = path.join(__dirname, '../backend/server.js');
    dbUrl = `file:${path.join(__dirname, '../backend/prisma/dev.db')}`;
    categoriesPath = path.join(__dirname, '../backend/data/categories.json');
  }

  console.log('Starting backend from:', scriptPath);
  console.log('Using DATABASE_URL:', dbUrl);
  console.log('Using CATEGORIES_FILE_PATH:', categoriesPath);
  logToFile(`Starting backend from: ${scriptPath}`);
  logToFile(`Using DATABASE_URL: ${dbUrl}`);
  logToFile(`Using CATEGORIES_FILE_PATH: ${categoriesPath}`);

  backendProcess = fork(scriptPath, [], {
    env: {
      ...process.env,
      PORT: 3000,
      DATABASE_URL: dbUrl, 
      CATEGORIES_FILE_PATH: categoriesPath,
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc']
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
    logToFile(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
    logToFile(`Backend Error: ${data}`);
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
