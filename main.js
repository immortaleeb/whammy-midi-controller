'use strict';
(function() {

const electron = require('electron'),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow,
      ipcMain = electron.ipcMain,
      Timer = require('./src/Timer'),
      SequenceModel = require('./src/SequenceModel'),
      Sequencer = require('./src/Sequencer');

let mainWindow, timer, sequenceModel, sequencer;

// Forwards events emitted by a object to the renderer thread
function forwardEvent(object, event, transformFunction) {
  object.on(event, (...args) => {
    if (transformFunction) {
      args = transformFunction(...args);
      if (!args instanceof Array) args = [args];
    }

    if (mainWindow && mainWindow.webContents)
      mainWindow.webContents.send(event, ...args);
  });
}

// Passes messages on a specific message straight to an object
function registerRendererListener(object, channel) {
  ipcMain.on(channel, (event, method, ...args) => {
    console.log(method, args);
    if (object && typeof object[method] === 'function')
      object[method](...args);
    else
      console.error('Invalid object or method on channel ' + channel + ' for method ' + method);
  });
}

function registerEventListeners() {
  // Dereference the window when it's closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X the application doesn't necessarly quit when all windows are closed
  if (process.platform != 'darwin') app.quit();
});

app.on('ready', () => {
  // Create the main browser window
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // Register event listeners
  registerEventListeners();

  // DEBUG: Open the dev tools
  mainWindow.webContents.openDevTools();

  // Load the main window's url
  mainWindow.loadURL('file://' + __dirname + '/gui/index.html');

  // On succesfull load: kickstart the application
  mainWindow.webContents.on('did-finish-load', () => {
    // Create timer
    timer = new Timer(1000);
    forwardEvent(timer, 'time');
    registerRendererListener(timer, 'timer');

    // Create sequencer
    sequencer = new Sequencer(timer, [{ mode: 0 }]);
    sequencer.on('activeItem', (currentItem, index) => {
      mainWindow.webContents.send('activeStep', index);
    });

    // Create sequence model
    sequenceModel = new SequenceModel();
    sequenceModel.on('sequenceChanged', sequence => {
      let actionSequence = sequence.map(step => {
        return { execute() { console.log(step.mode + ' - ' + step.treadleLevel) } };
      });
      sequencer.setSequence(actionSequence);
    });
    registerRendererListener(sequenceModel, 'sequence');
  });
});
}());
