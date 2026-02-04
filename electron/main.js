import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { app, BrowserWindow, screen } = require('electron');
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const windowWidth = 400;
    const windowHeight = 600;
    const x = width - windowWidth - 20; // 20px padding from right
    const y = 20; // 20px padding from top

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: x,
        y: y,
        frame: false, // Frameless for widget look
        transparent: true, // Only works on some platforms, good for rounded corners
        resizable: false,
        skipTaskbar: true, // Hide from taskbar
        type: 'toolbar', // Helps with window manager behavior
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, '../public/vite.svg')
    });

    // Development: Load from Vite server
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        // Production: Load from dist
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Optional: Keep on top for widget feel
    // win.setAlwaysOnTop(true, 'level');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
