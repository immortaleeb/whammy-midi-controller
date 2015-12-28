'use strict';

const electron = require('electron'),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow;

let mainWindow;

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X the application doesn't necessarly quit when all windows are closed
  if (process.platform != 'darwin') app.quit();
});

app.on('ready', () => {
  // Create the main browser window
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Dereference the window when it's closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
