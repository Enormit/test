const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable GPU Acceleration to prevent crash on some Windows machines
app.disableHardwareAcceleration();

// Start the backend Express server
require('./backend/server.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 1250,
        height: 850,
        title: 'HH3D Multi-Auto Manager',
        autoHideMenuBar: true, // Hide the standard menu bar
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load the local dashboard URL hosted by Express server
    win.loadURL('http://localhost:3000');

    // Handle window closed
    win.on('closed', () => {
        // App quit will terminate the main process, stopping Express and all background workers
        app.quit();
    });
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
