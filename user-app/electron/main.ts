import { app, BrowserWindow, ipcMain, session } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'AgeSmart - Age Verification',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Proxy configuration handler
ipcMain.handle('set-proxy', async (_event, proxyUrl: string) => {
  if (proxyUrl && proxyUrl.trim() !== '') {
    await session.defaultSession.setProxy({
      proxyRules: proxyUrl,
    });
    return { success: true, proxy: proxyUrl };
  } else {
    await session.defaultSession.setProxy({ proxyRules: '' });
    return { success: true, proxy: null };
  }
});

ipcMain.handle('get-proxy', async () => {
  const proxy = await session.defaultSession.resolveProxy('https://example.com');
  return proxy;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
