
const { app, BrowserWindow, ipcMain } = require('electron');
const expressApp = express();
const port = 3000;

const fs = require('fs');
const path = require('path');
const express = require('express');

let remoteWindow;
let invisibleWindow;

app.whenReady().then(() => {

    remoteWindow = new BrowserWindow({
        width: 200,
        height: 400,
        x: 3065,
        y: -664,
        webPreferences: {
            preload: path.join(__dirname, 'preloads/remoteWindowPreload.js'),
            nodeIntegration: true, // Enables usage of Electron modules in renderer
            contextIsolation: false, // Disables context isolation for simplicity
        },
    });

    remoteWindow.loadURL('file://' + __dirname + '/remote.html');
    remoteWindow.on('closed', () => {
        console.log('Remote window closed');
        app.quit();
    });
    remoteWindow.on('move', () => {
        const [x, y] = remoteWindow.getPosition();
        console.log(`Remote window moved to: x=${x}, y=${y}`);
    });

    remoteWindow.on('resize', () => {
        const [width, height] = remoteWindow.getSize();
        console.log(`Remote window resized to: width=${width}, height=${height}`);
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('openSubscriptionsFromMain', (event, arg) => {
    invisibleWindow = new BrowserWindow({
        width: 900,
        height: 1017,
        x: 4025,
        y: -664,
        webPreferences: {
            preload: path.join(__dirname, 'preloads/invisibleWindowPreload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    invisibleWindow.webContents.openDevTools();
    invisibleWindow.loadURL('https://www.youtube.com/feed/subscriptions');

});

ipcMain.on('getLatestVideos', (event, arg) => {
    console.log('Alerting invisible window');
    invisibleWindow.webContents.send('getLatestVideos');
});



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});