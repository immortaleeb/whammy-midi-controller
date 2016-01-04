'use strict';
(function() {

const electron = require('electron'),
      app = electron.app,
      dialog = electron.dialog,
      BrowserWindow = electron.BrowserWindow,
      ipcMain = electron.ipcMain,

      easymidi = require('easymidi'),

      Timer = require('./src/Timer'),
      SequenceModel = require('./src/SequenceModel'),
      Sequencer = require('./src/Sequencer'),
      WhammyController = require('./src/WhammyController');

let mainWindow, timer, sequenceModel, sequencer,
    whammyController = new WhammyController(),
    errors = 0;

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

  // Notify the ui of the different midi outputs
  ipcMain.on('request-midi-outputs', () => {
    mainWindow.webContents.send('midi-outputs', midiOutputs);
  });

  // change the midi output when requested
  ipcMain.on('midiOutput', (event, message, arg) => {
    if (message === 'setMidiOutput') {
      console.log('Changed midi output to ' + arg);
      whammyController.setMidiOutput(new easymidi.Output(arg));
    }
  });
}

// Check if there are any midi outputs
let midiOutputs = easymidi.getOutputs();
if (midiOutputs.length == 0) {
  dialog.showErrorBox('No midi outputs', 'Unable to launch the application because no valid midi outputs were found');
  app.quit();
}

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  // Don't continue if there were errors
  if (errors > 0) return;

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
