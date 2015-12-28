"use strict";

const electron = require('electron'),
      ipcRenderer = electron.ipcRenderer;

function addMessage(event, ...args) {
  let reply = document.querySelector('#reply');
  reply.innerHTML += '<p>' + args + '</p>';
}

function registerEventListeners() {
  // Catch time events
  ipcRenderer.on('time', addMessage);

  // Start timer on click
  Array.prototype.slice.call(document.querySelectorAll('[data-timer="start"]'), 0).forEach(startTimer => {
    console.log(startTimer);
    startTimer.addEventListener('click', ipcRenderer.send.bind(ipcRenderer, 'timer', 'start'));
  });

  // Stop timer on click
  Array.prototype.slice.call(document.querySelectorAll('[data-timer="stop"]'), 0).forEach(stopTimer => {
    stopTimer.addEventListener('click', ipcRenderer.send.bind(ipcRenderer, 'timer', 'stop'));
  });
}
